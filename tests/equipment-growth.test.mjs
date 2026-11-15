import test from 'node:test';
import assert from 'node:assert/strict';
import * as G from '../core.mjs';
import * as E from '../equipment.mjs';
import {developed} from '../scripts/balance-street.mjs';
import {CombatText} from '../combat-text.mjs';
import {damageTextStyle,criticalFrameSize,drawCriticalFrame} from '../damage-text-style.mjs';
import {equipmentSVG} from '../art.mjs';
import {activityReward} from '../activities.mjs';

test('legacy +12 gear preserves IDs, owners, rolls and growth; +15 survives repeated save/import',()=>{
 const s=developed();for(const e of s.inventory.items)if(e.slot!=='rune'){e.enhance=12;e.subs.forEach(a=>a.growth=0);e.subs[0].growth=4;}
 const restored=G.decodeSave(G.encodeSave(s));assert.deepEqual(restored.inventory,s.inventory);
 const e=restored.inventory.items.find(e=>e.slot==='claw'),uid=e.id,owner=E.gearOwner(restored,uid),subs=structuredClone(e.subs);
 for(let i=0;i<3;i++)assert.ok(E.enhanceGear(restored,uid));assert.equal(e.enhance,15);assert.equal(E.enhanceGear(restored,uid),false);
 assert.equal(E.gearOwner(restored,uid),owner);assert.deepEqual(e.subs.map(a=>[a.key,a.roll]),subs.map(a=>[a.key,a.roll]));assert.equal(e.subs.reduce((n,a)=>n+a.growth,0),5);
 assert.deepEqual(G.decodeSave(G.encodeSave(restored)).inventory,restored.inventory);
});
test('gear carries late attack and health growth while defense and crit stay bounded',()=>{
 const s=developed(),bare=structuredClone(s);bare.inventory=E.normalizeInventory(null,bare.roster.owned);
 for(const c of G.CATS){const equipped=G.catStats(s,c.id),naked=G.catStats(bare,c.id);assert.ok(equipped.atk>naked.atk*50);assert.ok(equipped.hp>naked.hp*50);assert.ok(equipped.armor<500);assert.ok(equipped.magicResist<500);assert.ok(equipped.crit<=80);}
 for(let tier=1;tier<=6;tier++){const e=E.generateGear(tier,1,{slot:'claw',set:'hunt',quality:3});e.tier=tier;let last=0;for(let n=0;n<=15;n++){e.enhance=n;const attack=E.gearValues(e).atk;assert.ok(attack>last);last=attack;}}
});
test('actual endgame battle produces million-scale character damage without modifying combatant stats',()=>{
 const s=developed();s.party=['orange','pudding','bolt','ink','spark'];const b=new G.Battle(s,{stage:600,seed:527});let maximum=0;
 while(!b.result){for(const e of b.tick(.1))if(e.type==='hit'&&!e.rescue&&e.from?.startsWith('p'))maximum=Math.max(maximum,e.value);if(b.canCd===0)b.openCan();}
 assert.equal(b.result,'win');assert.ok(maximum>=1_000_000);assert.ok(maximum<100_000_000);
 const undergeared=structuredClone(s);for(const e of undergeared.inventory.items)if(e.slot!=='rune'){e.enhance=0;e.subs.forEach(a=>a.growth=0);}
 const weak=new G.Battle(undergeared,{stage:600,seed:527});while(!weak.result){weak.tick(.1);if(weak.canCd===0)weak.openCan();}assert.equal(weak.result,'lose');
});
test('only enhanced ordinary equipment receives a shared +1 to +15 corner label',()=>{
 const e=E.generateGear(1,600,{slot:'claw',quality:3});assert.ok(!equipmentSVG(e).includes('gear-enhance-badge'));
 for(const enhance of [1,9,10,15]){e.enhance=enhance;assert.ok(equipmentSVG(e).includes('data-enhance="'+enhance+'">+'+enhance));}
 const rune=E.generateGear(2,600,{slot:'rune'});assert.ok(!equipmentSVG(rune).includes('gear-enhance-badge'));
});
test('target numbers share a fixed origin, move vertically and keep normal/critical type size equal',()=>{
 const nodes=[],layer={ownerDocument:{createElement:()=>({style:{},remove(){nodes.splice(nodes.indexOf(this),1);}})},appendChild:e=>nodes.push(e)},text=new CombatText(layer);
 text.setAnchors({p0:{x:36,y:62}});
 text.consume([{type:'hit',to:'p0',value:8,serial:1}],{p0:{x:90,y:10}},0);
 text.consume([{type:'hit',to:'p0',value:1234567,crit:true,serial:2}],{p0:{x:12,y:90}},.1);
 assert.equal(nodes[0].style.left,nodes[1].style.left);assert.equal(nodes[0].style.top,nodes[1].style.top);assert.equal(nodes[0].style.fontSize,nodes[1].style.fontSize);assert.equal(nodes[1].textContent,'1234567');
 text.render(.2);assert.ok(!nodes[1].style.transform.includes('rotate'));assert.notEqual(nodes[0].style.transform,nodes[1].style.transform);
 assert.equal(damageTextStyle({crit:true}).size,damageTextStyle({}).size);assert.ok(criticalFrameSize(56).width>criticalFrameSize(6).width);
 const calls=[];drawCriticalFrame({drawImage(...args){calls.push(args);}},{width:128,height:64},0,0,84,26);assert.equal(calls.length,9);assert.equal(calls[0][7],12);assert.equal(calls[2][7],12);
 text.clear();assert.equal(nodes.length,0);
});
test('upper salvage tiers support fifteen enhancement steps without inflating early rewards',()=>{
 assert.equal(activityReward({kind:'parts',tier:1,first:false}).scrap,24);
 assert.equal(activityReward({kind:'parts',tier:8,first:false}).scrap,384);
 assert.equal(activityReward({kind:'parts',tier:8,first:false,rewardable:false}).scrap,0);
});
