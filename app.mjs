import {ActivityReturn,activityRoute} from './activity-navigation.mjs?v=0.25.1';
const activityReturn=new ActivityReturn();
import {rewardIcons} from './loot-icons.mjs?v=0.25.1';
import {CombatText} from './combat-text.mjs?v=0.25.1';
import {watchImageAssets} from './image-cache.mjs?v=0.25.1';
import {streetHubHTML,streetHTML,streetSelection} from './street-ui.mjs?v=0.25.0';
import {rewardText} from './activities.mjs?v=0.25.0';
import {inventoryHTML,crewEquipmentHTML,gearDetailHTML,craftHTML} from './inventory-ui.mjs?v=0.25.0';
import {GEAR_SLOTS,equipGear,unequipGear,enhanceGear,reforgeGear,dismantleGear,gearOwner,gearName,craftGear} from './equipment.mjs?v=0.25.0';
import {campaignHTML,weeklyHTML} from './campaign-ui.mjs?v=0.25.0';
import {claimDaily,claimDailyChest,claimJourney} from './campaign.mjs?v=0.25.0';
import {bindDistrictInput} from './district-input.mjs?v=0.25.0';
let disposeDistrict=null;
import {districtHTML,stallHTML,arenaHTML,paintDistrictAmbient,paintDistrictObjects} from './district.mjs?v=0.25.0';
import {CATS,RELICS,CHAPTERS,QUESTS,MAX_STAGE,MAX_LEVEL,MAX_PARTY,initialState,normalizeState,unlocked,ownsCompanion,recruitCompanion,ascendCompanion,inheritanceFor,inheritTraining,upgrade,upgradeCost,upgradeQuote,catStats,power,idleRate,accrueIdle,claimIdle,claimQuests,questValue,chooseRelic,setParty,chapterOf,Battle,settleBattle,encodeSave,decodeSave,rewardFor,upgradeStall,levelCap,breakthrough,breakthroughQuote,ARENA_MAX,arenaOpen,idleMinutes} from './core.mjs?v=0.25.0';
import {icon,catSVG,enemySVG,relicSVG,sceneSVG,actorArt,setPose} from './art.mjs?v=0.25.0';
import {poseFor,attackStyle,travelOffset,battleRate,MotionOffsets} from './motion.mjs?v=0.25.0';
import {HealthTrails,rescueView,bossView} from './battle-ui.mjs?v=0.25.0';
import {BattleCues,formationPositions,cueColors} from './battle-cues.mjs?v=0.25.0';
import {FormationMotion,retiringSize} from './formation-motion.mjs?v=0.25.0';
import {crewRosterHTML,crewProfileHTML,crewSkill} from './crew-profile.mjs?v=0.25.0';
const formationMotion=new FormationMotion();
let selectedCrew='orange',crewMode='profile',disposeFormation=null;
import {crewFormationHTML,bindFormationDrag,formationDropText} from './crew-formation.mjs?v=0.25.0';
import {CombatEffects,GuardEffects,StatusEffects} from './painted-fx.mjs?v=0.25.0';
const combatEffects=new CombatEffects(document.querySelector('#combat-effects')),guardEffects=new GuardEffects(),statusEffects=new StatusEffects(),motionOffsets=new MotionOffsets(),actorRefs=new Map();
const arenaMetrics={width:390,height:300,size:52};
const battleCues=new BattleCues();
let ambientTime=0,idleOffset=0,endElapsed=0,bossNotice=null;const healthTrails=new HealthTrails();const combatText=new CombatText(document.querySelector('#fx'));const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const $=q=>document.querySelector(q), $$=q=>[...document.querySelectorAll(q)],KEY='can-club-save-v1',BACKUP=KEY+'-backup';
let state,saveOK=true,recovery='',tab='battle',battle=null,running=false,farming=false,nextDelay=0,modalType=null,queue=[],lastStamp=0,renderStamp=0,idlePaintStamp=0,idleStamp=0,saveStamp=0,toastTimer,offlineNote=0,audioContext=null,swReady=false;
try{const stored=localStorage.getItem(KEY);if(stored){try{state=decodeSave(stored);}catch{const backup=localStorage.getItem(BACKUP);if(backup){state=decodeSave(backup);recovery='已恢复最近一份可用备份。';}else recovery='存档未能读取，已开启新远征。';}}}catch{saveOK=false;recovery='浏览器无法保存，请定期导出存档。';}
if(!state)state=initialState();offlineNote=Date.now()-state.lastAccrued;accrueIdle(state);
const fmt=n=>n>=1e8?Math.floor(n/1e8)+'亿':n>=1e4?Math.floor(n/1e4)+'万':Math.floor(n).toLocaleString('zh-CN');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cat=id=>CATS.find(c=>c.id===id),relic=id=>RELICS.find(r=>r.id===id);
function persist(){try{const data=encodeSave(state);const previous=localStorage.getItem(KEY);if(previous){try{decodeSave(previous);localStorage.setItem(BACKUP,previous);}catch{}}localStorage.setItem(KEY,data);saveOK=true;}catch{saveOK=false;}$('#save-warning').hidden=saveOK;}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600);}
function sound(kind){if(!state.sound)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();const notes=kind==='win'?[523,659,784]:kind==='coin'?[880,1175]:kind==='can'?[330,440,660]:kind==='skill'?[523,784]:[240];notes.forEach((freq,i)=>{const o=audioContext.createOscillator(),g=audioContext.createGain(),t=audioContext.currentTime+i*.065;o.type=kind==='hit'?'triangle':'sine';o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(kind==='hit'?.018:.045,t+.005);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.connect(g);g.connect(audioContext.destination);o.start(t);o.stop(t+.13);});}catch{}}
function renderHeader(){ $('#gold').textContent=fmt(state.gold);$('#bones').textContent=fmt(state.badges);$('#cats-count').textContent=unlocked(state).length+'/8';const ready=QUESTS.filter(q=>!state.claimed.includes(q.id)&&questValue(state,q)>=q.goal);$('#quest-dot').hidden=!ready.length;$('#power').textContent='战力 '+fmt(power(state));renderFishStall();$('#speed').textContent='×'+state.speed;
 const next=QUESTS.find(q=>!state.claimed.includes(q.id));$('#objective-text').textContent=ready.length?`${ready.length} 项成长奖励待领取 · +${fmt(ready.reduce((n,q)=>n+q.reward,0))} 鱼币`:next?`${next.desc} · ${Math.min(questValue(state,next),next.goal)}/${next.goal}`:'成长清单';
 updateUpgradeButtons();}
