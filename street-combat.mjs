import {enemyCombatStats} from './combat-stats.mjs?v=0.25.0';
// Fixed encounters: changing the player's party, equipment or title never scales enemies.
// Ordinary material/recruitment jobs do not use these endgame multipliers.
const HARD_PRESSURE={barrier:{hp:9,atk:5},healer:{hp:9,atk:4.8},armor:{hp:12,atk:5.5},adaptive:{hp:15,atk:5.5},ambush:{hp:8,atk:7.5},burst:{hp:11,atk:5.5}};
export function streetEnemies(info){
 const {level,tier,theme,kind}=info,m=(1+.18*(level-1))*(1+.08*Math.floor(level/10));
 const power=kind==='hard'?[3.3,4.8,6.5][tier-1]:kind==='hunt'?(1.1+Math.min(tier,25)*.12)*(1+Math.max(0,tier-25)*.15)**1.35:kind==='recruit'?.8+Math.max(0,tier-2)*.35:1+Math.max(0,tier-2)*.3;
 const types=theme==='barrier'?['fridge','box','battery','mop','bag']:theme==='healer'?['box','mop','bag','battery','drone']:theme==='ambush'?['drone','drone','box','battery','bag']:theme==='burst'?['clock','vacuum','mop','battery','bag']:['box','box','battery','drone','mop'];
 const count=kind==='recruit'&&tier===1?2:kind==='recruit'&&tier===2?3:kind==='sweep'&&tier===1?3:5;
 return types.slice(0,count).map((type,i)=>{const boss=(theme==='barrier'&&i===0)||(theme==='burst'&&i<(kind==='hard'?2:1));const hp=i<2?210:i===2?150:100;
 const e={id:'e'+i,type,name:theme==='healer'&&i===2?'夜班补给员':theme==='ambush'&&i<2?'绕后追兵':boss?'街头头目':'街巷对手',maxHp:Math.round(hp*m*power),atk:Math.round((i<2?15:10)*m*power*.78),interval:i<2?2:2.6,boss,...enemyCombatStats(type,Math.min(600,level*3),boss),skillWait:theme==='burst'?(i===0?4:8):6,burstCooldown:9};
 if(theme==='armor'){e.armor=i<2?(kind==='hard'?300+tier*200:180+tier*32):25;e.magicResist=i<2?25:(kind==='hard'?200+tier*80:150+tier*15);}
 if(theme==='barrier'&&i===0){e.maxHp=Math.round(e.maxHp*1.8);e.barrierCycle=8;e.nextBarrier=8;e.barrierRatio=kind==='hard'?[28,38,48][tier-1]:23;}
 if(theme==='healer'&&i===2){e.maxHp=Math.round(270*m*power);e.arenaHealer=true;e.nextHeal=5;e.healRatio=kind==='hard'?[24,32,40][tier-1]:20;}
 if(theme==='adaptive'&&i<2)e.adaptive=true;
 if(theme==='ambush'&&i<2)e.ambusher=true;
 if(kind==='hard'){
  const pressure=HARD_PRESSURE[theme];
  e.maxHp=Math.round(e.maxHp*pressure.hp*[.3,.58,1][tier-1]);
  e.atk=Math.round(e.atk*pressure.atk*[.4,.68,1][tier-1]);
  if(theme==='burst'&&e.boss){e.atk=Math.round(e.atk*1.6);e.interval=3.5;}
 }
 return e;});
}
