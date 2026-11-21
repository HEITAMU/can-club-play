import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGameAudio,SOUND_FILES} from '../audio.mjs';
import {webFixture,flush} from './helpers/runtime-fixtures.mjs';

// Exercise the production Web Audio controller and app handlers with audio I/O
// substituted. Sound character and speaker playback need a listening check.
function audioPlatform({fetchAudio,decodeAudioData}={}){
  const clock={ms:0},sources=[],fetches=[],contexts=[];
  const param=()=>({events:[],setValueAtTime(...args){this.events.push(['set',...args]);},linearRampToValueAtTime(...args){this.events.push(['ramp',...args]);},cancelScheduledValues(...args){this.events.push(['cancel',...args]);}});
  const context={state:'suspended',destination:{},resumeCount:0,suspendCount:0,closeCount:0,
    get currentTime(){return clock.ms/1000;},
    async resume(){this.resumeCount++;this.state='running';},async suspend(){this.suspendCount++;this.state='suspended';},async close(){this.closeCount++;this.state='closed';},
    async decodeAudioData(bytes){return decodeAudioData?decodeAudioData(bytes):{kind:new Uint8Array(bytes)[0]===2?'turn':'button',duration:new Uint8Array(bytes)[0]===2?1.2:.24};},
    createGain(){return {gain:param(),connect(){},disconnect(){this.disconnected=true;}};},
    createBufferSource(){const source={starts:[],stops:[],connect(){},disconnect(){this.disconnected=true;},start(...args){this.starts.push(args);},stop(...args){this.stops.push(args);}};sources.push(source);return source;},
  };
  const response=url=>({ok:true,arrayBuffer:async()=>Uint8Array.of(url===SOUND_FILES.turn?2:1).buffer});
  const options={contextFactory:()=>{contexts.push(context);return context;},fetchAudio:async url=>{fetches.push(url);return fetchAudio?fetchAudio(url,response):response(url);},now:()=>clock.ms};
  return {clock,sources,fetches,contexts,context,options};
}

test('audio preloads samples without opening a context and unlocks sampled playback on a gesture',async()=>{
  const p=audioPlatform(),audio=createGameAudio(p.options);
  await audio.preload();assert.equal(p.contexts.length,0,'network preloading cannot create autoplay audio');
  assert.deepEqual(new Set(p.fetches),new Set(Object.values(SOUND_FILES)));
  assert.equal(await audio.playButton(),true);assert.equal(p.context.resumeCount,1);
  assert.equal(p.sources[0].buffer.kind,'button');assert.deepEqual(p.sources[0].starts[0],[0,0,.24]);
  assert.equal(await audio.playButton(),true);assert.equal(p.contexts.length,1);assert.equal(p.fetches.length,2,'repeat taps reuse the downloaded/decoded assets');
  assert.deepEqual(p.sources[0].stops.at(-1),[.008],'a new tap fades and stops the preceding UI voice');
  audio.dispose();assert.equal(p.context.closeCount,1);
});

test('turn foley replaces a prior UI voice and follows full or reduced-motion duration without speed-up',async()=>{
  const p=audioPlatform(),audio=createGameAudio(p.options);await audio.preload();await audio.playButton();
  assert.equal(await audio.playTurn(1200),true);
  assert.deepEqual(p.sources[0].stops.at(-1),[.008]);
  assert.equal(p.sources[1].buffer.kind,'turn');assert.deepEqual(p.sources[1].starts[0],[0,0,1.2]);
  assert.equal(await audio.playTurn(120),true);
  assert.deepEqual(p.sources[1].stops.at(-1),[.008]);
  assert.equal(p.sources[2].buffer.kind,'button');assert.deepEqual(p.sources[2].starts[0],[0,0,.12]);
  assert.equal(p.sources[2].playbackRate,undefined,'the long sample is not pitched up to fit reduced motion');
  audio.dispose();
});

test('pending turn samples cannot play after cancellation, mute, hidden page, or disposal',async()=>{
  for(const action of ['cancel','mute','hidden','dispose']){
    const pending=[];let visible=true;
    const p=audioPlatform({fetchAudio:(url,response)=>new Promise(resolve=>pending.push(()=>resolve(response(url))))});
    const audio=createGameAudio({...p.options,isVisible:()=>visible});
    const play=audio.playTurn();await flush();
    if(action==='cancel')audio.stopTurn();
    if(action==='mute')audio.setEnabled(false);
    if(action==='hidden'){visible=false;audio.pause();}
    if(action==='dispose')audio.dispose();
    pending.forEach(resolve=>resolve());
    assert.equal(await play,false,action);assert.equal(p.sources.length,0,action+' must not replay a late cue');
    audio.dispose();
  }
});

test('brief loading delay seeks into the turn while slow loading drops the obsolete cue',async()=>{
  for(const delay of [90,400]){
    const pending=[];
    const p=audioPlatform({fetchAudio:(url,response)=>new Promise(resolve=>pending.push(()=>resolve(response(url))))});
    const audio=createGameAudio(p.options),play=audio.playTurn(1200);await flush();p.clock.ms=delay;pending.forEach(resolve=>resolve());
    assert.equal(await play,delay===90);
    if(delay===90){assert.equal(p.sources[0].starts[0][1],.09);assert.ok(Math.abs(p.sources[0].starts[0][2]-1.11)<1e-9);}
    else assert.equal(p.sources.length,0);
    audio.dispose();
  }
});

