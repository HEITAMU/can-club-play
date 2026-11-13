export const BAG_CAP=120,GEAR_MAX=12;
export const GEAR_SLOTS=[{id:'claw',name:'爪套',main:'atk',icon:0},{id:'coat',name:'围巾',main:'hp',icon:1},{id:'collar',name:'项圈',main:'armor',icon:8},{id:'brace',name:'挂件',main:'magicResist',icon:9},{id:'rune',name:'妙招牌',main:null,icon:11}];
export const RUNES=[
 {id:'followup',name:'补上一爪',desc:'每 4 次普攻，对原目标追加 40% 攻击力伤害；追加伤害不触发普攻效果。'},
 {id:'bulwark',name:'垫层软布',desc:'自身获得的护盾提高 8%。不额外触发一次加盾。'},
 {id:'focus',name:'留口气',desc:'释放主动技能后回复 6 能量，冷却 8 秒。'},
 {id:'warmth',name:'热乎一口',desc:'治疗生命比例低于 50% 的目标时，治疗量提高 10%。'},
 {id:'ember',name:'添把小火',desc:'对灼烧目标造成的直接伤害提高 8%，不加成持续伤害。'},
 {id:'steadfast',name:'缩成一团',desc:'生命首次降至 30% 以下且仍存活时，获得最大生命 8% 的护盾；每场一次。'}
];
export const QUALITIES=[{name:'普通',color:'#9dafa6',factor:1,subs:0},{name:'精良',color:'#8ebf9b',factor:1.2,subs:1},{name:'稀有',color:'#afa2d5',factor:1.45,subs:2},{name:'珍藏',color:'#e2bb75',factor:1.75,subs:3}];
export const GEAR_SETS=[
 {id:'hunt',name:'夜巡',two:'攻击 +12%',four:'对生命低于一半的敌人，直接伤害 +30%。',bonus:{atk:.12}},
 {id:'guard',name:'守摊',two:'生命 +18%',four:'开场获得自身生命 25% 护盾；自身获得的护盾 +20%。',bonus:{hp:.18}},
 {id:'ember',name:'炉边',two:'法术穿透 +12',four:'对灼烧目标伤害 +25%；普攻暴击附加 2 秒灼烧，每秒 30% 攻击。',bonus:{magicPen:12}},
 {id:'spring',name:'暖窝',two:'生命 +12%',four:'治疗量 +25%；每 6 秒回复自身 5% 最大生命。',bonus:{hp:.12}},
 {id:'clock',name:'叮当',two:'攻击速度 +10%',four:'每次普攻额外回复 8 能量。',bonus:{speed:.1}},
 {id:'thorn',name:'刺球',two:'护甲 +15',four:'反弹自身受到伤害的 15%，反伤不再触发反伤。',bonus:{armor:15}}
];
export const ATTRS={atk:{name:'攻击',base:.045,percent:true},hp:{name:'生命',base:.07,percent:true},armor:{name:'护甲',base:7},magicResist:{name:'魔抗',base:7},crit:{name:'暴击',base:.025,percent:true},speed:{name:'攻速',base:.025,percent:true},armorPen:{name:'护甲穿透',base:4},magicPen:{name:'法术穿透',base:4}};
const int=(n,max=1e9)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
const list=n=>Array.isArray(n)?n:[];
const roll=seed=>{let n=seed>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};};
const ITEM_NAMES={hunt:['磨爪旧布','半条围巾','掉漆铜扣','鱼骨哨'],guard:['加厚补丁','旧摊篷','铁皮扣','小锅盖'],ember:['焦边布','炉边旧布','红绳结','炉底火石'],spring:['软绒垫','晒暖的毛巾','棉线结','小奶瓶'],clock:['轻脚布','半截彩带','掉漆铃铛','发条纽扣'],thorn:['带钉补丁','毛边毯','刺球结','旧瓶盖']};
export const gearName=e=>e.slot==='rune'?RUNES.find(x=>x.id===e.rune).name:ITEM_NAMES[e.set][GEAR_SLOTS.findIndex(x=>x.id===e.slot)];
export const gearTier=stage=>Math.max(1,Math.min(6,1+Math.floor(Math.max(0,stage-1)/100)));
export const attrText=(key,value)=>ATTRS[key].name+' +'+(ATTRS[key].percent?(value*100).toFixed(1)+'%':Math.round(value));
export function normalizeInventory(raw,ids){
 const r=raw&&typeof raw==='object'?raw:{},items=[],seen=new Set();
 for(const x of list(r.items).slice(0,BAG_CAP)){
  if(!x||!/^g[1-9]\d{0,8}$/.test(x.id)||seen.has(x.id)||!GEAR_SLOTS.some(s=>s.id===x.slot)||(x.slot==='rune'?!RUNES.some(r=>r.id===x.rune):!GEAR_SETS.some(s=>s.id===x.set)))continue;
  seen.add(x.id);const quality=int(x.quality,3),keys=new Set();const subs=list(x.subs).filter(a=>a&&ATTRS[a.key]&&!keys.has(a.key)&&(keys.add(a.key),true)).slice(0,QUALITIES[quality].subs).map(a=>({key:a.key,roll:Math.max(.8,Math.min(1.2,Number.isFinite(a.roll)?a.roll:1)),growth:int(a.growth,4)}));
  let growth=Math.floor(int(x.enhance,12)/3);for(const a of subs){a.growth=Math.min(a.growth,growth);growth-=a.growth;}
  items.push({id:x.id,slot:x.slot,rune:x.slot==='rune'?x.rune:null,set:x.slot==='rune'?null:x.set,tier:Math.max(1,int(x.tier,6)),quality,enhance:int(x.enhance,12),subs,locked:x.locked===true,rerolls:int(x.rerolls,1000000)});
 }
 for(const e of items)if(e.slot==='rune'){e.tier=1;e.quality=1;e.enhance=0;e.subs=[];e.rerolls=0;}
 const equipped={},used=new Set();for(const id of ids){equipped[id]={};for(const slot of GEAR_SLOTS){const uid=r.equipped?.[id]?.[slot.id],e=items.find(e=>e.id===uid&&e.slot===slot.id);if(e&&!used.has(uid)){equipped[id][slot.id]=uid;used.add(uid);}}}
 return {version:1,serial:Math.max(int(r.serial),...items.map(e=>+e.id.slice(1)),0),items,equipped,materials:{scrap:int(r.materials?.scrap),essence:int(r.materials?.essence)},migrated:r.migrated===true};
}
export function generateGear(serial,stage,{slot,set,quality,rune}={}){
 const random=roll(serial*9973+stage*73),q=quality??(random()<.08?3:random()<.3?2:random()<.6?1:0);
 slot=slot||GEAR_SLOTS[Math.floor(random()*GEAR_SLOTS.length)].id;if(slot==='rune')return {id:'g'+serial,slot,set:null,rune:rune||RUNES[Math.floor(random()*RUNES.length)].id,tier:1,quality:1,enhance:0,subs:[],locked:false,rerolls:0};
 const e={id:'g'+serial,slot,rune:null,set:set||GEAR_SETS[Math.floor(random()*6)].id,tier:gearTier(stage),quality:q,enhance:0,subs:[],locked:false,rerolls:0};
 const keys=Object.keys(ATTRS).filter(k=>k!==GEAR_SLOTS.find(x=>x.id===e.slot).main);
 for(let i=0;i<QUALITIES[q].subs;i++){const n=Math.floor(random()*keys.length);e.subs.push({key:keys.splice(n,1)[0],roll:Math.round((.8+random()*.4)*1000)/1000,growth:0});}return e;
}
export function salvageValue(e){return 8*e.tier*(e.quality+1)+Math.floor(e.enhance*(e.enhance+1)/2)*e.tier*4;}
export function addGear(s,stage,options={}){const inv=s.inventory,e=generateGear(++inv.serial,stage,options);if(inv.items.length>=BAG_CAP){const scrap=salvageValue(e);inv.materials.scrap+=scrap;return {item:null,scrap};}inv.items.push(e);return {item:e,scrap:0};}
export function createInventory(ids,legacy={},stage=1,party=ids.slice(0,2)){
 const inv=normalizeInventory(null,ids),s={inventory:inv};const old=['claw','coat','bell','scope','bowl','can','magnet','thermos','thorn','charm','match','badge'].reduce((n,k)=>n+int(legacy?.[k],5),0);
 inv.migrated=old>0;inv.materials.scrap=old*40;inv.materials.essence=Math.floor(old/3);
 for(const id of party)for(const slot of GEAR_SLOTS){if(!old&&['collar','brace'].includes(slot.id))continue;const set={orange:'guard',pudding:'guard',milk:'spring',spark:'ember',mint:'clock',ink:'hunt',bolt:'hunt',star:'clock'}[id]||'hunt';const {item}=addGear(s,old?stage:1,{slot:slot.id,set,quality:old?2:0,...(!old&&slot.id==='rune'?{rune:'focus'}:{})});inv.equipped[id][slot.id]=item.id;}
 return inv;
}
export const gearOwner=(s,uid)=>Object.entries(s.inventory.equipped).find(([,slots])=>Object.values(slots).includes(uid))?.[0]||null;
export function equipGear(s,uid,id,allowed){const e=s.inventory.items.find(e=>e.id===uid);if(!e||!allowed.includes(id))return false;for(const slots of Object.values(s.inventory.equipped))for(const k of Object.keys(slots))if(slots[k]===uid)delete slots[k];(s.inventory.equipped[id]??={})[e.slot]=uid;return true;}
export function unequipGear(s,id,slot){const slots=s.inventory.equipped[id];if(!slots?.[slot])return false;delete slots[slot];return true;}
export function gearValues(e){if(e.slot==='rune')return {};const slot=GEAR_SLOTS.find(x=>x.id===e.slot),factor=e.tier*QUALITIES[e.quality].factor;const values={[slot.main]:ATTRS[slot.main].base*factor*(1+.06*e.enhance)};for(const a of e.subs)values[a.key]=(values[a.key]||0)+ATTRS[a.key].base*.35*factor*a.roll*(1+.35*a.growth);return values;}
export function gearBonuses(s,id){const values={atk:0,hp:0,armor:0,magicResist:0,armorPen:0,magicPen:0,speed:0,crit:0},counts={},sets=[];let rune=null;for(const uid of Object.values(s.inventory?.equipped?.[id]||{})){const e=s.inventory.items.find(e=>e.id===uid);if(!e)continue;if(e.slot==='rune'){rune=e.rune;continue;}for(const [k,v]of Object.entries(gearValues(e)))values[k]+=v;counts[e.set]=(counts[e.set]||0)+1;}
 for(const set of GEAR_SETS){const count=counts[set.id]||0;if(count>=2)for(const [k,v]of Object.entries(set.bonus))values[k]+=v;if(count>=4)sets.push(set.id);}return {...values,sets,counts,rune};}
