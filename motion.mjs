// Combat and rendering share the same simulation clock (seconds).
export function attackStyle(a){
 if(a.side==='e')return ['drone','battery'].includes(a.type)?'electric':['mop','vacuum'].includes(a.type)?'sweep':'melee';
 return ({orange:'melee',ink:'arrow',milk:'milk',spark:'fire',mint:'ice',bolt:'melee',pudding:'melee',star:'star'})[a.catId];
}
export function actionTiming(a,kind='normal'){
 const windup=kind==='skill'?.36:.20,travel=attackStyle(a)==='melee'?.14:.22;
 return {windup,travel,impactAt:windup+travel,duration:windup+travel+.28};
}
export function poseFor(a,time){
 const hero=a.side==='p',action=a.action;
 if(a.hp<=0)return {frame:hero?5:3,phase:'down',move:0};
 if((a.burstUntil||0)>time)return {frame:2,phase:'release',move:0};
 if(a.charge>0)return {frame:1,phase:'charge',move:0};
 if(action){
  const t=action.elapsed,skill=action.kind==='skill';
  if(t<action.windup)return {frame:hero?(skill?6:1):1,phase:'windup',move:-.06*Math.sin(t/action.windup*Math.PI)};
  if(t<action.impactAt+.09)return {frame:hero?(skill?7:2):2,phase:'release',move:Math.min(1,(t-action.windup)/action.travel)};
  return {frame:hero?3:0,phase:'recover',move:Math.max(0,1-(t-action.impactAt-.09)/.19)};
 }
 if((a.hitUntil||0)>time)return {frame:hero?5:3,phase:'hit',move:0};
 return {frame:hero&&(time+(Number(a.id.slice(1))||0)*1.13)%3.7>3.52?4:0,phase:'idle',move:0};
}
