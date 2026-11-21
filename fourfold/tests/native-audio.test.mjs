import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nativeFixture,flush} from './helpers/runtime-fixtures.mjs';

// Run production loading, touch handlers, spin and teardown. These substitutes
// observe ownership/playback commands, not audible quality or device autoplay.
function audioFixture(options={}){
  const requests=[],timers=new Map(),channels=[];let nextTimer=0;
  class AudioClip{
    constructor(path){this.path=path;this.refs=0;}
    addRef(){this.refs++;return this;}decRef(){this.refs--;return this;}
  }
  class AudioSource{
    static EventType={STARTED:'audio-started',ENDED:'audio-ended'};
    constructor(){this.isValid=true;this.playing=false;this.plays=0;this.stops=0;channels.push(this);}
    play(){if(this.failPlay)throw new Error('audio unavailable');this.plays++;this.playing=true;this.node.emit(AudioSource.EventType.STARTED);}
    stop(){this.stops++;this.playing=false;}
  }
  class UITransform{setContentSize(w,h){this.width=w;this.height=h;}}
  class UIOpacity{constructor(){this.opacity=255;}}
  class Vec3{constructor(x=0,y=0,z=1){this.x=x;this.y=y;this.z=z;}clone(){return new Vec3(this.x,this.y,this.z);}}
  const cc={AudioClip,AudioSource,UITransform,UIOpacity,Vec3,screen:{off(){}},Tween:{stopAllByTarget(){}},
    tween(){const chain={to(){return chain;},start(){return chain;}};return chain;},
    setTimeout(fn,delay){const id=++nextTimer;timers.set(id,{fn,delay});return id;},clearTimeout:id=>timers.delete(id),
    resources:{load(path,type,callback){requests.push({path,type,callback,done:false});}},
  };
  const f=nativeFixture({...options,cc}),g=f.game;
  g.canvasNode=new f.NativeNode('Canvas');g.canvasNode.addChild(g.root);
  g.bindButton=f.Game.prototype.bindButton.bind(g);
  const decorate=(node,x,y,w,h)=>{
    node.position=new Vec3(x,y,0);node.scale=new Vec3(1,1,1);node.addComponent(UITransform).setContentSize(w,h);
    node.setPosition=(x,y,z=0)=>{node.position=typeof x==='object'?x.clone():new Vec3(x,y,z);};
    node.setScale=(x,y,z=1)=>{node.scale=typeof x==='object'?x.clone():new Vec3(x,y,z);};
    return node;
  };
  const group=g.group,art=g.art;
  g.group=(name,x,y,w,h,...rest)=>{const value=group(name,x,y,w,h,...rest);decorate(value.node,x+w/2,-y-h/2,w,h);return value;};
  g.art=(name,x,y,w,h,...rest)=>decorate(art(name,x,y,w,h,...rest),x+w/2,-y-h/2,w,h);
  g.createNode=(name,x,y,w,h,parent=g.root)=>{const node=decorate(new f.NativeNode(name),x+w/2,-y-h/2,w,h);parent.addChild(node);return node;};
  function finish(request,error=null){const clip=error?null:new AudioClip(request.path);request.done=true;request.callback(error,clip);return clip;}
  async function ready(){const pending=g.prepareAudio();for(const request of requests.filter(request=>!request.done))finish(request);await pending;}
  function board(){g.startGame('story','1');g.drawReferenceBoard(0,0,1);return g.knobNodes[0];}
  const tap=node=>{node.emit('start');node.emit('end');};
  return {...f,AudioClip,AudioSource,channels,requests,timers,finish,ready,board,tap};
}

