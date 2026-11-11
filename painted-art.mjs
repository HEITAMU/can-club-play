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
 const col=el.dataset.hero==='true'?(heroFrames[frame]??0):Math.min(3,Math.max(0,frame));
 if(el.dataset.pose!==String(col)){el.dataset.pose=String(col);el.style.backgroundPosition=`${col/3*100}% ${+el.dataset.row/(+el.dataset.rows-1)*100}%`;}
 // Real painted windup, strike and recoil frames plus a quiet breathing motion.
 // Time comes from combat, so opening menus and pausing also freezes the art.
 if(reduce){el.style.transform='none';return;}
 const offset=(Number(actor?.id?.slice(1))||0)*1.7;
 let y=0,angle=0,sx=1,sy=1;
 if(!actor||actor.hp>0){
  if(col===0){const breath=Math.sin(time*2.5+offset);y=breath*.7;sy=1+breath*.007;}
  if(col===1){const progress=actor?.action?actor.action.elapsed/actor.action.windup:.5;angle=-2.2*progress;sx=1-progress*.015;}
  if(col===2){angle=1.5;}
  if(col===3){angle=-3;y=1.5;}
 }
 el.style.transform=`translateY(${y.toFixed(2)}px) rotate(${angle.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
}
export function paintedItem(index,size){return `<span class="painted-item" style="background-position:${index%4/3*100}% ${Math.floor(index/4)/3*100}%;${size?`width:${size}px;height:${size}px;`:''}" aria-hidden="true"></span>`;}
export function paintedScene(index){return `<div class="scene-art painted-scene" data-street="${index}" style="background-position:${index%3*50}% ${Math.floor(index/3)*100}%" aria-hidden="true"></div>`;}
