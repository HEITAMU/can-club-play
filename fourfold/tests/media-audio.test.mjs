import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMediaAudio} from '../media-audio.mjs';

const files={press:'https://example.invalid/knob-click-v5.mp3',button:'https://example.invalid/ui-tap-v5.mp3',seat:'https://example.invalid/stone-seat-v5.mp3'};
const flush=()=>new Promise(setImmediate);
function platform({legacy=false,seekThrows=false,playThrows=null,observer=()=>{}}={}){
  const clock={ms:0},statuses=[],calls=[],listeners=new Map();let created=0,source='',time=0;
  const element={paused:true,ended:false,error:null,readyState:4,currentSrc:'',pauseCount:0,loads:0,seeks:[],assignments:[],
    get src(){return source;},set src(value){source=value;this.currentSrc=value;this.assignments.push(value);time=0;this.ended=false;this.error=null;},
    get currentTime(){return time;},set currentTime(value){this.seeks.push(value);if(seekThrows)throw new Error('metadata unavailable');time=value;},
    addEventListener(type,handler){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(handler);},
    removeEventListener(type,handler){listeners.get(type)?.delete(handler);},
    emit(type){for(const handler of [...listeners.get(type)||[]])handler({type,target:this});},
    pause(){this.pauseCount++;this.paused=true;},
    load(){this.loads++;this.error=null;time=0;},
    removeAttribute(name){if(name==='src'){source='';this.currentSrc='';}},
    play(){
      if(playThrows)throw playThrows;
      this.paused=false;this.ended=false;
      let resolve,reject;
      const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});
      calls.push({src:this.src,position:this.currentTime,volume:this.volume,resolve,reject,handlers:Object.fromEntries([...listeners].map(([type,set])=>[type,[...set]]))});
      return legacy?undefined:promise;
    },
  };
  const audio=createMediaAudio({createElement:()=>{created++;return element;},files,now:()=>clock.ms,onStatus:(phase,details)=>{statuses.push({phase,...details});observer(phase,details);}});
  return {audio,element,clock,statuses,calls,listeners,get created(){return created;},setTime:value=>{time=value;},
    start(index=calls.length-1){element.paused=false;element.ended=false;element.emit('playing');calls[index].resolve();},
    end(){element.paused=true;element.ended=true;element.emit('ended');},
  };
}

test('play starts synchronously, preserves sample/gain, and reuses one element for both contacts',async()=>{
  const p=platform();
  assert.equal(p.created,0,'constructing the controller cannot create or start media');
  const button=p.audio.play('button',.9);
  assert.equal(p.created,1);assert.equal(p.calls.length,1,'play() is called before the method returns');
  assert.deepEqual({src:p.calls[0].src,position:p.calls[0].position,volume:p.calls[0].volume},{src:files.button,position:0,volume:.9});
  assert.equal(p.element.loop,false);assert.equal(p.element.preload,'auto');assert.equal(p.audio.getState().state,'pending');
  p.start();assert.equal(await button,true);assert.equal(p.audio.getState().state,'playing');
  p.end();assert.equal(p.audio.getState().state,'idle');
  const seat=p.audio.play('seat',1);assert.equal(p.created,1);assert.equal(p.calls[1].src,files.seat);assert.equal(p.calls[1].volume,1);
  p.start();assert.equal(await seat,true);p.end();
  assert.deepEqual(p.statuses.map(s=>s.phase),['request','started','ended','request','started','ended']);
  p.audio.dispose();
});

test('repeat taps seek to the attack without reassigning a ready source',async()=>{
  const p=platform(),first=p.audio.play('button',1);p.start();await first;p.setTime(.17);
  const second=p.audio.play('button',.9);
  assert.equal(p.calls[1].position,0);assert.deepEqual(p.element.assignments,[files.button]);
  assert.deepEqual(p.element.seeks,[0,0]);assert.ok(p.element.pauseCount>=1);
  p.start();assert.equal(await second,true);p.audio.dispose();
});

test('a refused repeat seek resets the same source inside the next gesture',async()=>{
  const p=platform({seekThrows:true}),first=p.audio.play('button',1);p.start();assert.equal(await first,true);p.setTime(.15);
  const repeat=p.audio.play('button',1);
  assert.equal(p.calls.length,2,'seek failure cannot defer the gesture play call');
  assert.deepEqual(p.element.assignments,[files.button,files.button]);assert.equal(p.calls[1].position,0);
  p.start();assert.equal(await repeat,true);p.audio.dispose();
});