test('native optional clips load independently and never replay a click missed during loading',async()=>{
  const f=audioFixture(),g=f.game,loading=g.prepareAudio();
  assert.deepEqual(f.requests.map(request=>request.path),['audio/ui-stone-press-v2','audio/stone-turn-v2']);
  assert(f.channels.every(source=>source.playOnAwake===false&&source.loop===false));
  assert.equal(g.assetsReady,true);assert.equal(g.loading,false);
  const button=new f.NativeNode('Button');let actions=0;g.bindButton(button,()=>{actions++;});
  f.tap(button);assert.equal(actions,1);assert.equal(g.audioSources.ui.plays,0);
  const clip=f.finish(f.requests[0]);f.finish(f.requests[1],new Error('optional turn clip missing'));await loading;
  assert.equal(g.audioSources.ui.plays,0,'the old touch is not queued for replay');
  assert.equal(clip.refs,1);assert.equal(g.audioClips.turn,undefined);assert.equal(g.loadError,'');
  assert.equal(f.timers.size,0);assert.equal(g.pendingResourceLoads.size,0);
  f.tap(button);assert.equal(actions,2);assert.equal(g.audioSources.ui.plays,1);
  g.audioSources.ui.failPlay=true;assert.doesNotThrow(()=>f.tap(button));assert.equal(actions,3);
  const retry=g.prepareAudio();assert.equal(f.requests.length,3,'retry only the missing clip');f.finish(f.requests[2]);await retry;
  assert.equal(g.audioSources.turn.plays,0);assert.equal(g.audioClips.turn.refs,1);
});

test('native valid touches retry missing clips once without queuing the missed sound',async()=>{
  const f=audioFixture(),g=f.game,loading=g.prepareAudio();
  f.finish(f.requests[0],new Error('temporary network failure'));f.finish(f.requests[1]);await loading;
  const button=new f.NativeNode('Retry button');let actions=0;g.bindButton(button,()=>{actions++;});
  g.soundEnabled=false;f.tap(button);assert.equal(f.requests.length,2,'muted touches do not retry audio');
  g.soundEnabled=true;g.audioHidden=true;f.tap(button);assert.equal(f.requests.length,2,'hidden touches do not retry audio');
  g.audioHidden=false;
  const stale=new f.NativeNode('Stale button');g.bindButton(stale,()=>false);f.tap(stale);
  assert.equal(f.requests.length,2,'rejected actions do not retry audio');
  f.tap(button);f.tap(button);
  assert.equal(actions,4);assert.equal(f.requests.length,3,'in-flight recovery is deduplicated');
  assert.equal(f.requests[2].path,'audio/ui-stone-press-v2');assert.equal(g.audioSources.ui.plays,0);
  f.finish(f.requests[2]);await flush();
  assert.equal(g.audioSources.ui.plays,0,'finishing recovery cannot replay either missed tap');
  assert.equal(g.audioClips.ui.refs,1);assert.equal(g.audioLoading,false);
  f.tap(button);assert.equal(g.audioSources.ui.plays,1);assert.equal(f.requests.length,3);
});

test('native UI sounds fire once after accepted touches and ignore busy, cancelled or stale actions',async()=>{
  const f=audioFixture(),g=f.game;await f.ready();let actions=0;
  const button=new f.NativeNode('Button');g.bindButton(button,()=>{actions++;});
  button.emit('end');assert.equal(actions,0);
  f.tap(button);button.emit('end');assert.equal(actions,1);assert.equal(g.audioSources.ui.plays,1);
  button.emit('start');button.emit('cancel');button.emit('end');assert.equal(actions,1);
  g.busy=true;f.tap(button);g.busy=false;assert.equal(actions,1);
  button.emit('start');button.activeInHierarchy=false;button.emit('end');assert.equal(actions,1);
  const stale=new f.NativeNode('Stale');g.bindButton(stale,()=>false);f.tap(stale);assert.equal(g.audioSources.ui.plays,1);
  const daily=g.referenceControl('Daily direction',[0,0,120,48],0,0,1,()=>{actions++;});
  f.tap(daily);assert.equal(actions,2);assert.equal(g.audioSources.ui.plays,2,'daily reference controls use the same sound policy');
});

test('native rotation starts one stone movement sound and never layers a generic button click',async()=>{
  const f=audioFixture(),g=f.game;await f.ready();const knob=f.board();
  f.tap(knob);assert(g.turnMotion);assert.equal(g.audioSources.turn.plays,1);assert.equal(g.audioSources.ui.plays,0);
  f.tap(knob);assert.equal(g.audioSources.turn.plays,1,'rapid clicks do not queue another turn sound');
  g.update(.4);assert.equal(g.audioSources.turn.playing,true);assert.equal(g.moves,0);
  g.update(.8);assert.equal(g.turnMotion,null);assert.equal(g.audioSources.turn.playing,false);assert.equal(g.moves,1);
  assert.equal(g.audioSources.turn.plays,1);assert.equal(g.audioSources.ui.plays,0);
  f.board();g.applyHint();g.drawReferenceBoard(0,0,1);f.tap(g.knobNodes[0]);assert.equal(g.turnMotion,null);
  assert.equal(g.audioSources.turn.plays,1,'a hint awaiting direction blocks turn audio as well as movement');
  assert.equal(g.audioSources.ui.plays,0,'a rejected rotation also remains silent');
});

