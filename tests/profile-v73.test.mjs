import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,upgradeQuote,upgrade,levelCap,CATS} from '../core.mjs';
import {crewProfileHTML,crewRosterHTML} from '../crew-profile.mjs';
import {pawHTML} from '../growth-visual.mjs';
test('profile defaults to one smooth level and charges its exact cost',()=>{const s=initialState();s.levels.orange=30;s.gold=1e9;const q=upgradeQuote(30,1,levelCap(s,'orange')),before=s.gold;assert.match(crewProfileHTML(s,'orange'),/data-profile-upgrade data-upgrade-count="1"/);assert.equal(upgrade(s,'orange',1),q.levels);assert.equal(s.gold,before-q.cost);assert.equal(s.levels.orange,30+q.levels);});
test('ten-level quote stops at cap without charging unavailable levels',()=>{const s=initialState(),cap=levelCap(s,'orange');s.levels.orange=cap-3;s.gold=1e9;const q=upgradeQuote(cap-3,10,cap),before=s.gold;assert.equal(q.levels,3);assert.equal(upgrade(s,'orange',10),3);assert.equal(s.gold,before-q.cost);assert.equal(s.levels.orange,cap);});
test('all roster portraits have immediate image sources without observer dependency',()=>{const s=initialState();s.roster.owned=CATS.map(c=>c.id);const html=crewRosterHTML(s,'orange');assert.equal((html.match(/<image href=/g)||[]).length,8);assert.doesNotMatch(html,/<image data-asset=/);});
test('cat tags expose five toes without visible label text',()=>{for(let rank=0;rank<=5;rank++){const html=pawHTML(rank,3);assert.equal((html.match(/class="toe /g)||[]).length,5);assert.equal((html.match(/class="toe lit"/g)||[]).length,rank%2?5:0);assert.doesNotMatch(html,/<b>/);}});
