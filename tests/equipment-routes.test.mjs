import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {initialState,Battle,settleBattle,encodeSave,decodeSave} from '../core.mjs';
import {activityInfo,settleActivity} from '../activities.mjs';
import {streetChoices,streetSelection,streetHTML} from '../street-ui.mjs';
import {ROTATING_SLOTS,rotationSlots,routeGearOptions} from '../equipment-routes.mjs';
import {battleReport,normalizeReport} from '../battle-flow.mjs';
import {gearDrop} from '../equipment.mjs';
const now=Date.parse('2026-11-16T12:00:00+08:00');
const ready=()=>{const s=initialState(now);s.highest=600;return s;};
test('equipment has exactly three connected routes and four-day Beijing rotation',()=>{
 assert.deepEqual(streetChoices('equipment').map(x=>x.id),['salvage','wardrobe','nightwatch']);
 for(let n=0;n<4;n++){const q=activityInfo(ready(),{kind:'nightwatch'},now+n*86400000);assert.deepEqual(q.dropSlots,ROTATING_SLOTS[n]);assert.deepEqual(rotationSlots(q.rotationDay+4),q.dropSlots);}
 const before=activityInfo(ready(),{kind:'nightwatch'},Date.parse('2026-11-16T23:59:59+08:00')),after=activityInfo(ready(),{kind:'nightwatch'},Date.parse('2026-11-17T00:00:00+08:00'));
 assert.deepEqual(before.dropSlots,['claw','brace']);assert.deepEqual(after.dropSlots,['brace','coat']);
 const html=streetHTML(ready(),{group:'equipment',id:'salvage',tier:1,detail:false});assert.equal((html.match(/data-street-choice=/g)||[]).length,3);assert.match(html,/旧街寻宝/);assert.match(html,/aria-label="爪套"/);assert.doesNotMatch(html,/data-street-choice="market"/);
});
test('fixed routes never drop other slots, including obsolete guaranteed second-difficulty rune',()=>{
 for(const kind of ['salvage','wardrobe'])for(const roll of [0,.5,.999]){
  const s=ready();s.activities.cleared[kind]=1;const q=activityInfo(s,{kind,tier:2},now),r=settleActivity(s,q,now,()=>roll);
  assert.ok(q.dropSlots.includes(r.gearLoot.item.slot));assert.notEqual(r.gearLoot.item.slot,'rune');
 }
});
test('search has a 3% rune threshold and normal rotation 0.1%, without changing the allowed pair',()=>{
 const s=ready(),off=activityInfo(s,{kind:'nightwatch'},now),on=activityInfo(s,{kind:'nightwatch',runeSearch:true},now);
 let normal=0,search=0;for(let n=0;n<10000;n++){const draw=()=>n/10000;normal+=routeGearOptions(off,draw).slot==='rune';search+=routeGearOptions(on,draw).slot==='rune';}
 assert.equal(normal,10);assert.equal(search,300);
 assert.equal(routeGearOptions(off,()=>.02).slot,'claw');assert.equal(routeGearOptions(on,()=>.02).slot,'rune');
 assert.equal(activityInfo(s,{kind:'salvage',runeSearch:true},now).runeSearch,false);
 const q=streetSelection(s,{group:'equipment',id:'nightwatch',tier:1,runeSearch:true});assert.equal(q.request.runeSearch,true);
 const html=streetHTML(s,{group:'equipment',id:'nightwatch',tier:1,detail:true,runeSearch:true});assert.match(html,/id="rune-search-toggle" aria-pressed="true"/);assert.match(html,/生命 ×3、攻击 ×2/);assert.match(html,/3%/);
});
test('search actually strengthens enemies and adds rear attacks; losses do not consume rewards',()=>{
 const s=ready(),off=new Battle(s,{activity:{kind:'nightwatch',tier:1}}),on=new Battle(s,{activity:{kind:'nightwatch',tier:1,runeSearch:true}});
 assert.equal(on.enemies[0].maxHp,off.enemies[0].maxHp*3);assert.equal(on.enemies[0].atk,off.enemies[0].atk*2);assert.ok(on.enemies[0].ambusher);assert.ok(!off.enemies[0].ambusher);
 const old=JSON.stringify(s.activities);on.result='lose';settleBattle(s,on,now);assert.equal(JSON.stringify(s.activities),old);
 const report=normalizeReport(battleReport(on,{win:false}));assert.equal(report.route.runeSearch,true);assert.equal(decodeSave(encodeSave({...s,battleReport:report}),now).battleReport.route.runeSearch,true);
});
test('entered daily pair stays fixed over midnight while daily quota uses the new day',()=>{
 const s=ready(),entry=Date.parse('2026-11-16T23:59:59+08:00'),end=entry+5000,q=activityInfo(s,{kind:'nightwatch'},entry);
 const r=settleActivity(s,q,end,()=>.1);assert.equal(r.gearLoot.item.slot,'claw');
 s.activities.repeatClaims.nightwatch=4;s.activities.rewardDay=q.rotationDay;
 const q2=activityInfo(s,{kind:'nightwatch'},end);assert.equal(q2.quota.remaining,4);
 for(let i=0;i<4;i++)settleActivity(s,activityInfo(s,{kind:'nightwatch'},end),end,()=>.1);
 const serial=s.inventory.serial,blocked=settleActivity(s,activityInfo(s,{kind:'nightwatch',runeSearch:true},end),end,()=>0);
 assert.equal(blocked.rewardCapped,true);assert.equal(s.inventory.serial,serial);
});
test('other random gear rewards cannot bypass the rare-rune ecology with a uniform five-slot roll',()=>{
 assert.equal(gearDrop(ready(),5,{random:()=>0}).item.slot,'rune');
 assert.notEqual(gearDrop(ready(),5,{random:()=>.02}).item.slot,'rune');
});
test('unlock message survives reduced-motion animation end and each tap renews full reading time',()=>{
 const timers=new Map(),nodes=[],listeners=[];let clock=0,serial=0;
 const ctx={document:{createElement:()=>({setAttribute(){},addEventListener:(name,fn)=>listeners.push([name,fn]),remove(){this.removed=true;}}),body:{append:n=>nodes.push(n)}},setTimeout:(fn,ms)=>{timers.set(++serial,{fn,at:clock+ms});return serial;},clearTimeout:id=>timers.delete(id)};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync(new URL('../unlock-feedback.mjs',import.meta.url),'utf8').replaceAll('export ',''),ctx);
 const tick=ms=>{clock+=ms;for(const [id,t]of timers)if(t.at<=clock){timers.delete(id);t.fn();}};
 ctx.showUnlockFeedback(null,'通关第 30 关后解锁');assert.equal(listeners.length,0);tick(3900);assert.ok(!nodes[0].removed);
 ctx.showUnlockFeedback(null,'通关第 30 关后解锁');assert.ok(nodes[0].removed);tick(3999);assert.ok(!nodes[1].removed);tick(1);assert.ok(nodes[1].removed);
 const css=fs.readFileSync(new URL('../commission-art.css',import.meta.url),'utf8');assert.match(css,/\.unlock-message\{[^}]*opacity:1;animation:none/);
});
