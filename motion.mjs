import {enemyAttackType} from './action-profiles.mjs?v=0.25.0';
// Combat and rendering share a simulation clock. x1 is a deliberate, calmer pace.
export const battleRate=speed=>speed===2?1.8:.9;
export function attackStyle(a,kind=a.action?.kind||'normal'){
 if(a.side==='e')return enemyAttackType(a.type);
 if(a.catId==='bolt')return kind==='skill'?'melee':'wrench';
 return ({orange:'melee',ink:'arrow',milk:'milk',spark:'fire',mint:'ice',bolt:'melee',pudding:'melee',star:'star'})[a.catId];
}
export function actionTiming(a,kind='normal'){
 const tempo=Math.max(.64,Math.min(1,(a.interval||1.5)/1.25))*(kind==='normal'&&a.side!=='e'?1.4:1),windup=(kind==='skill'?.40:.25)*tempo,travel=(a.catId==='bolt'&&kind==='normal'?.48:attackStyle(a,kind)==='melee'?.20:.29)*tempo,hold=(kind==='skill'?.11:.085)*tempo,recovery=.31*tempo;
 return {windup,travel,hold,recovery,impactAt:windup+travel,duration:windup+travel+hold+recovery};
}
export const unit=n=>Math.min(1,Math.max(0,n));
const smooth=n=>{const t=unit(n);return t*t*(3-2*t);};
// A cancelled attack settles back from its current position rather than snapping home.
export class MotionOffsets{
 constructor(){this.points=new Map();}
 clear(){this.points.clear();}
 value(actor,target,time){let p=this.points.get(actor.id);if(!p||time<p.time)p={x:target.x,y:target.y,acting:!!actor.action,time};
  if(!actor.action&&p.acting&&Math.hypot(p.x,p.y)>1)p.returning={x:p.x,y:p.y,at:time};
  let next=target;if(actor.action)p.returning=null;
  else if(p.returning){const k=smooth((time-p.returning.at)/.20);next={x:p.returning.x*(1-k)+target.x*k,y:p.returning.y*(1-k)+target.y*k};if(k>=1)p.returning=null;}
  Object.assign(p,next,{acting:!!actor.action,time});this.points.set(actor.id,p);return {x:p.x,y:p.y};
 }
}
export function poseFor(a,time){
 const hero=a.side==='p',action=a.action;
 if(a.hp<=0)return {frame:hero?5:3,phase:'down',move:0};
 if((a.burstUntil||0)>time)return {frame:2,phase:'release',move:0};
 if(['charging','primed'].includes(a.shieldState))return {frame:6,phase:'charge',move:0};
 if(a.charge>0)return {frame:1,phase:'charge',move:0};
 if(action){
  const t=action.elapsed,skill=action.kind==='skill',hold=action.hold??.085;
  if(t<action.windup)return {frame:hero?(skill?6:1):1,phase:'windup',move:-.045*smooth(t/action.windup),progress:unit(t/action.windup)};
  if(t<action.impactAt){const k=unit((t-action.windup)/action.travel);return {frame:hero?(skill?7:2):2,phase:'release',move:-.045+1.045*smooth(k),progress:k};}
  if(t<action.impactAt+hold)return {frame:hero?(skill?7:2):2,phase:'hold',move:1,progress:unit((t-action.impactAt)/hold)};
  const progress=unit((t-action.impactAt-hold)/(action.duration-action.impactAt-hold));
  return {frame:hero?3:0,phase:'recover',move:1-smooth(progress),progress};
 }
 if((a.hitUntil||0)>time)return {frame:hero?5:3,phase:'hit',move:0};
 return {frame:0,phase:'idle',move:0};
}
export function travelOffset(actor,pose,source,target,width,height,bodySize=130,targetSize=110,time=0){
 let x=0,y=0;
 if(actor.action?.shieldStrike)return {x:0,y:0};
 if(actor.action&&source&&target){
  const dx=(target.x-source.x)*width/100,dy=(target.y-source.y)*height/100,distance=Math.hypot(dx,dy),melee=attackStyle(actor)==='melee';
  const reach=melee?Math.min(distance*.76,Math.max(0,distance-(bodySize+targetSize)*.28)):0;
  if(distance>0){const a=actor.action,approachEnd=a.impactAt*.65,returnAt=a.impactAt+(a.hold||0),move=melee?(a.elapsed<approachEnd?smooth(a.elapsed/approachEnd):a.elapsed<returnAt?1:1-smooth((a.elapsed-returnAt)/(a.duration-returnAt))):0;x=dx/distance*reach*move;y=dy/distance*reach*move;}
 }
 const duration=.22,sinceHit=duration-((actor.hitUntil||0)-time);
 if(actor.hp>0&&sinceHit>=0&&sinceHit<duration){const u=sinceHit/duration;x+=(actor.side==='p'?-1:1)*Math.sin(u*Math.PI)*(1-u)*1.5;}
 return {x,y};
}
// Short tails and curved flight are projectile effects, never source-to-target guides.
export function projectilePose(from,to,width,height,elapsed,travel,style,shot=0,count=1){
 const delay=count>1?shot*.035:0,flight=Math.max(.08,travel-(count-1)*.035),raw=(elapsed-delay)/flight,t=unit(raw),sx=from.x*width/100,sy=from.y*height/100,dx=(to.x-from.x)*width/100,dy=(to.y-from.y)*height/100;
 const arch=style==='wrench'?Math.min(72,Math.max(28,Math.hypot(dx,dy)*.32)):['fire','milk','heal','star'].includes(style)?Math.min(22,Math.hypot(dx,dy)*.14):0,spread=count>1?(shot-(count-1)/2)*4:0;
 const x=sx+dx*t,y=sy+dy*t-(style==='wrench'?4*t*(1-t):Math.sin(t*Math.PI))*(arch+spread),tangent=dy-(style==='wrench'?4*(1-2*t):Math.cos(t*Math.PI)*Math.PI)*(arch+spread);
 return {x,y,angle:Math.atan2(tangent,dx)*180/Math.PI+(style==='wrench'?t*720*(dx<0?-1:1):0),visible:raw>=0&&raw<=1,progress:t,tailX:x-dx/Math.max(1,Math.hypot(dx,dy))*9,tailY:y-tangent/Math.max(1,Math.hypot(dx,dy))*9};
}
