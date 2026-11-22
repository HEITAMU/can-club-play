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
    decodeAudioData(bytes,...callbacks){return decodeAudioData?decodeAudioData(bytes,...callbacks):Promise.resolve({kind:new Uint8Array(bytes)[0]===2?'seat':'button',duration:new Uint8Array(bytes)[0]===2?.32:.24});},
    createGain(){return {gain:param(),connect(){},disconnect(){this.disconnected=true;}};},
    createBufferSource(){const source={starts:[],stops:[],connect(){},disconnect(){this.disconnected=true;},start(...args){this.starts.push(args);},stop(...args){this.stops.push(args);}};sources.push(source);return source;},
  };
  const response=url=>({ok:true,arrayBuffer:async()=>Uint8Array.of(url===SOUND_FILES.seat?2:1).buffer});
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

test('a later gesture retries failed downloads or decodes and reuses the recovered sample',async()=>{
  for(const failure of ['download','decode']){
    let available=false;
    const p=audioPlatform({
      fetchAudio:async(url,response)=>failure==='download'&&!available&&url===SOUND_FILES.button?{ok:false}:response(url),
      decodeAudioData:async bytes=>{
        const seat=new Uint8Array(bytes)[0]===2;
        if(failure==='decode'&&!available&&!seat)throw new Error('temporary decode failure');
        return {kind:seat?'seat':'button',duration:seat?.32:.24};
      },
    });
    const audio=createGameAudio(p.options);await audio.preload();
    assert.equal(await audio.playButton(),false,failure);assert.equal(p.sources.length,0);
    const before=p.fetches.filter(url=>url===SOUND_FILES.button).length;
    available=true;
    assert.equal(await audio.playButton(),true,failure+' recovers on a new gesture');
    assert.equal(p.sources.length,1,'recovery never replays the failed click');
    assert.equal(p.fetches.filter(url=>url===SOUND_FILES.button).length,before+1,'recovery gets fresh bytes');
    assert.equal(await audio.playButton(),true);
    assert.equal(p.fetches.filter(url=>url===SOUND_FILES.button).length,before+1,'the recovered clip is cached');
    audio.dispose();
  }
});

test('a recovering load cannot replay a late or cancelled gesture',async()=>{
  for(const end of ['late','cancelled']){
    let attempts=0,finishRetry;
    const p=audioPlatform({fetchAudio:(url,response)=>{
      if(url!==SOUND_FILES.button)return response(url);
      if(++attempts===1)throw new Error('temporary network failure');
      return new Promise(resolve=>{finishRetry=()=>resolve(response(url));});
    }});
    const audio=createGameAudio(p.options);
    assert.equal(await audio.playButton(),false);assert.equal(attempts,1);
    const retry=audio.playButton();await flush();assert.equal(attempts,2);
    if(end==='late')p.clock.ms=400;else audio.stopAll();
    finishRetry();assert.equal(await retry,false,end);assert.equal(p.sources.length,0);
    assert.equal(await audio.playButton(),true,'a fresh gesture can use the successfully recovered clip');
    assert.equal(p.sources.length,1);assert.equal(attempts,2);
    audio.dispose();
  }
});

test('a turn presses once and seats only when its one-use completion token is committed',async()=>{
  const p=audioPlatform(),audio=createGameAudio(p.options);await audio.preload();await audio.playButton();
  const token=audio.beginTurn();await flush();
  assert.deepEqual(p.sources[0].stops.at(-1),[.008]);
  assert.equal(p.sources[1].buffer.kind,'button');assert.deepEqual(p.sources[1].starts[0],[0,0,.24]);
  p.clock.ms=5000;await flush();assert.equal(p.sources.length,2,'elapsed time alone never schedules a landing');
  assert.equal(await audio.finishTurn({}),false,'an unrelated caller cannot complete this turn');
  assert.equal(await audio.finishTurn(token),true);
  assert.equal(p.sources[2].buffer.kind,'seat');assert.deepEqual(p.sources[2].starts[0],[5,0,.32]);
  assert.equal(await audio.finishTurn(token),false,'duplicate completion cannot repeat the landing');
  assert.equal(p.sources.length,3);
  const next=audio.beginTurn();await flush();assert.deepEqual(p.sources[2].stops.at(-1),[5.008],'a new turn retires the preceding landing tail');
  assert.equal(await audio.finishTurn(token),false,'an old completion cannot seat a newer turn');
  audio.stopTurn();assert.equal(await audio.finishTurn(next),false);
  audio.dispose();
});

