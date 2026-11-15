import {integer,mulDiv} from './integer-math.mjs?v=0.25.1';
export const BAG_CAP=120,GEAR_MAX=15;
// Attack/health are the long-term equipment budget. Defensive ratings and
// critical chance stay on their own bounded curve instead of scaling with damage.
export const GEAR_POWER_TIERS=Object.freeze([1,2,4,8,16,32]);
export const enhancementPower=level=>100+40*level+8*level*level;
export const GEAR_SLOTS=[{id:'claw',name:'爪套',main:'atk',icon:0},{id:'coat',name:'围巾',main:'hp',icon:1},{id:'collar',name:'项圈',main:'armor',icon:8},{id:'brace',name:'挂件',main:'magicResist',icon:9},{id:'rune',name:'妙招牌',main:null,icon:11}];
export const RUNES=[
 {id:'followup',name:'补上一爪',desc:'每 2 次普攻，追加 100% 攻击力伤害；原目标倒下时追击下一名敌人，不触发普攻效果。'},
 {id:'bulwark',name:'垫层软布',desc:'自身获得的护盾提高 35%。不额外触发一次加盾。'},
 {id:'focus',name:'留口气',desc:'开场获得 40 能量；释放主动技能后回复 28 能量，冷却 2 回合。'},
 {id:'warmth',name:'热乎一口',desc:'治疗生命比例低于 50% 的目标时，治疗量提高 35%，并清除其灼烧。'},
 {id:'ember',name:'添把小火',desc:'普攻命中灼烧目标时，引爆剩余灼烧总伤害的 50%；不消耗灼烧，冷却 2 回合。'},
 {id:'steadfast',name:'缩成一团',desc:'挡下首次致命伤，保留 1 点生命并获得最大生命 35% 的护盾；每场一次。'}
];
export const QUALITIES=[{name:'普通',color:'#9dafa6',factor:100,subs:0},{name:'精良',color:'#8ebf9b',factor:120,subs:1},{name:'稀有',color:'#afa2d5',factor:145,subs:2},{name:'珍藏',color:'#e2bb75',factor:175,subs:3}];
export const GEAR_SETS=[
 {id:'hunt',name:'夜巡',two:'攻击 +12%',four:'对生命低于一半的敌人，直接伤害 +30%。',bonus:{atk:12}},
 {id:'guard',name:'守摊',two:'生命 +18%',four:'开场获得自身生命 25% 护盾；自身获得的护盾 +20%。',bonus:{hp:18}},
 {id:'ember',name:'炉边',two:'法术穿透 +12',four:'对灼烧目标伤害 +25%；普攻暴击附加 2 回合灼烧，每回合 30% 攻击。',bonus:{magicPen:12}},
 {id:'spring',name:'暖窝',two:'生命 +12%',four:'治疗量 +25%；每 2 回合回复自身 5% 最大生命。',bonus:{hp:12}},
 {id:'clock',name:'叮当',two:'暴击 +10%',four:'每次普攻额外回复 8 能量。',bonus:{crit:10}},
 {id:'thorn',name:'刺球',two:'护甲 +15',four:'反弹自身受到伤害的 15%，反伤不再触发反伤。',bonus:{armor:15}}
];
export const ATTRS={atk:{name:'攻击',base:450,percent:true},hp:{name:'生命',base:700,percent:true},armor:{name:'护甲',base:700},magicResist:{name:'魔抗',base:700},crit:{name:'暴击',base:250,percent:true},armorPen:{name:'护甲穿透',base:400},magicPen:{name:'法术穿透',base:400}};
const int=(n,max=1e9)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
const list=n=>Array.isArray(n)?n:[];
const roll=seed=>{let n=seed>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};};
const ITEM_NAMES={hunt:['磨爪旧布','半条围巾','掉漆铜扣','鱼骨哨'],guard:['加厚补丁','旧摊篷','铁皮扣','小锅盖'],ember:['焦边布','炉边旧布','红绳结','炉底火石'],spring:['软绒垫','晒暖的毛巾','棉线结','小奶瓶'],clock:['轻脚布','半截彩带','掉漆铃铛','发条纽扣'],thorn:['带钉补丁','毛边毯','刺球结','旧瓶盖']};
export const gearName=e=>e.slot==='rune'?RUNES.find(x=>x.id===e.rune).name:GEAR_SETS.find(x=>x.id===e.set).name+' · '+ITEM_NAMES[e.set][GEAR_SLOTS.findIndex(x=>x.id===e.slot)];
const SET_STORIES={
 hunt:['原先垫在巡夜队门口。阿墨拿它裹了爪子，翻墙时果然少了些动静。','另一半还挂在桥头的铁钩上。橘座试着扯过，没扯下来。','背面划了三道记号，是巡到第三条巷子该掉头的意思。','吹起来像漏气。鱼贩听了两晚，终于出来把哨子堵上了。'],
 guard:['摊主补了三层，还想再补。缝衣针先断了。','下雨漏水，天晴遮光倒不错。裁下来以后，鱼摊只剩半边有顶。','钥匙早丢了。现在开摊，得先用鱼骨往里拨两下。','盖不了锅，正好盖住夜里剩的半条鱼。边沿那圈牙印是后来添的。'],
 ember:['上回端锅没找到隔热布，临时用了它。焦的那边就别往爪心缠了。','在炉边搭了一个冬天，洗过三遍还是有烟味。','原本拴着火钳。火钳不见了，绳结还在。','试了好几回才打着火。火花把顺手的那一面用炭笔圈了起来。'],
 spring:['奶盖刚拍松，橘座就坐下了。到现在还有个窝。','从晾衣绳上收下来时少了一个角，螺丝说大概是风刮的。','线头越剪越多。后来干脆扎成一束，挂在项圈上。','瓶身的刻度已经磨掉，奶盖用指甲重新划了两道。'],
 clock:['裹住爪子就听不见脚步了，可项圈上的铃铛还在响。','从旧礼盒上拆的。长的那截扎行李，短的这截总也扔不掉。','里面塞了纸，走路不响。摘下来一抖，纸又掉了。','螺丝拆完闹钟，桌上多出这一颗。钟照走，就是不再报时。'],
 thorn:['钉尖全朝外。第一次戴反以后，主人每回都要检查两遍。','边上抽出来的线绕了好几圈，洗的时候总和别的围巾缠在一起。','打结时戳了三次爪子。这回系紧了，就没打算再解。','原先拿来盛水，一碰就翻。现在钻了孔，挂起来倒挺合适。']
};
const RUNE_STORIES={followup:'牌背画了两道爪印，第二道描得格外重。',bulwark:'盾牌边沿磨爪子，垫上这块布就好多了。',focus:'练完一套还喘得过气来，才算练熟。',warmth:'奶盖在牌角画了一只汤勺，提醒自己出门带上。',ember:'炉子快熄的时候添一点就够，多了反而呛。',steadfast:'橘座示范了一遍。阿墨照着缩，尾巴怎么也收不进去。'};
export const gearStory=e=>e.slot==='rune'?RUNE_STORIES[e.rune]:SET_STORIES[e.set][GEAR_SLOTS.findIndex(x=>x.id===e.slot)];
export const gearTier=stage=>Math.max(1,Math.min(6,1+Math.floor(Math.max(0,stage-1)/100)));
export const attrText=(key,value)=>ATTRS[key].name+' +'+(ATTRS[key].percent?integer(value)+'%':integer(value));
export function normalizeInventory(raw,ids){
 const r=raw&&typeof raw==='object'?raw:{},items=[],seen=new Set();
 for(const x of list(r.items).slice(0,BAG_CAP)){
  if(!x||!/^g[1-9]\d{0,8}$/.test(x.id)||seen.has(x.id)||!GEAR_SLOTS.some(s=>s.id===x.slot)||(x.slot==='rune'?!RUNES.some(r=>r.id===x.rune):!GEAR_SETS.some(s=>s.id===x.set)))continue;
  seen.add(x.id);const quality=int(x.quality,3),keys=new Set();const reserved=new Set(list(x.subs).filter(a=>a?.key!=='speed').map(a=>a?.key));const migrated=list(x.subs).map(a=>{if(a?.key!=='speed')return a;const key=['crit','armorPen','magicPen','atk','hp','armor','magicResist'].find(k=>!reserved.has(k)&&k!==GEAR_SLOTS.find(s=>s.id===x.slot).main);reserved.add(key);return {...a,key};});const subs=migrated.filter(a=>a&&ATTRS[a.key]&&!keys.has(a.key)&&(keys.add(a.key),true)).slice(0,QUALITIES[quality].subs).map(a=>({key:a.key,roll:Math.max(80,Math.min(120,integer(Number.isFinite(a.roll)?(r.version===2?a.roll:a.roll*100):100))),growth:int(a.growth,Math.floor(GEAR_MAX/3))}));
  let growth=Math.floor(int(x.enhance,GEAR_MAX)/3);for(const a of subs){a.growth=Math.min(a.growth,growth);growth-=a.growth;}
  items.push({id:x.id,slot:x.slot,rune:x.slot==='rune'?x.rune:null,set:x.slot==='rune'?null:x.set,tier:Math.max(1,int(x.tier,6)),quality,enhance:int(x.enhance,GEAR_MAX),subs,locked:x.locked===true,rerolls:int(x.rerolls,1000000)});
 }
 for(const e of items)if(e.slot==='rune'){e.tier=1;e.quality=1;e.enhance=0;e.subs=[];e.rerolls=0;}
 const equipped={},used=new Set();for(const id of ids){equipped[id]={};for(const slot of GEAR_SLOTS){const uid=r.equipped?.[id]?.[slot.id],e=items.find(e=>e.id===uid&&e.slot===slot.id);if(e&&!used.has(uid)){equipped[id][slot.id]=uid;used.add(uid);}}}
 return {version:2,serial:Math.max(int(r.serial),...items.map(e=>+e.id.slice(1)),0),items,equipped,materials:{scrap:int(r.materials?.scrap),essence:int(r.materials?.essence)},migrated:r.migrated===true};
}
export function generateGear(serial,stage,{slot,set,quality,rune,maxQuality=3}={}){
 const random=roll(serial*9973+stage*73),q=Math.min(maxQuality,quality??(random()<.08?3:random()<.3?2:random()<.6?1:0));
 slot=slot||GEAR_SLOTS[Math.floor(random()*GEAR_SLOTS.length)].id;if(slot==='rune')return {id:'g'+serial,slot,set:null,rune:rune||RUNES[Math.floor(random()*RUNES.length)].id,tier:1,quality:1,enhance:0,subs:[],locked:false,rerolls:0};
 const e={id:'g'+serial,slot,rune:null,set:set||GEAR_SETS[Math.floor(random()*6)].id,tier:gearTier(stage),quality:q,enhance:0,subs:[],locked:false,rerolls:0};
 const keys=Object.keys(ATTRS).filter(k=>k!==GEAR_SLOTS.find(x=>x.id===e.slot).main);
 for(let i=0;i<QUALITIES[q].subs;i++){const n=Math.floor(random()*keys.length);e.subs.push({key:keys.splice(n,1)[0],roll:80+Math.round(random()*40),growth:0});}return e;
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
export function gearValues(e){if(e.slot==='rune')return {};const slot=GEAR_SLOTS.find(x=>x.id===e.slot),power=key=>key==='atk'||key==='hp',factor=key=>(power(key)?GEAR_POWER_TIERS[e.tier-1]:e.tier)*QUALITIES[e.quality].factor;
 const values={[slot.main]:mulDiv(ATTRS[slot.main].base*factor(slot.main),power(slot.main)?enhancementPower(e.enhance):100+8*e.enhance,1000000)};
 for(const a of e.subs)values[a.key]=(values[a.key]||0)+Math.max(1,mulDiv(ATTRS[a.key].base*35*factor(a.key)*a.roll,100+35*a.growth,10000000000));return values;
}
export function gearBonuses(s,id){const values={atk:0,hp:0,armor:0,magicResist:0,armorPen:0,magicPen:0,crit:0},counts={},sets=[];let rune=null;for(const uid of Object.values(s.inventory?.equipped?.[id]||{})){const e=s.inventory.items.find(e=>e.id===uid);if(!e)continue;if(e.slot==='rune'){rune=e.rune;continue;}for(const [k,v]of Object.entries(gearValues(e)))values[k]+=v;counts[e.set]=(counts[e.set]||0)+1;}
 for(const set of GEAR_SETS){const count=counts[set.id]||0;if(count>=2)for(const [k,v]of Object.entries(set.bonus))values[k]+=v;if(count>=4)sets.push(set.id);}return {...values,sets,counts,rune};}
export function enhanceQuote(e){return {gold:Math.round(120*e.tier*(e.enhance+1)**1.6),scrap:4*e.tier*(e.enhance+1),maxed:e.slot==='rune'||e.enhance>=GEAR_MAX};}
export function enhanceGear(s,uid){const e=s.inventory.items.find(e=>e.id===uid);if(!e)return false;const q=enhanceQuote(e);if(q.maxed||s.gold<q.gold||s.inventory.materials.scrap<q.scrap)return false;s.gold-=q.gold;s.inventory.materials.scrap-=q.scrap;e.enhance++;if(e.enhance%3===0&&e.subs.length)e.subs[Math.floor(roll(+uid.slice(1)*17+e.enhance)()*e.subs.length)].growth++;return true;}
export function reforgeGear(s,uid,index){const e=s.inventory.items.find(e=>e.id===uid);if(!e||e.slot==='rune'||!Number.isInteger(index)||!e.subs[index]||s.inventory.materials.essence<2)return false;s.inventory.materials.essence-=2;e.rerolls++;const random=roll(+uid.slice(1)*197+e.rerolls*971),keys=Object.keys(ATTRS).filter(k=>k!==GEAR_SLOTS.find(x=>x.id===e.slot).main&&!e.subs.some((a,i)=>i!==index&&a.key===k));e.subs[index]={key:keys[Math.floor(random()*keys.length)],roll:80+Math.round(random()*40),growth:e.subs[index].growth};return true;}
export function dismantleGear(s,uid){const e=s.inventory.items.find(e=>e.id===uid);if(!e||e.locked||gearOwner(s,uid))return null;const reward={scrap:salvageValue(e),essence:e.quality>=2?e.quality-1:0};s.inventory.materials.scrap+=reward.scrap;s.inventory.materials.essence+=reward.essence;s.inventory.items=s.inventory.items.filter(x=>x!==e);return reward;}
export function gearDrop(s,stage,{guaranteed=false,maxQuality=3}={}){if(stage%5===0||guaranteed){return addGear(s,stage,{maxQuality});}return null;}
export function materialRows(s){return [{id:'scrap',name:'修补零件',count:s.inventory.materials.scrap,use:'强化装备',source:'旧件回收场、材料怪、分解装备',icon:0},{id:'essence',name:'打磨砂',count:s.inventory.materials.essence,use:'洗炼副属性',source:'磨砂作坊、分解稀有装备',icon:11},{id:'supplies',name:'经营物资',count:s.supplies,use:'鱼摊四项经营升级',source:'鱼摊经营、材料怪、猫巷手账',icon:14},{id:'notes',name:'训练笔记',count:s.growth?.notes||0,use:'绝活研习、徽章晋升',source:'后巷清扫专属',icon:15},{id:'seals',name:'历练印记',count:s.growth?.seals||0,use:'绝活 Lv.3、Lv.4 研习',source:'街区硬仗专属',icon:11},{id:'badges',name:'护送勋章',count:s.badges,use:'绝活研习',source:'夜班护送专属',icon:9}];}
