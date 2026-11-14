import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle,initialState} from '../core.mjs';
import {BattleCues,formationPositions} from '../battle-cues.mjs';
import {CombatEffects,GuardEffects} from '../painted-fx.mjs';
import {sampleProjectile} from '../vfx-motion.mjs';
import {canHitAt} from '../can-timing.mjs';

test('rescue removes unfinished attacks from defeated enemies while retaining completed impacts',()=>{
 for(const phase of ['windup','release']){
 const b=new Battle(initialState(),{stage:2}),c=new BattleCues(),enemy=b.enemies[0],positions=formationPositions(b);
 enemy.wait=0;enemy.hp=1;b.openCan();c.consume(b.events.splice(0),b,positions);b.time=canHitAt(0)-.03;b.beginAction(enemy,'normal');
 if(phase==='release')b.advanceAction(enemy,enemy.action.windup);
 c.consume(b.events.splice(0),b,positions);
 c.addRoute('finished-hit',enemy.id,['p0'],'普攻','enemy',b.time,positions,'impact',.32,{style:'melee'});
 assert.ok(c.active(b.time).some(r=>r.from===enemy.id&&r.phase===phase));
 b.time=canHitAt(0);b.advanceCan();c.consume(b.events.splice(0),b,positions);
 assert.equal(enemy.hp,0);
 assert.ok(!c.active(b.time).some(r=>r.from===enemy.id&&r.phase!=='impact'));
 assert.ok(c.active(b.time).some(r=>r.from===enemy.id&&r.phase==='impact'));
 assert.ok(c.active(b.time).some(r=>r.from==='can'&&r.style==='can-rescue'));
 assert.equal(c.entries[0].from,'开罐啦');
 }
});

test('rescue interruption still removes the boss warning and records success',()=>{
 const b=new Battle(initialState(),{stage:20}),c=new BattleCues(),enemy=b.enemies[0],positions=formationPositions(b);
 enemy.hp=enemy.maxHp=1e6;enemy.charge=2;
 c.consume([{type:'charge',from:enemy.id,to:enemy.id}],b,positions);
 b.openCan();c.consume(b.events.splice(0),b,positions);
 assert.equal(enemy.charge,0);
 assert.ok(!c.active(b.time).some(r=>r.from===enemy.id&&r.phase==='windup'));
 assert.ok(c.entries[0].effect.includes('打断成功'));
});

function projectileFixture(style='arrow'){
 const route={id:1,from:'p0',targets:['e0'],phase:'release',style,kind:'normal',born:1,until:1.4,travel:.29,positions:{p0:{x:20,y:70},e0:{x:80,y:60}}};
 const draw=(time,centers)=>sampleProjectile(route,'e0',time,390,300,centers,{p0:50,e0:50});
 return {route,draw};
}
const xy=sample=>[sample.x,sample.y];

test('ranged effects keep their launch point and arrive at a moving target, then stop on the hit clock',()=>{
 for(const style of ['arrow','fire','ice','milk','star','heal','electric']){
  const {route,draw}=projectileFixture(style),centers={p0:{x:35,y:65},e0:{x:60,y:40}};
  const launch=xy(draw(1,centers));
  assert.ok(Math.abs(launch[0]-(78+50*.23))<1e-9,style+' launch position stays fixed');
  const hit=xy(draw(1.29,centers));
  assert.ok(Math.abs(hit[0]-234)<1e-9&&Math.abs(hit[1]-120)<1e-9,style+' reaches current target');
  assert.equal(draw(1.291,centers).visible,false,style+' disappears after impact');
  assert.deepEqual(route.positions.e0,{x:80,y:60},'saved event positions remain untouched');
 }
});

test('projectiles freeze with the battle clock and fall back to recorded target positions when absent',()=>{
 const {draw}=projectileFixture('ice'),centers={p0:{x:20,y:70},e0:{x:65,y:45}};
 const frozen=draw(1.14,centers);
 for(let i=0;i<10;i++)assert.deepEqual(draw(1.14,centers),frozen);
 const end=xy(draw(1.29,{}));
 assert.ok(Math.abs(end[0]-312)<1e-9&&Math.abs(end[1]-180)<1e-9);
});

 test('orange support and block impacts cannot duplicate actor-bound shields or populate empty slots',()=>{
 const b=new Battle(initialState()),cues=new BattleCues(),fx=new CombatEffects(null),guards=new GuardEffects(),orange=b.heroes[0];
 b.skill(orange);const centers={p0:{x:20,y:70},p1:{x:40,y:70},empty:{x:60,y:70}};
 cues.consume(b.events.splice(0),b,centers);guards.render([...b.heroes,...b.enemies],0,centers,{},fx);
 guards.render([...b.heroes,...b.enemies],.2,centers,{},fx);
 const particles=fx.render(cues.active(.2),.2,400,400,centers,{}),shells=particles.filter(p=>p.art==='shield');
 assert.equal(shells.length,2);assert.deepEqual(shells.map(p=>p.x).sort((a,b)=>a-b),[80,160]);
 const hit={id:99,from:'e0',targets:['p0'],phase:'impact',style:'shield',tone:'enemy',born:0,until:.44,positions:{e0:{x:80,y:40},p0:centers.p0}};
 assert.equal(fx.render([hit],.2,400,400,centers,{}).filter(p=>p.art==='shield').length,2);
 b.heroes[1].hp=0;guards.render([...b.heroes,...b.enemies],.3,centers,{},fx);
 assert.equal(fx.render([], .3,400,400,centers,{}).filter(p=>p.art==='shield').length,1);
 });