test('native cancellation, navigation, reset, background and disable stop movement without resuming it',async()=>{
  for(const leave of ['cancel','home','restart','hide','disable','destroy']){
    const f=audioFixture(),g=f.game;await f.ready();f.tap(f.board());
    const turn=g.audioSources.turn,ui=g.audioSources.ui;assert.equal(turn.playing,true,leave);
    if(leave==='cancel')g.cancelTurnMotion();
    if(leave==='home')g.goHome();
    if(leave==='restart')g.startGame('story','1');
    if(leave==='hide')g.onAppHide();
    if(leave==='disable')g.onDisable();
    if(leave==='destroy')g.onDestroy();
    assert.equal(turn.playing,false,leave);assert.equal(g.turnMotion,null,leave);assert.equal(g.moves,0,leave);
    g.onAppShow();g.onEnable();assert.equal(turn.plays,1,`${leave} must not resume stale motion`);
    g.playAudio('turn');assert.equal(turn.plays,1,`${leave} has no live turn to voice`);
    if(leave!=='destroy'){
      turn.playing=true;turn.node.emit(f.AudioSource.EventType.STARTED);assert.equal(turn.playing,false,'late platform starts are cancelled');
      g.onAppHide();g.playAudio('ui');assert.equal(ui.playing,false,'background clicks stay silent');
      g.onAppShow();ui.playing=true;ui.node.emit(f.AudioSource.EventType.STARTED);assert.equal(ui.playing,false,'a cancelled UI sound cannot revive after foregrounding');
    }
  }
});

test('native sound setting shares the persisted sound key and muted state immediately stops both channels',async()=>{
  for(const useWx of [true,false]){
    const f=audioFixture({useWx}),g=f.game;await f.ready();assert.equal(g.soundEnabled,true);
    f.tap(f.board());const turn=g.audioSources.turn;g.playAudio('ui');const ui=g.audioSources.ui;
    g.modal='settings';assert.equal(g.toggleSound(),true);assert.equal(g.soundEnabled,false);
    assert.equal(turn.playing,false);assert.equal(ui.playing,false);assert.equal(f.storage.values.get('fourfold:sound'),'false');
    const reopened=nativeFixture({storage:f.storage,useWx});assert.equal(reopened.game.soundEnabled,false);
    const plays=ui.plays;g.playAudio('ui');assert.equal(ui.plays,plays);
    assert.equal(g.toggleSound(),true);assert.equal(g.soundEnabled,true);assert.equal(f.storage.values.get('fourfold:sound'),'true');
    assert.equal(turn.plays,1,'unmuting never resumes an old turn');
    g.drawModal();assert(f.buttons.some(button=>button.label==='音效：开'));
    const oldUI=g.uiSerial;g.draw();assert.equal(g.toggleSound(g.roundSerial,oldUI),false,'detached toggles cannot modify settings');
  }
});

test('native audio teardown releases owned clips and refuses late loader callbacks',async()=>{
  const f=audioFixture(),g=f.game,loading=g.prepareAudio(),clip=f.finish(f.requests[0]);await flush();
  const source=g.audioSources.ui;g.playAudio('ui');assert.equal(source.playing,true);assert.equal(clip.refs,1);
  g.onDestroy();await loading;assert.equal(source.playing,false);assert.equal(source.clip,null);assert.equal(clip.refs,0);
  assert.equal(g.audioNode,null);assert.equal(g.pendingResourceLoads.size,0);assert.equal(f.timers.size,0);
  const late=f.finish(f.requests[1]);await flush();assert.equal(late.refs,0);assert.deepEqual(Object.keys(g.audioClips),[]);
  const requestCount=f.requests.length;await g.prepareAudio();assert.equal(f.requests.length,requestCount);
});
