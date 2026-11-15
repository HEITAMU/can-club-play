import test from 'node:test';import assert from 'node:assert/strict';
import {initialState,idleRate,Battle,settleBattle} from '../core.mjs';import {streetHTML} from '../street-ui.mjs';import {nextGrowth,growthGuideHTML} from '../growth-guide.mjs';import {stallHTML} from '../district.mjs';
test('next objective leads from main stages to equipment source and then wearing',()=>{const s=initialState();assert.equal(nextGrowth(s).action,'battle');s.highest=3;assert.equal(nextGrowth(s).action,'salvage');s.activities.cleared.salvage=1;assert.equal(nextGrowth(s).action,'battle');delete s.inventory.equipped.orange.claw;assert.equal(nextGrowth(s).action,'equipment');assert.match(growthGuideHTML(s),/伙伴 → 装备/);});
test('warehouse objective follows entry, defeat, retry and the actual equipment reward',()=>{
 const s=initialState();s.highest=3;s.runCleared=3;s.stage=4;
 const request={activity:{kind:'salvage',tier:1}},first=new Battle(s,request);
 assert.equal(nextGrowth(s,first).title,'正在挑战废件仓库');assert.equal(nextGrowth(s,first).action,'battle');
 assert.match(growthGuideHTML(s,first),/正在挑战废件仓库/);assert.doesNotMatch(growthGuideHTML(s,first),/前往废件仓库/);
 assert.equal(s.activities.cleared.salvage||0,0,'entering must not award completion');
 first.result='lose';settleBattle(s,first);assert.equal(nextGrowth(s,first).action,'salvage');
 assert.equal(nextGrowth(s,new Battle(s)).action,'salvage','returning to mainline restores the destination');
 assert.equal(nextGrowth(s,new Battle(s,{activity:{kind:'sweep',tier:1}})).title,'正在挑战后巷清扫');
 const retry=new Battle(s,request);assert.equal(nextGrowth(s,retry).title,'正在挑战废件仓库');
 retry.result='win';const reward=settleBattle(s,retry);assert.ok(reward.gearLoot.item);assert.equal(s.activities.cleared.salvage,1);
 assert.equal(nextGrowth(s,retry).action,'equipment');assert.equal(nextGrowth(s,retry).title,'给伙伴穿上新装备');
 assert.equal(nextGrowth(s,new Battle(s,request)).title,'正在挑战废件仓库','repeated challenges also show the current activity');
});
test('commission list has no embedded detail and chosen detail has no list',()=>{const s=initialState();const list=streetHTML(s,{group:'hard',id:'coldstore',tier:1,detail:false});assert.match(list,/data-street-choice="coldstore"/);assert.doesNotMatch(list,/street-detail|street-fight/);const detail=streetHTML(s,{group:'hard',id:'ironwall',tier:1,detail:true});assert.match(detail,/铁壳拦路/);assert.match(detail,/street-fight/);assert.doesNotMatch(detail,/data-street-choice=/);});
test('both income upgrades display their real resulting fish coin rate',()=>{const s=initialState();s.highest=17;const html=stallHTML(s);for(const id of ['stall','sign']){const after={...s,stall:{...s.stall,[id]:1}};assert.ok(html.includes(idleRate(s)+' → '+idleRate(after)+' 鱼币 / 分钟'));}assert.match(html,/挂机鱼币额外加成/);});
import fs from 'node:fs';import vm from 'node:vm';
import {GUIDE_DONE,nextGuide} from '../onboarding.mjs';import {encodeSave,decodeSave} from '../core.mjs';import {gearOwner} from '../equipment.mjs';
test('equipment milestone starts exactly at stage three, once, and saved progress resumes',()=>{const src=fs.readFileSync(new URL('../app.mjs',import.meta.url),'utf8'),start=src.indexOf('function maybeGearGuide('),end=src.indexOf('function restoreGearGuide(',start);const s=initialState();s.onboarded=true;s.guideStep=GUIDE_DONE;let restored=0;const c={state:s,GUIDE_DONE,gearOwner,restoreGearGuide:()=>restored++};vm.createContext(c);vm.runInContext(src.slice(start,end),c);s.highest=2;assert.equal(c.maybeGearGuide(),false);s.highest=3;assert.equal(c.maybeGearGuide(),true);assert.equal(s.guideStep,14);assert.equal(restored,1);assert.equal(c.maybeGearGuide(),false);const saved=decodeSave(encodeSave(s));assert.equal(saved.guideStep,14);assert.equal(saved.gearGuide,1);for(const [step,event,next]of [[14,'continue',15],[15,'map',16],[16,'board',17],[17,'equipment-source',18],[18,'salvage',19],[19,'depart',9],[20,'continue',21],[21,'gear',22],[22,'equipped',23],[23,'continue',9]]){assert.equal(nextGuide(step,event),next);assert.equal(nextGuide(step,'win'),step);}s.guideStep=9;s.gearGuide=2;assert.equal(c.maybeGearGuide(true),false);delete s.inventory.equipped.orange.claw;assert.equal(c.maybeGearGuide(true),true);assert.equal(s.guideStep,20);s.guideStep=9;s.gearGuide=4;assert.equal(c.maybeGearGuide(),false);});
import {streetChoices,streetRequest,streetGroupFor} from '../street-ui.mjs';import {activityReward,activityInfo,settleActivity} from '../activities.mjs';import {generateGear} from '../equipment.mjs';
test('material categories route to exclusive drops and warehouse belongs to equipment',()=>{for(const [group,kind,key]of [['notes','sweep','notes'],['badges','escort','badges'],['scrap','parts','scrap'],['essence','polish','essence']]){assert.deepEqual(streetChoices(group).map(x=>x.id),[kind]);assert.equal(streetRequest(group,kind).kind,kind);assert.equal(streetGroupFor(kind),group);const drops=activityReward({kind,tier:1,first:true});assert.ok(drops[key]>0);for(const k of ['notes','badges','scrap','essence'].filter(k=>k!==key))assert.equal(drops[k],0);}assert.equal(streetGroupFor('salvage'),'equipment');assert.equal(streetRequest('equipment','depot').kind,'hunt');assert.equal(streetRequest('equipment','salvage').kind,'salvage');const s=initialState();s.highest=3;const r=settleActivity(s,activityInfo(s,{kind:'salvage',tier:1}));assert.ok(r.gearLoot.item);assert.ok(r.gearLoot.item.quality<=1);assert.equal(r.scrap,0);assert.equal(r.essence,0);for(let i=1;i<=300;i++)assert.ok(generateGear(i,75,{maxQuality:1}).quality<=1);});
import {simulate} from '../scripts/balance-street.mjs';import * as Equipment from '../equipment.mjs';
test('first equipment lesson is winnable with tutorial-only training even without rescue, and rewards an upgrade',()=>{const s=initialState();s.highest=3;s.levels.orange=2;for(const seed of [527,941,2027,4093,8191]){const r=simulate(s,{kind:'salvage',tier:1},{seed,can:'never'});assert.equal(r.result,'win');assert.ok(r.time<100);}const r=settleActivity(s,activityInfo(s,{kind:'salvage',tier:1}));assert.equal(r.gearLoot.item.slot,'claw');assert.equal(r.gearLoot.item.quality,1);const old=s.inventory.items.find(e=>e.id===s.inventory.equipped.orange.claw);assert.ok(Equipment.gearValues(r.gearLoot.item).atk>Equipment.gearValues(old).atk);assert.equal(Equipment.craftGear,undefined);assert.equal(Equipment.craftQuote,undefined);assert.ok(Equipment.materialRows(s).every(x=>!x.use.includes('拼装')));});

