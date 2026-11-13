import {CAN_TIMING,canHitAt,canDuration} from './can-timing.mjs?v=0.21.14';
import {healingImpact} from './healing-fx.mjs?v=0.21.14';

export const CAN_ART={'can-body':-1,'can-lid':-1,'kibble-paw':-1,'kibble-fish':-1,'kibble-heart':-1,'kibble-star':-1};
export const CAN_ATLAS={url:'./assets/vfx/can-rescue-v0192.webp',rects:{"can-body":[45,70,204,171],"can-lid":[295,88,196,129],"kibble-paw":[553,79,172,146],"kibble-fish":[61,336,170,95],"kibble-heart":[315,320,148,125],"kibble-star":[554,308,152,141]}};
const clamp=x=>Math.max(0,Math.min(1,x)),mix=(a,b,t)=>a+(b-a)*t,tau=Math.PI*2;
const ease=t=>t*t*(3-2*t),fade=(t,d,inTime=.06,outTime=.2)=>Math.min(clamp(t/inTime),clamp((d-t)/outTime));
const particle=(art,x,y,width,height,alpha=1,angle=0,extra={})=>({art,x,y,width,height,alpha:clamp(alpha),angle,layer:2,...extra});
const xy=(p,w,h)=>({x:p.x*w/100,y:p.y*h/100});

export function canLayout(r,w,h,centers={},sizes={}){
 const friends=r.friends||[],sourcePoints=friends.map(id=>r.positions?.[id]||centers[id]).filter(Boolean).map(p=>xy(p,w,h));
 const size=Math.max(44,Math.min(78,...friends.map(id=>sizes[id]||58))),canWidth=Math.min(w*.27,size*1.48),canHeight=canWidth*.80;
 const x=sourcePoints.length?sourcePoints.reduce((n,p)=>n+p.x,0)/sourcePoints.length:w*.26;
 const y=Math.max(canHeight*.7+12,(sourcePoints.length?Math.min(...sourcePoints.map(p=>p.y)):h*.48)-size*1.3);
 return {x:Math.max(canWidth*.65,Math.min(w*.40,x)),y,size,canWidth,canHeight};
}

// A single continuous, spinning lid. Each segment ends exactly at its contact.
export function canLidPose(r,age,w,h,centers={},sizes={}){
 const g=canLayout(r,w,h,centers,sizes),targets=r.targets||[];
 const contact=id=>xy(r.contacts?.[id]||centers[id]||r.positions?.[id]||{x:75,y:70},w,h);
 const launch={x:g.x+g.canWidth*.12,y:g.y-g.canHeight*.63};
 if(age<CAN_TIMING.open)return {x:g.x,y:g.y-g.canHeight*.22,angle:0,scaleY:1,phase:'sealed'};
 if(age<CAN_TIMING.release){const t=ease(clamp((age-CAN_TIMING.open)/(CAN_TIMING.release-CAN_TIMING.open)));return {x:mix(g.x,launch.x,t),y:mix(g.y-g.canHeight*.22,launch.y,t),angle:-t*.55,scaleY:1-.30*t,phase:'opening'};}
 if(!targets.length||age>=canDuration(targets.length))return null;
 let a=launch,b=contact(targets[0]),start=CAN_TIMING.release,end=canHitAt(0),phase='flight',arc=g.size*.65;
 for(let i=1;i<targets.length&&age>canHitAt(i-1);i++){a=contact(targets[i-1]);b=contact(targets[i]);start=canHitAt(i-1);end=canHitAt(i);arc=g.size*.30;phase='ricochet';}
 const last=canHitAt(targets.length-1);
 if(age>last){a=contact(targets.at(-1));b={x:w+g.canWidth*1.15,y:Math.max(g.size*.5,a.y-g.size*1.5)};start=last;end=last+CAN_TIMING.exit;arc=Math.min(h*.30,g.size*1.5);phase='exit';}
 const t=clamp((age-start)/(end-start));
 return {x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)-Math.sin(Math.PI*t)*arc,angle:-.55+(age-CAN_TIMING.release)*17,scaleY:.54+.46*Math.abs(Math.cos((age-CAN_TIMING.release)*12)),phase};
}

