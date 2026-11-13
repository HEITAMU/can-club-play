import {FINISHED_ROSTER} from './finished-roster-data.mjs?v=0.21.3';
let factory,snapshot;
export function setRosterCanvasFactory(f,freeze){factory=f;snapshot=freeze;}
const cache=new WeakMap(),clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function canvas(w,h){const c=factory?factory(w,h):typeof OffscreenCanvas==='function'?new OffscreenCanvas(w,h):typeof document!=='undefined'?document.createElement('canvas'):null;if(c){c.width=w;c.height=h;}return c;}
export function rosterCel(pose){const k=Math.round(clamp(pose.rosterCel||0,0,4));if(k===4)return pose.rosterSkill>.5?6:5;if(k===2&&pose.rosterSkill<-.2&&pose.rosterRecovery<.2)return 6;return (pose.rosterRecovery>.2?[0,11,7,10]:[0,8,4,9])[k];}
// Cached surfaces are shared between battle, collection cards and portraits.
// Expressions replace the face inside the resting drawing; costume and feet stay exact.
function layer(id,atlas,index,face){
 const art=FINISHED_ROSTER[id],key=index===0?face?.to:'neutral',expression={blink:1,down:1,hurt:2,victory:3}[key],token=index+':'+(expression||0);
 let entries=cache.get(atlas);if(!entries){entries=new Map();cache.set(atlas,entries);}if(entries.has(token))return entries.get(token);
 const c=canvas(512,544);if(!c)return {image:atlas,rect:art.frames[index]};const ctx=c.getContext('2d');ctx.drawImage(atlas,...art.frames[index],0,0,512,544);
 if(expression){
  const p=canvas(512,544),mask=canvas(512,544);const pc=p.getContext('2d'),m=mask.getContext('2d');pc.drawImage(atlas,...art.frames[expression],0,0,512,544);
  // These bounds are calibrated against the packed paintings, not arm/head cutouts.
  const [x,y,rx,ry]=art.face||[.57,.26,.16,.085];m.save();m.translate(x*512,y*544);m.scale(rx*512,ry*544);const g=m.createRadialGradient(0,0,.82,0,0,1);g.addColorStop(0,'#fff');g.addColorStop(1,'#fff0');m.fillStyle=g;m.fillRect(-1,-1,2,2);m.restore();pc.globalCompositeOperation='destination-in';pc.drawImage(mask,0,0);ctx.globalCompositeOperation='source-atop';ctx.drawImage(p,0,0);ctx.globalCompositeOperation='source-over';
 }
 const value={image:snapshot?snapshot(c):c.transferToImageBitmap?c.transferToImageBitmap():c,rect:[0,0,512,544]};entries.set(token,value);if(entries.size>14)entries.delete(entries.keys().next().value);return value;
}
export function prepareRosterFrames(id,atlas){for(const index of [0,4,5,6,7,8,9,10,11])layer(id,atlas,index,{to:'neutral'});for(const to of ['blink','hurt','victory'])layer(id,atlas,0,{to});}
export function rosterVertex(id,x,y,p){
 const period=FINISHED_ROSTER[id]?.period||4,phase=(p.rosterClock||0)*Math.PI*2/period,breath=Math.sin(phase),upper=1-smooth((y-258)/242),feet=1-smooth((y-470)/48);
 // Rigid skull translation, small rib expansion, no whole-character idle sway.
 let dx=0,dy=-breath*(id==='pudding'?2.8:3.8)*upper;
 const ribs=Math.exp(-(((y-335)/60)**2))*feet;dx+=(x-256)*ribs*breath*.006;
 const tail=(1-smooth((x-110)/65))*smooth((y-220)/60)*(1-smooth((y-420)/50));
 dx+=Math.sin(phase-.65)*tail*(id==='pudding'?2.2:4);dy+=Math.cos(phase-.65)*tail*1.5;
 // Action deformation reinforces weight transfer; it never detaches a limb or scales a skull.
 dx+=(p.reach||0)*85*upper;dy+=(p.breath||0)*-30*upper;
 return [x+dx*feet,y+dy*feet];
}
function triangle(ctx,image,src,dst){const [a,b,c]=src,[A,B,C]=dst,ux=b[0]-a[0],uy=b[1]-a[1],vx=c[0]-a[0],vy=c[1]-a[1],det=ux*vy-uy*vx,p=((B[0]-A[0])*vy-(C[0]-A[0])*uy)/det,q=((B[1]-A[1])*vy-(C[1]-A[1])*uy)/det,r=((C[0]-A[0])*ux-(B[0]-A[0])*vx)/det,s=((C[1]-A[1])*ux-(B[1]-A[1])*vx)/det;ctx.save();ctx.beginPath();dst.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](x,y));ctx.closePath();ctx.clip();ctx.transform(p,q,r,s,A[0]-p*a[0]-r*a[1],A[1]-q*a[0]-s*a[1]);ctx.drawImage(image,0,0);ctx.restore();}
export function drawFinishedRoster(ctx,id,pose,atlas,face){
 const cel=rosterCel(pose),l=layer(id,atlas,cel,face),scale=.91/480,foot=.92;
 ctx.save();ctx.translate(.5,foot+(pose.sink||0));ctx.rotate(clamp((pose.lean||0)*.22,-.10,.32));ctx.translate(-.5,-foot);ctx.globalCompositeOperation='lighter';
 const cols=8,rows=10,points=[];
 for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){const px=x/cols*512,py=y/rows*544,[dx,dy]=rosterVertex(id,px,py,pose);points.push({src:[l.rect[0]+px,l.rect[1]+py],dst:[.5+(dx-256)*scale,foot+(dy-518)*scale]});}
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x,b=a+1,c=a+cols+1,d=c+1;for(const ids of [[a,b,d],[a,d,c]])triangle(ctx,l.image,ids.map(i=>points[i].src),ids.map(i=>points[i].dst));}
 ctx.restore();
}
