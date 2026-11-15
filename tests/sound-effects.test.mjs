import test from 'node:test';import assert from 'node:assert/strict';
import {SKILL_SOUNDS,soundRecipe,skillAudioEvents} from '../sound-effects.mjs';
import {GameAudio} from '../game-audio.mjs';
test('eight characters have distinct skill signatures, including separate shield and punch',()=>{
 assert.equal(Object.keys(SKILL_SOUNDS).length,8);assert.equal(new Set(Object.values(SKILL_SOUNDS).map(JSON.stringify)).size,8);
 assert.notDeepEqual(soundRecipe('skill',{catId:'pudding'}),soundRecipe('skill',{catId:'pudding',shieldPunch:true}));
 assert.deepEqual(soundRecipe('win'),[]);assert.deepEqual(soundRecipe('lose'),[]);assert.equal(soundRecipe('click').length,1);
});
test('skill identity comes from actor IDs, not target or position availability',()=>{
 assert.deepEqual(skillAudioEvents([{type:'skill',from:'p0',shieldPunch:true},{type:'heal',from:'p0'},{type:'skill',from:'e0'}],[{id:'p0',catId:'pudding'}]),[{catId:'pudding',shieldPunch:true}]);
});
test('different actors do not suppress each other, duplicates are limited and wins are silent',()=>{
 const audio=new GameAudio();audio.ctx={currentTime:1,state:'running'};let voices=0;audio.sweep=()=>voices++;audio.noise=()=>voices++;
 audio.play('skill',{catId:'orange'});const first=voices;audio.play('skill',{catId:'orange'});assert.equal(voices,first);audio.play('skill',{catId:'ink'});assert.ok(voices>first);const total=voices;audio.play('win');assert.equal(voices,total);audio.effects=false;audio.play('skill',{catId:'star'});assert.equal(voices,total);
});
