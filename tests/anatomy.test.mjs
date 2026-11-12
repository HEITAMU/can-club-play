import test from 'node:test';
import assert from 'node:assert/strict';
import {ANATOMY} from '../anatomy-data.mjs';
import {ANATOMY_LAYOUT,partPlacement,placedPoint} from '../anatomy-renderer.mjs';
import {EXPRESSIONS,expressionFor,faceTransition,bowNock} from '../expressions.mjs';
import {animationClock} from '../rig-motion.mjs';
import {actionTiming} from '../motion.mjs';

test('arm roots remain attached to their own shoulder while rotating, including shields and bow',()=>{
 for(const [id,kit] of Object.entries(ANATOMY)){
  assert.notDeepEqual(kit.parts.leftArm,kit.parts.rightArm);
  for(const [part,key] of [['leftArm','left'],['rightArm','right']]){
   const layout=ANATOMY_LAYOUT[id][key],placement=partPlacement(kit.parts[part],layout);
   for(const angle of [-.8,-.4,0,.4,.8]){
    const point=placedPoint(placement,layout.anchor,angle);
    assert.ok(Math.hypot(point[0]-layout.socket[0],point[1]-layout.socket[1])<1e-12,id+' '+part);
   }
  }
 }
});
test('expression priority follows defeat, victory, damage and the actual attack type',()=>{
 const base={side:'p',hp:10};
 assert.equal(expressionFor('orange',{...base,action:{kind:'normal'}},1),'attack');
 assert.equal(expressionFor('milk',{...base,action:{kind:'skill'}},1),'skill');
 assert.equal(expressionFor('milk',{...base,hitUntil:1.2,action:{kind:'skill'}},1),'hurt');
 assert.equal(expressionFor('orange',{...base,hitUntil:1.2},1,1,{outcome:'win'}),'victory');
 assert.equal(expressionFor('orange',{...base,hp:0},1,1,{outcome:'win'}),'down');
 assert.equal(expressionFor('orange',{...base,stun:2},1),'neutral');
});
test('all cats blink and return to neutral; the rejected controlled face is absent',()=>{
 for(const [id,kit] of Object.entries(ANATOMY)){
  assert.deepEqual(Object.keys(kit.faces),EXPRESSIONS);
  const seen=new Set();for(let t=0;t<7;t+=.025)seen.add(expressionFor(id,null,t));
  assert.deepEqual([...seen].sort(),['blink','neutral']);
  for(const box of [...Object.values(kit.parts),...Object.values(kit.faces)]){
   const [x,y,w,h]=box;assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=kit.width&&y+h<=kit.height);
  }
 }
});
test('paused face transitions and idle eyes stay frozen on the battle clock',()=>{
 const actor={hp:10};let face=faceTransition(null,'neutral',4);
 face=faceTransition(face,'hurt',4.1);face=faceTransition(face,'hurt',4.14);
 const frozen=faceTransition(face,'hurt',4.14);assert.deepEqual(frozen,face);
 assert.ok(face.mix>0&&face.mix<1);assert.equal(faceTransition(face,'hurt',4.3).mix,1);
 for(const idle of [7,8,9])assert.equal(expressionFor('orange',actor,4.14,animationClock(actor,4.14,idle)),'neutral');
 assert.equal(faceTransition(face,'neutral',0).mix,1);
});
test('bow releases its visible arrow with the projectile and reloads during recovery',()=>{
 const actor={catId:'ink',side:'p',hp:10},timing=actionTiming(actor,'normal');
 const value=elapsed=>bowNock({...actor,action:{...timing,elapsed}});
 assert.equal(value(timing.windup-.001),1);assert.equal(value(timing.windup),0);
 assert.equal(value(timing.impactAt),0);assert.ok(value(timing.impactAt+.14)>0);
 assert.equal(value(timing.impactAt+.28),1);assert.equal(bowNock(actor),1);
});
