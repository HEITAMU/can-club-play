import {CATS,ownsCompanion,MAX_PARTY,inheritanceFor} from './core.mjs?v=0.25.0';
import {catSVG,icon,setPose} from './art.mjs?v=0.25.0';
const name=id=>CATS.find(c=>c.id===id)?.name||'伙伴';
export const FORMATION_SLOTS=[[69,42],[69,75],[31,29],[31,56],[31,83]];
export function crewFormationHTML(state){
 return '<section class="crew-formation" aria-label="拖动调整阵容"><div class="formation-heading"><h3>'+icon('can',22)+'出战阵容 <small>'+state.party.filter(Boolean).length+' / '+MAX_PARTY+'</small></h3><span>面向敌人 →</span></div><div class="formation-board"><span class="formation-column back">后排</span><span class="formation-column front">前排</span>'+FORMATION_SLOTS.map(([x,y],i)=>{
  const id=state.party[i];
  return '<button class="formation-slot'+(id?'':' is-empty')+'" data-formation-slot="'+i+'" '+(id?'data-drag-cat="'+id+'"':'')+' style="left:'+x+'%;top:'+y+'%" aria-label="'+(i<2?'前排 '+(i+1):'后排 '+(i-1))+'，'+(id?name(id)+'，可拖动换位':'空位，可拖入伙伴')+'"><span class="formation-slot-art">'+(id?catSVG(id):'<i>＋</i>')+'</span>'+(id?'<b>'+name(id)+'</b>':'')+'</button>';
 }).join('')+'</div><div class="formation-bench-zone" data-formation-bench><div class="formation-bench-heading"><b>伙伴</b><button class="formation-dismiss" aria-label="将选中伙伴下场">↓ 下拖下场</button></div><div class="formation-bench">'+CATS.filter(c=>ownsCompanion(state,c.id)).map(c=>'<button class="formation-bench-pick'+(state.party.includes(c.id)?' is-deployed':'')+'" data-drag-cat="'+c.id+'" aria-label="'+c.name+'，拖动上阵" aria-pressed="false"><span class="formation-card-art">'+catSVG(c.id,true)+'</span>'+(state.party.includes(c.id)?'<i>出战</i>':'')+'</button>').join('')+'</div></div><p class="formation-hint" role="status" aria-live="polite">拖动换位 · 下拖下场</p></section>';
}
export function formationDropText(state,id,slot){
 const transfer=inheritanceFor(state,slot,id),old=state.party[slot];
 return transfer?name(id)+'继承 Lv.'+transfer.fromLevel+' · '+name(old)+'转为 Lv.'+transfer.toLevel:state.party.includes(id)?name(id)+(old?'与'+name(old)+'交换站位':'移动到空位'):name(id)+(old?'替换'+name(old):'上阵');
}
// Each half of the courtyard has generous contiguous landing zones; a finger
// need not hit the small sprite. The board and bench never overlap as targets.
export function formationTarget(x,y,board,bench,fromBoard=false){
 if(fromBoard&&y>=bench.top-6&&x>=bench.left-20&&x<=bench.right+20)return 'bench';
 if(x<board.left-18||x>board.right+18||y<board.top-16||y>board.bottom+8)return null;
 const nx=(x-board.left)/board.width*100,ny=(y-board.top)/board.height*100;
 let best=null,distance=Infinity;
 FORMATION_SLOTS.forEach(([sx,sy],i)=>{const d=(nx-sx)**2+(ny-sy)**2;if(d<distance){distance=d;best=i;}});
 return best;
}
export function bindFormationDrag(root,{scrollElement,onDrop,onRemove,describe}){
 const hint=root.querySelector('.formation-hint'),defaultHint=hint.textContent,board=root.querySelector('.formation-board'),bench=root.querySelector('[data-formation-bench]'),slots=[...root.querySelectorAll('[data-formation-slot]')];
 let selected=null,drag=null,ghost=null,frame=0,suppressUntil=0,lastTarget=null;
 const setHint=text=>{if(hint.textContent!==text)hint.textContent=text;};
 function highlight(){for(const b of root.querySelectorAll('[data-drag-cat]')){b.classList.toggle('is-selected',b.dataset.dragCat===selected);b.setAttribute('aria-pressed',String(b.dataset.dragCat===selected));}}
 const targetAt=(x,y)=>formationTarget(x,y,board.getBoundingClientRect(),bench.getBoundingClientRect(),drag?.fromBoard);
 function preview(){
  if(!drag?.active)return;const target=targetAt(drag.x,drag.y);
  if(target===lastTarget)return;lastTarget=target;
  for(const slot of slots)slot.classList.toggle('is-drop-target',+slot.dataset.formationSlot===target);
  bench.classList.toggle('is-drop-target',target==='bench');
  setHint(target==='bench'?'松手下场':typeof target==='number'?describe(drag.id,target):defaultHint);
 }
 function animate(){
  if(!drag?.active)return;
  const sprite=ghost.querySelector('.companion-body');
  if(sprite&&!sprite.classList.contains('rig-ready'))setPose(sprite,0,{time:0,renderSize:sprite.getBoundingClientRect().width});
  // Moving the ghost is one compositor transform per frame; never re-render the
  // dragged character or let the portrait's idle canvas erase the drag image.
  ghost.style.transform=`translate3d(${drag.x-drag.grabX}px,${drag.y-drag.grabY}px,0)`;
  const bounds=scrollElement.getBoundingClientRect();
  if(drag.y<bounds.top+24)scrollElement.scrollTop-=6;
  else if(drag.y>bounds.bottom-20)scrollElement.scrollTop+=6;
  preview();frame=requestAnimationFrame(animate);
 }
 function clear(){
  cancelAnimationFrame(frame);ghost?.remove();ghost=null;
  root.classList.remove('is-dragging');root.querySelectorAll('.is-drag-source').forEach(n=>n.classList.remove('is-drag-source'));
  for(const slot of slots)slot.classList.remove('is-drop-target');bench.classList.remove('is-drop-target');
  const pointer=drag?.pointer,source=drag?.source;drag=null;lastTarget=null;if(pointer!==undefined&&source?.hasPointerCapture?.(pointer))source.releasePointerCapture(pointer);
  setHint(defaultHint);
 }
 function down(e){
  if(e.button!==0||drag||e.isPrimary===false)return;
  const source=e.target.closest('[data-drag-cat]');if(!source||!root.contains(source)||source.disabled)return;
  drag={id:source.dataset.dragCat,source,fromBoard:source.hasAttribute('data-formation-slot'),pointer:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,active:false};
  const art=source.querySelector('.formation-slot-art,.formation-card-art'),rect=art.getBoundingClientRect();
  drag.grabX=drag.fromBoard?e.clientX-rect.left:41;drag.grabY=drag.fromBoard?e.clientY-rect.top+5:41;
  source.setPointerCapture(e.pointerId);
 }
 function move(e){
  if(!drag||e.pointerId!==drag.pointer)return;
  drag.x=e.clientX;drag.y=e.clientY;
  if(!drag.active&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<5)return;
  e.preventDefault();
  if(!drag.active){
   drag.active=true;selected=null;highlight();root.classList.add('is-dragging');
   ghost=document.createElement('div');ghost.className='formation-ghost';ghost.setAttribute('aria-hidden','true');
   const art=drag.source.querySelector('.formation-slot-art,.formation-card-art');
   if(drag.fromBoard){
    ghost.append(art.cloneNode(true));
    const originals=art.querySelectorAll('canvas');ghost.querySelectorAll('canvas').forEach((canvas,i)=>{canvas.width=originals[i].width;canvas.height=originals[i].height;canvas.getContext('2d').drawImage(originals[i],0,0);});
   }else ghost.innerHTML='<span class="formation-slot-art">'+catSVG(drag.id)+'</span>';
   document.body.append(ghost);
   if(!drag.fromBoard)setPose(ghost.querySelector('.companion-body'),0,{time:0,renderSize:ghost.querySelector('.companion-body').getBoundingClientRect().width});
   root.querySelectorAll('[data-drag-cat="'+drag.id+'"]').forEach(n=>n.classList.add('is-drag-source'));animate();
  }
 }
 function up(e){
  if(!drag||e.pointerId!==drag.pointer)return;
  const {id,active}=drag,target=active?targetAt(e.clientX,e.clientY):null;clear();
  if(active){e.preventDefault();suppressUntil=performance.now()+400;if(target==='bench')onRemove(id);else if(typeof target==='number')onDrop(id,target);}
 }
 function click(e){
  if(performance.now()<suppressUntil){e.preventDefault();e.stopPropagation();return;}
  if(e.target.closest('.formation-dismiss')){if(selected){const id=selected;selected=null;highlight();onRemove(id);}return;}
  const slot=e.target.closest('[data-formation-slot]'),source=e.target.closest('[data-drag-cat]');
  if(slot&&selected){const id=selected;selected=null;highlight();onDrop(id,+slot.dataset.formationSlot);return;}
  if(source){selected=selected===source.dataset.dragCat?null:source.dataset.dragCat;highlight();setHint(selected?'已选 '+name(selected)+' · 点击站位或下场':defaultHint);}
 }
 function cancel(){clear();selected=null;highlight();}
 function key(e){if(e.key==='Escape')cancel();}
 root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move,{passive:false});root.addEventListener('pointerup',up);root.addEventListener('pointercancel',cancel);root.addEventListener('click',click);document.addEventListener('keydown',key);
 return ()=>{cancel();root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',cancel);root.removeEventListener('click',click);document.removeEventListener('keydown',key);};
}