function renderParty(){ const party=$('#party');if(!party)return;party.innerHTML=Array.from({length:MAX_PARTY},(_,i)=>{const id=state.party[i];if(!id)return `<div class="party-card"><button class="party-empty" data-slot="${i}" aria-label="选择第 ${i+1} 位队员"><b>+</b><span>${unlocked(state).length>state.party.length?'点击上阵':'去做伙伴委托'}</span></button></div>`;const c=cat(id);return `<article class="party-card ${i<2?'front-card':''}"><button class="party-portrait" data-detail="${id}" aria-label="查看${c.name}与调整站位">${catSVG(id,true)}<span class="party-level" data-level="${id}">Lv.${state.levels[id]}</span></button><div class="party-meta"><b>${i+1} ${c.name}</b><span>${i<2?'前排 · 承伤':'后排 · '+c.tag}</span></div><button class="upgrade-btn" data-upgrade="${id}">${icon('coin',14)}<span></span></button></article>`;}).join('');
 $$('#party [data-detail]').forEach(b=>b.onclick=()=>showCat(b.dataset.detail));$$('#party [data-slot]').forEach(b=>b.onclick=()=>{$('#crew-collection')?.scrollIntoView({block:'start',behavior:'smooth'});toast('选择一只猫，再选择出战位置。');});$$('#party [data-upgrade]').forEach(b=>b.onclick=()=>train(b.dataset.upgrade));$('#party-count').textContent=state.party.length+'/5';updateUpgradeButtons();}
function updateUpgradeButtons(){ $$('[data-upgrade]').forEach(b=>{const id=b.dataset.upgrade,l=state.levels[id],quote=upgradeQuote(l,+(b.dataset.upgradeCount||1),levelCap(state,id)),open=ownsCompanion(state,id),quick=b.hasAttribute('data-upgrade-count');const label=!open?'未结识':!quote.levels?'已满级':quick?`${fmt(quote.cost)} 鱼币`:`升级 1 级 · ${fmt(quote.cost)}`;b.querySelector(':scope > span:last-child').textContent=label;if(quick)b.querySelector(':scope > small').textContent=quote.levels?'＋'+quote.levels+'级':'升级';b.disabled=!open||!quote.levels||state.gold<quote.cost;b.setAttribute('aria-label',!open?`${cat(id).name}尚未结识`:!quote.levels?`${cat(id).name}已满级`:`${cat(id).name}升${quote.levels}级，花费${quote.cost}鱼币`);});$$('[data-level]').forEach(n=>n.textContent='Lv.'+state.levels[n.dataset.level]);}
function train(id,count=1){const quote=upgradeQuote(state.levels[id],count,levelCap(state,id));if(state.gold<quote.cost){toast('本次升级需要 '+fmt(quote.cost)+' 鱼币。');return;}const n=upgrade(state,id,count);if(!n)return;battle?.syncStats(state);sound('coin');persist();renderHeader();if(tab==='cats')renderCats();if(modalType==='cat')showCat(id,true);else if(tab==='cats')$(`[data-upgrade="${id}"]`)?.focus({preventScroll:true});toast(`${cat(id).name} Lv.${state.levels[id]}${n>1?' · 连升 '+n+' 级':state.levels[id]===5?' · 被动能力觉醒！':' · 变强了！'}`);}
function renderStageHeader(){
 const stage=battle?.stage||state.stage,q=battle?.activity,ci=Math.floor((stage-1)/20),c=CHAPTERS[ci%6];
 $('#chapter-kicker').textContent=q?(q.kind==='hard'?'街区硬仗 · 机制挑战':q.kind==='hunt'?'深夜追猎':'猫巷委托'):`CHAPTER ${ci+1} / ${MAX_STAGE/20}`;
 $('#chapter-name').textContent=q?q.name:battle?.weekly?'本周挑战':battle?.mode==='arena'?'街头擂台':c.name;
 $('#stage-number').textContent=q?q.tier:stage;$('#stage-prefix').textContent=q?(q.kind==='hunt'?'危险':'难度'):'第';$('#stage-unit').textContent=q?'档':'关';
 $('#stage-map').setAttribute('aria-label',q?'返回当前委托':'查看街区关卡');
 $('#scene-caption').textContent='';
 $('#chapter-track').hidden=!!q;$('#chapter-track').innerHTML=q?'':Array.from({length:20},(_,i)=>{const k=ci*20+i+1;return `<span class="${k<=state.runCleared?'done':k===stage?'now':''} ${k%5===0?'boss':''}"></span>`;}).join('');
 $('#scene').innerHTML=sceneSVG(q?.scene??ci%6);$('#battle-label').textContent=q?q.name+' · '+(q.kind==='hunt'?'危险 ':'难度 ')+q.tier:battle?.weekly?`${battle.weekly.name} · 第 ${battle.weekly.tier} 档`:battle?.mode==='arena'?`第 ${battle.arenaTier} 擂 · ${battle.arenaRule.name}`:farming?'旧关练习 · 鱼币 ×60%':stage%20===0?'街区首领':stage%5===0?'首领出没':`街区巡逻 · ${battle?.enemies.length||1} 名对手`;
}
// Flat side-on composition: the leading hero is nearest the enemy column.
function sizeActors(){const arena=$('#arena');if(!arena.clientWidth||!arena.clientHeight)return;arenaMetrics.width=arena.clientWidth;arenaMetrics.height=arena.clientHeight;arenaMetrics.size=Math.max(32,Math.min(58,arenaMetrics.height*.18,arenaMetrics.width*.145));const size=arenaMetrics.size.toFixed(1)+'px';if(arena.style.getPropertyValue('--unit-size')!==size)arena.style.setProperty('--unit-size',size);}
new ResizeObserver(sizeActors).observe($('#arena'));
const bodySize=(a,time=battle.time+endElapsed)=>retiringSize(arenaMetrics.size*(a.boss?1.3:a.catId==='pudding'?1.22:1),a,time);
function positions(b){const p=formationMotion.update(b,b.time+endElapsed);for(const a of [...b.heroes,...b.enemies]){const offset=motionOffsets.points.get(a.id)||{x:0,y:0};p[a.id]={x:p[a.id].x+offset.x/arenaMetrics.width*100,y:p[a.id].y-bodySize(a)*.43/arenaMetrics.height*100+offset.y/arenaMetrics.height*100};}return p;}

