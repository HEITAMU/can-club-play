// Encounter budgets are fixed by content progress, never by player equipment.
// The opening 100 stages retain their original enemy stats.
export function equipmentEncounterScale(stage){
 const points=[[100,1,1],[200,2,2.5],[300,4,6],[400,8,12],[500,15,22],[600,25,36]];
 if(stage<=100)return {hp:1,atk:1};
 for(let i=1;i<points.length;i++){
  const [end,hp,atk]=points[i],[start,oldHp,oldAtk]=points[i-1];
  if(stage<=end){const t=(stage-start)/(end-start);return {hp:oldHp+(hp-oldHp)*t,atk:oldAtk+(atk-oldAtk)*t};}
 }
 return {hp:25,atk:36};
}
export function activityEquipmentScale({kind,tier}){
 if(kind==='hard')return [{hp:3,atk:4},{hp:10,atk:12},{hp:30,atk:36}][tier-1];
 if(kind==='hunt')return equipmentEncounterScale(Math.min(600,tier*20));
 // Material and recruitment encounters remain an accessible source of gear.
 return {hp:1,atk:1};
}
