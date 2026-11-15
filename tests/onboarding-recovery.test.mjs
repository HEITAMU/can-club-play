import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {guideResume,guideCardTop,GUIDE_DONE,nextGuide} from '../onboarding.mjs';
const source=fs.readFileSync(new URL('../app.mjs',import.meta.url),'utf8');
function run(name,context){const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+1);return vm.runInNewContext(source.slice(start,end)+'\n'+name+'()',context);}
test('every unfinished guide restores an actionable page, reopening transient equipment details',()=>{
 for(let step=2;step<=7;step++){const plan=guideResume(step);assert.ok(plan.waiting);assert.equal(plan.tab,step===2?'battle':'cats');assert.equal(plan.step,step===6?5:step);}
 assert.equal(guideResume(7).mode,'equipment');for(const step of [0,1,8,9])assert.equal(guideResume(step).waiting,false);
});
test('closing equipment details through the close handler advances without a click event',()=>{
 const state={guideStep:6,runCleared:1},layer={hidden:false};let events=0;
 run('closeModal',{modalType:'equipment',state,$:()=>layer,gearAnchor:{},queue:[],MAX_STAGE:100,battle:{result:'win',mode:'patrol'},renderGuide(){},guideEvent:e=>{state.guideStep=nextGuide(state.guideStep,e);events++;},startBattle:()=>assert.fail('must wait for return-to-battle step')});
 assert.equal(state.guideStep,7);assert.equal(layer.hidden,true);assert.equal(events,1);
});
test('skipping any paused lesson closes its modal and starts the current campaign stage',()=>{
 for(let step=2;step<=7;step++){
  const state={guideStep:step};let closed=0,started=0,tab='cats';
  run('skipGuide',{state,guideResume,GUIDE_DONE,persist(){},forceClose(){closed++;},renderGuide(){},changeTab:t=>tab=t,startBattle:()=>started++});
  assert.equal(state.guideStep,9);assert.equal(closed,1);assert.equal(tab,'battle');assert.equal(started,1);
 }
});
test('returning to battle after reload starts step 7 even with an unfinished preview battle',()=>{
 let started=0;const el={hidden:false,classList:{toggle(){}},scrollIntoView(){}};
 const context={districtTools:el,activityReturn:{cancel(){}},disposeDistrict:null,disposeFormation:null,tab:'cats',$:()=>el,$$:()=>[],running:false,pausedBattle:null,battle:{result:null},state:{guideStep:7},entranceRemaining:0,lastStamp:0,performance:{now:()=>0},sizeActors(){},renderVitals(){},combatEffects:{warm(){}},startBattle:()=>started++,renderCats(){},renderRelics(){},renderMap(){}};
 const start=source.indexOf('function changeTab('),end=source.indexOf('\nfunction ',start+1);vm.runInNewContext(source.slice(start,end)+"\nchangeTab('battle')",context);assert.equal(started,1);
});
test('guide cards stay on screen and avoid targets near either edge',()=>{
 for(const height of [568,667,844]){
  const upper={top:20,bottom:50},lower={top:height-60,bottom:height-20};
  assert.ok(guideCardTop(upper,170,height)>upper.bottom);
  assert.ok(guideCardTop(lower,170,height)+170<lower.top);
 }
});
