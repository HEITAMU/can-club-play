import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createBackgroundMusic,createGrooveTrack} from '../music.mjs';
import {webFixture,flush} from './helpers/runtime-fixtures.mjs';
import {musicContext} from './helpers/music-context.mjs';

test('music starts on a gesture, keeps one clock and preserves the phrase through repeated gestures',async()=>{
 const f=musicContext(),music=createBackgroundMusic(f.options);
 assert.equal(await music.resume(),false);assert.equal(f.created,0);
 assert.equal(await music.resume({gesture:true}),true);f.advance(17);
 const position=music.getState().position;
 for(let i=0;i<10;i++)await music.resume({gesture:true});
 assert.equal(f.created,1);assert.equal(f.timers.size,1);assert.equal(music.getState().position,position);
 music.pause();assert.equal(f.timers.size,0);assert.equal(music.getState().running,false);
 f.advance(5);await music.resume();assert.equal(music.getState().position,Math.max(0,position-.045));
 music.dispose();assert.equal(f.timers.size,0);assert.equal(music.getState().activeVoices,0);assert.equal(f.context.state,'closed');
});
test('a pending resume cannot restart hidden or muted music; a new gesture can recover',async()=>{
 let visible=true,finish;const f=musicContext();f.context.state='suspended';
 f.context.resume=()=>new Promise(resolve=>{finish=()=>{f.context.state='running';resolve();};});
 const music=createBackgroundMusic({...f.options,isVisible:()=>visible});
 const pending=music.resume({gesture:true});visible=false;music.pause();finish();
 assert.equal(await pending,false);assert.equal(music.getState().running,false);assert.equal(f.timers.size,0);
 visible=true;music.setEnabled(false);assert.equal(await music.resume({gesture:true}),false);
 music.setEnabled(true);assert.equal(await music.resume({gesture:true}),true);music.dispose();
 assert.equal(await music.resume({gesture:true}),false);
});
test('long playback wraps, releases voices, and skips late notes without a catch-up burst',async()=>{
 const f=musicContext(),music=createBackgroundMusic(f.options);await music.resume({gesture:true});
 let max=0;for(let i=0;i<24000;i++){f.advance(.025);max=Math.max(max,music.getState().activeVoices);}
 assert(max<100);assert.equal(f.timers.size,1);assert(music.getState().position<76.8);
 const before=f.sources.length;f.advance(6);assert(f.sources.length-before<30,'a stalled frame must not replay six seconds of notes');
 music.dispose();assert.equal(music.getState().activeVoices,0);
});
test('written score returns to its hook without a silent final bar',()=>{
 const track=createGrooveTrack();assert.equal(track.duration,76.8);assert.equal(track.bpm,100);
 for(const e of track.events){assert(Number.isFinite(e.time));assert(e.time>=0&&e.time<track.duration);assert(e.duration>0);}
 for(let bar=0;bar<32;bar++)assert(track.events.some(e=>Math.floor(e.step/16)===bar&&e.role==='bass'));
 const melody=section=>track.events.filter(e=>e.role==='lead'&&Math.floor(e.step/128)===section).map(e=>[e.step%128,e.midi]);
 assert.deepEqual(melody(0),melody(3));assert.notDeepEqual(melody(0),melody(2));
});
test('web settings keep realtime music separate from effects and respect visibility',async()=>{
 const c=musicContext(),f=webFixture({musicOptions:c.options});
 f.document.dispatch('click',{target:f.el('enterDaily')});await flush();assert.equal(c.timers.size,1);
 f.run('openSettings()');f.el('settingsMusic').click();assert.equal(f.storage.getItem('fourfold:music'),'false');assert.equal(c.timers.size,0);assert.equal(f.run('soundEnabled'),true);
 f.el('settingsMusic').click();await flush();f.el('settingsSound').click();assert.equal(f.run('soundEnabled'),false);assert.equal(f.run('musicEnabled'),true);assert.equal(c.timers.size,1);
 f.document.hidden=true;f.document.dispatch('visibilitychange');assert.equal(c.timers.size,0);
 f.document.hidden=false;f.document.dispatch('visibilitychange');await flush();assert.equal(c.timers.size,1);
 f.window.dispatch('pagehide',{persisted:false});assert.equal(c.timers.size,0);assert.equal(c.context.state,'closed');
});

test('a stale resume failure cannot silence a newer successful playback',async()=>{
 const f=musicContext();let rejectOld;f.context.state='suspended';f.context.resume=()=>new Promise((resolve,reject)=>{rejectOld=reject;});
 const music=createBackgroundMusic(f.options),old=music.resume({gesture:true});
 music.pause();f.context.state='running';assert.equal(await music.resume({gesture:true}),true);
 rejectOld(new Error('old interrupted context'));assert.equal(await old,false);assert.equal(music.getState().running,true);assert.equal(f.timers.size,1);music.dispose();
});
