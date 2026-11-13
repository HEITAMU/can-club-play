export const COMPANION_IDS=['orange','ink','milk','spark','mint','bolt','pudding','star'];
export const STARTERS=['orange','ink'],RECRUIT_COST=20,STAR_MAX=5;
const safe=(n,max=1e9)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
export function normalizeRoster(raw,cats,highest=0){const old=!raw||raw.version!==1,owned=old?cats.filter(c=>highest>=c.unlock).map(c=>c.id):(Array.isArray(raw.owned)?raw.owned:[]);return {version:1,owned:[...new Set([...STARTERS,...owned.filter(id=>COMPANION_IDS.includes(id))])],shards:Object.fromEntries(COMPANION_IDS.map(id=>[id,safe(raw?.shards?.[id])])),stars:Object.fromEntries(COMPANION_IDS.map(id=>[id,safe(raw?.stars?.[id],STAR_MAX)]))};}
export function newRoster(){return normalizeRoster({version:1,owned:STARTERS},[]);}
export function owns(s,id){return s.roster?.owned?.includes(id)===true;}
export function recruitQuote(s,id){return {cost:RECRUIT_COST,have:s.roster.shards[id]||0,owned:owns(s,id),valid:COMPANION_IDS.includes(id)};}
export function recruit(s,id){const q=recruitQuote(s,id);if(!q.valid||q.owned||q.have<q.cost)return false;s.roster.shards[id]-=q.cost;s.roster.owned.push(id);if(s.party.length<5)s.party.push(id);return true;}
export function normalizeGrowth(raw){return {notes:safe(raw?.notes),seals:safe(raw?.seals)};}
export const STAR_TALENTS={orange:'提供的护盾量 +5%',ink:'普攻暴击伤害从 180% 提高到 190%',milk:'治疗量 +8%',spark:'施加的灼烧延长 1 秒',mint:'技能眩晕延长 0.25 秒',bolt:'护甲穿透 +8',pudding:'蓄力每秒额外回复 3 能量',star:'主动技能为队友额外回复 4 能量'};
export function starQuote(s,id){const rank=s.roster.stars[id]||0,shards=[20,40,60,90,130][rank]||0,notes=[30,60,100,150,220][rank]||0;return {rank,shards,notes,maxed:rank>=STAR_MAX,owned:owns(s,id),have:s.roster.shards[id]||0,talent:STAR_TALENTS[id]};}
export function ascend(s,id){if(!COMPANION_IDS.includes(id))return false;const q=starQuote(s,id);if(!q.owned||q.maxed||q.have<q.shards||s.growth.notes<q.notes)return false;s.roster.shards[id]-=q.shards;s.growth.notes-=q.notes;s.roster.stars[id]++;return true;}
