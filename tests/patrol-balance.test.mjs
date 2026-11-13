import test from 'node:test';import assert from 'node:assert/strict';
import {PATROL_CASES,patrolCase} from '../scripts/balance-patrol.mjs';
test('main campaign can be cleared by higher training or a lower-level complementary team',()=>{
 for(const seed of [527,941,2027,4093,8191]){
  const [low,high,synergy]=PATROL_CASES.map(c=>patrolCase(c,seed));
  assert.equal(low.result,'lose');assert.equal(high.result,'win');assert.equal(synergy.result,'win');
  assert.ok(synergy.power<high.power);assert.ok(synergy.time<75);
 }
});
