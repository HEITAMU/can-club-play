import test from 'node:test';import assert from 'node:assert/strict';
import {paintedBlend,paintedLayers} from '../painted-transition.mjs';
import {rigPose} from '../rig-motion.mjs';import {actionTiming} from '../motion.mjs';
import {drawFinishedRoster} from '../finished-roster-renderer.mjs';import {drawFinishedSpark} from '../finished-spark-renderer.mjs';
test('approved overlap is confined to middle 18% with stable opaque endpoints',()=>{
 assert.equal(paintedBlend(.41),0);assert.equal(paintedBlend(.59),1);assert.ok(Math.abs(paintedBlend(.5)-.5)<1e-12);
 for(let v=0;v<=1;v+=.001){const ls=paintedLayers(0,1,v);assert.ok(ls.every(([,w])=>w>0&&w<=1));assert.ok(Math.abs(ls.reduce((a,x)=>a+x[1],0)-1)<1e-9);if(v<=.41||v>=.59)assert.equal(ls.length,1);}
 assert.deepEqual(paintedLayers(4,4,.5),[[4,1]]);
 assert.deepEqual(paintedLayers(4,5,.2,{short:true}),[[4,.8],[5,.2]]);
});
test('all eight existing hero renderers stay bounded and restore alpha throughout actions',()=>{
 for(const id of ['orange','ink','milk','spark','mint','bolt','pudding','star'])for(const kind of ['normal','skill']){
 const timing=actionTiming({catId:id,side:'p'},kind);let draws=0;
 const ctx=new Proxy({globalAlpha:.8,drawImage(){draws++;}}, {get(t,k){return k in t?t[k]:(()=>{});}});
 for(let elapsed=0;elapsed<timing.duration;elapsed+=1/60){draws=0;const actor={catId:id,side:'p',hp:100,action:{...timing,kind,elapsed}};const pose=rigPose(id,actor,elapsed,elapsed);
 if(id==='spark')drawFinishedSpark(ctx,pose,{width:2048},{});else drawFinishedRoster(ctx,id,pose,{width:2048},{});
 assert.equal(ctx.globalAlpha,.8,id);assert.ok(draws===36||draws===72,`${id}: ${draws}`);}
 }
});
