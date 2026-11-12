import {IDLE_PROFILES,idlePose} from './idle-motion.mjs?v=0.12.0';
import {poseFor} from './motion.mjs?v=0.12.0';
// Hand-painted key poses. The atlas cells are cropped by CSS, never displayed whole.
const heroSheets={orange:['a',0],ink:['a',1],milk:['b',0],spark:['b',1],mint:['c',0],bolt:['c',1],pudding:['d',0],star:['d',1]};
const foeSheets={dust:['a',0],box:['a',1],mop:['a',2],battery:['a',3],bag:['b',0],drone:['b',1],vacuum:['b',2],fridge:['b',3],sign:['c',0],boxBoss:['c',1],clock:['c',2],vendor:['c',3]};
const heroFrames=[0,1,2,0,0,3,1,2];
// Painted feet differ inside the atlas cells; align them to a shared ground contact.
const feet={orange:.92,ink:.91,milk:.925,spark:.92,mint:.90,bolt:.945,pudding:.92,star:.93,dust:.91,box:.86,mop:.90,battery:.84,bag:.91,drone:.87,vacuum:.82,fridge:.92,sign:.92,boxBoss:.935,clock:.89,vendor:.925};
const transitions=new WeakMap();
const reduce=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function sprite(kind,sheet,row,rows,id){const accent=IDLE_PROFILES[id]?.accent,mark=accent?.type==='ember'?'<path d="M10 19C0 17 3 8 10 2c-1 6 5 5 4 0 9 10 5 18-4 17Z" fill="currentColor"/>':accent?.type==='crystal'?'<path d="M10 1v18M2 5l16 10M2 15L18 5" fill="none" stroke="currentColor" stroke-width="1.5"/>':'<path d="M10 1l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="currentColor"/>';
 return `<span class="painted-sprite" data-art="${id}" data-hero="${kind==='heroes'}" data-row="${row}" data-rows="${rows}" data-pose="0" style="--atlas:url('./assets/painted/${kind}-${sheet}.webp');--sheet-rows:${rows};background-position:0% ${row/(rows-1)*100}%" aria-hidden="true"><span class="pose-ghost"></span>${accent?`<svg class="idle-accent ${accent.type}" viewBox="0 0 20 20" style="left:${accent.x}%;top:${accent.y}%">${mark}</svg>`:''}</span>`;
}
export function paintedCat(id){const [sheet,row]=heroSheets[id]||heroSheets.orange;return sprite('heroes',sheet,row,2,id);}
export function paintedEnemy(type,boss=false){const id=boss&&type==='box'?'boxBoss':type;const [sheet,row]=foeSheets[id]||foeSheets.dust;return sprite('enemies',sheet,row,4,id);}
export function paintedPose(root,frame,{actor,time=0,idleTime=time}={}){
 const el=root.matches('.painted-sprite')?root:root.querySelector('.painted-sprite');if(!el)return;
 const pose=actor?poseFor(actor,time):{phase:'idle'},id=el.dataset.art;
 let col=el.dataset.hero==='true'?(heroFrames[frame]??0):Math.min(3,Math.max(0,frame));
 if(pose.phase==='recover'&&pose.progress<.6)col=2;
 const previous=transitions.get(el)||{col:+el.dataset.pose,changedAt:-1,position:el.style.backgroundPosition,shape:idlePose(id,idleTime)};
 if(previous.col!==col){const ghost=el.querySelector('.pose-ghost');if(ghost)ghost.style.backgroundPosition=previous.position;previous.changedAt=time;previous.col=col;el.dataset.pose=String(col);el.style.backgroundPosition=`${col/3*100}% ${+el.dataset.row/(+el.dataset.rows-1)*100}%`;previous.position=el.style.backgroundPosition;}
 const foot=feet[id]||.92,groundShift=(.92-foot)*100;el.style.transformOrigin=`50% ${foot*100}%`;
 const ghost=el.querySelector('.pose-ghost');if(ghost)ghost.style.opacity=reduce?'0':String(Math.max(0,1-(time-previous.changedAt)/.085));
 const accent=el.querySelector('.idle-accent'),idle=idlePose(id,idleTime);
 if(accent){accent.style.opacity=reduce||pose.phase!=='idle'||actor?.hp<=0?'0':String(.12+idle.accent*.66);accent.style.transform=`translate(-50%,-50%) scale(${.72+idle.accent*.35}) rotate(${idle.angle*5}deg)`;}
 if(reduce){el.style.transform=`translateY(${groundShift}%)`;transitions.set(el,previous);return;}
 let {angle,sx,sy,y}=idle;
 if(actor?.hp<=0){angle=0;sx=sy=1;y=0;}
 else if(pose.phase==='windup'){
  if(previous.action!==actor.action){previous.start={...previous.shape};previous.action=actor.action;}
  const k=pose.progress??0,m=k*k*(3-2*k),start=previous.start||idle;
  angle=start.angle*(1-m)-4.2*m;sx=start.sx*(1-m)+(1-.025*m)*m;sy=start.sy*(1-m)+(1+.018*m)*m;y=0;
 }else if(pose.phase==='release'||pose.phase==='hold'){
  const k=pose.phase==='hold'?1:(pose.progress??1);angle=-4.2+6*k;sx=1+.028*k;sy=1-.012*k;y=0;
 }else if(pose.phase==='recover'){
  const k=pose.progress,m=k*k*(3-2*k),rest=idlePose(id,idleTime);angle=1.8*(1-m)+rest.angle*m;sx=1.028*(1-m)+rest.sx*m;sy=.988*(1-m)+rest.sy*m;y=0;
 }else if(pose.phase==='charge'){angle=Math.sin(time*14)*.5;sx=1.018;sy=.982;y=0;}
 else if(pose.phase==='hit'){const k=Math.max(0,Math.min(1,((actor.hitUntil||0)-time)/.22));angle=-3.6*k;sx=1+.015*k;sy=1-.015*k;y=0;}
 previous.shape={angle,sx,sy,y};transitions.set(el,previous);
 el.style.transform=`translateY(calc(${groundShift.toFixed(2)}% + ${y.toFixed(2)}px)) rotate(${angle.toFixed(2)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
}
export function paintedItem(index,size){return `<span class="painted-item" style="background-position:${index%4/3*100}% ${Math.floor(index/4)/3*100}%;${size?`width:${size}px;height:${size}px;`:''}" aria-hidden="true"></span>`;}
export function paintedScene(index){return `<div class="scene-art painted-scene" data-street="${index}" style="background-position:${index%3*50}% ${Math.floor(index/3)*100}%" aria-hidden="true"></div>`;}
