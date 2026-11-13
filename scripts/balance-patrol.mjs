import fs from 'node:fs';
import * as G from '../core.mjs';
import {developed} from './balance-street.mjs';
export const PATROL_CASES=[
 {name:'普通搭配，130 级',level:130,party:['orange','bolt','ink','milk','mint']},
 {name:'相同搭配，160 级',level:160,party:['orange','bolt','ink','milk','mint']},
 {name:'护盾反击、破甲与灼烧，130 级',level:130,party:['orange','pudding','bolt','ink','spark']}
];
export function patrolCase(example,seed=527){const s=developed();s.party=example.party;for(const id of s.roster.owned)s.levels[id]=example.level;const b=new G.Battle(s,{stage:600,seed});while(!b.result){b.tick(.1);if(b.canCd===0)b.openCan();}return {seed,result:b.result,time:+b.time.toFixed(1),power:G.power(s),survivors:b.alive('p').length};}
if(process.argv[1]?.endsWith('balance-patrol.mjs')){
 const seeds=[527,941,2027,4093,8191];
 const result={assumptions:'Main campaign stage 600. Identical tier6 epic +12 per-character gear, star5, breakthrough3; only team and levels differ. Rescue on cooldown. Fixed seeds; not observed player success rate.',curve:[3,20,60,120,300,600].map(stage=>({stage,...G.patrolPressure(stage)})),cases:PATROL_CASES.map(example=>({...example,runs:seeds.map(seed=>patrolCase(example,seed))}))};
 fs.mkdirSync('docs/review/street-growth',{recursive:true});fs.writeFileSync('docs/review/street-growth/patrol-balance.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
}
