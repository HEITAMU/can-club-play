// Isolated Orange rig trial. Canvas2D only; canvas and image ownership belongs to caller.
const PARTS=[[39,51,281,250],[389,48,252,262],[727,48,232,259],[84,390,163,220],[413,389,172,232],[741,366,223,299],[77,734,193,235],[398,742,196,222],[747,739,202,225]];
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const lerp=(a,b,t)=>a+(b-a)*ease(t);
// Smooth keys use action-relative time. Presentation never produces combat events.
export function orangeMotion(actor,time=0){
 const a=actor.action,rest={crouch:Math.sin(time*1.7)*1.4,lean:0,shoulder:0,elbow:0,shield:0,head:Math.sin(time*.85)*.008,tail:Math.sin(time*1.7-.7)*.045,stride:0,shieldReach:0};if(!a)return rest;
 const t=a.elapsed,hit=a.impactAt,skill=a.kind==='skill',keys=[
 [0,[0,0,0,0,0,0]],
 [a.windup*.8,[9,-.07,.28,-.45,-.13,-.035]],
 [a.windup,[10,-.08,.32,-.6,-.17,-.045]],
 [hit,[2,.12,-.95,-.45,-.30,-.07]],
 [hit+a.hold,[3,.095,-.85,-.38,-.26,-.05]],
 [a.duration-.07,[1,-.018,.035,-.08,.025,.018]],
 [a.duration,[0,0,0,0,0,0]]];
 let value=keys.at(-1)[1];for(let i=1;i<keys.length;i++)if(t<=keys[i][0]){const [ta,va]=keys[i-1],[tb,vb]=keys[i];value=va.map((v,j)=>lerp(v,vb[j],(t-ta)/Math.max(.001,tb-ta)));break;}
 const moving=t>a.windup&&t<hit||t>hit+a.hold&&t<a.duration;
 return {...rest,shieldReach:Math.max(0,value[1])*350,crouch:value[0],lean:value[1]*(skill?1.12:1),shoulder:value[2],elbow:value[3],shield:value[4]*(skill?1.3:1),head:value[5],stride:moving?Math.sin((t-a.windup)*Math.PI*12)*7:0};
}
export function drawOrangePuppet(ctx,parts,original,actor,time,width,height){
 const p=orangeMotion(actor,time),scale=.91/480;
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);
 ctx.setTransform(width/1.44,0,0,height/1.38,.22*width/1.44,.20*height/1.38);
 ctx.translate(.5,.92);ctx.scale(scale,scale);ctx.translate(-256,-518);
 const draw=(i,x,y,w,h)=>ctx.drawImage(parts,...PARTS[i],x,y,w,h);
 const originalRegion=points=>{ctx.save();ctx.beginPath();points.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](x,y));ctx.closePath();ctx.clip();const f=original.width/2048;ctx.drawImage(original,0,0,512*f,544*f,0,0,512,544);ctx.restore();};
 const joint=(x,y,angle,fn)=>{ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.translate(-x,-y);fn();ctx.restore();};
 // Legs overlap behind shorts; opposing planted-paw offsets suggest stepping.
 joint(235,444,p.stride*.009,()=>originalRegion([[174,461],[286,449],[290,522],[174,522]]));
 joint(356,444,-p.stride*.009,()=>originalRegion([[309,449],[435,453],[440,522],[307,522]]));
 ctx.save();ctx.translate(0,p.crouch);joint(298,442,p.lean,()=>{
 joint(218,405,p.tail-p.lean*.5,()=>originalRegion([[75,251],[194,251],[209,279],[181,326],[181,370],[213,421],[204,454],[74,454]]));
 // Shield arm goes behind torso. Its connected shoulder and shield rotate together.
 joint(376,282,p.shield,()=>{draw(6,350,273,72+p.shieldReach,118);ctx.save();ctx.translate(p.shieldReach,0);ctx.beginPath();ctx.ellipse(430,343,73,108,-.12,0,Math.PI*2);ctx.clip();const f=original.width/2048;ctx.drawImage(original,0,0,512*f,544*f,0,0,512,544);ctx.restore();});
 draw(1,204,240,216,232);
 originalRegion([[260,264],[351,266],[353,361],[381,439],[298,465],[231,438],[254,364]]);
 joint(245,285,p.shoulder,()=>{draw(3,205,268,85,103);joint(231,349,p.elbow,()=>draw(4,212,337,75,82));});
 // Exact painted head from approved idle cel, no generated replacement face.
 joint(300,251,p.head-p.lean*.55,()=>{ctx.save();ctx.beginPath();ctx.moveTo(175,65);ctx.lineTo(430,65);ctx.lineTo(435,226);ctx.lineTo(398,250);ctx.lineTo(346,272);ctx.lineTo(283,253);ctx.lineTo(207,246);ctx.lineTo(176,214);ctx.closePath();ctx.clip();const factor=original.width/2048;ctx.drawImage(original,0,0,512*factor,544*factor,0,0,512,544);ctx.restore();});
 });ctx.restore();ctx.setTransform(1,0,0,1,0,0);
}
