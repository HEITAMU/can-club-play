// @ts-nocheck
import {Node,Sprite,UITransform,Color,isValid} from 'cc';
import {assets} from './Assets';
import {NativeStripSprite} from './NativeStripSprite';
import {HealingRibbon} from './HealingRibbon';
import {VFX_ATLAS} from '../domain/vfx-atlas';
import {CAN_ATLAS} from '../domain/can-fx';
import {FX_CELLS} from '../domain/vfx-motion';
function shidun(p){const s=p.width,path='assets/vfx/shidun-impact-v0211.webp',out=[];const push=(rect,x,y,width,height,alpha=1,angle=0)=>out.push({...p,art:'texture',path,rect,x,y,width,height,alpha,angle});
 if(p.stage==='charge'){for(let i=0;i<3;i++){const u=(p.time*(.6+p.q*.25)+i/3)%1,side=i===1?-1:1,x=side*s*(.28-.17*u),y=-s*.035*Math.sin(u*Math.PI);push([0,768,512,256],p.x+x-side*s*.075,p.y+y-s*.05,side*s*.85,s*.22,Math.sin(u*Math.PI)*(.28+p.q*.35));}push([512,768,512,256],p.x-s*.01+Math.sin(p.time*27)*s*.006,p.y-s*.02,s*.94,s*.18,.35+p.q*.3);}
 else {const f=Math.min(11,Math.floor(p.q*12)),r=[f%3*512,Math.floor(f/3)*256,512,256];if(p.stage==='wave'){const advance=1-(1-Math.min(1,p.q/.65))**2,width=p.span*(.58+.2*advance)*1.25,height=width*.5,angle=Math.atan2(p.rise,p.span),x=s*.34+p.span*.42*advance+width*.4,y=s*.02-height*.16;push(r,p.x+x*Math.cos(angle)-y*Math.sin(angle),p.y+x*Math.sin(angle)+y*Math.cos(angle),width,height,1,angle);}else push(r,p.x,p.y+s*1.65*.5*.05,s*1.65,s*.825);}
 return out;
}
export class Effects{
 constructor(back,front){this.back=back;this.front=front;this.pool=[];this.frames=new Map();this.pending=new Set();}
 clear(){for(const v of this.pool)v.node.active=false;}
 frame(path,rect,visual,key){if(this.frames.has(key)){visual.sprite.spriteFrame=this.frames.get(key);return;}visual.sprite.spriteFrame=null;if(this.pending.has(key))return;this.pending.add(key);assets.frame(path,rect).then(f=>{this.frames.set(key,f);this.pending.delete(key);if(isValid(visual.node,true)&&visual.key===key)visual.sprite.spriteFrame=f;}).catch(()=>this.pending.delete(key));}
 render(particles){let used=0;for(const p0 of particles){const list=p0.art==='shidun'?shidun(p0):[p0];for(const p of list){
   let v=this.pool[used++];if(!v){const node=new Node('effect');node.layer=this.front.layer;const tr=node.addComponent(UITransform);tr.setAnchorPoint(.5,.5);const sprite=node.addComponent(Sprite);sprite.sizeMode=Sprite.SizeMode.CUSTOM;const graphicChild=new Node('healing-stream');graphicChild.layer=node.layer;node.addChild(graphicChild);graphicChild.addComponent(UITransform);const g=null;v={node,sprite,standard:sprite,tr,graphicChild,g,strip:null,stripChild:null};this.pool.push(v);}
   const parent=p.layer===0?this.back:this.front;if(v.node.parent!==parent)parent.addChild(v.node);v.node.active=true;v.node.setPosition(p.x,-p.y);v.node.setRotationFromEuler(0,0,-(p.angle||0)*180/Math.PI);v.node.setScale(p.width<0?-1:1,1,1);
   const stream=p.art==='heal-stream';v.standard.enabled=!stream;v.graphicChild.active=stream;if(v.stripChild)v.stripChild.active=false;v.sprite=v.standard;if(stream){if(!v.g)v.g=v.graphicChild.addComponent(HealingRibbon);this.stream(v.g,p);continue;}
   let path,rect,width=Math.abs(p.width),height=p.height,generic=false;
   if(p.art==='texture'){path=p.path;rect=p.rect;}
   else if(p.art.startsWith('heal-')){path='assets/cocos/effects/'+p.art+(p.vertical?'-vertical':'')+'.png';if(p.art!=='heal-light'){width*=2;height*=2;v.node.setRotationFromEuler(0,0,-Math.sin(p.phase||0)*.09*180/Math.PI);}}
   else if(CAN_ATLAS.rects[p.art]){path=CAN_ATLAS.url;rect=CAN_ATLAS.rects[p.art];}
   else {generic=true;path=VFX_ATLAS.url;rect=VFX_ATLAS.rects[FX_CELLS[p.art]];if(!rect){v.node.active=false;continue;}height/=rect[2]/rect[3];}
   v.tr.setContentSize(width,height);
   if(generic&&(p.deform||p.reveal!==undefined)){
    if(!v.strip){const n=new Node('original-twelve-strip-effect');n.layer=v.node.layer;v.node.addChild(n);n.addComponent(UITransform).setAnchorPoint(.5,.5);v.strip=n.addComponent(NativeStripSprite);v.strip.sizeMode=Sprite.SizeMode.CUSTOM;v.stripChild=n;}
    v.standard.enabled=false;v.stripChild.active=true;v.stripChild.getComponent(UITransform).setContentSize(width,height);v.strip.setStripState(width,height,p.deform,p.reveal);v.sprite=v.strip;
   }
   v.sprite.color=new Color(255,255,255,Math.round(Math.max(0,Math.min(1,p.alpha))*255));const key=path+'|'+JSON.stringify(rect);v.key=key;this.frame(path,rect,v,key);
 }}for(let i=used;i<this.pool.length;i++)this.pool[i].node.active=false;
 }
 stream(ribbon,p){ribbon.setStream(p);}
}
