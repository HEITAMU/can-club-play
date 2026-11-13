import test from 'node:test';import assert from 'node:assert/strict';import {bindDistrictInput} from '../district-input.mjs';import {districtObjectPose,districtMeshPoint} from '../district.mjs';
class Button extends EventTarget{constructor(id){super();this.dataset={place:id};}fire(type,extra={}){const e=new Event(type);Object.assign(e,extra);this.dispatchEvent(e);}}
function fixture(){const buttons=[new Button('stall'),new Button('arena')],root={dataset:{},isConnected:true,querySelectorAll:()=>buttons},opened=[];return {buttons,root,opened,dispose:bindDistrictInput(root,id=>opened.push(id),{reducedMotion:true})};}
const flush=()=>new Promise(r=>setTimeout(r,15));
test('press, leave and cancellation never open a destination',()=>{const f=fixture(),b=f.buttons[0];b.fire('pointerdown',{button:0});assert.equal(f.root.dataset.pressed,'stall');b.fire('pointerleave');assert.equal(f.root.dataset.pressed,undefined);b.fire('pointerdown',{button:0});b.fire('pointercancel');assert.equal(f.root.dataset.pressed,undefined);assert.deepEqual(f.opened,[]);f.dispose();});
test('release opens once and switching scenes cancels a queued activation',async()=>{const f=fixture(),b=f.buttons[1];b.fire('click');b.fire('click');await flush();assert.deepEqual(f.opened,['arena']);f.dispose();const other=fixture();other.buttons[0].fire('click');other.dispose();await flush();assert.deepEqual(other.opened,[]);});
test('keyboard activation has the same pressed and released states',async()=>{const f=fixture(),b=f.buttons[0];b.fire('keydown',{key:'Enter',repeat:false});assert.equal(f.root.dataset.pressed,'stall');b.fire('keyup',{key:'Enter'});assert.equal(f.root.dataset.pressed,undefined);b.fire('click');await flush();assert.deepEqual(f.opened,['stall']);f.dispose();});
test('pressed art compresses, rebounds and returns to rest; lamp and floor stay pinned',()=>{
 for(const id of ['stall','arena']){assert.ok(districtObjectPose(id,true).scale<1);assert.equal(districtObjectPose(id,false,.3).amount,0);}
 assert.deepEqual(districtMeshPoint('arena',915,980,1),[915,980]);
 assert.deepEqual(districtMeshPoint('stall',220,1245,1),[220,1245]);
 assert.ok(districtMeshPoint('stall',220,820,1)[1]>820);
});