test('pending turn samples cannot play after cancellation, mute, hidden page, or disposal',async()=>{
  for(const action of ['cancel','mute','hidden','dispose']){
    const pending=[];let visible=true;
    const p=audioPlatform({fetchAudio:(url,response)=>new Promise(resolve=>pending.push(()=>resolve(response(url))))});
    const audio=createGameAudio({...p.options,isVisible:()=>visible});
    const token=audio.beginTurn();await flush();
    if(action==='cancel')audio.stopTurn();
    if(action==='mute')audio.setEnabled(false);
    if(action==='hidden'){visible=false;audio.pause();}
    if(action==='dispose')audio.dispose();
    pending.forEach(resolve=>resolve());
    await flush();assert.equal(await audio.finishTurn(token),false,action);assert.equal(p.sources.length,0,action+' must not replay a late cue');
    audio.dispose();
  }
});

test('a brief loading delay preserves the contact attack while slow loading drops the obsolete cue',async()=>{
  for(const delay of [90,400]){
    const pending=[];
    const p=audioPlatform({fetchAudio:(url,response)=>new Promise(resolve=>pending.push(()=>resolve(response(url))))});
    const audio=createGameAudio(p.options);audio.beginTurn();await flush();p.clock.ms=delay;pending.forEach(resolve=>resolve());await flush();
    if(delay===90){assert.equal(p.sources.length,1);assert.equal(p.sources[0].starts[0][1],0);assert.equal(p.sources[0].starts[0][2],.24);}
    else assert.equal(p.sources.length,0);
    audio.dispose();
  }
});

test('mute cancels active voices, quick re-enable resumes safely, and unsupported/failed audio stays optional',async()=>{
  const p=audioPlatform(),audio=createGameAudio(p.options),token=audio.beginTurn();await flush();
  audio.setEnabled(false);assert.deepEqual(p.sources[0].stops.at(-1),[0]);assert.equal(p.sources[0].disconnected,true);assert.equal(await audio.playButton(),false);
  audio.setEnabled(true);assert.equal(await audio.playButton(),true);assert.equal(p.context.state,'running');assert.equal(await audio.finishTurn(token),false,'unmuting cannot resurrect an old landing');audio.dispose();
  for(const options of [
    {...p.options,contextFactory:()=>null},
    audioPlatform({fetchAudio:async()=>{throw new Error('offline');}}).options,
    audioPlatform({decodeAudioData:async()=>{throw new Error('bad audio');}}).options,
  ]){const optional=createGameAudio(options);assert.equal(await optional.playButton(),false);optional.dispose();}
});

test('a fresh gesture resumes an interrupted context and callback-only decoders remain supported',async()=>{
  let decodes=0;
  const p=audioPlatform({decodeAudioData:(bytes,resolve)=>{decodes++;queueMicrotask(()=>resolve({kind:new Uint8Array(bytes)[0]===2?'seat':'button',duration:.24}));}});
  p.context.state='interrupted';const audio=createGameAudio(p.options);
  const first=audio.playButton();assert.equal(p.context.resumeCount,1,'resume is requested synchronously inside the initiating gesture');
  assert.equal(await first,true);assert.equal(p.sources.length,1);assert.equal(decodes,2,'each asset is decoded once through the legacy callback API');
  p.context.state='interrupted';assert.equal(await audio.playButton(),true);assert.equal(p.context.resumeCount,2);assert.equal(decodes,2);
  audio.dispose();
});

