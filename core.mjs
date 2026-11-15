import {normalizeGuide} from './onboarding.mjs';
import {patrolDrop,grantPatrolDrop} from './patrol-drops.mjs';
import {equipmentEncounterScale} from './equipment-progression.mjs';
import {normalizeReport} from './battle-flow.mjs';
import {skillTuning} from './skill-training.mjs';
import {integer,mulDiv,resizeAmount} from './integer-math.mjs?v=0.25.1';
import {newRoster,normalizeRoster,normalizeGrowth,owns,recruit,starQuote,ascend,tagBonus} from './companions.mjs?v=0.25.0';
export {owns as ownsCompanion,recruit as recruitCompanion,starQuote,ascend as ascendCompanion} from './companions.mjs?v=0.25.0';
import {normalizeActivities,activityInfo,settleActivity} from './activities.mjs?v=0.25.0';
import {streetEnemies} from './street-combat.mjs?v=0.25.0';
import {createInventory,normalizeInventory,gearBonuses,gearDrop} from './equipment.mjs?v=0.25.0';
import {normalizeCampaign,recordActivity,weeklyInfo,settleWeekly} from './campaign.mjs?v=0.25.0';
import {normalizeAdRewards} from './rewarded-economy.mjs?v=0.25.0';
import {normalizeProgression,stallLevel,stallQuote,idleMinutes,suppliesFor,levelCap,breakthroughQuote,arenaInfo,arenaOpen} from './progression.mjs?v=0.25.0';
export {STALL_UPGRADES,STALL_MAX,ARENA_MAX,ARENA_UNLOCK,stallQuote,idleMinutes,suppliesFor,levelCap,breakthroughQuote,arenaInfo,arenaOpen} from './progression.mjs?v=0.25.0';
import {shidunTargets,shidunTarget} from './shidun-motion.mjs?v=0.25.0';
import {createShieldPunch,gainShield,tickShieldPunch,controlShieldPunch,absorbShieldDamage,gainEnergy,cleanseShieldPunch} from './shield-punch.mjs?v=0.25.0';
import {actionTiming,attackStyle} from './motion.mjs?v=0.25.0';
import {CAN_TIMING,canHitAt,canDuration,canTargetOrder} from './can-timing.mjs?v=0.25.0';
import {heroCombatStats,enemyCombatStats,mitigatedDamage} from './combat-stats.mjs?v=0.25.0';
export const VERSION=1, MAX_STAGE=600, MAX_LEVEL=100, MAX_PARTY=5;
export const CATS=[
 {id:'orange',name:'橘座',job:'前排守护',tag:'守护',color:'#edab62',accent:'#c8793b',unlock:0,hp:205,atk:17,skill:'锅盖护体',desc:'获得自身最大生命 45% 的护盾，并为队友提供 12% 护盾。',passive:'受到伤害降低 15%。',quote:'这条街的罐头，我罩了。',gear:'pan'},
 {id:'ink',name:'阿墨',job:'单体输出',tag:'突袭',color:'#42465c',accent:'#929db5',unlock:0,hp:116,atk:25,skill:'飞鱼三连',desc:'连续命中生命最低的敌人，合计造成 330% 攻击力的物理伤害，本次攻击额外获得 25 点护甲穿透。',passive:'暴击率额外提高 15%。',quote:'别眨眼，鱼已经到了。',gear:'scarf'},
 {id:'milk',name:'奶盖',job:'全队治疗',tag:'支援',color:'#f8ead8',accent:'#c6a2bf',unlock:3,hp:145,atk:13,skill:'热牛奶时间',desc:'治疗全体队友，数值相当于奶盖最大生命的 28%。',passive:'普攻额外回复 10 能量。',quote:'打完这一架，记得吃饭。',gear:'nurse'},
 {id:'spark',name:'火花',job:'群体灼烧',tag:'爆发',color:'#d98f75',accent:'#8f494b',unlock:8,hp:112,atk:27,skill:'提灯燎原',desc:'对全体敌人造成 160% 攻击力的法术伤害，并施加每回合 60% 攻击力的法术灼烧，持续 2 回合。',passive:'灼烧每回合提高至 90% 攻击力。',quote:'灯还亮着，跟紧我。',gear:'goggles'},
 {id:'mint',name:'薄荷',job:'眩晕控制',tag:'控制',color:'#a9d4c1',accent:'#4a8d83',unlock:15,hp:133,atk:22,skill:'冰镇气泡',desc:'优先打断蓄力中的敌人，其次压制治疗者，造成 230% 攻击力的法术伤害，眩晕 1 回合并打断蓄力。',passive:'主动技能伤害额外提高 30% 攻击力。',quote:'别急，先冷静一下。',gear:'hood'},
 {id:'bolt',name:'扳手',job:'破甲专家',tag:'破甲',color:'#adbacb',accent:'#636e8b',unlock:25,hp:162,atk:24,skill:'扳手大修',desc:'先降低目标 40% 当前护甲（最多降低开场护甲的 80%），再造成 300% 攻击力的物理伤害。',passive:'技能护甲削减提高 20%。',quote:'修不好，就再拧一下。',gear:'helmet'},
 {id:'pudding',name:'石墩',job:'前排输出',tag:'输出',color:'#757780',accent:'#c69358',unlock:40,hp:235,atk:22,skill:'护体劲 · 震街拳',desc:'获得 35% 最大生命值的护盾。护盾达到 30% 最大生命值时蓄力，蓄力期间每次自身回合开始回复 50 能量；再获得 15% 最大生命值的护盾后，消耗当前护盾，对目标前排及其身后两名敌人造成 180% 当前护盾值的物理伤害。护盾破裂或受到控制时中断蓄力。冷却 2 回合，最快在开始蓄力的下一回合出拳。',passive:'护盾吸收伤害时也回复能量。',quote:'站稳，再出拳。',gear:'cape'},
 {id:'star',name:'星斑',job:'能量辅助',tag:'支援',color:'#c4b1df',accent:'#78669f',unlock:60,hp:150,atk:19,skill:'今晚有星星',desc:'为其他队友回复 36 能量，并治疗相当于星斑攻击 160% 的生命。',passive:'开场拥有 40 点能量。',quote:'许个愿，然后自己去实现。',gear:'wizard'}
];
export const RELICS=[
 {id:'claw',name:'金属猫爪',desc:'全队攻击 +12%',icon:'claw',color:'#f2a278'},
 {id:'coat',name:'棉花披风',desc:'全队生命 +15%',icon:'coat',color:'#b5c8ef'},
 {id:'bell',name:'轻巧铃铛',desc:'暴击 +8%',icon:'bell',color:'#f3d06d'},
 {id:'scope',name:'鱼骨准星',desc:'暴击率 +5%',icon:'scope',color:'#abdbc6'},
 {id:'bowl',name:'温热饭碗',desc:'每回合回复全队 2% 生命',icon:'bowl',color:'#f5b1bf'},
 {id:'can',name:'救援工具箱',desc:'救援技能冷却缩短 1 回合',icon:'can',color:'#a8d7e4'},
 {id:'magnet',name:'招财磁铁',desc:'战斗鱼币奖励 +12%',icon:'magnet',color:'#e6b56f'},
 {id:'thermos',name:'保温鱼箱',desc:'鱼摊产量 +20%',icon:'thermos',color:'#8bc7c2'},
 {id:'thorn',name:'刺刺项圈',desc:'反弹受到伤害的 10%',icon:'thorn',color:'#bdabd5'},
 {id:'charm',name:'平安小袋',desc:'开场护盾 +10% 生命、能量 +5',icon:'charm',color:'#edac91'},
 {id:'match',name:'辣椒火柴',desc:'暴击附加 2 回合灼烧，每回合 35% 攻击',icon:'match',color:'#eb8f72'},
 {id:'badge',name:'首领克星',desc:'对首领伤害 +15%',icon:'badge',color:'#dbc07a'}
];
export const CHAPTERS=[
 {name:'晒鱼天台',sub:'从自家屋顶，守到整条街。',color:'#7fb3ac',sky:'#b8d8ce',ground:'#647f78',boss:'吸尘器大王',type:'vacuum'},
 {name:'午夜鱼市',sub:'传说这里的鱼，天亮前会跳舞。',color:'#8aa2d1',sky:'#9cb9d5',ground:'#667893',boss:'冰柜管理员',type:'fridge'},
 {name:'霓虹小巷',sub:'别踩井盖，里面住着一位鼓手。',color:'#b69cca',sky:'#b4a6cf',ground:'#6d668b',boss:'巨型招牌怪',type:'sign'},
 {name:'纸箱仓库',sub:'猫的城堡，绝不让给纸箱精。',color:'#d9b683',sky:'#d9c6a0',ground:'#9a8165',boss:'纸箱伯爵',type:'box'},
 {name:'旧城钟楼',sub:'十二点的钟声，敲给勇敢的猫。',color:'#8eb6c7',sky:'#a8cbd7',ground:'#657e8f',boss:'发条闹钟',type:'clock'},
 {name:'月光车站',sub:'最后一站。把那罐月光带回家。',color:'#b1a9d3',sky:'#adb0d6',ground:'#646d90',boss:'月台售货机',type:'vendor'}
];
export const MOB_TYPES=['dust','box','mop','battery','bag','drone'];
const names={dust:'灰尘团子',box:'硬壳纸箱',mop:'拖把精',battery:'漏电电池',bag:'乱跑纸袋',drone:'嗡嗡无人机'};
export const QUESTS=[
 {id:'first',name:'罐头保卫战',desc:'赢得第 1 场战斗',key:'wins',goal:1,reward:90},
 {id:'milk',name:'有人照顾才走得远',desc:'通过第 3 关，开启伙伴委托',key:'highest',goal:3,reward:150},
 {id:'train',name:'练一练，强一点',desc:'累计训练猫咪 10 次',key:'upgrades',goal:10,reward:260},
 {id:'boss',name:'大个子也没在怕',desc:'累计击败 3 位首领',key:'bosses',goal:3,reward:500},
 {id:'wins',name:'这条街我熟',desc:'累计胜利 20 场',key:'wins',goal:20,reward:650},
 {id:'relic',name:'叮叮当当一大包',desc:'累计取得 5 件战利品',key:'relicCount',goal:5,reward:800},
 {id:'chapter',name:'天台已经安全',desc:'通过第 20 关',key:'highest',goal:20,reward:1600},
 {id:'roster',name:'一家猫就要整整齐齐',desc:'解锁 6 位队员',key:'cats',goal:6,reward:2400},
 {id:'arena-first',name:'上台露一手',desc:'通过擂台第 1 擂',key:'arenaCleared',goal:1,reward:2400},
 {id:'half',name:'走到霓虹尽头',desc:'通过第 60 关',key:'highest',goal:60,reward:6000},
 {id:'end',name:'月光罐头收藏家',desc:'通过第 120 关',key:'highest',goal:120,reward:16000}
];
export function initialState(now=Date.now()){return {...normalizeProgression({},CATS.map(c=>c.id)),inventory:createInventory(CATS.map(c=>c.id)),roster:newRoster(),growth:normalizeGrowth(),activities:normalizeActivities(),campaign:normalizeCampaign(),adRewards:normalizeAdRewards(),version:VERSION,gold:200,levels:Object.fromEntries(CATS.map(c=>[c.id,1])),party:['orange','ink'],stage:1,runCleared:0,highest:0,bones:0,prestiges:0,relics:{},pending:null,claimed:[],wins:0,bosses:0,kills:0,upgrades:0,relicCount:0,idle:0,idleRemainder:0,idleSupplies:0,supplyRemainder:0,supplyClock:2,battleReport:null,lastAccrued:now,onboarded:false,auto:true,speed:1,sound:true,music:true,guideStep:0,rescueSeen:false,created:now,seconds:0};}
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const num=(v,d=0,a=0,b=1e12)=>typeof v==='number'&&Number.isFinite(v)?clamp(v,a,b):d;
export function unlocked(s){return CATS.filter(c=>owns(s,c.id));}
// Replacing a stronger deployed cat transfers its training to the newcomer.
// Swap levels so every paid level is conserved, even across repeated swaps.
// Repositioning existing teammates, adding to an empty slot, and replacing a
// lower-level cat never changes levels.
export function inheritanceFor(s,slot,id){if(!Number.isInteger(slot)||slot<0||slot>=MAX_PARTY||!unlocked(s).some(c=>c.id===id)||s.party.includes(id))return null;const from=s.party[slot];return from&&s.levels[from]>s.levels[id]?{from,to:id,fromLevel:s.levels[from],toLevel:s.levels[id]}:null;}
export function inheritTraining(s,from,to){const available=unlocked(s).map(c=>c.id);if(from===to||!available.includes(from)||!available.includes(to)||s.levels[from]<=s.levels[to])return false;[s.levels[from],s.levels[to]]=[s.levels[to],s.levels[from]];s.breakthroughs??={};[s.breakthroughs[from],s.breakthroughs[to]]=[s.breakthroughs[to]||0,s.breakthroughs[from]||0];return true;}
export function normalizeState(raw,now=Date.now()){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==VERSION)throw Error('不是兼容的罐头远征队存档');
 const s=initialState(now);s.adRewards=normalizeAdRewards(raw.adRewards);s.campaign=normalizeCampaign(raw.campaign);Object.assign(s,normalizeProgression(raw,CATS.map(c=>c.id)));
 for(const k of ['gold','bones','prestiges','wins','bosses','kills','upgrades','relicCount','seconds'])s[k]=Math.floor(num(raw[k]));
 s.highest=Math.floor(num(raw.highest,0,0,MAX_STAGE));s.runCleared=Math.floor(num(raw.runCleared,0,0,s.highest));s.stage=Math.min(MAX_STAGE,s.runCleared+1);
 s.roster=normalizeRoster(raw.roster,CATS,s.highest);s.growth=normalizeGrowth(raw.growth);s.activities=normalizeActivities(raw.activities);if(raw.activities&&raw.activities.rewardVersion!==1){for(const c of CATS){const cleared=s.activities.cleared["recruit:"+c.id]||0;for(let n=1;n<=cleared;n++)s.roster.shards[c.id]+=[20,12,16,20,24,30][n-1]-(2+Math.ceil(n/2))*2;}}
 for(const c of CATS)s.levels[c.id]=Math.floor(num(raw.levels?.[c.id],1,1,levelCap(s,c.id)));
 s.rescueSeen=raw.rescueSeen===true;s.battleReport=normalizeReport(raw.battleReport);if(s.battleReport?.mode==='patrol')s.battleReport=null;s.idleSupplies=Math.floor(num(raw.idleSupplies,0,0,100000));s.supplyRemainder=Math.floor(num(raw.supplyRemainder,0,0,raw.supplyClock===2?599999:59999)*(raw.supplyClock===2?1:10));
 const available=unlocked(s).map(c=>c.id),seen=new Set();s.party=Array.isArray(raw.party)?raw.party.filter(id=>id===null||available.includes(id)&&!seen.has(id)&&seen.add(id)).slice(0,MAX_PARTY):s.party;while(s.party.length&&!s.party.at(-1))s.party.pop();if(!s.party.some(Boolean))s.party=['orange'];
 s.inventory=[1,2].includes(raw.inventory?.version)?normalizeInventory(raw.inventory,CATS.map(c=>c.id)):createInventory(CATS.map(c=>c.id),raw.relics,s.highest,s.party.filter(Boolean));s.relics={};s.pending=null;
 s.claimed=[...new Set(Array.isArray(raw.claimed)?raw.claimed:[])].filter(id=>QUESTS.some(q=>q.id===id));
 s.lastAccrued=num(raw.lastAccrued,now,0,now);s.idle=num(raw.idle,0,0,idleRate(s)*idleMinutes(s));s.idleRemainder=Math.min(59999,Math.max(0,integer(raw.idleRemainder??((s.idle-Math.floor(s.idle))*60000))));s.idle=Math.floor(s.idle);s.created=num(raw.created,now,0,now);s.onboarded=!!raw.onboarded;s.auto=raw.auto!==false;s.speed=raw.speed===2?2:1;s.sound=raw.sound!==false;s.music=raw.music!==false;s.guideStep=normalizeGuide(raw.guideStep,s.onboarded);return s;
}
export function upgradeCost(level){return Math.round((22+level*12+Math.pow(level,1.65)*2)*(1+Math.max(0,level-40)**2/150));}
export function upgradeQuote(level,count=10,cap=MAX_LEVEL){const levels=Math.max(0,Math.min(cap-level,Math.floor(count),10));let cost=0;for(let i=0;i<levels;i++)cost+=upgradeCost(level+i);return {levels,cost};}
export function upgrade(s,id,count=1,now=Date.now()){const c=CATS.find(c=>c.id===id);if(!c||!owns(s,id))return 0;let done=0;for(let i=0;i<clamp(count,1,10);i++){const l=s.levels[id],cost=upgradeCost(l);if(l>=levelCap(s,id)||s.gold<cost)break;s.gold-=cost;s.levels[id]++;s.upgrades++;done++;}if(done)recordActivity(s,'train',done,now);return done;}
export function setParty(s,slot,id){
 if(!unlocked(s).some(c=>c.id===id)||!Number.isInteger(slot)||slot<0||slot>=MAX_PARTY)return false;
 if(s.party[slot]===id)return true;
 const inheritance=inheritanceFor(s,slot,id);if(inheritance)inheritTraining(s,inheritance.from,id);
 const p=Array.from({length:Math.max(s.party.length,slot+1)},(_,i)=>s.party[i]||null),old=p.indexOf(id);
 if(old>=0)p[old]=p[slot];p[slot]=id;while(p.length&&!p.at(-1))p.pop();s.party=p;return true;
}
export function removeParty(s,id){
 if(!s.party.includes(id)||s.party.filter(Boolean).length<=1)return false;
 s.party=s.party.map(x=>x===id?null:x);while(s.party.length&&!s.party.at(-1))s.party.pop();return true;
}
// Old all-party relic stacks are retired; all combat equipment is character-owned.
export function buffs(){return {atk:1,hp:1,crit:10,regen:0,canCd:8,gold:1,idle:1,reflect:0,shield:0,energy:0,burn:0,boss:1};}
export function catStats(s,id,equipment=null){const c=CATS.find(c=>c.id===id),l=s.levels[id]||1,g=equipment||gearBonuses(s,id),stars=s.roster?.stars?.[id]||0,base=heroCombatStats(id,l);
 const grow=value=>[100+18*(l-1),100+8*Math.floor(l/10),100+8*s.bones,10000+tagBonus(s,id)].reduce((n,p,i)=>mulDiv(n,p,i===3?10000:100),value);
 return {...base,armor:base.armor+g.armor,magicResist:base.magicResist+g.magicResist,armorPen:base.armorPen+g.armorPen,magicPen:base.magicPen+g.magicPen,hp:mulDiv(grow(c.hp),100+g.hp),atk:mulDiv(grow(c.atk),100+g.atk),crit:Math.min(80,10+g.crit+(id==='ink'&&l>=5?15:0)),level:l,stars,skillRank:s.breakthroughs?.[id]||0,gear:g};
}
export function power(s){return s.party.filter(Boolean).reduce((n,id)=>{const c=catStats(s,id);return n+Math.round(c.hp*.3*(1+(c.armor+c.magicResist)/200)+c.atk*3*(1+(c.armorPen+c.magicPen)/200));},0);}
export function idleRate(s){return Math.round((18+Math.min(Math.max(s.highest,1),60)*3+Math.max(0,s.highest-60)*.6)*buffs(s).idle*(1+.15*stallLevel(s,'stall'))*(1+.05*stallLevel(s,'sign')));}
export function supplyRate(s){return Math.max(1,Math.round((2+Math.floor(s.highest/20))*(1+.1*stallLevel(s,'cart'))*10)/10);}
export function accrueIdle(s,now=Date.now()){const elapsed=integer(clamp(now-s.lastAccrued,0,idleMinutes(s)*60000)),total=elapsed*idleRate(s)+(s.idleRemainder||0),amount=Math.floor(total/60000),cap=idleRate(s)*idleMinutes(s);s.idle=Math.min(cap,s.idle+amount);s.idleRemainder=s.idle>=cap?0:total-amount*60000;const supplyTotal=elapsed*Math.round(supplyRate(s)*10)+(s.supplyRemainder||0),supplyCap=supplyRate(s)*idleMinutes(s);s.idleSupplies=Math.min(supplyCap,(s.idleSupplies||0)+Math.floor(supplyTotal/600000));s.supplyRemainder=s.idleSupplies>=supplyCap?0:supplyTotal%600000;s.lastAccrued=integer(now);return amount;}
export function claimIdle(s,now=Date.now()){accrueIdle(s,now);const n=Math.floor(s.idle);s.gold+=n;s.idle-=n;const supplies=s.idleSupplies||0;s.supplies+=supplies;s.idleSupplies=0;if(n>0||supplies>0)recordActivity(s,'income',1,now);return n;}
export function questValue(s,q){return q.key==='cats'?unlocked(s).length:s[q.key]||0;}
export function claimQuests(s){let sum=0;for(const q of QUESTS){if(!s.claimed.includes(q.id)&&questValue(s,q)>=q.goal){s.claimed.push(q.id);s.gold+=q.reward;sum+=q.reward;}}return sum;}
export function rewardFor(s,stage,farm=false){return Math.round((30+stage*6)*buffs(s).gold*(farm?0:1));}
export function upgradeStall(s,id,now=Date.now()){const q=stallQuote(s,id);if(!q.valid||q.maxed||s.supplies<q.cost)return false;accrueIdle(s,now);s.supplies-=q.cost;s.stall??={};s.stall[id]=q.level+1;return true;}
export function breakthrough(s,id){const c=CATS.find(c=>c.id===id),q=breakthroughQuote(s,id);if(!c||!owns(s,id)||q.maxed||s.badges<q.cost||s.growth.notes<q.notes||s.growth.seals<q.seals)return false;s.badges-=q.cost;s.growth.notes-=q.notes;s.growth.seals-=q.seals;s.breakthroughs[id]=q.rank+1;return true;}
export function seeded(seed){let x=(seed>>>0)||1;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
export function relicOptions(){return [];}
export function chooseRelic(){return false;}
// Legacy API is inert: shifts are retired and can no longer reset progress.
export function prestigeGain(){return 0;}
export function prestige(){return 0;}
export function chapterOf(stage){return CHAPTERS[Math.floor((stage-1)/20)%CHAPTERS.length];}
// Fixed progression curve, independent of the player's level or chosen formation.
// The first three encounters remain an entry path to companion contracts.
export function patrolPressure(stage){
 const curve=[[3,1,1],[20,1.25,1.1],[60,1.35,1.3],[120,1.45,1.45],[300,1.5,1.6],[600,1.5,1.7]];
 if(stage<=3)return {hp:1,atk:1};
 for(let i=1;i<curve.length;i++){const [end,hp,atk]=curve[i],[start,prevHp,prevAtk]=curve[i-1];if(stage<=end){const t=(stage-start)/(end-start);return {hp:prevHp+(hp-prevHp)*t,atk:prevAtk+(atk-prevAtk)*t};}}
 return {hp:1.5,atk:1.7};
}
export function enemiesFor(stage){const boss=stage%5===0,ch=chapterOf(stage),m=(1+.14*(Math.min(stage,120)-1)+.0046*(Math.min(stage,120)-1)**2)*(1+.007*Math.max(0,stage-120)+.00002*Math.max(0,stage-120)**2),ci=Math.floor((stage-1)/20);const list=[];
 const mob=(type,index)=>({id:'e'+index,type,name:names[type],maxHp:Math.round((type==='box'?115:type==='bag'?78:90)*m),atk:Math.round((type==='battery'?13:9)*m),boss:false});
 if(boss){const chapterBoss=stage%20===0;list.push({id:'e0',type:ch.type,name:chapterBoss?ch.boss:['扫街队长','捣蛋头目','罐头大盗'][Math.floor((stage%20)/5)-1]+' · '+ch.boss,maxHp:Math.round((chapterBoss?345:275)*m),atk:Math.round((chapterBoss?16:13)*m),boss:true});if(stage>=15){const count=chapterBoss?4:1;for(let i=1;i<=count;i++){const escort=mob(MOB_TYPES[(ci+i)%6],i);if(count===4){escort.maxHp=Math.round(escort.maxHp*.38);escort.atk=Math.max(1,Math.round(escort.atk*.38));}list.push(escort);}}}
 else {const count=stage===1?1:stage>=16&&stage%4===0?5:stage>=12&&stage%3===0?3:2;for(let i=0;i<count;i++){const e=mob(MOB_TYPES[(stage+ci-1+i)%6],i);if(count===5){e.maxHp=Math.round(mulDiv(e.maxHp,48));e.atk=Math.max(1,Math.round(mulDiv(e.atk,48)));}list.push(e);}}
 const pressure=patrolPressure(stage),equipment=equipmentEncounterScale(stage);
 return list.map(e=>({...e,maxHp:Math.round(Math.round(e.maxHp*(1+(Math.max(0,stage-120)/200)**2)*pressure.hp)*equipment.hp),atk:Math.round(Math.round(e.atk*pressure.atk)*equipment.atk),...enemyCombatStats(e.type,stage,e.boss)}));
}
export function arenaEnemies(tier){const info=arenaInfo(tier),level=8+(tier-1)*7,m=(1+.18*(level-1))*(1+.08*Math.floor(level/10)),types=['box','mop','bag','battery','drone'];return types.map((type,i)=>{const boss=info.type==='burst'&&i===0;return {id:'e'+i,type,name:(boss?'擂台蓄力王':names[type]),maxHp:Math.round((i<2?180:105)*m*(boss?1.4:1)),atk:Math.round((i<2?13:10)*m),boss,...enemyCombatStats(type,15+tier*4,boss),...(info.type==='iron'&&i<2?{armor:110+tier*4,magicResist:12}:{}),arenaHealer:info.type==='recovery'&&i===2,nextHeal:2};});}
export class Battle {
 constructor(s,{stage=s.stage,farm=false,arenaTier=0,weeklyTier=0,activity=null,now=Date.now(),seed=stage*173+s.wins*29+37}={}){
  this.activity=activity?activityInfo(s,activity):null;if(this.activity&&!this.activity.open)throw Error('此委托暂不可挑战');if(this.activity){arenaTier=0;weeklyTier=0;stage=Math.max(1,this.activity.level);farm=false;}
  const weekly=weeklyTier?weeklyInfo(s,weeklyTier,now):null;if(weekly&&!weekly.open)throw Error('每周挑战尚未解锁');if(weekly)arenaTier=weekly.arenaTier;
  if(!weekly&&arenaTier&&!arenaOpen(s,arenaTier))throw Error('擂台尚未解锁');
  this.weekly=weekly;
  this.mode=this.activity?'activity':arenaTier?'arena':'patrol';this.arenaTier=arenaTier;this.arenaRule=arenaTier?arenaInfo(arenaTier):null;
  if(arenaTier){stage=15+(arenaTier-1)*5;seed=arenaTier*173+37;farm=false;}
  this.stage=stage;this.farm=farm;this.time=0;this.result=null;this.resolved=false;this.rng=seeded(seed);this.events=[];this.kills=0;this.canCd=0;this.buff=buffs(s);this.fxSerial=0;this.round=0;this.turnQueue=[];this.turnActor=null;this.turnStarted=false;this.turnGapUntil=0;
  this.heroes=s.party.map((id,i)=>{if(!id)return null;const c=CATS.find(c=>c.id===id),st=catStats(s,id);return {...st,id:'p'+i,formationSlot:i,catId:id,name:c.name,side:'p',maxHp:st.hp,hp:st.hp,energy:Math.min(99,this.buff.energy+(id==='star'&&st.level>=5?40:0)),shield:st.hp*this.buff.shield,wait:0,stun:0,burn:0,burnTime:0,burnSource:null};}).filter(Boolean);
  for(const h of this.heroes){h.gearSets=h.gear.sets;h.rune=h.gear.rune;h.runeAttacks=0;h.nextRuneSkill=0;h.runeUsed=false;h.shield=0;h.nextGearHeal=2;}
  for(const h of this.heroes)if(h.catId==='pudding'){h.shieldPunch=createShieldPunch({maxHp:h.maxHp,hp:h.hp,attack:h.atk,energy:h.energy,config:{selfShieldRatio:mulDiv(skillTuning(h.skillRank).puddingSelf,this.shieldFactor(h)),roundBased:true,lockout:2,chargeEnergyPerSecond:0}});h.shieldPunch.shield=h.shield;h.shieldState='normal';}
  this.enemies=(this.activity?streetEnemies(this.activity):arenaTier?arenaEnemies(arenaTier):enemiesFor(stage)).map((e,i)=>({...e,hp:e.maxHp,side:'e',energy:0,shield:e.type==='fridge'?mulDiv(e.maxHp,20):0,wait:0,skillWait:e.boss?3:99,charge:0,stun:0,burn:0,burnTime:0,attacks:0,initialArmor:e.armor}));
  if(this.mode==='patrol'&&!weekly){const drop=patrolDrop(stage);if(drop){const carrier=this.enemies[0];carrier.materialDrop=drop;carrier.name=['背书小贼','零件搬运怪','偷粮小贼','勋章收集怪','砂袋搬运怪','藏印石怪'][drop.cell];}}
  if(weekly){for(const e of this.enemies){Object.assign(e,enemyCombatStats(e.type,15+arenaTier*4,false));const strength=[1,1.6,4][weeklyTier-1];e.maxHp=Math.round(e.maxHp*strength);e.hp=e.maxHp;e.atk=Math.round(e.atk*[1,1.25,2][weeklyTier-1]);e.arenaHealer=false;e.boss=false;if(weekly.type==='iron'&&this.enemies.indexOf(e)<2){e.armor=150+weeklyTier*25;e.magicResist=12;}if(weekly.type==='recovery'&&e.id==='e2')e.arenaHealer=true;if(weekly.type==='burst'&&e.id==='e0'){e.boss=true;e.skillWait=3;}if(weekly.type==='haste')e.atk=mulDiv(e.atk,120);e.initialArmor=e.armor;}}
  if(this.heroes.some(h=>h.catId==='star'&&h.level>=40))for(const h of this.heroes)if(h.catId!=='star')h.energy=Math.min(99,h.energy+12);
  for(const h of this.heroes)if(h.gearSets.includes('guard'))this.shield(h,mulDiv(h.maxHp,25),h);
 }
 // One actor owns the action lane until recovery finishes. A round visits each living actor once.
 finishTurn(){this.turnActor=null;this.turnStarted=false;this.turnGapUntil=this.time+.12;}
 selectTurn(){
  const all=[...this.heroes,...this.enemies];
  if(this.turnActor){const a=all.find(x=>x.id===this.turnActor);if(!a||a.hp<=0||this.turnStarted&&!a.action&&!(a.burstUntil>this.time)&&a.shieldPunch?.state!=='punching'){this.finishTurn();}else return;}
  if(this.canSequence||this.time<this.turnGapUntil)return;
  const existing=all.find(a=>a.hp>0&&(a.action||a.shieldPunch?.state==='punching'));
  if(existing){this.turnActor=existing.id;this.turnStarted=true;return;}
  if(!this.turnQueue.length){if(this.round>=30){this.result='lose';return;}this.round++;this.turnQueue=Array.from({length:Math.max(this.heroes.length,this.enemies.length)},(_,i)=>[this.heroes[i],this.enemies[i]]).flat().filter(a=>a&&a.hp>0).map(a=>a.id);}
  this.turnQueue=this.turnQueue.filter(id=>all.some(a=>a.id===id&&a.hp>0));
  const index=this.turnQueue.findIndex(id=>{const a=all.find(x=>x.id===id);return a.wait<=0||a.shieldPunch?.state==='primed'&&a.shieldPunch.releaseAt<=this.time;});
  if(index<0)return;
  const nextId=this.turnQueue.splice(index,1)[0],a=all.find(x=>x.id===nextId);
  this.startActorTurn(a);if(a.hp<=0)return;
  if(a.stun>0){a.stun--;if(a.shieldPunch){this.shieldEvents(a,controlShieldPunch(a.shieldPunch,this.time,1));this.shieldEvents(a,cleanseShieldPunch(a.shieldPunch,this.time));}this.emit('skip',a,a,0,{round:this.round,text:'眩晕'});this.turnGapUntil=this.time+.12;return;}
  this.turnActor=a.id;this.turnStarted=false;this.turnStartAt=Math.max(this.stepStart??this.time,this.turnGapUntil,a.readyAt??0);this.emit('turn',a,a,0,{round:this.round});
 }
 // Counters advance only when this actor receives a scheduled turn, including skipped turns.
 startActorTurn(a){
  a.turns=(a.turns||0)+1;
  const burning=a.burnTime>0;
  if(burning){this.harm(a,a.burn,a.burnSource,{type:'magic',dot:true,reflect:false});a.burnTime--;}
  if(a.hp<=0)return;
  if(a.side==='p'&&a.gearSets?.includes('spring')&&a.turns>=a.nextGearHeal){a.nextGearHeal=a.turns+2;this.heal(a,mulDiv(a.maxHp,5),a);}
  if(a.side==='p'&&this.buff.regen>0)this.heal(a,mulDiv(a.maxHp,this.buff.regen),a);
  if(a.barrierCycle&&a.turns>=a.nextBarrier){a.nextBarrier=a.turns+a.barrierCycle;if(!burning){this.shield(a,mulDiv(a.maxHp,a.barrierRatio),a);this.emit('status',a,a,0,{text:'冷库补盾'});}else this.emit('status',a,a,0,{text:'灼烧阻断补盾'});}
  if(a.boss&&!a.charge)a.skillWait=Math.max(0,a.skillWait-1);
  if(a.shieldPunch){const sp=a.shieldPunch;sp.round=this.round;sp.deferSelfShield=true;if(a.stun<=0&&sp.state==='charging'){sp.energy=a.energy;this.shieldEvents(a,gainEnergy(sp,50,this.time,'charge'));}}
 }
 alive(side){return (side==='p'?this.heroes:this.enemies).filter(x=>x.hp>0);}
 frontlines(){const alive=this.alive('p'),front=alive.filter(h=>h.formationSlot<2);return front.length?front:alive.slice(0,2);}
 frontline(){return this.frontlines()[0]||null;}
 emit(type,from,to,value=0,extra={}){this.events.push({type,at:this.eventAt??this.time,from:from?.id,to:to?.id,value:Math.round(value),serial:++this.fxSerial,...extra,...(this.canEvent?{rescue:true}: {})});}
 harm(target,raw,source,{crit=false,type=source?.normalDamageType||'physical',bonusPen=0,reflect=true,dot=false,element}={}){
  if(!target||target.hp<=0)return 0;const ramp=1000000+Math.max(0,this.round-10)*250000;target.hp=integer(target.hp);target.shield=integer(target.shield);
  let amount=mulDiv(mitigatedDamage(integer(raw),target,source,type,bonusPen),ramp,1000000);
  if(target.catId==='orange'&&target.level>=5)amount=mulDiv(amount,100-skillTuning(target.skillRank).orangeGuard);
  if(source?.side==='p'&&target.boss)amount*=this.buff.boss;
  if(!dot&&source?.catId==='ink'&&source.level>=40&&target.hp<mulDiv(target.maxHp,40))amount=mulDiv(amount,125);
  if(!dot&&source?.side==='p'&&target.stun>0){const mint=this.heroes.find(h=>h.catId==='mint'&&h.level>=40&&h.hp>0);if(mint)amount=mulDiv(amount,100+skillTuning(mint.skillRank).mintVulnerable);}
  if(source?.side==='p'&&type==='physical'&&target.armor<target.initialArmor*.5&&this.heroes.some(h=>h.catId==='bolt'&&h.level>=80&&h.hp>0))amount=mulDiv(amount,115);
  if(target.catId==='pudding'&&target.level>=40&&target.shield>0)amount=mulDiv(amount,90);
  if(target.adaptive&&!dot){target.sameHit=target.lastHitType===type?Math.min(60,(target.sameHit||0)+12):0;target.lastHitType=type;amount=mulDiv(amount,100-target.sameHit);}
  if(!dot&&source?.gearSets?.includes('hunt')&&target.hp<mulDiv(target.maxHp,50))amount=mulDiv(amount,130);
  if(source?.gearSets?.includes('ember')&&target.burnTime>0)amount=mulDiv(amount,125);
  if(!dot&&source?.rune==='ember'&&target.burnTime>0)amount=mulDiv(amount,108);
  const shield=Math.min(target.shield,amount);target.shield-=shield;amount-=shield;const hit=Math.min(target.hp,amount);target.hp=Math.max(0,target.hp-amount);
  this.emit(dot?'burn':'hit',source,target,hit+shield,{crit,shield:shield>0,damageType:type,damageElement:element||(dot?'fire':type==='magic'?(source?.catId==='spark'?'fire':source?.catId==='mint'?'ice':'magic'):'physical'),dot,cause:dot?'burn':!reflect?'reflect':source?.action?.kind||'normal'});
  if(!dot)target.hitUntil=(this.eventAt??this.time)+.22;
  if(target.hp<=0){target.downAt=this.eventAt??this.time;target.action=null;this.emit('down',source,target);if(target.side==='e')this.kills++;if(source?.catId==='ink'&&source.level>=80)source.energy=Math.min(100,source.energy+35);}
  const at=this.eventAt??this.time,hitEnergy=target.side==='p'&&source?.side==='e'&&target.hp>0&&(hit>0||(target.catId==='pudding'&&target.level>=5&&shield>0))&&!dot&&reflect&&target.hitEnergyRound!==this.round;
  if(hitEnergy){target.hitEnergyRound=this.round;if(!(target.shieldPunch&&shield>0))target.energy=Math.min(100,target.energy+8);}
  if(target.catId==='pudding'&&target.shieldPunch&&shield>0&&target.hp>0){const sp=target.shieldPunch;sp.deferSelfShield=true;sp.hp=target.hp;sp.energy=target.energy;sp.config.absorbEnergy=8;sp.shield=target.shield+shield;this.shieldEvents(target,absorbShieldDamage(sp,shield,at,{energy:hitEnergy}));}
  if(target.rune==='steadfast'&&!target.runeUsed&&target.hp>0&&target.hp<mulDiv(target.maxHp,30)){target.runeUsed=true;this.shield(target,mulDiv(target.maxHp,8),target);}
  if(reflect&&target.side==='p'&&source?.side==='e'&&source.hp>0&&(target.gearSets?.includes('thorn')||this.buff.reflect>0))this.harm(source,mulDiv(hit+shield,target.gearSets?.includes('thorn')?15:this.buff.reflect),target,{reflect:false,type});return hit;
 }
 heal(target,amount,source){if(target.hp<=0)return;amount=integer(amount);target.hp=integer(target.hp);if(source?.gearSets?.includes('spring'))amount=mulDiv(amount,125);if(source?.rune==='warmth'&&target.hp<mulDiv(target.maxHp,50))amount=mulDiv(amount,110);if(target.scorchedUntil>=this.round)amount=mulDiv(amount,50);const overflow=Math.max(0,amount-(target.maxHp-target.hp));const n=Math.min(target.maxHp-target.hp,amount);target.hp+=n;if(n>1)this.emit('heal',source,target,n);if(source?.catId==='milk'&&source.level>=40&&overflow>0)this.shield(target,Math.min(mulDiv(target.maxHp,skillTuning(source.skillRank).milkOverflowCap),mulDiv(overflow,skillTuning(source.skillRank).milkOverflow)),source);}
 shieldFactor(target){return mulDiv(mulDiv(target.gearSets?.includes('guard')?120:100,target.rune==='bulwark'?108:100),target.catId==='pudding'&&target.level>=80?120:100);}
 shield(target,amount,source){if(target.hp<=0)return;amount=mulDiv(integer(amount),this.shieldFactor(target));if(target.shieldPunch){const sp=target.shieldPunch;sp.round=this.round;sp.maxHp=target.maxHp;sp.deferSelfShield=true;sp.hp=target.hp;sp.energy=target.energy;sp.shield=target.shield;this.shieldEvents(target,gainShield(sp,amount,this.eventAt??this.time,source?.id||'ally'));return;}const added=Math.min(amount,target.maxHp-target.shield);target.shield+=added;this.emit('shield',source,target,added);}
 shieldEvents(h,events){
  const sp=h.shieldPunch;h.energy=sp.energy;h.shield=sp.shield;h.shieldState=sp.state;
  for(const e of events){
   if(e.type==='shieldGain')this.emit('shield',h,h,e.amount,{at:e.at});
   if(e.type==='selfShield'){h.selfShieldRound=this.round;if(h.action?.kind==='normal')h.action=null;if(this.turnActor===h.id)this.turnStarted=true;this.emit('skill',h,h,0,{text:'护体劲',targets:[h.id],at:e.at});this.runeSkill(h);}
   if(e.type==='chargeStart'){h.shieldTargetId=this.enemies[h.formationSlot===1||h.formationSlot===4?1:0]?.id;h.action=null;this.emit('status',h,h,0,{text:'蓄盾',at:e.at});}
   if(e.type==='secondTrigger')this.emit('status',h,h,0,{text:'震街拳就绪',at:e.at});
   if(e.type==='cancel'){h.action=null;this.emit('cancel',h,h,0,{at:e.at});}
   if(e.type==='punchStart'){this.turnActor=h.id;this.turnStarted=true;const target=shidunTarget(this.enemies,h.shieldTargetId,this.rng);h.shieldTargetId=target?.id;h.action={kind:'skill',windup:0,travel:sp.config.punchTravel,impactAt:sp.config.punchTravel,hold:.08,duration:sp.config.punchTravel+sp.config.recovery,elapsed:Math.max(0,this.time-e.at),released:true,impacted:false,targetId:target?.id,shieldStrike:true,shieldReposition:target?.id!==this.enemies[h.formationSlot===1||h.formationSlot===4?1:0]?.id};this.emit('windup',h,target,0,{kind:'skill',style:'melee',windup:0,at:e.at});this.emit('release',h,target,0,{kind:'skill',style:'melee',travel:sp.config.punchTravel,at:e.at});}
   if(e.type==='punchHit'){const target=shidunTarget(this.enemies,h.shieldTargetId,this.rng);h.shieldTargetId=target?.id;if(h.action)h.action.targetId=target?.id;const targets=shidunTargets(this.enemies,h.shieldTargetId);h.shidunImpactAt=e.at;h.shidunHitTargets=targets.map(x=>x.id);this.eventAt=e.at;this.emit('skill',h,h,0,{text:'震街拳',targets:targets.map(x=>x.id),shieldPunch:true});for(const enemy of targets)this.harm(enemy,mulDiv(e.shieldAtSecond,skillTuning(h.skillRank).puddingShieldHit),h,{type:'physical'});this.eventAt=null;if(h.action)h.action.impacted=true;}
   if(e.type==='normal'){h.action=null;h.wait=Math.max(h.wait,.25);}
  }
 }
 updateShieldWarrior(h){const sp=h.shieldPunch;sp.round=this.round;sp.deferSelfShield=this.turnActor!==h.id||this.turnStarted||h.normalRound===this.round;sp.hp=h.hp;sp.maxHp=h.maxHp;sp.energy=h.energy;sp.shield=Math.min(h.shield,mulDiv(h.maxHp,80));sp.attack=h.atk;if(h.stun>0&&sp.state!=='controlled')this.shieldEvents(h,controlShieldPunch(sp,this.time,1e9));this.shieldEvents(h,tickShieldPunch(sp,this.time,[],{allowRelease:this.turnActor===h.id&&!this.turnStarted&&h.selfShieldRound!==this.round&&!this.canSequence}));if(h.action?.shieldStrike)h.action.elapsed=this.time-sp.releaseAt;return ['charging','primed','punching','controlled'].includes(sp.state);}
 applyBurn(target,damage,rounds,source){if(target.hp<=0)return;if(source?.catId==='spark'&&source.level>=5&&skillTuning(source.skillRank).sparkDetonate&&target.burnSource===source&&target.burnTime>0){const burst=mulDiv(target.burn,Math.round(target.burnTime*1000)*skillTuning(source.skillRank).sparkDetonate,100000);this.harm(target,burst,source,{type:'magic',dot:true,element:'fire'});if(target.hp<=0)return;}if(source?.catId==='spark'&&source.level>=40)damage=mulDiv(integer(damage),120);if(target.burnTime<=0||damage>=target.burn){target.burn=integer(damage);target.burnSource=source;}target.burnTime=Math.max(target.burnTime,rounds);}
 targetFor(actor,kind='normal'){
  if(kind==='skill'&&['orange','milk','star'].includes(actor.catId))return actor;
  const foes=this.alive(actor.side==='p'?'e':'p');if(!foes.length)return null;
  if(actor.side==='e'){if(actor.ambusher){const rear=this.alive('p').filter(h=>h.formationSlot>=2);if(rear.length)return rear.reduce((a,b)=>a.hp/a.maxHp<b.hp/b.maxHp?a:b);}const front=this.frontlines(),locked=front.find(h=>h.id===actor.action?.targetId);return locked||front[((actor.attacks||0)+this.enemies.indexOf(actor))%front.length];}
  if(actor.catId==='ink')return foes.reduce((a,b)=>a.hp<b.hp?a:b);
  if(kind==='skill'&&actor.catId==='mint'){const locked=foes.find(e=>e.id===actor.action?.targetId);if(actor.action?.released&&locked)return locked;return foes.find(e=>e.charge>0)||foes.find(e=>e.arenaHealer)||foes.reduce((a,b)=>a.hp>b.hp?a:b);}
  return foes[0];
 }
 skillTargets(actor){
  if(['orange','milk','star'].includes(actor.catId))return this.alive('p');
  if(actor.catId==='pudding'&&!actor.action?.shieldStrike)return [actor];
  if(actor.catId==='pudding')return shidunTargets(this.enemies,actor.action?.targetId||actor.shieldTargetId);
  if(actor.catId==='spark')return this.alive('e');
  const target=this.targetFor(actor,'skill');return target?[target]:[];
 }
 beginAction(actor,kind){if(kind==='normal'&&actor.catId==='pudding'&&actor.selfShieldRound===this.round){this.turnStarted=true;return false;}if(this.turnActor&&this.turnActor!==actor.id)return false;this.turnActor=actor.id;this.turnStarted=true;const target=this.targetFor(actor,kind);if(!target)return;
  actor.action={kind,...actionTiming(actor,kind),elapsed:Math.max(0,this.time-(this.turnStartAt??this.time)),released:false,impacted:false,targetId:target.id};
  actor.wait=0;this.emit('windup',actor,target,0,{kind,style:attackStyle(actor),at:this.time-actor.action.elapsed,windup:actor.action.windup});this.advanceAction(actor,0);
 }
 advanceAction(actor,dt){const a=actor.action;if(!a)return;a.elapsed+=dt;
  if(!a.released&&a.elapsed>=a.windup){a.released=true;const target=this.targetFor(actor,a.kind);if(target)a.targetId=target.id;this.emit('release',actor,target,0,{kind:a.kind,style:attackStyle(actor),travel:a.travel,at:this.time-Math.max(0,a.elapsed-a.windup)});}
  if(!a.impacted&&a.elapsed>=a.impactAt){a.impacted=true;const target=this.targetFor(actor,a.kind);if(target)a.targetId=target.id;this.eventAt=this.time-Math.max(0,a.elapsed-a.impactAt);if(a.kind==='skill')this.skill(actor);else this.normal(actor);this.eventAt=null;}
  if(a.kind==='skill'&&actor.catId==='ink'&&a.comboLeft){while(a.comboLeft&&a.elapsed+1e-9>=a.impactAt+(3-a.comboLeft)*.12){this.eventAt=this.time-Math.max(0,a.elapsed-(a.impactAt+(3-a.comboLeft)*.12));let target=this.enemies.find(e=>e.id===a.targetId);if((!target||target.hp<=0)&&skillTuning(actor.skillRank).inkRetarget){target=this.targetFor(actor,'skill');if(target)a.targetId=target.id;}this.harm(target,Math.floor((mulDiv(actor.atk,skillTuning(actor.skillRank).inkHit)+(3-a.comboLeft))/3),actor,{type:'physical',bonusPen:skillTuning(actor.skillRank).inkPen});a.comboLeft--;this.eventAt=null;}}
  if(a.elapsed>=a.duration)actor.action=null;
 }
 normal(actor){if(actor.catId==='pudding'){if(actor.selfShieldRound===this.round)return;actor.normalRound=this.round;actor.shieldPunch.deferSelfShield=true;}const target=this.targetFor(actor);if(!target)return;const crit=actor.side==='p'&&Math.floor(this.rng()*100)<actor.crit;const dealt=this.harm(target,mulDiv(actor.atk,crit?180:100),actor,{crit,type:actor.normalDamageType});
  if(actor.ambusher&&(actor.attacks||0)%3===2&&target.hp>0&&dealt>0){target.energy=Math.max(0,target.energy-12);if(target.shieldPunch)target.shieldPunch.energy=target.energy;this.emit('status',actor,target,0,{text:'能量 -12'});}
  if(actor.side==='p'){actor.runeAttacks++;if(actor.rune==='followup'&&actor.runeAttacks%4===0&&target.hp>0)this.harm(target,mulDiv(actor.atk,40),actor,{type:actor.normalDamageType});}
  if(actor.catId==='bolt'&&actor.level>=40){const tune=skillTuning(actor.skillRank);if(target.armor>mulDiv(target.initialArmor,tune.boltFloor))target.armor=Math.max(mulDiv(target.initialArmor,tune.boltFloor),target.armor-tune.boltNormal);}
  if(actor.side==='p'){actor.energy=Math.min(100,actor.energy+(actor.catId==='milk'&&actor.level>=5?32:22)+(actor.gearSets?.includes('clock')?8:0));if(crit&&(this.buff.burn>0||actor.gearSets?.includes('ember')))this.applyBurn(target,mulDiv(actor.atk,actor.gearSets?.includes('ember')?30:this.buff.burn),2,actor);}
  else {actor.attacks++;if(actor.type==='mop'){const ti=this.turnQueue.indexOf(target.id);if(ti>=0)this.turnQueue.push(...this.turnQueue.splice(ti,1));this.emit('status',actor,target,0,{text:'迟缓'});}if(actor.type==='bag'&&actor.attacks%3===0&&this.alive('e').length){const ally=this.alive('e').reduce((a,b)=>a.hp/a.maxHp<b.hp/b.maxHp?a:b);this.heal(ally,mulDiv(actor.maxHp,12),actor);}}
 }
 runeSkill(h){if(h.rune==='focus'&&this.round>=h.nextRuneSkill){h.energy=Math.min(100,h.energy+6);h.nextRuneSkill=this.round+2;if(h.shieldPunch)h.shieldPunch.energy=h.energy;}}
 skill(h){h.energy=0;this.emit('skill',h,h,0,{text:CATS.find(c=>c.id===h.catId).skill,targets:this.skillTargets(h).map(a=>a.id)});const es=this.alive('e'),ps=this.alive('p');if(!es.length)return;let t=es[0];const sk=skillTuning(h.skillRank);
  if(h.catId==='orange'&&h.level>=40){const weakest=ps.reduce((a,b)=>a.hp/a.maxHp<b.hp/b.maxHp?a:b);this.shield(weakest,mulDiv(weakest.maxHp,8),h);}
  if(h.catId==='orange'&&h.level>=80)for(const p of ps)if(p!==h)p.energy=Math.min(100,p.energy+12);
  if(h.catId==='milk'&&h.level>=80)for(const p of ps){p.burn=0;p.burnTime=0;p.burnSource=null;}
  if(h.catId==='spark'&&h.level>=80)for(const e of es)e.scorchedUntil=this.round+1;
  if(h.catId==='orange'){this.shield(h,mulDiv(h.maxHp,sk.orangeSelf),h);for(const p of ps.filter(x=>x!==h))this.shield(p,mulDiv(p.maxHp,sk.orangeTeam),h);}
  if(h.catId==='ink'){t=es.reduce((a,b)=>a.hp<b.hp?a:b);const hits=h.action?1:3;for(let i=0;i<hits;i++){if(t.hp<=0&&sk.inkRetarget)t=this.targetFor(h,'skill')||t;this.harm(t,Math.floor((mulDiv(h.atk,sk.inkHit)+i)/3),h,{type:'physical',bonusPen:sk.inkPen});}if(h.action){h.action.targetId=t.id;h.action.comboLeft=2;}}
  if(h.catId==='milk')for(const p of ps)this.heal(p,mulDiv(h.maxHp,sk.milkHeal),h);
  if(h.catId==='spark')for(const e of es){this.harm(e,mulDiv(h.atk,sk.sparkHit),h,{type:'magic'});this.applyBurn(e,mulDiv(h.atk,h.level>=5?sk.sparkBurn:60),h.level>=5?sk.sparkDuration:2,h);}
  if(h.catId==='mint'){t=this.targetFor(h,'skill');this.harm(t,mulDiv(h.atk,sk.mintHit+(h.level>=5?30:0)),h,{type:'magic'});if(h.level>=80)t.magicResist=mulDiv(t.magicResist,80);t.stun=Math.max(t.stun,1);if(t.charge>0){t.charge=0;t.skillWait=3;this.emit('interrupt',h,t,0,{text:'已打断'});}}
  if(h.catId==='bolt'){t.armor=Math.min(t.armor,Math.max(mulDiv(t.initialArmor,20),mulDiv(t.armor,100-(h.level>=5?60:40)-sk.boltShred)));this.harm(t,mulDiv(h.atk,sk.boltHit),h,{type:'physical'});this.emit('status',h,t,0,{text:'破甲'});}
  if(h.catId==='pudding')this.shield(h,mulDiv(h.maxHp,sk.puddingSelf),h);
  if(h.catId==='star')for(const p of ps){if(p!==h){const energy=(h.level>=80?44:36)+sk.starEnergy,overflow=Math.max(0,p.energy+energy-100);p.energy=Math.min(100,p.energy+energy);if(sk.starOverflow&&overflow>0)this.shield(p,Math.min(mulDiv(p.maxHp,8),mulDiv(p.maxHp,overflow,500)),h);}this.heal(p,mulDiv(h.atk,sk.starHeal),h);}
  this.runeSkill(h);
 }
 openCan(){
  if(this.result||this.canCd>0||this.canSequence)return false;
  const ps=this.alive('p'),es=this.alive('e');if(!ps.length||!es.length)return false;
  this.canCd=this.buff.canCd;const targets=canTargetOrder(es),duration=canDuration(targets.length);
  this.canSequence={born:this.time,until:this.time+duration,source:ps[0],friends:ps.map(p=>p.id),targets,attack:mulDiv(ps.reduce((n,p)=>n+p.atk,0),80),healed:false,next:0};
  // Emergency interrupt remains immediate; damage and healing follow the artwork.
  for(const e of es)if(e.charge>0){e.charge=0;e.skillWait=3;e.stun=1;this.emit('interrupt',ps[0],e,0,{text:'打断蓄力'});}
  this.emit('can',ps[0],es[0],0,{targets,friends:this.canSequence.friends,duration});return true;
 }
 advanceCan(){
  const c=this.canSequence;if(!c)return;
  const age=this.time-c.born;this.canEvent=true;
  if(!c.healed&&age+1e-9>=CAN_TIMING.heal){c.healed=true;this.eventAt=c.born+CAN_TIMING.heal;for(const id of c.friends){const p=this.heroes.find(p=>p.id===id);if(p?.hp>0){this.heal(p,mulDiv(p.maxHp,20),c.source);p.energy=Math.min(100,p.energy+18);}}}
  while(c.next<c.targets.length&&age+1e-9>=canHitAt(c.next)){this.eventAt=c.born+canHitAt(c.next);const id=c.targets[c.next++],e=this.enemies.find(e=>e.id===id);if(e?.hp>0)this.harm(e,c.attack,c.source,{type:'physical'});}
  this.eventAt=null;this.canEvent=false;if(this.time+1e-9>=c.until)this.canSequence=null;
 }
 syncStats(s,{preserveHealthRatio=false}={}){this.buff=buffs(s);for(const h of this.heroes){const n=catStats(s,h.catId,h.gear),oldMax=h.maxHp,ratio=h.hp/oldMax,add=n.hp-oldMax;h.maxHp=n.hp;if(h.hp>0)h.hp=preserveHealthRatio?resizeAmount(h,'hp',oldMax,n.hp):clamp(h.hp+Math.max(0,add),1,h.maxHp);h.shield=Math.min(n.hp,preserveHealthRatio?resizeAmount(h,'shield',oldMax,n.hp):h.shield);if(h.shieldPunch)h.shieldPunch.config.selfShieldRatio=mulDiv(skillTuning(n.skillRank).puddingSelf,this.shieldFactor({...h,level:n.level}));for(const key of ['atk','crit','level','stars','skillRank','armor','magicResist','armorPen','magicPen','normalDamageType','skillDamageType'])h[key]=n[key];}}
 checkEnd(){if(!this.alive('e').length){if(!this.canSequence)this.result='win';}else if(!this.alive('p').length||this.round>30)this.result='lose';return this.result;}
 // Tutorial animates only the manually triggered support; no actor turns or auto advance.
 tickCanDemo(dt){if(dt<=0)return this.events.splice(0);dt=clamp(dt,0,.25);this.time+=dt;this.canCd=this.canCd-dt<1e-6?0:this.canCd-dt;this.advanceCan();return this.events.splice(0);}
 tick(dt){if(this.result||dt<=0)return this.events.splice(0);dt=clamp(dt,0,.25);this.stepStart=this.time;this.time+=dt;this.canCd=this.canCd-dt<1e-6?0:this.canCd-dt;
  this.advanceCan();
  for(const a of [...this.heroes,...this.enemies]){if(!a.action){const old=a.wait;a.wait=Math.max(0,a.wait-dt);if(old>0&&a.wait===0)a.readyAt=this.time-dt+old;}}
  this.selectTurn();
  // Let the lid leave the screen before loot or the next wave can cover it.
  if(!this.alive('e').length){this.checkEnd();return this.events.splice(0);}
  for(const a of [...this.heroes,...this.enemies]){if(a.hp<=0){if(a.shieldPunch)this.updateShieldWarrior(a);continue;}if(this.canSequence&&a.shieldPunch?.state==='punching'){a.shieldPunch.hitAt+=dt;a.shieldPunch.recoverAt+=dt;}if(a.shieldPunch&&this.updateShieldWarrior(a)){if(a.id===this.turnActor&&!a.action)this.turnStarted=true;continue;}if(a.stun>0){if(a.action){a.action=null;this.emit('cancel',a,a);}continue;}
   if(a.id!==this.turnActor||this.canSequence)continue;
   if(!this.turnStarted&&a.arenaHealer&&a.turns>=a.nextHeal){a.nextHeal=a.turns+2;for(const ally of this.enemies.slice(0,2))if(ally.hp>0)this.heal(ally,mulDiv(ally.maxHp,a.healRatio||16),a);this.turnStarted=true;this.emit('status',a,a,0,{text:'补给前排'});continue;}
   if(a.side==='e'&&a.boss&&!this.turnStarted){if(a.charge>0){a.charge=0;for(const p of this.alive('p'))this.harm(p,mulDiv(a.atk,155),a,{type:a.skillDamageType});a.skillWait=3;a.burstUntil=this.time+.38;this.turnStarted=true;this.emit('burst',a,a);continue;}if(a.skillWait<=0){a.action=null;a.charge=1;this.turnStarted=true;this.emit('charge',a,a,0,{text:'下回合重击'});continue;}}
   if(a.action)this.advanceAction(a,dt);else if(!this.turnStarted)this.beginAction(a,a.side==='p'&&a.catId!=='pudding'&&a.energy>=100?'skill':'normal');
  }this.checkEnd();return this.events.splice(0);
 }
}
export function settleBattle(s,b,now=Date.now()){if(!b.result||b.resolved)return null;b.resolved=true;s.seconds+=Math.floor(b.time);
 if(b.activity){if(b.result==='lose')return {win:false,activity:true,unlocked:[]};const reward=settleActivity(s,b.activity,now);if(!reward)return null;recordActivity(s,'arena',1,now);recordActivity(s,'patrol',1,now);return {win:true,activity:true,...reward,unlocked:[],complete:false};}
 if(b.weekly){if(b.result==='lose')return {win:false,arena:true,gold:0,badges:0,unlocked:[]};recordActivity(s,'arena',1,now);recordActivity(s,'patrol',1,now);const reward=settleWeekly(s,b.weekly.tier,b.weekly.week,now);const gearLoot=reward.gold?gearDrop(s,Math.min(600,b.weekly.tier*150),{guaranteed:true}):null;return {win:true,arena:true,weekly:true,gearLoot,...reward,unlocked:[],complete:false};}
 if(b.mode==='arena'){if(b.result==='lose')return {win:false,arena:true,gold:0,badges:0,unlocked:[]};if(!arenaOpen(s,b.arenaTier))return null;const info=arenaInfo(b.arenaTier),first=b.arenaTier>(s.arenaCleared||0),badges=0,gold=first?500*b.arenaTier:0;s.gold+=gold;s.arenaCleared=Math.max(s.arenaCleared,b.arenaTier);recordActivity(s,'arena',1,now);recordActivity(s,'patrol',1,now);const gearLoot=first?gearDrop(s,Math.min(600,b.arenaTier*45),{guaranteed:true}):null;return {win:true,arena:true,gold,badges,gearLoot,first,unlocked:[],complete:false};}
 if(b.farm||b.stage!==s.stage||b.stage<=s.runCleared)return null;
 s.kills+=b.kills;if(b.result==='lose')return {win:false,gold:0,supplies:0,unlocked:[]};
 if(b.farm||b.stage!==s.stage||b.stage<=s.runCleared)return null;
 const before=s.highest,reward=rewardFor(s,b.stage,b.farm);s.gold+=reward;s.wins++;recordActivity(s,'patrol',1,now);const drop=patrolDrop(b.stage);grantPatrolDrop(s,drop);const supplies=drop?.id==='supplies'?drop.count:0;
 if(!b.farm){s.runCleared=b.stage;s.highest=Math.max(s.highest,b.stage);s.stage=Math.min(MAX_STAGE,b.stage+1);if(b.stage%5===0)s.bosses++;}
 const joins=[];
 const gearLoot=null;
 return {win:true,gold:reward,...(drop?{[drop.id]:drop.count}:{}),supplies,gearLoot,unlocked:joins,complete:s.runCleared===MAX_STAGE&&!b.farm};
}
function checksum(str){let h=2166136261;for(let i=0;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),16777619);return (h>>>0).toString(16);}
export function encodeSave(s){const payload=JSON.stringify(s);return JSON.stringify({format:'CAN-CLUB-1',checksum:checksum(payload),payload});}
export function decodeSave(text,now=Date.now()){if(typeof text!=='string'||text.length>100000)throw Error('存档过大');let e;try{e=JSON.parse(text);}catch{throw Error('存档格式不正确');}if(e.format!=='CAN-CLUB-1'||typeof e.payload!=='string'||checksum(e.payload)!==e.checksum)throw Error('存档不完整或校验不符');return normalizeState(JSON.parse(e.payload),now);}
