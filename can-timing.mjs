// Shared by combat and animation: kibble lands as healing resolves, and the
// single lid reaches each enemy on that enemy's damage timestamp.
export const CAN_TIMING={open:.24,release:.48,heal:.96,firstHit:1.08,hitStep:.20,exit:.66,tail:.12};
export const canHitAt=i=>CAN_TIMING.firstHit+i*CAN_TIMING.hitStep;
export const canDuration=count=>canHitAt(Math.max(0,count-1))+CAN_TIMING.exit+CAN_TIMING.tail;
export function canTargetOrder(enemies){
 const alive=enemies.filter(e=>e.hp>0),front=alive.slice(0,2),back=alive.slice(2);
 const rows=alive.map(e=>({id:e.id,y:front.includes(e)?(front.length===1?76:[59,89][front.indexOf(e)]):back.length===1?75:back.length===2?[57,94][back.indexOf(e)]:[51,73,95][back.indexOf(e)]}));
 return rows.sort((a,b)=>a.y-b.y).map(e=>e.id);
}
