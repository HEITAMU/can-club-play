import {CHARACTERS,SUPPORT} from './characters.mjs';
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const ease=x=>{const q=clamp(x);return q*q*(3-2*q);};
const lerp=(a,b,t)=>a+(b-a)*t;
export function track(t,keys){if(t<=keys[0][0])return keys[0][1];for(let i=1;i<keys.length;i++)if(t<=keys[i][0])return lerp(keys[i-1][1],keys[i][1],ease((t-keys[i-1][0])/(keys[i][0]-keys[i-1][0])));return keys.at(-1)[1];}
export function actionFor(id,kind='normal',start={x:180,y:420},target={x:720,y:420},size=250){
 const c=CHARACTERS[id],melee=c.delivery==='melee'&&!SUPPORT.has(kind),tempo=c.tempo;
 const prepare=.20*tempo,approach=melee?.40*tempo:0,windup=.22*tempo,strike=.18*tempo;
 const release=prepare+approach+windup,contact=release+strike*.74,hit=melee?contact:release+.36;
 const retreat=hit+.20*tempo,returnEnd=retreat+(melee?.48*tempo:0),end=Math.max(returnEnd+.24,hit+.95);
 const dx=target.x-start.x,dy=target.y-start.y,len=Math.hypot(dx,dy)||1;
 // Stops outside the target's body; weapon reach varies by character.
 const stopDistance=size*c.reach+size*.20;
 const travel=melee?Math.max(0,len-stopDistance):0;
 return {id,kind,melee,start,target,size,prepare,approach,windup,strike,release,hit,retreat,returnEnd,end,stop:{x:start.x+dx/len*travel,y:start.y+dy/len*travel},travel};
}
export function sampleAction(a,t,idleTime=t){
 const c=CHARACTERS[a.id],runIn=a.approach?ease((t-a.prepare)/a.approach):0,runOut=a.melee?ease((t-a.retreat)/(a.returnEnd-a.retreat)):0;
 const distance=runIn*(1-runOut),run=(t>a.prepare&&t<a.prepare+a.approach)||(t>a.retreat&&t<a.returnEnd);
 const windupEnd=a.release,pre=a.prepare+a.approach;
 const active=t>=0&&t<=a.end;
 const weapon=active?track(t,[[0,0],[a.prepare,.18],[pre,.15],[windupEnd,.66],[a.hit,-.84],[a.retreat,-.62],[a.returnEnd+.20,0]]):0;
 const cast=active?track(t,[[0,0],[a.prepare,.18],[windupEnd,.65],[a.release+.20,-.32],[a.hit+.55,0]]):0;
 let near=0,far=0;
 const swing=a.melee?weapon:cast;
 if(c.weapon==='nearRightArm')near=swing;else far=swing;
 if(c.shield)far=swing*.55;
 if(c.bow){near=track(t,[[0,0],[a.prepare,-.4],[a.release,-1.15],[a.release+.12,-.5],[a.hit+.4,0]]);far=-.12*Math.sin(clamp(t/a.hit)*Math.PI);}
 if(!c.bow){if(c.weapon==='nearRightArm')far=-swing*.12;else near=-swing*.12;}
 if(a.kind==='multicut'){near=track(t,[[0,0],[pre,.15],[a.release,.7],[a.hit,-1.02],[a.hit+.09,.6],[a.hit+.17,-1.05],[a.hit+.26,.55],[a.hit+.34,-.95],[a.returnEnd+.2,0]]);}
 if(!a.melee){near*=.65;far*=.65;}
 const lean=track(t,[[0,0],[a.prepare,-.09],[pre,.03],[a.release,-.06],[a.hit,.10],[a.retreat,.08],[a.returnEnd+.20,0]]);
 const phase=t<0?'待机':t<a.prepare?'起手':t<pre?'接近':t<a.release?'蓄力':t<a.hit?'挥击':t<a.retreat?'命中':t<a.returnEnd?'归位':'收招';
 const face=t>a.release-.06&&t<a.hit+.18?'attack':t>=0&&a.kind!=='normal'&&t<a.hit+.4?'skill':Math.sin(idleTime*1.2)> .997?'blink':'neutral';
 let bodyFrame;
 if(a.id==='pudding')bodyFrame=!active?undefined:run?(Math.floor(Math.max(0,t)*9)%2?3:2):
  SUPPORT.has(a.kind)?(t<a.hit+.3?6:0):t<a.hit-.07?4:t<a.retreat?5:t<a.returnEnd+.12?6:0;
 return {time:idleTime,bodyFrame,x:lerp(a.start.x,a.stop.x,distance),y:lerp(a.start.y,a.stop.y,distance),near,far,lean,head:-lean*.28,breath:Math.sin(idleTime*2.5)*.012,
  tail:Math.sin(idleTime*3.2)*.09+lean*.7,run:run?Math.sin(t*25):0,bob:run?Math.abs(Math.sin(t*25))*-.023:0,face,phase,hit:t>=a.hit,contact:a.hit,distance};
}
// For the host combat loop: one callback when contact is crossed, never on dispatch.
export function crossedHits(action,previousTime,time){return previousTime<action.hit&&time>=action.hit?[action.hit]:[];}
