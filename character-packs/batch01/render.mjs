import {BASES,CHARACTERS} from './characters.mjs';
import {clamp,ease} from './motion.mjs';
import {paintFullBody,fullBodyMuzzle} from './sprite-motion.mjs';
const place=(src,h,anchor,socket)=>({x:socket[0]-h*src[2]/src[3]*anchor[0],y:socket[1]-h*anchor[1],w:h*src[2]/src[3],h,pivot:socket});
export function localPoint(p,uv,angle=0){const x=p.x+p.w*uv[0]-p.pivot[0],y=p.y+p.h*uv[1]-p.pivot[1];return[p.pivot[0]+x*Math.cos(angle)-y*Math.sin(angle),p.pivot[1]+x*Math.sin(angle)+y*Math.cos(angle)];}
function drawPart(ctx,img,src,p,angle=0){ctx.save();ctx.translate(...p.pivot);ctx.rotate(angle);ctx.translate(-p.pivot[0],-p.pivot[1]);ctx.drawImage(img,...src,p.x,p.y,p.w,p.h);ctx.restore();}
export function actorLayout(art,c,pose={}){
 const l={...BASES[c.base],...(c.head?{head:c.head}:{}),...(c.chin?{chin:c.chin}:{}),...(c.body?{body:c.body}:{})};
 const body=place(art.parts.body,l.body,[.5,1],[.5,1]);
 const point=uv=>[body.x+body.w*uv[0],body.y+body.h*uv[1]];
 if(art.bodyRig){l.near=point(art.bodyRig.near);l.far=point(art.bodyRig.far);l.neck=point(art.bodyRig.neck);l.chin=l.neck[1]+.025;}
 l.near=[l.near[0]+(pose.shoulderShift||0),l.near[1]];
 return {...l,bodyPlacement:body};
}
export function drawActor(ctx,atlas,images,id,pose,x,y,size,options={}){
 const art=atlas.characters[id],c=CHARACTERS[id];
 if(art.fullBody)return paintFullBody(ctx,images[art.fullBody.atlas],art,pose,x,y,size,options);
 const l=actorLayout(art,c,pose),source=(group,key)=>images[art[group+'Atlases']?.[key]||art.atlas];
 const nearSocket=l.near,p=art.parts,near=place(p.nearRightArm,c.near.h*(pose.armScale||1),c.near.anchor,nearSocket),far=place(p.farLeftArm,c.far.h,c.far.anchor,l.far);
 const np=pose.near||0,fp=pose.far||0;
 ctx.save();ctx.translate(x-size*.5,y-size);ctx.scale(size,size);ctx.translate(.5,1);ctx.rotate(pose.lean||0);ctx.scale(1-(pose.breath||0)*.2,1+(pose.breath||0));ctx.translate(-.5,-1+(pose.bob||0));
 const tail=place(p.tail,l.tail,[.88,.80],[.30,.87]);drawPart(ctx,source('part','tail'),p.tail,tail,pose.tail||0);
 const paintFar=()=>drawPart(ctx,source('part','farLeftArm'),p.farLeftArm,far,fp);
 if(!c.shield)paintFar();
 const body=l.bodyPlacement,bi=source('part','body');
 if(Math.abs(pose.run||0)>.001){
  // Separate foot lift below the hem; upper body and both feet have their own motion.
  const split=.83;ctx.drawImage(bi,p.body[0],p.body[1],p.body[2],p.body[3]*split,body.x,body.y,body.w,body.h*split);
  for(let i=0;i<2;i++){const lift=Math.max(0,(i?1:-1)*pose.run)*.025;ctx.drawImage(bi,p.body[0]+i*p.body[2]/2,p.body[1]+p.body[3]*(split-.015),p.body[2]/2,p.body[3]*(1-split+.015),body.x+i*body.w/2,body.y+body.h*(split-.015)-lift,body.w/2,body.h*(1-split+.015));}
 }else drawPart(ctx,bi,p.body,body);
 if(c.shield)paintFar();
 const paintNear=()=>{
  if(!c.lantern){drawPart(ctx,source('part','nearRightArm'),p.nearRightArm,near,np);return;}
  // The ring is a real suspension point. Rotate the arm, let the lamp hang independently.
  const cut=.60,src=p.nearRightArm,img=source('part','nearRightArm');
  drawPart(ctx,img,[src[0],src[1],src[2],src[3]*cut],{...near,h:near.h*cut},np);
  const grip=localPoint(near,[.61,cut],np),h=near.h*(1-cut),w=near.w;
  drawPart(ctx,img,[src[0],src[1]+src[3]*cut,src[2],src[3]*(1-cut)],{x:grip[0]-w*.61,y:grip[1],w,h,pivot:grip},-.10*np);
 };
 if(!c.bow&&!pose.punch)paintNear();
 const face=art.faces[pose.face]?pose.face:'neutral',src=art.faces[face],head=place(src,l.head*src[3]/src[2],[.5,1],[l.neck?.[0]??.51,l.chin]);
 drawPart(ctx,source('face',face),src,head,pose.head||0);
 if(pose.punch)paintNear();
 if(c.bow){
  const top=localPoint(far,[.79,.025],fp),bottom=localPoint(far,[.72,.97],fp),grip=localPoint(near,[.76,.85],np),mid=[(top[0]+bottom[0])/2,(top[1]+bottom[1])/2];
  const pull=clamp(-np/1.15),nock=[mid[0]+(grip[0]-mid[0])*pull,mid[1]+(grip[1]-mid[1])*pull];
  ctx.strokeStyle='#76584a';ctx.lineWidth=.004;ctx.beginPath();ctx.moveTo(...top);ctx.lineTo(...nock);ctx.lineTo(...bottom);ctx.stroke();
  if(pull>.2){ctx.strokeStyle='#dfc99b';ctx.lineWidth=.008;ctx.beginPath();ctx.moveTo(...nock);ctx.lineTo(mid[0]+.04,mid[1]);ctx.stroke();}paintNear();
 }
 if(id==='pudding'&&(options.charge||0)>0){
  const q=options.charge;ctx.save();ctx.globalAlpha=.75;ctx.fillStyle='#ffd779';for(let i=0;i<3;i++)if(q>i/3){ctx.beginPath();ctx.ellipse(.53,.65+i*.06,.008,.019,-.1,0,Math.PI*2);ctx.fill();}ctx.restore();
 }
 if(options.debug){ctx.fillStyle='#e36b8b';for(const s of [l.near,l.far]){ctx.beginPath();ctx.arc(...s,.012,0,Math.PI*2);ctx.fill();}}
 ctx.restore();
 return muzzleFor(atlas,id,pose,x,y,size);
}
export function muzzleFor(atlas,id,pose,x,y,size){const art=atlas.characters[id];if(art.fullBody)return fullBodyMuzzle(art.fullBody,pose,x,y,size);const c=CHARACTERS[id],l=actorLayout(art,c,pose),key=c.weapon,config=key==='nearRightArm'?c.near:c.far,socket=key==='nearRightArm'?l.near:l.far,p=place(art.parts[key],config.h*(key==='nearRightArm'?(pose.armScale||1):1),config.anchor,socket),angle=key==='nearRightArm'?(pose.near||0):(pose.far||0),uv=c.bow?[.78,.5]:id==='mint'?[.93,.09]:c.lantern?[.61,.75]:[.82,.7],m=localPoint(p,uv,angle),dx=(m[0]-.5)*(1-(pose.breath||0)*.2),dy=(m[1]-1+(pose.bob||0))*(1+(pose.breath||0)),a=pose.lean||0;return{x:x+size*(dx*Math.cos(a)-dy*Math.sin(a)),y:y+size*(dx*Math.sin(a)+dy*Math.cos(a))};}
export function fxStamp(ctx,art,images,key,x,y,w,angle=0,alpha=1,stretch=1){const src=art.fx[key];if(alpha<=0||w<=0)return;ctx.save();ctx.globalAlpha*=clamp(alpha);ctx.translate(x,y);ctx.rotate(angle);ctx.drawImage(images[art.atlas],...src,-w/2,-w*src[3]/src[2]*stretch/2,w,w*src[3]/src[2]*stretch);ctx.restore();}
export function paintTrail(ctx,points,color,width,alpha=1){if(points.length<2)return;ctx.save();ctx.strokeStyle=color;ctx.lineCap='round';for(let i=1;i<points.length;i++){ctx.globalAlpha=alpha*i/points.length;ctx.lineWidth=width*(i/points.length)**.7;ctx.beginPath();ctx.moveTo(...points[i-1]);ctx.lineTo(...points[i]);ctx.stroke();}ctx.restore();}
export function paintTextureFlame(ctx,art,images,key,x,y,w,h,time,alpha=1){const src=art.fx[key],strips=14;ctx.save();ctx.globalAlpha*=clamp(alpha);for(let i=0;i<strips;i++){const q=i/strips,shift=Math.sin(time*13+q*5)*w*.055*(1-q);ctx.drawImage(images[art.atlas],src[0],src[1]+src[3]*q,src[2],src[3]/strips+.4,x-w/2+shift,y-h+h*q,w,h/strips+1);}ctx.restore();}
