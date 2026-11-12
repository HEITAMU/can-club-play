import test from 'node:test';
import assert from 'node:assert/strict';
import {CombatEffects,GuardEffects,StatusEffects,paintVFX} from '../painted-fx.mjs';
import {sampleImpact,sampleRoute,FX_CELLS} from '../vfx-motion.mjs';
import {Battle,initialState,CATS} from '../core.mjs';
import {BattleCues,formationPositions} from '../battle-cues.mjs';

const positions={p0:{x:20,y:70},e0:{x:75,y:70}},sizes={p0:50,e0:60};
const route={id:1,from:'p0',targets:['e0'],phase:'release',style:'fire',kind:'skill',born:1,until:1.34,travel:.29,positions};
// Capture the actual painter's transform of the source texture's +X axis.
function textureAxis(p){
 let angle=0,sx=1,result;
 const ctx={save(){},restore(){},translate(){},rotate(a){angle+=a;},scale(x){sx*=x;},beginPath(){},rect(){},clip(){},drawImage(){result={x:Math.cos(angle)*sx,y:Math.sin(angle)*sx};}};
 paintVFX(ctx,{},[p]);return result;
}
test('the crescent convex edge leads its flight, including enemy and diagonal attacks',()=>{
 for(const [from,to] of [[{x:20,y:50},{x:75,y:50}],[{x:75,y:50},{x:20,y:50}],[{x:20,y:75},{x:75,y:30}],[{x:75,y:30},{x:20,y:75}]]){
  const p={p0:from,e0:to},r={...route,style:'sweep',positions:p};
  for(const t of [1.08,1.15,1.23])for(const slash of sampleRoute(r,t,390,300,p,sizes).filter(p=>p.art==='slash')){
   const axis=textureAxis(slash),dx=(to.x-from.x)*3.9,dy=(to.y-from.y)*3;
   // In the original art the leading convex edge is at -X, not +X.
   assert.ok((-axis.x*dx-axis.y*dy)/Math.hypot(dx,dy)>.98);
  }
 }
 const fish=textureAxis({art:'fish',x:0,y:0,width:20,height:20,angle:0,alpha:1});assert.equal(fish.x,1,'fish already faces forward');
});
test('melee crescents face and advance through the target in either attack direction',()=>{
 for(const direction of [-1,1]){
  const frames=[.04,.12,.21].map(age=>sampleImpact('melee',{x:200,y:150},52,age,.44,1,direction).find(p=>p.art==='slash'));
  for(const arc of frames){const axis=textureAxis(arc);assert.ok(-axis.x*direction>0,'convex edge faces the target');}
  assert.ok((frames[1].x-frames[0].x)*direction>0);assert.ok((frames[2].x-frames[1].x)*direction>0);
 }
});
test('cancelled projectiles vanish immediately while completed impacts finish and clean up',()=>{
 const fx=new CombatEffects(null);
 assert.ok(fx.render([route],1.1,390,300,positions,sizes).length>0);
 assert.equal(fx.render([],1.11,390,300,positions,sizes).length,0);
 const hit={...route,id:2,phase:'impact',born:2,until:2.8};
 assert.ok(fx.render([hit],2.12,390,300,positions,sizes).length>0);
 assert.ok(fx.render([],2.2,390,300,positions,sizes).length>0);
 assert.equal(fx.render([],2.81,390,300,positions,sizes).length,0);
 assert.equal(fx.routes.size,0);
});
test('all particle trajectories freeze on pause and yield identical frames at any sampling rate',()=>{
 for(const style of ['melee','fire','ice','electric','star','heal','guard','energy','break','block','rescue']){
  const hit={...route,phase:'impact',style,tone:style==='guard'?'support':'attack',until:2.1};
  const fine=new CombatEffects(null),coarse=new CombatEffects(null);
  for(let t=1;t<1.24;t+=1/120)fine.render([hit],t,390,300,positions,sizes);
  coarse.render([hit],1.1,390,300,positions,sizes);
  const a=fine.render([hit],1.24,390,300,positions,sizes),b=coarse.render([hit],1.24,390,300,positions,sizes);
  assert.deepEqual(a,b,style);
  assert.deepEqual(fine.render([hit],1.24,390,300,positions,sizes),a,style+' paused');
 }
});
test('all effects have finite transforms, distinct artwork and complete disappearance',()=>{
 const patterns=new Set();
 for(const style of ['melee','fire','ice','electric','star','heal','guard','energy','break','block','rescue']){
  const a=sampleImpact(style,{x:200,y:160},52,.15,.8,17);patterns.add(JSON.stringify(a));assert.ok(a.length>0,style);
  for(let t=0;t<=.8;t+=1/60)for(const p of sampleImpact(style,{x:200,y:160},52,t,.8,17)){
   assert.ok(p.art in FX_CELLS);for(const key of ['x','y','width','height','alpha','angle'])assert.ok(Number.isFinite(p[key]),style+' '+key);
   assert.ok(p.alpha>=0&&p.alpha<=1);
  }
  assert.equal(sampleImpact(style,{x:200,y:160},52,.8,.8,17).length,0);
 }
 assert.equal(patterns.size,11);
});
test('persistent shields and statuses follow moving actors and stop after death or break',()=>{
 const fx=new CombatEffects(null),guards=new GuardEffects(),statuses=new StatusEffects();
 const a={id:'p0',hp:100,shield:40,burnTime:2,stun:2};
 guards.render([a],1,positions,sizes,fx);statuses.render([a],1,positions,sizes,fx);
 const before=fx.render([],1.2,390,300,positions,sizes);
 const moved={...positions,p0:{x:30,y:75}},after=fx.render([],1.2,390,300,moved,sizes);
 assert.ok(before.length>0);assert.equal(before.length,after.length);
 before.forEach((p,i)=>{assert.ok(Math.abs(after[i].x-p.x-39)<1e-9);assert.ok(Math.abs(after[i].y-p.y-15)<1e-9);});
 a.shield=0;a.hp=0;guards.render([a],1.21,moved,sizes,fx);statuses.render([a],1.21,moved,sizes,fx);
 assert.equal(fx.guards.length,0);assert.equal(fx.statuses.length,0);
 assert.equal(fx.bursts[0].style,'break');assert.equal(fx.render([],2,390,300,moved,sizes).length,0);
});
test('real five versus five combat renders every skill and cleans bounded effect state',()=>{
 const seen=new Set();let peak=0;
 for(const caster of CATS){
  const s=initialState();s.highest=120;s.party=[caster.id,...CATS.map(c=>c.id).filter(id=>id!==caster.id).slice(0,4)];
  const b=new Battle(s,{stage:20}),cues=new BattleCues(),fx=new CombatEffects(null),guards=new GuardEffects(),statuses=new StatusEffects();
  for(const a of [...b.heroes,...b.enemies]){a.hp=a.maxHp=100000;a.wait=99;a.skillWait=99;}
  b.heroes[0].wait=0;b.heroes[0].energy=100;
  for(let frame=0;frame<180;frame++){
   const events=b.tick(1/60),p=formationPositions(b),sz=Object.fromEntries(Object.keys(p).map(id=>[id,52]));
   if(events.some(e=>e.type==='skill'))seen.add(caster.id);
   cues.consume(events,b,p);guards.render([...b.heroes,...b.enemies],b.time,p,sz,fx);statuses.render([...b.heroes,...b.enemies],b.time,p,sz,fx);
   peak=Math.max(peak,fx.render(cues.active(b.time),b.time,390,300,p,sz).length);
  }
  assert.ok(fx.routes.size<5);
 }
 assert.equal(seen.size,8);assert.ok(peak<250,'bounded draw count: '+peak);
});
