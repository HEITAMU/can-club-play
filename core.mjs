import {actionTiming,attackStyle} from './motion.mjs?v=0.5.1';
export const VERSION=1, MAX_STAGE=120, MAX_LEVEL=100;
export const CATS=[
 {id:'orange',name:'橘座',job:'前排守护',tag:'守护',color:'#edab62',accent:'#c8793b',unlock:0,hp:205,atk:17,interval:1.5,skill:'锅盖护体',desc:'举起锅盖：获得自身生命 45% 的护盾，并为队友提供 12% 护盾。',passive:'5 级：受到伤害降低 15%。',quote:'这条街的罐头，我罩了。',gear:'pan'},
 {id:'ink',name:'阿墨',job:'单体输出',tag:'突袭',color:'#42465c',accent:'#929db5',unlock:0,hp:116,atk:25,interval:1.25,skill:'飞鱼三连',desc:'连续命中生命最低的敌人，合计造成 330% 攻击伤害，穿透部分护甲。',passive:'5 级：暴击率额外提高 15%。',quote:'别眨眼，鱼已经到了。',gear:'scarf'},
 {id:'milk',name:'奶盖',job:'全队治疗',tag:'支援',color:'#f8ead8',accent:'#c6a2bf',unlock:3,hp:145,atk:13,interval:1.6,skill:'热牛奶时间',desc:'治疗全体队友，数值相当于奶盖最大生命的 28%。',passive:'5 级：普攻回复的能量从 22 提高到 32。',quote:'打完这一架，记得吃饭。',gear:'nurse'},
 {id:'spark',name:'火花',job:'群体灼烧',tag:'爆发',color:'#d98f75',accent:'#8f494b',unlock:8,hp:112,atk:27,interval:1.55,skill:'辣椒罐头',desc:'对全体敌人造成 160% 攻击伤害，并施加每秒 30% 攻击的灼烧。',passive:'5 级：灼烧持续时间从 4 秒提高到 6 秒。',quote:'微辣。猫猫的微辣。',gear:'goggles'},
 {id:'mint',name:'薄荷',job:'眩晕控制',tag:'控制',color:'#a9d4c1',accent:'#4a8d83',unlock:15,hp:133,atk:22,interval:1.3,skill:'冰镇气泡',desc:'对生命最多的敌人造成 230% 攻击伤害，眩晕 1.8 秒并打断蓄力。',passive:'5 级：眩晕时间提高到 2.6 秒。',quote:'别急，先冷静一下。',gear:'hood'},
 {id:'bolt',name:'螺丝',job:'破甲专家',tag:'破甲',color:'#adbacb',accent:'#636e8b',unlock:25,hp:162,atk:24,interval:1.5,skill:'扳手大修',desc:'造成 300% 攻击伤害，并永久降低当前目标 50% 的护甲。',passive:'5 级：护甲降低幅度提高到 75%。',quote:'修不好，就再拧一下。',gear:'helmet'},
 {id:'pudding',name:'布丁',job:'吸血守护',tag:'守护',color:'#d6bb98',accent:'#876555',unlock:40,hp:235,atk:22,interval:1.65,skill:'软乎乎重击',desc:'重击全部敌人，造成 140% 攻击伤害；为全队提供各自生命 18% 的护盾。',passive:'5 级：攻击伤害的 22% 转为自身治疗。',quote:'胖不是问题，站得住才是。',gear:'cape'},
 {id:'star',name:'星斑',job:'能量辅助',tag:'支援',color:'#c4b1df',accent:'#78669f',unlock:60,hp:150,atk:19,interval:1.4,skill:'今晚有星星',desc:'为其他队友回复 48 能量，并治疗相当于星斑攻击 160% 的生命。',passive:'5 级：开场拥有 40 点能量。',quote:'许个愿，然后自己去实现。',gear:'wizard'}
];
export const RELICS=[
 {id:'claw',name:'金属猫爪',desc:'全队攻击 +12%',icon:'claw',color:'#f2a278'},
 {id:'coat',name:'棉花披风',desc:'全队生命 +15%',icon:'coat',color:'#b5c8ef'},
 {id:'bell',name:'轻巧铃铛',desc:'全队攻击速度 +8%',icon:'bell',color:'#f3d06d'},
 {id:'scope',name:'鱼骨准星',desc:'暴击率 +5 个百分点',icon:'scope',color:'#abdbc6'},
 {id:'bowl',name:'温热饭碗',desc:'每秒回复全队 0.8% 生命',icon:'bowl',color:'#f5b1bf'},
 {id:'can',name:'救援工具箱',desc:'救援技能冷却缩短 0.8 秒',icon:'can',color:'#a8d7e4'},
 {id:'magnet',name:'招财磁铁',desc:'战斗鱼币奖励 +12%',icon:'magnet',color:'#e6b56f'},
 {id:'thermos',name:'保温鱼箱',desc:'鱼摊产量 +20%',icon:'thermos',color:'#8bc7c2'},
 {id:'thorn',name:'刺刺项圈',desc:'反弹受到伤害的 10%',icon:'thorn',color:'#bdabd5'},
 {id:'charm',name:'平安小袋',desc:'开场护盾 +10% 生命、能量 +5',icon:'charm',color:'#edac91'},
 {id:'match',name:'辣椒火柴',desc:'暴击附加 2 秒灼烧，每秒 35% 攻击',icon:'match',color:'#eb8f72'},
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
 {id:'milk',name:'有人照顾才走得远',desc:'通过第 3 关，结识奶盖',key:'highest',goal:3,reward:150},
 {id:'train',name:'练一练，强一点',desc:'累计训练猫咪 10 次',key:'upgrades',goal:10,reward:260},
 {id:'boss',name:'大个子也没在怕',desc:'累计击败 3 位首领',key:'bosses',goal:3,reward:500},
 {id:'wins',name:'这条街我熟',desc:'累计胜利 20 场',key:'wins',goal:20,reward:650},
 {id:'relic',name:'叮叮当当一大包',desc:'累计取得 5 件战利品',key:'relicCount',goal:5,reward:800},
 {id:'chapter',name:'天台已经安全',desc:'通过第 20 关',key:'highest',goal:20,reward:1600},
 {id:'roster',name:'一家猫就要整整齐齐',desc:'解锁 6 位队员',key:'cats',goal:6,reward:2400},
 {id:'shift',name:'新的一班更强',desc:'进行 1 次换班远征',key:'prestiges',goal:1,reward:2400},
 {id:'half',name:'走到霓虹尽头',desc:'通过第 60 关',key:'highest',goal:60,reward:6000},
 {id:'end',name:'月光罐头收藏家',desc:'通过第 120 关',key:'highest',goal:120,reward:16000}
];
export function initialState(now=Date.now()){return {version:VERSION,gold:200,levels:Object.fromEntries(CATS.map(c=>[c.id,1])),party:['orange','ink'],stage:1,runCleared:0,highest:0,bones:0,prestiges:0,relics:{},pending:null,claimed:[],wins:0,bosses:0,kills:0,upgrades:0,relicCount:0,idle:0,lastAccrued:now,onboarded:false,auto:true,speed:1,sound:false,rescueSeen:false,created:now,seconds:0};}
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const num=(v,d=0,a=0,b=1e12)=>typeof v==='number'&&Number.isFinite(v)?clamp(v,a,b):d;
export function unlocked(s){return CATS.filter(c=>s.highest>=c.unlock);}
// Replacing a stronger deployed cat transfers its training to the newcomer.
// Swap levels so every paid level is conserved, even across repeated swaps.
// Repositioning existing teammates, adding to an empty slot, and replacing a
// lower-level cat never changes levels.
export function inheritanceFor(s,slot,id){if(!Number.isInteger(slot)||slot<0||slot>2||!unlocked(s).some(c=>c.id===id)||s.party.includes(id))return null;const from=s.party[slot];return from&&s.levels[from]>s.levels[id]?{from,to:id,fromLevel:s.levels[from],toLevel:s.levels[id]}:null;}
export function inheritTraining(s,from,to){const available=unlocked(s).map(c=>c.id);if(from===to||!available.includes(from)||!available.includes(to)||s.levels[from]<=s.levels[to])return false;[s.levels[from],s.levels[to]]=[s.levels[to],s.levels[from]];return true;}
export function normalizeState(raw,now=Date.now()){
 if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.version!==VERSION)throw Error('不是兼容的罐头远征队存档');
 const s=initialState(now);
 for(const k of ['gold','bones','prestiges','wins','bosses','kills','upgrades','relicCount','seconds'])s[k]=Math.floor(num(raw[k]));
 s.highest=Math.floor(num(raw.highest,0,0,MAX_STAGE));s.runCleared=Math.floor(num(raw.runCleared,0,0,s.highest));s.stage=Math.min(MAX_STAGE,s.runCleared+1);
 for(const c of CATS)s.levels[c.id]=Math.floor(num(raw.levels?.[c.id],1,1,MAX_LEVEL));
 s.rescueSeen=raw.rescueSeen===true;
 const available=unlocked(s).map(c=>c.id);s.party=Array.isArray(raw.party)?[...new Set(raw.party)].filter(id=>available.includes(id)).slice(0,3):s.party;if(!s.party.length)s.party=['orange'];
 for(const r of RELICS){const level=Math.floor(num(raw.relics?.[r.id],0,0,5));if(level)s.relics[r.id]=level;}
 if(raw.pending&&Number.isInteger(raw.pending.stage)&&raw.pending.stage===s.runCleared&&raw.pending.stage%5===0){const opts=[...new Set(Array.isArray(raw.pending.options)?raw.pending.options:[])].filter(id=>RELICS.some(r=>r.id===id)&&(s.relics[id]||0)<5).slice(0,3);if(opts.length)s.pending={stage:raw.pending.stage,options:opts};}
 s.claimed=[...new Set(Array.isArray(raw.claimed)?raw.claimed:[])].filter(id=>QUESTS.some(q=>q.id===id));
 s.lastAccrued=num(raw.lastAccrued,now,0,now);s.idle=num(raw.idle,0,0,idleRate(s)*240);s.created=num(raw.created,now,0,now);s.onboarded=!!raw.onboarded;s.auto=raw.auto!==false;s.speed=raw.speed===2?2:1;s.sound=!!raw.sound;return s;
}
export function upgradeCost(level){return Math.round(22+level*12+Math.pow(level,1.65)*2);}
export function upgrade(s,id,count=1){const c=CATS.find(c=>c.id===id);if(!c||s.highest<c.unlock)return 0;let done=0;for(let i=0;i<clamp(count,1,10);i++){const l=s.levels[id],cost=upgradeCost(l);if(l>=MAX_LEVEL||s.gold<cost)break;s.gold-=cost;s.levels[id]++;s.upgrades++;done++;}return done;}
export function setParty(s,slot,id){if(!unlocked(s).some(c=>c.id===id)||!Number.isInteger(slot)||slot<0||slot>2)return false;const inheritance=inheritanceFor(s,slot,id);if(inheritance)inheritTraining(s,inheritance.from,id);const p=[...s.party],old=p.indexOf(id);if(old>=0){if(p[slot])p[old]=p[slot];else p.splice(old,1);}p[slot]=id;s.party=p.filter(Boolean).slice(0,3);return true;}
export function buffs(s){const r=s.relics;return {atk:1+.12*(r.claw||0),hp:1+.15*(r.coat||0),speed:1+.08*(r.bell||0),crit:.1+.05*(r.scope||0),regen:.008*(r.bowl||0),canCd:12-.8*(r.can||0),gold:1+.12*(r.magnet||0),idle:1+.2*(r.thermos||0),reflect:.1*(r.thorn||0),shield:.1*(r.charm||0),energy:5*(r.charm||0),burn:.35*(r.match||0),boss:1+.15*(r.badge||0)};}
export function catStats(s,id){const c=CATS.find(c=>c.id===id),l=s.levels[id]||1,b=buffs(s),m=(1+.18*(l-1))*(1+.08*Math.floor(l/10))*(1+.08*s.bones);return {hp:Math.round(c.hp*m*b.hp),atk:Math.round(c.atk*m*b.atk),interval:c.interval/b.speed,crit:Math.min(.8,b.crit+(id==='ink'&&l>=5?.15:0)),level:l};}
export function power(s){return s.party.reduce((n,id)=>{const c=catStats(s,id);return n+Math.round(c.hp*.3+c.atk/c.interval*5);},0);}
export function idleRate(s){return Math.round((18+Math.max(s.highest,1)*3)*buffs(s).idle);}
export function accrueIdle(s,now=Date.now()){const elapsed=clamp(now-s.lastAccrued,0,4*3600e3);const amount=elapsed/60000*idleRate(s);s.idle=Math.min(idleRate(s)*240,s.idle+amount);s.lastAccrued=now;return amount;}
export function claimIdle(s,now=Date.now()){accrueIdle(s,now);const n=Math.floor(s.idle);s.gold+=n;s.idle-=n;return n;}
export function questValue(s,q){return q.key==='cats'?unlocked(s).length:s[q.key]||0;}
export function claimQuests(s){let sum=0;for(const q of QUESTS){if(!s.claimed.includes(q.id)&&questValue(s,q)>=q.goal){s.claimed.push(q.id);s.gold+=q.reward;sum+=q.reward;}}return sum;}
export function rewardFor(s,stage,farm=false){return Math.round((30+stage*6)*buffs(s).gold*(farm?.6:1));}
export function seeded(seed){let x=(seed>>>0)||1;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296;};}
export function relicOptions(s,stage){const eligible=RELICS.filter(r=>(s.relics[r.id]||0)<5).map(r=>r.id);const rnd=seeded(stage*379+s.prestiges*7127+17);for(let i=eligible.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[eligible[i],eligible[j]]=[eligible[j],eligible[i]];}return eligible.slice(0,3);}
export function chooseRelic(s,id){if(!s.pending||!s.pending.options.includes(id)||(s.relics[id]||0)>=5)return false;s.relics[id]=(s.relics[id]||0)+1;s.relicCount++;s.pending=null;return true;}
export function prestigeGain(s){return s.runCleared>=20?Math.floor(s.runCleared/10):0;}
export function prestige(s){const gain=prestigeGain(s);if(!gain||s.pending)return 0;s.bones+=gain;s.prestiges++;s.runCleared=0;s.stage=1;s.relics={};s.pending=null;s.gold+=200;return gain;}
export function chapterOf(stage){return CHAPTERS[Math.min(5,Math.floor((stage-1)/20))];}
export function enemiesFor(stage){const boss=stage%5===0,ch=chapterOf(stage),m=1+.14*(stage-1)+.0046*(stage-1)**2,ci=Math.floor((stage-1)/20);const list=[];
 const mob=(type,index)=>({id:'e'+index,type,name:names[type],maxHp:Math.round((type==='box'?115:type==='bag'?78:90)*m),atk:Math.round((type==='battery'?13:9)*m),interval:type==='drone'?1.45:2.1,armor:type==='box'?.35:0,boss:false});
 if(boss){const chapterBoss=stage%20===0;list.push({id:'e0',type:ch.type,name:chapterBoss?ch.boss:['扫街队长','捣蛋头目','罐头大盗'][Math.floor((stage%20)/5)-1]+' · '+ch.boss,maxHp:Math.round((chapterBoss?345:275)*m),atk:Math.round((chapterBoss?16:13)*m),interval:2.15,armor:ch.type==='box'?.25:ch.type==='fridge'?.15:0,boss:true});if(stage>=15)list.push(mob(MOB_TYPES[(ci+1)%6],1));}
 else {list.push(mob(MOB_TYPES[(stage+ci-1)%6],0));if(stage>1)list.push(mob(MOB_TYPES[(stage+ci+1)%6],1));if(stage>=30&&stage%3===0)list.push(mob(MOB_TYPES[(stage+2)%6],2));}
 return list;
}
export class Battle {
 constructor(s,{stage=s.stage,farm=false,seed=stage*173+s.wins*29+37}={}){
  this.stage=stage;this.farm=farm;this.time=0;this.result=null;this.resolved=false;this.rng=seeded(seed);this.events=[];this.kills=0;this.canCd=0;this.buff=buffs(s);this.fxSerial=0;
  this.heroes=s.party.map((id,i)=>{const c=CATS.find(c=>c.id===id),st=catStats(s,id);return {id:'p'+i,catId:id,name:c.name,side:'p',maxHp:st.hp,hp:st.hp,atk:st.atk,interval:st.interval,crit:st.crit,level:st.level,energy:Math.min(99,this.buff.energy+(id==='star'&&st.level>=5?40:0)),shield:st.hp*this.buff.shield,armor:0,wait:.3+i*.15,stun:0,burn:0,burnTime:0};});
  this.enemies=enemiesFor(stage).map((e,i)=>({...e,hp:e.maxHp,side:'e',energy:0,shield:e.type==='fridge'?e.maxHp*.2:0,wait:1.3+i*.4,skillWait:e.boss?6:99,charge:0,stun:0,burn:0,burnTime:0,attacks:0}));
 }
 alive(side){return (side==='p'?this.heroes:this.enemies).filter(x=>x.hp>0);}
 frontline(){return this.alive('p')[0]||null;}
 emit(type,from,to,value=0,extra={}){this.events.push({type,from:from?.id,to:to?.id,value:Math.round(value),serial:++this.fxSerial,...extra});}
 harm(target,raw,source,{crit=false,pierce=0,reflect=true,dot=false}={}){
  if(!target||target.hp<=0)return 0;const ramp=this.time>40?1+(this.time-40)*.025:1;
  let amount=raw*(1-Math.max(0,(target.armor||0)-pierce))*ramp;
  if(target.catId==='orange'&&target.level>=5)amount*=.85;
  if(source?.side==='p'&&target.boss)amount*=this.buff.boss;
  const shield=Math.min(target.shield,amount);target.shield-=shield;amount-=shield;const hit=Math.min(target.hp,amount);target.hp=Math.max(0,target.hp-amount);
  this.emit(dot?'burn':'hit',source,target,hit+shield,{crit,shield:shield>0});
  if(!dot)target.hitUntil=this.time+.18;
  if(target.hp<=0){target.action=null;this.emit('down',source,target);if(target.side==='e')this.kills++;}
  if(source?.catId==='pudding'&&source.level>=5&&hit>0)this.heal(source,hit*.22,source);
  if(reflect&&target.side==='p'&&source?.side==='e'&&source.hp>0&&this.buff.reflect>0)this.harm(source,(hit+shield)*this.buff.reflect,target,{reflect:false});return hit;
 }
 heal(target,amount,source){if(target.hp<=0)return;const n=Math.min(target.maxHp-target.hp,amount);target.hp+=n;if(n>1)this.emit('heal',source,target,n);}
 shield(target,amount,source){target.shield=Math.min(target.maxHp,target.shield+amount);this.emit('shield',source,target,amount);}
 targetFor(actor,kind='normal'){
  if(kind==='skill'&&['orange','milk','star'].includes(actor.catId))return actor;
  const foes=this.alive(actor.side==='p'?'e':'p');if(!foes.length)return null;
  if(actor.catId==='ink')return foes.reduce((a,b)=>a.hp<b.hp?a:b);
  if(kind==='skill'&&actor.catId==='mint')return foes.reduce((a,b)=>a.hp>b.hp?a:b);
  return foes[0];
 }
 beginAction(actor,kind){const target=this.targetFor(actor,kind);if(!target)return;
  actor.action={kind,...actionTiming(actor,kind),elapsed:Math.max(0,-actor.wait),released:false,impacted:false,targetId:target.id};
  actor.wait=actor.interval+Math.min(0,actor.wait);this.emit('windup',actor,target,0,{kind,style:attackStyle(actor)});this.advanceAction(actor,0);
 }
 advanceAction(actor,dt){const a=actor.action;if(!a)return;a.elapsed+=dt;
  if(!a.released&&a.elapsed>=a.windup){a.released=true;const target=this.targetFor(actor,a.kind);if(target)a.targetId=target.id;this.emit('release',actor,target,0,{kind:a.kind,style:attackStyle(actor),travel:a.travel});}
  if(!a.impacted&&a.elapsed>=a.impactAt){a.impacted=true;const target=this.targetFor(actor,a.kind);if(target)a.targetId=target.id;if(a.kind==='skill')this.skill(actor);else this.normal(actor);}
  if(a.elapsed>=a.duration)actor.action=null;
 }
 normal(actor){const foes=this.alive(actor.side==='p'?'e':'p');if(!foes.length)return;let target=foes[0];if(actor.side==='p'&&actor.catId==='ink')target=foes.reduce((a,b)=>a.hp<b.hp?a:b);const crit=actor.side==='p'&&this.rng()<actor.crit;this.harm(target,actor.atk*(crit?1.8:1),actor,{crit});
  if(actor.side==='p'){actor.energy=Math.min(100,actor.energy+(actor.catId==='milk'&&actor.level>=5?32:22));if(crit&&this.buff.burn>0){target.burn=Math.max(target.burn,actor.atk*this.buff.burn);target.burnTime=2;}}
  else {actor.attacks++;if(actor.type==='mop'){target.wait+=.28;this.emit('status',actor,target,0,{text:'迟缓'});}if(actor.type==='bag'&&actor.attacks%3===0){const ally=this.alive('e').reduce((a,b)=>a.hp/a.maxHp<b.hp/b.maxHp?a:b);this.heal(ally,actor.maxHp*.12,actor);}}
 }
 skill(h){h.energy=0;this.emit('skill',h,h,0,{text:CATS.find(c=>c.id===h.catId).skill});const es=this.alive('e'),ps=this.alive('p');if(!es.length)return;let t=es[0];
  if(h.catId==='orange'){this.shield(h,h.maxHp*.45,h);for(const p of ps.filter(x=>x!==h))this.shield(p,p.maxHp*.12,h);}
  if(h.catId==='ink'){t=es.reduce((a,b)=>a.hp<b.hp?a:b);this.harm(t,h.atk*3.3,h,{pierce:.25});}
  if(h.catId==='milk')for(const p of ps)this.heal(p,h.maxHp*.28,h);
  if(h.catId==='spark')for(const e of es){this.harm(e,h.atk*1.6,h);e.burn=Math.max(e.burn,h.atk*.3);e.burnTime=h.level>=5?6:4;}
  if(h.catId==='mint'){t=es.reduce((a,b)=>a.hp>b.hp?a:b);this.harm(t,h.atk*2.3,h);t.stun=h.level>=5?2.6:1.8;if(t.charge>0){t.charge=0;t.skillWait=5;this.emit('interrupt',h,t,0,{text:'已打断'});}}
  if(h.catId==='bolt'){t.armor*=h.level>=5?.25:.5;this.harm(t,h.atk*3,h);this.emit('status',h,t,0,{text:'破甲'});}
  if(h.catId==='pudding'){for(const e of es)this.harm(e,h.atk*1.4,h);for(const p of ps)this.shield(p,p.maxHp*.18,h);}
  if(h.catId==='star')for(const p of ps){if(p!==h)p.energy=Math.min(100,p.energy+48);this.heal(p,h.atk*1.6,h);}
 }
 openCan(){if(this.result||this.canCd>0)return false;this.canCd=this.buff.canCd;const ps=this.alive('p'),es=this.alive('e');if(!ps.length||!es.length)return false;const atk=ps.reduce((n,p)=>n+p.atk,0);for(const p of ps){this.heal(p,p.maxHp*.2,p);p.energy=Math.min(100,p.energy+18);}for(const e of es){this.harm(e,atk*.8,ps[0]);if(e.charge>0){e.charge=0;e.skillWait=6;e.stun=.7;this.emit('interrupt',ps[0],e,0,{text:'打断蓄力'});}}this.emit('can',ps[0],es[0]);this.checkEnd();return true;}
 syncStats(s,{preserveHealthRatio=false}={}){this.buff=buffs(s);for(const h of this.heroes){const n=catStats(s,h.catId),oldMax=h.maxHp,ratio=h.hp/oldMax,add=n.hp-oldMax;h.maxHp=n.hp;if(h.hp>0)h.hp=preserveHealthRatio?ratio*n.hp:clamp(h.hp+Math.max(0,add),1,h.maxHp);h.shield=Math.min(n.hp,h.shield*(preserveHealthRatio?n.hp/oldMax:1));h.atk=n.atk;h.interval=n.interval;h.crit=n.crit;h.level=n.level;}}
 checkEnd(){if(!this.alive('e').length)this.result='win';else if(!this.alive('p').length||this.time>=75)this.result='lose';return this.result;}
 tick(dt){if(this.result)return this.events.splice(0);dt=clamp(dt,0,.25);this.time+=dt;this.canCd=Math.max(0,this.canCd-dt);
  for(const a of [...this.heroes,...this.enemies]){if(a.hp<=0)continue;a.stun=Math.max(0,a.stun-dt);if(a.burnTime>0){a.burnTime-=dt;this.harm(a,a.burn*dt,this.heroes[0],{dot:true,reflect:false});}if(a.side==='p'&&this.buff.regen>0)a.hp=Math.min(a.maxHp,a.hp+a.maxHp*this.buff.regen*dt);if(a.hp<=0)continue;if(a.stun>0){if(a.action){a.action=null;this.emit('cancel',a,a);}continue;}
   if(a.side==='e'&&a.boss){a.skillWait-=dt;if(a.charge>0){a.charge-=dt;if(a.charge<=0){for(const p of this.alive('p'))this.harm(p,a.atk*1.55,a);a.skillWait=7;a.burstUntil=this.time+.24;this.emit('burst',a,a);}continue;}if(a.skillWait<=0){a.action=null;a.charge=2;this.emit('charge',a,a,0,{text:'正在蓄力'});continue;}}
   a.wait-=dt;if(a.action)this.advanceAction(a,dt);else if(a.wait<=0)this.beginAction(a,a.side==='p'&&a.energy>=100?'skill':'normal');
  }this.checkEnd();return this.events.splice(0);
 }
}
export function settleBattle(s,b){if(!b.result||b.resolved)return null;b.resolved=true;s.kills+=b.kills;s.seconds+=Math.floor(b.time);if(b.result==='lose')return {win:false,gold:0,unlocked:[]};
 if(!b.farm&&(b.stage!==s.stage||b.stage<=s.runCleared))return null;
 const before=s.highest,reward=rewardFor(s,b.stage,b.farm);s.gold+=reward;s.wins++;
 if(!b.farm){s.runCleared=b.stage;s.highest=Math.max(s.highest,b.stage);s.stage=Math.min(MAX_STAGE,b.stage+1);if(b.stage%5===0){s.bosses++;const opts=relicOptions(s,b.stage);if(opts.length)s.pending={stage:b.stage,options:opts};}}
 const joins=CATS.filter(c=>c.unlock>before&&c.unlock<=s.highest);if(s.party.length<3&&joins.length)s.party.push(joins[0].id);
 return {win:true,gold:reward,unlocked:joins,complete:s.runCleared===MAX_STAGE&&!b.farm};
}
function checksum(str){let h=2166136261;for(let i=0;i<str.length;i++)h=Math.imul(h^str.charCodeAt(i),16777619);return (h>>>0).toString(16);}
export function encodeSave(s){const payload=JSON.stringify(s);return JSON.stringify({format:'CAN-CLUB-1',checksum:checksum(payload),payload});}
export function decodeSave(text,now=Date.now()){if(typeof text!=='string'||text.length>100000)throw Error('存档过大');let e;try{e=JSON.parse(text);}catch{throw Error('存档格式不正确');}if(e.format!=='CAN-CLUB-1'||typeof e.payload!=='string'||checksum(e.payload)!==e.checksum)throw Error('存档不完整或校验不符');return normalizeState(JSON.parse(e.payload),now);}