test('mute cancels active voices, quick re-enable resumes safely, and unsupported/failed audio stays optional',async()=>{
  const p=audioPlatform(),audio=createGameAudio(p.options);await audio.playTurn();
  audio.setEnabled(false);assert.deepEqual(p.sources[0].stops.at(-1),[0]);assert.equal(p.sources[0].disconnected,true);assert.equal(await audio.playButton(),false);
  audio.setEnabled(true);assert.equal(await audio.playButton(),true);assert.equal(p.context.state,'running');audio.dispose();
  for(const options of [
    {...p.options,contextFactory:()=>null},
    audioPlatform({fetchAudio:async()=>{throw new Error('offline');}}).options,
    audioPlatform({decodeAudioData:async()=>{throw new Error('bad audio');}}).options,
  ]){const optional=createGameAudio(options);assert.equal(await optional.playButton(),false);optional.dispose();}
});

function click(f,id){const button=f.el(id);f.document.dispatch('click',{target:button});button.click();}
function wireAnimations(f){
  const pending=[];
  f.context.__testAnimation=()=>{let resolve,reject;const finished=new Promise((yes,no)=>{resolve=yes;reject=no;});const animation={finished,cancel:()=>reject(new Error('cancelled')),finish:resolve};pending.push(animation);return animation;};
  f.run('for(const node of [...tileNodes.values(),turnFocus,...anchorMotionNodes,...anchorRingNodes])node.animate=__testAnimation;');
  return pending;
}
async function readyApp(options={}){
  const p=audioPlatform(),f=webFixture({...options,audioOptions:p.options});await f.start();
  await f.audioControllers[0].unlock();await flush();
  return {...p,f};
}

test('production UI click handler plays once, ignores hidden/disabled/spin buttons, and persists mute',async()=>{
  const {f,sources,context}=await readyApp();
  click(f,'cwBtn');await flush();assert.equal(sources.length,1);assert.equal(sources[0].buffer.kind,'button');
  f.el('hintBtn').disabled=true;click(f,'hintBtn');await flush();assert.equal(sources.length,1);
  f.el('hintBtn').disabled=false;
  f.document.dispatch('click',{target:f.run('anchorNodes[0]')});
  click(f,'settingsReset');await flush();assert.equal(sources.length,1,'hidden settings and spin hit regions do not receive generic UI foley');
  click(f,'settingsBtn');await flush();assert.equal(sources.length,2);
  click(f,'settingsSound');await flush();assert.equal(sources.length,2,'muting does not play an extra click');
  assert.equal(f.storage.getItem('fourfold:sound'),'false');assert.equal(context.state,'suspended');
  assert.equal(f.el('settingsSound').textContent,'音效：关');assert.equal(f.el('settingsSound').getAttribute('aria-pressed'),'false');
  click(f,'settingsSound');await flush();assert.equal(sources.length,3);assert.equal(f.storage.getItem('fourfold:sound'),'true');
  const muted=await readyApp({preferences:{sound:false}});click(muted.f,'cwBtn');await flush();assert.equal(muted.sources.length,0);
  f.audioControllers[0].dispose();muted.f.audioControllers[0].dispose();
});

test('production turn starts one sample and every cancel route stops it without committing the move',async()=>{
  for(const action of ['reset','home','settings','resize','hidden','pagehide']){
    const {f,sources}=await readyApp(),pending=wireAnimations(f),board=f.run('board');
    const turn=f.run('spin(0)');await flush();
    assert.equal(sources.length,1);assert.equal(sources[0].buffer.kind,'turn');
    await f.run('spin(0)');assert.equal(sources.length,1,'busy repeated taps cannot start a second sample');
    if(action==='reset')f.run('reset()');
    if(action==='home')f.run('showHome()');
    if(action==='settings')f.run('openSettings()');
    if(action==='resize')f.window.dispatch('resize');
    if(action==='hidden'){f.document.hidden=true;f.document.dispatch('visibilitychange');}
    if(action==='pagehide')f.window.dispatch('pagehide',{persisted:true});
    await turn;await flush();
    assert.equal(f.run('moves'),0,action);assert.equal(f.run('board'),board,action);
    assert.deepEqual(sources[0].stops.at(-1),[action==='hidden'||action==='pagehide'?0:.008],action+' stops foley at the cancellation');
    assert(pending.length>0);f.audioControllers[0].dispose();
  }
});

test('production hint gate is silent until a valid turn and reduced-motion completion does not add beeps',async()=>{
  const {f,sources}=await readyApp();
  f.run('hint()');await f.run('spin(0)');await flush();assert.equal(sources.length,0,'selecting a direction is required before turn audio');
  f.run('setDirection(hintGuide.dir)');f.window.matchMedia=()=>({matches:true});
  const pending=wireAnimations(f),turn=f.run('spin(hintGuide.q)');await flush();
  assert.equal(sources.length,1);assert.equal(sources[0].buffer.kind,'button');assert.equal(sources[0].starts[0][2],.12);
  pending.forEach(animation=>animation.finish());await turn;await flush();
  assert.equal(f.run('moves'),1);assert.equal(sources.length,1,'the completed turn and win do not layer old oscillator tones');
  f.audioControllers[0].dispose();
});