function renderActors(){if(!battle)return;$('#battle-message').classList.remove('has-actions');endElapsed=0;formationMotion.clear();motionOffsets.clear();guardEffects.clear();statusEffects.clear();combatEffects.clear();actorRefs.clear();bossNotice=null;healthTrails.clear();battleCues.clear();$('#arena').dataset.partyCount=battle.heroes.length;$('#arena').dataset.enemyCount=battle.enemies.length;sizeActors();clearEffects();const ps=formationPositions(battle);$('#actors').innerHTML=[...battle.enemies,...battle.heroes].map(a=>`<div id="actor-${a.id}" class="actor ${a.side==='e'?'enemy':''} ${a.boss?'boss':''}" style="left:${ps[a.id].x}%;top:${ps[a.id].y}%"><div class="hp-track"><div class="hp-trail" style="width:100%"></div><div class="hp-fill" style="width:100%"></div><div class="shield-fill"></div></div>${a.side==='p'?'<div class="energy-track"><div class="energy-fill"></div></div>':''}<span class="ground-shadow" aria-hidden="true"></span><div class="actor-body">${actorArt(a)}</div>${a.side==='e'?'<span class="target-mark"></span>':''}<span class="action-tag" hidden></span><span class="actor-tag" hidden></span>${a.boss?'<div class="charge-track" hidden><div class="charge-fill"></div></div>':''}</div>`).join('');for(const a of [...battle.heroes,...battle.enemies]){const el=$('#actor-'+a.id);actorRefs.set(a.id,{el,body:el.querySelector('.actor-body'),trail:el.querySelector('.hp-trail'),shadow:el.querySelector('.ground-shadow')});}renderVitals();}
function renderVitals(){if(!battle)return;const formation=formationMotion.update(battle,battle.time+endElapsed),front=battle.frontlines();for(const a of [...battle.heroes,...battle.enemies]){const el=$('#actor-'+a.id);if(!el)continue;el.classList.toggle('frontline',front.includes(a));const targetMark=el.querySelector('.target-mark');if(targetMark){targetMark.hidden=a.hp<=0||!!battle.result||!a.charge;targetMark.textContent='蓄力：攻击全队';targetMark.classList.toggle('charging',a.charge>0);}el.classList.toggle('dead',a.hp<=0);el.classList.toggle('downed',a.side==='p'&&a.hp<=0);el.classList.toggle('stunned',a.stun>0&&a.hp>0);el.querySelector('.hp-fill').style.width=Math.max(0,a.hp/a.maxHp*100)+'%';el.querySelector('.shield-fill').style.width=Math.min(100,a.shield/a.maxHp*100)+'%';el.setAttribute('aria-label',`${a.name}，生命${Math.ceil(a.hp)}/${a.maxHp}${a.shield>0?'，护盾'+Math.ceil(a.shield):''}`);const energy=el.querySelector('.energy-fill');if(energy)energy.style.width=a.energy+'%';const badge=el.querySelector('.actor-tag');const tag=a.hp<=0?(a.side==='p'?'无法战斗':'已击败'):a.stun>0?'眩晕':a.burnTime>0?'灼烧':a.side==='e'&&a.armor>=40?'高护甲':a.side==='e'&&a.magicResist>=40?'高魔抗':'';badge.hidden=!tag;badge.textContent=tag;if(a.boss){el.querySelector('.charge-track').hidden=!(a.charge>0&&a.hp>0);el.querySelector('.charge-fill').style.width=(1-a.charge/2)*100+'%';}}
 const can=rescueView(battle,running);
 $('#battle-time').textContent=battle.result?(battle.result==='win'?'本场胜利':'暂时退回'):!running?(battle.time===0?'准备出发':'已暂停'):`第 ${battle.round||1} 回合`;
 const button=$('#open-can');button.disabled=!can.ready;button.classList.toggle('cooldown',can.seconds>0);button.classList.toggle('ready',can.ready);button.classList.toggle('interrupt-ready',can.ready&&can.charged);
 $('#can-label').textContent='开罐啦';$('#can-status').textContent=can.status;$('#can-progress').style.width=can.progress*100+'%';
 $('#can-sub').textContent=can.charged?'打断':'回血';
 renderBossHUD();$('#rescue-tip').hidden=state.rescueSeen;updateStart();}
function renderBossHUD(){
 const info=bossView(battle),hud=$('#boss-hud');hud.hidden=!info;$('#arena').classList.toggle('has-boss',!!info);if(!info)return;
 const interrupted=bossNotice&&battle.time<bossNotice.until&&info.hp>0&&!battle.result;
 hud.dataset.state=info.hp<=0?'defeated':info.charging?'charging':interrupted?'interrupted':'ready';
 $('#boss-name').textContent=info.name;$('#boss-health').textContent=`${info.hp} / ${Math.ceil(info.maxHp)}`;$('#boss-health-fill').style.width=info.ratio*100+'%';
 $('#boss-charge-fill').style.width=info.charge*100+'%';$('#boss-countdown').textContent=info.charging?Math.ceil(info.seconds)+'秒':'';
 const label=info.hp<=0?'首领已击败':info.charging?'全队攻击即将落下':interrupted?'打断成功 · 全队避开群攻':'蓄力';
 const warning=$('#boss-warning');if(warning.textContent!==label)warning.textContent=label;
}

function updateStart(){const btn=$('#battle-start');btn.classList.toggle('active',running&&!battle?.result);btn.textContent=battle?.activity&&battle.result?'再战本次委托':battle?.mode==='arena'&&battle.result?'再战本擂':state.pending?'挑选战利品':state.runCleared===MAX_STAGE&&!farming&&!battle?.activity&&battle?.mode!=='arena'?'远征完成':battle?.result==='lose'?'再试一次':battle?.result==='win'?(farming?'再练一场':'下一关'):running?'暂停战斗':battle?.time===0?'出发巡逻':'继续出发';}
function previewBattle(){battle=new Battle(state);idleOffset=ambientTime;renderStageHeader();renderActors();$('#battle-time').textContent='准备出发';$('#battle-message').innerHTML='';$('#battle-start').textContent='出发巡逻';$('#open-can').disabled=true;}
function startBattle({farm=false,stage,arenaTier=0,weeklyTier=0,activity=null}={}){activityReturn.cancel();if(state.pending){showLoot();return}if(state.runCleared===MAX_STAGE&&!farm&&!arenaTier&&!weeklyTier&&!activity){showVictory();return}farming=farm;const selected=stage||(farm?Math.max(1,state.runCleared-1):state.stage);battle=new Battle(state,{stage:selected,farm,arenaTier,weeklyTier,activity});idleOffset=ambientTime;running=true;nextDelay=0;$('#battle-message').innerHTML='';$('#fx').innerHTML='';combatEffects.warm(battle);renderStageHeader();renderActors();renderHeader();}
function pauseOrStart(){if(state.pending){showLoot();return}if(!battle||battle.result){startBattle({farm:farming,arenaTier:battle?.arenaTier||0,weeklyTier:battle?.weekly?.tier||0,activity:battle?.activity?.request||null});return}running=!running;if(running)combatEffects.warm(battle);$('#battle-message').innerHTML='';renderVitals();}
function useCan(){if(!running||modalType||tab!=='battle'||!battle||battle.result)return;if(battle.openCan()){if(!state.rescueSeen){state.rescueSeen=true;persist();}sound('can');playEvents(battle.events.splice(0));renderVitals();}}
function clearEffects(){combatText.clear();$('#fx').replaceChildren();}
function renderMotion(){if(!battle||document.hidden||tab!=='battle'||modalType)return;const ground=formationMotion.update(battle,battle.time+endElapsed),w=arenaMetrics.width,h=arenaMetrics.height,time=battle.time+endElapsed,sizes={};
 for(const a of [...battle.heroes,...battle.enemies]){const ref=actorRefs.get(a.id);if(!ref)continue;const {el,body,trail,shadow}=ref,size=bodySize(a,time);sizes[a.id]=size;el.style.setProperty('--actor-size',size.toFixed(2)+'px');el.style.left=ground[a.id].x+'%';el.style.top=ground[a.id].y+'%';const pose=poseFor(a,time);setPose(body,pose.frame,{actor:a,time,idleTime:time+idleOffset,outcome:battle.result,renderSize:size});el.dataset.phase=pose.phase;
  const targetId=a.action?.targetId||battle.targetFor(a)?.id,target=[...battle.heroes,...battle.enemies].find(b=>b.id===targetId),tar=ground[targetId],src=ground[a.id];
  const desired=travelOffset(a,pose,src,tar,w,h,size,target?bodySize(target,time):size,time),{x,y}=motionOffsets.value(a,desired,time);
  trail.style.width=healthTrails.value(a.id,a.hp/a.maxHp,time)*100+'%';
  if(a.action||ref.flip===undefined)ref.flip=tar?(tar.x<src.x?-1:1):a.side==='e'?-1:1;
  body.style.transform=`translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scaleX(${ref.flip})`;shadow.style.transform=`translate(calc(-50% + ${x.toFixed(2)}px),${y.toFixed(2)}px)`;
  el.classList.toggle('has-shield',a.shield>0&&a.hp>0);
 }
 const centers=positions(battle);guardEffects.render([...battle.heroes,...battle.enemies],time,centers,sizes,combatEffects);statusEffects.render([...battle.heroes,...battle.enemies],time,centers,sizes,combatEffects);renderCombatCues(time,w,h,centers,sizes);
 combatText.render(time);
}
function renderCombatCues(time,w,h,centers,sizes){
 const active=battleCues.active(time);combatEffects.render(active,time,w,h,centers,sizes);
 for(const a of [...battle.heroes,...battle.enemies]){const el=actorRefs.get(a.id)?.el;if(!el)continue;const outgoing=active.find(r=>r.from===a.id&&r.label!=='普攻');el.style.setProperty('--cue-color',cueColors[outgoing?.tone]||'transparent');const badge=el.querySelector('.action-tag');badge.hidden=!outgoing||a.hp<=0;badge.textContent=outgoing?.label||'';}
}
function playEvents(events){if(!battle||!events.length)return;const p=positions(battle),previous=p;battleCues.consume(events,battle,previous);combatText.consume(events,previous,battle.time);let hitSound=false;for(const e of events){const target=previous[e.to]||p[e.to],source=previous[e.from]||p[e.from];if(!target)continue;
 // Release effects are rendered from the same action clock as impact.
 if(e.type==='hit'&&e.value>0)hitSound=true;
 if(e.type==='interrupt')bossNotice={until:battle.time+2.2};
 if(e.type==='skill')sound('skill');
 if(e.type==='burst'){combatEffects.emit('dust',source,battle.time,76,.60);}
 }if(hitSound)sound('hit');if(events.some(e=>['hit','heal','shield','down'].includes(e.type)))renderVitals();}

