import test from 'node:test';
import assert from 'node:assert/strict';
import {ANATOMY} from '../anatomy-data.mjs';
import {renderPuppetFrame} from '../rig-renderer.mjs';
import {rigPose,rigFor,animationClock,flowTrack} from '../rig-motion.mjs';
import {actionTiming,MotionOffsets} from '../motion.mjs';
import {effectEnvelope,impactStyle,shieldTransition} from '../painted-fx.mjs';
import {Battle,initialState} from '../core.mjs';
// Full-body visual contracts now live in finished-roster.test.mjs.
test('prepared battle idles advance on the ambient clock, active battle pauses freeze them',()=>{const a={hp:1};assert.equal(animationClock(a,0,2),2);assert.equal(animationClock(a,0,3),3);assert.equal(animationClock(a,4,20),4);assert.equal(animationClock(a,4,21),4);assert.equal(animationClock(null,4,21),21);});
test('spline position and velocity meet at interior animation keys',()=>{const points=[[0,0],[.2,-.3],[.5,.4],[.65,.5],[1,0]],eps=1e-5;for(const [t] of points.slice(1,-1)){const left=(flowTrack(t,points)-flowTrack(t-eps,points))/eps,right=(flowTrack(t+eps,points)-flowTrack(t,points))/eps;assert.ok(Math.abs(left-right)<.003);}});
test('interrupting a melee approach settles from its last visible position and freezes on pause',()=>{const motion=new MotionOffsets(),a={id:'p0',action:{}};motion.value(a,{x:45,y:-8},1);a.action=null;assert.deepEqual(motion.value(a,{x:0,y:0},1.01),{x:45,y:-8});const mid=motion.value(a,{x:0,y:0},1.1);assert.ok(mid.x>0&&mid.x<45);assert.deepEqual(motion.value(a,{x:0,y:0},1.1),mid);assert.deepEqual(motion.value(a,{x:0,y:0},1.3),{x:0,y:0});});
test('shield art follows actual raises, absorption, and break without changing combat damage',()=>{const b=new Battle(initialState()),a=b.heroes[0],enemy=b.enemies[0],hp=a.hp;a.armor=0;a.magicResist=0;b.shield(a,40,a);assert.equal(shieldTransition(0,a.shield),'raise');b.harm(a,20,enemy,{reflect:false});assert.equal(shieldTransition(40,a.shield),'block');assert.equal(a.hp,hp);const old=a.shield;b.harm(a,50,enemy,{reflect:false});assert.equal(shieldTransition(old,a.shield),'break');assert.equal(a.hp,hp-30);});
test('support and damaging effects remain distinguishable and end with zero opacity',()=>{assert.equal(impactStyle({style:'shield',tone:'support'}),'guard');assert.equal(impactStyle({style:'shield',tone:'enemy'}),'block');assert.equal(impactStyle({style:'milk',tone:'attack'}),'burst');assert.equal(impactStyle({style:'heal',tone:'support'}),'heal');for(const duration of [.32,.55,1.05]){assert.equal(effectEnvelope(0,duration),0);assert.equal(effectEnvelope(duration,duration),0);for(let t=0;t<duration;t+=.01)assert.ok(effectEnvelope(t,duration)>=0&&effectEnvelope(t,duration)<=1);}});
