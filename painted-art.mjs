import {poseFor} from './motion.mjs?v=0.20.0';
import {rigPose,rigFor,blendRigPose,animationClock} from './rig-motion.mjs?v=0.20.0';
import {drawRig} from './rig-renderer.mjs?v=0.20.0';
import {EXPRESSIONS,expressionFor,faceTransition,bowNock} from './expressions.mjs?v=0.20.0';
// Loading portraits are assembled from the same corrected parts as the live characters.
const heroIds=['orange','ink','milk','spark','mint','bolt','pudding','star'];
const foeSheets={dust:['a',0],box:['a',1],mop:['a',2],battery:['a',3],bag:['b',0],drone:['b',1],vacuum:['b',2],fridge:['b',3],sign:['c',0],boxBoss:['c',1],clock:['c',2],vendor:['c',3]};
const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const poses=new WeakMap();
function sprite(kind,sheet,row,rows,id){
 return `<span class="painted-sprite" data-art="${id}" data-atlas="./assets/painted/${kind}-${sheet}.webp" data-hero="${kind==='heroes'}" data-row="${row}" data-rows="${rows}" data-pose="0" style="--atlas:url('./assets/painted/${kind}-${sheet}.webp');--sheet-rows:${rows};background-position:0% ${row/(rows-1)*100}%" aria-hidden="true"><canvas class="rig-canvas" aria-hidden="true"></canvas></span>`;
}
export function paintedCat(id){const i=Math.max(0,heroIds.indexOf(id)),row=Math.floor(i/4),atlas='./assets/anatomy/portraits-v0200.webp';return `<span class="painted-sprite" data-art="${heroIds[i]}" data-atlas="${atlas}" data-hero="true" data-row="${row}" data-rows="2" data-pose="0" style="--atlas:url('${atlas}');--sheet-rows:2" aria-hidden="true"><span class="anatomy-fallback" style="background-position:${i%4/3*100}% ${row*100}%"></span><canvas class="rig-canvas" aria-hidden="true"></canvas></span>`;}
export function paintedEnemy(type,boss=false){const id=boss&&type==='box'?'boxBoss':type;const [sheet,row]=foeSheets[id]||foeSheets.dust;return sprite('enemies',sheet,row,4,id);}
export function paintedPose(root,frame,{actor,time=0,idleTime=time,outcome,preview,renderSize}={}){
 const el=root.matches('.painted-sprite')?root:root.querySelector('.painted-sprite');if(!el)return;
 const id=el.dataset.art,phase=actor?poseFor(actor,time).phase:'idle',next=rigPose(id,actor,time,idleTime),foot=rigFor(id).foot,groundShift=(.92-foot)*100,clock=animationClock(actor,time,idleTime),prior=poses.get(el),shape=blendRigPose(prior?.shape,next,prior?clock-prior.clock:-1);
 const key=expressionFor(id,actor,time,clock,{outcome,preview}),face=faceTransition(EXPRESSIONS.includes(preview)?null:prior?.face,key,clock);
 shape.nock=bowNock(actor);poses.set(el,{clock,shape:{...shape},face});
 if(reduce){for(const k of ['lean','head','hand','tail','reach'])shape[k]*=.2;shape.breath*=.35;}
 el.style.transformOrigin=`50% ${foot*100}%`;
 const drawn=drawRig(el,id,shape,face,renderSize);
 el.style.transform=drawn?`translateY(${groundShift}%)`:`translateY(${groundShift}%) rotate(${shape.lean*180/Math.PI}deg) scale(${1-shape.breath*.35},${1+shape.breath})`;
 el.dataset.pose='0';el.dataset.phase=phase;el.dataset.expression=face.to;
}
export function paintedItem(index,size){return `<span class="painted-item" style="background-position:${index%4/3*100}% ${Math.floor(index/4)/3*100}%;${size?`width:${size}px;height:${size}px;`:''}" aria-hidden="true"></span>`;}
// Portrait cells are 418 x 627. The SVG viewport crops uniformly on every screen.
export function paintedScene(index){
 const cell=Math.max(0,Math.min(5,Math.floor(Number(index)||0))),x=cell%3*418,y=Math.floor(cell/3)*627;
 return `<svg class="scene-art stage-scene" data-street="${cell}" viewBox="${x} ${y} 418 627" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><image href="./assets/scenes/streets-v019.webp" width="1254" height="1254"/></svg>`;
}
