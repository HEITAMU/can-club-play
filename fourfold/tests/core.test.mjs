import { test } from 'node:test';
import assert from 'node:assert/strict';
import {GOAL,ACTIONS,rotate,applyPath,shortestPath,makePuzzle,resultScore,parseChallenge} from '../cocos/assets/scripts/Core.js';
test('all rotations invert',()=>{for(const {q,dir} of ACTIONS)assert.equal(rotate(rotate(GOAL,q,dir),q,-dir),GOAL);});
test('solver solves thousands of legal boards',()=>{for(let i=1;i<=30;i++){for(const mode of ['story','daily']){const p=makePuzzle(mode,mode==='story'?String(i):'2026-11-'+String(i).padStart(2,'0'));const sol=shortestPath(p.board);assert.equal(applyPath(p.board,sol),GOAL);assert.equal(sol.length,p.par);}}});
test('generate stable unique games and rank',()=>{assert.deepEqual(makePuzzle('daily','2026-11-20'),makePuzzle('daily','2026-11-20'));assert.notEqual(makePuzzle('daily','2026-11-20').board,makePuzzle('daily','2026-11-21').board);assert.ok(resultScore(8,50)>resultScore(9,1));assert.equal(resultScore(8,50,1),0);});
test('safe share params',()=>{const s=parseChallenge(new URLSearchParams('mode=daily&day=2026-11-20&beat=8'));assert.equal(s.key,'2026-11-20');assert.equal(s.beat,8);assert.equal(parseChallenge(new URLSearchParams('mode=daily&day=../../private')).key.length,10);});
