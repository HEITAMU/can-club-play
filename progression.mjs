// Permanent neighborhood progression. These resources never reset on a new shift.
export const STALL_MAX=20,ARENA_MAX=12,ARENA_UNLOCK=15;
export const STALL_UPGRADES=[
 {id:'stall',name:'摊位',effect:'每级鱼摊每分钟收入 +15%',icon:'bag'},
 {id:'sign',name:'招财招牌',effect:'每级普通关鱼币收益 +5%',icon:'coin'},
 {id:'icebox',name:'保鲜鱼箱',effect:'每级离线储存时长 +30 分钟',icon:'thermos'},
 {id:'cart',name:'搬运推车',effect:'每级普通关经营物资 +10%',icon:'coat'}
];
const safe=(x,max=1e9)=>typeof x==='number'&&Number.isFinite(x)?Math.min(max,Math.max(0,Math.floor(x))):0;
export function normalizeProgression(raw,ids){return {supplies:safe(raw.supplies),badges:safe(raw.badges),arenaCleared:safe(raw.arenaCleared,ARENA_MAX),stall:Object.fromEntries(STALL_UPGRADES.map(x=>[x.id,safe(raw.stall?.[x.id],STALL_MAX)])),breakthroughs:Object.fromEntries(ids.map(id=>[id,safe(raw.breakthroughs?.[id],3)]))};}
export function stallLevel(s,id){return safe(s.stall?.[id],STALL_MAX);}
export function stallQuote(s,id){const item=STALL_UPGRADES.find(x=>x.id===id),level=stallLevel(s,id);return {level,cost:Math.round(30*(level+1)**1.45),maxed:level>=STALL_MAX,valid:!!item};}
export function idleMinutes(s){return 240+30*stallLevel(s,'icebox');}
export function suppliesFor(s,stage,farm=false){return Math.max(1,Math.floor((5+Math.floor(stage/5))*(farm?.6:1)*(1+.1*stallLevel(s,'cart'))));}
export function levelCap(s,id){return 100+20*safe(s.breakthroughs?.[id],3);}
export function breakthroughQuote(s,id){const rank=safe(s.breakthroughs?.[id],3),requiredLevel=40+40*rank,cost=[8,20,40][rank]||0;const notes=[50,140,300][rank]||0,seals=[0,6,18][rank]||0;return {rank,requiredLevel,cost,notes,seals,canAfford:s.badges>=cost&&(s.growth?.notes||0)>=notes&&(s.growth?.seals||0)>=seals,maxed:rank===3,cap:levelCap(s,id),nextCap:Math.min(160,levelCap(s,id)+20)};}
export function arenaInfo(tier){const n=Math.min(ARENA_MAX,Math.max(1,safe(tier))),type=['iron','recovery','burst'][(n-1)%3];return {tier:n,type,name:{iron:'铁壳阵',recovery:'续航阵',burst:'蓄力阵'}[type],rule:{iron:'前排高护甲、低魔抗。法术伤害或扳手破甲更有效。',recovery:'后排纸袋每 5 秒治疗两名前排。群攻、切后排或控制治疗者。',burst:'前排首领周期蓄力，全队受到重击。留好开罐啦或控制技能打断。'}[type],baseReward:1+Math.floor((n-1)/3),firstBonus:3+n*2};}
export function arenaOpen(s,tier){return Number.isInteger(tier)&&tier>=1&&tier<=ARENA_MAX&&s.highest>=ARENA_UNLOCK&&tier<=(s.arenaCleared||0)+1;}
