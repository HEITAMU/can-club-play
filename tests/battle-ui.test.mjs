import test from 'node:test';
import assert from 'node:assert/strict';
import {Battle,initialState} from '../core.mjs';
import {poseFor,actionTiming,travelOffset} from '../motion.mjs';
import {HealthTrails,rescueView,bossView} from '../battle-ui.mjs';
const actor={id:'p0',side:'p',catId:'orange',hp:100};
const action=()=>({...actionTiming(actor),kind:'normal',elapsed:0});

test('melee travel remains continuous through windup, strike, and return',()=>{
 const a={...actor,action:action()};
 for(const boundary of [a.action.windup,a.action.impactAt,a.action.impactAt+a.action.hold,a.action.duration]){
  a.action.elapsed=boundary-1e-7;const before=poseFor(a,0).move;
  a.action.elapsed=boundary+1e-7;const after=poseFor(a,0).move;
  assert.ok(Math.abs(before-after)<.00001);
 }
 a.action.elapsed=a.action.impactAt;assert.equal(poseFor(a,0).move,1);
 a.action.elapsed=a.action.duration;assert.equal(poseFor(a,0).move,0);
});
test('melee closes the gap without passing the target; same-position skills stay finite',()=>{
 const a={...actor,action:action()},pose={move:1},from={x:42,y:66},to={x:81,y:65};
 const offset=travelOffset(a,pose,from,to,375,324,133,144);
 const distance=Math.hypot((to.x-from.x)*3.75,(to.y-from.y)*3.24);
 assert.ok(Math.hypot(offset.x,offset.y)<=distance-(133+144)*.28+.001);
 assert.deepEqual(travelOffset(a,pose,from,from,375,324),{x:0,y:0});
 assert.deepEqual(travelOffset(a,pose,from,{x:44,y:66},375,324),{x:0,y:0});
});
test('recoil and travel freeze when simulation time is unchanged',()=>{
 const a={...actor,action:action(),hitUntil:2.18};a.action.elapsed=.3;
 const get=()=>travelOffset(a,poseFor(a,2.06),{x:42,y:66},{x:81,y:65},375,324,133,144,2.06);
 const before=JSON.stringify(a),first=get();for(let n=0;n<20;n++)assert.deepEqual(get(),first);
 assert.equal(JSON.stringify(a),before);
 assert.equal(travelOffset({...actor,hitUntil:2.18},{move:0},null,null,375,324,133,144,2.2).x,0);
});
test('damage trail holds briefly, catches up, and handles consecutive hits',()=>{
 const h=new HealthTrails();assert.equal(h.value('p',1,0),1);
 assert.equal(h.value('p',.7,1),1);assert.equal(h.value('p',.7,1.1),1);
 const mid=h.value('p',.7,1.3);assert.ok(mid>.7&&mid<1);
 assert.equal(h.value('p',.5,1.3),mid);assert.equal(h.value('p',.5,1.3),mid);
 assert.equal(h.value('p',.5,2),.5);h.clear();assert.equal(h.value('p',1,0),1);
});
test('healing never trails below health and regeneration cannot freeze a damage trail',()=>{
 const h=new HealthTrails();h.value('p',1,0);h.value('p',.5,1);
 let trail;for(let i=1;i<=60;i++)trail=h.value('p',.5+i*.001,1+i*.01);
 assert.equal(trail,.56);assert.equal(h.value('p',.9,1.7),.9);
});
test('boss cue and cooldown follow actual interrupt state without changing battle data',()=>{
 const s=initialState();s.party=['orange','ink','milk'];s.highest=4;
 const b=new Battle(s,{stage:5}),boss=b.enemies.find(e=>e.boss);boss.hp=boss.maxHp=10000;boss.charge=1.3;
 const before=JSON.stringify(b);assert.equal(bossView(b).charging,true);assert.equal(rescueView(b,true).ready,true);assert.equal(JSON.stringify(b),before);
 assert.equal(b.openCan(),true);assert.equal(bossView(b).charging,false);assert.equal(rescueView(b,true).progress,0);
 b.canCd=b.buff.canCd/2;assert.equal(rescueView(b,true).progress,.5);
 b.canCd=0;assert.equal(rescueView(b,false).ready,false);assert.equal(rescueView(b,true).ready,true);
 b.result='win';assert.equal(rescueView(b,true).ready,false);boss.charge=1;assert.equal(bossView(b).charging,false);
});
test('ordinary fights have no boss panel and adjusted cooldown uses its real duration',()=>{
 const b=new Battle(initialState(),{stage:1});assert.equal(bossView(b),null);
 b.buff.canCd=8;b.canCd=2;const info=rescueView(b,true);assert.equal(info.progress,.75);assert.equal(info.status,'冷却 2秒');
});
