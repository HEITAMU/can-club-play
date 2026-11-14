const clamp=x=>Math.max(0,Math.min(1,x));
// Stable formation slots: two front positions, upper / middle / lower rear.
// Empty/dead slots do not pull an unrelated rear target into the strike.
export function shidunTargets(enemies,targetId){
 const index=enemies.findIndex(e=>e.id===targetId),front=index===1||index>=3?1:0;
 const ids=new Set(front===0?[0,2,3]:[1,3,4]);return enemies.filter((e,i)=>ids.has(i)&&e.hp>0);
}
export function shidunPose(actor,time,idleTime=time){
 const p={shidunCel:0,shidunFrom:0,shidunMix:1,shidunCharge:0,shidunTime:time,rosterClock:idleTime,lean:0,reach:0,breath:0};
 if(actor?.hp<=0){delete p.lean;delete p.reach;delete p.breath;return p;}
 if(!actor)return p;
 const sp=actor.shieldPunch;
 if(sp&&['charging','primed'].includes(sp.state)){
  const elapsed=Math.max(0,time-sp.firstAt),q=clamp(elapsed/sp.config.minCharge);
  p.shidunCel=4;p.shidunMix=clamp(elapsed/.12);
  p.shidunCharge=sp.state==='primed'&&sp.releaseAt-time<.08?0:.3+.7*q;return p;
 }
 const a=actor.action;if(!a||a.elapsed>=a.duration)return p;
 if(a.shieldStrike){const t=a.elapsed,h=a.impactAt;
  select(p,t,[0,h*.4,h,h+.25,a.duration-.18],[6,10,5,7,11],4);return p;
 }
 const t=a.elapsed,h=a.impactAt;
 select(p,t,[0,a.windup*.45,a.windup,h,h+.12,a.duration-.12],[8,9,10,5,7,11],0);
 return p;
}

function select(p,t,edges,cels,initial){let i=0;while(i+1<edges.length&&t>=edges[i+1])i++;p.shidunCel=cels[i];p.shidunFrom=i?cels[i-1]:initial;const q=clamp((t-edges[i])/.075);p.shidunMix=q*q*(3-2*q);}
