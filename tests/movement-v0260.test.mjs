import test from 'node:test';
import assert from 'node:assert/strict';
import {actionTiming,travelOffset,poseFor} from '../motion.mjs';
import {initialState} from '../core.mjs';
import {inventoryHTML} from '../inventory-ui.mjs';
test('ranged normal attacks remain at formation while melee approaches, holds and returns continuously',()=>{
 for(const catId of ['orange','pudding','ink','milk','spark','mint','bolt','star']){
  const a={id:'p0',catId,side:'p',hp:100,interval:1.5},timing=actionTiming(a);a.action={...timing,kind:'normal',elapsed:0};
  const at=t=>{a.action.elapsed=t;return travelOffset(a,poseFor(a,t),{x:20,y:65},{x:80,y:45},390,500,70,70,t);};
  const points=Array.from({length:201},(_,i)=>at(timing.duration*i/200));
  assert.ok(points[0].x===0&&points[0].y===0);assert.ok(points.at(-1).x===0&&points.at(-1).y===0);
  if(['orange','pudding'].includes(catId)){
   assert.ok(Math.hypot(...Object.values(at(timing.impactAt)))>100);
   assert.deepEqual(at(timing.impactAt),at(timing.impactAt+timing.hold*.9));
   assert.ok(points.slice(1).every((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y)<15));
  }else assert.ok(points.every(p=>p.x===0&&p.y===0),catId);
 }
});
test('inventory grid pagination includes each unequipped item once and preserves IDs',()=>{
 const s=initialState(),sample=s.inventory.items.find(e=>e.slot!=='rune');s.inventory.equipped={};
 s.inventory.items=Array.from({length:35},(_,i)=>({...sample,id:'e'+i}));
 const found=[];for(let page=0;page<3;page++){const html=inventoryHTML(s,{tab:'equipment',page});found.push(...[...html.matchAll(/data-gear="([^"]+)"/g)].map(m=>m[1]));}
 assert.equal(found.length,35);assert.equal(new Set(found).size,35);
});
