import {VFX_ATLAS,FX_FORWARD_X} from './vfx-atlas.mjs?v=0.17.1';
import {FX_CELLS,sampleRoute,sampleImpact,sampleGuard,sampleStatus,shieldTransition} from './vfx-motion.mjs?v=0.17.1';
export {effectEnvelope,impactStyle,shieldTransition} from './vfx-motion.mjs?v=0.17.1';
let image;
function atlas(){if(!image&&typeof Image!=='undefined'){image=new Image();image.src=VFX_ATLAS.url;}return image;}
// Same painter is used by the browser and the offline review renderer.
export function paintVFX(ctx,img,particles){
 for(const p of particles){
  const rect=VFX_ATLAS.rects[FX_CELLS[p.art]];if(!rect)continue;
  const aspect=rect[2]/rect[3],width=p.width,height=p.height/aspect;
  ctx.save();ctx.globalAlpha=p.alpha;ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.scale((width<0?-1:1)*(FX_FORWARD_X[p.art]||1),1);
  const dw=Math.abs(width),dh=height;
  if(p.reveal!==undefined){ctx.beginPath();ctx.rect(-dw/2,-dh/2,dw*p.reveal,dh);ctx.clip();}
  if(p.deform){
   // Texture strips deform the flame/ribbon silhouette continuously; its root stays attached.
   const [x,y,w,h]=rect,{axis,phase,amplitude}=p.deform,bands=12;
   for(let i=0;i<bands;i++){
    const u=i/bands,v=(i+.5)/bands,falloff=(1-v)**1.5,wave=(Math.sin(v*8-phase)+Math.sin(v*17-phase*1.3)*.25)*falloff*amplitude;
    if(axis==='y')ctx.drawImage(img,x,y+u*h,w,h/bands,-dw/2+wave*dw,-dh/2+u*dh,dw,dh/bands+.35);
    else ctx.drawImage(img,x+u*w,y,w/bands,h,-dw/2+u*dw,-dh/2+wave*dh,dw/bands+.35,dh);
   }
  }else ctx.drawImage(img,...rect,-dw/2,-dh/2,dw,dh);
  ctx.restore();
 }
}
export class CombatEffects{
 constructor(layer){
  this.layer=layer;this.routes=new Map();this.bursts=[];this.guards=[];this.statuses=[];this.particles=[];
  if(layer){this.canvas=document.createElement('canvas');this.canvas.className='vfx-canvas';this.canvas.setAttribute('aria-hidden','true');this.ctx=this.canvas.getContext('2d',{alpha:true});layer.replaceChildren(this.canvas);atlas();}
 }
 clear(){
  this.routes.clear();this.bursts=[];this.guards=[];this.statuses=[];this.particles=[];
  if(this.canvas){this.layer.replaceChildren(this.canvas);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
 }
 emit(style,point,time,size=52,duration=.65){
  this.bursts.push({style,point:{...point},born:time,size,duration,seed:this.bursts.length*31+Math.round(time*100)});
  if(this.bursts.length>24)this.bursts.shift();
 }
 render(routes,time,w,h,centers={},sizes={}){
  const active=new Set(routes.map(r=>r.id));
  for(const r of routes)this.routes.set(r.id,r);
  const particles=[];
  for(const [id,r] of this.routes){
   // Cancellation removes unfinished attacks; completed impacts finish their own envelope.
   if(time>=r.until||(!active.has(id)&&r.phase!=='impact')){this.routes.delete(id);continue;}
   particles.push(...sampleRoute(r,time,w,h,centers,sizes));
  }
  for(const {entry,actor} of this.guards){const p=centers[actor.id];if(p)particles.push(...sampleGuard(entry,actor,time,{x:p.x*w/100,y:p.y*h/100},sizes[actor.id]||50));}
  for(const actor of this.statuses){const p=centers[actor.id];if(p)particles.push(...sampleStatus(actor,time,{x:p.x*w/100,y:p.y*h/100},sizes[actor.id]||50));}
  this.bursts=this.bursts.filter(b=>time-b.born<b.duration);
  for(const b of this.bursts)particles.push(...sampleImpact(b.style,{x:b.point.x*w/100,y:b.point.y*h/100},b.size,time-b.born,b.duration,b.seed));
  this.particles=particles.sort((a,b)=>a.layer-b.layer);
  if(!this.ctx)return this.particles;
  const dpr=Math.min(2,typeof devicePixelRatio==='number'?devicePixelRatio:1),cw=Math.max(1,Math.round(w*dpr)),ch=Math.max(1,Math.round(h*dpr));
  if(this.canvas.width!==cw||this.canvas.height!==ch){this.canvas.width=cw;this.canvas.height=ch;}
  this.ctx.setTransform(dpr,0,0,dpr,0,0);this.ctx.clearRect(0,0,w,h);
  const img=atlas();if(img?.complete&&img.naturalWidth)paintVFX(this.ctx,img,this.particles);
  this.canvas.dataset.particles=String(this.particles.length);
  this.canvas.dataset.ready=String(!!img?.naturalWidth);
  return this.particles;
 }
}
export class GuardEffects{
 constructor(){this.entries=new Map();}
 clear(){this.entries.clear();}
 render(actors,time,centers,sizes,combat){
  combat.guards=[];
  for(const actor of actors){
   let e=this.entries.get(actor.id);if(!e){e={value:0,at:time,hit:-99};this.entries.set(actor.id,e);}
   const value=actor.hp>0?actor.shield:0,change=shieldTransition(e.value,value);
   if(change==='raise')e.at=time;
   if(change==='block'||change==='break'){
    e.hit=time;const p=centers[actor.id];if(p&&change==='break')combat.emit('break',p,time,sizes[actor.id]||50,.65);
   }
   e.value=value;if(value>0)combat.guards.push({entry:e,actor});
  }
 }
}
export class StatusEffects{
 clear(){}
 render(actors,time,centers,sizes,combat){if(combat)combat.statuses=actors.filter(a=>a.hp>0&&(a.burnTime>0||a.stun>0));}
}
