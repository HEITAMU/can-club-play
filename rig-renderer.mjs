import {FINISHED_ROSTER} from './finished-roster-data.mjs?v=0.25.0';
import {drawFinishedRoster} from './finished-roster-renderer.mjs?v=0.25.0';
import {FINISHED_SPARK} from './finished-spark-data.mjs?v=0.25.0';
import {drawFinishedSpark} from './finished-spark-renderer.mjs?v=0.25.0';
import {ANATOMY} from './anatomy-data.mjs?v=0.25.0';
import {drawAnatomy} from './anatomy-renderer.mjs?v=0.25.0';
import {rigFor} from './rig-motion.mjs?v=0.25.0';
import {getImage} from './image-cache.mjs?v=0.25.1';
import {webAsset} from './web-assets.mjs?v=0.25.1';
const PAD_X=.22,PAD_TOP=.20,PAD_BOTTOM=.18,instances=new WeakMap();
// The torso has no painted forearms. Left and right arms have separate shoulder sockets.
const resize=typeof ResizeObserver==='function'?new ResizeObserver(entries=>{for(const e of entries){const v=instances.get(e.target);if(v&&e.contentRect.width>0&&e.contentRect.height>0){v.width=e.contentRect.width;v.height=e.contentRect.height;}}}):null;
const visibility=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{for(const e of entries){const v=instances.get(e.target);if(v)v.visible=e.isIntersecting;}},{rootMargin:'30px'}):null;
if(typeof MutationObserver==='function'&&typeof document!=='undefined')new MutationObserver(records=>{
 for(const record of records)for(const node of record.removedNodes){if(node.nodeType!==1||node.isConnected)continue;
  const sprites=node.matches('.painted-sprite')?[node,...node.querySelectorAll('.painted-sprite')]:node.querySelectorAll('.painted-sprite');
  for(const el of sprites){resize?.unobserve(el);visibility?.unobserve(el);const v=instances.get(el);if(v)v.canvas.width=v.canvas.height=0;instances.delete(el);}
 }
}).observe(document,{childList:true,subtree:true});
export function renderPuppetFrame(ctx,id,pose,atlas,width,height,enemySource=null,face){
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);
 const sx=width/(1+PAD_X*2),sy=height/(1+PAD_TOP+PAD_BOTTOM),foot=rigFor(id).foot;
 ctx.setTransform(sx,0,0,sy,PAD_X*sx,PAD_TOP*sy);ctx.globalAlpha=pose.alpha;
 if(FINISHED_ROSTER[id]){drawFinishedRoster(ctx,id,pose,atlas,face);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;return;}
 if(id==='spark'){drawFinishedSpark(ctx,pose,atlas,face);ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;return;}
 ctx.translate(.5,foot+pose.sink);ctx.rotate(pose.lean*.45);ctx.scale(1-pose.breath*.28,1+pose.breath*.55);ctx.translate(-.5,-foot);
 if(ANATOMY[id])drawAnatomy(ctx,id,pose,atlas,face);
 else if(enemySource){ctx.translate(.5,foot);ctx.rotate(pose.head*.35);ctx.scale(1+pose.reach*.4,1-pose.breath*.25);ctx.translate(-.5,-foot);ctx.drawImage(atlas,...enemySource,0,0,1,1);}
 ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
}
export function drawRig(el,id,pose,face,renderSize,frameTime){
 const kit=id==='spark'?FINISHED_SPARK:FINISHED_ROSTER[id]||ANATOMY[id];
 let v=instances.get(el);if(!v){const canvas=el.querySelector('.rig-canvas'),ctx=canvas?.getContext('2d',{alpha:true});if(!ctx)return false;v={canvas,ctx,width:el.clientWidth,height:el.clientHeight,visible:true,last:'',lost:false};instances.set(el,v);resize?.observe(el);visibility?.observe(el);ctx.imageSmoothingEnabled=true;
  canvas.addEventListener('contextlost',e=>{e.preventDefault();v.lost=true;v.last='';el.classList.remove('rig-ready');});
  canvas.addEventListener('contextrestored',()=>{v.lost=false;v.last='';});
 }
 // Battle callers already stop rendering hidden pages. A rear actor must not
 // depend on delayed intersection/resize callbacks while it attacks or returns.
 const battleSize=Number.isFinite(renderSize)&&renderSize>0;
 if(v.lost){el.classList.remove('rig-ready');return false;}
 if(!v.visible&&!battleSize)return el.classList.contains('rig-ready');
 const {canvas,ctx}=v,dpr=Math.min(2,typeof devicePixelRatio==='number'?devicePixelRatio:1),width=Math.max(1,Math.round((battleSize?renderSize:v.width)*(1+PAD_X*2)*dpr)),height=Math.max(1,Math.round((battleSize?renderSize:v.height)*(1+PAD_TOP+PAD_BOTTOM)*dpr));
 if(width<3||height<3)return false;
 const source=getImage(webAsset(kit?.atlas||el.dataset.atlas),battleSize?3:1);if(!source.ready)return false;
 const cel=[pose.boltCel,pose.shidunCel,Math.round(pose.rosterCel||0),Math.round(pose.sparkCel||0),face?.to].join(':');
 // Active actions paint at 60 Hz; quiet portraits and idle actors stay at 30 Hz.
 const active=Math.abs(pose.reach||0)>.004||Math.abs(pose.hand||0)>.09||(pose.rosterCel||0)>.01||(pose.sparkCel||0)>.01||(pose.shidunCel||0)>0||(pose.boltCel??-1)>=0;
 const interval=active?1/60:1/30;
 // A new action drawing, resize, or recovered canvas still paints immediately.
 if(Number.isFinite(frameTime)&&frameTime>v.frameTime&&frameTime-v.frameTime<interval-1e-6&&v.cel===cel&&canvas.width===width&&canvas.height===height&&v.last)return true;
 const signature=[width,height,...Object.values(pose),face?.from,face?.to,face?.mix].join(',');if(v.last===signature&&canvas.width===width&&canvas.height===height)return true;
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
 const img=source.img,rows=+el.dataset.rows,row=+el.dataset.row,enemySource=kit?null:[0,row*img.height/rows,img.width/4,img.height/rows];
 renderPuppetFrame(ctx,id,pose,img,width,height,enemySource,face);
 v.last=signature;v.frameTime=frameTime;v.cel=cel;
 el.dataset.renderer=(id==='spark'||FINISHED_ROSTER[id])?'finished-full-body':kit?'painted-anatomy':'painted-object';if(!el.classList.contains('rig-ready'))el.classList.add('rig-ready');return true;
}
