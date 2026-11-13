// Content clock is injectable. Production must provide authenticated server time.
const dayOf=n=>Math.floor((n+8*3600000)/86400000);
const safe=(n,max=1e9)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
export const DAILY_TASKS=[
 {id:'patrol',name:'巡一遍街角',desc:'赢得 5 场普通关或旧关巡逻',goal:5},
 {id:'train',name:'练练身手',desc:'伙伴累计升级 3 级',goal:3},
 {id:'income',name:'鱼摊交班',desc:'领取 1 次非零鱼摊收入',goal:1},
 {id:'arena',name:'上台切磋',desc:'赢得 1 场委托、擂台或每周挑战',goal:1}
];
const stages=[5,15,25,40,60,80,100,120,140,160,180,200,225,250,275,300,325,350,375,400,420,440,460,480,500,520,540,560,580,600];
export const JOURNEY=stages.map((stage,i)=>({id:'j'+(i+1),index:i+1,stage,name:['落脚猫巷','守住鱼摊','巡逻成队','街角相助','第一片屋檐','修修补补','扎稳脚跟','沉稳的拳头','夜色渐深','星光同行','街巷熟客','进阶训练','跨过长街','灯下切磋','新的对手','一街之长','护住伙伴','迎风而上','再进一步','夜巡老手','猫巷守望','百战伙伴','突破极限','灯火不熄','远行准备','同行的默契','街区中坚','长夜将尽','最后的远行','把月光带回家'][i],gold:400+stage*30,supplies:30+i*8,badges:i>=3?2+Math.floor(i/5):0}));
export const WEEK_THEMES=[
 {name:'铁皮搬运队',rule:'敌方前排护甲提高，法术与破甲更有效。',type:'iron'},
 {name:'夜班补给站',rule:'后排每 5 秒治疗前排，控制或集火治疗者。',type:'recovery'},
 {name:'钟声突击队',rule:'首领周期蓄力，保留开罐啦打断。',type:'burst'},
 {name:'疾风巡夜队',rule:'敌方普攻间隔缩短 20%，注意护盾与续航。',type:'haste'}
];
export function normalizeCampaign(raw={}){raw=raw&&typeof raw==='object'?raw:{};const list=v=>Array.isArray(v)?v:[];return {day:safe(raw.day),week:safe(raw.week),progress:Object.fromEntries(DAILY_TASKS.map(t=>[t.id,safe(raw.progress?.[t.id],t.goal)])),claimed:[...new Set(list(raw.claimed))].filter(x=>DAILY_TASKS.some(t=>t.id===x)),chest:raw.chest===true,journey:[...new Set(list(raw.journey))].filter(x=>JOURNEY.some(j=>j.id===x)),weekly:[...new Set(list(raw.weekly))].filter(x=>[1,2,3].includes(x))};}
export function refreshCampaign(s,now=Date.now()){
 const c=s.campaign??=normalizeCampaign(),day=dayOf(now),week=Math.floor((day+3)/7);
 if(day>c.day){c.day=day;c.progress=Object.fromEntries(DAILY_TASKS.map(t=>[t.id,0]));c.claimed=[];c.chest=false;}
 if(week>c.week){c.week=week;c.weekly=[];}return c;
}
export function recordActivity(s,id,n=1,now=Date.now()){const c=refreshCampaign(s,now),t=DAILY_TASKS.find(t=>t.id===id);if(t)c.progress[id]=Math.min(t.goal,c.progress[id]+safe(n));}
export function dailyReward(s){return {gold:120+Math.min(600,s.highest)*8,supplies:20,badges:0};}
function award(s,r){s.gold+=r.gold;s.supplies+=r.supplies;s.badges+=r.badges;return r;}
export function claimDaily(s,id,now=Date.now()){const c=refreshCampaign(s,now),t=DAILY_TASKS.find(t=>t.id===id);if(!t||c.claimed.includes(id)||c.progress[id]<t.goal)return null;c.claimed.push(id);return award(s,dailyReward(s));}
export function claimDailyChest(s,now=Date.now()){const c=refreshCampaign(s,now);if(c.chest||c.claimed.length<3)return null;c.chest=true;return award(s,{gold:400+s.highest*12,supplies:40,badges:2});}
export function claimJourney(s,id){const j=JOURNEY.find(j=>j.id===id),c=s.campaign??=normalizeCampaign();if(!j||s.highest<j.stage||c.journey.includes(id))return null;c.journey.push(id);return award(s,j);}
export function weeklyInfo(s,tier,now=Date.now()){
 const c=refreshCampaign(s,now),theme=WEEK_THEMES[c.week%4],n=safe(tier,3);
 return {...theme,tier:n,week:c.week,open:s.highest>=15&&n>=1,arenaTier:[2,7,12][n-1]||2,
 reward:{gold:1000*n,supplies:100*n,badges:6*n},claimed:c.weekly.includes(n)};
}
export function settleWeekly(s,tier,week,now=Date.now()){const info=weeklyInfo(s,tier,now);if(!info.open||info.week!==week||info.claimed)return {gold:0,supplies:0,badges:0};s.campaign.weekly.push(tier);return award(s,info.reward);}
