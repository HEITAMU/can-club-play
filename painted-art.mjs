import {poseFor} from './motion.mjs?v=0.14.1';
import {rigPose,rigFor,blendRigPose,animationClock} from './rig-motion.mjs?v=0.14.1';
import {drawRig} from './rig-renderer.mjs?v=0.14.1';
// Original paintings are the loading fallback; partners use separate painted body parts.
const heroSheets={orange:['a',0],ink:['a',1],milk:['b',0],spark:['b',1],mint:['c',0],bolt:['c',1],pudding:['d',0],star:['d',1]};
const foeSheets={dust:['a',0],box:['a',1],mop:['a',2],battery:['a',3],bag:['b',0],drone:['b',1],vacuum:['b',2],fridge:['b',3],sign:['c',0],boxBoss:['c',1],clock:['c',2],vendor:['c',3]};
const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const poses=new WeakMap();
function sprite(kind,sheet,row,rows,id){
 return `<span class="painted-sprite" data-art="${id}" data-atlas="./assets/painted/${kind}-${sheet}.webp" data-hero="${kind==='heroes'}" data-row="${row}" data-rows="${rows}" data-pose="0" style="--atlas:url('./assets/painted/${kind}-${sheet}.webp');--sheet-rows:${rows};background-position:0% ${row/(rows-1)*100}%" aria-hidden="true"><canvas class="rig-canvas" aria-hidden="true"></canvas></span>`;
}
export function paintedCat(id){const [sheet,row]=heroSheets[id]||heroSheets.orange;return sprite('heroes',sheet,row,2,id);}
export function paintedEnemy(type,boss=false){const id=boss&&type==='box'?'boxBoss':type;const [sheet,row]=foeSheets[id]||foeSheets.dust;return sprite('enemies',sheet,row,4,id);}
export function paintedPose(root,frame,{actor,time=0,idleTime=time}={}){
 const el=root.matches('.painted-sprite')?root:root.querySelector('.painted-sprite');if(!el)return;
 const id=el.dataset.art,phase=actor?poseFor(actor,time).phase:'idle',next=rigPose(id,actor,time,idleTime),foot=rigFor(id).foot,groundShift=(.92-foot)*100,clock=animationClock(actor,time,idleTime),prior=poses.get(el),shape=blendRigPose(prior?.shape,next,prior?clock-prior.clock:-1);poses.set(el,{clock,shape:{...shape}});
 if(reduce){for(const k of ['lean','head','hand','tail','reach'])shape[k]*=.2;shape.breath*=.35;}
 el.style.transformOrigin=`50% ${foot*100}%`;
 const drawn=drawRig(el,id,shape);
 el.style.transform=drawn?`translateY(${groundShift}%)`:`translateY(${groundShift}%) rotate(${shape.lean*180/Math.PI}deg) scale(${1-shape.breath*.35},${1+shape.breath})`;
 el.dataset.pose='0';el.dataset.phase=phase;
}
export function paintedItem(index,size){return `<span class="painted-item" style="background-position:${index%4/3*100}% ${Math.floor(index/4)/3*100}%;${size?`width:${size}px;height:${size}px;`:''}" aria-hidden="true"></span>`;}
export function paintedScene(index){return `<div class="scene-art painted-scene" data-street="${index}" style="background-position:${index%3*50}% ${Math.floor(index/3)*100}%" aria-hidden="true"></div>`;}
