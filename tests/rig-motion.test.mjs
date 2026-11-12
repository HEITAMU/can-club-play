import test from 'node:test';
import assert from 'node:assert/strict';
import {CATS,Battle,initialState} from '../core.mjs';
import {actionTiming} from '../motion.mjs';
import {rigPose,rigFor,preparePoint,deformPoint,blendRigPose} from '../rig-motion.mjs';
import {FormationMotion,retiringSize} from '../formation-motion.mjs';
const enemies=['dust','box','mop','battery','bag','drone','vacuum','fridge','sign','boxBoss','clock','vendor'];
const actors=[...CATS.map(c=>({id:c.id,catId:c.id,side:'p',hp:100,interval:1.5})),...enemies.map(id=>({id,type:id,side:'e',hp:100,interval:1.5}))];
test('all actors keep planted feet and have moving head, hand, or body points',()=>{
 for(const a of actors){const foot=rigFor(a.id).foot,p=preparePoint(a.id,.4,foot),upper=preparePoint(a.id,.52,.3),head=[];
  for(let i=0;i<240;i++){const pose=rigPose(a.id,a,i/60),f=deformPoint(a.id,p,pose),h=deformPoint(a.id,upper,pose);assert.ok(Math.abs(f.x-.4)<1e-8&&Math.abs(f.y-foot)<1e-8,a.id);head.push(h.x);}
  assert.ok(Math.max(...head)-Math.min(...head)>.015,a.id+' has readable continuous motion');
 }
});
test('normal and skill motion is continuous at anticipation, release, hold and recovery boundaries',()=>{
 for(const a of actors)for(const kind of ['normal','skill']){const timing=actionTiming(a,kind),actor={...a,action:{...timing,kind,elapsed:0}};
  for(const edge of [0,timing.windup,timing.impactAt,timing.impactAt+timing.hold,timing.duration]){
   const sample=t=>{actor.action.elapsed=Math.max(0,t);return rigPose(a.id,actor,3+t,8+t);};
   const before=sample(edge-1e-7),after=sample(edge+1e-7);for(const k of Object.keys(before))assert.ok(Math.abs(before[k]-after[k])<1e-5,a.id+' '+kind+' '+edge+' '+k);
  }
  actor.action.elapsed=timing.duration;const end=rigPose(a.id,actor,3+timing.duration,8+timing.duration);actor.action=null;const idle=rigPose(a.id,actor,3+timing.duration,8+timing.duration);for(const k of Object.keys(end))assert.ok(Math.abs(end[k]-idle[k])<1e-12);
 }
});
test('all action channels remain finite and follow through after impact',()=>{
 for(const a of actors)for(const kind of ['normal','skill']){const timing=actionTiming(a,kind),poses=[];
  for(let t=0;t<timing.duration+.04;t+=1/60){const pose=rigPose(a.id,{...a,action:{...timing,kind,elapsed:t}},t);assert.ok(Object.values(pose).every(Number.isFinite));poses.push(pose);}
  const before=rigPose(a.id,{...a,action:{...timing,kind,elapsed:timing.impactAt}},3),after=rigPose(a.id,{...a,action:{...timing,kind,elapsed:timing.impactAt+timing.hold*.75}},3+timing.hold*.75);assert.notDeepEqual(before,after);
 }
});
test('hit reaction rises and recovers continuously instead of selecting a still frame',()=>{
 for(const a of actors){const at=3,hit={...a,hitUntil:at+.22};const start=rigPose(a.id,hit,at),idle=rigPose(a.id,a,at);assert.deepEqual(start,idle);
  const peak=rigPose(a.id,hit,at+.11);assert.notEqual(peak.head,rigPose(a.id,a,at+.11).head);
  assert.deepEqual(rigPose(a.id,hit,at+.22),rigPose(a.id,a,at+.22));
 }
});
test('render blending freezes on pause and eases interruptions without overshoot',()=>{
 const before=rigPose('orange',actors[0],1),after={...before,lean:.15,hand:.5};assert.deepEqual(blendRigPose(before,after,0),before);
 const mid=blendRigPose(before,after,1/60);assert.ok(mid.lean>Math.min(before.lean,after.lean)&&mid.lean<Math.max(before.lean,after.lean));assert.deepEqual(blendRigPose(null,after,0),after);
});
test('incapacitated partners keep their original position and full scale',()=>{
 const s=initialState();s.party=['orange','ink','milk'];const b=new Battle(s),motion=new FormationMotion(),before=motion.update(b,0);b.heroes[0].hp=0;b.heroes[0].downAt=1;
 for(const t of [1,1.3,1.6,2,10]){assert.deepEqual(motion.update(b,t),before);assert.equal(retiringSize(52,b.heroes[0],t),52);}
 for(const c of CATS){const actor={catId:c.id,side:'p',hp:0,downAt:1},atRest=rigPose(c.id,actor,2),later=rigPose(c.id,actor,2.4);assert.equal(atRest.alpha,1);assert.ok(atRest.head>.3);assert.notEqual(atRest.breath,later.breath);assert.deepEqual(rigPose(c.id,actor,2),atRest);assert.ok(Object.values(atRest).every(Number.isFinite));}
});
