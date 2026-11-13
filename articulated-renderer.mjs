import {ARTICULATED} from './articulated-data.mjs?v=0.22.0';
import {rigFor} from './rig-motion.mjs?v=0.22.0';

// Anatomical names stay fixed when the entire character turns. 橘座 carries
// the shield in his LEFT hand; his RIGHT hand is empty in every pose.
export const ORANGE_RIG=Object.freeze({head:.62,chin:.55,body:.35,rightShoulder:[.35,.57],leftShoulder:[.60,.57],shieldHand:'left',shieldHeight:.38,shieldGrip:[.18,.50],tail:.31});
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export function solveArm(shoulder,wrist,upper=.105,lower=.115,bend=1){
 const dx=wrist[0]-shoulder[0],dy=wrist[1]-shoulder[1],raw=Math.hypot(dx,dy)||.001;
 const d=clamp(raw,Math.abs(upper-lower)+.001,upper+lower-.001),ux=dx/raw,uy=dy/raw;
 const end=[shoulder[0]+ux*d,shoulder[1]+uy*d],along=(upper*upper-lower*lower+d*d)/(2*d),side=Math.sqrt(Math.max(0,upper*upper-along*along))*bend;
 return {shoulder:[...shoulder],elbow:[shoulder[0]+ux*along-uy*side,shoulder[1]+uy*along+ux*side],wrist:end};
}
export function orangeJoints(p){
 const hand=p.hand||0,reach=p.reach||0;
 const right=[.35-hand*.025,.77+Math.min(0,hand)*.05];
 const left=[.70+reach*.7+Math.max(0,hand)*.065+Math.max(0,-hand)*.07,.69+Math.min(0,hand)*.07-Math.max(0,hand)*.08];
 return {right:solveArm(ORANGE_RIG.rightShoulder,right),left:solveArm(ORANGE_RIG.leftShoulder,left,.115,.125)};
}
// One uninterrupted painted arm follows the bend. Separate outlined upper and
// lower sprites caused visible circular elbow seams and are not used.
export const SKIN_ROWS=Object.freeze([0,.08,.16,.30,.45,.60,.72,.84,.92,1]);
export function armSkin(joint,src){
 const {shoulder:s,elbow:e,wrist:w}=joint,up=Math.hypot(e[0]-s[0],e[1]-s[1]),low=Math.hypot(w[0]-e[0],w[1]-e[1]),length=up+low;
 const center=t=>{
  if(t<=0)return[s[0]+(e[0]-s[0])*t*length/up,s[1]+(e[1]-s[1])*t*length/up];
  if(t>=1)return[w[0]+(w[0]-e[0])*(t-1)*length/low,w[1]+(w[1]-e[1])*(t-1)*length/low];
  return[(1-t)*(1-t)*s[0]+2*t*(1-t)*e[0]+t*t*w[0],(1-t)*(1-t)*s[1]+2*t*(1-t)*e[1]+t*t*w[1]];
 };
 const width=Math.min(.125,length*src[2]/src[3]/.68*.72);
 return SKIN_ROWS.map(y=>{const t=(y-.16)/.68,c=center(t),a=center(t-.001),b=center(t+.001),d=Math.hypot(b[0]-a[0],b[1]-a[1])||1,nx=(b[1]-a[1])/d,ny=-(b[0]-a[0])/d;return[[c[0]-nx*width*.5,c[1]-ny*width*.5],[c[0]+nx*width*.5,c[1]+ny*width*.5]];});
}
function triangle(ctx,img,src,uv,dest){
 const [a,b,c]=uv,[A,B,C]=dest,den=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);
 const ax=((B[0]-A[0])*(c[1]-a[1])-(C[0]-A[0])*(b[1]-a[1]))/den,bx=((B[1]-A[1])*(c[1]-a[1])-(C[1]-A[1])*(b[1]-a[1]))/den;
 const ay=((C[0]-A[0])*(b[0]-a[0])-(B[0]-A[0])*(c[0]-a[0]))/den,by=((C[1]-A[1])*(b[0]-a[0])-(B[1]-A[1])*(c[0]-a[0]))/den;
 // Subpixel overlap avoids antialias gaps between adjacent skin triangles.
 const center=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3],expanded=dest.map(p=>{const dx=p[0]-center[0],dy=p[1]-center[1],d=Math.hypot(dx,dy)||1;return[p[0]+dx/d*.002,p[1]+dy/d*.002];});
 ctx.save();ctx.beginPath();ctx.moveTo(...expanded[0]);ctx.lineTo(...expanded[1]);ctx.lineTo(...expanded[2]);ctx.closePath();ctx.clip();ctx.transform(ax,bx,ay,by,A[0]-ax*a[0]-ay*a[1],A[1]-bx*a[0]-by*a[1]);ctx.drawImage(img,...src,0,0,1,1);ctx.restore();
}
function arm(ctx,img,parts,joint,side,pawOnly=false){
 const src=parts[side+'Arm'],points=armSkin(joint,src);
 for(let i=pawOnly?6:0;i<SKIN_ROWS.length-1;i++){const y=SKIN_ROWS[i],v=SKIN_ROWS[i+1],a=points[i],b=points[i+1];triangle(ctx,img,src,[[0,y],[1,y],[0,v]],[a[0],a[1],b[0]]);triangle(ctx,img,src,[[1,y],[1,v],[0,v]],[a[1],b[1],b[0]]);}
}
function part(ctx,img,src,height,anchor,point,angle=0){
 const w=height*src[2]/src[3];ctx.save();ctx.translate(...point);ctx.rotate(angle);ctx.drawImage(img,...src,-w*anchor[0],-height*anchor[1],w,height);ctx.restore();
}
export function shieldPlacement(p,joints=orangeJoints(p)){
 return {hand:'left',point:joints.left.wrist,anchor:ORANGE_RIG.shieldGrip,height:ORANGE_RIG.shieldHeight,angle:p.hand*.15};
}
export function drawArticulated(ctx,id,p,img,face={from:'neutral',to:'neutral',mix:1}){
 const kit=ARTICULATED[id],l=ORANGE_RIG,s=kit.parts,foot=rigFor(id).foot,joints=orangeJoints(p),stride=p.stride||0,lift=p.stepLift||0;
 part(ctx,img,s.tail,l.tail,[.86,.82],[.30,foot-.14],p.tail*.5);
 part(ctx,img,s.leftLeg,.205,[.48,.14],[.57,foot-.169-lift],stride*.32);
 arm(ctx,img,s,joints.left,'left');
 part(ctx,img,s.rightLeg,.205,[.48,.14],[.39,foot-.169],-stride*.32);
 part(ctx,img,s.body,l.body,[.5,1],[.49,foot-.09]);
 arm(ctx,img,s,joints.right,'right');
 const head=(key,alpha)=>{const src=kit.faces[key]||kit.faces.neutral;ctx.save();ctx.globalAlpha*=alpha;part(ctx,img,src,l.head*src[3]/src[2],[.5,1],[.49,l.chin],p.head*.5);ctx.restore();};
 if(face.from!==face.to&&face.mix<1){head(face.from,1);head(face.to,face.mix);}else head(face.to,1);
 const shield=shieldPlacement(p,joints);part(ctx,img,s.shield,shield.height,shield.anchor,shield.point,shield.angle);
 // The same hand's foreground fingers cover the handle. No second wrist or arm.
 arm(ctx,img,s,joints.left,'left',true);
}
