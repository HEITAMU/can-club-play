import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {initialState,encodeSave,decodeSave} from '../core.mjs';
const source=fs.readFileSync(new URL('../app.mjs',import.meta.url),'utf8');
const extract=name=>{const start=source.indexOf('function '+name+'(');return source.slice(start,name==='showReset'?source.indexOf("\n\n$('#battle-income')",start):source.indexOf('\nfunction ',start+1));};
test('restart removes old saves and transient battle state, then opens a fresh tutorial',()=>{
 const key='save',backup='backup',storage=new Map([[key,'old'],[backup,'old-backup']]),layer={hidden:false,innerHTML:'old'},calls=[];
 const context={state:{stage:80},activityReturn:{cancel:()=>calls.push('cancel')},queue:[()=>assert.fail('old modal queue')],running:true,farming:true,nextDelay:1,entranceRemaining:1,pausedBattle:{},battle:{},loadingSerial:4,resourceLoading:true,$:()=>layer,resultLayer:{...layer},entranceLayer:{...layer},clearEffects(){},combatEffects:{clear(){}},guardEffects:{clear(){}},battleCues:{clear(){}},formationMotion:{clear(){}},initialState,selectedCrew:'star',crewMode:'equipment',bagView:{slot:'claw',set:'guard',page:4},guideLast:6,guideTarget:{},KEY:key,BACKUP:backup,localStorage:{removeItem:k=>storage.delete(k)},persist(){storage.set(key,encodeSave(context.state));},forceClose(){},renderHeader(){},renderParty(){},changeTab(t){assert.equal(context.battle,null);assert.equal(t,'battle');},previewBattle:()=>calls.push('preview'),renderGuide(){},showIntro:()=>calls.push('intro')};
 vm.runInNewContext(extract('restartGame')+'\nrestartGame()',context);
 const saved=decodeSave(storage.get(key));assert.equal(saved.stage,1);assert.equal(saved.guideStep,0);assert.equal(saved.onboarded,false);assert.deepEqual(saved.party,['orange','ink']);assert.ok(Object.values(saved.levels).every(n=>n===1));assert.equal(storage.has(backup),false);
 assert.equal(context.running,false);assert.equal(context.nextDelay,0);assert.equal(context.entranceRemaining,0);assert.equal(context.pausedBattle,null);assert.equal(context.loadingSerial,5);assert.equal(context.queue.length,0);assert.equal(context.resultLayer.hidden,true);assert.equal(context.bagView.slot,'');assert.equal(calls.at(-1),'intro');
});
test('opening reset confirmation does not reset until confirmed and offers cancel',()=>{
 const buttons={'#cancel-reset':{},'#confirm-reset':{}};let reset=0,cancel=0,html='';
 const context={openModal:(kind,s)=>{assert.equal(kind,'reset');html=s;},$:s=>buttons[s],showSettings:()=>cancel++,restartGame:()=>reset++,renderGuide(){}};
 vm.runInNewContext(extract('showReset')+'\nshowReset()',context);assert.equal(reset,0);assert.match(html,/无法撤销/);buttons['#cancel-reset'].onclick();assert.equal(cancel,1);assert.equal(reset,0);buttons['#confirm-reset'].onclick();assert.equal(reset,1);
});
