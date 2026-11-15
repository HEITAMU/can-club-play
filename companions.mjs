import {tagPower,tagPart,TAG_SHARDS,TAG_NOTES} from './growth-curve.mjs';
export const COMPANION_IDS=['orange','ink','milk','spark','mint','bolt','pudding','star'];
export const STARTERS=['orange','ink'],RECRUIT_COST=20,STAR_MAX=5;
const safe=(n,max=1e9)=>Number.isFinite(n)?Math.max(0,Math.min(max,Math.floor(n))):0;
export function normalizeRoster(raw,cats,highest=0){const old=!raw||raw.version!==1,owned=old?cats.filter(c=>highest>=c.unlock).map(c=>c.id):(Array.isArray(raw.owned)?raw.owned:[]);return {version:1,owned:[...new Set([...STARTERS,...owned.filter(id=>COMPANION_IDS.includes(id))])],shards:Object.fromEntries(COMPANION_IDS.map(id=>[id,safe(raw?.shards?.[id])])),tagSteps:Object.fromEntries(COMPANION_IDS.map(id=>[id,safe(raw?.tagSteps?.[id],5)])),stars:Object.fromEntries(COMPANION_IDS.map(id=>[id,safe(raw?.stars?.[id],STAR_MAX)]))};}
export function newRoster(){return normalizeRoster({version:1,owned:STARTERS},[]);}
export function owns(s,id){return s.roster?.owned?.includes(id)===true;}
export function recruitQuote(s,id){return {cost:RECRUIT_COST,have:s.roster.shards[id]||0,owned:owns(s,id),valid:COMPANION_IDS.includes(id)};}
export function recruit(s,id){const q=recruitQuote(s,id);if(!q.valid||q.owned||q.have<q.cost)return false;s.roster.shards[id]-=q.cost;s.roster.owned.push(id);const empty=s.party.indexOf(null);if(empty>=0)s.party[empty]=id;else if(s.party.length<5)s.party.push(id);return true;}
export function normalizeGrowth(raw){return {notes:safe(raw?.notes),seals:safe(raw?.seals)};}
export function tagBonus(s,id){return (tagPower(s.roster?.stars?.[id]||0,s.roster?.tagSteps?.[id]||0)-100)*100;}
export function starQuote(s,id){
 const rank=s.roster.stars[id]||0,step=rank>=STAR_MAX?5:s.roster.tagSteps?.[id]||0,maxed=rank>=STAR_MAX,ready=!maxed&&step===5;
 const shards=tagPart(TAG_SHARDS,rank,step),notes=tagPart(TAG_NOTES,rank,step),nextRank=maxed?rank:ready?rank+1:rank,nextStep=maxed?5:ready?0:step+1;
 const current=tagPower(rank,step),next=tagPower(nextRank,nextStep);
 return {rank,step,shards,notes,maxed,ready,owned:owns(s,id),have:s.roster.shards[id]||0,bonus:current-100,nextBonus:next-100,gain:Math.round((next/current-1)*100),nextRank,nextStep};
}
export function ascend(s,id){if(!COMPANION_IDS.includes(id))return false;const q=starQuote(s,id);if(!q.owned||q.maxed||q.have<q.shards||s.growth.notes<q.notes)return false;s.roster.shards[id]-=q.shards;s.growth.notes-=q.notes;s.roster.tagSteps??={};s.roster.tagSteps[id]=q.nextStep;s.roster.stars[id]=q.nextRank;return true;}
