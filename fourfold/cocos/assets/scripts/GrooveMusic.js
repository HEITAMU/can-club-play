// 月下回旋: original 32-bar score using the user's Pulsefront C6.27 voices.
// Shared by the web preview and Cocos Creator 3.8.8. No downloaded audio track.
import {PulsefrontVoice} from './PulsefrontVoice.js';
export const MUSIC_BUILD='0.8.38',MUSIC_TITLE='月下回旋';
export function stepTime(track,step){
  const beat=Math.floor(step/4),part=step%4,s=track.swing;
  return (beat+[0,(.5+s)/2,.5+s,.75+s/2][part])*track.beat;
}
export function createGrooveTrack(){
  const track={title:MUSIC_TITLE,bpm:100,beat:.6,swing:.045,bars:32,events:[]};
  const harmony=[
    [40,[55,59,62,66]],[33,[55,59,61,66]],
    [38,[54,57,61,64]],[35,[54,57,61,62]],
    [40,[55,59,62,66]],[33,[55,59,61,66]],
    [36,[52,55,59,62]],[35,[54,57,63,66]],
  ];
  // Each tuple is sixteenth-note position, MIDI pitch and sounding duration.
  // A written question/answer hook, not randomly selected scale notes.
  const a=[
    [[0,64,.32],[3,67,.23],[6,69,.24],[9,71,.46],[13,69,.27]],
    [[1,67,.36],[4,64,.26],[7,66,.29],[10,64,.44],[14,61,.24]],
    [[0,66,.32],[3,69,.23],[6,71,.24],[9,69,.46],[13,66,.27]],
    [[1,64,.29],[4,62,.44],[9,66,.28],[12,62,.38],[15,59,.21]],
    [[0,64,.32],[3,67,.23],[6,69,.24],[9,71,.52]],
    [[1,69,.30],[4,67,.24],[7,66,.31],[10,64,.43],[14,61,.24]],
    [[0,64,.34],[3,67,.23],[6,71,.31],[10,67,.48],[14,62,.24]],
    [[1,66,.32],[4,63,.27],[7,66,.29],[10,59,.47],[14,63,.24]],
  ];
  const b=[
    [[2,71,.48],[7,69,.34],[11,67,.51]],
    [[0,66,.42],[6,64,.33],[10,61,.49],[14,64,.23]],
    [[1,69,.39],[6,66,.33],[10,64,.50]],
    [[2,66,.32],[6,62,.48],[12,61,.32],[15,62,.20]],
    [[0,67,.39],[5,66,.29],[9,64,.56]],
    [[2,64,.34],[6,66,.37],[11,67,.48]],
    [[0,67,.40],[5,64,.29],[9,62,.54]],
    [[2,66,.32],[6,63,.38],[11,59,.32],[14,63,.24]],
  ];
  const roleGain={lead:2,chord:1.75,bass:.86,drum:.78,answer:1.2};
  const add=(step,instrument,midi,duration,velocity,role,offset=0)=>
    track.events.push({step,instrument,midi,duration,velocity:velocity*roleGain[role],role,offset});
  for(let bar=0;bar<32;bar++){
    const base=bar*16,section=Math.floor(bar/8),phrase=bar%8,space=section===2;
    const [root,chord]=harmony[phrase];
    for(const [step,v] of [[0,.57],[6,.34],[10,.43]])add(base+step,'kick',0,.18,v,'drum');
    for(const step of [4,12])add(base+step,'snare',0,.11,space?.37:.43,'drum',.006);
    if(bar%4===3)add(base+11,'snare',0,.055,.12,'drum',.004);
    for(const step of [0,2,4,6,8,10,12,14]){
      if(space&&step%4===0)continue;
      add(base+step,'hat',0,.028,step%4===2?.25:.13,'drum',step%4===2?.003:0);
    }
    for(const [step,interval,duration] of [[0,0,.35],[3,7,.19],[6,12,.24],[10,7,.27],[12,0,.29],[15,10,.16]]){
      if(space&&step===6)continue;
      const midi=step===15?harmony[(phrase+1)%8][0]-1:root+interval;
      add(base+step,'finger',midi,duration,step===0?.57:step===12?.48:.42,'bass',.002);
    }
    for(const step of (space?[2,10]:[2,7,12]))chord.forEach((midi,index)=>
      add(base+step,'rhodes',midi,step===12?.29:.34,.19+(index===3?.015:0),'chord',index*.002));
    const melody=space?b[phrase]:a[phrase];
    melody.forEach(([step,midi,duration],n)=>add(base+step,'piano',midi,duration,
      (n===0?.72:.63)*(section===1?.94:1),'lead',n%2===1?.003:0));
    if(section===1&&phrase%2===0)add(base+14,'guitar',chord[2],.17,.18,'answer');
    if(section===3&&phrase%2===1&&phrase!==7)add(base+15,'guitar',chord[1]+12,.16,.15,'answer');
  }
  track.duration=track.bars*4*track.beat;
  track.events.forEach(event=>{event.time=stepTime(track,event.step)+event.offset;});
  track.events.sort((x,y)=>x.time-y.time);return track;
}

