import {formationPositions} from './battle-cues.mjs?v=0.15.0';
import {ease} from './rig-motion.mjs?v=0.15.0';
export class FormationMotion{
 constructor(){this.clear();}
 clear(){this.points=new Map();}
 sample(entry,time){const k=ease((time-entry.at)/.38);return {x:entry.from.x+(entry.to.x-entry.from.x)*k,y:entry.from.y+(entry.to.y-entry.from.y)*k};}
 update(b,time=b.time){const target=formationPositions(b),result={};
  for(const a of [...b.heroes,...b.enemies]){const to=target[a.id];let entry=this.points.get(a.id);
   if(!entry)entry={from:to,to,at:time-1};
   else if(entry.to.x!==to.x||entry.to.y!==to.y)entry={from:this.sample(entry,time),to,at:time+(a.hp<=0?Math.max(0,.45-(time-(a.downAt??time))):0)};
   this.points.set(a.id,entry);result[a.id]=this.sample(entry,time);
  }return result;
 }
}
export function retiringSize(size,actor,time){if(actor.hp>0)return size;const k=ease((time-(actor.downAt??time)-.25)/.5);return size+(23-size)*k;}
