import {CATS,MAX_PARTY,inheritanceFor} from './core.mjs?v=0.21.14';
import {catSVG} from './art.mjs?v=0.21.14';
import {crewUpgradeHTML} from './crew-profile.mjs?v=0.21.14';

const name=id=>CATS.find(c=>c.id===id)?.name||'伙伴';
const slots=[[71,36],[71,72],[27,23],[27,54],[27,85]];
export function crewFormationHTML(state){
 return '<section class="crew-formation" aria-label="拖动调整阵容"><div class="formation-heading"><h3>出战阵容 <small>'+state.party.length+' / '+MAX_PARTY+'</small></h3><span>面向敌人 →</span></div><div class="formation-board"><span class="formation-column back">后排</span><span class="formation-column front">前排</span>'+slots.map(([x,y],i)=>{
  const id=state.party[i],available=i<=state.party.length;
  return '<button class="formation-slot'+(id?'':' is-empty')+'" data-formation-slot="'+i+'" '+(id?'data-drag-cat="'+id+'"':'')+' '+(!available?'disabled':'')+' style="left:'+x+'%;top:'+y+'%" aria-label="'+(i<2?'前排 '+(i+1):'后排 '+(i-1))+'，'+(id?name(id)+'，可拖动换位':available?'空位，可拖入伙伴':'待上阵')+'"><span class="formation-slot-art">'+(id?catSVG(id,true):'<i>＋</i>')+'</span><b>'+ (id?name(id):'空位')+'</b><small>'+(id?'Lv.'+state.levels[id]:available?'拖入伙伴':'—')+'</small></button>';
 }).join('')+'</div><p class="formation-hint" role="status" aria-live="polite">拖动换位 · 替换伙伴自动继承培养</p><div class="formation-heading bench-heading"><h3>所有伙伴</h3><span>点击下方按钮升级</span></div><div class="formation-bench">'+CATS.map(c=>{
  const open=state.highest>=c.unlock;
  return '<article class="formation-card'+(open?'':' is-locked')+'"><button class="formation-bench-pick" '+(open?'data-drag-cat="'+c.id+'"':'disabled')+' aria-label="'+c.name+(open?'，拖动上阵':'，第 '+c.unlock+' 关结识')+'" aria-pressed="false"><span class="formation-card-art">'+catSVG(c.id,true)+'</span><b>'+c.name+'</b><small>'+(open?'Lv.'+state.levels[c.id]:'第 '+c.unlock+' 关')+'</small>'+(state.party.includes(c.id)?'<i>出战</i>':'')+'</button>'+crewUpgradeHTML(state,c.id)+'</article>';
 }).join('')+'</div></section>';
}

export function formationDropText(state,id,slot){
 const transfer=inheritanceFor(state,slot,id),old=state.party[slot];
 return transfer?name(id)+'继承 Lv.'+transfer.fromLevel+' · '+name(old)+'转为 Lv.'+transfer.toLevel:state.party.includes(id)?name(id)+(old?'与'+name(old)+'交换站位':'移动到空位'):name(id)+(old?'替换'+name(old):'上阵');
}

