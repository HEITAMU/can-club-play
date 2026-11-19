// @ts-nocheck
// Preview11 particle sampling and guard ownership, kept separate from the Cocos renderer.
import {sampleShidun} from '../domain/shidun-fx';
import {sampleRoute,sampleImpact,sampleGuard,sampleStatus,shieldTransition} from '../domain/vfx-motion';
export class CombatEffects{
 constructor(layer){
  this.shidunContacts=new Map();this.layer=layer;this.routes=new Map();this.bursts=[];this.guards=[];this.statuses=[];this.particles=[];

 }
 warm(battle){}
 clear(){
  this.shidunContacts.clear();this.routes.clear();this.bursts=[];this.guards=[];this.statuses=[];this.particles=[];

 }
 emit(style,point,time,size=52,duration=.65){
  this.bursts.push({style,point:{...point},born:time,size,duration,seed:this.bursts.length*31+Math.round(time*100)});
  if(this.bursts.length>24)this.bursts.shift();
 }
 render(routes,time,w,h,centers={},sizes={},feet={}){
  const active=new Set(routes.map(r=>r.id));
  for(const r of routes)this.routes.set(r.id,r);
  const particles=[];
  for(const [id,r] of this.routes){
   // Cancellation removes unfinished attacks; completed impacts finish their own envelope.
   if(time>=r.until||(!active.has(id)&&r.phase!=='impact')){this.routes.delete(id);continue;}
   particles.push(...sampleRoute(r,time,w,h,centers,sizes));
  }
  for(const {entry,actor} of this.guards){const p=centers[actor.id];if(p)particles.push(...sampleGuard(entry,actor,time,{x:p.x*w/100,y:p.y*h/100},sizes[actor.id]||50));}
  for(const actor of this.statuses){const p=centers[actor.id];if(p)particles.push(...sampleStatus(actor,time,{x:p.x*w/100,y:p.y*h/100},sizes[actor.id]||50));}
  for(const actor of this.statuses){const p=centers[actor.id];if(!p)continue;let contact=this.shidunContacts.get(actor.id);if(actor.shidunImpactAt!==undefined&&contact?.at!==actor.shidunImpactAt){contact={at:actor.shidunImpactAt,centers:structuredClone(centers),sizes:{...sizes},origin:{...p}};this.shidunContacts.set(actor.id,contact);}particles.push(...sampleShidun(actor,time,{x:((time-(actor.shidunImpactAt??-99)<.6?contact?.origin:p)||p).x*w/100,y:((time-(actor.shidunImpactAt??-99)<.6?contact?.origin:p)||p).y*h/100},Math.max(sizes[actor.id]||0,50),w,h,feet[actor.id],contact?.centers||centers,contact?.sizes||sizes));}
  this.bursts=this.bursts.filter(b=>time-b.born<b.duration);
  for(const b of this.bursts)particles.push(...sampleImpact(b.style,{x:b.point.x*w/100,y:b.point.y*h/100},b.size,time-b.born,b.duration,b.seed));
  this.particles=particles.sort((a,b)=>a.layer-b.layer);

  return this.particles;
 }
}
export class GuardEffects{
 constructor(){this.entries=new Map();}
 clear(){this.entries.clear();}
 render(actors,time,centers,sizes,combat){
  combat.guards=[];
  for(const actor of actors){
   let e=this.entries.get(actor.id);if(!e){e={value:0,at:time,hit:-99};this.entries.set(actor.id,e);}
   const value=actor.hp>0?actor.shield:0,change=shieldTransition(e.value,value);
   if(change==='raise')e.at=time;
   if(change==='block'||change==='break'){
    e.hit=time;const p=centers[actor.id];if(p&&change==='break')combat.emit('break',p,time,sizes[actor.id]||50,.65);
   }
   e.value=value;if(value>0)combat.guards.push({entry:e,actor});
  }
 }
}
export class StatusEffects{
 clear(){}
 render(actors,time,centers,sizes,combat){if(combat)combat.statuses=actors.filter(a=>(a.hp>0&&(a.catId==='pudding'||a.burnTime>0||a.stun>0))||(a.catId==='pudding'&&time-(a.shidunImpactAt??-99)<.6));}
}
