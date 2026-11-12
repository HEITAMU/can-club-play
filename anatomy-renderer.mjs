import {ANATOMY} from './anatomy-data.mjs?v=0.15.0';
import {rigFor} from './rig-motion.mjs?v=0.15.0';

// Sockets are anatomical shoulders, not image-box centers. Each arm appears exactly once.
const arm=(height,anchor,socket)=>({height,anchor,socket});
export const ANATOMY_LAYOUT={
 orange:{body:.43,head:.60,chin:.55,left:arm(.44,[.08,.29],[.59,.56]),right:arm(.25,[.36,.13],[.35,.55]),tail:.32,shield:true},
 ink:{body:.45,head:.62,chin:.55,left:arm(.54,[.10,.59],[.57,.56]),right:arm(.21,[.16,.78],[.35,.57]),tail:.31,bow:true},
 milk:{body:.45,head:.60,chin:.55,left:arm(.30,[.12,.49],[.58,.56]),right:arm(.26,[.37,.12],[.35,.55]),tail:.34},
 spark:{body:.44,head:.61,chin:.55,left:arm(.36,[.12,.63],[.58,.56]),right:arm(.26,[.38,.12],[.35,.55]),tail:.28},
 mint:{body:.44,head:.62,chin:.55,left:arm(.53,[.12,.47],[.59,.56]),right:arm(.25,[.34,.17],[.35,.55]),tail:.30},
 bolt:{body:.45,head:.63,chin:.55,left:arm(.40,[.14,.51],[.59,.56]),right:arm(.26,[.35,.16],[.35,.55]),tail:.30},
 pudding:{body:.43,head:.63,chin:.55,left:arm(.46,[.06,.28],[.59,.56]),right:arm(.25,[.36,.13],[.35,.55]),tail:.33,shield:true},
 star:{body:.44,head:.66,chin:.55,left:arm(.43,[.12,.72],[.59,.56]),right:arm(.25,[.35,.15],[.35,.55]),tail:.30}
};
export function partPlacement(src,layout){
 const h=layout.height,w=h*src[2]/src[3],pivot=layout.socket;
 return {rect:[pivot[0]-w*layout.anchor[0],pivot[1]-h*layout.anchor[1],w,h],pivot};
}
export function placedPoint(placement,uv,angle){
 const {rect:[x,y,w,h],pivot:[px,py]}=placement,dx=x+w*uv[0]-px,dy=y+h*uv[1]-py,c=Math.cos(angle),s=Math.sin(angle);
 return [px+dx*c-dy*s,py+dx*s+dy*c];
}
function piece(ctx,img,src,placement,angle=0){
 const {rect,pivot}=placement;ctx.save();ctx.translate(...pivot);ctx.rotate(angle);ctx.translate(-pivot[0],-pivot[1]);ctx.drawImage(img,...src,...rect);ctx.restore();
}
const at=(src,cx,bottom,height)=>({rect:[cx-height*src[2]/src[3]/2,bottom-height,height*src[2]/src[3],height],pivot:[cx,bottom-.025]});
export function drawAnatomy(ctx,id,pose,atlas,face={from:'neutral',to:'neutral',mix:1}){
 const kit=ANATOMY[id],l=ANATOMY_LAYOUT[id],p=kit.parts,foot=rigFor(id).foot;
 const left=partPlacement(p.leftArm,l.left),right=partPlacement(p.rightArm,l.right);
 const la=pose.hand*(l.bow?.15:l.shield?.35:.60),ra=l.bow?pose.hand*.50:pose.lean*.3-pose.hand*.10;
 const tail=partPlacement(p.tail,{height:l.tail,anchor:[.86,.84],socket:[.30,foot-.13]});
 piece(ctx,atlas,p.tail,tail,pose.tail*.55);
 if(!l.shield)piece(ctx,atlas,p.leftArm,left,la);
 piece(ctx,atlas,p.body,at(p.body,.49,foot,l.body));
 if(l.shield)piece(ctx,atlas,p.leftArm,left,la);
 if(!l.bow)piece(ctx,atlas,p.rightArm,right,ra);
 const headScale=l.head/kit.faces.neutral[2];
 const head=(name,alpha)=>{if(alpha<=0)return;const src=kit.faces[name]||kit.faces.neutral;ctx.save();ctx.globalAlpha*=alpha;piece(ctx,atlas,src,at(src,.49,l.chin,src[3]*headScale),pose.head*.65);ctx.restore();};
 if(face.from!==face.to&&face.mix<1){head(face.from,1-face.mix);head(face.to,face.mix);}else head(face.to,1);
 if(l.bow){
  const top=placedPoint(left,[.66,.04],la),bottom=placedPoint(left,[.68,.97],la),grip=placedPoint(right,[.82,.18],ra);
  const release=pose.nock??1,chord=[(top[0]+bottom[0])/2,(top[1]+bottom[1])/2];
  const pull=[chord[0]+(grip[0]-chord[0])*release,chord[1]+(grip[1]-chord[1])*release];
  ctx.save();ctx.strokeStyle='#594132';ctx.lineWidth=.004;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(...top);ctx.lineTo(...pull);ctx.lineTo(...bottom);ctx.stroke();
  if(release>.15){const bowCenter=placedPoint(left,[.90,.55],la),dx=bowCenter[0]-pull[0],dy=bowCenter[1]-pull[1],len=Math.hypot(dx,dy)||1,ux=dx/len,uy=dy/len,tip=[bowCenter[0]+ux*.05,bowCenter[1]+uy*.05];ctx.globalAlpha*=release;ctx.strokeStyle='#d6c29c';ctx.lineWidth=.009;ctx.beginPath();ctx.moveTo(...pull);ctx.lineTo(...tip);ctx.stroke();ctx.fillStyle='#c4c8b5';ctx.beginPath();ctx.moveTo(tip[0]+ux*.025,tip[1]+uy*.025);ctx.lineTo(tip[0]-uy*.018,tip[1]+ux*.018);ctx.lineTo(tip[0]+uy*.018,tip[1]-ux*.018);ctx.closePath();ctx.fill();}
  ctx.restore();piece(ctx,atlas,p.rightArm,right,ra);
 }
}
