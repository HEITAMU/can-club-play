import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {resources} from './review.mjs';
import {ORDER,CHARACTERS} from './characters.mjs';
import {actorLayout,drawActor,muzzleFor} from './render.mjs';
import {fullBodyFrame} from './sprite-motion.mjs';
import {scriptedShieldPunch,shieldPunchPose} from './shield-punch.mjs';
const require=createRequire(import.meta.url),{createCanvas}=require('@napi-rs/canvas');

test('new shoulders attach inside the torso below a continuous neck',async()=>{
 const {atlas}=await resources();
 for(const id of ORDER){
  if(atlas.characters[id].fullBody)continue;
  const l=actorLayout(atlas.characters[id],CHARACTERS[id]),b=l.bodyPlacement;
  assert.ok(l.chin>b.y&&l.chin<l.near[1],id+' neck occupies space above the shoulders');
  for(const p of [l.near,l.far]){
   assert.ok(p[0]>b.x&&p[0]<b.x+b.w,id+' shoulder outside body');
   assert.ok(p[1]>b.y&&p[1]<b.y+b.h,id+' shoulder outside body');
  }
 }
});

test('all twelve body frames and fist attachment points lie inside painted assets',async()=>{
 const {atlas,images}=await resources(),a=atlas.characters.pudding.fullBody,img=images[a.atlas];
 assert.equal(a.frames.length,12);
 assert.equal(new Set(a.frames.map(f=>f.name)).size,12);
 const cv=createCanvas(img.width,img.height),ctx=cv.getContext('2d');ctx.drawImage(img,0,0);
 for(const frame of a.frames){
  const [x,y,w,h]=frame.rect,[px,py]=frame.pivot,[fx,fy]=frame.fist;
  assert.ok(x>=0&&y>=0&&x+w<=img.width&&y+h<=img.height,frame.name+' crop outside sheet');
  assert.ok(px>=0&&px<w&&py>=0&&py<=h+4,frame.name+' foot pivot outside frame');
  const cx=Math.round(x+px+fx),cy=Math.round(y+py+fy);
  const alpha=ctx.getImageData(cx-3,cy-3,7,7).data.filter((_,i)=>i%4===3);
  assert.ok(alpha.some(v=>v>100),frame.name+' fist effect would start in transparent space');
 }
});

test('punch effect follows the rendered fist through charge, contact and recovery',async()=>{
 const {atlas,images}=await resources(),ctx=createCanvas(960,520).getContext('2d');
 for(const t of [.2,.4,.7,1.35,1.8,1.91,1.97,2.08,2.35,3.1]){
  const d=scriptedShieldPunch(t),p=shieldPunchPose(d.s,t);
  const drawn=drawActor(ctx,atlas,images,'pudding',p,255,440,310,{time:t});
  assert.deepEqual(drawn,muzzleFor(atlas,'pudding',p,255,440,310));
  if(t===1.97){assert.equal(fullBodyFrame(p,t),10);assert.ok(drawn.x>350);}
 }
 const interrupted=scriptedShieldPunch(1.2,true),p=shieldPunchPose(interrupted.s,1.2);
 assert.equal(fullBodyFrame(p,1.2),11);
 assert.equal(interrupted.events.some(e=>e.type==='punchHit'),false);
});
