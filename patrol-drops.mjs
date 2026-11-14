const materials=['notes','scrap','supplies','badges','essence','seals'];
export function patrolDrop(stage){if(!Number.isInteger(stage)||stage<1||stage%5)return null;const cycle=Math.floor((stage-1)/30),i=(stage/5-1)%6;return {id:materials[i],count:[12,24,18,4,3,1][i]+Math.floor(cycle*[3,6,4,1,.5,.25][i]),cell:i};}
export function grantPatrolDrop(s,d){if(!d)return;if(d.id==='notes'||d.id==='seals')s.growth[d.id]+=d.count;else if(d.id==='scrap'||d.id==='essence')s.inventory.materials[d.id]+=d.count;else s[d.id]+=d.count;}
