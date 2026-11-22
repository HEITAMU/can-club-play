import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nativeFixture,flush} from './helpers/runtime-fixtures.mjs';
import {GOAL,rotate} from '../cocos/assets/scripts/Core.js';

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

test('native optional tactile clips load independently and never replay a click missed during loading',async()=>{
  const f=audioFixture(),g=f.game,loading=g.prepareAudio();
  assert.deepEqual(f.requests.map(request=>request.path),['audio/ui-soft-press-v4','audio/soft-seat-v4']);
  assert(f.channels.every(source=>source.playOnAwake===false&&source.loop===false));
  assert.equal(g.assetsReady,true);assert.equal(g.loading,false);
  const button=new f.NativeNode('Button');let actions=0;g.bindButton(button,()=>{actions++;});
  f.tap(button);assert.equal(actions,1);assert.equal(g.audioSources.press.plays,0);
  const clip=f.finish(f.requests[0]);f.finish(f.requests[1],new Error('optional landing clip missing'));await loading;
  assert.equal(g.audioSources.press.plays,0,'the old touch is not queued for replay');
  assert.equal(clip.refs,1);assert.equal(g.audioClips.seat,undefined);assert.equal(g.loadError,'');
  assert.equal(f.timers.size,0);assert.equal(g.pendingResourceLoads.size,0);
  f.tap(button);assert.equal(actions,2);assert.equal(g.audioSources.press.plays,1);
  assert.equal(g.audioSources.press.volume,.9,'ordinary buttons have the full tactile press at UI volume');
  g.audioSources.press.failPlay=true;assert.doesNotThrow(()=>f.tap(button));assert.equal(actions,3);
  const retry=g.prepareAudio();assert.equal(f.requests.length,3,'retry only the missing clip');f.finish(f.requests[2]);await retry;
  assert.equal(g.audioSources.seat.plays,0);assert.equal(g.audioClips.seat.refs,1);
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
  assert.equal(f.requests[2].path,'audio/ui-soft-press-v4');assert.equal(g.audioSources.press.plays,0);
  f.finish(f.requests[2]);await flush();
  assert.equal(g.audioSources.press.plays,0,'finishing recovery cannot replay either missed tap');
  assert.equal(g.audioClips.press.refs,1);assert.equal(g.audioLoading,false);
  f.tap(button);assert.equal(g.audioSources.press.plays,1);assert.equal(f.requests.length,3);
});

test('native UI sounds fire once after accepted touches and ignore busy, cancelled or stale actions',async()=>{
  const f=audioFixture(),g=f.game;await f.ready();let actions=0;
  const button=new f.NativeNode('Button');g.bindButton(button,()=>{actions++;});
  button.emit('end');assert.equal(actions,0);
  f.tap(button);button.emit('end');assert.equal(actions,1);assert.equal(g.audioSources.press.plays,1);
  button.emit('start');button.emit('cancel');button.emit('end');assert.equal(actions,1);
  g.busy=true;f.tap(button);g.busy=false;assert.equal(actions,1);
  button.emit('start');button.activeInHierarchy=false;button.emit('end');assert.equal(actions,1);
  const stale=new f.NativeNode('Stale');g.bindButton(stale,()=>false);f.tap(stale);assert.equal(g.audioSources.press.plays,1);
  const daily=g.referenceControl('Daily direction',[0,0,120,48],0,0,1,()=>{actions++;});
  f.tap(daily);assert.equal(actions,2);assert.equal(g.audioSources.press.plays,2,'daily reference controls use the same sound policy');
});

