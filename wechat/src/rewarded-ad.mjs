// No simulated completion. A reward requires the platform's explicit isEnded=true.
export function createRewardedService(api,adUnitId,{setTimer=setTimeout,clearTimer=clearTimeout}={}) {
  let ad=null,pending=null,retired=false,disposed=false;
  const configured=typeof adUnitId==='string'&&/^adunit-[\w-]+$/.test(adUnitId)&&typeof api.createRewardedVideoAd==='function';
  const finish=(status)=>{const p=pending;if(!p)return;pending=null;clearTimer(p.timer);p.resolve({status,completed:status==='completed'});};
  const onClose=res=>{if(pending?.showRequested)finish(res?.isEnded===true?'completed':'cancelled');};
  const onError=()=>finish('error');
  function ensure(){if(!ad){ad=api.createRewardedVideoAd({adUnitId});ad.onClose(onClose);ad.onError(onError);}return ad;}
  const service={
    get available(){return configured&&!retired&&!disposed;},
    get busy(){return !!pending;},
    watch(){
      if(!service.available)return Promise.resolve({status:'unavailable',completed:false});
      if(pending)return Promise.resolve({status:'busy',completed:false});
      return new Promise(resolve=>{
        const p=pending={resolve,showRequested:false,timer:null};
        // Retire after timeout: late SDK callbacks must never reward a later request.
        p.timer=setTimer(()=>{retired=true;finish('timeout');},60000);
        (async()=>{
          try {
            const instance=ensure();
            await instance.load();
            if(pending!==p||disposed)return;
            clearTimer(p.timer);
            p.timer=setTimer(()=>{retired=true;finish('timeout');},600000);
            p.showRequested=true;
            await instance.show();
          }catch{if(pending===p)finish('error');}
        })();
      });
    },
    dispose(){disposed=true;finish('cancelled');ad?.offClose?.(onClose);ad?.offError?.(onError);ad?.destroy?.();}
  };
  return service;
}