// The same platform order as Pulsefront: native WeChat Web Audio, then browser.
export function createMusicContext(){
  const scope=typeof globalThis!=='undefined'?globalThis:{};
  const host=typeof wx!=='undefined'?wx:scope.wx;
  if(host&&typeof host.createWebAudioContext==='function'){
    try{const c=host.createWebAudioContext();if(c&&c.createGain)return c;}catch{}
  }
  const gg=scope.GameGlobal||{},win=scope.window||{};
  for(const C of [scope.AudioContext,scope.webkitAudioContext,gg.AudioContext,gg.webkitAudioContext,win.AudioContext,win.webkitAudioContext]){
    if(typeof C==='function')try{const c=new C();if(c.createGain)return c;}catch{}
  }
  return null;
}
export const createGrooveVoice=(context,destination=context.destination)=>new PulsefrontVoice(context,destination);

export function createBackgroundMusic({enabled=true,contextFactory=createMusicContext,isVisible=()=>true,
  track=createGrooveTrack(),setTimer=(fn,ms)=>setInterval(fn,ms),clearTimer=id=>clearInterval(id)}={}){
  let context=null,voice=null,gate=null,timer=null,disposed=false,activated=false,running=false;
  let origin=0,position=0,next=0,epoch=0,pending=null,lastError='';
  const allowed=()=>enabled&&activated&&!disposed&&isVisible();
  const currentPosition=()=>running&&context?Math.max(0,context.currentTime-origin):position;
  function pause(){
    epoch++;pending=null;position=currentPosition()%track.duration;running=false;
    if(timer!==null){clearTimer(timer);timer=null;}
    if(gate&&context){const now=context.currentTime;gate.gain.cancelScheduledValues(now);gate.gain.setValueAtTime(gate.gain.value,now);gate.gain.linearRampToValueAtTime(0,now+.035);}
    if(voice)voice.stopAll();
  }
  function schedule(){
    if(!running||!context)return;
    if(!allowed()||(context.state&&context.state!=='running'&&context.state!=='default')){pause();return;}
    voice.reapVoices();const events=track.events,total=events.length,now=context.currentTime;
    const relative=Math.max(0,now-origin);
    // A delayed frame skips missed notes rather than firing a loud catch-up burst.
    if(origin+Math.floor(next/total)*track.duration+events[next%total].time<now-.12){
      const cycle=Math.floor(relative/track.duration),within=relative%track.duration;
      const index=events.findIndex(event=>event.time>=within-.008);
      next=index<0?(cycle+1)*total:cycle*total+index;
    }
    for(;;){
      const event=events[next%total],at=origin+Math.floor(next/total)*track.duration+event.time;
      if(at>=now+.14)break;
      if(at>=now-.012)voice.note(event,Math.max(at,now));next++;
    }
  }
  function start(){
    if(running)return true;
    const now=context.currentTime;origin=now-position+.045;
    const index=track.events.findIndex(event=>event.time>=position);next=index<0?track.events.length:index;
    gate.gain.cancelScheduledValues(now);gate.gain.setValueAtTime(0,now);gate.gain.linearRampToValueAtTime(1,now+.10);
    running=true;schedule();
    timer=setTimer(()=>{try{schedule();}catch(error){lastError=String(error.message||error);pause();}},25);return true;
  }
  function ensure(){
    if(context&&context.state!=='closed')return;
    if(context)pause();
    if(voice)voice.dispose();context=contextFactory();
    if(!context)throw new Error('Web Audio unavailable');
    gate=context.createGain();gate.gain.value=0;gate.connect(context.destination);voice=createGrooveVoice(context,gate);
  }
  async function resume({gesture=false}={}){
    if(gesture)activated=true;if(!allowed())return false;
    let attemptEpoch=epoch;
    try{
      ensure();
      attemptEpoch=epoch;
      if(running&&(context.state==='running'||context.state==='default'||!context.state))return true;
      let resuming;
      // This call remains in the synchronous part of the real user gesture.
      if(typeof context.resume==='function'&&context.state!=='running'&&context.state!=='default')resuming=context.resume();
      if(pending){if(resuming&&resuming.catch)resuming.catch(()=>{});return pending.catch(()=>false);}
      const ticket=epoch,owner=context;
      const attempt=(async()=>{
        if(resuming)await new Promise((resolve,reject)=>{
          const timeout=setTimeout(()=>reject(new Error('Music resume timed out')),1200);
          Promise.resolve(resuming).then(value=>{clearTimeout(timeout);resolve(value);},error=>{clearTimeout(timeout);reject(error);});
        });
        if(ticket!==epoch||context!==owner||!allowed())return false;
        if(context.state&&context.state!=='running'&&context.state!=='default')return false;
        lastError='';return start();
      })();
      pending=attempt;try{return await attempt;}finally{if(pending===attempt)pending=null;}
    }catch(error){if(attemptEpoch===epoch){lastError=String(error.message||error);pause();}return false;}
  }
  function setEnabled(value){enabled=!!value;if(!enabled)pause();return enabled;}
  function dispose(){
    disposed=true;pause();if(voice)voice.dispose();voice=null;
    try{if(gate)gate.disconnect();if(context&&context.close){const p=context.close();if(p&&p.catch)p.catch(()=>{});}}catch{}
    context=null;gate=null;
  }
  const getState=()=>({build:MUSIC_BUILD,title:MUSIC_TITLE,backend:'realtime-web-audio',enabled,activated,running,disposed,
    contextState:context?context.state:'uncreated',position:currentPosition()%track.duration,duration:track.duration,bpm:track.bpm,
    activeVoices:voice?voice.nodes.size:0,timers:timer===null?0:1,lastError});
  return {resume,pause,setEnabled,dispose,getState};
}
