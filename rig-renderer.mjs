import {CUTOUTS} from './cutout-data.mjs?v=0.14.1';
import {rigFor} from './rig-motion.mjs?v=0.14.1';
const PAD_X=.22,PAD_TOP=.20,PAD_BOTTOM=.18,images=new Map(),instances=new WeakMap();
// Four rigid painted layers per partner; no per-triangle clipping or whole-image bending.
export const PART_LAYOUT={
 orange:{hand:[.44,.57,.46,.10,.40],tail:[.08,.53,.29,.34]},
 ink:{hand:[.44,.56,.58,.08,.50],tail:[.02,.45,.50,.40]},
 milk:{hand:[.44,.57,.34,.11,.76],tail:[.06,.45,.28,.39]},
 spark:{hand:[.46,.58,.43,.10,.84],tail:[.03,.43,.47,.28]},
 mint:{hand:[.46,.57,.69,.10,.57],tail:[.02,.46,.45,.39]},
 bolt:{hand:[.45,.57,.58,.08,.54],tail:[.06,.57,.27,.30]},
 pudding:{hand:[.44,.57,.48,.08,.38],tail:[.03,.45,.44,.39]},
 star:{hand:[.44,.58,.58,.10,.55],tail:[.03,.48,.44,.40]}
};
function getImage(url){let r=images.get(url);if(!r){const img=new Image();r={img,ready:false};img.onload=()=>r.ready=true;img.src=url;images.set(url,r);}return r;}
const resize=typeof ResizeObserver==='function'?new ResizeObserver(entries=>{for(const e of entries){const v=instances.get(e.target);if(v){v.width=e.contentRect.width;v.height=e.contentRect.height;}}}):null;
const visibility=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{for(const e of entries){const v=instances.get(e.target);if(v)v.visible=e.isIntersecting;}},{rootMargin:'30px'}):null;
if(typeof MutationObserver==='function'&&typeof document!=='undefined')new MutationObserver(records=>{
 for(const record of records)for(const node of record.removedNodes){if(node.nodeType!==1||node.isConnected)continue;
  const sprites=node.matches('.painted-sprite')?[node,...node.querySelectorAll('.painted-sprite')]:node.querySelectorAll('.painted-sprite');
  for(const el of sprites){resize?.unobserve(el);visibility?.unobserve(el);instances.delete(el);}
 }
}).observe(document,{childList:true,subtree:true});
const partRect=(box,cx,bottom,height)=>{const width=height*box[2]/box[3];return [cx-width/2,bottom-height,width,height];};
function piece(ctx,img,src,rect,pivot,angle,dx=0,dy=0){ctx.save();ctx.translate(pivot[0]+dx,pivot[1]+dy);ctx.rotate(angle);ctx.translate(-pivot[0],-pivot[1]);ctx.drawImage(img,...src,...rect);ctx.restore();}
export function renderPuppetFrame(ctx,id,pose,atlas,width,height,enemySource=null){
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);
 const sx=width/(1+PAD_X*2),sy=height/(1+PAD_TOP+PAD_BOTTOM),foot=rigFor(id).foot;
 ctx.setTransform(sx,0,0,sy,PAD_X*sx,PAD_TOP*sy);ctx.globalAlpha=pose.alpha;
 ctx.translate(.5,foot+pose.sink);ctx.rotate(pose.lean*.45);ctx.scale(1-pose.breath*.28,1+pose.breath*.55);ctx.translate(-.5,-foot);
 const kit=CUTOUTS[id];
 if(kit){const parts=kit.parts,layout=PART_LAYOUT[id],tail=layout.tail,hand=layout.hand;
  piece(ctx,atlas,parts.tail,tail,[.29,.67],pose.tail);
  piece(ctx,atlas,parts.body,partRect(parts.body,.49,foot,.50),[.5,foot],0);
  piece(ctx,atlas,parts.head,partRect(parts.head,.49,.555,.44),[.49,.49],pose.head,0,-pose.breath*.03);
  const hw=hand[2]*parts.hand[2]/parts.hand[3],rect=[hand[0]-hw*hand[3],hand[1]-hand[2]*hand[4],hw,hand[2]];
  piece(ctx,atlas,parts.hand,rect,[hand[0],hand[1]],pose.hand,pose.reach,0);
 }else if(enemySource){ctx.translate(.5,foot);ctx.rotate(pose.head*.35);ctx.scale(1+pose.reach*.4,1-pose.breath*.25);ctx.translate(-.5,-foot);ctx.drawImage(atlas,...enemySource,0,0,1,1);}
 ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;
}
export function drawRig(el,id,pose){
 const kit=CUTOUTS[id],source=getImage(kit?.atlas||el.dataset.atlas);if(!source.ready)return false;
 let v=instances.get(el);if(!v){const canvas=el.querySelector('.rig-canvas'),ctx=canvas?.getContext('2d',{alpha:true});if(!ctx)return false;v={canvas,ctx,width:el.clientWidth,height:el.clientHeight,visible:true,last:''};instances.set(el,v);resize?.observe(el);visibility?.observe(el);ctx.imageSmoothingEnabled=true;}
 if(!v.visible)return el.classList.contains('rig-ready');
 const {canvas,ctx}=v,dpr=Math.min(2,devicePixelRatio||1),width=Math.max(1,Math.round(v.width*(1+PAD_X*2)*dpr)),height=Math.max(1,Math.round(v.height*(1+PAD_TOP+PAD_BOTTOM)*dpr));
 if(width<3||height<3)return false;
 const signature=[width,height,...Object.values(pose)].join(',');if(v.last===signature)return true;v.last=signature;
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
 const img=source.img,rows=+el.dataset.rows,row=+el.dataset.row,enemySource=kit?null:[0,row*img.height/rows,img.width/4,img.height/rows];
 renderPuppetFrame(ctx,id,pose,img,width,height,enemySource);
 el.dataset.renderer=kit?'painted-puppet':'painted-object';if(!el.classList.contains('rig-ready'))el.classList.add('rig-ready');return true;
}
