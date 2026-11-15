import {SHARED_BATTLE_ASSETS,loadBattleAssets,battleAssetsReady} from './battle-loading.mjs';
import {GameAudio} from './game-audio.mjs';
import {GUIDE,GUIDE_DONE,nextGuide} from './onboarding.mjs';
import {chapterBanner} from './chapter-entry-art.mjs';
import {catTagCardHTML} from './cat-tag-ui.mjs';
import {groundFootY} from './battlefield-space.mjs';
import {paintRain} from './scene-weather.mjs';
import {battleReport} from './battle-flow.mjs';
import {resultHTML,resultGearHTML} from './battle-result.mjs';
import {MATERIAL_INFO,materialHave} from './material-info.mjs';
import {MATERIAL_NAMES,materialIcon} from './loot-icons.mjs';
import {BADGE_NAMES} from './growth-visual.mjs';
import {ActivityReturn,activityRoute} from './activity-navigation.mjs?v=0.25.1';
const activityReturn=new ActivityReturn();
import {rewardIcons} from './loot-icons.mjs?v=0.25.1';
import {CombatText} from './combat-text.mjs?v=0.25.1';
import {watchImageAssets} from './image-cache.mjs?v=0.25.1';
import {streetHubHTML,streetHTML,streetSelection} from './street-ui.mjs?v=0.25.0';
import {rewardText} from './activities.mjs?v=0.25.0';
import {inventoryHTML,crewEquipmentHTML,gearDetailHTML,craftHTML} from './inventory-ui.mjs?v=0.25.0';
import {GEAR_SLOTS,GEAR_SETS,gearBonuses,equipGear,unequipGear,enhanceGear,reforgeGear,dismantleGear,gearOwner,gearName,craftGear} from './equipment.mjs?v=0.25.0';
import {campaignHTML,weeklyHTML} from './campaign-ui.mjs?v=0.25.0';
import {claimDaily,claimDailyChest,claimJourney} from './campaign.mjs?v=0.25.0';
import {bindDistrictInput} from './district-input.mjs?v=0.25.0';
let disposeDistrict=null;
import {districtHTML,stallHTML,arenaHTML,paintDistrictAmbient,paintDistrictObjects} from './district.mjs?v=0.25.0';
import {CATS,RELICS,CHAPTERS,QUESTS,MAX_STAGE,MAX_LEVEL,MAX_PARTY,initialState,normalizeState,unlocked,ownsCompanion,recruitCompanion,ascendCompanion,inheritanceFor,inheritTraining,upgrade,upgradeCost,upgradeQuote,catStats,power,idleRate,accrueIdle,claimIdle,claimQuests,questValue,chooseRelic,setParty,removeParty,chapterOf,Battle,settleBattle,encodeSave,decodeSave,rewardFor,upgradeStall,levelCap,breakthrough,breakthroughQuote,ARENA_MAX,arenaOpen,idleMinutes} from './core.mjs?v=0.25.0';
import {icon,catSVG,enemySVG,relicSVG,sceneSVG,commissionScene,actorArt,setPose} from './art.mjs?v=0.25.0';
import {poseFor,attackStyle,travelOffset,battleRate,MotionOffsets} from './motion.mjs?v=0.25.0';
import {HealthTrails,rescueView,bossView} from './battle-ui.mjs?v=0.25.0';
import {BattleCues,formationPositions,cueColors} from './battle-cues.mjs?v=0.25.0';
import {FormationMotion,retiringSize} from './formation-motion.mjs?v=0.25.0';
import {battleUnitSize,companionSize} from './companion-display.mjs';
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
let entranceRemaining=0,resourceLoading=false,loadingSerial=0;
const resultLayer=document.createElement('div');resultLayer.id='result-layer';resultLayer.hidden=true;document.body.append(resultLayer);
const entranceLayer=document.createElement('div');entranceLayer.id='battle-entrance';entranceLayer.hidden=true;document.body.append(entranceLayer);
let pausedBattle=null;
let state,saveOK=true,recovery='',tab='battle',battle=null,running=false,farming=false,nextDelay=0,modalType=null,queue=[],lastStamp=0,renderStamp=0,idlePaintStamp=0,idleStamp=0,saveStamp=0,toastTimer,swReady=false;
try{const stored=localStorage.getItem(KEY);if(stored){try{state=decodeSave(stored);}catch{const backup=localStorage.getItem(BACKUP);if(backup){state=decodeSave(backup);recovery='已恢复最近一份可用备份。';}else recovery='存档未能读取，已开启新远征。';}}}catch{saveOK=false;recovery='浏览器无法保存，请定期导出存档。';}
if(!state)state=initialState();accrueIdle(state);
const fmt=n=>n>=1e8?Math.floor(n/1e8)+'亿':n>=1e4?Math.floor(n/1e4)+'万':Math.floor(n).toLocaleString('zh-CN');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cat=id=>CATS.find(c=>c.id===id),relic=id=>RELICS.find(r=>r.id===id);
function persist(){try{const data=encodeSave(state);const previous=localStorage.getItem(KEY);if(previous){try{decodeSave(previous);localStorage.setItem(BACKUP,previous);}catch{}}localStorage.setItem(KEY,data);saveOK=true;}catch{saveOK=false;}$('#save-warning').hidden=saveOK;}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600);}
const gameAudio=new GameAudio();
function audioSettings(){gameAudio.configure({music:state.music,effects:state.sound,hidden:document.hidden,scene:tab==='battle'&&!modalType?'battle':'alley'});}
function sound(kind){audioSettings();gameAudio.play(kind);}
document.addEventListener('pointerdown',()=>{audioSettings();gameAudio.unlock();},{passive:true});
document.addEventListener('keydown',()=>{audioSettings();gameAudio.unlock();});
document.addEventListener('click',e=>{if(e.target.closest('button'))sound('click');});
const guideLayer=document.createElement('div');guideLayer.id='new-player-guide';document.body.append(guideLayer);
let guideLast=-1;
function guideEvent(event){const next=nextGuide(state.guideStep,event);if(next===state.guideStep)return;state.guideStep=next;persist();if(next===3&&tab==='cats')renderCats();renderGuide();if(next===GUIDE_DONE)toast('教学完成！继续推进主线，去街区委托板获取伙伴与装备。');}
function renderGuide(){
 const step=state.guideStep,g=GUIDE[step];guideLayer.hidden=resourceLoading||!g||!state.onboarded;if(guideLayer.hidden)return;
 if(guideLast!==step){guideLast=step;guideLayer.innerHTML='<div class="guide-focus"></div><section class="guide-card"><b>'+g.title+'</b><p>'+g.text+'</p><button id="guide-skip">跳过教学</button></section>';$('#guide-skip').onclick=()=>{state.guideStep=GUIDE_DONE;persist();renderGuide();if(!running&&battle?.result==='win')startBattle();};}
 const target=document.querySelector(g.target);if(!target)return;const r=target.getBoundingClientRect(),focus=guideLayer.querySelector('.guide-focus'),card=guideLayer.querySelector('.guide-card'),shell=$('.game-shell').getBoundingClientRect();
 Object.assign(focus.style,{left:(r.left-4)+'px',top:(r.top-4)+'px',width:(r.width+8)+'px',height:(r.height+8)+'px'});
 const width=Math.min(290,shell.width-24);Object.assign(card.style,{width:width+'px',left:Math.max(12,Math.min(innerWidth-width-12,shell.left+(shell.width-width)/2))+'px',top:Math.max(12,Math.min(innerHeight-160,r.top>innerHeight*.55?r.top-150:r.bottom+18))+'px'});
}
document.addEventListener('click',e=>{const g=GUIDE[state.guideStep];if(resourceLoading||!g||!state.onboarded)return;if(e.target.closest('#guide-skip'))return;const target=document.querySelector(g.target);if(!target?.contains(e.target)){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('click',e=>{if(e.target.closest('[data-tab="cats"]'))guideEvent('companions');else if(e.target.closest('[data-crew-mode="equipment"]'))guideEvent('equipment');else if(e.target.closest('#modal-close'))guideEvent('close');else if(e.target.closest('[data-tab="battle"]'))guideEvent('battle');});
function renderHeader(){ $$('[data-wallet-gold]').forEach(n=>n.textContent=Math.floor(state.gold).toLocaleString('zh-CN'));$$('[data-wallet-badges]').forEach(n=>n.textContent=fmt(state.badges));$('#cats-count').textContent=unlocked(state).length+'/8';const ready=QUESTS.filter(q=>!state.claimed.includes(q.id)&&questValue(state,q)>=q.goal);districtTools.querySelector('#quest-dot').hidden=!ready.length;$('#power').textContent=fmt(power(state));renderFishStall();$('#speed').textContent='×'+state.speed;
 const next=QUESTS.find(q=>!state.claimed.includes(q.id));$('#objective-text').textContent=ready.length?`${ready.length} 项成长奖励待领取 · +${fmt(ready.reduce((n,q)=>n+q.reward,0))} 鱼币`:next?`${next.desc} · ${Math.min(questValue(state,next),next.goal)}/${next.goal}`:'成长清单';
 updateUpgradeButtons();}
function renderParty(){ const party=$('#party');if(!party)return;party.innerHTML=Array.from({length:MAX_PARTY},(_,i)=>{const id=state.party[i];if(!id)return `<div class="party-card"><button class="party-empty" data-slot="${i}" aria-label="选择第 ${i+1} 位队员"><b>+</b><span>${unlocked(state).length>state.party.length?'点击上阵':'去做伙伴委托'}</span></button></div>`;const c=cat(id);return `<article class="party-card ${i<2?'front-card':''}"><button class="party-portrait" data-detail="${id}" aria-label="查看${c.name}与调整站位">${catSVG(id,true)}<span class="party-level" data-level="${id}">Lv.${state.levels[id]}</span></button><div class="party-meta"><b>${i+1} ${c.name}</b><span>${i<2?'前排 · 承伤':'后排 · '+c.tag}</span></div><button class="upgrade-btn" data-upgrade="${id}">${icon('coin',14)}<span></span></button></article>`;}).join('');
 $$('#party [data-detail]').forEach(b=>b.onclick=()=>showCat(b.dataset.detail));$$('#party [data-slot]').forEach(b=>b.onclick=()=>{$('#crew-collection')?.scrollIntoView({block:'start',behavior:'smooth'});toast('选择一只猫，再选择出战位置。');});$$('#party [data-upgrade]').forEach(b=>b.onclick=()=>train(b.dataset.upgrade));$('#party-count').textContent=state.party.length+'/5';updateUpgradeButtons();}
function updateUpgradeButtons(){ $$('[data-upgrade]').forEach(b=>{const id=b.dataset.upgrade,l=state.levels[id],quote=upgradeQuote(l,+(b.dataset.upgradeCount||1),levelCap(state,id)),open=ownsCompanion(state,id),quick=b.classList.contains('crew-quick-upgrade');const label=!open?'未结识':!quote.levels?'已满级':quick?`${fmt(quote.cost)} 鱼币`:b.hasAttribute("data-profile-upgrade")?`升 ${quote.levels} 级`:`升 ${quote.levels} 级 · ${quote.cost.toLocaleString("zh-CN")}`;const labelNode=b.querySelector(':scope > span:last-child');if(labelNode)labelNode.textContent=label;if(quick)b.querySelector(':scope > small').textContent=quote.levels?'＋'+quote.levels+'级':'升级';b.disabled=!open||!quote.levels||state.gold<quote.cost;b.setAttribute('aria-label',!open?`${cat(id).name}尚未结识`:!quote.levels?`${cat(id).name}已满级`:`${cat(id).name}升${quote.levels}级，花费${quote.cost}鱼币`);});$$('[data-level]').forEach(n=>n.textContent='Lv.'+state.levels[n.dataset.level]);}
function train(id,count=1){const quote=upgradeQuote(state.levels[id],count,levelCap(state,id));if(state.gold<quote.cost){toast('本次升级需要 '+fmt(quote.cost)+' 鱼币。');return;}const n=upgrade(state,id,count);if(!n)return;guideEvent('upgrade');battle?.syncStats(state);sound('coin');persist();renderHeader();if(tab==='cats')renderCats();if(modalType==='cat')showCat(id,true);else if(tab==='cats')$(`[data-upgrade="${id}"]`)?.focus({preventScroll:true});toast(`${cat(id).name} Lv.${state.levels[id]}${n>1?' · 连升 '+n+' 级':state.levels[id]===5?' · 被动能力觉醒！':' · 变强了！'}`);}
function renderStageHeader(){
 const stage=battle?.stage||state.stage,q=battle?.activity,ci=Math.floor((stage-1)/20),c=CHAPTERS[ci%6];
 $('#scene-caption').textContent='';
 $('#scene').innerHTML=q?commissionScene(q):sceneSVG(ci%6);$('#battle-label').textContent=q?q.name+' · '+'难度 '+q.tier:battle?.weekly?`${battle.weekly.name} · 难度 ${battle.weekly.tier}`:battle?.mode==='arena'?`第 ${battle.arenaTier} 擂 · ${battle.arenaRule.name}`:`第 ${stage} 关 · ${chapterOf(stage).name}${stage%5===0?' · 首领':''}`;
}
// Flat side-on composition: the leading hero is nearest the enemy column.
function sizeActors(){
 const arena=$('#arena'),main=$('#main');
 if(arena.clientWidth&&arena.clientHeight)arenaMetrics.frameHeight=main.clientHeight-arena.clientHeight;
 arenaMetrics.width=arena.clientWidth||main.clientWidth;
 arenaMetrics.height=Math.max(100,(arena.clientHeight||main.clientHeight-(arenaMetrics.frameHeight||78))-76);
 arenaMetrics.size=battleUnitSize(arenaMetrics.width,arenaMetrics.height);
 const size=arenaMetrics.size.toFixed(4)+'px';
 if(arena.style.getPropertyValue('--unit-size')!==size)arena.style.setProperty('--unit-size',size);
 document.documentElement.style.setProperty('--companion-unit',size);
}
new ResizeObserver(sizeActors).observe($('#arena'));
new ResizeObserver(sizeActors).observe($('#main'));
const bodySize=(a,time=battle.time+endElapsed)=>retiringSize(a.boss?arenaMetrics.size*1.3:companionSize(arenaMetrics.size,a.catId),a,time);
function groundPositions(b,time=b.time+endElapsed){const p=formationMotion.update(b,time);for(const v of Object.values(p))v.y=groundFootY(v.y,arenaMetrics.height,arenaMetrics.size);return p;}
function positions(b){const p=groundPositions(b);for(const a of [...b.heroes,...b.enemies]){const offset=motionOffsets.points.get(a.id)||{x:0,y:0};p[a.id]={x:p[a.id].x+offset.x/arenaMetrics.width*100,y:p[a.id].y-bodySize(a)*.43/arenaMetrics.height*100+offset.y/arenaMetrics.height*100};}return p;}

function renderActors(){if(!battle)return;$('#battle-message').classList.remove('has-actions');endElapsed=0;formationMotion.clear();motionOffsets.clear();guardEffects.clear();statusEffects.clear();combatEffects.clear();actorRefs.clear();bossNotice=null;healthTrails.clear();battleCues.clear();$('#arena').dataset.partyCount=battle.heroes.length;$('#arena').dataset.enemyCount=battle.enemies.length;sizeActors();clearEffects();const ps=groundPositions(battle);combatText.setAnchors(Object.fromEntries([...battle.heroes,...battle.enemies].map(a=>[a.id,{x:ps[a.id].x,y:ps[a.id].y-bodySize(a)*.43/arenaMetrics.height*100}])));$('#actors').innerHTML=[...battle.enemies,...battle.heroes].map(a=>`<div id="actor-${a.id}" class="actor ${a.side==='e'?'enemy':''} ${a.boss?'boss':''}" style="left:${ps[a.id].x}%;top:${ps[a.id].y}%"><div class="hp-track"><div class="hp-trail" style="width:100%"></div><div class="hp-fill" style="width:100%"></div><div class="shield-fill"></div></div>${a.side==='p'?'<div class="energy-track"><div class="energy-fill"></div></div>':''}<span class="ground-shadow" aria-hidden="true"></span><div class="actor-body">${actorArt(a)}</div>${a.side==='e'?'<span class="target-mark"></span>':''}${a.materialDrop?'<span class="carrier-drop" aria-label="掉落'+MATERIAL_NAMES[a.materialDrop.id]+'">'+materialIcon(a.materialDrop.id,22)+'<b>'+a.materialDrop.count+'</b></span>':''}<span class="action-tag" hidden></span><span class="actor-tag" hidden></span>${a.boss?'<div class="charge-track" hidden><div class="charge-fill"></div></div>':''}</div>`).join('');for(const a of [...battle.heroes,...battle.enemies]){const el=$('#actor-'+a.id);actorRefs.set(a.id,{el,body:el.querySelector('.actor-body'),trail:el.querySelector('.hp-trail'),shadow:el.querySelector('.ground-shadow')});}renderVitals();}
function renderVitals(){if(!battle)return;const formation=groundPositions(battle),front=battle.frontlines();for(const a of [...battle.heroes,...battle.enemies]){const el=$('#actor-'+a.id);if(!el)continue;el.classList.toggle('frontline',front.includes(a));const targetMark=el.querySelector('.target-mark');if(targetMark){targetMark.hidden=a.hp<=0||!!battle.result||!a.charge;targetMark.textContent='蓄力：攻击全队';targetMark.classList.toggle('charging',a.charge>0);}el.classList.toggle('dead',a.hp<=0);el.classList.toggle('downed',a.side==='p'&&a.hp<=0);el.classList.toggle('stunned',a.stun>0&&a.hp>0);el.querySelector('.hp-fill').style.width=Math.max(0,a.hp/a.maxHp*100)+'%';el.querySelector('.shield-fill').style.width=Math.min(100,a.shield/a.maxHp*100)+'%';el.setAttribute('aria-label',`${a.name}，生命${Math.ceil(a.hp)}/${a.maxHp}${a.shield>0?'，护盾'+Math.ceil(a.shield):''}`);const energy=el.querySelector('.energy-fill');if(energy)energy.style.width=a.energy+'%';const badge=el.querySelector('.actor-tag');const tag=a.hp<=0?(a.side==='p'?'无法战斗':'已击败'):a.stun>0?'眩晕':a.burnTime>0?'灼烧':a.side==='e'&&a.armor>=40?'高护甲':a.side==='e'&&a.magicResist>=40?'高魔抗':'';badge.hidden=!tag;badge.textContent=tag;if(a.boss){el.querySelector('.charge-track').hidden=!(a.charge>0&&a.hp>0);el.querySelector('.charge-fill').style.width=(1-a.charge/2)*100+'%';}}
 const can=rescueView(battle,running);
 $('#battle-time').textContent=battle.result?(battle.result==='win'?'本场胜利':'暂时退回'):pausedBattle?'已暂停':!running?'准备出发':`第 ${battle.round||1} 回合`;
 const button=$('#open-can');button.disabled=!can.ready;button.classList.toggle('cooldown',can.rounds>0);button.classList.toggle('ready',can.ready);button.classList.toggle('interrupt-ready',can.ready&&can.charged);
 $('#can-label').textContent='罐头支援';$('#can-status').textContent=can.rounds>0?Math.ceil(can.rounds)+'回合':can.ready?'开罐':'补给中';$('#can-progress').style.width=can.progress*100+'%';
 $('#can-sub').textContent=can.charged?'打断':'回血';
 renderBossHUD();$('#rescue-tip').hidden=true;}
function renderBossHUD(){
 const info=bossView(battle),hud=$('#boss-hud');hud.hidden=!info;$('#arena').classList.toggle('has-boss',!!info);if(!info)return;
 const interrupted=bossNotice&&battle.time<bossNotice.until&&info.hp>0&&!battle.result;
 hud.dataset.state=info.hp<=0?'defeated':info.charging?'charging':interrupted?'interrupted':'ready';
 $('#boss-name').textContent=info.name;$('#boss-health').textContent=`${info.hp} / ${Math.ceil(info.maxHp)}`;$('#boss-health-fill').style.width=info.ratio*100+'%';const track=$('.boss-health-track');track.setAttribute('aria-valuemax',info.maxHp);track.setAttribute('aria-valuenow',info.hp);track.setAttribute('aria-valuetext',`${info.hp} / ${info.maxHp}`);
 $('#boss-charge-fill').style.width=info.charge*100+'%';$('#boss-countdown').textContent=info.charging?Math.ceil(info.rounds)+'回合':'';
 const label=info.hp<=0?'首领已击败':info.charging?'全队攻击即将落下':interrupted?'打断成功 · 全队避开群攻':'蓄力';
 const warning=$('#boss-warning');if(warning.textContent!==label)warning.textContent=label;
}

function battleAssetURLs(){
 const urls=[...SHARED_BATTLE_ASSETS];
 for(const el of document.querySelectorAll('#scene [data-asset],#actors [data-asset],#actors [data-atlas]')){if(el.dataset.asset)urls.push(el.dataset.asset);if(el.dataset.atlas)urls.push(el.dataset.atlas);}
 if(state.party.includes('pudding'))urls.push('./assets/vfx/shidun-impact-v0211.webp');
 // Small visible navigation/health UI is prepared with the fight, not on first use.
 for(const el of document.querySelectorAll('.bottom-nav *,#open-can *')){const css=getComputedStyle(el);for(const value of [css.backgroundImage,css.borderImageSource])for(const m of value.matchAll(/url\(["']?([^"')]+)["']?\)/g))urls.push(m[1]);}
 return urls;
}
async function prepareBattle(){
 const urls=battleAssetURLs();if(battleAssetsReady(urls)&&$('#boot-status')?.hidden)return true;
 const serial=++loadingSerial;resourceLoading=true;
 let layer=$('#boot-status');if(!layer){layer=document.createElement('div');layer.id='boot-status';document.body.append(layer);}
 layer.hidden=false;layer.removeAttribute('style');layer.className='loading-screen';
 layer.innerHTML='<section><span class="loading-can">'+icon('can',40)+'</span><h2>罐头远征队</h2><p id="loading-message">正在准备本场冒险</p><progress id="loading-progress" max="100" value="0"></progress><b id="loading-count">0%</b><small>角色、场景与特效准备完成后进入</small><button id="loading-retry" hidden>重新加载</button></section>';
 while(serial===loadingSerial){try{
  await loadBattleAssets(urls,{onProgress:(n,total)=>{if(serial!==loadingSerial)return;const percent=total?Math.round(n/total*100):100;$('#loading-progress').value=percent;$('#loading-count').textContent=percent+'% · '+n+'/'+total;}});
  if(serial!==loadingSerial)return false;
  // Decode and paint the first pose before exposing the arena.
  for(const a of [...battle.heroes,...battle.enemies]){const ref=actorRefs.get(a.id);if(ref)setPose(ref.body,0,{actor:a,time:battle.time,idleTime:battle.time,renderSize:bodySize(a,battle.time)});}
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(serial!==loadingSerial)return false;resourceLoading=false;layer.hidden=true;lastStamp=performance.now();renderGuide();return true;
 }catch{if(serial!==loadingSerial)return false;$('#loading-message').textContent='部分资源加载失败，请检查网络后重试';$('#loading-retry').hidden=false;await new Promise(resolve=>$('#loading-retry').onclick=resolve);$('#loading-retry').hidden=true;$('#loading-message').textContent='正在重新准备资源';}}
 return false;
}
function previewBattle(){battle=new Battle(state);idleOffset=ambientTime;renderStageHeader();renderActors();$('#battle-message').innerHTML='';}
async function startBattle({stage,arenaTier=0,weeklyTier=0,activity=null,entrance=false}={}){
 activityReturn.cancel();if(state.battleReport){showBattleReport();return;}if(state.pending){showLoot();return;}
 if(state.runCleared>=MAX_STAGE&&!arenaTier&&!weeklyTier&&!activity){showVictory();return;}
 const selected=arenaTier||weeklyTier||activity?stage:state.stage;
 farming=false;battle=new Battle(state,{stage:selected,arenaTier,weeklyTier,activity});idleOffset=ambientTime;running=false;nextDelay=0;$('#battle-message').innerHTML='';$('#battle-message').classList.remove('has-actions');$('#fx').innerHTML='';
 if(tab==='battle')combatEffects.warm(battle);renderStageHeader();renderActors();renderHeader();
 if(entrance||activity||arenaTier||weeklyTier){entranceRemaining=reducedMotion?.25:1.1;running=false;entranceLayer.innerHTML='<section><small>'+ (activity?'猫巷委托':arenaTier||weeklyTier?'街头挑战':'街区开拓')+'</small><h2>'+esc(battle.activity?.name||battle.weekly?.name||(arenaTier?'第 '+arenaTier+' 擂':'第 '+battle.stage+' 关'))+'</h2><div class="entrance-party">'+state.party.filter(Boolean).map(id=>catSVG(id,true)).join('')+'</div><i></i></section>';entranceLayer.hidden=false;}
 const prepared=battle;if(await prepareBattle()&&battle===prepared)running=entranceRemaining<=0;
}
function useCan(){if(!running||state.battleReport||modalType||tab!=='battle'||!battle||battle.result)return;if(battle.openCan()){if(!state.rescueSeen){state.rescueSeen=true;persist();}sound('can');playEvents(battle.events.splice(0));renderVitals();}}
function clearEffects(){combatText.clear();$('#fx').replaceChildren();}
function renderMotion(){if(resourceLoading||!battle||document.hidden||tab!=='battle'||modalType)return;const ground=groundPositions(battle),w=arenaMetrics.width,h=arenaMetrics.height,time=battle.time+endElapsed,sizes={},feet={};
 for(const a of [...battle.heroes,...battle.enemies]){const ref=actorRefs.get(a.id);if(!ref)continue;const {el,body,trail,shadow}=ref,size=bodySize(a,time);sizes[a.id]=size;el.style.setProperty('--actor-size',size.toFixed(2)+'px');el.style.left=ground[a.id].x+'%';el.style.top=ground[a.id].y+'%';const pose=poseFor(a,time);setPose(body,pose.frame,{actor:a,time,idleTime:time+idleOffset,outcome:battle.result,renderSize:size});el.dataset.phase=pose.phase;
  const targetId=a.action?.targetId||battle.targetFor(a)?.id,target=[...battle.heroes,...battle.enemies].find(b=>b.id===targetId),tar=ground[targetId],src=ground[a.id];
  const desired=travelOffset(a,pose,src,tar,w,h,size,target?bodySize(target,time):size,time),{x,y}=motionOffsets.value(a,desired,time);
  feet[a.id]={x:src.x*w/100+x,y:src.y*h/100+y};
  trail.style.width=healthTrails.value(a.id,a.hp/a.maxHp,time)*100+'%';
  if(a.action||ref.flip===undefined)ref.flip=tar?(tar.x<src.x?-1:1):a.side==='e'?-1:1;
  body.style.transform=`translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scaleX(${ref.flip})`;shadow.style.transform=`translate(calc(-50% + ${x.toFixed(2)}px),${y.toFixed(2)}px)`;
  el.classList.toggle('has-shield',a.shield>0&&a.hp>0);
 }
 const centers=positions(battle);guardEffects.render([...battle.heroes,...battle.enemies],time,centers,sizes,combatEffects);statusEffects.render([...battle.heroes,...battle.enemies],time,centers,sizes,combatEffects);renderCombatCues(time,w,h,centers,sizes,feet);
 combatText.render(time);
}
function renderCombatCues(time,w,h,centers,sizes,feet){
 const active=battleCues.active(time);combatEffects.render(active,time,w,h,centers,sizes,feet);
 for(const a of [...battle.heroes,...battle.enemies]){const el=actorRefs.get(a.id)?.el;if(!el)continue;const outgoing=active.find(r=>r.from===a.id&&r.label!=='普攻');el.style.setProperty('--cue-color',cueColors[outgoing?.tone]||'transparent');const badge=el.querySelector('.action-tag');badge.hidden=!outgoing||a.hp<=0;badge.textContent=outgoing?.label||'';}
}
function playEvents(events){if(!battle||!events.length||tab!=='battle'||modalType)return;const p=positions(battle),previous=p;battleCues.consume(events,battle,previous);combatText.consume(events,previous,battle.time);let hitSound=false;for(const e of events){const target=previous[e.to]||p[e.to],source=previous[e.from]||p[e.from];if(!target)continue;
 // Release effects are rendered from the same action clock as impact.
 if(e.type==='hit'&&e.value>0)hitSound=true;
 if(e.type==='interrupt')bossNotice={until:battle.time+2.2};
 if(e.type==='skill')sound('skill');
 if(e.type==='burst'){combatEffects.emit('dust',source,battle.time,76,.60);}
 }if(events.some(e=>e.type==='heal'))sound('heal');else if(events.some(e=>e.type==='shield'))sound('shield');if(hitSound)sound('hit');if(events.some(e=>['hit','heal','shield','down'].includes(e.type)))renderVitals();}

function onBattleEnd(){
 for(const a of [...battle.heroes,...battle.enemies])a.action=null;
 const before={scrap:state.inventory.materials.scrap,essence:state.inventory.materials.essence};
 const result=settleBattle(state,battle);running=false;if(!result)return;
 if(!battle.activity&&!battle.weekly&&battle.mode!=='arena'&&!result.win){state.battleReport=null;persist();startBattle();return;}
 if(result.win&&!battle.activity&&!battle.weekly&&battle.mode!=='arena'){state.battleReport=null;persist();renderHeader();renderParty();renderVitals();sound('win');$('#battle-message').innerHTML=rewardIcons(result);guideEvent('win');nextDelay=result.complete||state.guideStep>1&&state.guideStep<8?0:1.2;return;}
 const report=battleReport(battle,result);report.rewards.scrap=state.inventory.materials.scrap-before.scrap;report.rewards.essence=state.inventory.materials.essence-before.essence;
 state.battleReport=report;persist();renderHeader();renderParty();renderVitals();sound(result.win?'win':'lose');showBattleReport();
}
function showBattleReport(){if(!state.battleReport)return;running=false;resultLayer.innerHTML=resultHTML(state.battleReport,state.inventory.items);resultLayer.hidden=false;resultLayer.querySelector('.battle-result').focus({preventScroll:true});}
function reportRequest(r){return r.mode==='activity'?{activity:{kind:r.route.group==='materials'?r.route.id:r.route.group,id:r.route.group==='materials'?'':r.route.id,tier:r.route.tier}}:r.mode==='patrol'?{entrance:true}:r.request||{};}
function dismissReport(action){const r=state.battleReport;if(!r)return;state.battleReport=null;persist();resultLayer.hidden=true;resultLayer.innerHTML='';
 if(action==='retry'){forceClose();changeTab('battle');startBattle(reportRequest(r));return;}
 if(action==='crew'){forceClose();$('#battle-message').innerHTML='<button id="resume-challenge">再挑战</button>';$('#resume-challenge').onclick=()=>startBattle(reportRequest(r));crewMode='formation';changeTab('cats');return;}
 if(r.mode==='activity'){startBattle();returnToStreet(r.route);return;}
 if(r.mode!=='patrol'){startBattle();changeTab('map');openDistrict('challenges');return;}
 if(r.win){if(!modalType)startBattle();else nextDelay=0;return;}
 $('#battle-message').classList.add('has-actions');$('#battle-message').innerHTML='<div class="activity-result-actions"><button id="patrol-retry">再挑战</button><button id="patrol-crew">调整阵容</button></div>';$('#patrol-retry').onclick=()=>startBattle({entrance:true});$('#patrol-crew').onclick=openFormation;
}
resultLayer.addEventListener('click',e=>{
 const r=state.battleReport;if(!r)return;const material=e.target.closest('[data-result-material]'),gear=e.target.closest('[data-result-gear]'),card=resultLayer.querySelector('.result-item');
 if(material){const key=material.dataset.resultMaterial;card.hidden=false;card.innerHTML=materialIcon(key,62,r.companion)+'<h3>'+esc(key==='shards'&&cat(r.companion)?cat(r.companion).name+'的信物':MATERIAL_NAMES[key])+'</h3><p>'+esc(MATERIAL_INFO[key]?.description||'')+'</p>';return;}
 if(gear){const item=state.inventory.items.find(x=>x.id===r.gearUid);card.hidden=false;card.innerHTML=resultGearHTML(item);return;}
 if(e.target.closest('[data-result-retry]')){dismissReport('retry');return;}
 if(e.target.closest('[data-result-crew]')){dismissReport('crew');return;}
 if(e.target.closest('.result-item,button,a,input,select,textarea'))return;
 if(!card.hidden){card.hidden=true;return;}dismissReport();
});
function changeTab(next){if(next!=='map')districtTools.hidden=true;if(next!=='battle')activityReturn.cancel();disposeDistrict?.();disposeDistrict=null;disposeFormation?.();disposeFormation=null;tab=next;$('#battle-view').hidden=next!=='battle';$('#other-view').hidden=next==='battle';$$('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===next));if(next==='battle'){if(!running&&!pausedBattle&&battle&&!battle.result&&!state.battleReport&&entranceRemaining<=0)running=true;lastStamp=performance.now();sizeActors();renderVitals();if(running)combatEffects.warm(battle);}if(next==='battle'&&state.guideStep===7&&battle?.result)startBattle();if(next==='cats')renderCats();if(next==='relics')renderRelics();if(next==='map')renderMap();$('.game-shell').scrollIntoView({block:'start',behavior:'auto'});}
function renderCats(){
 const scroller=$('#other-view'),scroll=scroller.scrollTop,railScroll=$('#crew-roster')?.scrollLeft||0,detailScroll=$('#crew-detail')?.scrollTop||0,bagScroll=$('.equipment-bag .gear-list')?.scrollTop||0;
 disposeFormation?.();disposeFormation=null;if(crewMode==='equipment'&&!ownsCompanion(state,selectedCrew))selectedCrew=unlocked(state)[0].id;bagView.cat=selectedCrew;
 const modes=[['profile','养成'],['equipment','装备'],['formation','阵容']];
 scroller.innerHTML='<div class="view-padding crew-view" data-mode="'+crewMode+'"><div class="crew-modes"><span class="club-can" aria-hidden="true">'+icon('can',23)+'</span>'+modes.map(([id,name])=>'<button data-crew-mode="'+id+'" aria-pressed="'+(crewMode===id)+'">'+name+'</button>').join('')+'</div>'+'<div class="crew-wallet" aria-label="持有鱼币">'+icon('coin',18)+'<b data-wallet-gold>'+Math.floor(state.gold).toLocaleString('zh-CN')+'</b><span>鱼币</span></div>'+(crewMode==='formation'?crewFormationHTML(state):'<div class="crew-avatar-rail" id="crew-roster" aria-label="选择伙伴">'+crewRosterHTML(state,selectedCrew)+'</div><div id="crew-detail">'+(crewMode==='equipment'?crewEquipmentHTML(state,selectedCrew,bagView):crewProfileHTML(state,selectedCrew))+'</div>')+'</div>';

 $$('[data-crew-mode]').forEach(b=>b.onclick=()=>{crewMode=b.dataset.crewMode;bagView.page=0;scroller.scrollTop=0;renderCats();});
 if(crewMode==='formation')disposeFormation=bindFormationDrag($('.crew-formation'),{scrollElement:scroller,onDrop:equipCrew,onRemove:benchCrew,describe:(id,slot)=>formationDropText(state,id,slot)});
 else{
  $('#crew-roster').scrollLeft=railScroll;$('#crew-detail').scrollTop=detailScroll;if($('.equipment-bag .gear-list'))$('.equipment-bag .gear-list').scrollTop=bagScroll;
  if(crewMode==='equipment')bindEquipment();else bindCrewProfile($('#crew-detail'),selectedCrew);
  $$('#crew-roster [data-crew]').forEach(button=>button.onclick=()=>{selectedCrew=button.dataset.crew;if(!ownsCompanion(state,selectedCrew))crewMode='profile';bagView.page=0;renderCats();});
 }
 $$('.crew-quick-upgrade').forEach(button=>button.onclick=()=>train(button.dataset.upgrade,+(button.dataset.upgradeCount||1)));
 updateUpgradeButtons();scroller.scrollTop=scroll;
}
function openFormation(){if(modalType==='cat')forceClose();crewMode='formation';changeTab('cats');$('#other-view').scrollTop=0;}
function equipCrew(id,slot){
 if(state.party[slot]===id)return;
 const message=formationDropText(state,id,slot);
 if(!setParty(state,slot,id))return;
 persist();renderHeader();if(tab==='cats')renderCats();
 restartWithCrew();
 toast(message);
}
function restartWithCrew(){if(!battle)return;const request={stage:battle.stage,arenaTier:battle.arenaTier||0,weeklyTier:battle.weekly?.tier||0,activity:battle.activity?.request||null};if(state.battleReport){battle=new Battle(state,request);running=false;renderStageHeader();renderActors();return;}startBattle(request);}
function benchCrew(id){if(!removeParty(state,id)){toast('至少保留一位出战伙伴');return;}persist();renderHeader();renderCats();restartWithCrew();toast(cat(id).name+'已下场');}
function showGrowthSuccess(id,label){
 for(const hero of document.querySelectorAll('[data-profile-cat="'+id+'"] .crew-hero')){
  const effect=document.createElement('div');effect.className='growth-success';effect.setAttribute('role','status');effect.textContent=label;hero.append(effect);hero.classList.remove('growth-flash');void hero.offsetWidth;hero.classList.add('growth-flash');setTimeout(()=>{effect.remove();hero.classList.remove('growth-flash');},1800);
 }
}
function showCatTag(id){
 openModal('cat-tag',catTagCardHTML(state,id));
 $('#cat-tag-upgrade')?.addEventListener('click',()=>{const before=state.roster.stars[id];if(!ascendCompanion(state,id))return;battle?.syncStats(state,{preserveHealthRatio:true});persist();renderHeader();if(tab==='cats')renderCats();showCatTag(id);sound('coin');toast(state.roster.stars[id]>before?'猫牌进阶 · '+BADGE_NAMES[state.roster.stars[id]]:'猫牌爪印已点亮');});
}
function bindCrewProfile(root,id){
 root.querySelector('[data-cat-tag]')?.addEventListener('click',()=>showCatTag(id));
 root.querySelector('[data-breakthrough]')?.addEventListener('click',()=>{if(!breakthrough(state,id))return;battle?.syncStats(state,{preserveHealthRatio:true});persist();renderHeader();if(modalType==='cat')showCat(id,true);else renderCats();showGrowthSuccess(id,'绝活 Lv.'+(state.breakthroughs[id]+1));toast(cat(id).name+'的'+cat(id).skill+'升至 Lv.'+(state.breakthroughs[id]+1));});
 root.querySelector('[data-ascend]')?.addEventListener('click',()=>{if(!ascendCompanion(state,id))return;battle?.syncStats(state,{preserveHealthRatio:true});persist();renderHeader();if(modalType==='cat')showCat(id,true);else renderCats();showGrowthSuccess(id,BADGE_NAMES[state.roster.stars[id]]+'晋升');toast(cat(id).name+'获得'+BADGE_NAMES[state.roster.stars[id]]);});
 root.querySelector('[data-companion-contract]')?.addEventListener('click',()=>openStreet('recruit',id));
 root.querySelector('[data-growth-materials]')?.addEventListener('click',()=>openStreet('materials','escort'));
 root.querySelector('[data-upgrade]')?.addEventListener('click',e=>train(id,+(e.currentTarget.dataset.upgradeCount||1)));
 root.querySelector('[data-inherit-open]')?.addEventListener('click',()=>showInheritance(id));
 root.querySelector('[data-open-formation]')?.addEventListener('click',openFormation);
}
const bagView={tab:'equipment',cat:'orange',slot:'',set:'',page:0};
function refreshEquipment(){const y=$('#other-view').scrollTop;if(tab==='cats')renderCats();else renderRelics();$('#other-view').scrollTop=y;}
function bindEquipment(){
 $$('[data-set-detail]').forEach(b=>b.onclick=()=>{const set=GEAR_SETS.find(x=>x.id===b.dataset.setDetail),count=gearBonuses(state,selectedCrew).counts[set.id]||0;gearAnchor=b.getBoundingClientRect();openModal('equipment',`<h2>${set.name} ${count}/4</h2><div class="gear-set-summary"><p>${count>=2?'已激活':'未激活'} · 2件</p><p>${set.two}</p><p>${count>=4?'已激活':'未激活'} · 4件</p><p>${set.four}</p></div>`);positionGearCard();});
 $$('[data-bag-slot]').forEach(b=>b.onclick=()=>{bagView.slot=b.dataset.bagSlot;bagView.page=0;refreshEquipment();});
 const set=$('#bag-set');if(set)set.onchange=()=>{bagView.set=set.value;bagView.page=0;refreshEquipment();};
 $$('[data-gear]').forEach(b=>b.onclick=()=>showGear(b.dataset.gear,b));
 $$('.crew-equipment [data-slot]').forEach(b=>b.onclick=()=>{const slot=b.dataset.slot,uid=b.dataset.equipped;bagView.slot=bagView.slot===slot?'':slot;bagView.page=0;refreshEquipment();if(uid)showGear(uid,document.querySelector('.crew-equipment [data-slot="'+slot+'"]'));});

 $$('[data-page]').forEach(b=>b.onclick=()=>{bagView.page+=+b.dataset.page;refreshEquipment();});
 const craft=$('#gear-craft');if(craft)craft.onclick=()=>{openModal('craft',craftHTML(state));$('#craft-confirm').onclick=()=>{const e=craftGear(state,$('#craft-set').value,$('#craft-slot').value);if(e){persist();renderHeader();refreshEquipment();showGear(e.id);}};};
}
function renderRelics(){
 $('#other-view').innerHTML=inventoryHTML(state,bagView);
 $$('[data-bag-tab]').forEach(b=>b.onclick=()=>{bagView.tab=b.dataset.bagTab;bagView.page=0;renderRelics();});bindEquipment();
}
let gearAnchor=null;
function showGear(uid,anchor=null){
 const e=state.inventory.items.find(e=>e.id===uid);if(!e)return;if(anchor)gearAnchor=anchor.getBoundingClientRect();openModal('equipment',gearDetailHTML(state,uid,bagView.cat));positionGearCard();guideEvent('gear');
 const update=()=>{persist();renderHeader();refreshEquipment();showGear(uid);};
 $('#gear-equip').onclick=()=>{if(gearOwner(state,uid)===bagView.cat)unequipGear(state,bagView.cat,e.slot);else if(!equipGear(state,uid,bagView.cat,unlocked(state).map(c=>c.id)))return;persist();renderHeader();forceClose();refreshEquipment();};
 $('#gear-enhance')?.addEventListener('click',()=>{if(enhanceGear(state,uid)){update();sound('coin');}});
 $$('[data-reforge]').forEach(b=>b.onclick=()=>{if(reforgeGear(state,uid,+b.dataset.reforge))update();});
 $('#gear-lock').onclick=()=>{e.locked=!e.locked;update();};
 $('#gear-dismantle').onclick=()=>{openModal('dismantle',`<h2 id="modal-title">分解 ${gearName(e)}？</h2><button id="dismantle-confirm" class="primary wide">确认分解</button>`);$('#dismantle-confirm').onclick=()=>{const r=dismantleGear(state,uid);if(r){persist();forceClose();refreshEquipment();toast('分解完成');}};};
}
function positionGearCard(){const card=$('#modal'),shell=$('.game-shell').getBoundingClientRect(),r=gearAnchor;const width=Math.min(270,shell.width-24,innerWidth-24);card.style.width=width+'px';const h=card.getBoundingClientRect().height;const left=r?(r.left+r.width/2<shell.left+shell.width/2?r.right+8:r.left-width-8):shell.left+(shell.width-width)/2;card.style.left=Math.max(12,Math.min(innerWidth-width-12,Math.max(shell.left+8,Math.min(shell.right-width-8,left))))+'px';card.style.top=Math.max(12,Math.min(innerHeight-h-12,r?r.top:innerHeight/2-h/2))+'px';}
function renderFishStall(){
 const rate=$('#idle-rate'),amount=$('#idle-amount'),button=$('#battle-income'),bar=$('#battle-income-progress');
 const cap=idleRate(state)*idleMinutes(state),value=Math.floor(state.idle);
 if(button){button.classList.toggle('has-income',value>0);button.classList.toggle('income-full',value>=cap);button.setAttribute('aria-label',`领取鱼摊收益 ${value} 鱼币`);}
 if(bar){bar.max=cap;bar.value=value;bar.setAttribute('aria-valuetext',`${value} / ${cap} 鱼币`);}
 if(rate)rate.textContent=fmt(idleRate(state))+' 鱼币';
 if(amount)amount.textContent='领取 +'+fmt(state.idle);if(modalType==='stall'&&$('#idle-claim'))$('#idle-claim').innerHTML='收取 '+rewardIcons({gold:Math.floor(state.idle),supplies:state.idleSupplies||0});
}
function claimFishStall(){
 accrueIdle(state);const supplies=state.idleSupplies||0,n=claimIdle(state);persist();renderHeader();
 if(n||supplies){sound('coin');toast('鱼币 +'+fmt(n)+' · 经营物资 +'+supplies);}else toast('鱼摊正营业，稍后再来收取。');
}
const districtTools=document.querySelector('#district-tools');
function renderMap(){disposeDistrict?.();$('#other-view').innerHTML=districtHTML(state);districtTools.hidden=false;$('#other-view').prepend(districtTools);disposeDistrict=bindDistrictInput($('.district-scene'),openDistrict,{reducedMotion});}
function openDistrict(place){
 if(place==='journal'){openModal('journal',campaignHTML(state));const claim=fn=>{if(fn()){persist();renderHeader();openDistrict('journal');sound('coin');}};$$('[data-daily]').forEach(b=>b.onclick=()=>claim(()=>claimDaily(state,b.dataset.daily)));$('#daily-chest').onclick=()=>claim(()=>claimDailyChest(state));$$('[data-journey]').forEach(b=>b.onclick=()=>claim(()=>claimJourney(state,b.dataset.journey)));return;}

 if(place==='crew'){changeTab('cats');return;}
 if(place==='patrol'){showPatrolRoutes();return;}
 if(place==='stall'){accrueIdle(state);openModal('stall',stallHTML(state));$('#idle-claim').onclick=()=>{claimFishStall();openDistrict('stall');};$('#stall-patrol').onclick=showPatrolRoutes;$$('[data-stall-upgrade]').forEach(b=>b.onclick=()=>{if(upgradeStall(state,b.dataset.stallUpgrade)){persist();renderHeader();openDistrict('stall');if(tab==='map')renderMap();toast('鱼摊升级完成');}});return;}
 if(place==='arena'){openModal('arena',streetHubHTML());$$('[data-street-group]').forEach(b=>b.onclick=()=>openStreet(b.dataset.streetGroup));$('#open-journal').onclick=()=>openDistrict('journal');$('#open-challenges').onclick=()=>openDistrict('challenges');return;}
 if(place==='challenges'){openModal('challenges',chapterBanner('challenge','街头挑战')+'<button id="open-journal" class="primary wide">猫巷手账 · 每日委托与成长之路</button>'+weeklyHTML(state)+arenaHTML(state).replace(' id="modal-title"',''));$('#open-journal').onclick=()=>openDistrict('journal');$$('[data-weekly]').forEach(b=>b.onclick=()=>{forceClose();changeTab('battle');startBattle({weeklyTier:+b.dataset.weekly});});$$('[data-arena-tier]').forEach(b=>b.onclick=()=>{const tier=+b.dataset.arenaTier;if(!arenaOpen(state,tier))return;forceClose();changeTab('battle');startBattle({arenaTier:tier});});}
}
const streetView={group:'recruit',id:'milk',tier:1};
function openStreet(group=streetView.group,id){if(group!==streetView.group||id&&id!==streetView.id)streetView.tier=1;streetView.group=group;if(id)streetView.id=id;const html=streetHTML(state,streetView);if(modalType==='street'&&!$('#modal-backdrop').hidden){const panel=$('#modal'),scroll=panel.scrollTop,choiceScroll=panel.querySelector('.street-choices')?.scrollTop||0,focused=document.activeElement,keys=['streetChoice','streetGroup','streetLevel','streetTier'],key=keys.find(k=>focused?.dataset?.[k]!==undefined),value=key?focused.dataset[key]:null;$('#modal-content').innerHTML=html;panel.scrollTop=scroll;const choices=panel.querySelector('.street-choices');if(choices)choices.scrollTop=choiceScroll;if(key){const attr='data-'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase());[...panel.querySelectorAll('['+attr+']')].find(e=>e.getAttribute(attr)===value)?.focus({preventScroll:true});}}else openModal('street',html);
 $$('[data-street-group]').forEach(b=>b.onclick=()=>openStreet(b.dataset.streetGroup));$$('[data-street-choice]').forEach(b=>b.onclick=()=>{streetView.tier=1;openStreet(group,b.dataset.streetChoice);});
 $$('[data-street-level]').forEach(b=>b.onclick=()=>{streetView.tier=+b.dataset.streetLevel;openStreet();});
 $$('[data-street-tier]').forEach(b=>b.onclick=()=>{streetView.tier+=+b.dataset.streetTier;openStreet();});
 $('#street-fight').onclick=()=>{const q=streetSelection(state,streetView);if(!q.open)return;forceClose();changeTab('battle');startBattle({activity:q.request});};
 const recruitButton=$('#recruit-current');if(recruitButton)recruitButton.onclick=()=>{if(recruitCompanion(state,streetView.id)){persist();renderHeader();renderParty();if(state.party.includes(streetView.id))restartWithCrew();openStreet();toast(cat(streetView.id).name+'加入了远征队');}};
}
function returnToStreet(route){activityReturn.cancel();Object.assign(streetView,route);changeTab('map');openStreet();}
function showPatrolRoutes(){const finished=state.runCleared>=MAX_STAGE;openModal('routes',`<h2 id="modal-title">街区开拓</h2><button id="patrol-current" class="primary wide" ${finished?'disabled':''}>${finished?'街区已开拓':'继续第 '+state.stage+' 关'}</button>${Array.from({length:MAX_STAGE/20},(_,i)=>{const c=CHAPTERS[i%6],cleared=Math.min(20,Math.max(0,state.runCleared-i*20)),current=!finished&&Math.floor((state.stage-1)/20)===i;return `<div class="chapter-card route-progress ${current?'current':''}"><div class="chapter-thumb">${sceneSVG(i%6)}</div><div><h3>${c.name} · ${Math.floor(i/6)+1}</h3><small>${cleared}/20</small></div><strong>${cleared===20?'✓':current?'›':'·'}</strong></div>`;}).join('')}`);$('#patrol-current').onclick=()=>{if(finished)return;forceClose();changeTab('battle');startBattle({entrance:true});};}
function renderDistrictAmbient(time){if(tab!=='map'||modalType)return;const c=$('.district-ambient');if(!c)return;const r=c.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1),w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);if(c.width!==w||c.height!==h){c.width=w;c.height=h;}const ctx=c.getContext('2d');ctx.clearRect(0,0,w,h);paintDistrictAmbient(ctx,0,0,w,h,reducedMotion?0:time);const tap=c.parentElement._districtTap;if(tap&&!reducedMotion){const age=tap.phase==='press'?0:performance.now()/1000-tap.at;paintDistrictObjects(ctx,{scene:c.parentElement.querySelector('img')},0,0,w,h,tap.phase==='press'?tap.id:null,{...tap,age});}}
function pauseBattle(){
 if(pausedBattle||!battle||state.battleReport||modalType)return;
 pausedBattle={running};running=false;
 openModal('pause','<section class="pause-menu"><h2 id="modal-title">歇一会儿</h2><button id="battle-continue" class="primary wide">继续战斗</button><div class="pause-audio"><button id="pause-music">音乐 '+(state.music?'开':'关')+'</button><button id="pause-sound">音效 '+(state.sound?'开':'关')+'</button></div><button id="battle-return" class="secondary wide">返回'+(battle.activity?'委托板':'街区')+'</button></section>');
 $('#battle-continue').onclick=resumeBattle;$('#pause-music').onclick=e=>{state.music=!state.music;audioSettings();persist();e.currentTarget.textContent='音乐 '+(state.music?'开':'关');};$('#pause-sound').onclick=e=>{state.sound=!state.sound;audioSettings();persist();e.currentTarget.textContent='音效 '+(state.sound?'开':'关');};
 $('#battle-return').onclick=()=>{const q=battle.activity;pausedBattle=null;entranceRemaining=0;entranceLayer.hidden=true;nextDelay=0;running=false;forceClose();if(q){startBattle();returnToStreet({group:['recruit','hunt','hard'].includes(q.kind)?q.kind:'materials',id:q.id||q.kind,tier:q.tier});}else{changeTab('map');}};
 renderVitals();
}
function resumeBattle(){if(!pausedBattle)return;running=pausedBattle.running;pausedBattle=null;lastStamp=performance.now();forceClose();renderVitals();$('#battle-pause').focus();}
function openModal(type,html,mandatory=false){$('#modal').style.removeProperty('width');$('#modal').style.removeProperty('left');$('#modal').style.removeProperty('top');activityReturn.cancel();modalType=type;$('#modal').dataset.kind=type;$('#modal-content').innerHTML=html;$('#modal-backdrop').hidden=false;$('#modal-close').hidden=mandatory;$('#modal').scrollTop=0;$('#modal').focus({preventScroll:true});}
function closeModal(){if(modalType==='pause'){resumeBattle();return;}if(modalType==='loot'||modalType==='intro')return;$('#modal-backdrop').hidden=true;modalType=null;gearAnchor=null;if(queue.length)queue.shift()();else if(state.runCleared<MAX_STAGE&&!state.battleReport&&battle?.result==='win'&&battle.mode==='patrol'&&(state.guideStep<2||state.guideStep>=8))startBattle();}
function forceClose(){modalType=null;$('#modal-backdrop').hidden=true;gearAnchor=null;if(queue.length)queue.shift()();}
function showIntro(){openModal('intro',`<div class="intro-hero">${catSVG('orange')}${catSVG('ink')}</div><h2 id="modal-title" class="intro-title">罐头远征队</h2><p class="intro-how">橘座和阿墨准备好了。先从第 1 关出发，伙伴会自动战斗。</p><button id="intro-start" class="primary wide">出发 ${icon('arrow',19)}</button>`,true);$('#intro-start').onclick=()=>{state.onboarded=true;guideEvent('start');persist();forceClose();startBattle();};}
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

function showVictory(){running=false;openModal('victory',`<h2 id="modal-title">这条街，已经走遍。</h2><button id="victory-map" class="primary wide">回到街区</button>`);$('#victory-map').onclick=()=>{forceClose();changeTab('map');};}

function showSettings(){openModal('settings',`<div class="eyebrow">TAKE YOUR TIME / 设置与存档</div><h2 id="modal-title">猫猫休息室</h2><div class="settings-row"><span>音效</span><button id="toggle-sound">${state.sound?'已开启':'已关闭'}</button></div><div class="settings-row"><span>背景音乐</span><button id="toggle-music">${state.music?'已开启':'已关闭'}</button></div><div class="settings-row"><span>本机保存</span><span>${saveOK?'正常 · 自动保存':'不可用，请导出'}</span></div><div class="settings-row"><span>已通过 / 历史最高</span><span>${state.runCleared} / ${state.highest}</span></div><div class="settings-row"><span>离线资源</span><span>${swReady?'缓存已就绪':'联网游玩可用'}</span></div><div class="settings-actions"><button class="secondary" id="save-export">导出存档</button><button class="secondary" id="save-import">导入存档</button><button class="secondary" id="share-game">分享游戏</button></div><small>0.26.88 · 本机存档</small><button class="text-btn" id="reset-open">重新开始一份存档…</button>`);$('#toggle-music').onclick=()=>{state.music=!state.music;audioSettings();gameAudio.unlock();persist();showSettings();};$('#toggle-sound').onclick=()=>{state.sound=!state.sound;audioSettings();gameAudio.unlock();persist();showSettings();if(state.sound)sound('coin');};$('#save-export').onclick=showExport;$('#save-import').onclick=showImport;$('#share-game').onclick=shareGame;$('#reset-open').onclick=showReset;}
function showExport(){accrueIdle(state);persist();const data=encodeSave(state);openModal('export',`<h2 id="modal-title">把猫猫存档带走</h2><p>下载 JSON 文件保存，或复制下方完整存档文字。导入时会替换目标设备的游戏进度。</p><textarea class="save-text" id="export-text" aria-label="完整存档文字" readonly></textarea><div class="settings-actions"><button id="download-save" class="primary">下载存档文件</button><button id="copy-save" class="secondary">复制存档文字</button></div>`);$('#export-text').value=data;$('#download-save').onclick=()=>{const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='can-club-save.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('已开始下载存档');};$('#copy-save').onclick=async()=>{try{await navigator.clipboard.writeText(data);toast('存档已复制');}catch{$('#export-text').select();toast('请长按或按 Ctrl/Cmd+C 复制选中的文字。');}};}
function showImport(){openModal('import',`<h2 id="modal-title">导入一份存档</h2><p>粘贴完整存档文字，或者选择此前导出的 JSON 文件。校验通过后会先显示进度，确认后才会替换。</p><input id="import-file" type="file" accept=".json,application/json" aria-label="选择存档文件"><textarea id="import-text" class="save-text" placeholder="把完整存档文字粘贴到这里" aria-label="待导入的存档文字"></textarea><p id="import-error" class="error-text" role="status"></p><button id="check-import" class="primary wide">检查这份存档</button>`);$('#import-file').onchange=async e=>{const f=e.target.files[0];if(!f)return;if(f.size>100000){$('#import-error').textContent='文件过大，请选择本游戏导出的存档。';return}$('#import-text').value=await f.text();};$('#check-import').onclick=()=>{try{const incoming=decodeSave($('#import-text').value);openModal('confirm-import',`<h2 id="modal-title">这份存档可以读取。</h2><div class="stats-row"><div><b>${incoming.highest}</b><small>历史最高关卡</small></div><div><b>${fmt(incoming.gold)}</b><small>鱼币</small></div><div><b>${incoming.bones}</b><small>永久鱼骨</small></div></div><p>将替换当前进度。需要保留当前存档的话，请先关闭此窗口，再导出备份。</p><button id="apply-import" class="primary wide">确认替换当前进度</button>`);$('#apply-import').onclick=()=>{state=incoming;accrueIdle(state);queue=[];persist();forceClose();running=false;farming=false;changeTab('battle');renderHeader();renderParty();previewBattle();if(state.pending)showLoot();else if(!state.onboarded)showIntro();else startBattle();toast('存档已导入');};}catch(err){$('#import-error').textContent=err.message;}};}
async function shareGame(){const url=location.origin+location.pathname;try{if(navigator.share){await navigator.share({title:'罐头远征队',text:'带上五只猫，拿下一条街。来试试这款原创放置冒险。',url});}else{await navigator.clipboard.writeText(url);toast('游戏链接已复制');}}catch(e){if(e.name==='AbortError')return;openModal('share',`<h2 id="modal-title">一起逛逛这条街</h2><p>复制下面的公开游戏地址发给朋友。不会分享你的存档。</p><textarea class="save-text" aria-label="游戏地址" readonly>${esc(url)}</textarea>`);}}

function showReset(){openModal('reset',`<h2 id="modal-title">确定重新开始？</h2><p>会清空当前浏览器内的队员训练、关卡、鱼币和装备。建议先导出存档。重新开始后无法在游戏内撤销。</p><button id="confirm-reset" class="danger wide">确认清空，重新开始</button>`);$('#confirm-reset').onclick=()=>{state=initialState();queue=[];running=false;farming=false;try{localStorage.removeItem(BACKUP);localStorage.removeItem(KEY);}catch{}persist();forceClose();renderHeader();renderParty();changeTab('battle');previewBattle();showIntro();};}

$('#battle-income').onclick=claimFishStall;$('.income-coin').innerHTML=icon('coin',15);
$('#desktop-cat').innerHTML=catSVG('orange');$('#settings').innerHTML=icon('settings',18)+'<span>设置</span>';$('#quest-icon').innerHTML=icon('gift',23);$('#can-icon').innerHTML=icon('can',45);$('#modal-close').innerHTML=icon('close',17);
const navIcons={battle:'can',cats:'paw',relics:'bag',map:'map'};$$('[data-tab]').forEach(b=>{b.querySelector('span').innerHTML=icon(navIcons[b.dataset.tab],24);b.onclick=()=>changeTab(b.dataset.tab);});
$('#settings').onclick=showSettings;$('#quests').onclick=showQuests;$('#objective').onclick=showQuests;$('#battle-pause').onclick=pauseBattle;$('#modal-close').onclick=closeModal;$('#modal-backdrop').onclick=e=>{if(e.target===$('#modal-backdrop'))closeModal();};
$('#open-can').onclick=useCan;$('#speed').onclick=()=>{state.speed=state.speed===1?2:1;persist();renderHeader();};

document.addEventListener('keydown',e=>{if(!resultLayer.hidden){if(e.key==='Escape'){const card=resultLayer.querySelector('.result-item');if(card&&!card.hidden)card.hidden=true;else dismissReport();}if(e.key==='Tab'){const items=[...resultLayer.querySelectorAll('button')];if(items.length){const i=items.indexOf(document.activeElement);e.preventDefault();items[(i+(e.shiftKey?-1:1)+items.length)%items.length].focus();}else e.preventDefault();}return;}if(e.key==='Escape'){closeModal();return}if(e.code==='Space'&&!['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)&&tab==='battle'&&!modalType){e.preventDefault();useCan();}if(e.key==='Tab'&&modalType){const focusables=[...$('#modal').querySelectorAll('button:not([disabled]):not([hidden]),summary,textarea,input')].filter(x=>x.offsetParent!==null);if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===$('#modal'))){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
document.addEventListener('visibilitychange',()=>{audioSettings();if(!document.hidden)gameAudio.unlock();lastStamp=performance.now();accrueIdle(state);persist();renderHeader();});window.addEventListener('pagehide',()=>{accrueIdle(state);persist();});
function frame(now){requestAnimationFrame(frame);const dt=lastStamp?Math.min(.1,(now-lastStamp)/1000):0;lastStamp=now;if(!document.hidden){ambientTime+=dt;if(battle?.time===0&&!running)idleOffset+=dt;}
 if(!resourceLoading&&!document.hidden&&!pausedBattle&&entranceRemaining>0){entranceRemaining-=dt;if(entranceRemaining<=0){entranceLayer.hidden=true;running=true;}}
 if(!resourceLoading&&!document.hidden&&running&&!state.battleReport){if(battle&&!battle.result){let remain=dt*battleRate(state.speed);while(remain>0&&!battle.result){const slice=Math.min(.1,remain);playEvents(battle.tick(slice));remain-=slice;}if(battle.result&&!battle.resolved)onBattleEnd();}}
 if(!resourceLoading&&!document.hidden&&!pausedBattle&&nextDelay>0&&!state.battleReport){nextDelay-=dt;if(nextDelay<=0)startBattle();}
 if(battle?.result&&!document.hidden&&tab==='battle'&&!modalType)endElapsed+=dt;
 if(!document.hidden&&tab==='battle'&&!modalType){const route=activityReturn.update(ambientTime);if(route)returnToStreet(route);}
 if(!document.hidden&&tab==='battle'&&now-idlePaintStamp>=1000/30){const rain=$('#scene .scene-rain');if(rain)paintRain(rain,ambientTime,arenaMetrics.size,reducedMotion);}
 renderMotion();if(tab==='map'&&(now-renderStamp>100||$('.district-scene')?._districtTap))renderDistrictAmbient(ambientTime);
 if(!document.hidden&&now-idlePaintStamp>=1000/30){idlePaintStamp=now;for(const sprite of $$('.companion-body')){
  if(sprite.closest('#actors,.formation-ghost,.intro-hero,[hidden]'))continue;
  const box=sprite.getBoundingClientRect();if(!box.width||!box.height||box.bottom<0||box.top>innerHeight)continue;
  const unit=arenaMetrics.size;
  setPose(sprite,0,{time:ambientTime,idleTime:ambientTime,renderSize:companionSize(unit,sprite.dataset.art)});
 }}
 if(now-renderStamp>100){renderGuide();audioSettings();if(tab==='battle')renderVitals();renderStamp=now;}
 if(now-idleStamp>1200){accrueIdle(state);renderHeader();idleStamp=now;}
 if(now-saveStamp>6000){persist();saveStamp=now;}
}
async function bootGame(){renderHeader();renderParty();previewBattle();persist();watchImageAssets();await prepareBattle();if(state.pending)showLoot();else if(!state.onboarded)showIntro();else if(state.battleReport)showBattleReport();else if(state.guideStep>=2&&state.guideStep<=7){running=false;if(state.guideStep>=3){crewMode=state.guideStep>=5?'equipment':'profile';changeTab('cats');if(state.guideStep===6){state.guideStep=5;persist();}}}else startBattle();if(recovery)toast(recovery);requestAnimationFrame(frame);
}
bootGame().catch(()=>{const layer=$('#boot-status');if(layer)layer.textContent='进入失败，请刷新页面重试';});
if('serviceWorker' in navigator&&location.protocol==='https:'){const install=()=>setTimeout(()=>navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{swReady=true;}).catch(()=>{}),3500);if(document.readyState==='complete')install();else window.addEventListener('load',install,{once:true});}

document.addEventListener('click',e=>{const button=e.target.closest('[data-material-info]');if(!button)return;const key=button.dataset.materialInfo,id=button.dataset.materialCompanion,info=MATERIAL_INFO[key];if(!info)return;gearAnchor=button.getBoundingClientRect();const name=key==='shards'?cat(id).name+'的信物':MATERIAL_NAMES[key];openModal('material',`<div class="material-info-card">${materialIcon(key,38,id)}<h2 id="modal-title">${name}</h2><p>${info.description}</p>${info.source?`<p>${info.source}</p>`:""}<small>当前持有：${materialHave(state,key,id)}</small>${info.group?`<button id="material-go" class="primary wide">前往获取</button>`:""}</div>`);positionGearCard();if($('#material-go'))$('#material-go').onclick=()=>{forceClose();openStreet(info.group,key==='shards'?id:info.route);};});
