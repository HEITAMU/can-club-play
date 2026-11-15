import fs from 'node:fs';
import * as G from '../core.mjs';
import * as E from '../equipment.mjs';
import {trainingCount} from '../growth-curve.mjs';
export const seeds=[527,941,2027,4093,8191];
export function fight(s,stage,seed=527){const b=new G.Battle(s,{stage,seed:seed+stage*173});while(!b.result)b.tick(.1);return b;}
export function frontier(s,{start=1,end=G.MAX_STAGE,seed=527}={}){for(let stage=start;stage<=end;stage++)if(fight(s,stage,seed).result!=='win')return stage;return end+1;}
export function earlyPair(level){const s=G.initialState();s.levels.orange=s.levels.ink=level;return s;}
export function equippedTeam(enhance=0){const s=G.initialState();s.roster.owned=['orange','ink','milk','spark','bolt'];s.party=[...s.roster.owned];s.inventory=E.normalizeInventory(null,s.party);s.gold=s.inventory.materials.scrap=1e9;for(const id of s.party){s.levels[id]=40;for(const slot of E.GEAR_SLOTS.slice(0,4)){const e=E.addGear(s,250,{slot:slot.id,set:{orange:'guard',ink:'hunt',milk:'spring',spark:'ember',bolt:'hunt'}[id],quality:2}).item;E.equipGear(s,e.id,id,s.party);for(let n=0;n<enhance;n++)E.enhanceGear(s,e.id);}}return s;}
export function earningRun(){let now=Date.UTC(2026,10,15),idleWait=0;const s=G.initialState(now);G.upgrade(s,'orange',1,now);const jumps=[];let checkpoint=1,lastWall=0;
 while(s.stage<=G.MAX_STAGE){const b=fight(s,s.stage);now+=Math.round((b.time+1.2)*1000);G.settleBattle(s,b,now);G.claimQuests(s);G.claimIdle(s,now);if(b.result==='win')continue;
  if(jumps.length){jumps.at(-1).nextWall=s.stage;jumps.at(-1).advance=s.stage-lastWall;}
  const id=s.party.filter(id=>s.levels[id]<40).sort((a,b)=>s.levels[a]-s.levels[b]||(a==='ink'?-1:1))[0];if(!id)break;
  const level=s.levels[id],count=trainingCount(level),q=G.upgradeQuote(level,count,160);let wait=0;
  while(s.gold<q.cost&&wait<86400){now+=60000;wait+=60;G.claimIdle(s,now);}
  if(s.gold<q.cost)throw Error('Training unavailable after a full day');
  idleWait+=wait;const gold=s.gold;G.upgrade(s,id,count,now);jumps.push({atStage:s.stage,id,from:level,to:s.levels[id],cost:q.cost,goldBefore:gold,extraIdleMinutes:wait/60});lastWall=s.stage;checkpoint++;
  if(checkpoint>20)throw Error('Unbounded training loop');
 }
 return {policy:'Two starters, tutorial orange +1, upgrade only after defeat; lowest-level starter to next milestone, ink breaks ties. Actual mainline/quest/idle earnings; no ads, commissions, journey prizes, rescue, or gifted currency.',jumps,finalStage:s.stage,finalLevels:s.party.map(id=>[id,s.levels[id]]),extraIdleMinutes:idleWait/60,elapsedHours:Math.round((now-s.created)/360000)/10,gold:s.gold};
}
if(process.argv[1]?.endsWith('balance-growth.mjs')){
 const early=[];
 for(const level of [9,19,29,39]){const rows=[];for(const seed of seeds){const s=earlyPair(level),before=frontier(s,{seed});s.gold=G.upgradeCost(level);G.upgrade(s,'ink');const after=frontier(s,{start:before,seed});rows.push({seed,before,after,advance:after-before});}early.push({upgrade:`ink ${level} -> ${level+1}`,rows});console.log(JSON.stringify(early.at(-1)));}
 const equipment=[];for(const enhance of [0,3,6,9,12,15]){const s=equippedTeam(enhance);equipment.push({enhance,power:G.power(s),walls:seeds.map(seed=>frontier(s,{start:1400,seed}))});console.log(JSON.stringify(equipment.at(-1)));}
 const cards=[];for(const rune of [null,'focus','followup','steadfast']){const s=earlyPair(9);for(const id of s.party){if(!rune)delete s.inventory.equipped[id].rune;else{const e=E.addGear(s,1,{slot:'rune',rune}).item;E.equipGear(s,e.id,id,s.party);}}cards.push({rune,power:G.power(s),wall:frontier(s)});}
 const economy=earningRun();const report={version:'0.28.0-preview',maxStage:G.MAX_STAGE,assumptions:'Real Battle engine, 0.1s ticks, five fixed seeds offset by stage, no can support. Frontier is first failed consecutive stage, not best isolated win. Single-ink milestone tests keep orange/equipment/formation unchanged. Equipment tests hold level 40 and a fixed five-cat formation; all four ordinary pieces per wearer are enhanced, using real costs/procs. These are repeatable test scenarios, not measured player retention or universal guarantees.',early,equipment,cards,economy};
 fs.mkdirSync('docs/review/growth-v0280',{recursive:true});fs.writeFileSync('docs/review/growth-v0280/balance.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({cards,economy}));
}
