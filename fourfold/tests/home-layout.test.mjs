import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {homeLayout} from '../layout.mjs';
import {HOME_ART,HOME_UI} from '../cocos/assets/scripts/HomeScene.js';
import {nativeFixture,TEST_DAY} from './helpers/runtime-fixtures.mjs';

// Exercise the production shared layout and native adapter. These checks do
// not substitute for browser/Cocos rendering or actual device font metrics.
const plain=value=>JSON.parse(JSON.stringify(value));
const near=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-8,`${message}: ${a} != ${b}`);
const inside=(inner,outer,message)=>{
  for(const value of Object.values(inner))assert(Number.isFinite(value),message);
  assert(inner.w>0&&inner.h>0&&inner.x>=outer.x-1e-8&&inner.y>=outer.y-1e-8&&inner.x+inner.w<=outer.x+outer.w+1e-8&&inner.y+inner.h<=outer.y+outer.h+1e-8,message);
};
const overlap=(a,b)=>Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>1e-8&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>1e-8;
const keys=['story','daily','rank'];

test('homepage retains a full portrait scene with three separate entries inside it',()=>{
  let scrolling=0,centered=0,minHit=0;
  for(const width of [200,320,360,390,430,768])for(const height of [400,568,667,844,1100,1800]){
    const layout=homeLayout(width,height),hero=layout.hero;
    near(hero.w,width,'scene stays full width');
    near(hero.h/hero.w,HOME_ART.height/HOME_ART.width,'scene preserves portrait ratio');
    near(layout.image.w,hero.w,'image width');near(layout.image.h,hero.h,'image height');
    near(layout.contentH,Math.max(height,hero.h),'content height');
    if(layout.compact){scrolling++;near(hero.y,0,'overflow starts at page top');}
    else{centered++;near(hero.y,(height-hero.h)/2,'tall screens center the complete scene');}
    const localHero={x:0,y:0,w:hero.w,h:hero.h};
    inside(layout.title,localHero,'title remains within the sky');
    inside(layout.settings,hero,'settings remain within the scene');
    for(let i=0;i<keys.length;i++){
      const hit=layout.buttons[i],art=layout.buttonArtwork[i],label=layout.buttonLabels[i],[,,sw,sh]=HOME_UI.frames[keys[i]];
      inside(hit,hero,`${keys[i]} entry stays inside the scene`);
      inside(art,{x:0,y:0,w:hit.w,h:hit.h},`${keys[i]} art remains inside its hit region`);
      inside(label,art,`${keys[i]} caption remains within its painted card`);
      near(art.w/art.h,sw/sh,`${keys[i]} art preserves its own aspect ratio`);
      assert(hit.w>=44&&hit.h>=44,`${keys[i]} retains a 44px target`);
      if(art.h<44)minHit++;
      assert(layout.buttonFontSizes[i]>0);
    }
    assert(layout.buttons[0].w>layout.buttons[1].w,'one primary entry is wider than both auxiliary cards');
    near(layout.buttons[1].y,layout.buttons[2].y,'auxiliary cards share one row');
    const controls=[layout.settings,...layout.buttons];
    for(let a=0;a<controls.length;a++)for(let b=a+1;b<controls.length;b++)assert.equal(overlap(controls[a],controls[b]),false,'simultaneous controls stay separate');
  }
  assert(scrolling>0&&centered>0&&minHit>0,'exercise scrolling, centering, and expanded hit regions');
});

