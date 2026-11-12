const clamp=n=>Math.max(0,Math.min(1,n));

// Damage trails interpolate on game time, not wall time. They never change HP.
export class HealthTrails{
 constructor(){this.entries=new Map();}
 clear(){this.entries.clear();}
 value(id,hpRatio,time){
  const hp=clamp(hpRatio);let item=this.entries.get(id);
  if(!item){this.entries.set(id,{hp,from:hp,at:time});return hp;}
  const elapsed=Math.max(0,time-item.at-.12),progress=clamp(elapsed/.42);
  const previous=item.hp+(item.from-item.hp)*(1-progress);
  if(hp<item.hp-.00001){item.from=Math.max(previous,item.hp);item.at=time;item.hp=hp;return item.from;}
  if(hp>item.hp){item.hp=hp;if(hp>=previous){item.from=hp;item.at=time;return hp;}return previous;}
  return Math.max(hp,previous);
 }
}

export function rescueView(battle,running){
 const seconds=Math.max(0,battle.canCd),total=Math.max(.001,battle.buff.canCd);
 const charged=battle.enemies.some(a=>a.hp>0&&a.charge>0)&&!battle.result;
 return {ready:running&&!battle.result&&seconds===0,charged,seconds,progress:clamp(1-seconds/total),status:battle.result?'本场结束':seconds>0?'冷却 '+Math.ceil(seconds)+'秒':running?'可以使用':battle.time>0?'继续可用':'开战可用'};
}

export function bossView(battle){
 const boss=battle.enemies.find(a=>a.boss);if(!boss)return null;
 const charging=boss.hp>0&&boss.charge>0&&!battle.result;
 return {name:boss.name.split(' · ').at(-1),hp:Math.max(0,Math.ceil(boss.hp)),maxHp:boss.maxHp,ratio:clamp(boss.hp/boss.maxHp),charging,seconds:Math.max(0,boss.charge),charge:charging?clamp(1-boss.charge/2):0};
}
