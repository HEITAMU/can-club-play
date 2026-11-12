import {poseFor} from './motion.mjs?v=0.10.0';
// Hand-painted key poses. The atlas cells are cropped by CSS, never displayed whole.
const heroSheets={orange:['a',0],ink:['a',1],milk:['b',0],spark:['b',1],mint:['c',0],bolt:['c',1],pudding:['d',0],star:['d',1]};
const foeSheets={dust:['a',0],box:['a',1],mop:['a',2],battery:['a',3],bag:['b',0],drone:['b',1],vacuum:['b',2],fridge:['b',3],sign:['c',0],boxBoss:['c',1],clock:['c',2],vendor:['c',3]};
const heroFrames=[0,1,2,0,0,3,1,2];
const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function sprite(kind,sheet,row,rows,id){return `<span class="painted-sprite" data-art="${id}" data-hero="${kind==='heroes'}" data-row="${row}" data-rows="${rows}" data-pose="0" style="--atlas:url('./assets/painted/${kind}-${sheet}.webp');--sheet-rows:${rows};background-position:0% ${row/(rows-1)*100}%" aria-hidden="true"></span>`;}
export function paintedCat(id){const [sheet,row]=heroSheets[id]||heroSheets.orange;return sprite('heroes',sheet,row,2,id);}
export function paintedEnemy(type,boss=false){const id=boss&&type==='box'?'boxBoss':type;const [sheet,row]=foeSheets[id]||foeSheets.dust;return sprite('enemies',sheet,row,4,id);}
export function paintedPose(root,frame,{actor,time=0}={}){
 const el=root.matches('.painted-sprite')?root:root.querySelector('.painted-sprite');if(!el)return;
 const pose=actor?poseFor(actor,time):null;
 let col=el.dataset.hero==='true'?(heroFrames[frame]??0):Math.min(3,Math.max(0,frame));
 if(pose?.phase==='recover'&&pose.progress<.48)col=2;
 if(el.dataset.pose!==String(col)){el.dataset.pose=String(col);el.style.backgroundPosition=`${col/3*100}% ${+el.dataset.row/(+el.dataset.rows-1)*100}%`;}
 // Real painted windup, strike and recoil frames plus a quiet breathing motion.
 // Time comes from combat, so opening menus and pausing also freezes the art.
 if(reduce){el.style.transform='none';return;}
 const offset=(Number(actor?.id?.slice(1))||0)*1.7;
 let y=0,angle=0,sx=1,sy=1;
 if(!actor||actor.hp>0){
  if(col===0){const breath=Math.sin(time*2.5+offset);y=breath*.7;sy=1+breath*.007;}
  if(col===1){const progress=actor?.action?Math.min(1,actor.action.elapsed/actor.action.windup):.5;angle=-4.5*progress;sx=1-progress*.024;sy=1+progress*.015;}
  if(col===2){const k=actor?.action?Math.max(0,Math.min(1,(actor.action.elapsed-actor.action.windup)/actor.action.travel)):1;angle=4.5*(1-k)+1.2;sx=1+.025*(1-k);}
  if(pose?.phase==='recover'){angle=1.2*(1-pose.progress);sx=sy=1;y=0;}
  if(pose?.phase==='charge'){angle=Math.sin(time*19)*.65;sx=1.025;sy=.975;y=1.8;}
  if(col===3){const k=actor?Math.max(0,Math.min(1,((actor.hitUntil||0)-time)/.18)):1;angle=-5*k;y=2*k;}
 }
 el.style.transform=`translateY(${y.toFixed(2)}px) rotate(${angle.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
}
export function paintedItem(index,size){return `<span class="painted-item" style="background-position:${index%4/3*100}% ${Math.floor(index/4)/3*100}%;${size?`width:${size}px;height:${size}px;`:''}" aria-hidden="true"></span>`;}
export function paintedScene(index){return `<div class="scene-art painted-scene" data-street="${index}" style="background-position:${index%3*50}% ${Math.floor(index/3)*100}%" aria-hidden="true"></div>`;}
