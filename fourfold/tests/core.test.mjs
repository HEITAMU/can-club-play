import { test } from 'node:test';
import assert from 'node:assert/strict';
import {GOAL,ACTIONS,rotate,applyPath,shortestPath,makePuzzle,resultScore,parseChallenge} from '../cocos/assets/scripts/Core.js';
import * as nativeCore from '../cocos/assets/scripts/Core.js';
import * as webCore from '../cocos/assets/scripts/CoreHardWeb.js';

const storyExpectedDepths = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,10];
const dailyDate = offset => new Date(Date.UTC(2026,10,21) + offset * 86400000).toISOString().slice(0,10);

test('all rotations invert',()=>{for(const {q,dir} of ACTIONS)assert.equal(rotate(rotate(GOAL,q,dir),q,-dir),GOAL);});
test('solver solves all 18 story levels at their expected depths and 30 daily boards',()=>{
  for(let level=1;level<=18;level++){
    const p=makePuzzle('story',String(level)),sol=shortestPath(p.board);
    assert.deepEqual(webCore.makePuzzle('story',String(level)),p);
    assert.equal(applyPath(p.board,sol),GOAL);
    assert.equal(sol.length,p.par);
    assert.equal(p.par,storyExpectedDepths[level-1]);
  }
  for(let offset=0;offset<30;offset++){
    const p=makePuzzle('daily',dailyDate(offset)),sol=shortestPath(p.board);
    assert.deepEqual(webCore.makePuzzle('daily',dailyDate(offset)),p);
    assert.equal(applyPath(p.board,sol),GOAL);
    assert.equal(sol.length,p.par);
  }
});
test('generate stable unique games and rank',()=>{
  assert.deepEqual(makePuzzle('daily',dailyDate(0)),makePuzzle('daily',dailyDate(0)));
  assert.notEqual(makePuzzle('daily',dailyDate(0)).board,makePuzzle('daily',dailyDate(1)).board);
  assert.ok(resultScore(8,50)>resultScore(9,1));
  assert.ok(resultScore(8,49)>resultScore(8,50));
});
test('both engines share per-round hint limits: story 5, daily 2',()=>{
  for(const core of [nativeCore,webCore]){
    assert.equal(core.hintLimit('story'),5);
    assert.equal(core.hintLimit('daily'),2);
  }
});
test('using hints leaves score and every honor tier unchanged',()=>{
  const tiers=[[8,'最优解 · 解谜宗师'],[10,'极致推演'],[13,'逻辑高手'],[14,'破局者']];
  for(const core of [nativeCore,webCore]){
    for(const [moves,title] of tiers){
      const unassistedScore=core.resultScore(moves,50,0);
      assert.ok(unassistedScore>0);
      for(const hints of [0,1,2,5]){
        assert.equal(core.resultScore(moves,50,hints),unassistedScore);
        assert.equal(core.honor(moves,8,hints),title);
      }
    }
    assert.ok(core.resultScore(8,50,5)>core.resultScore(9,1,0));
    assert.ok(core.resultScore(8,49,2)>core.resultScore(8,50,0));
  }
});
test('best results rank by moves then seconds, regardless of hints in either record',()=>{
  for(const core of [nativeCore,webCore]){
    assert.equal(core.isBetterResult({moves:8,seconds:50,hints:5},null),true);
    for(const previousHints of [0,2,5])for(const candidateHints of [0,2,5]){
      const previous={moves:8,seconds:50,hints:previousHints};
      const better=(moves,seconds)=>core.isBetterResult({moves,seconds,hints:candidateHints},previous);
      assert.equal(better(7,100),true,'fewer moves wins even when slower');
      assert.equal(better(9,1),false,'more moves loses even when faster');
      assert.equal(better(8,49),true,'faster wins at equal moves');
      assert.equal(better(8,51),false,'slower loses at equal moves');
      assert.equal(better(8,50),false,'a hint-count difference cannot break a tie');
    }
  }
});
test('safe share params',()=>{
  const s=parseChallenge(new URLSearchParams('mode=daily&day=2026-11-21&beat=8'));
  assert.equal(s.key,'2026-11-21');assert.equal(s.beat,8);
  assert.equal(parseChallenge(new URLSearchParams('mode=daily&day=../../private')).key.length,10);
});
