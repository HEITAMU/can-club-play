import test from 'node:test';
import assert from 'node:assert/strict';
import {LEVELS,initialState,slide,isWon,solve,neighbour} from '../cocos/assets/scripts/ShadowCore.js';
test('five authored levels are solvable in 1,3,5,6,7 moves',()=>{
 const expected=[1,3,5,6,7];
 LEVELS.forEach((level,i)=>{let state=initialState(level);const answer=solve(level,state);assert.equal(answer.status,'solvable');assert.equal(answer.moves.length,expected[i]);for(const m of answer.moves){const next=slide(level,state,m.star,m.direction);assert.ok(next);assert.equal(new Set(next.state.stars).size,next.state.stars.length);next.state.stars.forEach(p=>assert.equal(Boolean(next.state.shadowMask&(1<<p)),false));state=next.state;}assert.equal(isWon(level,state),true);});
});
test('movement leaves only its origin, not the crossed cells; input state stays intact',()=>{
 const level=LEVELS[0],state=initialState(level),result=slide(level,state,0,'up');assert.deepEqual(result.path,[3,0]);assert.equal(result.state.shadowMask,1<<6);assert.deepEqual(state,{stars:[6],shadowMask:0,moves:0});assert.equal(result.state.stars[0],0);
});
test('second level must use the old shadow to brake at the middle goal',()=>{
 const level=LEVELS[1];let state=initialState(level);for(const direction of ['up','right'])state=slide(level,state,0,direction).state;
 const result=slide(level,state,0,'left');assert.equal(result.to,4);assert.deepEqual(result.stoppedBy,{type:'shadow',index:3});assert.equal(isWon(level,result.state),true);
 const withoutShadow=slide(level,{...state,shadowMask:0},0,'left');assert.equal(withoutShadow.to,3);assert.equal(isWon(level,withoutShadow.state),false);
});
test('blocked moves do not add shadows; edges never wrap; stars block each other',()=>{
 const level={size:3,starts:[6,3],goals:[0,1],walls:[]},state=initialState(level);assert.equal(slide(level,state,0,'up'),null);assert.equal(slide(level,state,0,'left'),null);assert.equal(state.shadowMask,0);assert.equal(neighbour(2,'right',3),-1);assert.equal(neighbour(6,'left',3),-1);assert.equal(slide(level,state,2,'up'),null);
 const r=slide(level,{stars:[6,0],shadowMask:0,moves:0},0,'up');assert.equal(r.to,3);assert.equal(r.stoppedBy.type,'star');
});
test('passing a target does not finish; the correct colored star must stop on each target',()=>{
 const level={size:3,starts:[6],goals:[3],walls:[]};const r=slide(level,initialState(level),0,'up');assert.ok(r.path.includes(3));assert.equal(isWon(level,r.state),false);
 const two={size:3,starts:[0,8],goals:[8,0],walls:[]};assert.equal(isWon(two,initialState(two)),false);
});
test('hints can report a trapped state and distinguish a search limit',()=>{
 const level={size:3,starts:[4],goals:[0],walls:[1,3,5,7]};assert.equal(solve(level).status,'blocked');assert.equal(solve(LEVELS[4],initialState(LEVELS[4]),2).status,'limit');
});
