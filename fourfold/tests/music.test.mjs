import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createBackgroundMusic,MUSIC_FILE} from '../music.mjs';
import {webFixture,flush} from './helpers/runtime-fixtures.mjs';
function media(){return {paused:true,plays:0,pauses:0,currentTime:0,play(){this.plays++;this.paused=false;return Promise.resolve();},pause(){this.pauses++;this.paused=true;},removeAttribute(){},load(){}};}
test('music waits for activation, loops one media channel and preserves position through repeated gestures',async()=>{
 const p=media();let created=0;const music=createBackgroundMusic({createElement:()=>{created++;return p;}});
 assert.equal(await music.resume(),false);assert.equal(created,0);
 assert.equal(await music.resume({gesture:true}),true);assert.equal(p.src,MUSIC_FILE);assert.equal(p.loop,true);
 p.currentTime=17;await music.resume({gesture:true});assert.equal(created,1);assert.equal(p.plays,1);assert.equal(p.currentTime,17);
 music.pause();await music.resume();assert.equal(p.plays,2);assert.equal(p.currentTime,17);music.dispose();
});
test('hidden or muted music cannot start after a delayed play promise; later gestures recover failures',async()=>{
 let visible=true,finish;const p=media();p.play=()=>new Promise(resolve=>{finish=()=>{p.paused=false;resolve();};});
 const music=createBackgroundMusic({createElement:()=>p,isVisible:()=>visible});const pending=music.resume({gesture:true});
 visible=false;music.pause();finish();assert.equal(await pending,false);assert.equal(p.paused,true);
 visible=true;music.setEnabled(false);assert.equal(await music.resume({gesture:true}),false);
 music.setEnabled(true);p.play=()=>Promise.reject(new Error('blocked'));assert.equal(await music.resume({gesture:true}),false);
 p.play=()=>{p.paused=false;return Promise.resolve();};assert.equal(await music.resume({gesture:true}),true);
 music.dispose();assert.equal(await music.resume({gesture:true}),false);
});
test('web settings persist music independently of effects and lifecycle pauses it',async()=>{
 const p=media(),f=webFixture({musicOptions:{createElement:()=>p}});
 f.document.dispatch('click',{target:f.el('enterDaily')});await flush();assert.equal(p.paused,false);
 f.run('openSettings()');f.el('settingsMusic').click();assert.equal(f.storage.getItem('fourfold:music'),'false');assert.equal(p.paused,true);assert.equal(f.run('soundEnabled'),true);
 f.el('settingsMusic').click();await flush();f.el('settingsSound').click();assert.equal(f.run('soundEnabled'),false);assert.equal(f.run('musicEnabled'),true);assert.equal(p.paused,false);
 f.document.hidden=true;f.document.dispatch('visibilitychange');assert.equal(p.paused,true);
 f.document.hidden=false;f.document.dispatch('visibilitychange');await flush();assert.equal(p.paused,false);
 f.window.dispatch('pagehide',{persisted:false});assert.equal(p.paused,true);
});