export function enhanceQuote(e){return {gold:Math.round(120*e.tier*(e.enhance+1)**1.6),scrap:12*e.tier*(e.enhance+1),maxed:e.slot==='rune'||e.enhance>=GEAR_MAX};}
export function enhanceGear(s,uid){const e=s.inventory.items.find(e=>e.id===uid);if(!e)return false;const q=enhanceQuote(e);if(q.maxed||s.gold<q.gold||s.inventory.materials.scrap<q.scrap)return false;s.gold-=q.gold;s.inventory.materials.scrap-=q.scrap;e.enhance++;if(e.enhance%3===0&&e.subs.length)e.subs[Math.floor(roll(+uid.slice(1)*17+e.enhance)()*e.subs.length)].growth++;return true;}
export function reforgeGear(s,uid,index){const e=s.inventory.items.find(e=>e.id===uid);if(!e||e.slot==='rune'||!Number.isInteger(index)||!e.subs[index]||s.inventory.materials.essence<2)return false;s.inventory.materials.essence-=2;e.rerolls++;const random=roll(+uid.slice(1)*197+e.rerolls*971),keys=Object.keys(ATTRS).filter(k=>k!==GEAR_SLOTS.find(x=>x.id===e.slot).main&&!e.subs.some((a,i)=>i!==index&&a.key===k));e.subs[index]={key:keys[Math.floor(random()*keys.length)],roll:Math.round((.8+random()*.4)*1000)/1000,growth:e.subs[index].growth};return true;}
export function dismantleGear(s,uid){const e=s.inventory.items.find(e=>e.id===uid);if(!e||e.locked||gearOwner(s,uid))return null;const reward={scrap:salvageValue(e),essence:e.quality>=2?e.quality-1:0};s.inventory.materials.scrap+=reward.scrap;s.inventory.materials.essence+=reward.essence;s.inventory.items=s.inventory.items.filter(x=>x!==e);return reward;}
export function gearDrop(s,stage,{guaranteed=false}={}){s.inventory.materials.scrap+=2+Math.floor(stage/50);if(stage%5===0||guaranteed){s.inventory.materials.essence++;return addGear(s,stage);}return null;}
export function materialRows(s){return [{id:'scrap',name:'修补零件',count:s.inventory.materials.scrap,use:'强化、拼装装备',source:'战斗、分解装备',icon:0},{id:'essence',name:'打磨砂',count:s.inventory.materials.essence,use:'洗炼副属性、拼装装备',source:'首领战、分解稀有装备',icon:11},{id:'supplies',name:'经营物资',count:s.supplies,use:'鱼摊四项经营升级',source:'普通关、委托奖励',icon:14},{id:'notes',name:'训练笔记',count:s.growth?.notes||0,use:'伙伴突破、升星',source:'后巷清扫、伙伴委托、深夜追猎',icon:15},{id:'seals',name:'历练印记',count:s.growth?.seals||0,use:'第二、三次伙伴突破',source:'夜班护送第 3 档起、深夜追猎、街区硬仗',icon:11},{id:'badges',name:'突破徽章',count:s.badges,use:'伙伴突破',source:'擂台、每周挑战、委托',icon:9}];}
export function craftQuote(s){const tier=gearTier(Math.max(1,s.highest));return {tier,scrap:120*tier,essence:6,gold:1000*tier};}
export function craftGear(s,set,slot){if(!GEAR_SETS.some(x=>x.id===set)||!GEAR_SLOTS.some(x=>x.id===slot&&x.id!=='rune')||s.inventory.items.length>=BAG_CAP)return null;const q=craftQuote(s),m=s.inventory.materials;if(m.scrap<q.scrap||m.essence<q.essence||s.gold<q.gold)return null;m.scrap-=q.scrap;m.essence-=q.essence;s.gold-=q.gold;return addGear(s,Math.max(1,s.highest),{set,slot,quality:2}).item;}
