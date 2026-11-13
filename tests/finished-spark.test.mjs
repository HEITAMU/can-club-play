import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
import {FINISHED_SPARK as ART} from '../finished-spark-data.mjs';
import {sparkCel,sparkFace,sparkVertex,setFinishedCanvasFactory} from '../finished-spark-renderer.mjs?v=0.21.4';
import {renderPuppetFrame} from '../rig-renderer.mjs';
import {rigPose} from '../rig-motion.mjs';import {actionTiming} from '../motion.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require('@napi-rs/canvas'),sharp=require('sharp');setFinishedCanvasFactory(createCanvas);
const atlas=await loadImage(await sharp(fileURLToPath(new URL('../'+ART.atlas,import.meta.url))).png().toBuffer());
test('full-body art keeps one skull scale and all frame rectangles inside the atlas',()=>{
 assert.equal(ART.frames.length,9);assert.equal(ART.weaponHand,'right');
 for(const f of ART.frames){const [x,y,w,h]=f.rect;assert.ok(x>=0&&y>=0&&x+w<=ART.width&&y+h<=ART.height);assert.equal(f.head[2],265);assert.ok(f.head[3]>190&&f.head[3]<215);}
});
test('cast reaches the release drawing at projectile launch and returns without a second cast',()=>{
 for(const kind of ['normal','skill'])for(const interval of [.65,1.5,2]){
  const actor={side:'p',catId:'spark',hp:100,interval},timing=actionTiming(actor,kind),sample=t=>sparkCel(rigPose('spark',{...actor,action:{...timing,kind,elapsed:t}},t,0));
  assert.equal(sample(0),0);assert.equal(sample(timing.windup),5);assert.equal(sample(timing.duration),0);
  const frames=[];for(let t=0;t<timing.duration;t+=1/240){const v=sample(t);if(v!==frames.at(-1))frames.push(v);}
  assert.deepEqual(frames,[0,1,2,3,4,5,6,7,8,0]);
 }
});
test('idle deforms continuously, keeps both foot soles planted, and does not fold its mesh',()=>{
 const area=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 for(let t=0;t<6;t+=.1){const pose={sparkClock:t};for(const x of [180,330])assert.deepEqual(sparkVertex(x,518,pose),[x,518]);
  for(let y=0;y<10;y++)for(let x=0;x<8;x++){const p=[[x,y],[x+1,y],[x+1,y+1],[x,y+1]].map(([a,b])=>sparkVertex(a*64,b*54.4,pose));assert.ok(area(p[0],p[1],p[2])>0&&area(p[0],p[2],p[3])>0);}
 }
 assert.notDeepEqual(sparkVertex(100,300,{sparkClock:0}),sparkVertex(100,300,{sparkClock:.5}));
});
test('continuous body deformation does not introduce a translucent grid across opaque artwork',()=>{
 const flat=createCanvas(ART.width,ART.height),paint=flat.getContext('2d');paint.fillStyle='#805028';paint.fillRect(0,0,flat.width,flat.height);
 for(const time of [0,.4,1.3]){
  const c=createCanvas(720,690),ctx=c.getContext('2d');renderPuppetFrame(ctx,'spark',rigPose('spark',null,time,time),flat,c.width,c.height,null,{to:'neutral'});
  const pixels=ctx.getImageData(0,0,c.width,c.height).data;let seams=0,total=0;
  for(let y=130;y<500;y++)for(let x=200;x<500;x++){total++;if(pixels[(y*c.width+x)*4+3]<252)seams++;}
  assert.ok(seams/total<.002,'mesh edges form visible translucent stripes: '+seams+'/'+total);
 }
});
function render(face){const c=createCanvas(720,690),ctx=c.getContext('2d');renderPuppetFrame(ctx,'spark',rigPose('spark',null,0,0),atlas,720,690,null,{from:face,to:face,mix:1});return ctx.getImageData(0,0,720,690).data;}
test('blink, focus, hurt and smile change actual facial pixels while the body remains identical',()=>{
 const base=render('neutral');for(const face of ['blink','attack','hurt','victory']){const next=render(face);let changed=0;for(let y=0;y<690;y++)for(let x=0;x<720;x++){const k=(y*720+x)*4,delta=Math.abs(base[k]-next[k])+Math.abs(base[k+1]-next[k+1])+Math.abs(base[k+2]-next[k+2]);if(delta>5){changed++;assert.ok(y<290,'expression modified the torso or arms');}assert.ok(Math.abs(next[k+3]-base[k+3])<=2,'expression changed silhouette/opacity beyond byte rounding');}assert.ok(changed>1000,face+' must be visibly different');}
 assert.equal(sparkFace({to:'down'},0),'blink');
});
