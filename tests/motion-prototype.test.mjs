import test from 'node:test';
import assert from 'node:assert/strict';
import {prototypeLayers} from '../motion-prototype-renderer.mjs';
import {rigPose} from '../rig-motion.mjs';
import {actionTiming} from '../motion.mjs';
test('prototype keeps valid opaque atlas coverage throughout both actions',()=>{
for(const id of ['orange','spark'])for(const kind of ['normal','skill']){
 const timing=actionTiming({catId:id,side:'p'},kind);
 for(let elapsed=0;elapsed<timing.duration;elapsed+=1/240){
 const actor={catId:id,side:'p',hp:100,action:{...timing,kind,elapsed}};
 const layers=prototypeLayers(id,rigPose(id,actor,elapsed,elapsed));
 assert.ok(layers.length>=1&&layers.length<=2);
 assert.ok(Math.abs(layers.reduce((sum,x)=>sum+x[1],0)-1)<1e-8);
 for(const [cel,alpha] of layers){assert.ok(Number.isInteger(cel)&&cel>=0&&cel<(id==='spark'?9:12));assert.ok(alpha>0&&alpha<=1);}
 }
}
});
