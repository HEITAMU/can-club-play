import {COMPANION_IDS} from './companions.mjs?v=0.25.0';
import {gearDrop,addGear} from './equipment.mjs?v=0.25.0';
const safe=(n,max=10000)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
export const MATERIAL_JOBS=[
 {id:'sweep',name:'后巷清扫',rule:'杂物怪成群出现，稳住前排并准备群体伤害。',reward:'训练笔记、修补零件',theme:'crowd'},
 {id:'escort',name:'夜班护送',rule:'追兵蓄力重击，保留开罐啦或控制技能打断。',reward:'突破徽章、历练印记',theme:'burst'},
 {id:'salvage',name:'废件仓库',rule:'前排铁壳高护甲，后排电池高魔抗，混合伤害或破甲更有效。',reward:'装备、打磨砂',theme:'armor'}
];
export const HUNTS=[
 {id:'market',name:'鱼市追猎',rule:'冷库护盾、后排补给、快速追兵轮换。',themes:['barrier','healer','ambush']},
 {id:'depot',name:'仓库追猎',rule:'铁壳、同频防御、蓄力夹击轮换。',themes:['armor','adaptive','burst']},
 {id:'station',name:'车站追猎',rule:'后排突袭、同频防御、补给阵轮换。',themes:['ambush','adaptive','healer']}
];
export const HARD_JOBS=[
 {id:'coldstore',name:'冷库封锁',theme:'barrier',rule:'冷库每 8 秒补充护盾；被灼烧时停止补盾。持续火力与灼烧配合更有效，也可用炉边套补充灼烧。'},
 {id:'lifeline',name:'补给线争夺',theme:'healer',rule:'生命最多的后排补给员每 5 秒治疗前排。控制治疗者、减疗与集中伤害要配合。'},
 {id:'ironwall',name:'铁壳拦路',theme:'armor',rule:'前排高护甲、后排高魔抗。破甲或混合输出能够拆开防线。'},
 {id:'alarm',name:'同频警报',theme:'adaptive',rule:'前排连续受到同类直接伤害，逐步获得该类型减伤，最高 60%。切换伤害类型会重置。'},
 {id:'blackout',name:'断电追兵',theme:'ambush',rule:'两名追兵绕过前排，攻击生命比例最低的后排；每第 3 次攻击削减 12 能量，护盾完全挡下可避免掉能量。'},
 {id:'clockwork',name:'钟楼围困',theme:'burst',rule:'两名首领错开蓄力。仅靠开罐啦难以全部打断，需要控制、续航或迅速击倒一人。'}
];
const KEYS=[...MATERIAL_JOBS.map(x=>x.id),...HUNTS.map(x=>'hunt:'+x.id),...HARD_JOBS.map(x=>'hard:'+x.id),...COMPANION_IDS.map(x=>'recruit:'+x)];
export function normalizeActivities(raw){return {cleared:Object.fromEntries(KEYS.map(k=>[k,safe(raw?.cleared?.[k],k.startsWith('hunt:')?10000:k.startsWith('hard:')?3:k.startsWith('recruit:')?6:8)])),wins:safe(raw?.wins,1e9)};}
export function activityInfo(s,request={}){
 const kind=request.kind||'sweep',tier=request.tier===undefined?1:request.tier,id=request.id||'',recruit=kind==='recruit',hunt=kind==='hunt',hard=kind==='hard',job=recruit?{name:'伙伴委托',rule:'完成指定伙伴的委托，获得该伙伴信物。凑齐 20 份即可结识，之后可用于升星。',theme:'crowd'}:hunt?HUNTS.find(x=>x.id===id):hard?HARD_JOBS.find(x=>x.id===id):MATERIAL_JOBS.find(x=>x.id===kind);
 const key=recruit?'recruit:'+id:hunt?'hunt:'+id:hard?'hard:'+id:kind,cleared=s.activities?.cleared?.[key]||0,max=hunt?Math.min(10000,cleared+1):hard?3:recruit?6:8;
 const required=hard?300:hunt?30:recruit?[3,10,30,60,120,220][tier-1]:[3,10,30,60,100,160,240,360][tier-1];
 const valid=Number.isInteger(tier)&&!!job&&(!recruit||COMPANION_IDS.includes(id))&&tier>=1&&tier<=max;
 const open=valid&&s.highest>=required&&tier<=cleared+1;
 const level=hard?[130,150,160][tier-1]:hunt?Math.min(160,35+tier*5):recruit?[5,20,40,70,100,130][tier-1]:[8,25,40,60,85,110,135,160][tier-1];
 const theme=hunt?job.themes[(tier-1)%3]:job?.theme;
 return {valid,open,request:{kind,id,tier},kind,id,tier,key,cleared,max,required,level,theme,name:job?.name||'未知委托',rule:(hunt?([...HARD_JOBS].find(x=>x.theme===theme)?.rule):job?.rule)||'',first:tier>cleared,scene:hard?({coldstore:1,lifeline:3,ironwall:3,alarm:2,blackout:5,clockwork:4}[id]):hunt?({market:1,depot:3,station:5}[id]):kind==='salvage'?3:0};
}
export function activityReward(info){const n=info.tier,first=info.first,mult=first?2:1,r={gold:0,supplies:0,badges:0,notes:0,seals:0,shards:0,essence:0,scrap:0};
 if(info.kind==='recruit'){r.shards=(2+Math.ceil(n/2))*mult;r.notes=n*2;}
 else if(info.kind==='sweep'){r.notes=(5+n*5)*mult;r.scrap=6+n*4;}
 else if(info.kind==='escort'){r.badges=(1+Math.ceil(n/2))*mult;r.seals=(n>=3?Math.ceil((n-2)/2):0)*mult;r.notes=n*3;}
 else if(info.kind==='salvage'){r.essence=(1+Math.floor(n/3))*mult;r.scrap=n*5;}
 else if(info.kind==='hunt'){const t=Math.min(8,1+Math.floor(n/4));r.notes=(6+t*4)*mult;r.badges=t;r.seals=Math.floor(t/3);r.essence=1;}
 else if(info.kind==='hard'){r.notes=n*20*mult;r.badges=n*4*mult;r.seals=n*2*mult;r.essence=n*2;}
 return r;
}
export function settleActivity(s,info){const current=activityInfo(s,info.request);if(!current.open)return null;const r=activityReward(current);s.activities.cleared[info.key]=Math.max(s.activities.cleared[info.key]||0,info.tier);s.activities.wins++;s.badges+=r.badges;s.growth.notes+=r.notes;s.growth.seals+=r.seals;s.inventory.materials.scrap+=r.scrap;s.inventory.materials.essence+=r.essence;if(r.shards)s.roster.shards[info.id]+=r.shards;
 let gearLoot=null;if(info.kind==='salvage'||info.kind==='hard'||info.kind==='hunt'&&info.tier%3===0){const stage=info.kind==='hard'?600:info.kind==='salvage'?Math.min(600,info.tier*75):Math.min(600,info.tier*25);gearLoot=info.kind==='hard'&&current.first?addGear(s,stage,{quality:3,slot:['claw','coat','collar','brace'][(info.tier-1)%4]}):gearDrop(s,stage,{guaranteed:true});}
 return {...r,first:current.first,gearLoot};
}
export function rewardText(r){return [['信物',r.shards],['训练笔记',r.notes],['突破徽章',r.badges],['历练印记',r.seals],['打磨砂',r.essence],['零件',r.scrap]].filter(x=>x[1]).map(([k,v])=>k+' +'+v).join(' · ')+(r.gearLoot?.item?' · 装备已入包':r.gearLoot?.scrap?' · 满包掉落已折算零件':'');}
