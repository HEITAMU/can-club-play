// @ts-nocheck
// Original Preview11 painted mesh functions; unchanged numeric parameters.
import {FINISHED_ROSTER} from "../domain/finished-roster-data";
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
export function rosterCel(pose){const k=Math.round(clamp(pose.rosterCel||0,0,4));if(k===4)return pose.rosterSkill>.5?6:5;if(k===2&&pose.rosterSkill<-.2&&pose.rosterRecovery<.2)return 6;return (pose.rosterRecovery>.2?[0,11,7,10]:[0,8,4,9])[k];}
export function rosterVertex(id,x,y,p){
 const period=FINISHED_ROSTER[id]?.period||4,phase=(p.rosterClock||0)*Math.PI*2/period,breath=Math.sin(phase),upper=1-smooth((y-258)/242),feet=1-smooth((y-470)/48);
 // Rigid skull translation, small rib expansion, no whole-character idle sway.
 let dx=0,dy=-breath*(id==='pudding'?2.8:3.8)*upper;
 const ribs=Math.exp(-(((y-335)/60)**2))*feet;dx+=(x-256)*ribs*breath*.006;
 const tail=(1-smooth((x-110)/65))*smooth((y-220)/60)*(1-smooth((y-420)/50));
 dx+=Math.sin(phase-.65)*tail*(id==='pudding'?2.2:4);dy+=Math.cos(phase-.65)*tail*1.5;
 // Action deformation reinforces weight transfer; it never detaches a limb or scales a skull.
 dx+=(p.reach||0)*85*upper;dy+=(p.breath||0)*-30*upper;
 if(id==='pudding'&&p.shidunCharge>0){const q=p.shidunCharge,t=p.shidunTime||0,body=1-smooth((y-410)/65);dy+=q*3*body;}
 return [x+dx*feet,y+dy*feet];
}
export function sparkCel(pose){const k=clamp(Math.round(pose.sparkCel||0),0,5);return pose.sparkRecovery>.1?[0,8,8,7,6,5][k]:k;}
export function sparkFace(face,cel){
 const key=face?.to||'neutral';
 if(key==='down')return 'blink';
 if(key==='hurt'||key==='blink'||key==='victory')return key;
 if((key==='attack'||key==='skill')&&cel<4)return 'attack';
 return 'neutral';
}
export function sparkVertex(x,y,pose){
 const t=pose.sparkClock||0;
 const smooth=v=>{v=clamp(v,0,1);return v*v*(3-2*v);};
 // One slow breath drives the shoulders and skull together. The skull is
 // translated rigidly; the bend is confined to the torso above planted paws.
 const phase=t*Math.PI*2/3.8,breath=Math.sin(phase);
 const upper=1-smooth((y-260)/235),feet=1-smooth((y-470)/48);
 const active=1-clamp((pose.sparkCel||0)/1.5,0,1);
 const shift=Math.sin(phase*.5)*1.8;
 let dx=shift*upper,dy=-breath*3.8*upper;
 // Rib cage expansion stays below the face and above the belt.
 const ribs=Math.exp(-(((y-325)/55)**2))*feet;
 dx+=(x-260)*ribs*breath*.008;
 // The hanging hand and lantern follow the breath as a connected pendulum.
 // Limit this zone to the resting cel; casting drawings have a raised arm.
 const hand=smooth((x-130)/42)*(1-smooth((x-239)/38))*smooth((y-290)/75)*(1-smooth((y-475)/35));
 const lag=Math.sin(phase-.55),angle=lag*.035*active;
 dx+=-(y-310)*angle*hand;dy+=(x-202)*angle*hand;
 // Tail tip moves more than its root; the cape trails the same breath.
 const tail=(1-smooth((x-105)/57))*smooth((y-230)/50)*(1-smooth((y-370)/48));
 const cape=(1-smooth((x-145)/60))*smooth((y-340)/45)*(1-smooth((y-445)/30));
 dx+=(tail*Math.sin(phase-.9)*5+cape*lag*1.4)*active;
 dy+=tail*Math.cos(phase-.9)*2*active;
 return [x+dx*feet,y+dy*feet];
}
