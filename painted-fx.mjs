import {projectilePose,unit} from './motion.mjs?v=0.14.1';
export const FX_CELLS={shield:0,break:1,heal:2,milk:3,fire:4,ice:5,electric:6,melee:7,sweep:7,fish:8,arrow:8,star:9,burst:10,dust:11,guard:12,heart:13,energy:14,block:15,flare:14};
export function fxArt(style,extra=''){const i=FX_CELLS[style]??10;return `<i class="painted-fx ${extra}" style="background-position:${i%4/3*100}% ${Math.floor(i/4)/3*100}%" aria-hidden="true"></i>`;}
export const impactStyle=r=>r.style==='shield'?(r.tone==='support'?'guard':'block'):r.style==='heal'?'heal':r.style==='star'&&r.tone==='energy'?'energy':r.style==='sweep'?'melee':['arrow','fish','milk'].includes(r.style)?'burst':r.style;
export function effectEnvelope(age,duration,fadeIn=.07,fadeOut=.22){return Math.min(unit(age/fadeIn),unit((duration-age)/fadeOut));}
export function shieldTransition(previous,next){return next>previous?'raise':next<previous?(next<=0?'break':'block'):'steady';}
export class CombatEffects{
 constructor(layer){this.layer=layer;this.nodes=new Map();this.bursts=[];}
 clear(){this.layer.replaceChildren();this.nodes.clear();this.bursts=[];}
 emit(style,point,time,size=52,duration=.65){const el=document.createElement('span');el.className='painted-burst';el.innerHTML=fxArt(style);this.layer.appendChild(el);this.bursts.push({el,style,point:{...point},born:time,size,duration});if(this.bursts.length>32)this.bursts.shift().el.remove();}
 create(r){const el=document.createElement('div');el.className='painted-cue';el.dataset.phase=r.phase;el.dataset.style=r.style;el.dataset.from=r.from;el.dataset.targets=r.targets.join(',');const style=r.style==='arrow'?'fish':r.style;
  let html='';if(r.phase==='windup'){
   if(r.kind==='skill'||style==='warning')html=`<span class="fx-origin">${fxArt(r.tone==='support'?'guard':r.tone==='energy'?'energy':style==='warning'?'fire':style)}</span>`;
   if(style==='warning')html+=r.targets.map(id=>`<span class="fx-warning" data-target="${id}">${fxArt('fire')}</span>`).join('');
  }else if(r.phase==='release'&&style!=='melee'&&style!=='warning'){
   for(const id of r.targets){if(id===r.from)continue;const count=r.kind==='skill'&&style==='fish'?3:1;for(let shot=0;shot<count;shot++)html+=`<span class="fx-projectile" data-target="${id}" data-shot="${shot}" data-count="${count}">${fxArt(style==='shield'?'guard':style==='heal'?'milk':style)}${fxArt(style==='heal'?'milk':style,'fx-trail')}</span>`;}
  }else if(r.phase==='impact'){
   const impact=impactStyle(r),support=['heal','guard','energy'].includes(impact);
   for(const id of r.targets)html+=`<span class="fx-impact ${support?'fx-support':''}" data-target="${id}">${fxArt(impact,'fx-main')}${fxArt(impact==='heal'?'heart':impact==='guard'?'shield':impact==='energy'?'star':impact==='ice'?'ice':impact==='fire'?'fire':impact==='melee'?'burst':'dust','fx-secondary')}${support?fxArt(impact==='heal'?'heart':'star','fx-mote'):''}</span>`;
  }
  el.innerHTML=html;this.layer.appendChild(el);const entry={el,r,origin:el.querySelector('.fx-origin'),warnings:[...el.querySelectorAll('.fx-warning')],projectiles:[...el.querySelectorAll('.fx-projectile')],impacts:[...el.querySelectorAll('.fx-impact')],until:r.until};this.nodes.set(r.id,entry);return entry;
 }
 render(routes,time,w,h,centers,sizes){
  const ids=new Set(routes.map(r=>r.id));for(const r of routes)if(!this.nodes.has(r.id))this.create(r);
  for(const [id,e] of this.nodes){const {r,el}=e;if(!ids.has(id)){e.until=Math.min(e.until,time+.09);if(!e.retired)e.retired=time;}
   if(time>=e.until||(e.retired&&time-e.retired>=.09)){el.remove();this.nodes.delete(id);continue;}
   const age=Math.max(0,time-r.born),duration=r.until-r.born,k=unit(age/duration),fade=e.retired?1-(time-e.retired)/.09:1;el.style.opacity=fade;
   const origin=r.positions[r.from]||centers[r.from];if(!origin)continue;
   if(e.origin){const size=(sizes[r.from]||50)*.7;e.origin.style.width=e.origin.style.height=size+'px';e.origin.style.left=origin.x+'%';e.origin.style.top=origin.y+'%';e.origin.style.opacity=effectEnvelope(age,duration,.10,.06)*.8;e.origin.style.transform=`translate(-50%,-50%) scale(${.5+.55*k}) rotate(${-18+35*k}deg)`;}
   for(const warning of e.warnings){const p=centers[warning.dataset.target]||r.positions[warning.dataset.target];if(!p)continue;warning.style.left=p.x+'%';warning.style.top=(p.y+9)+'%';warning.style.opacity=.18+Math.sin(k*Math.PI*3)**2*.18;warning.style.transform=`translate(-50%,-50%) scale(${.7+.35*k},.24)`;}
   for(const missile of e.projectiles){const to=centers[missile.dataset.target]||r.positions[missile.dataset.target];if(!to)continue;const dir=(r.positions[missile.dataset.target]||to).x>=origin.x?1:-1,from={x:origin.x+dir*(sizes[r.from]||50)*.23/w*100,y:origin.y-1};const flight=projectilePose(from,to,w,h,age,r.travel||.29,r.style,+missile.dataset.shot,+missile.dataset.count);const rot=['fish','arrow','electric'].includes(r.style)?flight.angle:r.style==='fire'?flight.angle+40:r.style==='heal'||r.style==='milk'?flight.angle+135:0;
    const size=r.style==='shield'?27:r.kind==='skill'?31:24;missile.style.width=missile.style.height=size+'px';missile.style.opacity=flight.visible?String(Math.min(1,flight.progress*12+.3)):'0';missile.style.transform=`translate(${flight.x}px,${flight.y}px) translate(-50%,-50%) rotate(${rot}deg) scale(${.85+Math.sin(flight.progress*Math.PI)*.18})`;
   }
   for(const impact of e.impacts){const id=impact.dataset.target,p=centers[id]||r.positions[id];if(!p)continue;const support=impact.classList.contains('fx-support'),limit=support?Math.min(duration,1.05):Math.min(duration,.55),progress=unit(age/limit),size=(sizes[id]||48)*(support?1.30:r.kind==='skill'?1.22:.84);
    impact.style.left=p.x+'%';impact.style.top=p.y+'%';impact.style.width=impact.style.height=size+'px';impact.style.opacity=effectEnvelope(age,limit,.035,support?.33:.24);impact.style.transform=`translate(-50%,-50%) translateY(${-progress*(support?10:3)}px)`;
    const main=impact.querySelector('.fx-main'),second=impact.querySelector('.fx-secondary'),mote=impact.querySelector('.fx-mote');main.style.transform=`scale(${support?.62+Math.sin(progress*Math.PI*.7)*.50:.62+Math.sin(progress*Math.PI*.6)*.43}) rotate(${support?-12+progress*28:-14+progress*22}deg)`;main.style.opacity=support?.82:1;
    second.style.transform=`translate(${support?13*progress:6*progress}px,${support?-12*progress:8*progress}px) scale(${.30+progress*.50}) rotate(${18-progress*42}deg)`;second.style.opacity=(1-progress)*.8;
    if(mote){mote.style.transform=`translate(${-13-progress*8}px,${10-progress*34}px) scale(${.26+progress*.12})`;mote.style.opacity=Math.sin(progress*Math.PI);}
   }
  }
  for(let i=this.bursts.length-1;i>=0;i--){const b=this.bursts[i],age=time-b.born,k=unit(age/b.duration);if(age>=b.duration){b.el.remove();this.bursts.splice(i,1);continue;}b.el.style.left=b.point.x+'%';b.el.style.top=b.point.y+'%';b.el.style.width=b.el.style.height=b.size+'px';b.el.style.opacity=effectEnvelope(age,b.duration,.025,.25);b.el.style.transform=`translate(-50%,-50%) scale(${.65+k*.55}) rotate(${-10+k*20}deg)`;}
 }
}
export class GuardEffects{
 constructor(){this.entries=new Map();}
 clear(){this.entries.clear();}
 render(actors,time,centers,sizes,combat){for(const a of actors){const root=document.getElementById('actor-'+a.id);if(!root)continue;let e=this.entries.get(a.id);if(!e){const shell=document.createElement('span');shell.className='painted-guard';shell.innerHTML=fxArt('shield','guard-back')+fxArt('shield','guard-front')+fxArt('guard','guard-sheen');root.querySelector('.actor-body').appendChild(shell);e={shell,value:0,at:time,hit:-99};this.entries.set(a.id,e);}
  const value=a.hp>0?a.shield:0,change=shieldTransition(e.value,value);if(change==='raise')e.at=time;if(change==='block'||change==='break'){e.hit=time;if(centers[a.id])combat.emit(change==='break'?'break':'block',centers[a.id],time,(sizes[a.id]||50)*1.2,change==='break'?.55:.34);}e.value=value;e.shell.hidden=value<=0;if(value<=0)continue;
  const grow=unit((time-e.at)/.25),pulse=Math.sin(time*2.5+a.id.length)*.018;e.shell.style.transform=`translate(-50%,-50%) scale(${.82+.18*(1-(1-grow)**3)+pulse})`;e.shell.style.opacity=String(Math.min(1,grow*2));e.shell.querySelector('.guard-front').style.opacity=String(.40+Math.max(0,1-(time-e.hit)/.24)*.35);e.shell.querySelector('.guard-sheen').style.transform=`rotate(${-12+Math.sin(time*1.8)*6}deg) scale(${.96+pulse})`;
 }}
}

