import test from 'node:test';import assert from 'node:assert/strict';
import * as G from '../core.mjs';import * as E from '../equipment.mjs';
import {trainingCount,GROWTH_SAVE_KEY,GROWTH_SAVE_FORMAT} from '../growth-curve.mjs';
import {activityInfo,settleActivity} from '../activities.mjs';
import {crewProfileHTML} from '../crew-profile.mjs';
import {fight,frontier,earlyPair,equippedTeam} from '../scripts/balance-growth.mjs';

test('one affordable first milestone breaks a real wall and clears over one hundred consecutive stages',()=>{
 const s=G.initialState();G.upgrade(s,'orange');const before=frontier(s);s.gold=G.upgradeQuote(s.levels.ink,trainingCount(s.levels.ink),160).cost;
 const beforeStats=G.catStats(s,'ink');assert.equal(G.upgrade(s,'ink',trainingCount(s.levels.ink)),9);assert.equal(s.gold,0);assert.ok(G.catStats(s,'ink').atk>beforeStats.atk*5);
 const after=frontier(s,{start:before});assert.ok(after-before>=100,{before,after});assert.equal(fight(s,after).result,'lose');
});
test('middle-game gear supports more advancement than another ten training levels',()=>{
 const s=equippedTeam(),baseline=frontier(s,{start:1400}),trained=structuredClone(s);for(const id of trained.party)G.upgrade(trained,id,10);
 const gear=equippedTeam(6),trainedWall=frontier(trained,{start:baseline}),gearWall=frontier(gear,{start:baseline});
 assert.ok(gearWall-baseline>=150);assert.ok(gearWall>trainedWall);assert.ok(G.power(gear)>G.power(s)*2);
});
test('card strength changes combat without silently changing displayed power',()=>{
 const s=earlyPair(9);for(const slots of Object.values(s.inventory.equipped))delete slots.rune;const before=G.power(s),a=frontier(s);
 for(const id of s.party){const e=E.addGear(s,1,{slot:'rune',rune:'focus'}).item;E.equipGear(s,e.id,id,s.party);}
 assert.equal(G.power(s),before);assert.ok(frontier(s)>a);
});
test('second warehouse first-clear guarantees an early card and does not repeat the first-clear grant',()=>{
 const s=G.initialState();s.highest=10;s.activities.cleared.salvage=1;const request={kind:'salvage',tier:2};const r=settleActivity(s,activityInfo(s,request));
 assert.equal(r.gearLoot.item.slot,'rune');assert.equal(r.gearLoot.item.rune,'followup');assert.equal(s.activities.cleared.salvage,2);assert.equal(activityInfo(s,request).first,false);
});
test('equipment refresh updates current combat but never re-arms an already-used survival card',()=>{
 const s=G.initialState(),b=new G.Battle(s),h=b.heroes[1];h.hp=Math.floor(h.hp/2);h.runeUsed=true;h.nextRuneSkill=9;const old=h.atk;
 const e=E.addGear(s,450,{slot:'claw',set:'hunt',quality:3}).item;E.equipGear(s,e.id,'ink',s.party);b.syncStats(s,{refreshEquipment:true,preserveHealthRatio:true});
 assert.ok(h.atk>old);assert.equal(h.atk,G.catStats(s,'ink').atk);assert.equal(h.runeUsed,true);assert.equal(h.nextRuneSkill,9);const health=h.hp;b.syncStats(s,{refreshEquipment:true,preserveHealthRatio:true});assert.equal(h.hp,health);
});
test('trial saves are isolated and preserve expanded progress; stable saves are explicitly rejected',()=>{
 assert.notEqual(GROWTH_SAVE_KEY,'can-club-save-v1');const s=G.initialState();s.highest=s.runCleared=2400;s.stage=2401;const text=G.encodeSave(s),envelope=JSON.parse(text);
 assert.equal(envelope.format,GROWTH_SAVE_FORMAT);assert.equal(G.decodeSave(text).stage,2401);assert.throws(()=>G.decodeSave(JSON.stringify({...envelope,format:'CAN-CLUB-1'})));
});
test('training UI aims at the next real milestone and changes focus after level forty',()=>{
 const s=G.initialState();s.onboarded=true;s.guideStep=16;s.levels.ink=9;assert.match(crewProfileHTML(s,'ink'),/跃升至 Lv.10/);assert.match(crewProfileHTML(s,'ink'),/data-upgrade-count="1"/);
 s.levels.ink=40;assert.match(crewProfileHTML(s,'ink'),/装备是当前提升重点/);
});
