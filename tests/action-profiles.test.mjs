import test from 'node:test';
import assert from 'node:assert/strict';
import {CAT_ACTIONS} from '../action-profiles.mjs';
import {Battle,CATS,initialState} from '../core.mjs';
import {BattleCues,formationPositions} from '../battle-cues.mjs';
import {attackStyle,actionTiming} from '../motion.mjs';
import {rigPose} from '../rig-motion.mjs';
import {sampleRoute,FX_CELLS,impactStyle} from '../vfx-motion.mjs';

test('all sixteen companion actions carry their own motion and effect profile through real combat',()=>{
 const motions=new Set(),effects=new Set();
 for(const cat of CATS)for(const kind of ['normal','skill']){
  const state=initialState();state.highest=120;state.party=[cat.id,...CATS.filter(c=>c.id!==cat.id).slice(0,4).map(c=>c.id)];
  const battle=new Battle(state,{stage:20}),cues=new BattleCues(),hero=battle.heroes[0],profile=CAT_ACTIONS[cat.id][kind],phases=new Set(),frames=[],motion=[];
  for(const a of [...battle.heroes,...battle.enemies]){a.hp=a.maxHp=100000;a.wait=99;a.skillWait=99;a.shield=0;}
  battle.heroes.forEach(h=>h.hp=50000);hero.crit=0;
  const timing=actionTiming(hero,kind),positions=formationPositions(battle),sizes=Object.fromEntries(Object.keys(positions).map(id=>[id,52]));
  battle.beginAction(hero,kind);hero.wait=99;
  for(let i=0;i<120;i++){
   const events=battle.events.splice(0);events.push(...battle.tick(1/60));cues.consume(events,battle,positions);
   const t=Math.min(timing.duration,i/120*timing.duration),pose=rigPose(cat.id,{...hero,action:{...timing,kind,elapsed:t}},t,0);motion.push([pose.hand,pose.lean]);
   for(const r of cues.active(battle.time).filter(r=>r.from===hero.id&&r.profile)){
    assert.equal(r.profile,profile.id);phases.add(r.phase);
    const particles=sampleRoute(r,battle.time,390,300,positions,sizes);
    for(const p of particles){assert.ok(p.art in FX_CELLS);assert.notEqual(p.art,'slash');for(const key of ['x','y','width','height','alpha','angle'])assert.ok(Number.isFinite(p[key]),profile.id+' '+key);}
    frames.push({style:impactStyle(r),particles});
   }
  }
  assert.deepEqual([...phases].sort(),['impact','release','windup'],profile.id);
  assert.ok(frames.some(f=>f.particles.length),profile.id+' draws effects');
  motions.add(JSON.stringify(motion));effects.add(JSON.stringify(frames));
 }
 assert.equal(motions.size,16);assert.equal(effects.size,16);
});

test('every monster uses only the shared melee or ranged normal attack and keeps its existing timing',()=>{
 const types=['dust','box','mop','battery','bag','drone','vacuum','fridge','sign','boxBoss','clock','vendor'],ranged=new Set(['mop','battery','drone','vacuum']);
 const seen=new Set();
 for(const type of types){
  const state=initialState(),battle=new Battle(state),enemy=battle.enemies[0];Object.assign(enemy,{type,interval:1.5,hp:100000});
  const style=attackStyle(enemy);seen.add(style);assert.equal(style,ranged.has(type)?'ranged':'melee');
  assert.equal(actionTiming(enemy).travel,ranged.has(type)?.29:.20);
  const cues=new BattleCues(),positions=formationPositions(battle);battle.beginAction(enemy,'normal');cues.consume(battle.events,battle,positions);
  const route=cues.active(battle.time).find(r=>r.from===enemy.id);assert.equal(route.style,style);assert.equal(route.profile,undefined);
 }
 assert.deepEqual([...seen].sort(),['melee','ranged']);
});
