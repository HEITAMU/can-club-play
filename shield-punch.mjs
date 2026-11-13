import {integer,mulDiv,accrueUnits} from './integer-math.mjs?v=0.25.1';
// 石墩: the punch is shield-triggered; only 护体劲 spends energy.
// Charge restores energy so the second shield does not depend on being attacked.
export const SHIELD_PUNCH_DEFAULTS=Object.freeze({startRatio:30,secondGainRatio:15,minCharge:1.35,shieldCapRatio:80,lockout:8,punchTravel:.42,recovery:.65,attackRatio:100,shieldRatio:160,energyCap:100,selfShieldRatio:35,normalEnergy:20,chargeEnergyPerSecond:35,absorbEnergy:12,absorbEnergyInterval:.8});
export function createShieldPunch({maxHp=1000,hp=maxHp,attack=100,energy=0,config={}}={}){
 const cfg={...SHIELD_PUNCH_DEFAULTS,...config};
 return{maxHp,hp,attack,config:cfg,energy:Math.max(0,Math.min(cfg.energyCap,energy)),shield:0,state:'normal',firstAt:null,secondAt:null,addedDuringCharge:0,shieldAtSecond:null,releaseAt:Infinity,hitAt:Infinity,recoverAt:Infinity,controlledUntil:-Infinity,lockoutUntil:-Infinity,absorbEnergyAt:-Infinity,hitDelivered:false,cancelReason:null};
}
const charging=s=>s.state==='charging'||s.state==='primed';
export function canNormalAttack(s,now){return s.hp>0&&s.state==='normal'&&now>=s.controlledUntil;}
function clearCharge(s){s.firstAt=null;s.secondAt=null;s.addedDuringCharge=0;s.shieldAtSecond=null;s.releaseAt=Infinity;s.hitAt=Infinity;s.recoverAt=Infinity;s.hitDelivered=false;}
function cancel(s,now,reason){clearCharge(s);s.cancelReason=reason;s.lockoutUntil=now+s.config.lockout;s.state=now<s.controlledUntil?'controlled':'normal';return{type:'cancel',at:now,reason};}
export function gainShield(s,amount,now,source='ally'){
 if(!Number.isFinite(amount)||amount<=0||s.hp<=0)return[];
 const events=[];
 const added=Math.max(0,Math.min(integer(amount),mulDiv(s.maxHp,s.config.shieldCapRatio)-s.shield));s.shield+=added;
 if(added)events.push({type:'shieldGain',at:now,amount:added,source});
 if(!added||now<s.controlledUntil)return events;
 if(s.state==='normal'&&now>=s.lockoutUntil&&s.shield>=mulDiv(s.maxHp,s.config.startRatio)){
  clearCharge(s);s.state='charging';s.firstAt=now;s.chargeEnergyAt=now;s.cancelReason=null;
  events.push({type:'chargeStart',at:now,shield:s.shield});
 }else if(s.state==='charging'){
  s.addedDuringCharge+=added;
  if(s.addedDuringCharge>=mulDiv(s.maxHp,s.config.secondGainRatio)){
   s.secondAt=now;s.shieldAtSecond=s.shield;s.state='primed';
   s.releaseAt=Math.max(now,s.firstAt+s.config.minCharge);s.hitAt=s.releaseAt+s.config.punchTravel;s.recoverAt=s.hitAt+s.config.recovery;
   events.push({type:'secondTrigger',at:now,shield:s.shieldAtSecond});
  }
 }
 return events;
}
export function loseShield(s,amount){if(!Number.isFinite(amount)||amount<=0)return 0;const removed=Math.min(s.shield,integer(amount));s.shield-=removed;return removed;}
export function castSelfShield(s,now){
 if(s.hp<=0||now<s.controlledUntil||!['normal','charging','primed'].includes(s.state)||s.energy<s.config.energyCap)return[];
 s.energy-=s.config.energyCap;
 return[{type:'selfShield',at:now,energyCost:s.config.energyCap},...gainShield(s,mulDiv(s.maxHp,s.config.selfShieldRatio),now,'self')];
}
export function gainEnergy(s,amount,now,source='external'){
 if(!Number.isFinite(amount)||amount<=0||s.hp<=0)return[];
 const added=Math.min(integer(amount),s.config.energyCap-s.energy);s.energy+=added;
 return[...(added?[{type:'energyGain',at:now,amount:added,source}]:[]),...castSelfShield(s,now)];
}
export function normalAttackEnergy(s,now){return canNormalAttack(s,now)?gainEnergy(s,s.config.normalEnergy,now,'normal'):[];}
// Only real enemy damage absorbed by shield produces energy, with a shared interval.
export function absorbShieldDamage(s,amount,now){
 const absorbed=loseShield(s,amount),events=absorbed?[{type:'shieldAbsorb',at:now,amount:absorbed}]:[];
 // A shield-breaking hit cancels before its energy can grant a replacement shield.
 if(charging(s)&&s.shield<=0)events.push(cancel(s,now,'shieldBroken'));
 if(absorbed&&now>=s.absorbEnergyAt+s.config.absorbEnergyInterval){s.absorbEnergyAt=now;events.push(...gainEnergy(s,s.config.absorbEnergy,now,'absorb'));}
 return events;
}
export function controlShieldPunch(s,now,duration=1){
 if(s.hp<=0||!Number.isFinite(duration)||duration<=0)return[];
 s.controlledUntil=Math.max(s.controlledUntil,now+duration);
 const canInterrupt=charging(s)||(s.state==='punching'&&!s.hitDelivered&&now<=s.hitAt);
 if(canInterrupt)return[cancel(s,now,'control')];
 clearCharge(s);s.state='controlled';return[{type:'controlStart',at:now}];
}
export function cleanseShieldPunch(s,now){s.controlledUntil=now;if(s.state==='controlled'){clearCharge(s);s.state='normal';}return[{type:'controlEnd',at:now}];}
export function tickShieldPunch(s,now,enemies=[]){
 const events=[];
 if(s.hp<=0){if(s.state!=='down'){clearCharge(s);s.state='down';events.push({type:'cancel',at:now,reason:'down'});}return events;}
 if(now<s.controlledUntil){s.state='controlled';return events;}
 if(s.state==='controlled'){clearCharge(s);s.state='normal';events.push({type:'controlEnd',at:now});}
 if(charging(s)&&s.shield<=0){events.push(cancel(s,now,'shieldBroken'));return events;}
 // Integrate simulation time once; paused/repeated ticks never grant extra energy.
 if(s.state==='charging'){
  const until=now;
  const elapsed=Math.max(0,integer(until*1000)-integer((s.chargeEnergyAt??s.firstAt)*1000));
  s.chargeEnergyAt=Math.max(s.chargeEnergyAt??s.firstAt,until);
  if(elapsed)events.push(...gainEnergy(s,accrueUnits(s,'chargeRemainder',s.config.chargeEnergyPerSecond,elapsed),until,'charge'));
 }
 events.push(...castSelfShield(s,now));
 if(s.state==='primed'&&now>=s.releaseAt){s.state='punching';s.shield=0;events.push({type:'punchStart',at:s.releaseAt});}
 if(s.state==='punching'&&!s.hitDelivered&&now>=s.hitAt){
  s.hitDelivered=true;const raw=mulDiv(s.attack,s.config.attackRatio)+mulDiv(s.shieldAtSecond,s.config.shieldRatio);
  const hits=enemies.filter(e=>e.hp>0&&e.side!=='ally').map(e=>({targetId:e.id,rawDamage:raw,damage:mulDiv(raw,100,100+Math.max(0,(e.armor||0)-(e.armorPenTaken||0)))}));
  events.push({type:'punchHit',at:s.hitAt,shieldAtSecond:s.shieldAtSecond,hits});s.lockoutUntil=s.hitAt+s.config.lockout;
 }
 if(s.state==='punching'&&now>=s.recoverAt){s.state='normal';clearCharge(s);events.push({type:'normal',at:now});events.push(...castSelfShield(s,now));}
 return events;
}
export function shieldPunchPose(s,now){
 if(charging(s)){const q=Math.max(0,Math.min(1,(now-s.firstAt)/s.config.minCharge)),pulse=Math.sin(now*10)*.008;return{time:now,near:1.65*q,far:-.25*q,lean:-.09*q,head:.04,breath:-.065*q+pulse,tail:-.1,face:'skill',run:0,bob:0,phase:s.state==='primed'?'锁定盾量':'蓄力',windup:q,charge:Math.min(1,s.shield*100/s.maxHp/s.config.shieldCapRatio),shoulderShift:-.015*q};}
 if(s.state==='punching'){const q=Math.max(0,Math.min(1,(now-s.releaseAt)/s.config.punchTravel)),back=Math.max(0,Math.min(1,(now-s.hitAt-.08)/(s.config.recovery-.08))),attack=Math.sin(q*Math.PI/2)*(1-back);return{time:now,near:1.65*(1-q)-.75*attack,far:-.25+.15*attack,lean:.14*attack,head:-.02,breath:.018*attack,tail:.13*attack,face:back>.6?'neutral':'attack',run:0,bob:0,phase:now<s.hitAt?'轰拳':'收拳',charge:Math.max(0,1-back),shoulderShift:.20*attack,armScale:1+.25*attack,punch:attack};}
 return{time:now,near:0,far:0,lean:s.state==='controlled'?-.08:0,head:s.state==='controlled'?-.10:0,breath:Math.sin(now*2.4)*.012,tail:Math.sin(now*3)*.07,face:s.state==='controlled'?'blink':'neutral',run:0,bob:0,phase:s.state==='controlled'?'受控':'普通状态',charge:0,shoulderShift:0};
}
export const SHIELD_DEMO_ENEMIES=[{id:'front1',hp:1600,armor:40},{id:'front2',hp:1600,armor:40},{id:'back1',hp:1300,armor:20},{id:'back2',hp:1300,armor:20},{id:'back3',hp:1300,armor:20}];
export function createShieldDemo(){return{s:createShieldPunch({energy:60}),enemies:SHIELD_DEMO_ENEMIES.map(e=>({...e,maxHp:e.hp})),events:[]};}
export function recordDemoEvents(d,events){d.events.push(...events);for(const e of events)if(e.type==='punchHit')for(const hit of e.hits){const target=d.enemies.find(t=>t.id===hit.targetId);if(target)target.hp=Math.max(0,target.hp-hit.damage);}return d;}
export function scriptedShieldPunch(time,interrupted=false){
 const d=createShieldDemo(),sequence=[{at:.35,type:'shield',value:350},{at:1.05,type:interrupted?'control':'absorb',value:interrupted?1.2:100},{at:1.75,type:'energy',value:40}];
 for(const e of sequence){if(e.at>time)break;recordDemoEvents(d,tickShieldPunch(d.s,e.at-.00001,d.enemies));if(e.type==='shield')recordDemoEvents(d,gainShield(d.s,e.value,e.at));else if(e.type==='control')recordDemoEvents(d,controlShieldPunch(d.s,e.at,e.value));else if(e.type==='absorb')recordDemoEvents(d,absorbShieldDamage(d.s,e.value,e.at));else recordDemoEvents(d,gainEnergy(d.s,e.value,e.at));recordDemoEvents(d,tickShieldPunch(d.s,e.at,d.enemies));}
 recordDemoEvents(d,tickShieldPunch(d.s,time,d.enemies));return d;
}
