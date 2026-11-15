export const COMPANION_IDS=['orange','ink','milk','spark','mint','bolt','pudding','star'];
export const STARTERS=['orange','ink'],RECRUIT_COST=20,STAR_MAX=5;
const safe=(n,max=1e9)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
export function normalizeRoster(raw,cats,highest=0){const old=!raw||![1,2].includes(raw.version),owned=old?cats.filter(c=>highest>=c.unlock).map(c=>c.id):(Array.isArray(raw.owned)?raw.owned:[]);return {version:2,owned:[...new Set([...STARTERS,...owned.filter(id=>COMPANION_IDS.includes(id))])],shards:Object.fromEntries(COMPANION_IDS.map(id=>[id,safe(raw?.shards?.[id])])),tagSteps:Object.fromEntries(COMPANION_IDS.map(id=>[id,safe(raw?.tagSteps?.[id],5)])),stars:Object.fromEntries(COMPANION_IDS.map(id=>[id,safe(raw?.stars?.[id],STAR_MAX)]))};}
export function newRoster(){return normalizeRoster({version:1,owned:STARTERS},[]);}
export function owns(s,id){return s.roster?.owned?.includes(id)===true;}
export function recruitQuote(s,id){return {cost:RECRUIT_COST,have:s.roster.shards[id]||0,owned:owns(s,id),valid:COMPANION_IDS.includes(id)};}
export function recruit(s,id){const q=recruitQuote(s,id);if(!q.valid||q.owned||q.have<q.cost)return false;s.roster.shards[id]-=q.cost;s.roster.owned.push(id);const empty=s.party.indexOf(null);if(empty>=0)s.party[empty]=id;else if(s.party.length<5)s.party.push(id);return true;}
export function normalizeGrowth(raw){return {notes:safe(raw?.notes),seals:safe(raw?.seals)};}
export function tagBonus(s,id){return (s.roster?.stars?.[id]||0)*400+((s.roster?.stars?.[id]||0)>=STAR_MAX?0:s.roster?.tagSteps?.[id]||0)*80;}
export const STAR_SHARDS=[20,40,60,90,130];
// Legacy paid toes keep their bonus and reduce the remaining price; new ranks are atomic.
export function starQuote(s,id){const rank=s.roster.stars[id]||0,step=rank>=STAR_MAX?0:s.roster.tagSteps?.[id]||0,maxed=rank>=STAR_MAX,shards=maxed?0:STAR_SHARDS[rank]-Math.floor(STAR_SHARDS[rank]*step/5);return {rank,step,shards,notes:0,maxed,ready:!maxed&&step===5,owned:owns(s,id),have:s.roster.shards[id]||0,bonus:tagBonus(s,id)/100,nextBonus:maxed?20:(rank+1)*4,nextRank:maxed?rank:rank+1,nextStep:0};}
export function ascend(s,id){if(!COMPANION_IDS.includes(id))return false;const q=starQuote(s,id);if(!q.owned||q.maxed||q.have<q.shards)return false;s.roster.shards[id]-=q.shards;s.roster.tagSteps??={};s.roster.tagSteps[id]=0;s.roster.stars[id]=q.nextRank;return true;}
export function migrateGrowthMaterials(s,raw){
 // Currency conversion is idempotent because retired balances are cleared.
 s.growth.notes+=s.badges*5+s.growth.seals*20;s.badges=0;s.growth.seals=0;
 if(raw.roster?.version===1){const costs=[30,60,100,150,220];for(const id of COMPANION_IDS){const rank=s.roster.stars[id],step=s.roster.tagSteps[id];s.growth.notes+=costs.slice(0,rank).reduce((a,b)=>a+b,0)+(rank<5?Math.floor(costs[rank]*step/5):0);}}
}
