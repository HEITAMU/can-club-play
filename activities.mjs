import {repeatQuota,consumeRepeat} from './economy-limits.mjs';
import {COMPANION_IDS} from './companions.mjs?v=0.25.0';
import {gearDrop,addGear} from './equipment.mjs?v=0.25.0';
const safe=(n,max=10000)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
export const MATERIAL_JOBS=[
 {id:'sweep',name:'后巷清扫',rule:'杂物怪成群出现，稳住前排并准备群体伤害。',reward:'训练笔记',theme:'crowd'},
 {id:'escort',name:'夜班护送',rule:'追兵蓄力重击，保留开罐啦或控制技能打断。',reward:'护送勋章',theme:'burst'},
 {id:'salvage',name:'废件仓库',rule:'前排铁壳高护甲，后排电池高魔抗，混合伤害或破甲更有效。',reward:'装备',theme:'armor'},
 {id:'parts',name:'旧件回收场',rule:'拆卸队占着废料堆，准备群体伤害。',reward:'零件',theme:'crowd'},
 {id:'polish',name:'磨砂作坊',rule:'铁壳守卫堵住作坊，混合伤害或破甲更有效。',reward:'打磨砂',theme:'armor'}
];
export const HUNTS=[
 {id:'market',name:'鱼市追猎',rule:'冷库护盾、后排补给、快速追兵轮换。',themes:['barrier','healer','ambush']},
 {id:'depot',name:'仓库追猎',rule:'铁壳、同频防御、蓄力夹击轮换。',themes:['armor','adaptive','burst']},
 {id:'station',name:'车站追猎',rule:'后排突袭、同频防御、补给阵轮换。',themes:['ambush','adaptive','healer']}
];
export const HARD_JOBS=[
 {id:'coldstore',name:'冷库封锁',theme:'barrier',rule:'冷库每 3 回合补充护盾；被灼烧时停止补盾。持续火力与灼烧配合更有效，也可用炉边套补充灼烧。'},
 {id:'lifeline',name:'补给线争夺',theme:'healer',rule:'生命最多的后排补给员每 2 回合治疗前排。控制治疗者、减疗与集中伤害要配合。'},
 {id:'ironwall',name:'铁壳拦路',theme:'armor',rule:'前排高护甲、后排高魔抗。破甲或混合输出能够拆开防线。'},
 {id:'alarm',name:'同频警报',theme:'adaptive',rule:'前排连续受到同类直接伤害，逐步获得该类型减伤，最高 60%。切换伤害类型会重置。'},
 {id:'blackout',name:'断电追兵',theme:'ambush',rule:'两名追兵绕过前排，攻击生命比例最低的后排；每第 3 次攻击削减 12 能量，护盾完全挡下可避免掉能量。'},
 {id:'clockwork',name:'钟楼围困',theme:'burst',rule:'两名首领错开蓄力。仅靠开罐啦难以全部打断，需要控制、续航或迅速击倒一人。'}
];
// Flavor hints follow the actual encounter theme, including rotating hunts.
export const ENCOUNTER_STORIES={
 "crowd": "后巷的垃圾已经有三天没有人收了。白天还只是几个纸箱子，到了晚上，破拖把、空电池和不知道从哪里来的袋子全挤在一起。\n\n昨天有人想从中间过去，才踢开一个箱子，旁边几个就一齐扑了上来，连手里的扫帚都没拿回来。",
 "barrier": "冷库门口贴着一张纸，上面写着“严禁明火”。\n\n送货的说，去年有人提着一盏煤油灯进去找鱼，不小心把灯碰倒了，半屋子的货都没保住。老板扑完火，在门口坐了一晚上，谁跟他说话都不理。\n\n后来连送货的想借个火，都得走到街对面去。",
 "healer": "昨晚在路口打了半天，前面的几个明明已经站不稳了，过一会儿又爬起来，跟没事一样。\n\n收摊的老头说，他倒是看见了，有一个家伙一直躲在后面，隔一阵就把吃的递过去。别人身上多少都带了点伤，只有他，连衣服都是干净的。",
 "armor": "修理铺的师傅接过一单生意，给两个看仓库的做铁壳。做完以后，那两个家伙还专门找人试过，拿爪子挠，拿木棍敲，都只当是挠痒痒。\n\n后来他们又回来找师傅，说壳子没有坏，可是挨了一下法术，里面还是疼。师傅说这个不归他管。\n\n倒是仓库里的旧电池不怕这些，谁在门口放法术，它们就往前凑；一看有人伸爪子，又都缩回去了。",
 "adaptive": "有人在这里栽过两次。头一回打得还算顺手，就想着第二天照着来，没想到越打越费劲。\n\n他不服气，回去找了几个帮手，把昨天用过的招数又试了一遍。守门的还是没怎么动，直到后面一个临时换了招，才把他逼得往旁边让了一步。",
 "ambush": "送货队里有一个瘸了腿的，平时走得慢，总是落在后面。前几趟出去没有事，上回却被两个追兵盯上了，谁回头帮忙，他们就往旁边躲，人一走又跟上来。\n\n队长把自己的护盾给了他。那两个追兵扑了几次没占到便宜，跟到路口，也就不再追了。",
 "burst": "领头的家伙有个毛病，动手之前非得站在那里憋上一口气。跟他一起的早就习惯了，看见他停下来，就赶紧往旁边让。\n\n前几天他又摆好了架势，没等出手，就被一个路过的砸中了脑袋。那一口气没提上来，蹲在地上咳了好一会儿。"
};
const RECRUIT_STORIES={
 "orange": "橘座说后巷那条路他熟，闭着眼睛都能走。可是昨天带回来的一袋罐头少了一半，他也没解释，只说今天还得再去一趟。\n\n出门前他换了一个结实点的袋子，锅盖倒还是原来那个。",
 "ink": "阿墨在屋顶蹲了一下午，盯着下面那几个搬东西的。有人问他等什么，他指了指最后一个，说那家伙走路已经一瘸一拐了。\n\n等其他几个拐过弯，他才从屋顶下来。",
 "milk": "奶盖托人找一只丢在巷口的药箱。箱子不大，里面除了绷带，还有一瓶没开封的牛奶。\n\n她说药箱找不回来也不要紧，先把困在那里的几个带回来，晚饭还在锅里热着。",
 "spark": "火花去仓库拿灯油，去了半天也没回来。看门的说里面乱得很，几个旧箱子堵着门，怎么赶都不肯散。\n\n有人在门外看见了一点火光，还听见火花在里面喊，叫他们先别进来。",
 "mint": "薄荷嫌门外太吵，已经出去说过两回了。那几个家伙嘴上答应，等她一转身，又开始敲门边的铁桶。\n\n这回她连话也没说，拿上东西就出了门。",
 "bolt": "扳手把一个生了锈的零件放在柜台上，问是谁从仓库里搬出来的。他说那边还有一整套，少了哪个都装不回去。\n\n老板提醒他，里面守门的披着铁壳。扳手听完，又往工具袋里添了两把小扳手。",
 "pudding": "石墩每天都到后巷练拳。刚开始还有人围着看，后来墙上的灰掉得太厉害，大家就搬了凳子，坐到远一点的地方。\n\n今天他没练成，几个杂物怪占了那块空地，连他放水杯的台阶都挤满了。",
 "star": "星斑昨晚在车站附近弄丢了一个小本子。里面大半都是画得歪歪扭扭的星星，还有几笔赊账。\n\n她说本子倒不值钱，只是有几页还没看完，想请人陪她回去找找。"
};
const CLOCKWORK_STORY="钟楼上住着两个家伙，附近的人总说他们不和，隔着一条街都能听见争吵。\n\n上回有人趁他们吵架闯了进去，才发现不是那么回事。一个刚刚停手，另一个就已经准备好了，根本不给人喘气的工夫。\n\n逃回来的人说，早知道就不该同时招惹他们两个。";
const ESCORT_STORY="车夫说，这条路上的追兵已经跟了他好几天。领头的每次都要先停一下，攒足了劲，才朝着车厢撞过来。\n\n昨天车上掉下一只空罐头，正好砸在他脑门上。他那一下没撞出来，车夫趁机赶着车跑了，直到过了桥才敢回头。";
const KEYS=[...MATERIAL_JOBS.map(x=>x.id),...HUNTS.map(x=>'hunt:'+x.id),...HARD_JOBS.map(x=>'hard:'+x.id),...COMPANION_IDS.map(x=>'recruit:'+x)];
export function normalizeActivities(raw){return {rewardVersion:1,rewardDay:safe(raw?.rewardDay,1e9),repeatClaims:Object.fromEntries(Object.entries(raw?.repeatClaims||{}).filter(([k])=>['sweep','escort','salvage','parts','polish','hunt','hard',...COMPANION_IDS.map(id=>'recruit:'+id)].includes(k)).map(([k,v])=>[k,safe(v,100)])),cleared:Object.fromEntries(KEYS.map(k=>[k,safe(raw?.cleared?.[k],k.startsWith('hunt:')?10000:k.startsWith('hard:')?3:k.startsWith('recruit:')?6:8)])),wins:safe(raw?.wins,1e9)};}
export function activityInfo(s,request={},now=Date.now()){
 const kind=request.kind||'sweep',tier=request.tier===undefined?1:request.tier,id=request.id||'',recruit=kind==='recruit',hunt=kind==='hunt',hard=kind==='hard',job=recruit?{name:'伙伴委托',rule:'完成指定伙伴的委托，获得该伙伴信物。凑齐 20 份即可结识，之后可用于徽章晋升。',theme:'crowd'}:hunt?HUNTS.find(x=>x.id===id):hard?HARD_JOBS.find(x=>x.id===id):MATERIAL_JOBS.find(x=>x.id===kind);
 const key=recruit?'recruit:'+id:hunt?'hunt:'+id:hard?'hard:'+id:kind,cleared=s.activities?.cleared?.[key]||0,max=hunt?Math.min(10000,cleared+1):hard?3:recruit?6:8;
 const required=hard?[120,240,400][tier-1]:hunt?30:recruit?[3,10,30,60,120,220][tier-1]:[3,10,30,60,100,160,240,360][tier-1];
 const valid=Number.isInteger(tier)&&!!job&&(!recruit||COMPANION_IDS.includes(id))&&tier>=1&&tier<=max;
 const exhausted=recruit&&tier<=cleared&&tier<6;const open=valid&&s.highest>=required&&tier<=cleared+1&&!exhausted;
 const level=hard?[70,115,160][tier-1]:hunt?Math.min(160,35+tier*5):recruit?[5,20,40,70,100,130][tier-1]:[8,25,40,60,85,110,135,160][tier-1];
 const theme=hunt?job.themes[(tier-1)%3]:job?.theme;
 const quota=repeatQuota(s.activities,kind,id,now),rewardable=tier>cleared||quota.remaining>0;
 return {valid,open,exhausted,quota,rewardable,request:{kind,id,tier},kind,id,tier,key,cleared,max,required,level,theme,story:recruit?RECRUIT_STORIES[id]||ENCOUNTER_STORIES.crowd:hard&&theme==='burst'?CLOCKWORK_STORY:kind==='escort'?ESCORT_STORY:ENCOUNTER_STORIES[theme]||ENCOUNTER_STORIES.crowd,name:job?.name||'未知委托',rule:(hunt?([...HARD_JOBS].find(x=>x.theme===theme)?.rule):job?.rule)||'',first:tier>cleared,scene:hard?({coldstore:1,lifeline:3,ironwall:3,alarm:2,blackout:5,clockwork:4}[id]):hunt?({market:1,depot:3,station:5}[id]):kind==='salvage'?3:0};
}
export function activityReward(info){const n=info.tier,first=info.first,mult=first?2:1,r={gold:0,supplies:0,badges:0,notes:0,seals:0,shards:0,essence:0,scrap:0};
 if(info.rewardable===false)return r;
 if(info.kind==='recruit'){if(!first&&n<6)return r;r.shards=first?[20,12,16,20,24,30][n-1]:6;}
 else if(info.kind==='sweep'){r.notes=(8+n*6)*mult;}
 else if(info.kind==='escort'){r.badges=(2+Math.ceil(n/2))*mult;}
 else if(info.kind==='parts'){r.scrap=24*n+12*Math.max(0,n-4)**2;}
 else if(info.kind==='polish'){r.essence=(1+Math.floor(n/3))*mult;}
 else if(info.kind==='hunt'){r.gold=150+Math.min(n,100)*30;}
 else if(info.kind==='hard'){r.seals=n*2*mult;}
 return r;
}
export function settleActivity(s,info,now=Date.now()){const current=activityInfo(s,info.request,now);if(!current.open)return null;const r=activityReward(current);s.activities.cleared[info.key]=Math.max(s.activities.cleared[info.key]||0,info.tier);s.activities.wins++;if(current.rewardable&&!current.first)consumeRepeat(s.activities,current.quota);s.gold+=r.gold;s.badges+=r.badges;s.growth.notes+=r.notes;s.growth.seals+=r.seals;s.inventory.materials.scrap+=r.scrap;s.inventory.materials.essence+=r.essence;if(r.shards)s.roster.shards[info.id]+=r.shards;
 let gearLoot=null;if(current.rewardable&&(info.kind==='salvage'||info.kind==='hard'&&current.first||info.kind==='hunt')){const stage=info.kind==='hard'?600:info.kind==='salvage'?Math.min(600,info.tier*75):Math.min(600,info.tier*25);gearLoot=info.kind==='salvage'&&info.tier===1&&current.first?addGear(s,3,{slot:'claw',set:'guard',quality:1}):info.kind==='hard'&&current.first?addGear(s,stage,{quality:3,slot:['claw','coat','collar','brace'][(info.tier-1)%4]}):gearDrop(s,stage,{guaranteed:true,maxQuality:info.kind==='salvage'?(info.tier<3?1:info.tier<5?2:3):3});}
 if(info.kind==='salvage'&&info.tier===1&&current.first&&gearLoot?.item)gearLoot.item.enhance=1;
 return {...r,first:current.first,gearLoot,rewardCapped:!current.rewardable};
}
export function rewardText(r){return [['信物',r.shards],['训练笔记',r.notes],['护送勋章',r.badges],['历练印记',r.seals],['打磨砂',r.essence],['零件',r.scrap]].filter(x=>x[1]).map(([k,v])=>k+' +'+v).join(' · ')+(r.gearLoot?.item?' · 装备已入包':r.gearLoot?.scrap?' · 满包掉落已折算零件':'');}

export function activityLockReason(s,info){
 if(!info.valid)return '该委托暂未开放';
 if(info.exhausted)return '该难度已完成';
 const conditions=[];
 if(s.highest<info.required)conditions.push('通关第 '+info.required+' 关');
 if(info.tier>info.cleared+1)conditions.push('完成难度 '+(info.tier-1));
 return conditions.length?conditions.join('，并')+'后解锁':'';
}
