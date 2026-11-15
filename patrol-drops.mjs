import {encounterProgress} from './growth-curve.mjs';
// Campaign carriers provide common supplies only; specialist materials belong to commissions.
export function patrolDrop(stage){if(!Number.isInteger(stage)||stage<1||stage%5)return null;const scrap=stage%10===0,cycle=Math.floor((encounterProgress(stage)-1)/30);return {id:scrap?'scrap':'supplies',count:(scrap?24:18)+cycle*(scrap?6:4),cell:scrap?1:2};}
export function grantPatrolDrop(s,d){if(!d)return;if(d.id==='notes'||d.id==='seals')s.growth[d.id]+=d.count;else if(d.id==='scrap'||d.id==='essence')s.inventory.materials[d.id]+=d.count;else s[d.id]+=d.count;}
