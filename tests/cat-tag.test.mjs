import {badgeHTML,pawHTML} from '../growth-visual.mjs';
import test from 'node:test';import assert from 'node:assert/strict';
import * as G from '../core.mjs';import {catTagCardHTML} from '../cat-tag-ui.mjs';import {inventoryHTML} from '../inventory-ui.mjs';
test('nine quality ascensions charge exact personal and shared resources and cap safely',()=>{const s=G.initialState();s.roster.shards.orange=250;s.growth.notes=355;for(let rank=0;rank<9;rank++){const q=G.starQuote(s,'orange');assert.equal(q.rank,rank);const before=[s.roster.shards.orange,s.growth.notes,G.catStats(s,'orange').atk];assert.equal(G.ascendCompanion(s,'orange'),true);assert.equal(s.roster.shards.orange,before[0]-q.shards);assert.equal(s.growth.notes,before[1]-q.notes);assert.ok(G.catStats(s,'orange').atk>before[2]);assert.equal(s.roster.stars.orange,rank+1);}assert.equal(s.roster.shards.orange,0);assert.equal(s.growth.notes,0);const saved=G.encodeSave(s);assert.equal(G.ascendCompanion(s,'orange'),false);assert.equal(G.encodeSave(s),saved);});

test('quality ranks survive save roundtrip and each click advances one quality',()=>{const s=G.initialState();s.roster.stars.orange=3;s.roster.shards.orange=100;s.growth.notes=100;assert.ok(G.ascendCompanion(s,'orange'));const restored=G.decodeSave(G.encodeSave(s));assert.equal(restored.roster.stars.orange,4);assert.equal(restored.roster.tagSteps.orange,0);assert.deepEqual(restored.roster,s.roster);});

test('quality card previews next quality and stops at supreme plus',()=>{const s=G.initialState();assert.match(catTagCardHTML(s,'orange'),/精英\+/);s.roster.stars.orange=9;assert.match(catTagCardHTML(s,'orange'),/已满阶/);assert.doesNotMatch(catTagCardHTML(s,'orange'),/下一品质/);});

test('empty materials and equipment set dropdown are absent',()=>{const s=G.initialState();s.inventory.materials.scrap=0;s.inventory.materials.essence=2;const h=inventoryHTML(s,{tab:'materials'});assert.doesNotMatch(h,/data-material-info="scrap"/);assert.match(h,/data-material-info="essence"/);assert.doesNotMatch(inventoryHTML(s,{tab:'equipment'}),/bag-set|全部套装/);});


test('quality badges keep approved artwork and plus tiers light their paw',()=>{for(let rank=0;rank<10;rank++){const h=badgeHTML(rank);assert.match(h,/cat-tag-wide-v02679.webp/);assert.equal(h.includes('pendant-awake'),rank%2===1);const paw=pawHTML(rank);assert.equal((paw.match(/class="toe lit"/g)||[]).length,rank%2?5:0);}});
