import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import {GUIDE,nextGuide,normalizeGuide} from '../onboarding.mjs';
const src=fs.readFileSync(new URL('../app.mjs',import.meta.url),'utf8');
const start=src.indexOf("document.addEventListener('click',e=>{const g=GUIDE"),end=src.indexOf('\n',start);
function click(step,{inside=false,skip=false}={}){
 let handler,prevented=false,stopped=false,closed=false,advanced=false;
 const context={GUIDE,state:{guideStep:step,onboarded:true},resourceLoading:false,modalType:step===6?'equipment':null,document:{addEventListener:(type,fn)=>handler=fn,querySelector:()=>({contains:()=>inside})},forceClose:()=>closed=true,guideEvent:e=>{assert.equal(e,'continue');advanced=true;}};
 vm.runInNewContext(src.slice(start,end),context);
 handler({target:{closest:()=>skip},preventDefault:()=>prevented=true,stopImmediatePropagation:()=>stopped=true});return {prevented,stopped,closed,advanced};
}
test('information clicks advance and consume the click rather than activating underlying UI',()=>{
 for(const step of [1,6,8]){const r=click(step);assert.ok(r.prevented&&r.stopped&&r.advanced);assert.equal(r.closed,step===6);}
});
test('action steps reject outside clicks and pass target clicks to their real action',()=>{
 for(const step of [2,3,4,5,7]){assert.ok(click(step).stopped);const r=click(step,{inside:true});assert.ok(!r.prevented&&!r.stopped&&!r.advanced);assert.equal(nextGuide(step,'continue'),step);}
});
test('skip remains independently clickable in every visible step',()=>{
 for(let step=1;step<=8;step++){const r=click(step,{skip:true});assert.ok(!r.prevented&&!r.stopped&&!r.advanced);}
});
test('battle completion cannot dismiss an information card; first acknowledgement always advances immediately',()=>{
 assert.equal(nextGuide(1,'win'),1);assert.equal(nextGuide(8,'win'),8);
 assert.equal(nextGuide(1,'continue',0),2);assert.equal(normalizeGuide(10,true),2);assert.equal(nextGuide(10,'win'),2);assert.equal(nextGuide(1,'continue',1),2);
});
