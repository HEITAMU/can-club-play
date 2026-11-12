import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle,initialState} from '../core.mjs';
import {BattleCues,formationPositions} from '../battle-cues.mjs';
import {canHitAt,canDuration,CAN_TIMING} from '../can-timing.mjs';
import {sampleCan,canLidPose,canLayout,CAN_ART,paintCan} from '../can-fx.mjs';
import {CombatEffects} from '../painted-fx.mjs';

function fixture(count=5){
 const s=initialState();s.highest=120;s.party=['orange','ink','milk','mint','bolt'];
 const b=new Battle(s,{stage:20});b.enemies=b.enemies.slice(0,count);
 for(const a of [...b.heroes,...b.enemies]){a.wait=99;a.skillWait=99;a.hp=a.maxHp=10000;a.armor=0;a.shield=0;}
 b.heroes.forEach(h=>h.hp=5000);const cues=new BattleCues(),positions=formationPositions(b),sizes=Object.fromEntries(Object.keys(positions).map(id=>[id,58]));
 b.openCan();cues.consume(b.events.splice(0),b,positions);
 return {b,cues,positions,sizes,route:cues.active(0).find(r=>r.style==='can-rescue')};
}

test('can opens overhead, drops all four food shapes and hits every enemy with one continuous lid',()=>{
 for(const count of [1,2,5])for(const [w,h] of [[320,300],[390,592],[720,360]]){
  const {route:r,positions:p,sizes:s}=fixture(count),g=canLayout(r,w,h,p,s);
  assert.ok(g.x<w*.5&&g.y<Math.min(...r.friends.map(id=>p[id].y*h/100))-g.size*.8);
  for(let i=0;i<count;i++){
   const pose=canLidPose(r,canHitAt(i),w,h,p,s),target=p[r.targets[i]];
   assert.ok(Math.abs(pose.x-target.x*w/100)<1e-8&&Math.abs(pose.y-target.y*h/100)<1e-8);
   const before=canLidPose(r,canHitAt(i)-.0001,w,h,p,s),after=canLidPose(r,canHitAt(i)+.0001,w,h,p,s);
   assert.ok(Math.hypot(after.x-before.x,after.y-before.y)<2,'no teleport on a bounce');
  }
  assert.ok(canLidPose(r,canHitAt(count-1)+CAN_TIMING.exit,w,h,p,s).x>w+g.canWidth*.5);
  const food=sampleCan(r,.8,w,h,p,s).filter(p=>p.art.startsWith('kibble-'));
  assert.equal(new Set(food.map(p=>p.art)).size,4);assert.equal(new Set(food.map(p=>p.recipient)).size,5);
  for(let t=.03;t<canDuration(count);t+=1/60){const particles=sampleCan(r,t,w,h,p,s);assert.ok(particles.length<110);assert.ok(particles.filter(p=>p.art==='can-lid').length<=1);for(const x of particles)for(const key of ['x','y','width','height','alpha','angle'])assert.ok(Number.isFinite(x[key]),key);}
 }
});

test('heal and each damage event resolve exactly on the matching animation beat, once each',()=>{
 const {b,cues,positions,route}=fixture();assert.ok(b.heroes.every(h=>h.hp===5000));assert.ok(b.enemies.every(e=>e.hp===10000));
 const events=[];for(let i=0;i<160;i++){const e=b.tick(.02);events.push(...e);cues.consume(e,b,positions);}
 const heals=events.filter(e=>e.type==='heal'&&e.rescue),hits=events.filter(e=>e.type==='hit'&&e.rescue);
 assert.equal(heals.length,5);assert.ok(heals.every(e=>e.at===CAN_TIMING.heal&&e.value===2000));
 assert.deepEqual(hits.map(e=>e.to),route.targets);hits.forEach((e,i)=>assert.equal(e.at,canHitAt(i)));
 assert.equal(b.canSequence,null);assert.equal(cues.active(b.time).length,0);assert.equal(cues.entries.length,1,'no phantom basic attacks or leech cues');
});

test('a lethal lid completes its right-side exit before victory replaces the scene',()=>{
 const {b}=fixture(1);b.enemies[0].hp=1;
 for(let i=0;i<55;i++)b.tick(.02);
 assert.equal(b.enemies[0].hp,0);assert.equal(b.result,null);
 for(let i=0;i<45;i++)b.tick(.02);
 assert.equal(b.result,'win');assert.equal(b.kills,1);
});

test('can animation is deterministic when paused, scales with the viewport and cleans up',()=>{
 const {route,positions,sizes}=fixture(),fx=new CombatEffects(null);
 const a=fx.render([route],.8,390,592,positions,sizes);assert.deepEqual(a,fx.render([route],.8,390,592,positions,sizes));
 assert.notDeepEqual(a,fx.render([route],.8,320,300,positions,sizes));
 assert.equal(fx.render([],canDuration(5),390,592,positions,sizes).length,0);assert.equal(fx.routes.size,0);
});

test('every painted can part preserves the canvas drawing state',()=>{
 const calls=[],ctx=new Proxy({}, {get:(_,k)=>(...args)=>calls.push([k,...args]),set:()=>true});
 for(const art of Object.keys(CAN_ART)){assert.equal(paintCan(ctx,{}, {art,x:10,y:20,width:40,height:30,alpha:1,angle:.3}),true);assert.equal(calls.at(-1)[0],'restore');}
 assert.equal(calls.filter(c=>c[0]==='drawImage').length,6);
});
