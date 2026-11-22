import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGameAudio} from '../audio.mjs';
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function platform(){
  const sources=[],session={type:'ambient'};
  const context={state:'suspended',currentTime:0,destination:{},resumeCalls:0,
    resume(){this.resumeCalls++;this.state='running';return Promise.resolve();},
    suspend(){this.state='suspended';return Promise.resolve();},close(){this.state='closed';return Promise.resolve();},
    decodeAudioData(){return Promise.resolve({duration:.24});},
    createGain(){return {connect(){},disconnect(){},gain:{setValueAtTime(){},linearRampToValueAtTime(){},cancelScheduledValues(){}}};},
    createBufferSource(){const source={connect(){},disconnect(){},start(){this.started=true;},stop(){this.stopped=true;}};sources.push(source);return source;},
  };
  const options={contextFactory:()=>context,sessionFactory:()=>session,fetchAudio:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(4)}),waitLimitMs:20};
  return {context,session,sources,options};
}
test('a hung first resume expires and a new gesture really calls resume again',async()=>{
  const p=platform();let resolveOld;
  p.context.resume=function(){this.resumeCalls++;if(this.resumeCalls===1)return new Promise(resolve=>{resolveOld=resolve;});this.state='running';return Promise.resolve();};
  const audio=createGameAudio(p.options);await audio.preload();
  assert.equal(await audio.playButton(),false);assert.equal(p.context.resumeCalls,1);
  assert.equal(audio.getDiagnostics().unlockState,'resume-timeout');assert.equal(p.sources.length,0);
  assert.equal(await audio.playButton(),true);assert.equal(p.context.resumeCalls,2);assert.equal(p.sources.length,1);
  resolveOld();await tick();assert.equal(p.sources.length,1,'old resume cannot replay the first tap');
  audio.dispose();
});
test('a new gesture can recover while an earlier suspend Promise is still pending',async()=>{
  const p=platform(),audio=createGameAudio(p.options);assert.equal(await audio.playButton(),true);
  p.context.suspend=function(){this.state='suspended';return new Promise(()=>{});};
  audio.pause();assert.equal(await audio.playButton(),true);assert.equal(p.context.resumeCalls,2);
  assert.equal(p.sources.length,2);audio.dispose();
});
test('a newer gesture is not chained behind a still-pending older unlock',async()=>{
  const p=platform();p.context.resume=function(){this.resumeCalls++;if(this.resumeCalls===1)return new Promise(()=>{});this.state='running';return Promise.resolve();};
  const audio=createGameAudio(p.options),old=audio.playButton();assert.equal(p.context.resumeCalls,1);
  assert.equal(await audio.playButton(),true);assert.equal(p.context.resumeCalls,2);
  await old;assert.equal(p.sources.length,1,'only the current tap is allowed to emit');audio.dispose();
});
test('standard sound leaves the session alone; explicit media mode owns and restores playback',async()=>{
  const p=platform(),audio=createGameAudio(p.options);await audio.playButton();assert.equal(p.session.type,'ambient');
  audio.setOutputMode('media');assert.equal(p.session.type,'ambient','selection alone does not start a session');
  assert.equal(await audio.testSound(),true);assert.equal(p.session.type,'playback');assert.equal(audio.getDiagnostics().mode,'media');
  assert.equal(audio.getDiagnostics().backend,'web-audio');
  audio.setEnabled(false);assert.equal(p.session.type,'ambient');assert.equal(await audio.testSound(),false);
  assert.equal(audio.getDiagnostics().cues.test.reason,'muted');
  audio.setEnabled(true);assert.equal(await audio.testSound(),true);assert.equal(p.session.type,'playback');
  audio.setOutputMode('standard');assert.equal(p.session.type,'ambient');audio.dispose();
});
test('explicit compatibility mode without AudioSession reuses one media element and keeps the turn token',async()=>{
  const p=platform(),players=[];
  const mediaFactory=()=>{const element={paused:true,ended:false,readyState:4,currentTime:0,src:'',listeners:new Map(),plays:0,
    addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);},removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);},
    play(){this.plays++;this.paused=false;this.ended=false;return Promise.resolve();},pause(){this.paused=true;},load(){},removeAttribute(name){delete this[name];},
  };players.push(element);return element;};
  const audio=createGameAudio({...p.options,sessionFactory:()=>null,mediaFactory,outputMode:'media'});
  const token=audio.beginTurn();assert.equal(players[0].plays,1,'media play stays inside the click call stack');await tick();
  assert.equal(p.sources.length,0,'only one backend is used');assert.equal(await audio.finishTurn(token),true);assert.equal(players.length,1);
  assert.equal(players[0].plays,2);assert.match(players[0].src,/stone-seat-v5/);
  assert.equal(await audio.finishTurn(token),false);
  const next=audio.beginTurn();audio.stopTurn();assert.equal(await audio.finishTurn(next),false);assert.equal(players[0].paused,true);
  audio.dispose();
});
test('diagnostics keep knob and test failures separate from an ordinary settings click',async()=>{
  const p=platform(),audio=createGameAudio({...p.options,enabled:false});
  audio.beginTurn();await audio.testSound();audio.setEnabled(true);await audio.playButton();
  const info=audio.getDiagnostics();assert.equal(info.build,'0.8.33');assert.equal(info.cues.press.reason,'muted');assert.equal(info.cues.test.reason,'muted');assert.equal(info.cues.button.state,'started');
  info.cues.press.reason='edited';assert.equal(audio.getDiagnostics().cues.press.reason,'muted','snapshots cannot edit the controller');audio.dispose();
});
function mediaPlatform(){
  const p=platform(),players=[];
  p.options.sessionFactory=()=>null;
  p.options.mediaFactory=()=>{
    const listeners=new Map();
    const player={paused:true,ended:false,readyState:4,currentTime:0,src:'',plays:0,
      addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn);},
      removeEventListener(type,fn){listeners.get(type)?.delete(fn);},dispatch(type){for(const fn of [...listeners.get(type)||[]])fn();},
      play(){this.plays++;this.paused=false;this.ended=false;return Promise.resolve();},pause(){this.paused=true;},load(){},removeAttribute(name){delete this[name];},
    };players.push(player);return player;
  };
  return {...p,players};
}
test('an obsolete Web Audio resume cannot overwrite diagnostics after switching to media',async()=>{
  const p=mediaPlatform();p.context.resume=()=>new Promise(()=>{});
  const audio=createGameAudio(p.options),old=audio.playButton();
  audio.setOutputMode('media');assert.equal(await audio.testSound(),true);
  await old;const info=audio.getDiagnostics();
  assert.equal(info.backend,'html-media');assert.equal(info.unlockState,'media-ready');assert.equal(info.cues.test.state,'started');audio.dispose();
});
test('ordinary UI sounds neither interrupt an active media test nor overwrite its completed result',async()=>{
  const p=mediaPlatform(),audio=createGameAudio({...p.options,outputMode:'media'});
  assert.equal(await audio.testSound(),true);assert.equal(await audio.playButton(),false);
  assert.equal(p.players[0].plays,1);assert.equal(audio.getDiagnostics().cues.test.state,'started');
  p.players[0].ended=true;p.players[0].paused=true;p.players[0].dispatch('ended');
  assert.equal(audio.getDiagnostics().cues.test.state,'ended');
  assert.equal(await audio.playButton(),true);assert.equal(audio.getDiagnostics().cues.test.state,'ended');audio.dispose();
});