function onBattleEnd(){for(const a of [...battle.heroes,...battle.enemies])a.action=null;const result=settleBattle(state,battle);if(!result)return;persist();renderHeader();renderParty();const el=$('#battle-message');
 if(result.activity){running=false;nextDelay=0;el.classList.add('has-actions');el.innerHTML='<strong>'+(result.win?'委托完成':'挑战结束')+'</strong>'+(result.win?rewardIcons(result,{companion:battle.activity.id}):'')+'<div class="activity-result-actions"><button id="activity-back">返回</button><button id="activity-again">再战</button></div>';$('#activity-back').onclick=()=>returnToStreet(activityRoute(battle.activity));$('#activity-again').onclick=()=>startBattle({activity:battle.activity.request});activityReturn.finish(battle.activity,ambientTime);sound(result.win?'win':'hit');renderVitals();return;}

 if(result.arena){running=false;nextDelay=0;el.innerHTML=result.win?`<strong>${battle.weekly?battle.weekly.name:'第 '+battle.arenaTier+' 擂'}获胜</strong><small>${result.weekly?'鱼币 +'+result.gold+' · 物资 +'+result.supplies+' · ':''}突破徽章 +${result.badges}${result.first?' · 首通奖励已领':''}</small>`:'<strong>擂台挑战结束</strong>';sound(result.win?'win':'hit');renderVitals();return;}
 if(result.win){sound('win');el.innerHTML=`<strong>${battle.farm?'收工，有鱼币！':battle.stage%5===0?'首领拿下！':'街区 +1'}</strong><small>鱼币 +${fmt(result.gold)} · 经营物资 +${result.supplies}${result.gearLoot?.item?' · 装备已入背包':result.gearLoot?.scrap?' · 背包已满，掉落折算零件':''}${result.unlocked.length?' · 新队员来啦':''}</small>`;nextDelay=2.2;if(result.unlocked.length)queue.push(()=>showRecruit(result.unlocked[0]));if(state.pending)queue.push(()=>showLoot());if(result.complete)queue.push(()=>showVictory());if(queue.length)queue.shift()();}
 else {running=false;nextDelay=0;el.innerHTML='<strong>先回家吃口饭</strong>';}renderVitals();}
