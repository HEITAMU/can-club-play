import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle,CATS,initialState} from '../core.mjs';
import {IDLE_PROFILES,idlePose} from '../idle-motion.mjs';
import {actionTiming,battleRate,projectilePose} from '../motion.mjs';
import {BattleCues} from '../battle-cues.mjs';

test('all eight idle performances move distinctly while keeping the foot anchor fixed',()=>{
 assert.deepEqual(Object.keys(IDLE_PROFILES).sort(),CATS.map(c=>c.id).sort());
 const signatures=[];
 for(const c of CATS){
  const samples=Array.from({length:120},(_,i)=>idlePose(c.id,i/10));
  assert.ok(new Set(samples.map(p=>p.angle.toFixed(3))).size>80,c.id);
  for(const p of samples){assert.equal(p.y,0);assert.ok(Math.abs(p.angle)<2.1);assert.ok(p.sx>.98&&p.sx<1.02);assert.ok(p.sy>.97&&p.sy<1.03);}
  signatures.push(JSON.stringify(samples));
 }
 assert.equal(new Set(signatures).size,8);
});

test('one-speed is calmer and two-speed keeps an exact two-to-one clock ratio',()=>{
 assert.ok(battleRate(1)<1&&battleRate(1)>=.85);
 assert.equal(battleRate(2),2*battleRate(1));
 const actor={side:'p',catId:'orange',interval:1.5};
 const t=actionTiming(actor);
 assert.ok(t.hold/battleRate(1)>=.08);
 assert.ok(t.recovery/battleRate(1)>.3);
 assert.ok(t.duration<actor.interval);
});

test('release and impact timestamps remain aligned across coarse and fine ticks',()=>{
 function run(step){
  const s=initialState();s.party=['ink'];const b=new Battle(s,{stage:1}),h=b.heroes[0];
  h.wait=0;h.crit=0;for(const e of b.enemies){e.wait=99;e.hp=e.maxHp=1e6;}
  const events=[];for(let i=0;i<Math.round(1/step);i++)events.push(...b.tick(step));
  const windup=events.find(e=>e.type==='windup'),release=events.find(e=>e.type==='release'),hit=events.find(e=>e.type==='hit');
  assert.ok(windup&&release&&hit);
  assert.ok(Math.abs(hit.at-release.at-release.travel)<1e-9);
  const cues=new BattleCues();cues.consume([release],b,{p0:{x:20,y:50},e0:{x:80,y:50}});
  assert.equal(cues.routes.get('p0').born,release.at);
  return [windup.at,release.at,hit.at];
 }
 const a=run(.01),b=run(.1);a.forEach((n,i)=>assert.ok(Math.abs(n-b[i])<1e-9));
});

test('projectiles arrive at their actual targets and never continue past the hit',()=>{
 const from={x:20,y:70},to={x:80,y:40},travel=.29;
 for(const style of ['arrow','fire','ice','milk','star','heal','electric']){
  const start=projectilePose(from,to,390,300,0,travel,style);
  const end=projectilePose(from,to,390,300,travel,travel,style);
  assert.equal(start.x,78);assert.equal(start.y,210);
  assert.ok(Math.abs(end.x-312)<1e-9&&Math.abs(end.y-120)<1e-9);
  assert.equal(projectilePose(from,to,390,300,travel+.001,travel,style).visible,false);
  assert.equal(projectilePose(from,to,390,300,-.001,travel,style).visible,false);
 }
 for(let shot=0;shot<3;shot++){
  const end=projectilePose(from,to,390,300,travel-(2-shot)*.035,travel,'arrow',shot,3);
  assert.ok(Math.abs(end.progress-1)<1e-9);
 }
 assert.ok(Object.values(projectilePose(from,from,390,300,.15,travel,'heal')).every(v=>typeof v==='boolean'||Number.isFinite(v)));
});

test('render sampling at a frozen clock cannot advance idles or projectiles',()=>{
 const from={x:20,y:50},to={x:80,y:50};
 for(const c of CATS){const before=idlePose(c.id,3.7);assert.deepEqual(idlePose(c.id,3.7),before);}
 const first=projectilePose(from,to,390,300,.12,.29,'fire');
 for(let i=0;i<20;i++)assert.deepEqual(projectilePose(from,to,390,300,.12,.29,'fire'),first);
});