// Persistent conditions use the same combat clock, so pause freezes their motion too.
export class StatusEffects{
 constructor(){this.entries=new Map();}
 clear(){this.entries.clear();}
 render(actors,time){for(const a of actors){const root=document.getElementById('actor-'+a.id);if(!root)continue;let e=this.entries.get(a.id);if(!e){const el=document.createElement('span');el.className='painted-status';el.innerHTML=`<span class="status-burn">${fxArt('fire')}${fxArt('fire')}</span><span class="status-stun">${fxArt('star')}${fxArt('star')}</span>`;root.querySelector('.actor-body').appendChild(el);e={el,burn:el.querySelector('.status-burn'),stun:el.querySelector('.status-stun'),burnAt:-99,stunAt:-99,burning:false,stunned:false};e.flames=[...e.burn.children];e.stars=[...e.stun.children];this.entries.set(a.id,e);}
  for(const [key,on] of [['burn',a.hp>0&&a.burnTime>0],['stun',a.hp>0&&a.stun>0]]){const state=key==='burn'?'burning':'stunned';if(e[state]!==on){e[state]=on;e[key+'At']=time;}const age=time-e[key+'At'],opacity=on?unit(age/.16):1-unit(age/.22);e[key].hidden=!on&&age>=.22;e[key].style.opacity=String(opacity);}
  for(let i=0;i<2;i++){const t=time*5+i*2.6;e.flames[i].style.transform=`translate(${i?8:-9}px,${Math.sin(t)*2}px) rotate(${Math.sin(t*.7)*8}deg) scale(${.94+Math.sin(t)*.08})`;const q=time*3+i*Math.PI;e.stars[i].style.transform=`translate(${Math.cos(q)*17}px,${Math.sin(q)*4}px) rotate(${time*65+i*55}deg)`;}
 }}
}