test('native rotation presses once, stays silent through 799ms and seats once after the 800ms commit',async()=>{
  const f=audioFixture(),g=f.game;await f.ready();const knob=f.board();
  f.tap(knob);const motion=g.turnMotion;assert(motion);
  const press=g.audioSources.press,seat=g.audioSources.seat;
  assert.equal(press.plays,1);assert.equal(press.volume,1);assert.equal(seat.plays,0);
  f.tap(knob);assert.equal(press.plays,1,'rapid clicks do not layer a generic click or another press');
  g.update(.4);assert.equal(g.moves,0);assert.equal(seat.plays,0,'the 400ms midpoint has not committed the turn');
  g.update(.399);assert.equal(g.moves,0);assert.equal(seat.plays,0);assert.equal(g.turnMotion,motion);
  g.update(.001);assert.equal(g.turnMotion,null);assert.equal(press.playing,false);assert.equal(g.moves,1);
  assert.equal(seat.plays,1);assert.equal(seat.volume,1);assert.equal(seat.playing,true,'successful redraw does not cancel the landing');
  g.update(10);g.playAudio('seat',motion);assert.equal(seat.plays,1,'later frames cannot replay the committed landing');
  g.draw();assert.equal(seat.playing,true,'another redraw of this same board also preserves the landing tail');
  f.board();g.applyHint();g.drawReferenceBoard(0,0,1);f.tap(g.knobNodes[0]);assert.equal(g.turnMotion,null);
  assert.equal(press.plays,1,'a hint awaiting direction also blocks the press');
  assert.equal(seat.plays,1,'a rejected rotation cannot schedule a landing');
});

test('native cancellation, dialogs, navigation, reset, background and disable cannot produce a delayed landing',async()=>{
  for(const leave of ['cancel','redraw','settings','home','restart','hide','disable','destroy']){
    const f=audioFixture(),g=f.game;await f.ready();f.tap(f.board());
    const motion=g.turnMotion,press=g.audioSources.press,seat=g.audioSources.seat;assert.equal(press.playing,true,leave);
    if(leave==='cancel')g.cancelTurnMotion();
    if(leave==='redraw')g.draw();
    if(leave==='settings'){g.modal='settings';g.draw();}
    if(leave==='home')g.goHome();
    if(leave==='restart')g.startGame('story','1');
    if(leave==='hide')g.onAppHide();
    if(leave==='disable')g.onDisable();
    if(leave==='destroy')g.onDestroy();
    assert.equal(press.playing,false,leave);assert.equal(g.turnMotion,null,leave);assert.equal(g.moves,0,leave);
    g.onAppShow();g.onEnable();g.update(5);assert.equal(press.plays,1,`${leave} must not resume stale motion`);
    g.playAudio('press');g.playAudio('seat',motion);assert.equal(press.plays,1);assert.equal(seat.plays,0,`${leave} never seats an uncommitted turn`);
    if(leave!=='destroy'){
      for(const source of [press,seat]){source.playing=true;source.node.emit(f.AudioSource.EventType.STARTED);assert.equal(source.playing,false,'late platform starts are cancelled');}
      g.onAppHide();g.playAudio('ui');assert.equal(press.playing,false,'background clicks stay silent');
      g.onAppShow();press.playing=true;press.node.emit(f.AudioSource.EventType.STARTED);assert.equal(press.playing,false,'a cancelled UI sound cannot revive after foregrounding');
    }
  }
});

test('native landed sound survives completion but stops before another turn, dialog, level or lifecycle change',async()=>{
  for(const leave of ['turn','result','settings','home','restart','next','hide','disable','destroy']){
    const f=audioFixture(),g=f.game;await f.ready();f.board();
    if(leave==='result'||leave==='next'){g.board=rotate(GOAL,0,-1);g.draw();g.drawReferenceBoard(0,0,1);}
    f.tap(g.knobNodes[0]);g.update(1.2);
    const press=g.audioSources.press,seat=g.audioSources.seat;assert.equal(seat.playing,true,leave);assert.equal(seat.plays,1);
    if(leave==='result'||leave==='next'){assert.equal(g.won,true);assert.equal(g.completedRound,g.roundSerial);}
    if(leave==='turn'){g.drawReferenceBoard(0,0,1);f.tap(g.knobNodes[0]);assert.equal(press.plays,2);}
    if(leave==='result')g.openResultDetails();
    if(leave==='settings'){g.modal='settings';g.draw();}
    if(leave==='home')g.goHome();
    if(leave==='restart')g.startGame('story','1');
    if(leave==='next')assert.equal(g.nextLevel(),true);
    if(leave==='hide')g.onAppHide();
    if(leave==='disable')g.onDisable();
    if(leave==='destroy')g.onDestroy();
    assert.equal(seat.playing,false,leave);assert.equal(seat.plays,1);
    if(leave!=='destroy'){seat.playing=true;seat.node.emit(f.AudioSource.EventType.STARTED);assert.equal(seat.playing,false,'the previous landing cannot restart');}
  }
});

