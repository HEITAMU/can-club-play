// Growth trial: fixed content budgets. Enemy strength never follows player stats.
export const GROWTH_VERSION='0.28.0-preview';
export const GROWTH_SAVE_KEY='can-club-growth-preview-v1';
export const GROWTH_SAVE_FORMAT='CAN-CLUB-GROWTH-1';
export const GROWTH_REVISION=2;
const training=[[1,100],[5,120],[10,140],[20,175],[40,225],[80,275],[160,325]];
function interpolate(points,value){
 if(value<=points[0][0])return points[0][1];
 for(let i=1;i<points.length;i++)if(value<=points[i][0]){const [x,y]=points[i-1],[end,next]=points[i];return y+(next-y)*(value-x)/(end-x);}
 return points.at(-1)[1];
}
export const trainingPower=level=>Math.round(interpolate(training,level));
export const trainingCount=level=>level<160?1:0;
// Five earned stars per material. The separate promotion keeps the existing UI order.
// Early stars carry large jumps; later stars flatten as equipment takes over.
export const TAG_POWER=Object.freeze([
 [100,240,380,540,720,950],
 [1200,1500,1850,2250,2700,3200],
 [3800,4200,4600,5000,5500,6000],
 [6600,7000,7400,7800,8200,8600],
 [9000,9400,9800,10200,10600,11000],
 [12000,12000,12000,12000,12000,12000]
].map(Object.freeze));
export const TAG_SHARDS=Object.freeze([20,40,60,90,130]);
export const TAG_NOTES=Object.freeze([30,60,100,150,220]);
export const tagPower=(rank=0,step=0)=>TAG_POWER[Math.max(0,Math.min(5,Math.floor(rank)))][Math.max(0,Math.min(5,Math.floor(step)))];
export const tagPart=(totals,rank,step)=>rank>=5||step>=5?0:Math.floor(totals[rank]*(step+1)/5)-Math.floor(totals[rank]*step/5);
// Keep existing preview levels/ranks. Credit materials for players who bought the
// previous level spikes, so they choose their own stars instead of changing rank on load.
const legacyTraining=[[1,100],[9,244],[10,600],[19,780],[20,1800],[29,2100],[30,4500],[39,4900],[40,8000],[60,10500],[80,12500],[160,15000]];
const legacySpikes={9:1800,19:12000,29:42000,39:110000};
export function migrateGrowth(s,raw){
 s.growthRevision=GROWTH_REVISION;s.growthRebalancePending=raw.growthRebalancePending===true;
 if((raw.growthRevision||1)>=GROWTH_REVISION)return;
 let granted=false;
 for(const id of s.roster.owned){
  const level=s.levels[id],rank=Math.min(5,raw.roster?.stars?.[id]||0),step=rank>=5?0:raw.roster?.tagSteps?.[id]||0;
  const target=interpolate(legacyTraining,level)*(10000+rank*400+step*80)/trainingPower(level)/100;
  let r=rank,n=step,shards=0,notes=0;
  while(r<5&&tagPower(r,n)<target){shards+=tagPart(TAG_SHARDS,r,n);notes+=tagPart(TAG_NOTES,r,n);if(n===5){r++;n=0;}else n++;}
  s.roster.shards[id]+=shards;s.growth.notes+=notes;
  let refund=0;for(const [at,cost]of Object.entries(legacySpikes))if(level>+at)refund+=Math.max(0,cost-Math.round(22+at*12+Math.pow(+at,1.65)*2));
  s.gold+=refund;granted||=shards>0||notes>0||refund>0;
 }
 if(granted)s.growthRebalancePending=true;
}
const road=[[1,1],[3500,600]];
export const encounterProgress=stage=>interpolate(road,stage);
export const campaignStage=progress=>Math.ceil(interpolate(road.map(([stage,value])=>[value,stage]),progress));
