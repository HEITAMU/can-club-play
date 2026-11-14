import fs from 'node:fs';
import * as G from '../core.mjs';
import * as E from '../equipment.mjs';
import {developed,simulate,teamsOf} from './balance-street.mjs';
import {PATROL_CASES,patrolCase} from './balance-patrol.mjs';
import {HARD_JOBS,activityReward} from '../activities.mjs';
const s=developed(),seeds=[527,941,2027,4093,8191],teams=teamsOf(s.roster.owned),hard=[];
for(const job of HARD_JOBS){const rows=teams.map(party=>{s.party=party;return {party,runs:seeds.map(seed=>simulate(s,{kind:'hard',id:job.id,tier:3},{seed}))};});hard.push({id:job.id,wins:rows.reduce((n,r)=>n+r.runs.filter(x=>x.result==='win').length,0),total:rows.length*seeds.length,reliableTeams:rows.filter(r=>r.runs.every(x=>x.result==='win')).map(r=>r.party),rows});console.log(job.id,hard.at(-1).wins+'/'+hard.at(-1).total);}
s.party=['orange','pudding','bolt','ink','spark'];const b=new G.Battle(s,{stage:600,seed:527}),hits=[];
while(!b.result){for(const e of b.tick(.1))if(e.type==='hit'&&!e.rescue&&e.from?.startsWith('p')&&e.value>=1e6){const hero=b.heroes.find(h=>h.id===e.from);hits.push({name:hero.name,damage:e.value,seconds:Math.round(b.time),cause:e.cause});}if(b.canCd===0)b.openCan();}
const cost={gold:0,scrap:0};for(let enhance=0;enhance<E.GEAR_MAX;enhance++){const q=E.enhanceQuote({slot:'claw',tier:6,enhance});cost.gold+=q.gold;cost.scrap+=q.scrap;}
const result={version:'0.26.66',assumptions:'Lv160 / 5 stars / skill rank3 / tier6 epic +15 / deterministic role-based sets, fixed rolls and formation / 56 teams × 5 seeds. Rescue reactive in hard jobs, on cooldown in main campaign. These are simulation outcomes, not player win rates.',seeds,stats:G.CATS.map(c=>({name:c.name,...G.catStats(s,c.id)})),enhancement:E.GEAR_SLOTS.slice(0,4).map(slot=>({slot:slot.name,cost})),salvage:{tier8PerRun:activityReward({kind:'salvage',tier:8,first:false}).scrap,runsPerDay:4},patrol:PATROL_CASES.map(example=>({example,runs:seeds.map(seed=>patrolCase(example,seed))})),millionHits:{first:hits[0],maximum:hits.toSorted((a,b)=>b.damage-a.damage)[0],examples:hits.slice(0,10)},hard};
fs.mkdirSync('docs/review/release-v02666',{recursive:true});fs.writeFileSync('docs/review/release-v02666/balance.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({millionHits:result.millionHits,cost,patrol:result.patrol.map(c=>({name:c.example.name,runs:c.runs.map(r=>r.result)}))}));