export function sampleCan(r,time,w,h,centers={},sizes={}){
 const age=time-r.born,duration=canDuration(r.targets.length),out=[];
 if(age<0||age>=duration)return out;
 const g=canLayout(r,w,h,centers,sizes),arrive=clamp(age/.16),pop=1+Math.sin(arrive*Math.PI)*.09,bodyFade=fade(age,1.40,.08,.24);
 const tilt=age<CAN_TIMING.release?-.04:Math.sin((age-CAN_TIMING.release)*19)*.09+.13;
 if(bodyFade>0)out.push(particle('can-body',g.x,g.y-Math.sin(age*9)*2,g.canWidth*pop,g.canHeight*pop,bodyFade,tilt));
 const lid=canLidPose(r,age,w,h,centers,sizes);
 if(lid){const size=g.canWidth*(age<CAN_TIMING.release?1:.66),alpha=Math.min(1,age/.06);out.push(particle('can-lid',lid.x,lid.y,size,size*.65*lid.scaleY,alpha,lid.angle,{phase:lid.phase}));}
 // Every piece starts inside the can, fans out and drops under gravity.
 const arts=['kibble-paw','kibble-fish','kibble-heart','kibble-star'];
 for(let i=0;i<(r.friends||[]).length;i++){
  const id=r.friends[i],q=xy(centers[id]||r.positions[id],w,h),s=sizes[id]||g.size;
  for(let j=0;j<5;j++){
   const born=CAN_TIMING.release+j*.075,land=CAN_TIMING.heal+j*.075,t=(age-born)/(land-born);
   if(t<0||t>1.16)continue;
   const u=clamp(t),spread=(j-2)*s*.15,side=(i%2?1:-1),start={x:g.x+(j-2)*3,y:g.y-g.canHeight*.25},end={x:q.x+spread,y:q.y+s*.21};
   const x=mix(start.x,end.x,u)+Math.sin(Math.PI*u)*side*(12+j*2),y=mix(start.y,end.y,u*u)-Math.sin(Math.PI*u)*g.size*.48;
   const a=t>1?1-(t-1)/.16:clamp(t/.1),sz=s*(.22+(j%2)*.025);
   const art=arts[(i+j)%4],rect=CAN_ATLAS.rects[art];
   out.push(particle(art,x,y,sz,sz*rect[3]/rect[2],a,(i+j)*.6+t*(j%2?4:-4),{recipient:id}));
  }
  const healAge=age-CAN_TIMING.heal;
  if(healAge>0)out.push(...healingImpact(q,s,healAge,1.12,i+7).map(p=>({...p,alpha:p.alpha*.60})));
 }
 for(let i=0;i<r.targets.length;i++){
  const t=age-canHitAt(i);if(t<0||t>.28)continue;
  const q=xy(r.contacts?.[r.targets[i]]||centers[r.targets[i]]||r.positions[r.targets[i]],w,h),s=sizes[r.targets[i]]||58;
  out.push(particle('flash',q.x,q.y,s*(.45+t*.7),s*.45,fade(t,.24,.012,.14),i*.8));
  for(let j=0;j<5;j++){const a=j*tau/5+i,dist=s*(.18+t*1.2);out.push(particle('ember',q.x+Math.cos(a)*dist,q.y+Math.sin(a)*dist,s*.1,s*.1,fade(t,.28,.01,.20),a));}
 }
 return out;
}

export function paintCan(ctx,img,p){
 const rect=CAN_ATLAS.rects[p.art];if(!rect||!img)return false;
 ctx.save();ctx.globalAlpha=p.alpha;ctx.translate(p.x,p.y);ctx.rotate(p.angle);
 ctx.drawImage(img,...rect,-p.width/2,-p.height/2,p.width,p.height);ctx.restore();return true;
}
