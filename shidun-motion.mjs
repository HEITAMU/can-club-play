const clamp=x=>Math.max(0,Math.min(1,x));
// Stable formation slots: two front positions, upper / middle / lower rear.
// Empty/dead slots do not pull an unrelated rear target into the strike.
export function shidunTargets(enemies,targetId){
 const index=enemies.findIndex(e=>e.id===targetId),front=index===1||index>=3?1:0;
 const rear=index>=2?index:enemies.length>2?(front===0?2:enemies.length-1):-1;
 const ids=new Set([front,1-front,rear]);return enemies.filter((e,i)=>ids.has(i)&&e.hp>0);
}
export function shidunPose(actor,time,idleTime=time){
 const p={shidunCel:0,shidunCharge:0,shidunTime:time,rosterClock:idleTime,lean:0,reach:0,breath:0};
 if(actor?.hp<=0){delete p.lean;delete p.reach;delete p.breath;return p;}
 if(!actor)return p;
 const sp=actor.shieldPunch;
 if(sp&&['charging','primed'].includes(sp.state)){
  const elapsed=Math.max(0,time-sp.firstAt),q=clamp(elapsed/sp.config.minCharge);
  p.shidunCel=elapsed<.15?8:elapsed<.32?9:4;
  p.shidunCharge=sp.state==='primed'&&sp.releaseAt-time<.08?0:.3+.7*q;return p;
 }
 const a=actor.action;if(!a||a.elapsed>=a.duration)return p;
 if(a.shieldStrike){const t=a.elapsed,h=a.impactAt;
  p.shidunCel=t<h*.4?6:t<h?10:t<h+.25?5:t<a.duration-.18?7:11;return p;
 }
 const t=a.elapsed,h=a.impactAt;
 p.shidunCel=t<a.windup*.45?8:t<a.windup?9:t<h?10:t<h+.12?5:t<a.duration-.12?7:11;
 return p;
}