function changeTab(next){if(next!=='map')districtTools.hidden=true;if(next!=='battle')activityReturn.cancel();disposeDistrict?.();disposeDistrict=null;disposeFormation?.();disposeFormation=null;tab=next;$('#battle-view').hidden=next!=='battle';$('#other-view').hidden=next==='battle';$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===next));if(next==='cats')renderCats();if(next==='relics')renderRelics();if(next==='map')renderMap();$('.game-shell').scrollIntoView({block:'start',behavior:'auto'});}
function renderCats(){
 const scroller=$('#other-view'),scroll=scroller.scrollTop,railScroll=$('#crew-roster')?.scrollLeft||0;
 disposeFormation?.();disposeFormation=null;if(crewMode==='equipment'&&!ownsCompanion(state,selectedCrew))selectedCrew=unlocked(state)[0].id;bagView.cat=selectedCrew;
 const modes=[['profile','养成'],['equipment','装备'],['formation','阵容']];
 scroller.innerHTML='<div class="view-padding crew-view" data-mode="'+crewMode+'"><div class="view-heading"><h2>伙伴</h2></div><div class="crew-modes">'+modes.map(([id,name])=>'<button data-crew-mode="'+id+'" aria-pressed="'+(crewMode===id)+'">'+name+'</button>').join('')+'</div>'+(crewMode==='formation'?crewFormationHTML(state):'<div id="crew-detail">'+(crewMode==='equipment'?crewEquipmentHTML(state,selectedCrew,bagView):crewProfileHTML(state,selectedCrew))+'</div><div class="crew-roster" id="crew-roster" aria-label="选择伙伴">'+crewRosterHTML(state,selectedCrew)+'</div>')+'</div>';

 $$('[data-crew-mode]').forEach(b=>b.onclick=()=>{crewMode=b.dataset.crewMode;bagView.page=0;scroller.scrollTop=0;renderCats();});
 if(crewMode==='formation')disposeFormation=bindFormationDrag($('.crew-formation'),{scrollElement:scroller,onDrop:equipCrew,describe:(id,slot)=>formationDropText(state,id,slot)});
 else{
  $('#crew-roster').scrollLeft=railScroll;
  if(crewMode==='equipment')bindEquipment();else bindCrewProfile($('#crew-detail'),selectedCrew);
  $$('#crew-roster [data-crew]').forEach(button=>button.onclick=()=>{selectedCrew=button.dataset.crew;if(!ownsCompanion(state,selectedCrew))crewMode='profile';bagView.page=0;renderCats();});
 }
 $$('.crew-quick-upgrade').forEach(button=>button.onclick=()=>train(button.dataset.upgrade,+(button.dataset.upgradeCount||1)));
 updateUpgradeButtons();scroller.scrollTop=scroll;
}
function openFormation(){if(modalType==='cat')forceClose();crewMode='formation';changeTab('cats');$('#other-view').scrollTop=0;}
function equipCrew(id,slot){
 if(state.party[slot]===id||slot>state.party.length)return;
 const message=formationDropText(state,id,slot);
 if(!setParty(state,slot,id))return;
 persist();renderHeader();if(tab==='cats')renderCats();
 if(battle&&!battle.result){const wasRunning=running;startBattle({farm:farming,stage:battle.stage,arenaTier:battle.arenaTier||0,weeklyTier:battle.weekly?.tier||0,activity:battle.activity?.request||null});running=wasRunning;renderVitals();}
 toast(message);
}
function bindCrewProfile(root,id){
 root.querySelector('[data-breakthrough]')?.addEventListener('click',()=>{if(!breakthrough(state,id))return;battle?.syncStats(state,{preserveHealthRatio:true});persist();renderHeader();if(modalType==='cat')showCat(id,true);else renderCats();toast(cat(id).name+'突破成功，等级上限 '+levelCap(state,id));});
 root.querySelector('[data-ascend]')?.addEventListener('click',()=>{if(!ascendCompanion(state,id))return;battle?.syncStats(state,{preserveHealthRatio:true});persist();renderHeader();if(modalType==='cat')showCat(id,true);else renderCats();toast(cat(id).name+'升星成功');});
 root.querySelector('[data-companion-contract]')?.addEventListener('click',()=>openStreet('recruit',id));
 root.querySelector('[data-growth-materials]')?.addEventListener('click',()=>openStreet('materials','escort'));
 root.querySelector('[data-upgrade]')?.addEventListener('click',()=>train(id));
 root.querySelector('[data-inherit-open]')?.addEventListener('click',()=>showInheritance(id));
 root.querySelector('[data-open-formation]')?.addEventListener('click',openFormation);
}
const bagView={tab:'equipment',cat:'orange',slot:'',set:'',page:0};
function refreshEquipment(){if(tab==='cats')renderCats();else renderRelics();}
function bindEquipment(){
 $$('[data-bag-slot]').forEach(b=>b.onclick=()=>{bagView.slot=b.dataset.bagSlot;bagView.page=0;refreshEquipment();});
 const set=$('#bag-set');if(set)set.onchange=()=>{bagView.set=set.value;bagView.page=0;refreshEquipment();};
 $$('[data-gear]').forEach(b=>b.onclick=()=>{if(tab!=='cats'){crewMode='equipment';changeTab('cats');}showGear(b.dataset.gear);});
 $$('[data-slot]').forEach(b=>b.onclick=()=>{bagView.slot=b.dataset.slot;bagView.page=0;renderCats();});
 $$('[data-equipped]').forEach(b=>b.onclick=()=>showGear(b.dataset.equipped));
 $$('[data-equip-now]').forEach(b=>b.onclick=()=>{if(equipGear(state,b.dataset.equipNow,bagView.cat,unlocked(state).map(c=>c.id))){persist();renderHeader();renderCats();}});
 $$('[data-page]').forEach(b=>b.onclick=()=>{bagView.page+=+b.dataset.page;refreshEquipment();});
 const craft=$('#gear-craft');if(craft)craft.onclick=()=>{openModal('craft',craftHTML(state));$('#craft-confirm').onclick=()=>{const e=craftGear(state,$('#craft-set').value,$('#craft-slot').value);if(e){persist();renderHeader();refreshEquipment();showGear(e.id);}};};
}
function renderRelics(){
 $('#other-view').innerHTML=inventoryHTML(state,bagView);
 $$('[data-bag-tab]').forEach(b=>b.onclick=()=>{bagView.tab=b.dataset.bagTab;bagView.page=0;renderRelics();});bindEquipment();
}
function showGear(uid){
 const e=state.inventory.items.find(e=>e.id===uid);if(!e)return;if(tab!=='cats'){crewMode='equipment';changeTab('cats');}openModal('equipment',gearDetailHTML(state,uid,bagView.cat));
 const update=()=>{persist();renderHeader();refreshEquipment();showGear(uid);};
 $('#gear-equip').onclick=()=>{if(gearOwner(state,uid)===bagView.cat)unequipGear(state,bagView.cat,e.slot);else if(!equipGear(state,uid,bagView.cat,unlocked(state).map(c=>c.id)))return;persist();renderHeader();forceClose();refreshEquipment();};
 $('#gear-enhance')?.addEventListener('click',()=>{if(enhanceGear(state,uid)){update();sound('coin');}});
 $$('[data-reforge]').forEach(b=>b.onclick=()=>{if(reforgeGear(state,uid,+b.dataset.reforge))update();});
 $('#gear-lock').onclick=()=>{e.locked=!e.locked;update();};
 $('#gear-dismantle').onclick=()=>{openModal('dismantle',`<h2 id="modal-title">分解 ${gearName(e)}？</h2><button id="dismantle-confirm" class="primary wide">确认分解</button>`);$('#dismantle-confirm').onclick=()=>{const r=dismantleGear(state,uid);if(r){persist();forceClose();refreshEquipment();toast('分解完成');}};};
}
function renderFishStall(){
 const rate=$('#idle-rate'),amount=$('#idle-amount');
 if(rate)rate.textContent=fmt(idleRate(state))+' 鱼币';
 if(amount)amount.textContent='领取 +'+fmt(state.idle);
}
function claimFishStall(){
 const n=claimIdle(state);persist();renderHeader();
 if(n){sound('coin');toast('小鱼摊交班 +'+fmt(n)+' 鱼币');}else toast('鱼摊正营业，稍后再来收取。');
}
const districtTools=document.querySelector('#district-tools');
function renderMap(){disposeDistrict?.();$('#other-view').innerHTML=districtHTML(state);districtTools.hidden=false;$('#other-view').prepend(districtTools);disposeDistrict=bindDistrictInput($('.district-scene'),openDistrict,{reducedMotion});}
function openDistrict(place){
 if(place==='journal'){openModal('journal',campaignHTML(state));const claim=fn=>{if(fn()){persist();renderHeader();openDistrict('journal');sound('coin');}};$$('[data-daily]').forEach(b=>b.onclick=()=>claim(()=>claimDaily(state,b.dataset.daily)));$('#daily-chest').onclick=()=>claim(()=>claimDailyChest(state));$$('[data-journey]').forEach(b=>b.onclick=()=>claim(()=>claimJourney(state,b.dataset.journey)));return;}

 if(place==='crew'){changeTab('cats');return;}
 if(place==='patrol'){showPatrolRoutes();return;}
 if(place==='stall'){accrueIdle(state);openModal('stall',stallHTML(state));$('#idle-claim').onclick=()=>{claimFishStall();openDistrict('stall');};$('#stall-patrol').onclick=showPatrolRoutes;$$('[data-stall-upgrade]').forEach(b=>b.onclick=()=>{if(upgradeStall(state,b.dataset.stallUpgrade)){persist();renderHeader();openDistrict('stall');if(tab==='map')renderMap();toast('鱼摊升级完成');}});return;}
 if(place==='arena'){openModal('arena',streetHubHTML());$$('[data-street-group]').forEach(b=>b.onclick=()=>openStreet(b.dataset.streetGroup));$('#open-journal').onclick=()=>openDistrict('journal');$('#open-challenges').onclick=()=>openDistrict('challenges');return;}
 if(place==='challenges'){openModal('arena','<button id="open-journal" class="primary wide">猫巷手账 · 每日委托与成长之路</button>'+weeklyHTML(state)+arenaHTML(state));$('#open-journal').onclick=()=>openDistrict('journal');$$('[data-weekly]').forEach(b=>b.onclick=()=>{forceClose();changeTab('battle');startBattle({weeklyTier:+b.dataset.weekly});});$$('[data-arena-tier]').forEach(b=>b.onclick=()=>{const tier=+b.dataset.arenaTier;if(!arenaOpen(state,tier))return;forceClose();changeTab('battle');startBattle({arenaTier:tier});});}
}
const streetView={group:'recruit',id:'milk',tier:1};
function openStreet(group=streetView.group,id){if(group!==streetView.group||id&&id!==streetView.id)streetView.tier=1;streetView.group=group;if(id)streetView.id=id;openModal('street',streetHTML(state,streetView));
 $$('[data-street-group]').forEach(b=>b.onclick=()=>openStreet(b.dataset.streetGroup));$$('[data-street-choice]').forEach(b=>b.onclick=()=>{streetView.tier=1;openStreet(group,b.dataset.streetChoice);});
 $$('[data-street-tier]').forEach(b=>b.onclick=()=>{streetView.tier+=+b.dataset.streetTier;openStreet();});
 $('#street-fight').onclick=()=>{const q=streetSelection(state,streetView);if(!q.open)return;forceClose();changeTab('battle');startBattle({activity:q.request});};
 const recruitButton=$('#recruit-current');if(recruitButton)recruitButton.onclick=()=>{if(recruitCompanion(state,streetView.id)){persist();renderHeader();renderParty();openStreet();toast(cat(streetView.id).name+'加入了远征队');}};
}
function returnToStreet(route){activityReturn.cancel();Object.assign(streetView,route);changeTab('map');openStreet();}
function showPatrolRoutes(){openModal('routes',`<h2 id="modal-title">街区巡逻</h2><button id="patrol-current" class="primary wide">${state.runCleared>=MAX_STAGE?'重访第 '+MAX_STAGE+' 关':'继续第 '+state.stage+' 关'}</button>${Array.from({length:MAX_STAGE/20},(_,i)=>{const c=CHAPTERS[i%6],open=state.runCleared>=i*20;return `<button class="chapter-card" data-chapter="${i}" ${open?'':'disabled'}><div class="chapter-thumb">${sceneSVG(i%6)}</div><div><h3>${c.name} · ${Math.floor(i/6)+1}</h3>${rewardIcons({gold:1,supplies:1,gear:1},{counts:false})}</div><strong>›</strong></button>`;}).join('')}`);$('#patrol-current').onclick=()=>{forceClose();changeTab('battle');startBattle({farm:state.runCleared>=MAX_STAGE,stage:state.stage});};$$('[data-chapter]').forEach(b=>b.onclick=()=>showChapter(+b.dataset.chapter));}
function renderDistrictAmbient(time){if(tab!=='map'||modalType)return;const c=$('.district-ambient');if(!c)return;const r=c.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const ctx=c.getContext('2d');ctx.clearRect(0,0,w,h);paintDistrictAmbient(ctx,0,0,w,h,reducedMotion?0:time);const tap=c.parentElement._districtTap;if(tap&&!reducedMotion){const age=tap.phase==='press'?0:performance.now()/1000-tap.at;paintDistrictObjects(ctx,{scene:c.parentElement.querySelector('img')},0,0,w,h,tap.phase==='press'?tap.id:null,{...tap,age});}}
function openModal(type,html,mandatory=false){activityReturn.cancel();modalType=type;$('#modal').dataset.kind=type;$('#modal-content').innerHTML=html;$('#modal-backdrop').hidden=false;$('#modal-close').hidden=mandatory;$('#modal').scrollTop=0;$('#modal').focus({preventScroll:true});}
function closeModal(){if(modalType==='loot'||modalType==='intro')return;$('#modal-backdrop').hidden=true;modalType=null;if(queue.length)queue.shift()();}
function forceClose(){modalType=null;$('#modal-backdrop').hidden=true;if(queue.length)queue.shift()();}
function showIntro(){openModal('intro',`<div class="intro-hero">${catSVG('orange')}${catSVG('ink')}</div><h2 id="modal-title" class="intro-title">罐头远征队</h2><button id="intro-start" class="primary wide">出发 ${icon('arrow',19)}</button>`,true);$('#intro-start').onclick=()=>{state.onboarded=true;persist();forceClose();startBattle();};}
function showLoot(){state.pending=null;persist();toast('旧装备已迁移，请到背包查看。');}
function showRecruit(c){const skill=crewSkill(c.id,state.levels[c.id],catStats(state,c.id));openModal('recruit',`<div class="eyebrow">NEW FRIEND / 新队员加入</div><div class="cat-detail-portrait">${catSVG(c.id)}</div><div class="cat-detail-name"><h2 id="modal-title">${c.name}</h2><span class="tag">${c.job}</span></div><p style="text-align:center">“${c.quote}”</p><div class="skill-box crew-recruit-skill"><b>${c.skill}</b><p class="crew-skill-description">${skill.description}</p><em>被动 · ${state.levels[c.id]>=5?'已觉醒':'Lv.5 解锁'}<br>${skill.passive}</em></div><button id="recruit-ok" class="primary wide">欢迎入队！</button>`);$('#recruit-ok').onclick=closeModal;}
function showCat(id,refresh=false){
 const scroll=refresh?$('#modal').scrollTop:0;
 openModal('cat',crewProfileHTML(state,id,{modal:true}));
 bindCrewProfile($('#modal-content'),id);
 if(refresh){$('#modal').scrollTop=scroll;$('#modal-content [data-upgrade]')?.focus({preventScroll:true});}
}
function showInheritance(id){const returnToPage=tab==='cats'&&modalType!=='cat',recipient=cat(id),level=state.levels[id],donors=unlocked(state).filter(c=>state.levels[c.id]>level);openModal('inherit',`<div class="eyebrow">TRAINING TRANSFER / 培养继承</div><h2 id="modal-title">把培养转给${recipient.name}</h2><div class="inherit-choices">${donors.map(c=>`<button data-inherit="${c.id}"><span><b>${recipient.name} Lv.${level} → Lv.${state.levels[c.id]}</b><small>${c.name} Lv.${state.levels[c.id]} → Lv.${level}</small></span><em>确认继承</em></button>`).join('')}</div><button id="inherit-back" class="text-btn">返回队员档案</button>`);$$('[data-inherit]').forEach(b=>b.onclick=()=>{const from=b.dataset.inherit;if(!inheritTraining(state,from,id))return;battle?.syncStats(state,{preserveHealthRatio:true});persist();renderHeader();renderParty();renderVitals();if(tab==='cats')renderCats();if(returnToPage)forceClose();else showCat(id);toast(`${recipient.name}已继承 Lv.${state.levels[id]} · ${cat(from).name}变为 Lv.${state.levels[from]}`);});$('#inherit-back').onclick=()=>{if(returnToPage)forceClose();else showCat(id);};}
function showQuests(){const ready=QUESTS.filter(q=>!state.claimed.includes(q.id)&&questValue(state,q)>=q.goal);openModal('quests',`<div class="eyebrow">SMALL WINS / 成长清单</div><h2 id="modal-title">一件一件，变厉害。</h2><button id="claim-quests" class="primary wide" ${ready.length?'':'disabled'}>${ready.length?'领取全部 · '+fmt(ready.reduce((n,q)=>n+q.reward,0))+' 鱼币':'暂时没有待领取奖励'}</button><div class="quest-list">${QUESTS.map(q=>{const v=questValue(state,q),claimed=state.claimed.includes(q.id);return `<div class="quest-row ${claimed?'claimed':v>=q.goal?'complete':''}"><div><b>${q.name}</b><small>${Math.min(v,q.goal)}/${q.goal}</small></div><strong>${claimed?'已领取':v>=q.goal?'待领取 +'+fmt(q.reward):'+'+fmt(q.reward)}</strong></div>`;}).join('')}</div>`);$('#claim-quests').onclick=()=>{const n=claimQuests(state);persist();renderHeader();sound('coin');showQuests();toast('成长奖励 +'+fmt(n)+' 鱼币');};}
function showChapter(index){const c=CHAPTERS[index%6],base=index*20;openModal('chapter',`<div class="eyebrow">CHAPTER ${index+1} / ${MAX_STAGE/20}</div><h2 id="modal-title">${c.name}</h2><div class="level-grid">${Array.from({length:20},(_,i)=>{const n=base+i+1,done=n<=state.runCleared,current=n===state.stage&&state.runCleared<MAX_STAGE;return `<button class="${done?'done':current?'current':''}" data-stage="${n}" ${done||current?'':'disabled'} aria-label="${done?'练习':current?'挑战':'尚未开放'}第${n}关">${n}${n%5===0?'<small>★</small>':''}</button>`;}).join('')}</div>`);$$('[data-stage]').forEach(b=>b.onclick=()=>{const n=+b.dataset.stage;forceClose();changeTab('battle');startBattle({farm:n<=state.runCleared,stage:n});$('.game-shell').scrollIntoView({behavior:'smooth',block:'start'});});}
function showVictory(){running=false;openModal('victory',`<h2 id="modal-title">这条街，已经走遍。</h2><button id="victory-map" class="primary wide">回到街区</button>`);$('#victory-map').onclick=()=>{forceClose();changeTab('map');};}

