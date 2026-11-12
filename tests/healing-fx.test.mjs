import test from 'node:test';
import assert from 'node:assert/strict';
import {healingImpact,paintHealing} from '../healing-fx.mjs';
import {sampleRoute} from '../vfx-motion.mjs';
import {BattleCues,formationPositions} from '../battle-cues.mjs';
import {Battle,initialState} from '../core.mjs';

test('healing stays attached to each recipient, leaves their face clear and ends completely',()=>{
 const center={x:180,y:150},size=66;
 for(let t=0;t<1.32;t+=1/60){
  const particles=healingImpact(center,size,t,1.32,7);assert.ok(particles.length<=12);
  for(const p of particles){
   for(const key of ['x','y','width','height','alpha','angle'])assert.ok(Number.isFinite(p[key]));
   assert.ok(p.alpha>=0&&p.alpha<=1);
   if(p.layer>0&&p.art==='heal-stream')assert.ok(p.y-p.height*.5>center.y-size*.2,'flow stays below the face');
   if(p.layer>0&&p.y<center.y-size*.2)assert.ok(Math.abs(p.x-center.x)>=size*.35,'high motes stay beside the face');
  }
 }
 const a=healingImpact(center,size,.45,1.32,7),b=healingImpact({x:214,y:167},size,.45,1.32,7);
 assert.deepEqual(a,healingImpact(center,size,.45,1.32,7));
 a.forEach((p,i)=>{assert.ok(Math.abs(b[i].x-p.x-34)<1e-8);assert.ok(Math.abs(b[i].y-p.y-17)<1e-8);});
 assert.ok(a.some(p=>p.layer===0)&&a.some(p=>p.layer>0));assert.equal(healingImpact(center,size,1.32,1.32).length,0);
});

test('milk heals all five actual teammates with local light rather than flying milk or heart icons',()=>{
 const s=initialState();s.highest=60;s.party=['orange','ink','milk','mint','bolt'];const b=new Battle(s),c=new BattleCues(),pos=formationPositions(b),sizes=Object.fromEntries(b.heroes.map(h=>[h.id,66]));
 b.heroes.forEach(h=>h.hp=h.maxHp*.3);const nurse=b.heroes[2];
 c.consume([{type:'release',from:nurse.id,to:nurse.id,kind:'skill',travel:.29}],b,pos);
 const release=c.active(0).find(r=>r.style==='heal');assert.ok(release);
 const flying=sampleRoute(release,.12,390,592,pos,sizes);assert.ok(flying.length);assert.ok(flying.every(p=>p.art.startsWith('heal-')));
 b.skill(nurse);c.consume(b.events,b,pos);const hit=c.active(0).find(r=>r.style==='heal');assert.equal(hit.targets.length,5);assert.equal(hit.until-hit.born,1.32);
 const frame=sampleRoute(hit,.45,390,592,pos,sizes);assert.equal(frame.filter(p=>p.art==='heal-light'&&!p.vertical).length,5);assert.ok(frame.every(p=>p.art.startsWith('heal-')));
});

test('healing painter works without an atlas and restores the canvas state',()=>{
 let saved=0,filled=0;const gradient={addColorStop(){}};
 const ctx={save(){saved++;},restore(){saved--;},translate(){},scale(){},rotate(){},createRadialGradient:()=>gradient,createLinearGradient:()=>gradient,beginPath(){},arc(){},ellipse(){},moveTo(){},lineTo(){},closePath(){},fill(){filled++;}};
 for(const p of healingImpact({x:100,y:100},66,.4,1.32))assert.equal(paintHealing(ctx,p),true);
 assert.equal(saved,0);assert.ok(filled>20);assert.equal(paintHealing(ctx,{art:'fire'}),false);
});
