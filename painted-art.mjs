import {CARRIER_ATLAS,CARRIER_ART,carrierId} from './carrier-art.mjs';
import {layeredScene} from './battlefield-space.mjs';
import {webAsset} from './web-assets.mjs?v=0.25.1';
import {companionScale,HEAD_CROPS} from './companion-display.mjs';
import {FINISHED_ROSTER} from './finished-roster-data.mjs?v=0.25.0';
import {poseFor} from './motion.mjs?v=0.25.0';
import {rigPose,rigFor,blendRigPose,animationClock} from './rig-motion.mjs?v=0.25.0';
import {drawRig} from './rig-renderer.mjs?v=0.25.0';
import {EXPRESSIONS,expressionFor,faceTransition,bowNock} from './expressions.mjs?v=0.25.0';
// Loading portraits are assembled from the same corrected parts as the live characters.
const heroIds=['orange','ink','milk','spark','mint','bolt','pudding','star'];
const foeSheets={dust:['a',0],box:['a',1],mop:['a',2],battery:['a',3],bag:['b',0],drone:['b',1],vacuum:['b',2],fridge:['b',3],sign:['c',0],boxBoss:['c',1],clock:['c',2],vendor:['c',3]};
const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const poses=new WeakMap();
function sprite(kind,sheet,row,rows,id){
 return `<span class="painted-sprite" data-art="${id}" data-atlas="./assets/painted/${kind}-${sheet}.webp" data-asset="./assets/painted/${kind}-${sheet}.webp" data-hero="${kind==='heroes'}" data-row="${row}" data-rows="${rows}" data-pose="0" style="--atlas:url('./assets/painted/${kind}-${sheet}.webp');--sheet-rows:${rows};background-position:0% ${row/(rows-1)*100}%" aria-hidden="true"><canvas class="rig-canvas" aria-hidden="true"></canvas></span>`;
}
export function paintedCat(id,portrait=false){
 const art=FINISHED_ROSTER[id]||(id==='spark'?{atlas:'./assets/finished/spark-v0211.webp',portrait:'./assets/finished/spark-portrait-v0211.webp'}:FINISHED_ROSTER.orange);
 if(portrait){
  const [x,y,side]=HEAD_CROPS[id]||HEAD_CROPS.orange,[w,h]=id==='spark'?[576,552]:[512,544];
  return `<span class="painted-sprite painted-thumbnail" data-art="${id}" data-hero="false" aria-hidden="true"><svg class="companion-head" viewBox="${x} ${y} ${side} ${side}" preserveAspectRatio="xMidYMid meet"><image data-asset="${webAsset(art.portrait)}" width="${w}" height="${h}"/></svg></span>`;
 }
 const fallback=`<span class="anatomy-fallback" data-asset="${webAsset(art.portrait)}" style="background-size:100% 100%"></span>`;
 return `<span class="painted-sprite companion-body" data-art="${id}" data-hero="true" data-atlas="${webAsset(art.atlas)}" style="--companion-scale:${companionScale(id)}" aria-hidden="true">${fallback}<canvas class="rig-canvas" aria-hidden="true"></canvas></span>`;
}
export function paintedCarrier(actor){const id=carrierId(actor);if(!id)return '';const row=CARRIER_ART[id].row;return `<span class="painted-sprite material-carrier" data-art="${id}" data-hero="false" data-atlas="${CARRIER_ATLAS}" data-asset="${CARRIER_ATLAS}" data-row="${row}" data-rows="2" data-pose="0" style="--atlas:url('${CARRIER_ATLAS}');--sheet-rows:2;background-position:0% ${row*100}%" aria-hidden="true"><canvas class="rig-canvas" aria-hidden="true"></canvas></span>`;}
export function paintedEnemy(type,boss=false){const id=boss&&type==='box'?'boxBoss':type;const [sheet,row]=foeSheets[id]||foeSheets.dust;return sprite('enemies',sheet,row,4,id);}
export function paintedPose(root,frame,{actor,time=0,idleTime=time,outcome,preview,renderSize}={}){
 const el=root.matches('.painted-sprite')?root:root.querySelector('.painted-sprite');if(!el)return;
 const id=el.dataset.art,phase=actor?poseFor(actor,time).phase:'idle',next=rigPose(id,actor,time,idleTime),foot=rigFor(id).foot,groundShift=(.92-foot)*100,clock=animationClock(actor,time,idleTime),prior=poses.get(el),shape=blendRigPose(prior?.shape,next,prior?clock-prior.clock:-1);
 const key=expressionFor(id,actor,time,clock,{outcome,preview}),face=faceTransition(EXPRESSIONS.includes(preview)?null:prior?.face,key,clock);
 if(FINISHED_ROSTER[id]){shape.boltCel=next.boltCel;shape.shidunCel=next.shidunCel;shape.shidunCharge=next.shidunCharge;shape.shidunTime=next.shidunTime;shape.rosterCel=next.rosterCel;shape.rosterRecovery=next.rosterRecovery;shape.rosterSkill=next.rosterSkill;shape.rosterClock=clock;}
 if(id==='spark'){shape.sparkCel=next.sparkCel;shape.sparkRecovery=next.sparkRecovery;shape.sparkClock=clock;}
 shape.nock=bowNock(actor);poses.set(el,{clock,shape:{...shape},face});
 if(reduce){for(const k of ['lean','head','hand','tail','reach'])shape[k]*=.2;shape.breath*=.35;}
 el.style.transformOrigin=`50% ${foot*100}%`;
 const drawn=drawRig(el,id,shape,face,renderSize,typeof performance!=='undefined'?performance.now()/1000:clock);
 el.style.transform=drawn?`translateY(${groundShift}%)`:`translateY(${groundShift}%) rotate(${shape.lean*180/Math.PI}deg) scale(${1-shape.breath*.35},${1+shape.breath})`;
 el.dataset.pose='0';el.dataset.phase=phase;el.dataset.expression=face.to;
}
export function paintedItem(index,size){return `<span class="painted-item" data-asset="./assets/painted/items.webp" style="background-position:${index%4/3*100}% ${Math.floor(index/4)/3*100}%;${size?`width:${size}px;height:${size}px;`:''}" aria-hidden="true"></span>`;}
// Portrait cells are 418 x 627. The SVG viewport crops uniformly on every screen.
export function paintedScene(index){
 const cell=Math.max(0,Math.min(5,Math.floor(Number(index)||0))),x=cell%3*418,y=Math.floor(cell/3)*627;
 return layeredScene({file:'./assets/scenes/streets-v019.webp',x,y,width:418,height:627,cut:[290,270,265,275,245,270][cell]});
}