function showSettings(){openModal('settings',`<div class="eyebrow">TAKE YOUR TIME / 设置与存档</div><h2 id="modal-title">猫猫休息室</h2><div class="settings-row"><span>战斗音效</span><button id="toggle-sound">${state.sound?'已开启':'已关闭'}</button></div><div class="settings-row"><span>本机保存</span><span>${saveOK?'正常 · 自动保存':'不可用，请导出'}</span></div><div class="settings-row"><span>已通过 / 历史最高</span><span>${state.runCleared} / ${state.highest}</span></div><div class="settings-row"><span>离线资源</span><span>${swReady?'缓存已就绪':'联网游玩可用'}</span></div><div class="settings-actions"><button class="secondary" id="save-export">导出存档</button><button class="secondary" id="save-import">导入存档</button><button class="secondary" id="share-game">分享游戏</button></div><small>0.26.2 · 本机存档</small><button class="text-btn" id="reset-open">重新开始一份存档…</button>`);$('#toggle-sound').onclick=()=>{state.sound=!state.sound;persist();showSettings();if(state.sound)sound('coin');};$('#save-export').onclick=showExport;$('#save-import').onclick=showImport;$('#share-game').onclick=shareGame;$('#reset-open').onclick=showReset;}
function showExport(){accrueIdle(state);persist();const data=encodeSave(state);openModal('export',`<h2 id="modal-title">把猫猫存档带走</h2><p>下载 JSON 文件保存，或复制下方完整存档文字。导入时会替换目标设备的游戏进度。</p><textarea class="save-text" id="export-text" aria-label="完整存档文字" readonly></textarea><div class="settings-actions"><button id="download-save" class="primary">下载存档文件</button><button id="copy-save" class="secondary">复制存档文字</button></div>`);$('#export-text').value=data;$('#download-save').onclick=()=>{const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='can-club-save.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('已开始下载存档');};$('#copy-save').onclick=async()=>{try{await navigator.clipboard.writeText(data);toast('存档已复制');}catch{$('#export-text').select();toast('请长按或按 Ctrl/Cmd+C 复制选中的文字。');}};}
function showImport(){openModal('import',`<h2 id="modal-title">导入一份存档</h2><p>粘贴完整存档文字，或者选择此前导出的 JSON 文件。校验通过后会先显示进度，确认后才会替换。</p><input id="import-file" type="file" accept=".json,application/json" aria-label="选择存档文件"><textarea id="import-text" class="save-text" placeholder="把完整存档文字粘贴到这里" aria-label="待导入的存档文字"></textarea><p id="import-error" class="error-text" role="status"></p><button id="check-import" class="primary wide">检查这份存档</button>`);$('#import-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>100000){$('#import-error').textContent='文件过大，请选择本游戏导出的存档。';return}$('#import-text').value=await f.text();};$('#check-import').onclick=()=>{try{const incoming=decodeSave($('#import-text').value);openModal('confirm-import',`<h2 id="modal-title">这份存档可以读取。</h2><div class="stats-row"><div><b>${incoming.highest}</b><small>历史最高关卡</small></div><div><b>${fmt(incoming.gold)}</b><small>鱼币</small></div><div><b>${incoming.bones}</b><small>永久鱼骨</small></div></div><p>将替换当前进度。需要保留当前存档的话，请先关闭此窗口，再导出备份。</p><button id="apply-import" class="primary wide">确认替换当前进度</button>`);$('#apply-import').onclick=()=>{state=incoming;accrueIdle(state);queue=[];persist();forceClose();running=false;farming=false;changeTab('battle');renderHeader();renderParty();previewBattle();if(state.pending)showLoot();else if(!state.onboarded)showIntro();toast('存档已导入');};}catch(err){$('#import-error').textContent=err.message;}};}
async function shareGame(){const url=location.origin+location.pathname;try{if(navigator.share){await navigator.share({title:'罐头远征队',text:'带上五只猫，拿下一条街。来试试这款原创放置冒险。',url});}else{await navigator.clipboard.writeText(url);toast('游戏链接已复制');}}catch(e){if(e.name==='AbortError')return;openModal('share',`<h2 id="modal-title">一起逛逛这条街</h2><p>复制下面的公开游戏地址发给朋友。不会分享你的存档。</p><textarea class="save-text" aria-label="游戏地址" readonly>${esc(url)}</textarea>`);}}

function showReset(){openModal('reset',`<h2 id="modal-title">确定重新开始？</h2><p>会清空当前浏览器内的队员训练、关卡、鱼币和装备。建议先导出存档。重新开始后无法在游戏内撤销。</p><button id="confirm-reset" class="danger wide">确认清空，重新开始</button>`);$('#confirm-reset').onclick=()=>{state=initialState();queue=[];running=false;farming=false;try{localStorage.removeItem(BACKUP);localStorage.removeItem(KEY);}catch{}persist();forceClose();renderHeader();renderParty();changeTab('battle');previewBattle();showIntro();};}
function showOffline(){if(state.idle<10)return;openModal('offline',`<div class="eyebrow">WELCOME BACK / 小鱼摊的交班单</div><h2 id="modal-title">猫猫睡觉，鱼摊营业。</h2><div style="text-align:center;margin:25px 0;color:#b08a4b">${icon('coin',45)}<div style="font-size:35px;font-weight:900;margin-top:8px">+${fmt(state.idle)}</div><small>鱼币已备好</small></div><button id="offline-claim" class="primary wide">收下鱼币</button>`);$('#offline-claim').onclick=()=>{const n=claimIdle(state);persist();renderHeader();sound('coin');closeModal();toast('鱼摊交班 +'+fmt(n)+' 鱼币');};}
$('#desktop-cat').innerHTML=catSVG('orange',true);$('#coin-icon').innerHTML=icon('coin',25);$('#bone-icon').innerHTML=icon('star',23);$('#settings').innerHTML=icon('settings',18)+'<span>设置</span>';$('#quest-icon').innerHTML=icon('gift',23);$('#can-icon').innerHTML=icon('can',29);$('#modal-close').innerHTML=icon('close',17);
const navIcons={battle:'sword',cats:'paw',relics:'bag',map:'map'};$$('[data-tab]').forEach(b=>{b.querySelector('span').innerHTML=icon(navIcons[b.dataset.tab],24);b.onclick=()=>changeTab(b.dataset.tab);});
$('#settings').onclick=showSettings;$('#quests').onclick=showQuests;$('#objective').onclick=showQuests;$('#stage-map').onclick=()=>{const q=battle?.activity;if(q){streetView.tier=q.tier;openStreet(['hunt','hard','recruit'].includes(q.kind)?q.kind:'materials',q.id||q.kind);streetView.tier=q.tier;openStreet();}else showPatrolRoutes();};$('#modal-close').onclick=closeModal;$('#modal-backdrop').onclick=e=>{if(e.target===$('#modal-backdrop'))closeModal();};
$('#battle-start').onclick=pauseOrStart;$('#open-can').onclick=useCan;$('#speed').onclick=()=>{state.speed=state.speed===1?2:1;persist();renderHeader();};
$('#farm').onclick=()=>{if(farming||battle?.mode==='arena'||battle?.activity){farming=false;startBattle();toast('回到主线闯关');return}if(state.runCleared<1){toast('先通过一关，再回来练习。');return}farming=true;startBattle({farm:true});toast('练习已过关卡：60% 鱼币，首领关仍可掉落装备。');};

document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();return}if(e.code==='Space'&&!['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)&&tab==='battle'&&!modalType){e.preventDefault();useCan();}if(e.key==='Tab'&&modalType){const focusables=[...$('#modal').querySelectorAll('button:not([disabled]):not([hidden]),summary,textarea,input')].filter(x=>x.offsetParent!==null);if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('#modal'))){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
document.addEventListener('visibilitychange',()=>{lastStamp=performance.now();accrueIdle(state);persist();renderHeader();});window.addEventListener('pagehide',()=>{accrueIdle(state);persist();});
function frame(now){const dt=lastStamp?Math.min(.1,(now-lastStamp)/1000):0;lastStamp=now;if(!document.hidden){ambientTime+=dt;if(battle?.time===0&&!running)idleOffset+=dt;}
 if(!document.hidden&&running&&tab==='battle'&&!modalType){if(battle&&!battle.result){let remain=dt*battleRate(state.speed);while(remain>0&&!battle.result){const slice=Math.min(.1,remain);playEvents(battle.tick(slice));remain-=slice;}if(battle.result&&!battle.resolved)onBattleEnd();}else if(battle?.result==='win'&&battle.mode==='patrol'){nextDelay-=dt;if(nextDelay<=0&&!state.pending&&(farming||state.runCleared<MAX_STAGE))startBattle({farm:farming,stage:farming?battle.stage:undefined});}}
 if(battle?.result&&!document.hidden&&tab==='battle'&&!modalType)endElapsed+=dt;
 if(!document.hidden&&tab==='battle'&&!modalType){const route=activityReturn.update(ambientTime);if(route)returnToStreet(route);}
 renderMotion();if(tab==='map'&&(now-renderStamp>100||$('.district-scene')?._districtTap))renderDistrictAmbient(ambientTime);
 if(!document.hidden&&now-idlePaintStamp>=50){idlePaintStamp=now;for(const sprite of $$('.painted-sprite[data-hero="true"]')){if(!sprite.closest('#actors')&&!sprite.closest('[hidden]'))setPose(sprite,0,{time:ambientTime,idleTime:ambientTime});}}
 if(now-renderStamp>100){if(tab==='battle')renderVitals();$('#farm').textContent=battle?.activity||battle?.mode==='arena'?'返回普通巡逻':farming?'返回主线闯关':'去练练 · 旧关刷币';renderStamp=now;}
 if(now-idleStamp>1200){accrueIdle(state);renderHeader();idleStamp=now;}
 if(now-saveStamp>6000){persist();saveStamp=now;}
 requestAnimationFrame(frame);
}
renderHeader();renderParty();previewBattle();persist();if(state.pending)showLoot();else if(!state.onboarded)showIntro();else if(offlineNote>60000)showOffline();if(recovery)toast(recovery);requestAnimationFrame(frame);watchImageAssets();document.getElementById('boot-status')?.remove();
if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{swReady=true;}).catch(()=>{});