test('equipping once completes the objective even with replaced items and later drops in the bag',()=>{
 const s=initialState();s.highest=s.runCleared=3;s.stage=4;const b=new Battle(s,{activity:{kind:'salvage',tier:1}});b.result='win';const r=settleBattle(s,b),uid=r.gearLoot.item.id;
 assert.equal(nextGrowth(s,b).action,'equipment');const old=s.inventory.equipped.orange.claw;
 Equipment.equipGear(s,uid,'orange',s.roster.owned);assert.equal(gearOwner(s,old),null);assert.equal(nextGrowth(s,b).action,'battle');
 Equipment.addGear(s,75,{slot:'coat',quality:1});assert.equal(nextGrowth(s,b).action,'battle');
 const saved=decodeSave(encodeSave(s));assert.equal(saved.guidance.equipmentWorn,true);assert.equal(nextGrowth(saved).action,'battle');
 Equipment.unequipGear(saved,'orange','claw');assert.equal(nextGrowth(saved).action,'battle','a finished tutorial is not restarted by inventory changes');
});
test('old saves recognize an already worn first reward and do not revive the equipment objective',()=>{
 const s=initialState();s.highest=3;s.activities.cleared.salvage=1;const e=Equipment.addGear(s,3,{slot:'claw',set:'guard',quality:1}).item;Equipment.equipGear(s,e.id,'ink',s.roster.owned);delete s.guidance;delete s.gearGuideItem;
 const saved=decodeSave(encodeSave(s));assert.equal(saved.guidance.equipmentWorn,true);assert.equal(nextGrowth(saved).action,'battle');
});
test('every active special mode names the current challenge and finished or abandoned activities stop doing so',()=>{
 const s=initialState();s.highest=60;s.activities.cleared.salvage=1;s.guidance.equipmentWorn=true;
 for(const request of [{kind:'salvage',tier:1},{kind:'sweep',tier:1},{kind:'recruit',id:'ink',tier:1},{kind:'hunt',id:'market',tier:1}]){
  const b=new Battle(s,{activity:request});assert.equal(nextGrowth(s,b).title,'正在挑战'+b.activity.name);assert.equal(nextGrowth(s,b).action,'battle');
  b.result='lose';assert.doesNotMatch(nextGrowth(s,b).title,/正在挑战/);assert.doesNotMatch(nextGrowth(s,new Battle(s)).title,/正在挑战/);
 }
 const arena=new Battle(s,{arenaTier:1});assert.equal(nextGrowth(s,arena).title,'正在挑战街头擂台');
 const weekly=new Battle(s,{weeklyTier:1});assert.equal(nextGrowth(s,weekly).title,'正在挑战'+weekly.weekly.name);
});
test('star suggestions disappear when materials are spent, cap is reached, or the battle takes priority',()=>{
 const s=initialState();s.highest=3;s.activities.cleared.salvage=1;s.guidance.equipmentWorn=true;s.roster.shards.ink=4;s.growth.notes=6;
 assert.equal(nextGrowth(s).action,'cat-tag');assert.equal(nextGrowth(s).id,'ink');assert.match(growthGuideHTML(s),/data-growth-cat="ink"/);
 assert.equal(GrowthAscend(s,'ink'),true);assert.equal(nextGrowth(s).action,'battle');
 s.roster.stars.ink=5;s.roster.shards.ink=1000;s.growth.notes=1000;assert.equal(nextGrowth(s).action,'battle');
 const lost=new Battle(s);lost.result='lose';assert.equal(nextGrowth(s,lost).id,'orange');
 s.roster.stars.orange=5;assert.equal(nextGrowth(s,lost).action,'equipment');
});
import {ascendCompanion as GrowthAscend} from '../core.mjs';
test('completed legacy equipment teaching and learned actions do not start another equipment lesson',()=>{
 const s=initialState();s.onboarded=true;s.guideStep=GUIDE_DONE;s.highest=3;s.gearGuide=4;s.activities.cleared.salvage=1;delete s.guidance;
 const saved=decodeSave(encodeSave(s));assert.equal(saved.guidance.equipmentWorn,true);
 saved.gearGuide=2;Equipment.addGear(saved,3,{slot:'claw',set:'guard',quality:1});
 const src=fs.readFileSync(new URL('../app.mjs',import.meta.url),'utf8'),start=src.indexOf('function maybeGearGuide('),end=src.indexOf('function restoreGearGuide(',start);let restored=0;const c={state:saved,GUIDE_DONE,gearOwner,restoreGearGuide:()=>restored++};vm.createContext(c);vm.runInContext(src.slice(start,end),c);
 assert.equal(c.maybeGearGuide(true),false);assert.equal(saved.gearGuide,4);assert.equal(restored,0);
});
test('a completed mainline points to playable endgame challenges instead of asking to advance again',()=>{
 const s=initialState();s.highest=s.runCleared=3500;s.stage=3500;s.activities.cleared.salvage=1;s.guidance.equipmentWorn=true;
 assert.equal(nextGrowth(s).action,'hard');assert.match(nextGrowth(s).title,/主线已通关/);
});
