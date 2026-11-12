import {catAction} from './action-profiles.mjs?v=0.20.0';
// Continuous motion for painted cutout parts. No pose-frame swapping.
const clamp=n=>Math.max(0,Math.min(1,n));
export const ease=n=>{const t=clamp(n);return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;
export const RIGS={
 orange:{foot:.92,period:2.6,phase:.2,head:[.49,.29,.30,.28,.50,.46],hand:[.75,.58,.24,.34,.60,.65],tail:[.12,.65,.19,.26,.24,.72],swing:.42},
 ink:{foot:.91,period:2.2,phase:1.3,head:[.47,.27,.28,.25,.50,.45],hand:[.73,.54,.23,.34,.62,.65],tail:[.15,.63,.24,.20,.35,.56],swing:.24},
 milk:{foot:.925,period:2.8,phase:2.4,head:[.51,.28,.32,.27,.52,.47],hand:[.69,.53,.19,.27,.57,.65],tail:[.15,.56,.24,.31,.29,.72],swing:.42},
 spark:{foot:.92,period:2.05,phase:3.1,head:[.51,.29,.29,.27,.51,.48],hand:[.73,.59,.20,.24,.57,.66],tail:[.16,.67,.24,.28,.33,.73],swing:.5},
 mint:{foot:.90,period:2.9,phase:4.3,head:[.47,.30,.31,.25,.49,.48],hand:[.78,.45,.15,.42,.67,.67],tail:[.15,.61,.20,.23,.32,.70],swing:.38},
 bolt:{foot:.945,period:2.35,phase:5.1,head:[.46,.30,.30,.26,.48,.49],hand:[.76,.57,.22,.34,.63,.68],tail:[.10,.69,.18,.23,.25,.73],swing:.58},
 pudding:{foot:.92,period:2.95,phase:1.8,head:[.45,.29,.30,.25,.48,.48],hand:[.77,.62,.24,.30,.60,.67],tail:[.13,.60,.24,.29,.29,.73],swing:.35},
 star:{foot:.93,period:2.65,phase:3.7,head:[.50,.35,.32,.28,.50,.51],hand:[.76,.56,.17,.34,.64,.70],tail:[.15,.70,.20,.23,.31,.75],swing:.44}
};
const feet={dust:.91,box:.86,mop:.90,battery:.84,bag:.91,drone:.87,vacuum:.82,fridge:.92,sign:.92,boxBoss:.935,clock:.89,vendor:.925};
export function rigFor(id){return RIGS[id]||{foot:feet[id]||.92,period:2.7,phase:Object.keys(feet).indexOf(id)*.7,head:[.5,.30,.42,.34,.5,.60],hand:null,tail:null,swing:.28};}
const keys=['breath','lean','head','hand','tail','reach','sink','alpha'];
const neutral={breath:0,lean:0,head:0,hand:0,tail:0,reach:0,sink:0,alpha:1};
const mix=(a,b,t)=>Object.fromEntries(keys.map(k=>[k,lerp(a[k],b[k],t)]));
export function blendRigPose(previous,next,dt){return !previous||dt<0?{...next}:mix(previous,next,1-Math.exp(-Math.max(0,dt)/.026));}
export const animationClock=(actor,time,idleTime)=>actor&&time>0?time:idleTime;
// Monotone cubic interpolation: position and velocity meet at each key, without overshoot.
export function flowTrack(time,points){
 if(time<=points[0][0])return points[0][1];if(time>=points.at(-1)[0])return points.at(-1)[1];
 let i=0;while(time>points[i+1][0])i++;
 const slope=k=>{if(k===0||k===points.length-1)return 0;const left=(points[k][1]-points[k-1][1])/(points[k][0]-points[k-1][0]),right=(points[k+1][1]-points[k][1])/(points[k+1][0]-points[k][0]);return left*right<=0?0:2*left*right/(left+right);};
 const [x0,y0]=points[i],[x1,y1]=points[i+1],h=x1-x0,u=(time-x0)/h,u2=u*u,u3=u2*u;
 return (2*u3-3*u2+1)*y0+(u3-2*u2+u)*h*slope(i)+(-2*u3+3*u2)*y1+(u3-u2)*h*slope(i+1);
}
function resting(id,time){const r=rigFor(id),q=time*Math.PI*2/r.period+r.phase,hero=!!RIGS[id];return {...neutral,breath:Math.sin(q)*.035,lean:Math.sin(q+.6)*.026,head:hero?Math.sin(q*.73+1)*.045:Math.sin(q)*.025,hand:hero?Math.sin(q+.9)*.055:0,tail:hero?Math.sin(q*1.22+r.phase)*.18:0};}
export function rigPose(id,actor,time,idleTime=time){
 const r=rigFor(id),idle=resting(id,idleTime);let p=idle;
 if(actor?.action){
  const a=actor.action,t=a.elapsed,k=a.kind==='skill'?1.18:1,w=a.windup,hit=a.impactAt,end=a.duration,follow=Math.min(end-.09,hit+(a.hold||0)+.055),archer=id==='ink';
  const offset=(prepare,strike,carry,lag=0)=>flowTrack(t,[[0,0],[w+lag,prepare],[hit+lag,strike],[follow+lag*.3,carry],[end,0]]);
  // A readable shoulder swing, including on the small battle sprites. Ranged
  // hands finish the throw when the projectile leaves, not when it lands.
  const performance=catAction(id,a.kind),melee=performance?.delivery==='melee';
  const arm=performance?.hand,body=performance?.body||1;
  const swingAt=melee?hit:w,prepareAt=melee?w:w*.5,carryAt=Math.min(end-.12,swingAt+.10);
  const hand=arm?flowTrack(t,[[0,0],[prepareAt,arm[0]],[swingAt,arm[1]],[carryAt,arm[2]],[end,0]]):offset(-r.swing*.75*k,r.swing*.9*k,r.swing*k);
  p={...idle,
   breath:idle.breath+offset(.023,-.027*body,-.009,-.025),
   lean:idle.lean+offset(-.085*body,.13*k*body,.10*k*body,-.018),
   head:idle.head+offset(-.065,.075,.11,.018),
   hand:idle.hand+hand,
   tail:idle.tail+offset(-.15,.12,.25,.035),
   reach:offset(-.018,melee?.09:archer?.065:.035,melee?.07:.043)
  };
 }else if(actor?.charge>0){
  const progress=clamp((2-actor.charge)/.45),sway=Math.sin(time*5.5)*.008;
  p=mix(idle,{...idle,breath:-.045+Math.sin(time*4)*.008,lean:-.07+sway,head:-.08,hand:-.32,tail:-.18+Math.sin(time*4)*.03},ease(progress));
 }else if((actor?.burstUntil||0)>time){
  const elapsed=.38-(actor.burstUntil-time),charged={...neutral,breath:-.06,lean:-.07,head:-.08,hand:-.22,tail:-.18},strike={...neutral,breath:.055,lean:.16,head:.1,hand:.32,reach:.045};p=elapsed<.12?mix(charged,strike,ease(elapsed/.12)):mix(strike,idle,ease((elapsed-.12)/.26));
 }
 if((actor?.hitUntil||0)>time){const t=clamp(1-(actor.hitUntil-time)/.22),kick=Math.sin(t*Math.PI);p={...p,lean:p.lean-kick*.10,head:p.head-kick*.13,breath:p.breath-kick*.025};}
 if(actor?.hp<=0){const t=ease((time-(actor.downAt??time))/.5);p=mix(p,{...neutral,breath:-.13,lean:-.32,head:-.18,hand:-.30,tail:.12,sink:.045,alpha:.35},t);}
 return p;
}
function weight(point,zone){if(!zone)return 0;const d=Math.hypot((point[0]-zone[0])/zone[2],(point[1]-zone[1])/zone[3]);return 1-ease((d-.30)/.70);}
export function preparePoint(id,x,y){const r=rigFor(id),lock=1-ease((y-(r.foot-.15))/.12);return {x,y,head:weight([x,y],r.head)*lock,hand:weight([x,y],r.hand)*lock,tail:weight([x,y],r.tail)*lock,lock};}
function turn(x,y,zone,angle,w){if(!zone||!w)return [x,y];const dx=x-zone[4],dy=y-zone[5],c=Math.cos(angle),s=Math.sin(angle);return [x+(dx*c-dy*s-dx)*w,y+(dx*s+dy*c-dy)*w];}
export function deformPoint(id,point,p){
 const r=rigFor(id);let x=point.x,y=point.y;
 [x,y]=turn(x,y,r.tail,p.tail,point.tail);
 [x,y]=turn(x,y,r.hand,p.hand,point.hand);x+=p.reach*point.hand;
 [x,y]=turn(x,y,r.head,p.head,point.head);
 x=.5+(x-.5)*(1-p.breath*.35*point.lock);y=r.foot+(y-r.foot)*(1+p.breath*point.lock);
 const dx=x-.5,dy=y-r.foot,c=Math.cos(p.lean),s=Math.sin(p.lean);
 x+=(dx*c-dy*s-dx)*point.lock;y+=(dx*s+dy*c-dy)*point.lock;
 y+=p.sink;
 return {x,y};
}
