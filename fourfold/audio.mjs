// Short sampled foley shared with the native build. No sound is queued behind
// a slow download, a hidden page, a cancelled turn, or an old audio context.
export const SOUND_FILES=Object.freeze({
  button:new URL('./assets/audio/ui-stone-press-v1.mp3',import.meta.url).href,
  turn:new URL('./assets/audio/stone-turn-v1.mp3',import.meta.url).href,
});

export function createGameAudio({
  enabled=true,
  contextFactory=()=>{const Context=globalThis.AudioContext||globalThis.webkitAudioContext;return Context?new Context():null;},
  fetchAudio=url=>globalThis.fetch(url),
  now=()=>globalThis.performance?.now?.()??Date.now(),
  isVisible=()=>true,
}={}){
  let context=null,disposed=false,resuming=null,suspending=null;
  const raw=new Map(),decoded=new Map(),voices=new Map(),fading=new Set(),epochs={button:0,turn:0};
  const allowed=()=>enabled&&!disposed&&isVisible();
  const bytes=kind=>{
    if(!raw.has(kind))raw.set(kind,Promise.resolve().then(()=>fetchAudio(SOUND_FILES[kind])).then(response=>{
      if(!response.ok)throw new Error('Sound asset unavailable');
      return response.arrayBuffer();
    }).catch(()=>null));
    return raw.get(kind);
  };
  const buffer=kind=>{
    if(!context)return Promise.resolve(null);
    const owner=context;
    if(!decoded.has(kind))decoded.set(kind,bytes(kind).then(data=>{
      if(!data||disposed||context!==owner||owner.state==='closed')return null;
      return owner.decodeAudioData(data.slice(0));
    }).catch(()=>null));
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
      if(context.state==='suspended'){
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
  function stopTurn(){epochs.turn++;stopVoice('turn');}
  function stopAll(){
    epochs.button++;epochs.turn++;stopVoice('button',true);stopVoice('turn',true);
    // A context suspended during an 8ms cancellation fade must not replay that
    // fade on the next foreground gesture. Disconnect those retired voices too.
    for(const voice of [...fading]){try{voice.source.stop(context.currentTime);}catch{}release(voice);}
  }
  async function play(channel,kind,durationMs){
    if(!allowed())return false;
    const epoch=++epochs[channel],requestedAt=now();
    stopVoice(channel);
    try{
      if(!await unlock())return false;
      const clip=await buffer(kind),late=Math.max(0,now()-requestedAt);
      if(!clip||!allowed()||epochs[channel]!==epoch||context.state!=='running')return false;
      // A delayed foley cue must never arrive after the visual action. Turns
      // may join the sample at its current offset after a short decode delay.
      if(late>(channel==='turn'?160:140))return false;
      const total=Math.min(clip.duration,durationMs/1000),offset=channel==='turn'?late/1000:0;
      const remaining=total-offset;if(remaining<.025)return false;
      const source=context.createBufferSource(),gain=context.createGain(),time=context.currentTime;
      const volume=channel==='turn'?.82:.62;
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
      source.start(time,offset,remaining);source.stop(time+remaining);
      return true;
    }catch{return false;}
  }
  function playButton(){return play('button','button',320);}
  function playTurn(durationMs=1200){
    epochs.button++;stopVoice('button');
    // Reduced-motion transitions get a short stone contact, not a squeaky
    // ten-times-speed rendition of the full slab movement.
    return play('turn',durationMs<300?'button':'turn',Math.max(0,durationMs));
  }
  function setEnabled(value){enabled=!!value;if(!enabled)pause();return enabled;}
  function pause(){
    stopAll();
    try{if(context&&!suspending)suspending=Promise.resolve(context.suspend()).catch(()=>{}).finally(()=>{suspending=null;});}catch{}
  }
  function dispose(){disposed=true;stopAll();try{context?.close()?.catch(()=>{});}catch{}context=null;decoded.clear();raw.clear();}
  return {preload,unlock,playButton,playTurn,stopTurn,stopAll,setEnabled,pause,dispose};
}