test('a landing still loading cannot leak out after cancellation or mute',async()=>{
  for(const action of ['cancel','mute']){
    let resolveSeat;
    const p=audioPlatform({fetchAudio:(url,response)=>url===SOUND_FILES.seat?new Promise(resolve=>{resolveSeat=()=>resolve(response(url));}):response(url)});
    const audio=createGameAudio(p.options),token=audio.beginTurn();await flush();assert.equal(p.sources.length,1);
    const landing=audio.finishTurn(token);await flush();
    if(action==='cancel')audio.stopTurn();else audio.setEnabled(false);
    resolveSeat();assert.equal(await landing,false);assert.equal(p.sources.length,1);
    audio.dispose();
  }
});

function click(f,id){const button=f.el(id);f.document.dispatch('click',{target:button});button.click();}
function wireAnimations(f){
  const pending=[];
  f.context.__testAnimation=(frames,options)=>{let resolve,reject;const finished=new Promise((yes,no)=>{resolve=yes;reject=no;});const animation={finished,duration:options.duration,cancel:()=>reject(new Error('cancelled')),finish:resolve};pending.push(animation);return animation;};
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

test('production turn starts one press and every cancel route prevents a landing or committed move',async()=>{
  for(const action of ['reset','home','settings','resize','hidden','pagehide']){
    const {f,sources}=await readyApp(),pending=wireAnimations(f),board=f.run('board');
    const turn=f.run('spin(0)');await flush();
    assert.equal(sources.length,1);assert.equal(sources[0].buffer.kind,'button');
    await f.run('spin(0)');assert.equal(sources.length,1,'busy repeated taps cannot start a second sample');
    if(action==='reset')f.run('reset()');
    if(action==='home')f.run('showHome()');
    if(action==='settings')f.run('openSettings()');
    if(action==='resize')f.window.dispatch('resize');
    if(action==='hidden'){f.document.hidden=true;f.document.dispatch('visibilitychange');}
    if(action==='pagehide')f.window.dispatch('pagehide',{persisted:true});
    await turn;await flush();
    assert.equal(f.run('moves'),0,action);assert.equal(f.run('board'),board,action);
    pending.forEach(animation=>animation.finish());await flush();assert.equal(sources.length,1,action+' cannot produce a delayed landing');
    assert.deepEqual(sources[0].stops.at(-1),[action==='hidden'||action==='pagehide'?0:.008],action+' stops foley at the cancellation');
    assert(pending.length>0);f.audioControllers[0].dispose();
  }
});

test('full and gentle production animations last 2400ms regardless of OS preference and only a completed board commit seats',async()=>{
  for(const reduced of [false,true])for(const turnMotion of ['full','gentle']){
    const {f,sources,clock}=await readyApp({preferences:{turnMotion}});
    f.run('hint()');await f.run('spin(0)');await flush();assert.equal(sources.length,0,'selecting a direction is required before turn audio');
    f.run('setDirection(hintGuide.dir)');f.window.matchMedia=()=>({matches:reduced});
    const pending=wireAnimations(f),turn=f.run('spin(hintGuide.q)'),duration=2400;await flush();
    assert(pending.every(animation=>animation.duration===duration));
    assert.equal(sources.length,1);assert.equal(sources[0].buffer.kind,'button');assert.equal(sources[0].starts[0][2],.24);
    clock.ms=duration-1;await flush();assert.equal(sources.length,1);assert.equal(f.run('moves'),0);
    clock.ms=duration;pending.forEach(animation=>animation.finish());await turn;await flush();
    assert.equal(f.run('moves'),1);assert.equal(sources.length,2);assert.equal(sources[1].buffer.kind,'seat');assert.deepEqual(sources[1].starts[0],[duration/1000,0,.32]);
    f.run('render()');await flush();assert.equal(sources.length,2,'normal redraw cannot replay completion');assert.equal(sources[1].disconnected,undefined,'normal redraw preserves the landing tail');
    f.audioControllers[0].dispose();
  }
});
