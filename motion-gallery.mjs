import {idleLabel} from './idle-motion.mjs?v=0.21.7';
import {CATS} from './core.mjs?v=0.21.7';
import {actorArt,setPose} from './art.mjs?v=0.21.7';
import {actionTiming,poseFor,battleRate} from './motion.mjs?v=0.21.7';
const types=['dust','box','mop','battery','bag','drone','vacuum','fridge','sign','boxBoss','clock','vendor'],names=['灰尘团','纸箱怪','拖把怪','电池怪','纸袋怪','小无人机','吸尘器首领','冰柜首领','招牌首领','纸箱首领','闹钟首领','售货机首领'];
const actors=[...CATS.map((c,i)=>({id:'p'+i,side:'p',catId:c.id,name:c.name,desc:c.skill,hp:1})),...types.map((type,i)=>({id:'e'+i,side:'e',type,boss:i>5,name:names[i],desc:i>5?'蓄力 · 重击':'准备 · 出手',hp:1}))];
for(const a of actors){const card=document.createElement('article');card.className='card';card.innerHTML=`<div class="sprite" id="${a.id}">${actorArt(a)}</div><b>${a.name}</b><small class="motion-caption">${a.side==='p'?'抬手 · 挥出 · 收回':'准备 · 出手'}</small>`;document.querySelector(a.side==='p'?'#crew':'#foes').appendChild(card);a.element=document.getElementById(a.id);}
let kind='normal',paused=false,time=0,last=0,preview;
document.querySelector('#face-preview').onchange=e=>{preview=e.target.value||undefined;};
const status=document.querySelector('#motion-status');
document.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{kind=b.dataset.kind;time=0;for(const a of actors)a.element.parentElement.querySelector('.motion-caption').textContent=kind==='idle'?(a.side==='p'?idleLabel(a.catId):'安静呼吸'):kind==='charge'?'蓄力 · 释放 · 归位':kind==='down'?'受击 · 缓缓退场':kind==='normal'?'抬手 · 挥出 · 收回':a.desc;document.querySelectorAll('[data-kind]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));});
document.querySelector('#pause').onclick=e=>{paused=!paused;e.currentTarget.textContent=paused?'继续播放':'暂停';status.textContent=paused?'已暂停':'连续播放中';};
function draw(now){
 const elapsed=last?(now-last)/1000:0,dt=Math.min(.1,elapsed);last=now;
 if(!paused&&!document.hidden)time+=dt*(kind==='idle'?1:battleRate(1));
 for(const a of actors){
  const cycle=time%3.1;a.action=null;a.hitUntil=0;a.charge=0;a.burstUntil=0;a.hp=1;
  if(['normal','skill'].includes(kind)){const timing=actionTiming(a,kind);if(cycle<timing.duration)a.action={kind,elapsed:cycle,...timing};}
  if(kind==='hit'&&cycle<.22)a.hitUntil=time-cycle+.22;
  if(kind==='charge'){if(cycle<2)a.charge=2-cycle;else if(cycle<2.38)a.burstUntil=time-cycle+2.38;}
  if(kind==='down'&&cycle<2.5){a.hp=0;a.downAt=time-cycle;}
  const pose=poseFor(a,time);setPose(a.element,pose.frame,{actor:a,time,idleTime:time,preview:a.side==='p'?preview:undefined});a.element.dataset.phase=pose.phase;
 }
 requestAnimationFrame(draw);
}
document.addEventListener('visibilitychange',()=>{last=0;});requestAnimationFrame(draw);