test('native a missing landing is retried but never replayed after the optional clip arrives',async()=>{
  const f=audioFixture(),g=f.game,loading=g.prepareAudio();
  f.finish(f.requests[0]);f.finish(f.requests[1],new Error('temporary seat load failure'));await loading;
  f.tap(f.board());g.update(1.2);const seat=g.audioSources.seat;
  assert.equal(g.moves,1);assert.equal(seat.plays,0);assert.equal(f.requests.length,3);
  assert.equal(f.requests[2].path,'audio/soft-seat-v4');f.finish(f.requests[2]);await flush();
  assert.equal(seat.plays,0,'loading cannot add a late sound to the previous turn');
  g.drawReferenceBoard(0,0,1);f.tap(g.knobNodes[0]);g.update(1.2);assert.equal(seat.plays,1,'the next completed turn can use the recovered clip');
});

test('native sound setting shares the persisted sound key and muted state immediately stops both channels',async()=>{
  for(const useWx of [true,false]){
    const f=audioFixture({useWx}),g=f.game;await f.ready();assert.equal(g.soundEnabled,true);
    f.tap(f.board());const motion=g.turnMotion,press=g.audioSources.press,seat=g.audioSources.seat;
    g.modal='settings';assert.equal(g.toggleSound(),true);assert.equal(g.soundEnabled,false);
    assert.equal(press.playing,false);assert.equal(seat.playing,false);assert.equal(f.storage.values.get('fourfold:sound'),'false');
    const reopened=nativeFixture({storage:f.storage,useWx});assert.equal(reopened.game.soundEnabled,false);
    const plays=press.plays;g.playAudio('ui');assert.equal(press.plays,plays);
    assert.equal(g.toggleSound(),true);assert.equal(g.soundEnabled,true);assert.equal(f.storage.values.get('fourfold:sound'),'true');
    g.update(5);g.playAudio('seat',motion);assert.equal(press.plays,1,'unmuting never resumes an old turn');assert.equal(seat.plays,0);
    g.drawModal();assert(f.buttons.some(button=>button.label==='音效：开'));
    const oldUI=g.uiSerial;g.draw();assert.equal(g.toggleSound(g.roundSerial,oldUI),false,'detached toggles cannot modify settings');
  }
});

test('native muting a committed landing stops its tail and prevents a late platform restart',async()=>{
  const f=audioFixture(),g=f.game;await f.ready();f.tap(f.board());g.update(1.2);
  const seat=g.audioSources.seat;assert.equal(seat.playing,true);
  g.modal='settings';g.toggleSound();assert.equal(seat.playing,false);
  g.toggleSound();seat.playing=true;seat.node.emit(f.AudioSource.EventType.STARTED);assert.equal(seat.playing,false);
  assert.equal(seat.plays,1);
});

test('native audio teardown releases owned clips and refuses late loader callbacks',async()=>{
  const f=audioFixture(),g=f.game,loading=g.prepareAudio(),clip=f.finish(f.requests[0]);await flush();
  const source=g.audioSources.press;g.playAudio('ui');assert.equal(source.playing,true);assert.equal(clip.refs,1);
  g.onDestroy();await loading;assert.equal(source.playing,false);assert.equal(source.clip,null);assert.equal(clip.refs,0);
  assert.equal(g.audioNode,null);assert.equal(g.pendingResourceLoads.size,0);assert.equal(f.timers.size,0);
  const late=f.finish(f.requests[1]);await flush();assert.equal(late.refs,0);assert.deepEqual(Object.keys(g.audioClips),[]);
  const requestCount=f.requests.length;await g.prepareAudio();assert.equal(f.requests.length,requestCount);
});
