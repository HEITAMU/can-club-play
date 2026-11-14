import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,setParty,removeParty,encodeSave,decodeSave,Battle,power,recruitCompanion} from '../core.mjs';
import {formationTarget,crewFormationHTML} from '../crew-formation.mjs';
import {formationPositions} from '../battle-cues.mjs';
import {crewEquipmentHTML,inventoryHTML} from '../inventory-ui.mjs';

test('all five slots accept a teammate without compressing empty positions, across reload',()=>{
 const s=initialState(),before={levels:{...s.levels},gold:s.gold,power:power(s)};
 assert.ok(setParty(s,4,'orange'));assert.deepEqual(s.party,[null,'ink',null,null,'orange']);
 assert.deepEqual(decodeSave(encodeSave(s)).party,s.party);assert.equal(power(s),before.power);assert.deepEqual(s.levels,before.levels);assert.equal(s.gold,before.gold);
 const battle=new Battle(s);assert.deepEqual(battle.heroes.map(h=>h.id),['p1','p4']);assert.deepEqual(formationPositions(battle).p4,{x:16,y:95});
 assert.ok(setParty(s,1,'orange'));assert.deepEqual(s.party,[null,'orange',null,null,'ink']);
});
test('downward removal leaves the other cat in place, conserves gear and training, keeps one fighter',()=>{
 const s=initialState();s.levels.orange=10;const inv=JSON.stringify(s.inventory);setParty(s,3,'ink');
 assert.ok(removeParty(s,'orange'));assert.deepEqual(s.party,[null,null,null,'ink']);
 assert.equal(s.levels.orange,10);assert.equal(JSON.stringify(s.inventory),inv);assert.equal(removeParty(s,'ink'),false);
 const reloaded=decodeSave(encodeSave(s));assert.deepEqual(reloaded.party,s.party);assert.equal(new Battle(reloaded).heroes[0].catId,'ink');
 s.roster.shards.milk=20;assert.ok(recruitCompanion(s,'milk'));assert.equal(s.party[0],'milk');assert.equal(s.party[3],'ink');
});
test('finger drops resolve in the gaps around sprites and downward into the bench, never outside',()=>{
 const b={left:10,top:100,right:350,bottom:460,width:340,height:360},bench={left:10,right:350,top:470,bottom:550};
 assert.equal(formationTarget(98,205,b,bench,true),2);assert.equal(formationTarget(105,300,b,bench,true),3);assert.equal(formationTarget(240,400,b,bench,true),1);
 assert.equal(formationTarget(90,485,b,bench,true),'bench');assert.equal(formationTarget(90,485,b,bench,false),null);assert.equal(formationTarget(420,300,b,bench,true),null);
});
test('formation exposes only owned companions and five enabled destinations',()=>{
 const html=crewFormationHTML(initialState());assert.equal((html.match(/data-formation-slot=/g)||[]).length,5);assert.ok(!html.includes('disabled'));assert.ok(!html.includes('未结识'));assert.ok(!html.includes('data-drag-cat="milk"'));
});
test('both equipment lists contain all available items exactly once, including beyond six',()=>{
 const s=initialState(),sample=s.inventory.items[0];s.inventory.equipped={};s.inventory.items=Array.from({length:38},(_,i)=>({...sample,id:'e'+i}));
 for(const html of [crewEquipmentHTML(s,'orange',{slot:''}),inventoryHTML(s,{tab:'equipment',slot:'',set:''})]){
  const ids=[...html.matchAll(/data-gear="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,38);assert.equal(new Set(ids).size,38);assert.ok(!html.includes('data-page='));
 }
});

 test('four-person rear slots stay fixed when a fifth companion joins',()=>{
 const s=initialState();s.roster.owned=['orange','ink','milk','mint'];s.party=['orange','ink','milk','mint'];
 const before=formationPositions(new Battle(s));assert.deepEqual(before.p2,{x:16,y:51});assert.deepEqual(before.p3,{x:22,y:73});
 s.roster.shards.spark=20;assert.ok(recruitCompanion(s,'spark'));const b=new Battle(s),after=formationPositions(b);
 assert.equal(b.heroes.find(h=>h.catId==='spark').formationSlot,4);assert.deepEqual(after.p2,before.p2);assert.deepEqual(after.p3,before.p3);assert.deepEqual(after.p4,{x:16,y:95});
 });
