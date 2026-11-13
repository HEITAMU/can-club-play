import * as E from '../equipment.mjs';
import {activityInfo} from '../activities.mjs';
import fs from 'node:fs';
import * as G from '../core.mjs';
import {DAILY_TASKS,JOURNEY,claimDaily,claimDailyChest,claimJourney,weeklyInfo} from '../campaign.mjs';
const formation=process.env.MONTH_FORMATION==='control'?['orange','ink','milk','mint','bolt']:['orange','pudding','milk','spark','star'];
const start=Date.UTC(2026,10,16,1),s=G.initialState(start),rows=[];
let clock=start,battles=0,losses=0;
function rewards(){G.claimQuests(s);for(const j of JOURNEY)claimJourney(s,j.id);for(const d of DAILY_TASKS)claimDaily(s,d.id,clock);claimDailyChest(s,clock);}
function outfit(){
 const target={orange:'guard',pudding:'guard',milk:'spring',spark:'ember',star:'clock',mint:'clock',ink:'hunt',bolt:'hunt'};
 const score=(e,set)=>e.slot==='rune'?1:e.tier*E.QUALITIES[e.quality].factor*(1+.06*e.enhance)*(e.set===set?1.4:1);
 for(const id of s.party)for(const slot of E.GEAR_SLOTS){const available=s.inventory.items.filter(e=>e.slot===slot.id&&(!E.gearOwner(s,e.id)||E.gearOwner(s,e.id)===id||!s.party.includes(E.gearOwner(s,e.id)))).sort((a,b)=>score(b,target[id])-score(a,target[id]));if(available[0])E.equipGear(s,available[0].id,id,s.party);}
 // Recycle only clearly obsolete unprotected items; keep current-tier set options.
 for(const e of [...s.inventory.items])if(!E.gearOwner(s,e.id)&&!e.locked&&e.tier<E.gearTier(s.highest)-1)E.dismantleGear(s,e.id);
 for(const id of s.party)for(const slot of E.GEAR_SLOTS.slice(0,4)){let e=s.inventory.items.find(x=>x.id===s.inventory.equipped[id]?.[slot.id]);if(!e||e.tier<E.gearTier(s.highest)||e.set!==target[id]){const made=E.craftGear(s,target[id],slot.id);if(made){E.equipGear(s,made.id,id,s.party);e=made;}}if(e&&e.enhance<6&&s.gold>10000)E.enhanceGear(s,e.id);}
}
function train(){
 for(const id of s.party)while(G.breakthrough(s,id)){}
 for(let i=0;i<2000;i++){const ids=s.party.filter(id=>s.levels[id]<G.levelCap(s,id)&&G.upgradeCost(s.levels[id])<=s.gold).sort((a,b)=>s.levels[a]-s.levels[b]);if(!ids.length)break;G.upgrade(s,ids[0],1,clock);}
 for(let i=0;i<80;i++){const q=G.STALL_UPGRADES.map(x=>({id:x.id,...G.stallQuote(s,x.id)})).filter(x=>!x.maxed&&x.cost<=s.supplies).sort((a,b)=>a.level-b.level);if(!q.length)break;G.upgradeStall(s,q[0].id,clock);}
 const desired=formation.filter(id=>G.ownsCompanion(s,id));for(const id of s.party)if(!desired.includes(id)&&desired.length<5)desired.push(id);for(const [i,id]of desired.entries())G.setParty(s,i,id);
 for(const id of s.party)while(G.ascendCompanion(s,id)){}
 outfit();
}
function fight(options={}){const b=new G.Battle(s,{...options,now:clock});while(!b.result&&b.time<120){b.tick(.1);if(b.canCd===0&&b.time>.3)b.openCan();}if(!b.result)b.result='lose';clock+=Math.ceil(b.time*1000);const r=G.settleBattle(s,b,clock);battles++;if(!r?.win)losses++;
 rewards();return {win:!!r?.win,time:b.time};}
function progressionJob(){
 if(s.highest<3)return null;
 const missing=formation.find(id=>!G.ownsCompanion(s,id));if(missing){if(G.recruitCompanion(s,missing))return progressionJob();return {kind:'recruit',id:missing,tier:1};}
 const need=s.party.map(id=>({id,...G.breakthroughQuote(s,id)})).find(q=>!q.maxed&&s.levels[q.id]>=q.requiredLevel);
 if(!need)return null;
 const kind=s.growth.notes<need.notes?'sweep':s.badges<need.cost||s.growth.seals<need.seals?'escort':null;if(!kind)return null;
 let tier=Math.min(8,(s.activities.cleared[kind]||0)+1);while(tier>1&&!activityInfo(s,{kind,tier}).open)tier--;return {kind,tier};
}
for(let day=1;day<=30;day++){
 const before=s.highest,beforeBattles=battles,beforeLoss=losses;
 for(let session=0;session<2;session++){
  clock=start+(day-1)*86400000+session*12*3600000;G.claimIdle(s,clock);rewards();train();let budget=600;
  if(s.highest>=15){
   for(let n=0;n<3&&s.arenaCleared<12&&budget>0;n++){const r=fight({arenaTier:s.arenaCleared+1});budget-=r.time;if(!r.win)break;train();}
   if(s.arenaCleared>0&&budget>0){const r=fight({arenaTier:s.arenaCleared});budget-=r.time;train();}
   for(const tier of [1,2,3])if(!weeklyInfo(s,tier,clock).claimed&&budget>0){const r=fight({weeklyTier:tier});budget-=r.time;if(!r.win)break;train();}
  }
  let failures=0;
  while(budget>0&&s.highest<600){train();const request=progressionJob();if(request){let task=fight({activity:request});budget-=task.time;if(!task.win&&request.tier>1&&budget>0){task=fight({activity:{...request,tier:request.tier-1}});budget-=task.time;}if(task.win){train();continue;}}const r=fight();budget-=r.time;if(r.win){failures=0;continue;}if(++failures>=3)break;for(let j=0;j<3&&budget>0;j++){const farm=fight({farm:true,stage:Math.max(1,s.highest-(s.highest%5===0?1:0))});budget-=farm.time;if(!farm.win)break;}}
  rewards();train();
 }
 rows.push({day,stage:s.highest,newStages:s.highest-before,levels:s.party.map(id=>s.levels[id]).join('/'),owned:s.roster.owned.length,stars:s.party.map(id=>s.roster.stars[id]).join('/'),arena:s.arenaCleared,journey:s.campaign.journey.length,stall:s.stall.stall,storageHours:G.idleMinutes(s)/60,gold:s.gold,battles:battles-beforeBattles,losses:losses-beforeLoss});
}
const result={formation,assumptions:['每日两次，每次最多10分钟实际战斗时间','相隔12小时收鱼摊，不看广告','实际刷指定信物招募目标阵容；按突破缺口刷笔记、徽章与印记；自动升级、换装、强化与拼装，及时开罐','模拟无手动操作耗时；不代表真实留存或真机表现'],rows,final:{stage:s.highest,roster:s.roster,growth:s.growth,levels:s.levels,breakthroughs:s.breakthroughs,equipment:s.inventory.items.length,equipped:s.inventory.equipped,materials:s.inventory.materials,stall:s.stall},battles,losses};
fs.mkdirSync('docs/review/street-growth',{recursive:true});fs.writeFileSync('docs/review/street-growth/'+(process.env.MONTH_FORMATION==='control'?'simulation-control':'simulation')+'.json',JSON.stringify(result,null,2));console.table(rows);console.log(JSON.stringify(result.final));
