// Explicitly selected media playback for environments without AudioSession.
// Keep one real, audible media element: no silent tracks, loops, or keepalive.
export function createMediaAudio({
  createElement=()=>new Audio(),
  files={},
  now=()=>globalThis.performance?.now?.()??Date.now(),
  onStatus=()=>{},
}={}){
  let element=null,source='',active=null,serial=0,disposed=false;
  let phase='idle',lastKind=null,lastError=null;
  const clock=()=>{try{return Number(now())||0;}catch{return 0;}};
  const valid=request=>{
    if(disposed||active!==request)return false;
    try{return !!request.isCurrent();}catch{return false;}
  };
  function report(next,request,details={}){
    phase=next;lastKind=request?.kind??lastKind;
    lastError=next==='error'||next==='blocked'?details.name||details.reason||next:null;
    try{onStatus(next,{serial:request?.serial??serial,kind:request?.kind??null,elapsedMs:request?Math.max(0,clock()-request.at):0,...details});}catch{}
  }
  function pauseElement(){try{element?.pause();}catch{}}
  function settle(request,value){
    if(request.settled)return;
    request.settled=true;request.resolve(value);
  }
  function detach(request){
    clearTimeout(request.timer);request.timer=null;
    for(const [type,handler] of request.listeners)try{element?.removeEventListener(type,handler);}catch{}
    request.listeners=[];
  }
  function retire(request){
    if(active!==request)return;
    active=null;detach(request);pauseElement();settle(request,false);
  }
  function fail(request,next,details){
    if(active!==request)return;
    retire(request);report(next,request,details);
  }
  function sourceMatches(request){
    // During a source change, a queued event may still belong to the old file.
    return !element.currentSrc||element.currentSrc===request.source;
  }
  function accept(request){
    if(active!==request){if(!active)pauseElement();return;}
    if(request.started)return;
    if(!valid(request)){fail(request,'blocked',{reason:'stale'});return;}
    if(clock()-request.at>request.maxDelayMs){fail(request,'late',{reason:'deadline'});return;}
    if(!sourceMatches(request)){fail(request,'blocked',{reason:'source-changed'});return;}
    request.started=true;clearTimeout(request.timer);request.timer=null;
    settle(request,true);report('started',request);
  }
  function reject(request,error){
    if(active!==request)return;
    const name=error?.name||'MediaError';
    fail(request,name==='NotAllowedError'?'blocked':'error',{name,reason:'play-rejected',message:String(error?.message||'Media playback failed')});
  }
  function orphanPlaying(){
    // pause() normally aborts pending play(), but also stop a late native event
    // after cancellation. Do not let an old Promise pause a newer request.
    if(!active||disposed)pauseElement();
  }
  function ensureElement(){
    if(element)return element;
    const created=createElement();
    if(!created||typeof created.play!=='function'||typeof created.pause!=='function'||typeof created.addEventListener!=='function')throw new Error('Media playback unavailable');
    element=created;element.loop=false;element.preload='auto';
    element.addEventListener('playing',orphanPlaying);
    return element;
  }
  function stop(){
    serial++;
    if(active)retire(active);else pauseElement();
  }
  function play(kind,volume=1,{isCurrent=()=>true,maxDelayMs=140}={}){
    if(disposed)return Promise.resolve(false);
    // An already obsolete caller must not interrupt a newer, valid contact.
    try{if(!isCurrent())return Promise.resolve(false);}catch{return Promise.resolve(false);}
    stop();
    const request={serial:++serial,kind,at:clock(),isCurrent,
      maxDelayMs:Number.isFinite(maxDelayMs)?Math.max(0,maxDelayMs):140,
      started:false,settled:false,promiseMode:null,sawPlaying:false,listeners:[],timer:null,resolve:null,source:''};
    const result=new Promise(resolve=>{request.resolve=resolve;});active=request;
    if(!valid(request)){fail(request,'blocked',{reason:'stale'});return result;}
    const file=(kind==='button'||kind==='press'||kind==='seat')?files[kind]:null;
    if(typeof file!=='string'||!file){fail(request,'error',{name:'NotSupportedError',reason:'missing-source'});return result;}
    report('request',request);
    // Status observers may synchronously cancel or dispose this request.
    if(active!==request)return result;
    try{
      const media=ensureElement();
      const changed=source!==file;
      if(changed){media.src=file;source=file;}
      else if(media.error)media.load?.();
      media.loop=false;media.muted=false;
      media.volume=Number.isFinite(volume)?Math.min(1,Math.max(0,volume)):1;
      // A repeat tap starts at the contact attack. If an old WebView refuses
      // an early seek, reset the same resource before this gesture's play().
      try{media.currentTime=0;}catch{if(!changed)media.src=file;}
      request.source=media.src;
      const playing=()=>{
        if(active!==request)return;
        if(!valid(request)){fail(request,'blocked',{reason:'stale'});return;}
        if(clock()-request.at>request.maxDelayMs&&!request.started){fail(request,'late',{reason:'deadline'});return;}
        if(!sourceMatches(request)||media.paused||media.ended)return;
        request.sawPlaying=true;
        // Modern play() Promises identify this request precisely. A queued
        // playing event alone must not mark a newer Promise as successful.
        if(request.promiseMode===false)accept(request);
      };
      const ended=()=>{
        if(active!==request||!request.started||!media.ended||!sourceMatches(request))return;
        active=null;detach(request);report('ended',request);
      };
      const error=()=>{
        if(active!==request||!media.error||!sourceMatches(request))return;
        fail(request,'error',{name:'MediaError',reason:'media-error',code:media.error.code,message:String(media.error.message||'Media resource failed')});
      };
      request.listeners=[['playing',playing],['ended',ended],['error',error]];
      for(const [type,handler] of request.listeners)media.addEventListener(type,handler);
      request.timer=setTimeout(()=>{
        if(active!==request||request.started)return;
        const current=valid(request);
        fail(request,current?'late':'blocked',{reason:current?'deadline':'stale'});
      },request.maxDelayMs);
      if(!valid(request)){fail(request,'blocked',{reason:'stale'});return result;}
      if(clock()-request.at>request.maxDelayMs){fail(request,'late',{reason:'deadline'});return result;}
      // This call is deliberately in play()'s synchronous segment. Never put
      // a fetch, decoder, timer, or Promise continuation in front of it.
      const attempt=media.play();
      request.promiseMode=!!attempt&&typeof attempt.then==='function';
      if(request.promiseMode)Promise.resolve(attempt).then(()=>accept(request),failure=>reject(request,failure));
      else if(request.sawPlaying)accept(request);
    }catch(error){reject(request,error);}
    return result;
  }
  function pause(){stop();}
  function dispose(){
    if(disposed)return;
    disposed=true;stop();
    if(element){
      try{element.removeEventListener('playing',orphanPlaying);element.removeAttribute?.('src');element.load?.();}catch{}
    }
  }
  function getState(){
    return {backend:'media',state:disposed?'disposed':active?(active.started?'playing':'pending'):'idle',
      phase,lastKind,src:element?.currentSrc||source,paused:element?.paused??true,
      readyState:element?.readyState??0,error:lastError};
  }
  return {play,stop,pause,dispose,getState};
}
