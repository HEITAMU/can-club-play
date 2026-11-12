import {CATS,Battle,initialState} from './core.mjs?v=0.17.1';
import {actorArt,setPose,sceneSVG} from './art.mjs?v=0.17.1';
import {poseFor,battleRate,travelOffset,MotionOffsets,actionTiming} from './motion.mjs?v=0.17.1';
import {BattleCues,formationPositions} from './battle-cues.mjs?v=0.17.1';
import {CombatEffects,GuardEffects,StatusEffects} from './painted-fx.mjs?v=0.17.1';
const $=s=>document.querySelector(s),cues=new BattleCues(),fx=new CombatEffects($('#combat-effects')),guards=new GuardEffects(),statuses=new StatusEffects(),offsets=new MotionOffsets();
const modes=[...CATS.map(c=>[c.id,c.skill]),['boss','首领群攻'],['can','开罐啦']];
$('#skills').innerHTML=modes.map(([id,label])=>`<button data-demo="${id}" aria-pressed="${id==='orange'}">${label}</button>`).join('');
$('#scene').innerHTML=sceneSVG(0);
let mode='orange',battle,refs=new Map(),base={},centers={},sizes={},last=0,elapsed=0,started=false,paused=false,rate=1,full=true,width=600,height=360,size=72;
new ResizeObserver(entries=>{width=entries[0].contentRect.width;height=entries[0].contentRect.height;size=width<500?58:72;$('#arena').style.setProperty('--unit-size',size+'px');}).observe($('#arena'));
function restart(id=mode){mode=id;cues.clear();fx.clear();guards.clear();statuses.clear();offsets.clear();elapsed=0;started=false;refs.clear();const s=initialState(),caster=CATS.some(c=>c.id===id)?id:'orange';s.highest=120;s.party=[caster,...['orange','milk','star','ink','pudding'].filter(c=>c!==caster).slice(0,full?4:2)];for(const c of CATS)s.levels[c.id]=8;
 battle=new Battle(s,{stage:20});battle.enemies=battle.enemies.slice(0,full?5:1);for(const a of battle.enemies){a.hp=a.maxHp=99999;a.wait=99;a.skillWait=99;}for(const a of battle.heroes){a.hp=Math.floor(a.maxHp*.48);a.wait=99;a.energy=0;}const enemy=battle.enemies[0];enemy.hp=enemy.maxHp=99999;enemy.atk=70;enemy.interval=.9;enemy.wait=2;enemy.skillWait=99;
 base=full?formationPositions(battle):{p0:{x:33,y:74},p1:{x:15,y:48},p2:{x:15,y:91},e0:{x:80,y:70}};
 $('#actors').innerHTML=[...battle.enemies,...battle.heroes].map(a=>`<div id="actor-${a.id}" class="actor ${a.side==='e'?'enemy':''} ${a.boss?'boss':''}" style="left:${base[a.id].x}%;top:${base[a.id].y}%"><div class="nameplate">${a.name.split(' · ')[0]}</div><div class="hp-track"><div class="hp-fill"></div><div class="shield-fill"></div></div><span class="ground-shadow"></span><div class="actor-body">${actorArt(a)}</div></div>`).join('');
 for(const a of [...battle.heroes,...battle.enemies]){const el=$('#actor-'+a.id);refs.set(a.id,{el,body:el.querySelector('.actor-body')});}
 document.querySelectorAll('[data-demo]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demo===id)));$('#demo-readout').textContent=modes.find(x=>x[0]===id)[1]+' · 准备施放';
}
$('#crowd').onchange=e=>{full=e.target.value==='full';restart();showPhase($('#phase').value);};$('#rate').onchange=e=>rate=+e.target.value;$('#replay').onclick=()=>{restart();showPhase($('#phase').value);};
document.querySelectorAll('[data-demo]').forEach(b=>b.onclick=()=>{restart(b.dataset.demo);showPhase($('#phase').value);});$('#pause').onclick=e=>{paused=!paused;if(!paused)$('#phase').value='play';e.currentTarget.textContent=paused?'继续播放':'暂停';};
$('#phase').onchange=e=>showPhase(e.target.value);
function showPhase(phase){if(phase==='play'){paused=false;$('#pause').textContent='暂停';return;}restart();const timing=actionTiming(battle.heroes[0],'skill'),end=phase==='later'?3.46:mode==='can'?.67:mode==='boss'?(phase==='impact'?2.66:1.7):.55+(phase==='windup'?timing.windup*.8:phase==='flight'?timing.windup+timing.travel*.60:timing.impactAt+.13);render();while(elapsed<end){step(Math.min(1/60,end-elapsed));render();}paused=true;$('#pause').textContent='继续播放';}
function render(){const time=battle.time;for(const a of [...battle.heroes,...battle.enemies]){const {el,body}=refs.get(a.id),pose=poseFor(a,time),target=battle.targetFor(a,a.action?.kind||'normal'),n=size*(a.boss?1.12:1);sizes[a.id]=n;el.style.setProperty('--actor-size',n+'px');setPose(body,pose.frame,{actor:a,time,idleTime:time});const desired=travelOffset(a,pose,base[a.id],base[target?.id],width,height,n,size,time),p=offsets.value(a,desired,time);body.style.transform=`translate(${p.x}px,${p.y}px) scaleX(${a.side==='e'?-1:1})`;el.querySelector('.ground-shadow').style.transform=`translate(calc(-50% + ${p.x}px),${p.y}px)`;el.dataset.phase=pose.phase;centers[a.id]={x:base[a.id].x+p.x/width*100,y:base[a.id].y-n*.43/height*100+p.y/height*100};el.querySelector('.hp-fill').style.width=a.hp/a.maxHp*100+'%';el.querySelector('.shield-fill').style.width=Math.min(100,a.shield/a.maxHp*100)+'%';el.setAttribute('aria-label',a.name+'，生命'+Math.round(a.hp)+'，护盾'+Math.round(a.shield));}
 guards.render([...battle.heroes,...battle.enemies],time,centers,sizes,fx);statuses.render([...battle.heroes,...battle.enemies],time,centers,sizes,fx);fx.render(cues.active(time),time,width,height,centers,sizes);
}
function step(dt){elapsed+=dt;
 if(!started&&elapsed>.55){started=true;if(mode==='can'){battle.openCan();fx.emit('rescue',{x:50,y:83},battle.time,width*.42,.72);}else if(mode==='boss'){battle.enemies[0].charge=2;battle.emit('charge',battle.enemies[0],battle.enemies[0],0,{text:'正在蓄力'});}else battle.beginAction(battle.heroes[0],'skill');}
 const events=battle.events.splice(0);events.push(...battle.tick(dt));cues.consume(events,battle,centers);const skill=events.find(e=>e.type==='skill');if(skill)$('#demo-readout').textContent=skill.text+' · 已施放';const heal=events.filter(e=>e.type==='heal').reduce((n,e)=>n+e.value,0);if(heal>0)$('#demo-readout').textContent='治疗生效 · 回复 '+Math.round(heal)+' 点生命';if(events.some(e=>e.type==='shield'))$('#demo-readout').textContent='护盾已生成 · 敌人接下来会攻击护盾';if(events.some(e=>e.type==='burst'))$('#demo-readout').textContent='首领群攻 · 全队受击';if(events.some(e=>e.type==='interrupt'))$('#demo-readout').textContent='蓄力已打断';
 if(elapsed>7.4)restart();}
function frame(now){const dt=last?Math.min(.08,(now-last)/1000)*battleRate(1)*rate:0;last=now;if(!paused&&!document.hidden)step(dt);
 render();requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange',()=>last=0);restart();render();requestAnimationFrame(frame);
