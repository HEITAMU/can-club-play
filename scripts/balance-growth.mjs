import fs from 'node:fs';
import * as G from '../core.mjs';
import * as E from '../equipment.mjs';
import {activityInfo} from '../activities.mjs';
export const seeds=[527,941,2027,4093,8191];
export function fight(s,stage,seed=527){const b=new G.Battle(s,{stage,seed:seed+stage*173});while(!b.result)b.tick(.1);return b;}
export function frontier(s,{start=1,end=G.MAX_STAGE,seed=527}={}){for(let stage=start;stage<=end;stage++)if(fight(s,stage,seed).result!=='win')return stage;return end+1;}
export function earlyPair(level){const s=G.initialState();s.levels.orange=s.levels.ink=level;return s;}
export function equippedTeam(enhance=0){const s=G.initialState();s.roster.owned=['orange','ink','milk','spark','bolt'];s.party=[...s.roster.owned];s.inventory=E.normalizeInventory(null,s.party);s.gold=s.inventory.materials.scrap=1e9;for(const id of s.party){s.levels[id]=40;s.roster.stars[id]=2;for(const slot of E.GEAR_SLOTS.slice(0,4)){const e=E.addGear(s,250,{slot:slot.id,set:{orange:'guard',ink:'hunt',milk:'spring',spark:'ember',bolt:'hunt'}[id],quality:2}).item;E.equipGear(s,e.id,id,s.party);for(let n=0;n<enhance;n++)E.enhanceGear(s,e.id);}}return s;}
export function earningRun(){
 let now=Date.UTC(2026,10,15),extraWait=0,commissions=0,blocked='';const s=G.initialState(now),jumps=[];G.upgrade(s,'orange',1,now);
 function finish(b){now+=Math.round((b.time+1.2)*1000);G.settleBattle(s,b,now);G.claimQuests(s);G.claimIdle(s,now);return b.result==='win';}
 function collect(kind,id=''){
  const tiers=kind==='recruit'?[Math.min(6,(s.activities.cleared['recruit:'+id]||0)+1)]:[8,7,6,5,4,3,2,1];
  for(const tier of tiers){const request={kind,id,tier},q=activityInfo(s,request,now);if(!q.open||!q.rewardable)continue;
   const b=new G.Battle(s,{activity:request,seed:527+tier*173});while(!b.result)b.tick(.1);commissions++;if(finish(b))return true;
  }return false;
 }
 while(s.stage<=G.MAX_STAGE&&jumps.length<=24){
  const b=fight(s,s.stage);finish(b);if(b.result==='win')continue;
  if(jumps.length&&!jumps.at(-1).nextWall){jumps.at(-1).nextWall=s.stage;jumps.at(-1).advance=s.stage-jumps.at(-1).atStage;}
  // Buy ordinary starter levels from earned coins before the star-focused loop.
  if(s.party.some(id=>s.levels[id]<5)){for(const id of s.party)while(s.levels[id]<5&&s.gold>=G.upgradeCost(s.levels[id]))G.upgrade(s,id,1,now);continue;}
  const id=s.party.filter(id=>s.roster.stars[id]<2).sort((a,b)=>(s.roster.stars[a]*6+s.roster.tagSteps[a])-(s.roster.stars[b]*6+s.roster.tagSteps[b])||(a==='ink'?-1:1))[0];if(!id)break;
  let q=G.starQuote(s,id),tries=0;
  while(q.have<q.shards||s.growth.notes<q.notes){const kind=q.have<q.shards?'recruit':'sweep';if(!collect(kind,kind==='recruit'?id:'')){blocked=kind+' unavailable or not yet beatable';break;}q=G.starQuote(s,id);if(++tries>30)throw Error('unbounded material loop');}
  if(blocked)break;
  const before=G.catStats(s,id),gold=s.gold;G.ascendCompanion(s,id);const after=G.catStats(s,id);
  jumps.push({atStage:s.stage,id,rank:s.roster.stars[id],step:s.roster.tagSteps[id],shards:q.shards,notes:q.notes,attack:[before.atk,after.atk],health:[before.hp,after.hp],goldBefore:gold});
 }
 return {policy:'Two starters; actual mainline, quests, idle and commission rewards. Levels bought normally up to 5, then one star/promotion after each wall, lowest star progress first and ink breaks ties. No gifted currency/materials, ads, rescue or free rank changes. Failed or unavailable material sources stop the run.',jumps,finalStage:s.stage,finalLevels:s.party.map(id=>[id,s.levels[id]]),finalRanks:s.party.map(id=>[id,s.roster.stars[id],s.roster.tagSteps[id]]),commissions,blocked,extraIdleMinutes:extraWait,elapsedHours:Math.round((now-s.created)/360000)/10};
}
if(process.argv[1]?.endsWith('balance-growth.mjs')){
 const early=[];for(const seed of seeds){const s=earlyPair(5);let wall=frontier(s,{seed}),rows=[];for(let i=0;i<12;i++){const id=i%2?'orange':'ink';s.roster.shards[id]=500;s.growth.notes=10000;const before=G.catStats(s,id);G.ascendCompanion(s,id);const next=frontier(s,{start:wall,seed});rows.push({id,rank:s.roster.stars[id],step:s.roster.tagSteps[id],before:wall,after:next,advance:next-wall,attack:[before.atk,G.catStats(s,id).atk]});wall=next;}early.push({seed,rows});console.log(JSON.stringify({seed,firstStarAdvance:rows[0].advance}));}
 const equipment=[];for(const enhance of [0,3,6,9,12,15]){const s=equippedTeam(enhance);equipment.push({enhance,power:G.power(s),walls:seeds.map(seed=>frontier(s,{start:2400,seed}))});console.log(JSON.stringify(equipment.at(-1)));}
 const cards=[];for(const rune of [null,'focus','followup','steadfast']){const s=earlyPair(5);for(const id of s.party){if(!rune)delete s.inventory.equipped[id].rune;else{const e=E.addGear(s,1,{slot:'rune',rune}).item;E.equipGear(s,e.id,id,s.party);}}cards.push({rune,power:G.power(s),wall:frontier(s)});}
 const economy=earningRun(),report={version:'0.28.0-preview.4',growthRevision:2,maxStage:G.MAX_STAGE,assumptions:'Real Battle engine; 0.1 second ticks; fixed seeds; no can support. Early comparison fixtures hold both cats at level 5 and starter gear, assigning materials only to isolate each star change. Separate earningRun verifies access using actual earned materials. Middle-game fixtures use silver rank, level 40, fixed five-cat formation and 3-tier rare sets; enhancement changes all four ordinary slots per wearer, not a single item. Results are scenarios, not universal stage guarantees or measured retention.',early,equipment,cards,economy};
 fs.mkdirSync('docs/review/growth-v0280/feedback',{recursive:true});fs.writeFileSync('docs/review/growth-v0280/feedback/star-balance-preview4.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({cards,economy}));
}
