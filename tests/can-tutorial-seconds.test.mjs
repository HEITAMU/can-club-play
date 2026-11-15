import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {Battle,initialState,encodeSave,decodeSave} from '../core.mjs';
import {GUIDE,GUIDE_CAN,GUIDE_DONE,nextGuide,normalizeGuide,guideNumber} from '../onboarding.mjs';
import {rescueView} from '../battle-ui.mjs';
test('can lesson preserves old completed saves and resumes all new steps',()=>{
 assert.equal(normalizeGuide(9,true),GUIDE_DONE);assert.equal(normalizeGuide(10,true),2);
 for(const step of [11,12,13]){const s=initialState();s.onboarded=true;s.guideStep=step;assert.equal(decodeSave(encodeSave(s)).guideStep,step);assert.equal(nextGuide(step,'win'),step);}
 assert.equal(nextGuide(8,'continue'),11);assert.equal(nextGuide(11,'continue'),GUIDE_CAN);assert.equal(nextGuide(GUIDE_CAN,'continue'),GUIDE_CAN);assert.equal(nextGuide(GUIDE_CAN,'can'),13);assert.equal(nextGuide(13,'continue'),GUIDE_DONE);assert.equal(guideNumber(13),11);assert.equal(GUIDE[GUIDE_CAN].target,'#open-can');
});
test('5.6-second cooldown is independent of turns, exact at both common frame rates, and freezes on zero time',()=>{
 for(const hz of [30,60]){const b=new Battle(initialState());assert.equal(b.openCan(),true);assert.equal(b.canCd,5.6);b.turnGapUntil=100;for(const a of [...b.heroes,...b.enemies]){a.hp=a.maxHp=100000;a.wait=100;}
 for(let i=0;i<hz*4.6;i++)b.tick(1/hz);assert.ok(Math.abs(b.canCd-1)<1e-6);const before=b.canCd;b.tick(0);assert.equal(b.canCd,before);assert.equal(b.openCan(),false);
 for(let i=0;i<hz;i++)b.tick(1/hz);assert.equal(b.canCd,0);assert.equal(b.openCan(),true);assert.equal(b.canCd,5.6);assert.equal(b.round,0);}
});
test('tutorial use animates healing and damage with no scheduled actor turn or automatic lesson advance',()=>{
 const b=new Battle(initialState());for(const h of b.heroes)h.hp=Math.round(h.maxHp*.5);const hp=b.heroes.map(h=>h.hp),enemy=b.enemies[0].hp;assert.equal(b.openCan(),true);
 for(let i=0;i<180;i++)b.tickCanDemo(1/60);b.heroes.forEach((h,i)=>assert.equal(h.hp,hp[i]+40));assert.ok(b.enemies[0].hp<enemy);assert.equal(b.round,0);assert.equal(b.turnActor,null);assert.equal(b.result,null);assert.equal(nextGuide(13,'win'),13);
});
test('paused tutorial can button performs actual use and immediately renders the cooldown lesson',()=>{
 const src=fs.readFileSync(new URL('../app.mjs',import.meta.url),'utf8'),start=src.indexOf('function useCan('),end=src.indexOf('\nfunction ',start+1);const state=initialState();state.guideStep=GUIDE_CAN;const battle=new Battle(state);let rendered=0;
 vm.runInNewContext(src.slice(start,end)+'\nuseCan()',{state,battle,GUIDE_CAN,running:false,modalType:null,tab:'battle',persist(){},sound(){},playEvents(){},renderVitals(){rendered++;},guideEvent:e=>state.guideStep=nextGuide(state.guideStep,e)});
 assert.equal(state.guideStep,13);assert.equal(battle.canCd,5.6);assert.equal(rendered,1);assert.match(rescueView(battle,false).status,/6秒/);
});
