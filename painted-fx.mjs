import {sampleShidun,paintShidun} from './shidun-fx.mjs?v=0.25.0';
import {VFX_ATLAS} from './vfx-atlas.mjs?v=0.25.0';
import {FX_CELLS,sampleRoute,sampleImpact,sampleGuard,sampleStatus,shieldTransition} from './vfx-motion.mjs?v=0.25.0';
import {paintHealing} from './healing-fx.mjs?v=0.25.0';
import {CAN_ATLAS,paintCan} from './can-fx.mjs?v=0.25.0';
import {getImage} from './image-cache.mjs?v=0.25.1';
export {effectEnvelope,impactStyle,shieldTransition} from './vfx-motion.mjs?v=0.25.0';
function readyImage(url){if(typeof Image==='undefined')return null;const r=getImage(url);return r.ready?r.img:null;}
function shidunAtlas(){return readyImage('./assets/vfx/shidun-impact-v0211.webp');}
function canAtlas(){return readyImage(CAN_ATLAS.url);}
function atlas(){return readyImage(VFX_ATLAS.url);}
// Same painter is used by the browser and the offline review renderer.
export function paintVFX(ctx,img,particles,canImg,shidunImg){
 for(const p of particles){
  if(paintShidun(ctx,p,shidunImg))continue;
  if(paintCan(ctx,canImg,p))continue;
  if(paintHealing(ctx,p))continue;
  const rect=VFX_ATLAS.rects[FX_CELLS[p.art]];if(!rect||!img)continue;
  const aspect=rect[2]/rect[3],width=p.width,height=p.height/aspect;
  ctx.save();ctx.globalAlpha=p.alpha;ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.scale(width<0?-1:1,1);
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
  if(layer){this.canvas=document.createElement('canvas');this.canvas.className='vfx-canvas';this.canvas.setAttribute('aria-hidden','true');this.ctx=this.canvas.getContext('2d',{alpha:true});layer.replaceChildren(this.canvas);
   this.groundCanvas=document.createElement('canvas');this.groundCanvas.className='vfx-canvas vfx-ground';this.groundCanvas.setAttribute('aria-hidden','true');this.groundCtx=this.groundCanvas.getContext('2d',{alpha:true});layer.before(this.groundCanvas);}
 }
 warm(battle){atlas();canAtlas();if(battle?.heroes.some(a=>a.catId==='pudding'))shidunAtlas();}
 clear(){
  this.routes.clear();this.bursts=[];this.guards=[];this.statuses=[];this.particles=[];
  if(this.canvas){this.layer.replaceChildren(this.canvas);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);this.groundCtx.clearRect(0,0,this.groundCanvas.width,this.groundCanvas.height);}
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
  for(const actor of this.statuses){const p=centers[actor.id];if(p)particles.push(...sampleShidun(actor,time,{x:p.x*w/100,y:p.y*h/100},sizes[actor.id]||50,w,h));}
  this.bursts=this.bursts.filter(b=>time-b.born<b.duration);
  for(const b of this.bursts)particles.push(...sampleImpact(b.style,{x:b.point.x*w/100,y:b.point.y*h/100},b.size,time-b.born,b.duration,b.seed));
  this.particles=particles.sort((a,b)=>a.layer-b.layer);
  if(!this.ctx)return this.particles;
  const dpr=Math.min(2,typeof devicePixelRatio==='number'?devicePixelRatio:1),cw=Math.max(1,Math.round(w*dpr)),ch=Math.max(1,Math.round(h*dpr));
  const img=this.particles.length?atlas():null,ready=!!img,canImg=this.particles.some(p=>CAN_ATLAS.rects[p.art])?canAtlas():null,shidunImg=this.particles.some(p=>p.art?.startsWith('shidun'))?shidunAtlas():null;
  for(const [canvas,ctx,behind] of [[this.groundCanvas,this.groundCtx,true],[this.canvas,this.ctx,false]]){
   if(canvas.width!==cw||canvas.height!==ch){canvas.width=cw;canvas.height=ch;}
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
   paintVFX(ctx,ready?img:null,this.particles.filter(p=>(p.layer===0)===behind),canImg?.complete&&canImg.naturalWidth?canImg:null,shidunImg?.complete&&shidunImg.naturalWidth?shidunImg:null);
  }
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
 render(actors,time,centers,sizes,combat){if(combat)combat.statuses=actors.filter(a=>a.hp>0&&(a.catId==='pudding'||a.burnTime>0||a.stun>0));}
}
