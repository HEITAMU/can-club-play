import {preparePoint,deformPoint} from './rig-motion.mjs?v=0.13.0';
const DIV=14,PAD_X=.12,PAD_TOP=.10,PAD_BOTTOM=.06,images=new Map(),meshes=new Map(),instances=new WeakMap();
function getImage(url){let record=images.get(url);if(!record){const img=new Image();record={img,ready:false};img.onload=()=>record.ready=true;img.src=url;images.set(url,record);}return record;}
function getMesh(id,div=DIV){const key=id+':'+div;let m=meshes.get(key);if(m)return m;const points=[],indices=[];
 for(let y=0;y<=div;y++)for(let x=0;x<=div;x++)points.push(preparePoint(id,x/div,y/div));
 for(let y=0;y<div;y++)for(let x=0;x<div;x++){const a=y*(div+1)+x,b=a+1,c=a+div+1,d=c+1;indices.push(a,c,b,b,c,d);}
 m={points,indices:new Uint16Array(indices),vertices:new Float32Array(points.length*4)};meshes.set(key,m);return m;
}
const resize=typeof ResizeObserver==='function'?new ResizeObserver(entries=>{for(const e of entries){const v=instances.get(e.target);if(v){v.width=e.contentRect.width;v.height=e.contentRect.height;}}}):null;
const visibility=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{for(const e of entries){const v=instances.get(e.target);if(v)v.visible=e.isIntersecting;}},{rootMargin:'80px'}):null;
// Battles and partner panels replace their DOM. Release observer references to retired sprites.
if(typeof MutationObserver==='function'&&typeof document!=='undefined')new MutationObserver(records=>{
 for(const record of records)for(const node of record.removedNodes){
  if(node.nodeType!==1||node.isConnected)continue;
  const sprites=node.matches('.painted-sprite')?[node,...node.querySelectorAll('.painted-sprite')]:node.querySelectorAll('.painted-sprite');
  for(const el of sprites){resize?.unobserve(el);visibility?.unobserve(el);instances.delete(el);}
 }
}).observe(document,{childList:true,subtree:true});
function drawTriangles(ctx,mesh,img,width,height,alpha){
 const cw=img.width,ch=img.height,points=mesh.points,vertices=mesh.vertices;
 ctx.clearRect(0,0,width,height);ctx.globalAlpha=alpha;
 for(let i=0;i<mesh.indices.length;i+=3){
  const a=mesh.indices[i],b=mesh.indices[i+1],c=mesh.indices[i+2],pa=points[a],pb=points[b],pc=points[c];
  const sx0=pa.x*cw,sy0=pa.y*ch,sx1=pb.x*cw,sy1=pb.y*ch,sx2=pc.x*cw,sy2=pc.y*ch;
  const x0=(vertices[a*4]+1)*width/2,y0=(1-vertices[a*4+1])*height/2,x1=(vertices[b*4]+1)*width/2,y1=(1-vertices[b*4+1])*height/2,x2=(vertices[c*4]+1)*width/2,y2=(1-vertices[c*4+1])*height/2;
  const d=(sx1-sx0)*(sy2-sy0)-(sx2-sx0)*(sy1-sy0),aa=((x1-x0)*(sy2-sy0)-(x2-x0)*(sy1-sy0))/d,bb=((y1-y0)*(sy2-sy0)-(y2-y0)*(sy1-sy0))/d,cc=((x2-x0)*(sx1-sx0)-(x1-x0)*(sx2-sx0))/d,dd=((y2-y0)*(sx1-sx0)-(y1-y0)*(sx2-sx0))/d;
  ctx.save();ctx.beginPath();const cx=(x0+x1+x2)/3,cy=(y0+y1+y2)/3;
  for(const [j,x,y] of [[0,x0,y0],[1,x1,y1],[2,x2,y2]]){const dist=Math.max(1,Math.hypot(x-cx,y-cy)),xx=x+(x-cx)*.35/dist,yy=y+(y-cy)*.35/dist;if(j===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}
  ctx.closePath();ctx.clip();ctx.setTransform(aa,bb,cc,dd,x0-aa*sx0-cc*sy0,y0-bb*sx0-dd*sy0);ctx.drawImage(img,0,0);ctx.restore();
 }
 ctx.globalAlpha=1;
}
export function renderRigFrame(ctx,id,pose,crop,width,height,div=8){
 const mesh=getMesh(id,div);
 for(let i=0;i<mesh.points.length;i++){const p=deformPoint(id,mesh.points[i],pose),o=i*4;mesh.vertices[o]=(p.x+PAD_X)/(1+PAD_X*2)*2-1;mesh.vertices[o+1]=1-(p.y+PAD_TOP)/(1+PAD_TOP+PAD_BOTTOM)*2;}
 drawTriangles(ctx,mesh,crop,width,height,pose.alpha);
}
export function drawRig(el,id,pose){
 const source=getImage(el.dataset.atlas);if(!source.ready)return false;
 let instance=instances.get(el);if(!instance){const canvas=el.querySelector('.rig-canvas'),ctx=canvas?.getContext('2d',{alpha:true});if(!ctx)return false;instance={canvas,ctx,width:el.clientWidth,height:el.clientHeight,visible:true};instances.set(el,instance);resize?.observe(el);visibility?.observe(el);}
 if(!instance.visible)return el.classList.contains('rig-ready');
 const {canvas,ctx}=instance,dpr=Math.min(2,devicePixelRatio||1),width=Math.max(1,Math.round(instance.width*(1+PAD_X*2)*dpr)),height=Math.max(1,Math.round(instance.height*(1+PAD_TOP+PAD_BOTTOM)*dpr));
 if(width<3||height<3)return false;
 if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
 const desired=Math.max(48,Math.ceil(instance.width*dpr));
 if(!instance.crop||desired>instance.crop.width*1.15){const crop=document.createElement('canvas'),img=source.img,rows=+el.dataset.rows,row=+el.dataset.row;crop.width=desired;crop.height=Math.max(48,Math.ceil(instance.height*dpr));crop.getContext('2d').drawImage(img,0,row*img.height/rows,img.width/4,img.height/rows,0,0,crop.width,crop.height);instance.crop=crop;}
 renderRigFrame(ctx,id,pose,instance.crop,width,height,instance.width>100?8:6);el.dataset.renderer='continuous-2d';el.classList.add('rig-ready');return true;
}
