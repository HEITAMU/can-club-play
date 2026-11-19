// @ts-nocheck
// Original preview11 music, instruments and sound recipes; platform context factory only.
import {soundRecipe} from '../domain/sound-effects';
import {SCORE,musicEvents,instrumentPCM} from '../domain/music-score';
export {SCORE};
export class GameAudio{
 constructor({createContext=()=>{const g=globalThis as any;if(g.wx?.createWebAudioContext)return g.wx.createWebAudioContext();const Context=g.AudioContext||g.webkitAudioContext;if(!Context)throw new Error('WebAudio unavailable');return new Context();},schedule=(fn,ms)=>globalThis.setInterval(fn,ms),cancel=id=>globalThis.clearInterval(id)}={}){Object.assign(this,{createContext,schedule,cancel});this.ctx=null;this.music=true;this.effects=true;this.hidden=false;this.scene='alley';this.buffers=new Map();this.cooldowns=new Map();this.step=0;this.timer=null;}
 configure({music=this.music,effects=this.effects,hidden=this.hidden,scene=this.scene}={}){const old=this.music;Object.assign(this,{music,effects,hidden,scene});if(!this.ctx)return;this.musicBus.gain.setTargetAtTime(music&&!hidden?.22:0,this.ctx.currentTime,.12);this.fxBus.gain.setTargetAtTime(effects&&!hidden?.6:0,this.ctx.currentTime,.04);if(hidden){if(this.timer!==null)this.cancel(this.timer);this.timer=null;Promise.resolve(this.ctx.suspend?.()).catch(()=>{});}else if((this.ctx.state===undefined||this.ctx.state==='running')){if(music&&!old)this.next=this.ctx.currentTime+.04;this.startClock();}}
 unlock(){try{if(!this.ctx){this.ctx=this.createContext();this.musicBus=this.ctx.createGain();this.fxBus=this.ctx.createGain();this.harmonyBus=this.ctx.createGain();this.harmonyBus.connect(this.musicBus);const limiter=this.ctx.createDynamicsCompressor();limiter.threshold.value=-16;limiter.ratio.value=5;this.musicBus.connect(limiter);this.fxBus.connect(limiter);
 const room=this.ctx.createConvolver(),wet=this.ctx.createGain(),sr=this.ctx.sampleRate,impulse=this.ctx.createBuffer(2,Math.ceil(sr*1.4),sr);
 let seed=1937;for(let channel=0;channel<2;channel++){const data=impulse.getChannelData(channel);for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const t=i/sr;data[i]=(seed/2147483648-1)*Math.exp(-t*5)*Math.min(1,t/.025);}}
 room.buffer=impulse;wet.gain.value=.12;const roomCut=this.ctx.createBiquadFilter();roomCut.type='highpass';roomCut.frequency.value=450;this.musicBus.connect(roomCut);roomCut.connect(room);room.connect(wet);wet.connect(limiter);limiter.connect(this.ctx.destination);this.musicBus.gain.value=this.music?.22:0;this.fxBus.gain.value=this.effects?.6:0;this.next=this.ctx.currentTime+.05;}if(this.hidden)return;Promise.resolve(this.ctx.resume?.()).then(()=>this.startClock()).catch(()=>{});}catch{}}
 startClock(){if(this.timer!==null||this.hidden)return;this.next=Math.max(this.next||0,this.ctx.currentTime+.03);this.timer=this.schedule(()=>this.tick(),80);this.tick();}
 sample(midi,kind='synth'){const key=kind+':'+midi;if(this.buffers.has(key))return this.buffers.get(key);const sr=Math.min(24000,this.ctx.sampleRate),pcm=instrumentPCM(midi,kind,sr),b=this.ctx.createBuffer(1,pcm.length,sr);b.getChannelData(0).set(pcm);this.buffers.set(key,b);return b;}
 note(midi,t,duration,gain,bus=this.musicBus,kind='synth',pan=0){
  const s=this.ctx.createBufferSource(),g=this.ctx.createGain();s.buffer=this.sample(midi,kind);
  g.gain.setValueAtTime(gain,t);g.gain.setTargetAtTime(0,t+duration,kind==='pad'?.18:kind==='bass'?.035:.06);s.connect(g);
  const p=this.ctx.createStereoPanner?.();if(p){p.pan.value=pan;g.connect(p);p.connect(bus);}else g.connect(bus);
  s.start(t);s.stop(t+duration+(kind==='pad'?1:.6));s.onended=()=>{s.disconnect();g.disconnect();p?.disconnect();};
 }
 noise(t,duration,gain,frequency,bus=this.fxBus,type='lowpass'){const b=this.ctx.createBuffer(1,Math.ceil(this.ctx.sampleRate*duration),this.ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=(Math.random()*2-1)*Math.exp(-i/a.length*7);const s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();s.buffer=b;f.type=type;f.frequency.value=frequency;g.gain.value=gain;s.connect(f);f.connect(g);g.connect(bus);s.start(t);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};}
 tick(){
  if(!this.ctx||this.hidden||(this.ctx.state!==undefined&&this.ctx.state!=='running')||!this.music)return;
  const unit=60/(this.scene==='battle'?116:108)/2;
  if(this.next<this.ctx.currentTime-.2)this.next=this.ctx.currentTime+.03;
  while(this.next<this.ctx.currentTime+.18){
   for(const e of musicEvents(this.step,this.scene)){
    const t=this.next+e.offset;
    if(e.kind==='hat'||e.kind==='clap'){this.noise(t,e.duration,e.gain,e.kind==='hat'?6500:1800,this.musicBus,'highpass');continue;}
    if(e.kind==='kick'&&this.harmonyBus){this.harmonyBus.gain.setValueAtTime(.4,t);this.harmonyBus.gain.linearRampToValueAtTime(1,t+.18);}
    const bus=['pad','synth','lead'].includes(e.kind)?this.harmonyBus||this.musicBus:this.musicBus;
    this.note(e.midi,t,e.duration,e.gain,bus,e.kind,e.pan);
   }
   this.step=(this.step+1)%128;this.next+=unit;
  }
 }
 sweep(t,{from,to,duration,gain,wave}){
  const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=wave;o.frequency.setValueAtTime(from,t);o.frequency.exponentialRampToValueAtTime(to,t+duration);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  o.connect(g);g.connect(this.fxBus);o.start(t);o.stop(t+duration+.01);o.onended=()=>{o.disconnect();g.disconnect();};
 }
 play(kind,details={}){
  if(!this.ctx||!this.effects||this.hidden||(this.ctx.state!==undefined&&this.ctx.state!=='running'))return;
  const layers=soundRecipe(kind,details);if(!layers.length)return;
  const t=this.ctx.currentTime,key=kind==='skill'?kind+':'+details.catId+':'+!!details.shieldPunch:kind,min=kind==='hit'?.11:kind==='click'?.07:.25;
  if(t-(this.cooldowns.get(key)??-100)<min)return;this.cooldowns.set(key,t);
  for(const layer of layers){if(layer.type==='tone')this.sweep(t,layer);else this.noise(t,layer.duration,layer.gain,layer.frequency,this.fxBus,layer.filter);}
 }
}

export const audio=new GameAudio();
