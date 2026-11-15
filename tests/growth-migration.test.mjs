import test from 'node:test';import assert from 'node:assert/strict';
import * as G from '../core.mjs';import {GROWTH_REVISION} from '../growth-curve.mjs';
import {catTagCardHTML} from '../cat-tag-ui.mjs';
test('old preview investment becomes star materials and excess coin refund without changing earned rank or levels',()=>{
 const old=G.initialState(1000);delete old.growthRevision;old.levels.ink=10;old.levels.orange=40;old.highest=old.runCleared=1200;old.stage=1201;const raw=structuredClone(old);
 const s=G.decodeSave(G.encodeSave(old),1000);assert.equal(s.growthRevision,GROWTH_REVISION);assert.equal(s.growthRebalancePending,true);
 assert.deepEqual(s.levels,raw.levels);assert.deepEqual(s.roster.stars,raw.roster.stars);assert.deepEqual(s.roster.tagSteps,raw.roster.tagSteps);assert.equal(s.stage,1201);
 assert.equal(s.roster.shards.ink,12);assert.equal(s.roster.shards.orange,60);assert.equal(s.growth.notes,108);assert.ok(s.gold>old.gold);
 const same=G.decodeSave(G.encodeSave(s),1000);assert.equal(same.gold,s.gold);assert.deepEqual(same.roster,s.roster);assert.deepEqual(same.growth,s.growth);
 assert.deepEqual(old,raw,'reading a legacy save must not modify the input');
});
test('new saves and untrained old previews receive no compensation; restored ranks are retained',()=>{
 const s=G.initialState(1000);assert.equal(G.decodeSave(G.encodeSave(s),1000).growthRebalancePending,false);
 delete s.growthRevision;const old=G.decodeSave(G.encodeSave(s),1000);assert.equal(old.gold,s.gold);assert.deepEqual(old.roster,s.roster);assert.deepEqual(old.growth,s.growth);
 s.roster.stars.orange=3;s.roster.tagSteps.orange=2;s.levels.orange=40;const ranked=G.decodeSave(G.encodeSave(s),1000);assert.equal(ranked.roster.stars.orange,3);assert.equal(ranked.roster.tagSteps.orange,2);assert.equal(ranked.roster.shards.orange,0);
});
test('star card previews the exact next attack and health including free material promotion',()=>{
 const s=G.initialState();s.roster.shards.ink=1000;s.growth.notes=1000;
 for(let i=0;i<30;i++){const html=catTagCardHTML(s,'ink'),before=G.catStats(s,'ink'),q=G.starQuote(s,'ink');assert.equal(G.ascendCompanion(s,'ink'),true);const after=G.catStats(s,'ink');
  assert.ok(html.includes('攻击 '+before.atk.toLocaleString('zh-CN')+' → <b>'+after.atk.toLocaleString('zh-CN')+'</b>'));
  assert.ok(html.includes('生命 '+before.hp.toLocaleString('zh-CN')+' → <b>'+after.hp.toLocaleString('zh-CN')+'</b>'));assert.ok(q.gain>0);assert.ok(after.hp>before.hp);
 }
 assert.match(catTagCardHTML(s,'ink'),/已满阶/);assert.doesNotMatch(catTagCardHTML(s,'ink'),/本次生命、攻击提升/);
});
