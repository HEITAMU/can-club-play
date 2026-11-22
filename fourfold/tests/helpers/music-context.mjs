// Observe real scheduling/cleanup commands without claiming device audio output.
export function musicContext(){
  const timers=new Map(),sources=[],active=new Set();let serial=0,created=0;
  const param=()=>({value:0,setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;},cancelScheduledValues(){}});
  const node=()=>({gain:param(),frequency:param(),Q:param(),pan:param(),detune:param(),threshold:param(),knee:param(),ratio:param(),attack:param(),release:param(),connect(){},disconnect(){this.disconnected=true;}});
  const source=()=>{const s={...node(),start(t){this.started=t;},stop(t){this.stopped=t;}};sources.push(s);active.add(s);return s;};
  const context={currentTime:0,state:'running',sampleRate:22050,destination:node(),
    createGain:node,createOscillator:source,createBufferSource:source,createBiquadFilter:node,createStereoPanner:node,createDynamicsCompressor:node,
    createBuffer:(channels,length)=>({getChannelData:()=>new Float32Array(length),copyToChannel(){}}),
    resume(){this.state='running';return Promise.resolve();},close(){this.state='closed';return Promise.resolve();}};
  const options={contextFactory:()=>{created++;return context;},setTimer:fn=>{const id=++serial;timers.set(id,fn);return id;},clearTimer:id=>timers.delete(id)};
  function advance(seconds){context.currentTime+=seconds;for(const s of active)if(s.stopped<=context.currentTime){active.delete(s);if(s.onended)s.onended();}for(const fn of [...timers.values()])fn();}
  return {context,options,timers,sources,advance,get created(){return created;}};
}
