// Optional tactile audio. Every cue belongs to a current user action; a slow
// resume/load may be retried by another gesture, never by replaying an old cue.
import {createMediaAudio} from './media-audio.mjs?v=0.8.39';
export const AUDIO_BUILD='0.8.39';
export const SOUND_FILES=Object.freeze({
  button:new URL('./assets/audio/ui-tap-v5.mp3',import.meta.url).href,
  press:new URL('./assets/audio/rotary-detent-v8.mp3',import.meta.url).href,
  seat:new URL('./assets/audio/stone-seat-v5.mp3',import.meta.url).href,
});

export function createGameAudio({
  enabled=true,outputMode='standard',
  contextFactory=()=>{const Context=globalThis.AudioContext||globalThis.webkitAudioContext;return Context?new Context():null;},
  sessionFactory=()=>globalThis.navigator?.audioSession??null,
  mediaFactory=()=>new globalThis.Audio(),
  fetchAudio=url=>globalThis.fetch(url),
  now=()=>globalThis.performance?.now?.()??Date.now(),
  isVisible=()=>true,onStatus=()=>{},waitLimitMs=140,
}={}){
  outputMode=outputMode==='media'?'media':'standard';
  let context=null,disposed=false,suspending=null,activeTurn=null,media=null,mediaCue=null,unlockSerial=0;
  let sessionOwner=null,previousSessionType=null,sessionType='default',backend='web-audio',unlockState='idle';
  const raw=new Map(),decoded=new Map(),voices=new Map(),fading=new Set();
  const epochs={button:0,press:0,seat:0,test:0},cues={button:null,press:null,seat:null,test:null};
  const assets={button:'idle',press:'idle',seat:'idle'};
  const allowed=()=>enabled&&!disposed&&isVisible();
  const getDiagnostics=()=>({build:AUDIO_BUILD,enabled,mode:outputMode,backend,
    contextState:backend==='html-media'?(media?.getState()?.state||'idle'):(context?.state||'uncreated'),
    sessionType,unlockState,assets:{...assets},cues:Object.fromEntries(Object.entries(cues).map(([key,cue])=>[key,cue?{...cue}:null]))});
  const publish=()=>{try{onStatus(getDiagnostics());}catch{}};
  const record=(channel,state,reason='',delayMs=0)=>{cues[channel]={state,reason,delayMs};publish();};
  const bounded=(promise,timeout=waitLimitMs)=>new Promise(resolve=>{
    let settled=false;const timer=setTimeout(()=>finish({ok:false,reason:'timeout'}),timeout);
    function finish(value){if(settled)return;settled=true;clearTimeout(timer);resolve(value);}
    Promise.resolve(promise).then(value=>finish({ok:true,value}),error=>finish({ok:false,reason:error?.name||'error'}));
  });
  function releaseSession(){
    try{if(sessionOwner&&sessionOwner.type==='playback')sessionOwner.type=previousSessionType||'auto';}catch{}
    sessionOwner=null;previousSessionType=null;sessionType='default';
  }
  function chooseBackend(){
    if(outputMode!=='media'){backend='web-audio';return backend;}
    try{
      const session=sessionFactory();
      if(session){
        if(sessionOwner!==session){releaseSession();sessionOwner=session;previousSessionType=session.type;}
        session.type='playback';sessionType=session.type;
        if(session.type==='playback'){backend='web-audio';return backend;}
      }
      sessionType='unsupported';
    }catch{sessionType='unavailable';}
    backend='html-media';return backend;
  }
  function mediaPlayer(){
    if(!media)media=createMediaAudio({createElement:mediaFactory,files:SOUND_FILES,now,onStatus:(state,details={})=>{
      const cue=mediaCue;
      if(cue&&epochs[cue.channel]===cue.epoch){
        record(cue.channel,state==='request'?'requested':state,details.name||details.reason||'',Math.max(0,now()-cue.requestedAt));
        if(['ended','error','late','blocked'].includes(state)&&mediaCue===cue)mediaCue=null;
      }
    }});
    return media;
  }
  const bytes=kind=>{
    if(!raw.has(kind)){
      assets[kind]='loading';publish();
      const request=Promise.resolve().then(()=>fetchAudio(SOUND_FILES[kind])).then(response=>{
        if(!response.ok)throw new Error('Sound asset unavailable');
        return response.arrayBuffer();
      }).then(data=>{if(raw.get(kind)===request){assets[kind]='downloaded';publish();}return data;}).catch(()=>{
        if(raw.get(kind)===request){raw.delete(kind);assets[kind]='download-error';publish();}
        return null;
      });
      raw.set(kind,request);
    }
    return raw.get(kind);
  };
  const buffer=kind=>{
    if(!context)return Promise.resolve(null);
    const owner=context;
    if(!decoded.has(kind)){
      const request=bytes(kind),decoding=request.then(data=>{
        if(!data||disposed||context!==owner||owner.state==='closed')return null;
        return new Promise((resolve,reject)=>{
          const result=owner.decodeAudioData(data.slice(0),resolve,reject);
          result?.then(resolve,reject);
        });
      }).catch(()=>{
        if(raw.get(kind)===request){raw.delete(kind);assets[kind]='decode-error';publish();}
        return null;
      }).then(clip=>{
        if(decoded.get(kind)===decoding){
          if(!clip)decoded.delete(kind);
          else{assets[kind]='decoded';publish();}
        }
        return clip;
      });
      decoded.set(kind,decoding);
    }
    return decoded.get(kind);
  };
  const preload=()=>Promise.all(Object.keys(SOUND_FILES).map(bytes));
  async function unlock(){
    if(!allowed())return false;
    const attempt=++unlockSerial;
    try{
      // Media mode is an explicit settings choice. It may ignore the phone's
      // ringer switch; standard mode retains the browser's normal audio category.
      if(chooseBackend()==='html-media'){mediaPlayer();unlockState='media-ready';publish();return true;}
      if(!context){context=contextFactory();if(!context){unlockState='unsupported';publish();return false;}context.addEventListener?.('statechange',publish);}
      const owner=context;
      if(owner.state==='closed'){unlockState='closed';publish();return false;}
      for(const kind of Object.keys(SOUND_FILES))void buffer(kind);
      if(owner.state!=='running'||suspending){
        unlockState='resuming';publish();
        // Call synchronously on EACH new gesture. Never await a cached resume
        // or suspend Promise that may stay pending in an embedded mobile browser.
        const result=await bounded(owner.resume());
        if(attempt!==unlockSerial||context!==owner||!allowed())return false;
        unlockState=owner.state==='running'?'running':result.reason==='timeout'?'resume-timeout':'resume-blocked';
      }else unlockState='running';
      publish();return allowed()&&context===owner&&owner.state==='running';
    }catch{if(attempt===unlockSerial){unlockState='resume-error';publish();}return false;}
  }
  function release(voice){
    fading.delete(voice);voice.source.onended=null;
    try{voice.source.disconnect();voice.gain.disconnect();}catch{}
  }
  function stopVoice(channel,immediate=false){
    if(mediaCue?.channel===channel){mediaCue=null;try{media?.stop();}catch{}}
    const voice=voices.get(channel);if(!voice)return;
    voices.delete(channel);voice.source.onended=null;
    try{
      const time=context.currentTime;
      voice.gain.gain.cancelScheduledValues(time);
      voice.gain.gain.setValueAtTime(immediate?0:voice.volume,time);
      if(!immediate)voice.gain.gain.linearRampToValueAtTime(0,time+.008);
      voice.source.stop(time+(immediate?0:.008));
    }catch{}
    if(immediate)release(voice);
    else{fading.add(voice);voice.source.onended=()=>release(voice);}
  }
  function invalidate(channel,immediate=false){
    epochs[channel]++;stopVoice(channel,immediate);
    if(cues[channel]&&['requested','loading','starting','started'].includes(cues[channel].state))record(channel,'cancelled','cancelled');
  }
  function stopTurn(){activeTurn=null;invalidate('press');invalidate('seat');}
  function stopAll(){
    activeTurn=null;
    for(const channel of Object.keys(epochs))invalidate(channel,true);
    for(const voice of [...fading]){try{voice.source.stop(context.currentTime);}catch{}release(voice);}
    mediaCue=null;try{media?.stop();}catch{}
  }
  async function play(channel,kind,durationMs,volume){
    if(!allowed()){record(channel,'blocked',!enabled?'muted':disposed?'disposed':'hidden');return false;}
    const epoch=++epochs[channel],requestedAt=now();stopVoice(channel);
    record(channel,'requested');
    const current=()=>allowed()&&epochs[channel]===epoch;
    const fail=reason=>{if(current())record(channel,'failed',reason,Math.max(0,now()-requestedAt));return false;};
    try{
      if(chooseBackend()==='html-media'){
        // No await before media.play(): preserve the actual click's activation.
        const player=mediaPlayer();
        if(channel==='button'&&mediaCue&&mediaCue.channel!=='button')return fail('busy-audio');
        if(mediaCue){
          const old=mediaCue;mediaCue=null;player.stop();
          if(epochs[old.channel]===old.epoch){epochs[old.channel]++;record(old.channel,'cancelled','replaced');}
        }
        mediaCue={channel,epoch,requestedAt};unlockState='media-ready';publish();
        return await player.play(kind,volume,{isCurrent:current,maxDelayMs:waitLimitMs});
      }
      const unlocking=unlock(),pending=context?buffer(kind):null;
      if(!await unlocking)return fail(unlockState);
      // Waiting for decoding is also bounded. The cache can finish in the
      // background for the next tap, but this tap never lingers until it does.
      const loaded=await bounded(pending||buffer(kind),Math.max(0,waitLimitMs-(now()-requestedAt)));
      const clip=loaded.ok?loaded.value:null,late=Math.max(0,now()-requestedAt);
      if(!current())return false;
      if(!clip)return fail(assets[kind].endsWith('-error')?assets[kind]:'not-ready');
      if(context.state!=='running')return fail(context.state);
      if(late>waitLimitMs)return fail('late');
      const remaining=Math.min(clip.duration,durationMs/1000);if(remaining<.025)return fail('empty-clip');
      const source=context.createBufferSource(),gain=context.createGain(),time=context.currentTime;
      source.buffer=clip;source.connect(gain);gain.connect(context.destination);
      gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+Math.min(.006,remaining/4));
      gain.gain.setValueAtTime(volume,time+Math.max(.006,remaining-.018));gain.gain.linearRampToValueAtTime(0,time+remaining);
      const voice={source,gain,volume};voices.set(channel,voice);
      source.onended=()=>{
        if(voices.get(channel)===voice){voices.delete(channel);if(epochs[channel]===epoch)record(channel,'ended','',late);}
        release(voice);
      };
      source.start(time,0,remaining);source.stop(time+remaining);record(channel,'started','',late);
      return true;
    }catch(error){return fail(error?.name||'play-error');}
  }
  function playButton(){return play('button','button',260,.9);}
  function testSound(){return play('test','button',260,.9);}
  function beginTurn(){
    stopTurn();invalidate('button');invalidate('test');
    if(!allowed()){record('press','blocked',!enabled?'muted':'hidden');return null;}
    const token=activeTurn={};void play('press','press',260,1);return token;
  }
  function finishTurn(token){
    if(!token||token!==activeTurn)return Promise.resolve(false);
    activeTurn=null;invalidate('press');return play('seat','seat',360,1);
  }
  function setEnabled(value){enabled=!!value;if(!enabled)pause();publish();return enabled;}
  function setOutputMode(value){
    const next=value==='media'?'media':'standard';
    if(next!==outputMode){pause();outputMode=next;backend='web-audio';unlockState='idle';publish();}
    return outputMode;
  }
  function pause(){
    unlockSerial++;
    stopAll();try{media?.pause();}catch{}releaseSession();
    try{
      if(context&&context.state!=='closed'){
        const request=Promise.resolve(context.suspend()).catch(()=>{}).finally(()=>{if(suspending===request)suspending=null;publish();});
        suspending=request;
      }
    }catch{}
    publish();
  }
  function dispose(){
    disposed=true;unlockSerial++;stopAll();releaseSession();try{media?.dispose();}catch{}
    try{context?.removeEventListener?.('statechange',publish);context?.close()?.catch(()=>{});}catch{}
    context=null;decoded.clear();raw.clear();publish();
  }
  return {preload,unlock,playButton,testSound,beginTurn,finishTurn,stopTurn,stopAll,setEnabled,setOutputMode,getDiagnostics,pause,dispose};
}