test('native homepage scales hit regions, artwork, captions and fonts with the shared web geometry',()=>{
  const {game}=nativeFixture();
  for(const width of [320,360,390,430,768])for(const height of [400,568,844,1800]){
    const web=homeLayout(width,height);game.windowScale=1;
    assert.deepEqual(plain(game.homeGeometry(width,height)),web,'unscaled native adapter matches the shared browser layout');
    const scale=390/width;game.windowScale=scale;
    const native=plain(game.homeGeometry(390,height*scale));
    assert.equal(native.compact,web.compact);
    for(const name of ['contentH','textScale'])near(native[name]/scale,web[name],`scaled ${name}`);
    for(const name of ['hero','image','title','settings'])for(const axis of ['x','y','w','h'])near(native[name][axis]/scale,web[name][axis],`scaled ${name}.${axis}`);
    for(const name of ['buttons','buttonArtwork','buttonLabels'])for(let i=0;i<3;i++)for(const axis of ['x','y','w','h'])near(native[name][i][axis]/scale,web[name][i][axis],`scaled ${name}[${i}].${axis}`);
    for(let i=0;i<3;i++)near(native.buttonFontSizes[i]/scale,web.buttonFontSizes[i],`scaled caption ${i}`);
  }
});

test('native homepage paints each card and live caption into the shared regions and preserves routes',()=>{
  for(const [key,expected] of [['story','13'],['daily',TEST_DAY],['rank','rank']]){
    const fixture=nativeFixture({preferences:{unlocked:13}}),{game}=fixture;
    game.inHome=true;game.windowScale=390/320;game.width=390;game.height=568*game.windowScale;
    game.safeTop=0;game.safeBottom=0;game.pageContent=()=>game.root;
    const originalText=game.txt;game.txt=(text,x,y,w,h,size,...rest)=>Object.assign(originalText(text,x,y,w,h,size,...rest),{x,y,w,h,size});
    game.drawHome();
    const layout=game.homeGeometry(game.width,game.height);
    for(let i=0;i<keys.length;i++){
      const entry=fixture.groups.find(group=>group.name===`Home ${keys[i]} entry`);
      assert(entry,`${keys[i]} has an independent hit node`);
      for(const axis of ['x','y','w','h'])near(entry[axis],layout.buttons[i][axis],`${keys[i]} rendered hit ${axis}`);
      const art=fixture.art.find(art=>art.node.parent===entry.content),label=fixture.texts.find(label=>label.node.parent===entry.content);
      for(const axis of ['x','y','w','h']){
        near(art[axis],layout.buttonArtwork[i][axis],`${keys[i]} rendered art ${axis}`);
        near(label[axis],layout.buttonLabels[i][axis],`${keys[i]} rendered label ${axis}`);
      }
      near(label.size,layout.buttonFontSizes[i],`${keys[i]} rendered font size`);
      assert.equal(label.enableWrapText,false);
      assert.equal(label.string,['挑战第13关','每日挑战','好友荣誉榜'][i]);
    }
    const chosen=fixture.groups.find(group=>group.name===`Home ${key} entry`);
    chosen.node.emit(fixture.NativeNode.EventType.TOUCH_END);
    if(key==='rank')assert.equal(game.modal,expected);
    else{assert.equal(game.mode,key);assert.equal(game.key,expected);assert.equal(game.inHome,false);}
  }
});

test('production native artwork validation accepts the actual homepage PNGs and manifest',()=>{
  const pngSize=resource=>{
    const bytes=readFileSync(new URL(`../cocos/assets/resources/art/${resource}.png`,import.meta.url));
    return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
  };
  const {game}=nativeFixture();
  game.manifest=JSON.parse(readFileSync(new URL('../cocos/assets/resources/art/assetManifest.json',import.meta.url),'utf8'));
  game.textures={home:pngSize(HOME_ART.resource),homeUI:pngSize(HOME_UI.resource),rankScene:pngSize('rank-scene'),resultPanel:pngSize('result-panel')};
  assert.doesNotThrow(()=>game.validateSceneArtwork());
  for(const key of keys){
    const [x,y,w,h]=HOME_UI.frames[key],[lx,ly,lw,lh]=HOME_UI.labelRects[key];
    inside({x,y,w,h},{x:0,y:0,w:HOME_UI.width,h:HOME_UI.height},`${key} atlas frame`);
    inside({x:lx,y:ly,w:lw,h:lh},{x:0,y:0,w,h},`${key} caption region`);
  }
});
