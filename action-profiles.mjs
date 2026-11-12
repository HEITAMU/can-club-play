// Each companion owns separate normal and skill performances. These are visual
// settings only; damage, targeting, cooldowns and saves remain in core.mjs.
const shot=(art,trail,size,count=1)=>({art,trail,size,count});
const action=(id,delivery,hand,impact,projectile=null,body=1)=>({id,delivery,hand,impact,projectile,body});
export const CAT_ACTIONS={
 orange:{normal:action('orange-normal','melee',[-.84,.72,.46],'shield-bash'),skill:action('orange-skill','support',[.18,-1.26,-.96],'guard',null,.55)},
 ink:{normal:action('ink-normal','ranged',[-.72,.58,.33],'pierce',shot('fish','ember',21)),skill:action('ink-skill','ranged',[-.88,.72,.26],'pierce-volley',shot('fish','star',25,3),1.1)},
 milk:{normal:action('milk-normal','ranged',[-1.02,.82,.48],'splash',shot('milk','milk',20)),skill:action('milk-skill','support',[.22,-1.34,-1.02],'heal',null,.5)},
 spark:{normal:action('spark-normal','ranged',[-1.05,.88,.51],'fire-hit',shot('fire','ember',21)),skill:action('spark-skill','ranged',[-1.12,1.12,.70],'fire',shot('fire','fire',32),1.35)},
 mint:{normal:action('mint-normal','ranged',[-.86,.96,.58],'ice-hit',shot('ice','shard',23)),skill:action('mint-skill','ranged',[-1.05,.98,.38],'ice',shot('shard','ice',32),1.12)},
 bolt:{normal:action('bolt-normal','melee',[-1.06,1.16,.66],'wrench-hit'),skill:action('bolt-skill','melee',[-1.22,1.30,.82],'armor-break',null,1.45)},
 pudding:{normal:action('pudding-normal','melee',[-.82,.74,.46],'shield-thump'),skill:action('pudding-skill','melee',[-.46,1.12,.76],'ground-smash',null,1.35)},
 star:{normal:action('star-normal','ranged',[-.94,.92,.54],'star-hit',shot('star','star',21)),skill:action('star-skill','support',[.20,-1.16,-.76],'energy',shot('star','heart',16),.65)}
};
export const ACTION_BY_ID=Object.fromEntries(Object.values(CAT_ACTIONS).flatMap(cat=>Object.values(cat)).map(p=>[p.id,p]));
export const catAction=(id,kind='normal')=>CAT_ACTIONS[id]?.[kind==='skill'?'skill':'normal'];
export const enemyAttackType=type=>['drone','battery','mop','vacuum'].includes(type)?'ranged':'melee';
