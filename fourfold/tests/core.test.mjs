import { test } from 'node:test';
import assert from 'node:assert/strict';
import {GOAL,ACTIONS,rotate,applyPath,shortestPath,makePuzzle,resultScore,parseChallenge} from '../cocos/assets/scripts/Core.js';

const storyExpectedDepths = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,10];
const dailyDate = offset => new Date(Date.UTC(2026,10,21) + offset * 86400000).toISOString().slice(0,10);

test('all rotations invert',()=>{for(const {q,dir} of ACTIONS)assert.equal(rotate(rotate(GOAL,q,dir),q,-dir),GOAL);});
test('solver solves all 18 story levels at their expected depths and 30 daily boards',()=>{
  for(let level=1;level<=18;level++){
    const p=makePuzzle('story',String(level)),sol=shortestPath(p.board);
    assert.equal(applyPath(p.board,sol),GOAL);
    assert.equal(sol.length,p.par);
    assert.equal(p.par,storyExpectedDepths[level-1]);
  }
  for(let offset=0;offset<30;offset++){
    const p=makePuzzle('daily',dailyDate(offset)),sol=shortestPath(p.board);
    assert.equal(applyPath(p.board,sol),GOAL);
    assert.equal(sol.length,p.par);
  }
});
test('generate stable unique games and rank',()=>{
  assert.deepEqual(makePuzzle('daily',dailyDate(0)),makePuzzle('daily',dailyDate(0)));
  assert.notEqual(makePuzzle('daily',dailyDate(0)).board,makePuzzle('daily',dailyDate(1)).board);
  assert.ok(resultScore(8,50)>resultScore(9,1));
  assert.equal(resultScore(8,50,1),0);
});
test('safe share params',()=>{
  const s=parseChallenge(new URLSearchParams('mode=daily&day=2026-11-21&beat=8'));
  assert.equal(s.key,'2026-11-21');assert.equal(s.beat,8);
  assert.equal(parseChallenge(new URLSearchParams('mode=daily&day=../../private')).key.length,10);
});
