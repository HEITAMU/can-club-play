import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import vm from 'node:vm';
import {HOME_ART,HOME_UI} from '../cocos/assets/scripts/HomeScene.js';
import {getTileTheme,buildThemeArtwork} from '../cocos/assets/scripts/TileThemes.js';

// Exercise the real component's asynchronous loading and ownership methods.
// cc rendering is deliberately replaced; these are not Cocos GPU or device tests.
const original=readFileSync(new URL('../cocos/assets/scripts/Game.ts',import.meta.url),'utf8');
const executable=stripTypeScriptTypes(original
  .replace(/^import\s*\{[\s\S]*?\}\s*from\s*['"][^'"]+['"];?\s*$/gm,'')
  .replace(/^@ccclass\('FourfoldGame'\)\s*$/m,'')
  .replace('export class FourfoldGame','class FourfoldGame'),{mode:'transform'});
const reference=JSON.parse(readFileSync(new URL('../cocos/assets/resources/art/referenceLayout.json',import.meta.url),'utf8'));
const requiredFrames=['goldButton','creamButton','lavenderButton','stepsCard','timeCard','rotateKnob','settingsButton','backButton'];
const flush=()=>new Promise(resolve=>setImmediate(resolve));

function fixture(){
  const requests=[],timers=new Map(),textures=[],frames=[],events=[];
  let timerId=0,liveImages=0,peakImages=0;
  class ImageAsset{
    constructor(width=2048,height=2048){this.width=width;this.height=height;this.refCount=0;this.adds=0;this.releases=0;}
    addRef(){this.adds++;this.refCount++;return this;}
    decRef(){this.releases++;this.refCount--;events.push('image:release');return this;}
  }
  class Texture2D{
    constructor(){textures.push(this);events.push('texture:create');}
    set image(value){this.source=value;this.width=value.width;this.height=value.height;}
    destroy(){this.destroyed=true;events.push('texture:destroy');}
  }
  class SpriteFrame{
    constructor(){frames.push(this);}
    destroy(){this.destroyed=true;}
  }
  const sandbox={
    Component:class{},ImageAsset,JsonAsset:class{},Texture2D,SpriteFrame,
    Rect:class{},Size:class{},HOME_ART,HOME_UI,getTileTheme,buildThemeArtwork,GOAL:'123456789',
    _decorator:{ccclass:()=>{}},screen:{off(){}},
    console:{warn(){},error(){}},
    setTimeout(fn,delay){const id=++timerId;timers.set(id,{fn,delay});return id;},
    clearTimeout(id){timers.delete(id);},
    resources:{load(path,type,callback){
      const request={path,type,callback,done:false};requests.push(request);
      if(type===ImageAsset){liveImages++;peakImages=Math.max(peakImages,liveImages);}
    }},
  };
  const Game=vm.runInNewContext(executable+'\nFourfoldGame;',sandbox),game=new Game();
  game.draw=()=>events.push(game.loadError?'view:error':game.themeError?'view:theme-error':'view:draw');
  game.cancelTurnMotion=()=>{};game.hideBanner=()=>{};
  game.installReferenceFrames=()=>{};game.validateSceneArtwork=()=>{};
  game.startGame=()=>events.push('game:start');
  function complete(request,error=null,asset){
    if(!request.done){request.done=true;if(request.type===ImageAsset)liveImages--;}
    request.callback(error,asset);
  }
  function metadata(){
    for(const request of requests.filter(r=>!r.done&&r.type!==ImageAsset)){
      const json=request.path==='art/assetManifest'?{atlas:{frames:Object.fromEntries(requiredFrames.map(name=>[name,{x:0,y:0,w:10,h:10}]))}}:{};
      complete(request,null,{json});
    }
  }
  async function finishImages(){
    for(let i=0;i<12;i++){
      const pending=requests.find(r=>!r.done&&r.type===ImageAsset);
      if(!pending)break;
      complete(pending,null,new ImageAsset());await flush();
    }
  }
  function expire(){
    for(const [id,{fn,delay}] of [...timers]){assert.equal(delay,25000);timers.delete(id);fn();}
  }
  return {game,ImageAsset,requests,timers,textures,frames,events,complete,metadata,finishImages,expire,
    get peakImages(){return peakImages;}};
}

test('native resource loads time out once and ignore a late engine callback',async()=>{
  const f=fixture(),promise=f.game.loadResource('art/slow',f.ImageAsset);
  const rejected=assert.rejects(promise,/timed out/);
  assert.equal(f.timers.size,1);assert.equal(f.game.pendingResourceLoads.size,1);
  f.expire();await rejected;
  const late=new f.ImageAsset();f.complete(f.requests[0],null,late);await flush();
  assert.equal(f.timers.size,0);assert.equal(f.game.pendingResourceLoads.size,0);
  assert.equal(late.adds,0);assert.equal(f.textures.length,0);
});