test('late play resolution is paused and never reported as started',async()=>{
  const p=platform(),request=p.audio.play('button',1);p.clock.ms=141;p.start();
  assert.equal(await request,false);assert.equal(p.element.paused,true);
  assert.deepEqual(p.statuses.map(s=>s.phase),['request','late']);
  assert.equal(p.audio.getState().state,'idle');p.audio.dispose();
});

test('a never-settling native play has a finite deadline and a later gesture can play',async()=>{
  const p=platform(),request=p.audio.play('button',1,{maxDelayMs:5});
  assert.equal(await request,false);assert.equal(p.element.paused,true);assert.equal(p.statuses.at(-1).phase,'late');
  const next=p.audio.play('button',1);p.start();assert.equal(await next,true);
  p.calls[0].resolve();await flush();assert.equal(p.element.paused,false,'old resolution cannot stop a newer cue');
  p.audio.dispose();
});

test('stop, pause, and dispose settle pending requests and prevent a late playing event',async()=>{
  for(const action of ['stop','pause','dispose']){
    const p=platform(),request=p.audio.play('seat',1),oldHandlers=p.calls[0].handlers;
    p.audio[action]();assert.equal(await request,false);assert.equal(p.element.paused,true,action);
    p.calls[0].resolve();for(const handler of oldHandlers.playing)handler();await flush();
    assert(!p.statuses.some(s=>s.phase==='started'),action);assert.equal(p.element.paused,true);
    assert.equal(p.audio.getState().state,action==='dispose'?'disposed':'idle');
    if(action==='dispose'){assert.equal(await p.audio.play('button',1),false);assert.equal(p.calls.length,1);}
    p.audio.dispose();
  }
});

test('new requests isolate old Promise, playing, ended, and timeout callbacks',async()=>{
  const p=platform(),old=p.audio.play('button',1,{maxDelayMs:5}),oldHandlers=p.calls[0].handlers;
  const current=p.audio.play('seat',1);assert.equal(await old,false);
  p.start(1);assert.equal(await current,true);const pauses=p.element.pauseCount;
  p.calls[0].resolve();
  for(const handler of oldHandlers.playing)handler();
  for(const handler of oldHandlers.ended||[])handler();
  await new Promise(resolve=>setTimeout(resolve,8));
  assert.equal(p.element.pauseCount,pauses,'retired callbacks must not pause the current element');
  assert.equal(p.audio.getState().state,'playing');
  assert.deepEqual(p.statuses.map(s=>s.phase),['request','request','started']);
  p.audio.dispose();
});

test('a queued ended event cannot end a new request unless the current media really ended',async()=>{
  const p=platform(),first=p.audio.play('button',1);p.start();await first;
  const next=p.audio.play('seat',1);p.element.ended=true;p.element.emit('ended');
  assert.equal(p.audio.getState().state,'pending');
  p.start();assert.equal(await next,true);p.element.emit('ended');
  assert.equal(p.audio.getState().state,'playing','an old event with ended=false is ignored');
  p.end();assert.equal(p.audio.getState().state,'idle');
  assert.equal(p.statuses.filter(s=>s.phase==='ended').length,1);p.audio.dispose();
});

test('an old playing event cannot claim success for a new unresolved play Promise',async()=>{
  const p=platform(),first=p.audio.play('button',1);p.start();await first;
  const next=p.audio.play('seat',1);p.element.emit('playing');
  assert.equal(p.audio.getState().state,'pending');
  assert.equal(p.statuses.filter(s=>s.phase==='started').length,1);
  p.calls[1].resolve();assert.equal(await next,true);p.audio.dispose();
});

test('stale action guards block before creation and cancel asynchronous starts',async()=>{
  const p=platform();assert.equal(await p.audio.play('button',1,{isCurrent:()=>false}),false);assert.equal(p.created,0);
  let current=true;const pending=p.audio.play('seat',1,{isCurrent:()=>current});current=false;p.start();
  assert.equal(await pending,false);assert.equal(p.element.paused,true);
  assert.equal(p.statuses.at(-1).reason,'stale');p.audio.dispose();
});

