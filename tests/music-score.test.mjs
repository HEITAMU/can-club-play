import test from 'node:test';import assert from 'node:assert/strict';
import {SCORE,HARMONY,musicEvents,instrumentPCM} from '../music-score.mjs';
test('music has rests, low-register harmony and a complete 16-bar phrase',()=>{
 assert.equal(SCORE.length,16);assert.equal(HARMONY.length,16);
 assert.ok(SCORE.flat().filter(n=>n===null).length>64);
 for(let i=0;i<128;i++)for(const e of musicEvents(i,'battle')){assert.ok(e.duration>0&&e.gain>0);if(!['hat','clap'].includes(e.kind))assert.ok(e.midi>=28&&e.midi<=79);}
 assert.deepEqual(musicEvents(0),musicEvents(128));
 assert.ok(!Array.from({length:128},(_,i)=>musicEvents(i)).flat().some(e=>e.kind==='brush'));
});
test('each instrument produces bounded finite audio with a quiet release',()=>{
 for(const kind of ['synth','lead','pad','bass','kick']){
  const pcm=instrumentPCM(kind==='bass'?36:64,kind,16000);
  let peak=0,energy=0;for(const value of pcm){assert.ok(Number.isFinite(value));peak=Math.max(peak,Math.abs(value));energy+=value*value;}
  assert.ok(peak<1&&peak>.05);assert.ok(energy/pcm.length>.00001);
  assert.equal(pcm[0],0);assert.ok(Math.abs(pcm.at(-1))<.001);
 }
});

test('electronic rhythm is led by bass and kick, with no acoustic instrument events',()=>{
 const events=Array.from({length:128},(_,i)=>musicEvents(i,'battle')).flat();
 assert.equal(events.filter(e=>e.kind==='kick').length,64);
 assert.equal(events.filter(e=>e.kind==='bass').length,80);
 assert.ok(events.filter(e=>e.kind==='bass').every(e=>e.midi<48&&e.pan===0&&e.gain>=.5));
 assert.ok(!events.some(e=>['piano','guitar','brush'].includes(e.kind)));
});
