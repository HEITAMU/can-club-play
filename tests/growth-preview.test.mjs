import test from 'node:test';import assert from 'node:assert/strict';
import * as G from '../core.mjs';import * as E from '../equipment.mjs';
import {trainingPower,GROWTH_SAVE_KEY,GROWTH_SAVE_FORMAT} from '../growth-curve.mjs';
import {activityInfo,settleActivity} from '../activities.mjs';
import {crewProfileHTML} from '../crew-profile.mjs';
import {fight,frontier,earlyPair,equippedTeam} from '../scripts/balance-growth.mjs';

test('first quality ascension moves an actual campaign wall without changing levels',()=>{const s=earlyPair(5);s.highest=s.runCleared=3;s.stage=4;const before=frontier(s),stats=G.catStats(s,'ink');s.roster.shards.ink=10;assert.equal(G.ascendCompanion(s,'ink'),true);assert.equal(s.roster.shards.ink,0);assert.equal(s.levels.ink,5);assert.equal(s.roster.stars.ink,1);assert.ok(G.catStats(s,'ink').atk>stats.atk*2);const after=frontier(s,{start:before});assert.ok(after>before,JSON.stringify({before,after}));});

test('levels stay smooth at former spike boundaries and every star beats one training level',()=>{
 for(let level=1;level<160;level++)assert.ok(trainingPower(level+1)/trainingPower(level)<=1.05);
 for(const level of [9,19,29,39]){const s=earlyPair(level);s.gold=1e9;const before=G.catStats(s,'ink');G.upgrade(s,'ink');assert.ok(G.catStats(s,'ink').atk/before.atk<1.08);}
 for(let rank=0;rank<5;rank++)for(let step=0;step<=5;step++){
  const s=earlyPair(40);s.roster.stars.ink=rank;s.roster.tagSteps.ink=step;s.gold=s.growth.notes=s.roster.shards.ink=1e9;
  const trained=structuredClone(s);G.upgrade(trained,'ink');G.ascendCompanion(s,'ink');assert.ok(G.catStats(s,'ink').atk>G.catStats(trained,'ink').atk);
 }
});
test('middle-game gear supports more advancement than another ten training levels',()=>{
 const s=equippedTeam(),baseline=frontier(s,{start:1400}),trained=structuredClone(s);for(const id of trained.party)G.upgrade(trained,id,10);
 const gear=equippedTeam(6),trainedWall=frontier(trained,{start:baseline}),gearWall=frontier(gear,{start:baseline});
 assert.ok(gearWall-baseline>=100);assert.ok(gearWall>trainedWall);assert.ok(G.power(gear)>G.power(s)*2);
});
test('card strength changes combat without silently changing displayed power',()=>{
 const s=earlyPair(9);for(const slots of Object.values(s.inventory.equipped))delete slots.rune;const before=G.power(s),a=frontier(s);
 for(const id of s.party){const e=E.addGear(s,1,{slot:'rune',rune:'focus'}).item;E.equipGear(s,e.id,id,s.party);}
 assert.equal(G.power(s),before);assert.ok(frontier(s)>a);
});
test('second warehouse first-clear stays in its ordinary slot pool and does not repeat first-clear rewards',()=>{
 const s=G.initialState();s.highest=10;s.activities.cleared.salvage=1;const request={kind:'salvage',tier:2};const r=settleActivity(s,activityInfo(s,request));
 assert.ok(['claw','brace'].includes(r.gearLoot.item.slot));assert.equal(s.activities.cleared.salvage,2);assert.equal(activityInfo(s,request).first,false);
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
test('profile omits next ascension hints while keeping level and quality controls',()=>{const s=G.initialState();s.onboarded=true;s.guideStep=9;s.levels.ink=9;for(const rank of [0,2,9]){s.roster.stars.ink=rank;const html=crewProfileHTML(s,'ink');assert.doesNotMatch(html,/下一次升星|装备是当前提升重点/);assert.match(html,/data-upgrade-count="1"/);}});
