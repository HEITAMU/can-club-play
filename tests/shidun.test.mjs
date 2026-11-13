import test from 'node:test';import assert from 'node:assert/strict';
import {Battle,initialState} from '../core.mjs';import {shidunTargets,shidunPose} from '../shidun-motion.mjs';import {sampleShidun} from '../shidun-fx.mjs';import {rosterVertex} from '../finished-roster-renderer.mjs';
const make=()=>{const s=initialState();s.highest=120;s.party=['pudding','orange','milk','star','ink'];const b=new Battle(s,{stage:20});for(const a of [...b.heroes,...b.enemies]){a.hp=a.maxHp=10000;a.wait=a.skillWait=99;}return b;};
test('Shidun hits one front and its two rear slots, without filling empty slots',()=>{const es=Array.from({length:5},(_,i)=>({id:'e'+i,hp:100}));assert.deepEqual(shidunTargets(es,'e0').map(x=>x.id),['e0','e2','e3']);assert.deepEqual(shidunTargets(es,'e1').map(x=>x.id),['e1','e3','e4']);assert.deepEqual(shidunTargets(es,'e3').map(x=>x.id),['e1','e3','e4']);es[2].hp=0;assert.deepEqual(shidunTargets(es,'e0').map(x=>x.id),['e0','e3']);es[0].hp=0;assert.deepEqual(shidunTargets(es,'e0').map(x=>x.id),['e3']);assert.equal(shidunTargets(es.slice(0,1),'e0').length,0);});
test('charge is visible before second shield, punch damage happens once at impact on at most three targets',()=>{const b=make(),h=b.heroes[0];b.shield(h,3500,h);assert.equal(h.shieldState,'charging');for(let i=0;i<30;i++)b.tick(1/60);assert.ok(b.enemies.every(e=>e.hp===10000));const pose=shidunPose(h,b.time);assert.equal(pose.shidunCel,4);assert.ok(pose.shidunCharge>0);for(let t=0;t<2;t+=.01)assert.deepEqual(rosterVertex('pudding',200,518,{...pose,shidunTime:t}),[200,518]);b.shield(h,1600,h);const hits=[];for(let i=0;i<150;i++)hits.push(...b.tick(1/60).filter(e=>e.type==='hit'&&e.from===h.id));assert.deepEqual(hits.map(e=>e.to),['e0','e2','e3']);assert.ok(hits.every(e=>e.at>=1.35+.42-1e-8));assert.equal(h.shieldState,'normal');assert.ok(b.enemies[1].hp===10000&&b.enemies[4].hp===10000);});
test('full energy adds shield during charge; control cancels pending punch',()=>{const b=make(),h=b.heroes[0];b.shield(h,3500,h);h.energy=100;b.tick(.1);assert.equal(h.energy,0);assert.equal(h.shieldState,'primed');h.stun=1;b.tick(.1);assert.equal(h.shieldState,'controlled');for(let i=0;i<100;i++)b.tick(.05);assert.ok(b.enemies.every(e=>e.hp===10000));});
test('pressure effects share frozen simulation time and impact ends within a bounded envelope',()=>{const b=make(),h=b.heroes[0];b.shield(h,3500,h);const sample=t=>sampleShidun(h,t,{x:140,y:210},60,390,400);assert.deepEqual(sample(.7),sample(.7));assert.equal(sample(.7).length,1);h.shieldPunch.state='normal';h.shidunImpactAt=1;assert.ok(sample(1.2)[0].span>=195);assert.deepEqual(sample(2),[]);h.hp=0;assert.deepEqual(sample(1.2),[]);});

test('self shield completes a second punch without ally shields or incoming attacks',()=>{
 const b=make(),h=b.heroes[0];h.energy=100;
 const events=[];for(let i=0;i<240;i++)events.push(...b.tick(1/60));
 const punches=events.filter(e=>e.type==='skill'&&e.shieldPunch);
 const hits=events.filter(e=>e.type==='hit'&&e.from===h.id);
 assert.equal(punches.length,1);assert.equal(hits.length,3);
 assert.ok(hits.every(e=>e.at>2.8&&e.at<3.4));
 assert.equal(h.shield,0,'punch spends all shield');
});
test('charge energy uses simulation time and stops after interruption',()=>{
 const b=make(),h=b.heroes[0];h.energy=100;b.tick(.01);
 b.tick(.25);b.tick(.25);assert.equal(h.energy,17);assert.equal(h.shieldPunch.chargeRemainder,500);
 for(let i=0;i<20;i++)b.tick(0);assert.equal(h.energy,17);assert.equal(h.shieldPunch.chargeRemainder,500);
 h.stun=3;b.tick(.01);const energy=h.energy;
 for(let i=0;i<20;i++)b.tick(.1);assert.equal(h.energy,energy);
 assert.equal(h.shieldState,'controlled');assert.ok(b.enemies.every(e=>e.hp===10000));
});

test('charge survives past four seconds and later shield still releases the punch',()=>{
 const b=make(),h=b.heroes[0];h.energy=0;h.shieldPunch.config.chargeEnergyPerSecond=0;
 b.shield(h,3500,h);for(let i=0;i<200;i++)b.tick(.05);
 assert.equal(h.shieldState,'charging');assert.equal(h.shieldPunch.firstAt,0);
 b.shield(h,1600,h);const events=[];for(let i=0;i<30;i++)events.push(...b.tick(.05));
 assert.equal(events.filter(e=>e.type==='hit'&&e.from===h.id).length,3);
});
test('partial shield damage preserves charge; breaking shield cancels even a primed punch',()=>{
 for(const primed of [false,true]){
  const b=make(),h=b.heroes[0];h.energy=0;b.tick(0);b.shield(h,3500,h);
  if(primed)b.shield(h,1600,h);
  b.harm(h,100,b.enemies[0]);assert.equal(h.shieldState,primed?'primed':'charging');
  h.energy=99;b.harm(h,9000,b.enemies[0]);
  assert.equal(h.shieldState,'normal');assert.equal(h.shieldPunch.cancelReason,'shieldBroken');
  const events=[];for(let i=0;i<40;i++)events.push(...b.tick(.05));
  assert.equal(events.filter(e=>e.type==='hit'&&e.from===h.id).length,0);
 }
});

test('punch release clears shields but preserves locked damage',()=>{const b=make(),h=b.heroes[0];h.energy=100;let locked=7000;for(let i=0;i<220;i++){b.tick(1/60);if(h.shieldState==='primed')locked=h.shieldPunch.shieldAtSecond;if(h.shieldState==='punching'){assert.equal(h.shield,0);assert.equal(h.shieldPunch.shieldAtSecond,locked);return;}}assert.fail('no punch');});
