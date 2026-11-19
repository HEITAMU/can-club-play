export type RewardStatus='unavailable'|'busy'|'completed'|'cancelled'|'error'|'timeout';
export type RewardResult={status:RewardStatus;completed:boolean};
/**
 * Preview11 completion contract: only the SDK's explicit isEnded=true rewards.
 * Each request owns its listeners and instance, preventing a queued callback from
 * an earlier advertisement from completing the next request.
 */
export function createRewardedService(api:any,adUnitId:string,{setTimer=setTimeout,clearTimer=clearTimeout}:any={}) {
  let pending:any=null,retired=false,disposed=false;
  const configured=typeof adUnitId==='string'&&/^adunit-[\w-]+$/.test(adUnitId)&&typeof api?.createRewardedVideoAd==='function';
  function finish(request:any,status:RewardStatus){
    if(pending!==request||request.finished)return;
    request.finished=true;pending=null;clearTimer(request.timer);
    request.ad?.offClose?.(request.onClose);
    request.ad?.offError?.(request.onError);
    request.ad?.destroy?.();
    request.resolve({status,completed:status==='completed'});
  }
  const service={
    get available(){return configured&&!retired&&!disposed;},
    get busy(){return !!pending;},
    watch():Promise<RewardResult>{
      if(!service.available)return Promise.resolve({status:'unavailable',completed:false});
      if(pending)return Promise.resolve({status:'busy',completed:false});
      return new Promise(resolve=>{
        const request:any={resolve,showRequested:false,finished:false,timer:null,ad:null};
        pending=request;
        request.onClose=(result:any)=>{
          if(pending===request&&request.showRequested)finish(request,result?.isEnded===true?'completed':'cancelled');
        };
        request.onError=()=>finish(request,'error');
        request.timer=setTimer(()=>{if(pending===request){retired=true;finish(request,'timeout');}},60000);
        (async()=>{
          try{
            request.ad=api.createRewardedVideoAd({adUnitId});
            request.ad.onClose(request.onClose);request.ad.onError(request.onError);
            await request.ad.load();
            if(pending!==request||disposed)return;
            clearTimer(request.timer);
            request.timer=setTimer(()=>{if(pending===request){retired=true;finish(request,'timeout');}},600000);
            request.showRequested=true;
            await request.ad.show();
          }catch{finish(request,'error');}
        })();
      });
    },
    dispose(){disposed=true;if(pending)finish(pending,'cancelled');}
  };
  return service;
}
export function createConfiguredRewardedService() {
  const root=globalThis as any;
  return createRewardedService(root.wx||{},root.CAN_CLUB_CONFIG?.rewardedAdUnitId||'');
}
