// @ts-nocheck
// Migrated verbatim from Preview11 source 28eb867; only module specifiers changed.
// Material carriers share the combat rig clock, ground pivot and action timing.
export const CARRIER_ATLAS='./assets/painted/carriers-v02652.webp';
export const CARRIER_ART={carrierScrap:{row:0,material:'scrap'},carrierSupplies:{row:1,material:'supplies'}};
export const carrierId=actor=>actor?.materialDrop?.id==='scrap'?'carrierScrap':actor?.materialDrop?.id==='supplies'?'carrierSupplies':null;
const clamp=x=>Math.max(0,Math.min(1,x));
export function carrierPose(actor,time){
 const pose=(from,to,mix=1)=>({carrierFrom:from,carrierCel:to,carrierMix:clamp(mix)});
 if(actor?.hp<=0)return pose(4,4);
 if((actor?.hitUntil||0)>time){const age=.22-(actor.hitUntil-time);return age<.06?pose(0,3,age/.06):age>.15?pose(3,0,(age-.15)/.07):pose(3,3);}
 if(actor?.charge>0)return pose(1,1);
 const a=actor?.action;if(!a)return pose(0,0);
 const t=a.elapsed,wind=Math.max(.08,a.windup),hit=a.impactAt,end=a.duration;
 if(t<wind)return pose(0,1,t/Math.min(.12,wind));
 if(t<hit+.06)return pose(1,2,(t-wind)/.07);
 return pose(2,0,(t-hit-.06)/Math.max(.08,end-hit-.06));
}
export function paintCarrier(ctx,atlas,id,pose){
 const row=CARRIER_ART[id].row,w=atlas.width/5,h=atlas.height/2,alpha=ctx.globalAlpha;
 const from=pose.carrierFrom||0,to=pose.carrierCel||0,mix=pose.carrierMix??1;
 if(from===to){ctx.drawImage(atlas,to*w,row*h,w,h,0,0,1,1);return;}
 if(mix<1){ctx.globalAlpha=alpha*(1-mix);ctx.drawImage(atlas,from*w,row*h,w,h,0,0,1,1);}
 if(mix>0){ctx.globalAlpha=alpha*mix;ctx.drawImage(atlas,to*w,row*h,w,h,0,0,1,1);}
 ctx.globalAlpha=alpha;
}