test('successful resource loads clear their timer and cannot settle a second time',async()=>{
  const f=fixture(),asset=new f.ImageAsset(),promise=f.game.loadResource('art/ready',f.ImageAsset);
  f.complete(f.requests[0],null,asset);
  assert.equal(await promise,asset);assert.equal(f.timers.size,0);assert.equal(f.game.pendingResourceLoads.size,0);
  f.complete(f.requests[0],new Error('duplicate late error'));await flush();
  assert.equal(asset.adds,0);
});

test('native startup loads eight images with at most three active image requests',async()=>{
  const f=fixture(),loading=f.game.loadArt();
  assert.equal(f.requests.length,3,'metadata is loaded first');
  f.metadata();await flush();
  assert.equal(f.requests.filter(r=>r.type===f.ImageAsset).length,3);
  assert.equal(f.events.includes('game:start'),false);
  await f.finishImages();await loading;
  assert.equal(f.requests.filter(r=>r.type===f.ImageAsset).length,8);
  assert.equal(f.peakImages,3);assert.equal(f.game.loadProgress,8);
  assert.equal(f.game.assetsReady,true);assert.equal(f.game.loading,false);
  assert.equal(f.events.filter(e=>e==='game:start').length,1);
  assert.equal(f.textures.length,8);assert.equal(f.game.images.length,8);
  assert.equal(f.timers.size,0);assert.equal(f.game.pendingResourceLoads.size,0);
});

test('a failed startup releases partial art and stale workers cannot write into a retry',async()=>{
  const f=fixture(),first=f.game.loadArt();f.metadata();await flush();
  const firstImage=f.requests.find(r=>r.type===f.ImageAsset),retained=new f.ImageAsset();
  f.complete(firstImage,null,retained);await flush();
  const failed=f.requests.find(r=>!r.done&&r.type===f.ImageAsset);
  f.complete(failed,new Error('missing image'));await first;
  assert.equal(f.game.assetsReady,false);assert.equal(f.game.loading,false);
  assert.equal(f.game.images.length,0);assert.equal(retained.refCount,0);
  assert.ok(f.textures.every(texture=>texture.destroyed));
  const oldPending=f.requests.filter(r=>!r.done),created=f.textures.length;
  const retry=f.game.loadArt();
  for(const request of oldPending){const late=new f.ImageAsset();f.complete(request,null,late);assert.equal(late.adds,0);}
  await flush();
  assert.equal(f.textures.length,created,'old workers cannot create a retry texture');
  assert.equal(f.game.loadProgress,0);
  f.metadata();await flush();await f.finishImages();await retry;
  assert.equal(f.game.assetsReady,true);assert.equal(f.game.loadError,'');
  assert.equal(f.game.images.length,8);assert.equal(f.game.loadProgress,8);
  assert.equal(f.textures.filter(texture=>!texture.destroyed).length,8);
  assert.equal(f.timers.size,0);
});

test('a timed-out theme can retry without accepting the old image or changing its round',async()=>{
  const f=fixture();f.game.assetsReady=true;f.game.reference=reference;
  f.game.mode='daily';f.game.key='2026-11-21';f.game.roundSerial=11;
  const first=f.game.prepareTheme();f.expire();await first;
  assert.equal(f.game.themeLoading,false);assert.notEqual(f.game.themeError,'');
  const oldRequest=f.requests[0],retry=f.game.prepareTheme(),late=new f.ImageAsset(1302,1208);
  f.complete(oldRequest,null,late);await flush();
  assert.equal(late.adds,0);assert.equal(f.game.activeTheme,null);
  const current=new f.ImageAsset(1302,1208);f.complete(f.requests[1],null,current);await retry;
  assert.equal(f.game.activeTheme,getTileTheme('daily','2026-11-21'));
  assert.equal(f.game.roundSerial,11);assert.equal(f.game.themeError,'');
  assert.equal(current.refCount,1);assert.equal(Object.keys(f.game.frames).length,10);
  assert.equal(f.game.themeArtwork.resource,f.game.activeTheme.resource);
  assert.equal(f.timers.size,0);
});

test('destroy cancels pending work and detaches the owned canvas before releasing textures',async()=>{
  const f=fixture(),loading=f.game.loadArt();f.metadata();await flush();
  const retained=new f.ImageAsset();f.complete(f.requests.find(r=>r.type===f.ImageAsset),null,retained);await flush();
  const canvas={isValid:true,active:true,removeFromParent(){f.events.push('canvas:remove');},destroy(){f.events.push('canvas:destroy');}};
  f.game.canvasNode=canvas;const pending=f.requests.filter(r=>!r.done),created=f.textures.length;
  f.game.onDestroy();await loading;
  assert.equal(canvas.active,false);assert.equal(f.game.pendingResourceLoads.size,0);assert.equal(f.timers.size,0);
  assert.ok(f.events.indexOf('canvas:remove')<f.events.indexOf('texture:destroy'));
  assert.equal(retained.refCount,0);assert.equal(f.game.images.length,0);
  const eventCount=f.events.length;
  for(const request of pending)f.complete(request,null,new f.ImageAsset());
  await flush();await f.game.loadArt();
  assert.equal(f.textures.length,created);assert.equal(f.events.length,eventCount);
  await assert.rejects(f.game.loadResource('art/after-destroy',f.ImageAsset),/cancelled/);
});
