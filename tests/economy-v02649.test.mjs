import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,encodeSave,decodeSave,Battle} from '../core.mjs';
import {activityInfo,activityReward,settleActivity} from '../activities.mjs';
import {rewardDay} from '../economy-limits.mjs';
const now=Date.UTC(2026,10,14,12);
function ready(){const s=initialState(now);s.highest=600;return s;}
function win(s,request,time=now){return settleActivity(s,activityInfo(s,request,time),time);}
test('materials have exclusive commission sources',()=>{
 const expected={sweep:'notes',escort:'badges',recruit:'shards',hard:'seals'};
 for(const [kind,key] of Object.entries(expected)){
  const info=activityInfo(ready(),{kind,id:kind==='recruit'?'milk':kind==='hard'?'coldstore':'',tier:1},now),r=activityReward(info);
  assert.ok(r[key]>0);for(const other of ['notes','badges','shards','seals'])if(other!==key)assert.equal(r[other],0);
 }
 for(const kind of ['hunt','salvage']){const r=activityReward(activityInfo(ready(),{kind,id:'market',tier:1},now));for(const key of Object.values(expected))assert.equal(r[key],0);}
});
test('first clear is separate from repeats; reward limit persists and resets at Beijing midnight',()=>{
 let s=ready(),q={kind:'sweep',tier:1};assert.equal(win(s,q).notes,28);
 for(let i=0;i<6;i++)assert.equal(win(s,q).notes,14);
 s=decodeSave(encodeSave(s),now);const before=s.growth.notes;assert.equal(win(s,q).rewardCapped,true);assert.equal(s.growth.notes,before);
 assert.equal(win(s,{kind:'sweep',tier:2}).notes,40);assert.equal(win(s,q).notes,0);
 assert.equal(win(s,q,now-86400000).notes,0);assert.equal(win(s,q,Date.UTC(2026,10,14,16)).notes,14);
 assert.equal(s.activities.rewardDay,rewardDay(Date.UTC(2026,10,14,16)));
});
test('hunt routes share repeat cap and capped practice gives no equipment or coins',()=>{
 const s=ready();for(const id of ['market','depot'])win(s,{kind:'hunt',id,tier:1});
 for(let i=0;i<6;i++)assert.ok(win(s,{kind:'hunt',id:i%2?'market':'depot',tier:1}).gearLoot);
 const before={gold:s.gold,items:s.inventory.items.length,scrap:s.inventory.materials.scrap};const r=win(s,{kind:'hunt',id:'depot',tier:1});
 assert.equal(r.gearLoot,null);assert.equal(r.gold,0);assert.deepEqual({gold:s.gold,items:s.inventory.items.length,scrap:s.inventory.materials.scrap},before);
});
test('all companion routes share three daily claims including the first clear',()=>{const s=ready();for(const id of ['milk','spark','all'])assert.equal(win(s,{kind:'recruit',id,tier:1}).shards,5);assert.equal(win(s,{kind:'recruit',id:'ink',tier:1}),null);assert.equal(win(s,{kind:'recruit',id:'all',tier:1},now+86400000).shards,5);});

test('armor reduction never restores armor; mint targets charging enemies before healers',()=>{
 const s=ready();s.roster.owned=['bolt','mint'];s.party=['bolt','mint'];const b=new Battle(s),[bolt,mint]=b.heroes,e=b.enemies[0];Object.assign(e,{hp:1e6,maxHp:1e6,initialArmor:100,armor:5});b.skill(bolt);assert.equal(e.armor,5);
 b.enemies.push({...e,id:'healer',arenaHealer:true,charge:0},{...e,id:'charging',charge:1});assert.equal(b.targetFor(mint,'skill').id,'charging');b.skill(mint);assert.equal(b.enemies.at(-1).charge,0);assert.ok(b.enemies.at(-1).stun>0);
});
test('ink skill has three separate timed impacts and cancels remaining arrows on cancellation',()=>{
 const s=ready();s.roster.owned=['ink'];s.party=['ink'];const b=new Battle(s),h=b.heroes[0];for(const e of b.enemies)Object.assign(e,{hp:1e6,maxHp:1e6});b.turnActor=null;b.turnStartAt=b.time;h.energy=100;b.beginAction(h,'skill');const at=h.action.impactAt;
 b.events=[];b.advanceAction(h,at+.001);assert.equal(b.events.filter(e=>e.type==='hit').length,1);b.advanceAction(h,.12);assert.equal(b.events.filter(e=>e.type==='hit').length,2);b.advanceAction(h,.12);assert.equal(b.events.filter(e=>e.type==='hit').length,3);
 h.action=null;b.advanceAction(h,1);assert.equal(b.events.filter(e=>e.type==='hit').length,3);
});
