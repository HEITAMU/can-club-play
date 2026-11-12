// Combat and rendering share the same simulation clock (seconds).
export function attackStyle(a){
 if(a.side==='e')return ['drone','battery'].includes(a.type)?'electric':['mop','vacuum'].includes(a.type)?'sweep':'melee';
 return ({orange:'melee',ink:'arrow',milk:'milk',spark:'fire',mint:'ice',bolt:'melee',pudding:'melee',star:'star'})[a.catId];
}
export function actionTiming(a,kind='normal'){
 const windup=kind==='skill'?.36:.20,travel=attackStyle(a)==='melee'?.14:.22;
 return {windup,travel,impactAt:windup+travel,duration:windup+travel+.28};
}
const unit=n=>Math.min(1,Math.max(0,n));
const smooth=n=>{const t=unit(n);return t*t*(3-2*t);};
export function poseFor(a,time){
 const hero=a.side==='p',action=a.action;
 if(a.hp<=0)return {frame:hero?5:3,phase:'down',move:0};
 if((a.burstUntil||0)>time)return {frame:2,phase:'release',move:0};
 if(a.charge>0)return {frame:1,phase:'charge',move:0};
 if(action){
  const t=action.elapsed,skill=action.kind==='skill';
  if(t<action.windup)return {frame:hero?(skill?6:1):1,phase:'windup',move:-.04*smooth(t/action.windup)};
  if(t<action.impactAt+.06){const k=unit((t-action.windup)/action.travel);return {frame:hero?(skill?7:2):2,phase:'release',move:-.04+1.04*(1-(1-k)**3)};}
  const progress=unit((t-action.impactAt-.06)/(action.duration-action.impactAt-.06));
  return {frame:hero?3:0,phase:'recover',move:1-smooth(progress),progress};
 }
 if((a.hitUntil||0)>time)return {frame:hero?5:3,phase:'hit',move:0};
 return {frame:hero&&(time+(Number(a.id.slice(1))||0)*1.13)%3.7>3.52?4:0,phase:'idle',move:0};
}
// Presentation only: stop a melee lunge at the opponent's silhouette, and use
// the simulation timestamp for recoil so a paused fight also pauses the motion.
export function travelOffset(actor,pose,source,target,width,height,bodySize=130,targetSize=110,time=0){
 let x=0,y=0;
 if(actor.action&&source&&target){
  const dx=(target.x-source.x)*width/100,dy=(target.y-source.y)*height/100,distance=Math.hypot(dx,dy);
  const reach=attackStyle(actor)==='melee'?Math.min(distance*.76,Math.max(0,distance-(bodySize+targetSize)*.28)):distance*.06;
  if(distance>0){x=dx/distance*reach*pose.move;y=dy/distance*reach*pose.move;}
 }
 const sinceHit=.18-((actor.hitUntil||0)-time);
 if(actor.hp>0&&sinceHit>=0&&sinceHit<.18){const u=sinceHit/.18;x+=(actor.side==='p'?-1:1)*Math.sin(u*Math.PI)*(1-u)*7;}
 return {x,y};
}
