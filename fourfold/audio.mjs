// Short sampled foley shared with the native build. No sound is queued behind
// a slow download, a hidden page, a cancelled turn, or an old audio context.
export const SOUND_FILES=Object.freeze({
  button:new URL('./assets/audio/ui-stone-press-v3.mp3',import.meta.url).href,
  seat:new URL('./assets/audio/stone-seat-v3.mp3',import.meta.url).href,
});

export function createGameAudio({
  enabled=true,
  contextFactory=()=>{const Context=globalThis.AudioContext||globalThis.webkitAudioContext;return Context?new Context():null;},
  fetchAudio=url=>globalThis.fetch(url),
  now=()=>globalThis.performance?.now?.()??Date.now(),
  isVisible=()=>true,
}={}){
  let context=null,disposed=false,resuming=null,suspending=null,activeTurn=null;
  const raw=new Map(),decoded=new Map(),voices=new Map(),fading=new Set(),epochs={button:0,press:0,seat:0};
  const allowed=()=>enabled&&!disposed&&isVisible();
  const bytes=kind=>{
    if(!raw.has(kind)){
      const request=Promise.resolve().then(()=>fetchAudio(SOUND_FILES[kind])).then(response=>{
        if(!response.ok)throw new Error('Sound asset unavailable');
        return response.arrayBuffer();
      }).catch(()=>{
        if(raw.get(kind)===request)raw.delete(kind);
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
        // One decode call supports both the Promise API and the older prefixed
        // context's callbacks. Resolving twice is harmless; decoding twice is not.
        return new Promise((resolve,reject)=>{
          const result=owner.decodeAudioData(data.slice(0),resolve,reject);
          result?.then(resolve,reject);
        });
      }).catch(()=>{
        // A corrupt or interrupted response needs fresh bytes on a later gesture.
        if(raw.get(kind)===request)raw.delete(kind);
        return null;
      }).then(clip=>{
        if(!clip&&decoded.get(kind)===decoding)decoded.delete(kind);
        return clip;
      });
      decoded.set(kind,decoding);
    }
    return decoded.get(kind);
  };
  const preload=()=>Promise.all(Object.keys(SOUND_FILES).map(bytes));
  async function unlock(){
    if(!allowed())return false;
    try{
      if(!context){context=contextFactory();if(!context)return false;}
      if(context.state==='closed')return false;
      if(suspending)await suspending;
      if(!allowed()||!context||context.state==='closed')return false;
      // Decoding does not start playback. The context itself is created and
      // resumed only from a user gesture, including the first pointer down.
      for(const kind of Object.keys(SOUND_FILES))void buffer(kind);
      if(context.state==='suspended'||context.state==='interrupted'){
        if(!resuming)resuming=Promise.resolve(context.resume()).catch(()=>{}).finally(()=>{resuming=null;});
        await resuming;
      }
      return allowed()&&context.state==='running';
    }catch{return false;}
  }
  function release(voice){
    fading.delete(voice);voice.source.onended=null;
    try{voice.source.disconnect();voice.gain.disconnect();}catch{}
  }
  function stopVoice(channel,immediate=false){
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
  function stopTurn(){
    activeTurn=null;
    for(const channel of ['press','seat']){epochs[channel]++;stopVoice(channel);}
  }
  function stopAll(){
    activeTurn=null;
    for(const channel of Object.keys(epochs)){epochs[channel]++;stopVoice(channel,true);}
    // A context suspended during an 8ms cancellation fade must not replay that
    // fade on the next foreground gesture. Disconnect those retired voices too.
    for(const voice of [...fading]){try{voice.source.stop(context.currentTime);}catch{}release(voice);}
  }
  async function play(channel,kind,durationMs,volume){
    if(!allowed())return false;
    const epoch=++epochs[channel],requestedAt=now();
    stopVoice(channel);
    try{
      const unlocking=unlock(),pending=context?buffer(kind):null;
      if(!await unlocking)return false;
      // Keep this gesture's attempt even if it fails while the context resumes;
      // only a later gesture should retry, never a loop replaying an old action.
      const clip=await (pending||buffer(kind)),late=Math.max(0,now()-requestedAt);
      if(!clip||!allowed()||epochs[channel]!==epoch||context.state!=='running')return false;
      // These are contact sounds, so keep their attack intact. Never seek into
      // the tail or replay an old contact after a slow download/resume.
      if(late>140)return false;
      const remaining=Math.min(clip.duration,durationMs/1000);if(remaining<.025)return false;
      const source=context.createBufferSource(),gain=context.createGain(),time=context.currentTime;
      source.buffer=clip;source.connect(gain);gain.connect(context.destination);
      gain.gain.setValueAtTime(0,time);
      gain.gain.linearRampToValueAtTime(volume,time+Math.min(.006,remaining/4));
      gain.gain.setValueAtTime(volume,time+Math.max(.006,remaining-.018));
      gain.gain.linearRampToValueAtTime(0,time+remaining);
      const voice={source,gain,volume};voices.set(channel,voice);
      source.onended=()=>{
        if(voices.get(channel)===voice)voices.delete(channel);
        release(voice);
      };
      source.start(time,0,remaining);source.stop(time+remaining);
      return true;
    }catch{return false;}
  }
  function playButton(){return play('button','button',260,.9);}
  function beginTurn(){
    stopTurn();
    epochs.button++;stopVoice('button');
    if(!allowed())return null;
    const token=activeTurn={};
    void play('press','button',260,1);
    return token;
  }
  function finishTurn(token){
    if(!token||token!==activeTurn)return Promise.resolve(false);
    activeTurn=null;
    epochs.press++;stopVoice('press');
    // Only the caller that actually committed this animation can seat it.
    // There is deliberately no timer that can fire after a cancelled move.
    return play('seat','seat',360,1);
  }
  function setEnabled(value){enabled=!!value;if(!enabled)pause();return enabled;}
  function pause(){
    stopAll();
    try{if(context&&!suspending)suspending=Promise.resolve(context.suspend()).catch(()=>{}).finally(()=>{suspending=null;});}catch{}
  }
  function dispose(){disposed=true;stopAll();try{context?.close()?.catch(()=>{});}catch{}context=null;decoded.clear();raw.clear();}
  return {preload,unlock,playButton,beginTurn,finishTurn,stopTurn,stopAll,setEnabled,pause,dispose};
}
