export const EXPRESSIONS=Object.freeze(['neutral','blink','attack','skill','hurt','victory','down']);
const ids=['orange','ink','milk','spark','mint','bolt','pudding','star'];
const smooth=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t);};
export function expressionFor(id,actor,time,idleTime=time,{outcome,preview}={}){
 if(EXPRESSIONS.includes(preview))return preview;
 if(actor?.hp<=0)return 'down';
 if(outcome==='win'&&actor?.side==='p')return 'victory';
 if((actor?.hitUntil||0)>time)return 'hurt';
 if(actor?.action)return actor.action.kind==='skill'?'skill':'attack';
 if(actor?.charge>0||(actor?.burstUntil||0)>time)return 'attack';
 const i=Math.max(0,ids.indexOf(id)),period=3.6+i*.19,t=(idleTime+i*.67)%period;
 return t>period-.15?'blink':'neutral';
}
export function faceTransition(previous,key,time){
 if(!EXPRESSIONS.includes(key))key='neutral';
 if(!previous||time<previous.clock)return {from:key,to:key,mix:1,at:time,clock:time};
 if(previous.to!==key){const from=previous.mix<.5?previous.from:previous.to;return {from,to:key,mix:from===key?1:0,at:time,clock:time};}
 const duration=key==='blink'?.035:previous.from==='blink'?.055:.085;
 return {...previous,mix:smooth((time-previous.at)/duration),clock:time};
}
export function bowNock(actor){
 const a=actor?.action;if(!a||a.elapsed<a.windup)return 1;
 // The arrow leaves with the projectile event; redraw it only as the bow recovers.
 return smooth((a.elapsed-a.impactAt)/.28);
}
