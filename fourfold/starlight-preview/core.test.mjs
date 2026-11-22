import {test} from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,rotateMask,neighbour,masksFor,traceLight,turnTile,hintTile} from '../cocos/assets/scripts/StarlightCore.js';

test('all eight authored boards start unsolved, retain a fixed source and have reachable targets',()=>{
  assert.equal(LEVELS.length,8);
  for(const level of LEVELS){
    assert.equal(level.solved.length,level.size**2);
    assert.equal(level.initialTurns[level.source],0);
    assert.equal(traceLight(level,masksFor(level,level.initialTurns)).won,false,level.name+' starts unsolved');
    const solution=traceLight(level,level.solved);assert(solution.won,level.name+' has a solution');
    level.solved.forEach((mask,index)=>{if(mask)assert(solution.lit.has(index),level.name+' contains no isolated authored routes');});
    assert.equal(turnTile(level,level.initialTurns,level.source),null);
    assert.equal(turnTile(level,level.initialTurns,-1),null);
  }
});
test('the introduction takes exactly one ordinary click and lights the goal',()=>{
  const level=LEVELS[0],hint=hintTile(level,level.initialTurns);
  const initial=[...level.initialTurns],turned=turnTile(level,initial,hint);
  assert.deepEqual(initial,level.initialTurns,'input remains unchanged');
  assert(traceLight(level,masksFor(level,turned)).won);
});
test('hints can recover arbitrary legal player turns without changing level data',()=>{
  for(const level of LEVELS){
    let turns=level.solved.map((mask,index)=>index===level.source?0:(index*7+3)%4),attempts=0;
    while(!traceLight(level,masksFor(level,turns)).won&&attempts<level.size**2*4){
      const index=hintTile(level,turns);assert(index>=0);turns=turnTile(level,turns,index);attempts++;
    }
    assert(traceLight(level,masksFor(level,turns)).won,level.name+' hints terminate');
    assert.equal(hintTile(level,turns),-1);
  }
});
test('light requires reciprocal ports and cannot wrap around a row or edge',()=>{
  const level={size:2,source:1,targets:[2]};
  assert.equal(neighbour(1,1,2),-1);assert.equal(neighbour(2,3,2),-1);
  assert.equal(traceLight(level,[0,2,8,0]).won,false,'row-end ports are not neighbours');
  assert.equal(traceLight({size:2,source:0,targets:[1]},[2,2,0,0]).won,false,'one-way contact cannot conduct');
  assert.equal(traceLight({size:2,source:0,targets:[1]},[2,8,0,0]).won,true,'matching ports conduct');
});
test('alternative valid connections win, including cycles, without a prescribed move count',()=>{
  const level={size:2,source:0,targets:[3]};
  assert.equal(traceLight(level,[6,12,3,9]).won,true,'connected cycle is legal');
  assert.equal(traceLight(level,[2,12,0,1]).won,true,'any route to the target is sufficient');
});
test('four rotations restore every port pattern, including straight-line symmetry',()=>{
  for(let mask=0;mask<16;mask++){assert.equal(rotateMask(mask,4),mask);assert.equal(rotateMask(rotateMask(mask),-1),mask);}
  assert.equal(rotateMask(5,2),5);assert.equal(rotateMask(10,2),10);
});
