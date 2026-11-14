import fs from 'node:fs';
import {developed,teamsOf,simulate} from './balance-street.mjs';
import {HARD_JOBS} from '../activities.mjs';
const s=developed(),teams=teamsOf(s.roster.owned),seeds=[527,941,2027],rows=[];
for(const job of HARD_JOBS){const outcomes=teams.map(party=>{s.party=party;return {party,runs:seeds.map(seed=>simulate(s,{kind:'hard',id:job.id,tier:3},{seed}))};});const wins=outcomes.reduce((sum,t)=>sum+t.runs.filter(r=>r.result==='win').length,0);rows.push({id:job.id,wins,total:teams.length*seeds.length,reliableTeams:outcomes.filter(t=>t.runs.every(r=>r.result==='win')).map(t=>t.party),outcomes});console.log(job.id,wins+'/'+teams.length*seeds.length);}
fs.writeFileSync('docs/review/release-v02649/balance.json',JSON.stringify({assumptions:'满培养、固定角色配装及位置、56支五人队、3种随机种子；模拟胜率不是玩家实测胜率。',seeds,rows},null,2));
