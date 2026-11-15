// Growth trial: fixed content budgets. No enemy stats depend on the player's build.
export const GROWTH_VERSION='0.28.0-preview';
export const GROWTH_SAVE_KEY='can-club-growth-preview-v1';
export const GROWTH_SAVE_FORMAT='CAN-CLUB-GROWTH-1';
export const TRAINING_MILESTONES=Object.freeze([10,20,30,40]);
const training=[[1,100],[9,244],[10,600],[19,780],[20,1800],[29,2100],[30,4500],[39,4900],[40,8000],[60,10500],[80,12500],[160,15000]];
function interpolate(points,value){
 if(value<=points[0][0])return points[0][1];
 for(let i=1;i<points.length;i++)if(value<=points[i][0]){const [x,y]=points[i-1],[end,next]=points[i];return y+(next-y)*(value-x)/(end-x);}
 return points.at(-1)[1];
}
export const trainingPower=level=>Math.round(interpolate(training,level));
export const nextTrainingMilestone=level=>TRAINING_MILESTONES.find(n=>n>level)||null;
export const trainingCount=level=>Math.min(10,(nextTrainingMilestone(level)||160)-level);
export const crossedTrainingMilestone=(before,after)=>TRAINING_MILESTONES.some(n=>before<n&&after>=n);
// 100+ stage runs between early power jumps; later encounter growth needs gear.
const road=[[1,1],[3,3],[100,7],[300,17],[500,33],[700,52],[900,70],[1500,120],[3500,600]];
export const encounterProgress=stage=>interpolate(road,stage);
export const campaignStage=progress=>Math.ceil(interpolate(road.map(([stage,value])=>[value,stage]),progress));
export const trainingMilestoneCost=level=>({9:1800,19:12000,29:42000,39:110000}[level]||0);
