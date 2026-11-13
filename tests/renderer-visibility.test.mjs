import test from 'node:test';
import assert from 'node:assert/strict';
import {rigPose} from '../rig-motion.mjs';

test('rear battle canvases survive stale offscreen/zero-size reports and a lost graphics surface',async()=>{
 const resize=[],intersections=[];
 globalThis.Image=class {set src(v){this.width=1024;this.height=1536;this.onload();}};
 globalThis.ResizeObserver=class {constructor(cb){resize.push(cb);}observe(){}unobserve(){}};
 globalThis.IntersectionObserver=class {constructor(cb){intersections.push(cb);}observe(){}unobserve(){}};
 const {drawRig}=await import('../rig-renderer.mjs?visibility-regression');
 for(const id of ['milk','mint','bolt']){
  const classes=new Set(),listeners={},ctx={draws:0,clears:0,globalAlpha:1,setTransform(){},clearRect(){this.clears++;},save(){},restore(){},translate(){},rotate(){},scale(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},clip(){},transform(){},stroke(){},fill(){},drawImage(){this.draws++;}};
  const canvas={width:300,height:150,getContext:()=>ctx,addEventListener:(name,cb)=>listeners[name]=cb};
  const el={dataset:{},clientWidth:66,clientHeight:66,querySelector:()=>canvas,classList:{contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c)}};
  const pose=rigPose(id,{hp:100},1);
  assert.ok(drawRig(el,id,pose,undefined,66));const before=ctx.draws;
  resize[0]([{target:el,contentRect:{width:0,height:0}}]);intersections[0]([{target:el,isIntersecting:false}]);
  assert.ok(drawRig(el,id,{...pose,hand:pose.hand+.1},undefined,66));assert.ok(ctx.draws>before,id+' still paints the battle sprite');
  assert.ok(canvas.width>90&&canvas.height>90);assert.ok(classes.has('rig-ready'));
  listeners.contextlost({preventDefault(){}});assert.ok(!classes.has('rig-ready'),'the painted fallback returns immediately');
  assert.equal(drawRig(el,id,pose,undefined,66),false);const lost=ctx.draws;
  listeners.contextrestored();assert.ok(drawRig(el,id,pose,undefined,66));assert.ok(ctx.draws>lost);assert.ok(classes.has('rig-ready'));
  canvas.width=0;const reset=ctx.draws;assert.ok(drawRig(el,id,pose,undefined,66));assert.ok(ctx.draws>reset,'a cleared surface redraws even while paused');
  const initial=ctx.clears;for(let i=0;i<60;i++)drawRig(el,id,{...pose,breath:i/1000},undefined,66,20+i/60);assert.ok(ctx.clears-initial<=31,'60 animation steps rasterize at most 31 times');assert.ok(ctx.clears-initial>=29,'animation remains live');
  const held=ctx.clears;drawRig(el,id,{...pose,rosterCel:3},undefined,66,21);assert.equal(ctx.clears,held+1,'a new action drawing is painted immediately');
 }
 delete globalThis.Image;delete globalThis.ResizeObserver;delete globalThis.IntersectionObserver;
});