// Pointer events work with a finger, mouse or pen; selecting then tapping a
// position is also available to keyboard and assistive-technology users.
export function bindFormationDrag(root,{scrollElement,onDrop,describe}){
 const hint=root.querySelector('.formation-hint'),defaultHint=hint.textContent;
 let selected=null,drag=null,ghost=null,frame=0,suppressUntil=0;
 const slots=[...root.querySelectorAll('[data-formation-slot]')];
 const setHint=text=>{if(hint.textContent!==text)hint.textContent=text;};
 function highlight(){for(const b of root.querySelectorAll('[data-drag-cat]')){b.classList.toggle('is-selected',b.dataset.dragCat===selected);b.setAttribute('aria-pressed',String(b.dataset.dragCat===selected));}}
 function targetAt(x,y){const slot=document.elementFromPoint(x,y)?.closest('[data-formation-slot]');return slot&&root.contains(slot)&&!slot.disabled?slot:null;}
 function preview(){
  if(!drag?.active)return;
  const target=targetAt(drag.x,drag.y);
  for(const slot of slots)slot.classList.toggle('is-drop-target',slot===target);
  setHint(target?describe(drag.id,+target.dataset.formationSlot):'拖到高亮站位后松手');
 }
 function animate(){
  if(!drag?.active)return;
  const bounds=scrollElement.getBoundingClientRect(),edge=42;
  const speed=drag.y<bounds.top+edge?-Math.min(12,(bounds.top+edge-drag.y)*.3):drag.y>bounds.bottom-edge?Math.min(12,(drag.y-bounds.bottom+edge)*.3):0;
  if(speed)scrollElement.scrollTop+=speed;
  preview();frame=requestAnimationFrame(animate);
 }
 function clear(){
  cancelAnimationFrame(frame);ghost?.remove();ghost=null;
  root.classList.remove('is-dragging');for(const slot of slots)slot.classList.remove('is-drop-target');
  if(drag&&drag.source.hasPointerCapture?.(drag.pointer))drag.source.releasePointerCapture(drag.pointer);
  drag=null;setHint(defaultHint);
 }
 function down(e){
  if(e.button!==0||drag||e.isPrimary===false)return;
  const source=e.target.closest('[data-drag-cat]');if(!source||!root.contains(source)||source.disabled)return;
  drag={id:source.dataset.dragCat,source,pointer:e.pointerId,startX:e.clientX,startY:e.clientY,x:e.clientX,y:e.clientY,active:false};
  source.setPointerCapture(e.pointerId);
 }
 function move(e){
  if(!drag||e.pointerId!==drag.pointer)return;
  drag.x=e.clientX;drag.y=e.clientY;
  if(!drag.active&&Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)<7)return;
  e.preventDefault();
  if(!drag.active){
   drag.active=true;selected=null;highlight();root.classList.add('is-dragging');
   ghost=document.createElement('div');ghost.className='formation-ghost';ghost.setAttribute('aria-hidden','true');
   ghost.innerHTML=drag.source.innerHTML;
   const originals=drag.source.querySelectorAll('canvas');ghost.querySelectorAll('canvas').forEach((canvas,i)=>canvas.getContext('2d').drawImage(originals[i],0,0));
   document.body.append(ghost);frame=requestAnimationFrame(animate);
  }
  ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';preview();
 }
 function up(e){
  if(!drag||e.pointerId!==drag.pointer)return;
  const id=drag.id,active=drag.active,target=active?targetAt(e.clientX,e.clientY):null;
  clear();
  if(active){e.preventDefault();suppressUntil=performance.now()+350;if(target)requestAnimationFrame(()=>onDrop(id,+target.dataset.formationSlot));}
 }
 function click(e){
  if(performance.now()<suppressUntil){e.preventDefault();e.stopPropagation();return;}
  const slot=e.target.closest('[data-formation-slot]'),source=e.target.closest('[data-drag-cat]');
  if(slot&&!slot.disabled&&selected){const id=selected;selected=null;highlight();onDrop(id,+slot.dataset.formationSlot);return;}
  if(source&&!source.disabled){selected=selected===source.dataset.dragCat?null:source.dataset.dragCat;highlight();setHint(selected?'已选 '+name(selected)+' · 点击站位上阵':defaultHint);}
 }
 function cancel(){clear();selected=null;highlight();}
 function key(e){if(e.key==='Escape')cancel();}
 root.addEventListener('pointerdown',down);root.addEventListener('pointermove',move,{passive:false});root.addEventListener('pointerup',up);root.addEventListener('pointercancel',cancel);root.addEventListener('click',click);document.addEventListener('keydown',key);
 return ()=>{cancel();root.removeEventListener('pointerdown',down);root.removeEventListener('pointermove',move);root.removeEventListener('pointerup',up);root.removeEventListener('pointercancel',cancel);root.removeEventListener('click',click);document.removeEventListener('keydown',key);};
}
