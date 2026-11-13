import test from 'node:test';
import assert from 'node:assert/strict';
import {ARTICULATED} from '../articulated-data.mjs';
import {ORANGE_RIG,orangeJoints,armSkin,SKIN_ROWS,shieldPlacement} from '../articulated-renderer.mjs';
import {rigPose} from '../rig-motion.mjs';
import {actionTiming,poseFor,travelOffset,MotionOffsets} from '../motion.mjs';
import {Battle,initialState} from '../core.mjs';
import {renderPuppetFrame} from '../rig-renderer.mjs';
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
const actor={id:'p0',catId:'orange',side:'p',hp:100,interval:1.5};
function samples(){const out=[];for(const kind of ['normal','skill']){const timing=actionTiming(actor,kind);for(let i=0;i<=240;i++){const elapsed=timing.duration*i/240;out.push(rigPose('orange',{...actor,action:{kind,...timing,elapsed}},elapsed));}}for(let i=0;i<120;i++){const t=i/60;out.push(rigPose('orange',actor,t));out.push(rigPose('orange',{...actor,hitUntil:.22},t));out.push(rigPose('orange',{...actor,hp:0,downAt:0},t));}return out;}
test('this revision replaces only orange; the body and shield contain no arm sprite',()=>{
 assert.deepEqual(Object.keys(ARTICULATED),['orange']);
 assert.deepEqual(Object.keys(ARTICULATED.orange.parts),['body','rightArm','leftArm','rightLeg','leftLeg','tail','shield']);
 assert.notDeepEqual(ARTICULATED.orange.parts.rightArm,ARTICULATED.orange.parts.leftArm);
 assert.equal(ORANGE_RIG.shieldHand,'left');
});
test('both shoulders stay connected and neither arm stretches or changes anatomical side',()=>{
 for(const pose of samples()){
  const j=orangeJoints(pose);assert.deepEqual(j.left.shoulder,ORANGE_RIG.leftShoulder);assert.deepEqual(j.right.shoulder,ORANGE_RIG.rightShoulder);
  for(const side of ['left','right']){const a=j[side],lengths=side==='left'?[.115,.125]:[.105,.115];assert.ok(Math.abs(distance(a.shoulder,a.elbow)-lengths[0])<1e-9);assert.ok(Math.abs(distance(a.elbow,a.wrist)-lengths[1])<1e-9);}
  assert.ok(j.left.wrist[0]>j.right.wrist[0]+.18,'hands crossed sides');
 }
});
test('painted wrists and shield grip coincide for every sampled action, including a whole-character turn',()=>{
 for(const pose of samples()){
  const joints=orangeJoints(pose),shield=shieldPlacement(pose,joints);assert.equal(shield.hand,'left');assert.deepEqual(shield.point,joints.left.wrist);
  for(const side of ['left','right']){const strip=armSkin(joints[side],ARTICULATED.orange.parts[side+'Arm']);for(const [y,key] of [[.16,'shoulder'],[.84,'wrist']]){const [a,b]=strip[SKIN_ROWS.indexOf(y)],center=[(a[0]+b[0])/2,(a[1]+b[1])/2];assert.ok(distance(center,joints[side][key])<1e-9);}}
  for(const facing of [-1,1])assert.equal((shield.point[0]-.5)*facing,(joints.left.wrist[0]-.5)*facing);
 }
});
test('arm skin triangles do not invert or fold across one another during actions',()=>{
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 for(const pose of samples())for(const side of ['left','right']){const strip=armSkin(orangeJoints(pose)[side],ARTICULATED.orange.parts[side+'Arm']);for(let i=0;i<strip.length-1;i++){const [a,b]=strip[i],[c,d]=strip[i+1];assert.ok(cross(a,b,c)>0&&cross(b,d,c)>0,side+' skin folded');}}
});
test('shield bash approaches without moving the body into the target; guard remains planted',()=>{
 const source={x:36,y:59},target={x:64,y:59};
 for(const size of [38,52,66])for(const kind of ['normal','skill']){const timing=actionTiming(actor,kind),a={...actor,action:{kind,...timing,elapsed:timing.impactAt}},p=poseFor(a,1),offset=travelOffset(a,p,source,target,390,400,size,size,1);
  if(kind==='skill')assert.deepEqual(offset,{x:0,y:0});else{assert.ok(offset.x>0);assert.ok((target.x-source.x)*3.9-offset.x>=size*.95-1e-8);}
 }
 const a={...actor,action:{kind:'normal',...actionTiming(actor),elapsed:.5}},offsets=new MotionOffsets(),before=offsets.value(a,{x:32,y:4},1);a.action=null;
 assert.deepEqual(offsets.value(a,{x:0,y:0},1),before);assert.deepEqual(offsets.value(a,{x:0,y:0},1.21),{x:0,y:0});
});
test('the slower visible bash still lands once and respects attack-speed upgrades',()=>{
 for(const interval of [1.5,1.2,1.071])assert.ok(actionTiming({...actor,interval}).duration<interval);
 const s=initialState();s.party=['orange'];const b=new Battle(s);for(const a of [...b.heroes,...b.enemies]){a.hp=a.maxHp=100000;a.wait=99;a.skillWait=99;}const h=b.heroes[0];h.crit=0;b.beginAction(h,'normal');const events=[];while(h.action)events.push(...b.tick(.02));
 const hits=events.filter(e=>e.type==='hit'&&e.from===h.id);assert.equal(hits.length,1);assert.ok(Math.abs(hits[0].at-actionTiming(h).impactAt)<1e-8);
});
test('focused expression transitions keep an opaque head beneath the new expression',()=>{
 for(const mix of [0,.1,.5,.9,1]){const stack=[],draws=[],ctx={globalAlpha:1,setTransform(){},clearRect(){},save(){stack.push(this.globalAlpha);},restore(){this.globalAlpha=stack.pop();},translate(){},rotate(){},scale(){},transform(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},clip(){},drawImage(img,...args){draws.push({src:args.slice(0,4),alpha:this.globalAlpha});}};
  renderPuppetFrame(ctx,'orange',rigPose('orange',actor,0),{},144,138,null,{from:'neutral',to:'attack',mix});
  const faces=ARTICULATED.orange.faces,under=draws.find(d=>String(d.src)===String(faces.neutral)),over=draws.find(d=>String(d.src)===String(faces.attack));
  assert.equal(over.alpha,mix===1?1:mix);assert.equal(mix===1?over.alpha:over.alpha+under.alpha*(1-over.alpha),1);
 }
});