test('an already stale caller cannot interrupt the current valid contact',async()=>{
  const p=platform(),current=p.audio.play('button',1);p.start();assert.equal(await current,true);
  const pauses=p.element.pauseCount;
  assert.equal(await p.audio.play('seat',1,{isCurrent:()=>false}),false);
  assert.equal(p.element.pauseCount,pauses);assert.equal(p.audio.getState().state,'playing');
  assert.equal(p.calls.length,1);p.audio.dispose();
});

test('a late Promise without a playing event is stopped, including after cancellation',async()=>{
  for(const cancelled of [false,true]){
    const p=platform(),request=p.audio.play('button',1);
    if(cancelled)p.audio.stop();else p.clock.ms=141;
    p.element.paused=false;p.calls[0].resolve();await flush();
    assert.equal(await request,false);assert.equal(p.element.paused,true);
    assert(!p.statuses.some(s=>s.phase==='started'));p.audio.dispose();
  }
});

test('queued playing events cannot stop an accepted cue or resume a cancelled one',async()=>{
  const p=platform(),request=p.audio.play('button',1);p.start();await request;
  p.clock.ms=200;p.element.emit('playing');
  assert.equal(p.element.paused,false,'an accepted cue cannot be failed by a queued playing event');
  assert.equal(p.statuses.filter(s=>s.phase==='started').length,1);
  p.audio.stop();
  p.element.paused=false;p.element.emit('playing');
  assert.equal(p.element.paused,true,'an orphan playing event is paused too');p.audio.dispose();
});

test('NotAllowedError is reported as blocked and a new gesture retries the same element',async()=>{
  const p=platform(),denied=p.audio.play('button',1);
  p.calls[0].reject(Object.assign(new Error('User activation required'),{name:'NotAllowedError'}));
  assert.equal(await denied,false);assert.equal(p.statuses.at(-1).phase,'blocked');assert.equal(p.statuses.at(-1).name,'NotAllowedError');
  assert.equal(p.element.paused,true);
  const retry=p.audio.play('button',.9);p.start();assert.equal(await retry,true);assert.equal(p.created,1);p.audio.dispose();
});

test('synchronous playback errors and media resource failures stay optional and observable',async()=>{
  const failure=Object.assign(new Error('Unsupported resource'),{name:'NotSupportedError'}),p=platform({playThrows:failure});
  assert.equal(await p.audio.play('button',1),false);assert.equal(p.statuses.at(-1).phase,'error');assert.equal(p.element.paused,true);p.audio.dispose();
  const q=platform(),pending=q.audio.play('seat',1);q.element.error={code:4,message:'Source unavailable'};q.element.emit('error');
  assert.equal(await pending,false);assert.equal(q.statuses.at(-1).code,4);
  const retry=q.audio.play('seat',1);assert.equal(q.element.loads,1,'same-resource error is reloaded by the new gesture');q.start();assert.equal(await retry,true);q.audio.dispose();
});

test('legacy play without a Promise uses a real playing event and still times out',async()=>{
  const p=platform({legacy:true}),request=p.audio.play('button',1);assert.equal(p.audio.getState().state,'pending');
  p.element.emit('playing');assert.equal(await request,true);p.end();p.audio.dispose();
  const q=platform({legacy:true}),silent=q.audio.play('button',1,{maxDelayMs:5});
  assert.equal(await silent,false);assert.equal(q.element.paused,true);q.audio.dispose();
});

test('missing sources, unavailable media, and status observer errors do not escape playback',async()=>{
  const p=platform();assert.equal(await p.audio.play('unknown',1),false);assert.equal(p.created,0);p.audio.dispose();
  const missing=createMediaAudio({files,createElement:()=>null});assert.equal(await missing.play('button',1),false);missing.dispose();
  const q=platform({observer:()=>{throw new Error('observer failed');}}),request=q.audio.play('button',1);
  q.start();assert.equal(await request,true);q.audio.dispose();
});


test('media compatibility selects a dedicated file for each of the three cues',async()=>{
 const p=platform();
 for(const kind of ['button','press','seat']){const pending=p.audio.play(kind);p.start();assert.equal(await pending,true);assert.equal(p.element.src,files[kind]);p.end();}
 assert.equal(new Set(p.calls.map(call=>call.src)).size,3);p.audio.dispose();
});
