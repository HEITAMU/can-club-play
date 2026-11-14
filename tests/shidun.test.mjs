import test from 'node:test';import assert from 'node:assert/strict';
import {Battle,initialState} from '../core.mjs';import {shidunTargets,shidunTarget,shidunPose} from '../shidun-motion.mjs';import {sampleShidun} from '../shidun-fx.mjs';import {rosterVertex} from '../finished-roster-renderer.mjs';
const make=()=>{const s=initialState();s.highest=120;s.party=['pudding','orange','milk','star','ink'];const b=new Battle(s,{stage:20});for(const a of [...b.heroes,...b.enemies]){a.hp=a.maxHp=10000;a.wait=a.skillWait=99;}return b;};
test('Shidun hits one front and its two rear slots, without filling empty slots',()=>{const es=Array.from({length:5},(_,i)=>({id:'e'+i,hp:100}));assert.deepEqual(shidunTargets(es,'e0').map(x=>x.id),['e0','e2','e3']);assert.deepEqual(shidunTargets(es,'e1').map(x=>x.id),['e1','e3','e4']);assert.deepEqual(shidunTargets(es,'e3').map(x=>x.id),['e3']);es[2].hp=0;assert.deepEqual(shidunTargets(es,'e0').map(x=>x.id),['e0','e3']);es[0].hp=0;assert.deepEqual(shidunTargets(es,'e0').map(x=>x.id),[]);assert.equal(shidunTargets(es.slice(0,1),'e0').length,0);});
test('charge is visible before second shield, punch damage happens once at impact on at most three targets',()=>{const b=make(),h=b.heroes[0];b.shield(h,3500,h);assert.equal(h.shieldState,'charging');for(let i=0;i<30;i++)b.tick(1/60);assert.ok(b.enemies.every(e=>e.hp===10000));const pose=shidunPose(h,b.time);assert.equal(pose.shidunCel,4);assert.ok(pose.shidunCharge>0);for(let t=0;t<2;t+=.01)assert.deepEqual(rosterVertex('pudding',200,518,{...pose,shidunTime:t}),[200,518]);b.shield(h,1600,h);const hits=[];for(let i=0;i<150;i++)hits.push(...b.tick(1/60).filter(e=>e.type==='hit'&&e.from===h.id));assert.deepEqual(hits.map(e=>e.to),['e0','e2','e3']);assert.ok(hits.every(e=>e.at>=1.35+.42-1e-8));assert.equal(h.shieldState,'normal');assert.ok(b.enemies[1].hp===10000&&b.enemies[4].hp===10000);});
test('full energy adds shield during charge; control cancels pending punch',()=>{const b=make(),h=b.heroes[0];b.shield(h,3500,h);h.energy=100;b.tick(.1);assert.equal(h.energy,0);assert.equal(h.shieldState,'primed');h.stun=1;b.tick(.1);assert.equal(h.shieldState,'controlled');for(let i=0;i<100;i++)b.tick(.05);assert.ok(b.enemies.every(e=>e.hp===10000));});
test('pressure effects share frozen simulation time and impact ends within a bounded envelope',()=>{const b=make(),h=b.heroes[0];b.shield(h,3500,h);const sample=t=>sampleShidun(h,t,{x:140,y:210},60,390,400);assert.deepEqual(sample(.7),sample(.7));assert.equal(sample(.7).length,1);h.shieldPunch.state='normal';h.shidunImpactAt=1;assert.deepEqual(sample(1.2),[]);assert.deepEqual(sample(2),[]);h.hp=0;assert.deepEqual(sample(1.2),[]);});

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

test('punch switches to the other front before randomly choosing a rear',()=>{const es=Array.from({length:5},(_,i)=>({id:'e'+i,hp:100}));let calls=0;const rng=()=>{calls++;return .99;};assert.equal(shidunTarget(es,'e1',rng).id,'e1');es[1].hp=0;assert.equal(shidunTarget(es,'e1',rng).id,'e0');assert.equal(calls,0);es[0].hp=0;const picked=shidunTarget(es,'e1',rng);assert.equal(picked.id,'e4');assert.equal(calls,1);assert.equal(shidunTarget(es,picked.id,rng).id,'e4');assert.equal(calls,1);assert.deepEqual(shidunTargets(es,picked.id).map(e=>e.id),['e4']);});

test('release reselects a living front after the charge target dies',()=>{const b=make(),h=b.heroes[0];b.shield(h,3500,h);for(let i=0;i<30;i++)b.tick(1/60);b.enemies[0].hp=0;b.shield(h,1600,h);const hits=[];for(let i=0;i<150;i++)hits.push(...b.tick(1/60).filter(e=>e.type==='hit'&&e.from===h.id));assert.deepEqual(hits.map(e=>e.to),['e1','e3','e4']);});
test('punch runs to midfield in front of the target and returns home',async()=>{const {travelOffset}=await import('../motion.mjs');const a={catId:'pudding',side:'p',hp:100,action:{shieldStrike:true,shieldReposition:true,impactAt:.42,hold:.08,duration:1.07,elapsed:0}},src={x:32,y:65},tar={x:72,y:58};const at=t=>{a.action.elapsed=t;return travelOffset(a,{},src,tar,400,600,60,60);};assert.deepEqual(at(0),{x:0,y:-0});assert.deepEqual(at(.42),{x:16,y:-42});assert.deepEqual(at(1.07),{x:0,y:-0});});

test('aligned punch stays home and impact particles match only actual victims',async()=>{const {travelOffset}=await import('../motion.mjs');const a={catId:'pudding',hp:100,action:{shieldStrike:true,shieldReposition:false,elapsed:.4},shidunImpactAt:1,shidunHitTargets:['e1','e3']};assert.deepEqual(travelOffset(a,{}, {x:36,y:89},{x:64,y:89},400,600),{x:0,y:0});const particles=sampleShidun(a,1.2,{x:140,y:300},60,400,600,null,{e1:{x:64,y:89},e3:{x:78,y:73},e0:{x:64,y:59}});assert.deepEqual(particles.map(p=>p.targetId),['e1','e3']);assert.equal(particles[0].x,256);assert.equal(particles[0].y,534);});
