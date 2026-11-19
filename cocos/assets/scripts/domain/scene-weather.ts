// @ts-nocheck
// Migrated verbatim from Preview11 source 28eb867; only module specifiers changed.
import {BACKDROP_FRACTION} from './battlefield-space';
// Deterministic rain: fixed particle budget, with impacts confined to the floor.
const fract=n=>n-Math.floor(n);
const seed=n=>fract(Math.sin(n*127.1+31.7)*43758.5453);
export function rainFrame(time,width,height,unit=58){
 const ground=height*BACKDROP_FRACTION,rain=[],ripples=[];
 for(let i=0;i<38;i++){
  const duration=.65+seed(i+80)*.55,phase=fract(time/duration+seed(i+2)),endY=ground+seed(i+100)*(height-ground),x=seed(i+200)*width;
  const fall=.79;
  if(phase<fall){const p=phase/fall;rain.push({x:x+(1-p)*unit*.36,y:-unit+(endY+unit)*p,length:unit*(.12+seed(i+300)*.13),alpha:.14+seed(i+400)*.18});}
  else{const p=(phase-fall)/(1-fall);ripples.push({x,y:endY,r:unit*(.025+p*.12),alpha:(1-p)*.38});}
 }
 return {rain,ripples,ground};
}
export function paintRain(canvas,time,unit,reduced=false){
 const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
 const dpr=Math.min(1.5,globalThis.devicePixelRatio||1),pw=Math.round(w*dpr),ph=Math.round(h*dpr);
 if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}
 const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);if(reduced)return;
 const {rain,ripples,ground}=rainFrame(time,w,h,unit);ctx.lineCap='round';ctx.lineWidth=.8;
 for(const d of rain){ctx.strokeStyle=`rgba(198,222,226,${d.alpha})`;ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(d.x-2,d.y+d.length);ctx.stroke();}
 ctx.save();ctx.beginPath();ctx.rect(0,ground,w,h-ground);ctx.clip();
 for(const r of ripples){ctx.strokeStyle=`rgba(195,222,226,${r.alpha})`;ctx.beginPath();ctx.ellipse(r.x,r.y,r.r,r.r*.3,0,0,Math.PI*2);ctx.stroke();}
 ctx.restore();
}
