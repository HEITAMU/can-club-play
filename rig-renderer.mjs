import {ANATOMY} from './anatomy-data.mjs?v=0.17.0';
import {drawAnatomy} from './anatomy-renderer.mjs?v=0.17.0';
import {rigFor} from './rig-motion.mjs?v=0.17.0';
const PAD_X=.22,PAD_TOP=.20,PAD_BOTTOM=.18,images=new Map(),instances=new WeakMap();
// The torso has no painted forearms. Left and right arms have separate shoulder sockets.
function getImage(url){let r=images.get(url);if(!r){const img=new Image();r={img,ready:false};img.onload=()=>r.ready=true;img.src=url;images.set(url,r);}return r;}
const resize=typeof ResizeObserver==='function'?new ResizeObserver(entries=>{for(const e of entries){const v=instances.get(e.target);if(v){v.width=e.contentRect.width;v.height=e.contentRect.height;}}}):null;
const visibility=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{for(const e of entries){const v=instances.get(e.target);if(v)v.visible=e.isIntersecting;}},{rootMargin:'30px'}):null;
if(typeof MutationObserver==='function'&&typeof document!=='undefined')new MutationObserver(records=>{
 for(const record of records)for(const node of record.removedNodes){if(node.nodeType!==1||node.isConnected)continue;
  const sprites=node.matches('.painted-sprite')?[node,...node.querySelectorAll('.painted-sprite')]:node.querySelectorAll('.painted-sprite');
  for(const el of sprites){resize?.unobserve(el);visibility?.unobserve(el);instances.delete(el);}
 }
}).observe(document,{childList:true,subtree:true});
export function renderPuppetFrame(ctx,id,pose,atlas,width,height,enemySource=null,face){
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);
 const sx=width/(1+PAD_X*2),sy=height/(1+PAD_TOP+PAD_BOTTOM),foot=rigFor(id).foot;
 ctx.setTransform(sx,0,0,sy,PAD_X*sx,PAD_TOP*sy);ctx.globalAlpha=pose.alpha;
 ctx.translate(.5,foot+pose.sink);ctx.rotate(pose.lean*.45);ctx.scale(1-pose.breath*.28,1+pose.breath*.55);ctx.translate(-.5,-foot);
 if(ANATOMY[id])drawAnatomy(ctx,id,pose,atlas,face);
 else if(enemySource){ctx.translate(.5,foot);ctx.rotate(pose.head*.35);ctx.scale(1+pose.reach*.4,1-pose.breath*.25);ctx.translate(-.5,-foot);ctx.drawImage(atlas,...enemySource,0,0,1,1);}
 ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
}
export function drawRig(el,id,pose,face){
 const kit=ANATOMY[id],source=getImage(kit?.atlas||el.dataset.atlas);if(!source.ready)return false;
 let v=instances.get(el);if(!v){const canvas=el.querySelector('.rig-canvas'),ctx=canvas?.getContext('2d',{alpha:true});if(!ctx)return false;v={canvas,ctx,width:el.clientWidth,height:el.clientHeight,visible:true,last:''};instances.set(el,v);resize?.observe(el);visibility?.observe(el);ctx.imageSmoothingEnabled=true;}
 if(!v.visible)return el.classList.contains('rig-ready');
 const {canvas,ctx}=v,dpr=Math.min(2,devicePixelRatio||1),width=Math.max(1,Math.round(v.width*(1+PAD_X*2)*dpr)),height=Math.max(1,Math.round(v.height*(1+PAD_TOP+PAD_BOTTOM)*dpr));
 if(width<3||height<3)return false;
 const signature=[width,height,...Object.values(pose),face?.from,face?.to,face?.mix].join(',');if(v.last===signature)return true;v.last=signature;
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
 const img=source.img,rows=+el.dataset.rows,row=+el.dataset.row,enemySource=kit?null:[0,row*img.height/rows,img.width/4,img.height/rows];
 renderPuppetFrame(ctx,id,pose,img,width,height,enemySource,face);
 el.dataset.renderer=kit?'painted-anatomy':'painted-object';if(!el.classList.contains('rig-ready'))el.classList.add('rig-ready');return true;
}
