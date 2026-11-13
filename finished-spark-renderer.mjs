import {FINISHED_SPARK as ART} from './finished-spark-data.mjs?v=0.21.12';

// Every action drawing is one complete character. A limb is never separately
// mirrored, stretched, crossfaded, or taken from a different character.
let canvasFactory;
export function setFinishedCanvasFactory(factory){canvasFactory=factory;}
function canvas(w,h){
 const c=canvasFactory?canvasFactory(w,h):typeof OffscreenCanvas==='function'?new OffscreenCanvas(w,h):typeof document!=='undefined'?document.createElement('canvas'):null;
 if(c){c.width=w;c.height=h;}return c;
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const cache=new WeakMap();
export function sparkCel(pose){const k=clamp(Math.round(pose.sparkCel||0),0,5);return pose.sparkRecovery>.1?[0,8,8,7,6,5][k]:k;}
export function sparkFace(face,cel){
 const key=face?.to||'neutral';
 if(key==='down')return 'blink';
 if(key==='hurt'||key==='blink'||key==='victory')return key;
 if((key==='attack'||key==='skill')&&cel<4)return 'attack';
 return 'neutral';
}
function facialLayer(atlas,index,key){
 const sourceScale=(atlas.width||ART.width)/ART.width,rect=ART.frames[index].rect.map(v=>v*sourceScale);
 let entries=cache.get(atlas);if(!entries){entries=new Map();cache.set(atlas,entries);}
 const id=index+':'+key;if(entries.has(id))return entries.get(id);
 // Cache the selected cel even for the neutral face. The mesh then samples a
 // small, consistently scaled surface instead of the full 2048px atlas.
 const surface=canvas(512,544);if(!surface)return {image:atlas,rect,scale:sourceScale};
 const ctx=surface.getContext('2d');ctx.drawImage(atlas,...rect,0,0,512,544);
 if(key!=='neutral'){
 const patch=canvas(320,256),mask=canvas(320,256);
 if(!patch||!mask)return {image:atlas,rect,scale:sourceScale};
 const p=patch.getContext('2d'),m=mask.getContext('2d');
 p.drawImage(atlas,...ART.faces[key].map(v=>v*sourceScale),0,0,320,256);
 // Feather only eyes, brows, and muzzle. Skull, ears, neck and body pixels are
 // the original finished drawing, so a blink cannot resize the head or torso.
 for(const [x,y,rx,ry] of [[.55,.58,.30,.26],[.83,.57,.13,.23],[.75,.72,.23,.18]]){
  m.save();m.translate(x*320,y*256);m.scale(rx*320,ry*256);
  const gradient=m.createRadialGradient(0,0,.72,0,0,1);gradient.addColorStop(0,'#fff');gradient.addColorStop(1,'#ffffff00');m.fillStyle=gradient;m.fillRect(-1,-1,2,2);m.restore();
 }
 p.globalCompositeOperation='destination-in';p.drawImage(mask,0,0);
 ctx.globalCompositeOperation='source-atop';ctx.drawImage(patch,...ART.frames[index].head);ctx.globalCompositeOperation='source-over';
 }
 const result={image:surface,rect:[0,0,512,544]};entries.set(id,result);
 // Keep memory bounded when the roster, portrait and combat use the same cat.
 if(entries.size>4)entries.delete(entries.keys().next().value);return result;
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
function triangle(ctx,image,src,dst){
 const [a,b,c]=src,[A,B,C]=dst,ux=b[0]-a[0],uy=b[1]-a[1],vx=c[0]-a[0],vy=c[1]-a[1],det=ux*vy-uy*vx;
 const p=((B[0]-A[0])*vy-(C[0]-A[0])*uy)/det,q=((B[1]-A[1])*vy-(C[1]-A[1])*uy)/det;
 const r=((C[0]-A[0])*ux-(B[0]-A[0])*vx)/det,s=((C[1]-A[1])*ux-(B[1]-A[1])*vx)/det;
 ctx.save();ctx.beginPath();dst.forEach(([x,y],i)=>ctx[i?'lineTo':'moveTo'](x,y));ctx.closePath();ctx.clip();
 ctx.transform(p,q,r,s,A[0]-p*a[0]-r*a[1],A[1]-q*a[0]-s*a[1]);ctx.drawImage(image,0,0);ctx.restore();
}
export function drawFinishedSpark(ctx,pose,atlas,face){
 const index=sparkCel(pose),layer=facialLayer(atlas,index,sparkFace(face,index));
 const [sx,sy]=layer.rect,scale=.91/480,foot=.92;
 ctx.save();ctx.translate(.5,foot+pose.sink);ctx.rotate(clamp(pose.lean*.22,-.10,.32));ctx.translate(-.5,-foot);
 // renderPuppetFrame clears this transparent canvas before drawing. Adjacent
 // antialiased triangles contribute complementary coverage; adding that
 // coverage avoids the translucent grid produced by source-over clipping.
 ctx.globalCompositeOperation='lighter';
 // Place mesh rows at anatomical boundaries; keep the skull rigid and feet planted.
 const xs=[0,110,256,512],ys=[0,258,335,420,470,518,544],cols=xs.length-1,rows=ys.length-1,points=[];
 for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
  const px=xs[x],py=ys[y],[dx,dy]=sparkVertex(px,py,pose);
  points.push({src:[sx+px*(layer.scale||1),sy+py*(layer.scale||1)],dst:[.5+(dx-256)*scale,foot+(dy-518)*scale]});
 }
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
  const a=y*(cols+1)+x,b=a+1,c=a+cols+1,d=c+1;
  for(const ids of [[a,b,d],[a,d,c]])triangle(ctx,layer.image,ids.map(i=>points[i].src),ids.map(i=>points[i].dst));
 }
 ctx.restore();
}
