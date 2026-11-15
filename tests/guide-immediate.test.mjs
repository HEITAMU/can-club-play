import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {GUIDE,GUIDE_DONE,GUIDE_CAN,nextGuide} from '../onboarding.mjs';
import {initialState,upgrade} from '../core.mjs';
const source=fs.readFileSync(new URL('../app.mjs',import.meta.url),'utf8');
function setup(step){
 const handlers={},shown=[];
 const state={guideStep:step,onboarded:true};
 const context={state,GUIDE,GUIDE_DONE,GUIDE_CAN,nextGuide,running:false,nextDelay:5,tab:'battle',battle:null,resourceLoading:false,modalType:null,renderVitals(){},renderGuide:()=>shown.push(state.guideStep),persist(){},toast(){},showQuests(){context.growthShown=true;},startBattle(){},forceClose(){context.modalType=null;},document:{addEventListener:(type,fn)=>handlers[type]=fn,querySelector:()=>({contains:()=>false})}};
 const eventStart=source.indexOf('function guideEvent('),eventEnd=source.indexOf('\nfunction restoreGuide',eventStart);
 vm.runInNewContext(source.slice(eventStart,eventEnd),context);
 const start=source.indexOf('let guidePointerStep='),end=source.indexOf("\ndocument.addEventListener('click',e=>{if(e.target.closest('[data-tab",start);
 vm.runInNewContext(source.slice(start,end),context);
 const event=(skip=false,detail=1)=>({button:0,detail,target:{closest:()=>skip},preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}});
 return {context,state,shown,handlers,event};
}
test('pointer release synchronously paints next lesson with no battle or timer prerequisite',()=>{
 for(const [step,next] of [[1,2],[6,7],[8,11],[11,12],[13,9]]){
  const t=setup(step);t.handlers.pointerdown();t.handlers.pointerup(t.event());
  assert.equal(t.state.guideStep,next);assert.deepEqual(t.shown,[next]);
  if(next===9)assert.equal(t.context.growthShown,true);
  if(next<9)assert.equal(t.context.nextDelay,0);
  const follow=t.event();t.handlers.click(follow);assert.ok(follow.stopped);assert.deepEqual(t.shown,[next]);
 }
});
test('next independent touch is accepted; skipped and outside action touches never advance',()=>{
 const t=setup(1);t.handlers.pointerdown();t.handlers.pointerup(t.event());
 t.state.guideStep=6;t.handlers.pointerdown();t.handlers.pointerup(t.event());assert.deepEqual(t.shown,[2,7]);
 for(const step of [1,2,3,4,5,6,7,8]){const t=setup(step);t.handlers.pointerdown();t.handlers.pointerup(t.event(true));assert.equal(t.state.guideStep,step);}
 for(const step of [2,3,4,5,7]){const t=setup(step);t.handlers.pointerdown();t.handlers.pointerup(t.event());t.handlers.click(t.event());assert.equal(t.state.guideStep,step);}
});
test('click fallback also renders synchronously and battle win never advances any lesson',()=>{
 const t=setup(1);t.handlers.click(t.event(false,0));assert.deepEqual(t.shown,[2]);
 for(let step=0;step<=10;step++)assert.equal(nextGuide(step,'win'),step);
 assert.doesNotMatch(source,/guideEvent\('win'\)/);
});
test('active tutorial refuses asynchronous battle setup before it can hide next card',async()=>{
 const start=source.indexOf('async function startBattle('),end=source.indexOf('\nfunction useCan',start);let painted=0;
 const context={guideActive:()=>true,running:true,nextDelay:8,renderGuide:()=>painted++};
 const promise=vm.runInNewContext(source.slice(start,end)+'\nstartBattle()',context);
 assert.equal(painted,1);assert.equal(context.running,false);assert.equal(context.nextDelay,0);await promise;
});
test('first upgrade is affordable before fighting or receiving battle rewards',()=>{assert.equal(upgrade(initialState(),'orange',1),1);});
