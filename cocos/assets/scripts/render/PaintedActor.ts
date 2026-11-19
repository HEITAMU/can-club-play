// GPU deformation of the approved complete painted poses. No limb puppets, no
// per-frame Canvas upload. Mesh positions use the original Preview11 formulas.
import { _decorator, Node, UITransform, Sprite, SpriteFrame, Material, EffectAsset, resources, Vec4, isValid } from 'cc';
import { assets } from './Assets';
import { FINISHED_ROSTER } from '../domain/finished-roster-data';
import { FINISHED_SPARK } from '../domain/finished-spark-data';
import { rigPose, blendRigPose, rigFor, preparePoint, deformPoint, animationClock } from '../domain/rig-motion';
import { expressionFor, faceTransition } from '../domain/expressions';
import { paintedLayers } from '../domain/painted-transition';
import { companionScale } from '../domain/companion-display';
import { CARRIER_ART, CARRIER_ATLAS } from '../domain/carrier-art';
import { rosterCel, rosterVertex, sparkCel, sparkFace, sparkVertex } from './PaintedGeometry';
import { paintedSecondaryUV } from './PaintedBlendMath';
const {ccclass}=_decorator;
type FrameInfo={path:string;rect?:[number,number,number,number]};
type BlendRequest={keys:[string,string];weights:[number,number];opacity:number;lighter:boolean};
let effectPromise:Promise<EffectAsset>|null=null;
function paintedEffect():Promise<EffectAsset>{
 const registered=EffectAsset.get('canclub-painted-blend');
 if(registered)return Promise.resolve(registered);
 if(!effectPromise){
  effectPromise=assets.ensureCreatorResources().then(()=>new Promise<EffectAsset>((resolve,reject)=>resources.load('effects/canclub-painted-blend',EffectAsset,(error,effect)=>{if(error)reject(error);else {effect.addRef();resolve(effect);}})));
  effectPromise.catch(()=>{effectPromise=null;});
 }
 return effectPromise;
}
const xs=[0,110,256,512],ys=[0,258,335,420,470,518,544],indices=[];
for(let y=0;y<6;y++)for(let x=0;x<3;x++){const a=y*4+x,b=a+1,c=a+4,d=c+1;indices.push(a,b,d,a,d,c);}
const meshAssembler={
 createData(sprite){const d=sprite.requestRenderData();d.dataLength=28;d.resize(28,108);d.chunk.setIndexBuffer(Uint16Array.from(indices));return d;},
 updateRenderData(sprite){const d=sprite.renderData,f=sprite.spriteFrame;if(!d||!f)return;this.updateUVs(sprite);this.updateColor(sprite);if(d.vertDirty)this.updateVertexData(sprite);d.updateRenderData(sprite,f);},
 updateVertexData(sprite){const d=sprite.renderData;if(!d)return;for(let i=0;i<28;i++){const p=sprite.points[i]||[0,0];d.data[i].x=p[0];d.data[i].y=p[1];}d.vertDirty=true;},
 updateUVs(sprite){const d=sprite.renderData,f=sprite.spriteFrame;if(!d||!f)return;const uv=f.uv,v=d.chunk.vb,stride=d.floatStride;let i=0;for(const y of ys)for(const x of xs){const k=i++*stride;v[k+3]=uv[4]+(uv[6]-uv[4])*x/512;v[k+4]=uv[5]+(uv[1]-uv[5])*y/544;}},
 updateColor(sprite){const d=sprite.renderData;if(!d)return;const v=d.chunk.vb,c=sprite.color;for(let i=0;i<28;i++){const k=i*d.floatStride+5;v[k]=c.r/255;v[k+1]=c.g/255;v[k+2]=c.b/255;v[k+3]=c.a/255;}},
 fillBuffers(sprite){const d=sprite.renderData;if(!d)return;const chunk=d.chunk,m=sprite.node.worldMatrix,v=chunk.vb;for(let i=0;i<28;i++){const p=d.data[i],k=i*d.floatStride;v[k]=m.m00*p.x+m.m04*p.y+m.m12;v[k+1]=m.m01*p.x+m.m05*p.y+m.m13;v[k+2]=m.m02*p.x+m.m06*p.y+m.m14;}d.vertDirty=false;const mesh=chunk.meshBuffer,ib=mesh.iData;let k=mesh.indexOffset;for(const j of indices)ib[k++]=chunk.vertexOffset+j;mesh.indexOffset+=108;}
};
@ccclass('PaintedMeshSprite')
export class PaintedMeshSprite extends Sprite{
 points=Array.from({length:28},()=>[0,0]);
 private ownedMaterial:Material|null=null;
 private secondaryFrame:SpriteFrame|null=null;
 private uvMapping=new Vec4(1,1,0,0);
 private mixParameters=new Vec4(1,0,1,1);
 _flushAssembler(){if(this._assembler!==meshAssembler){this.destroyRenderData();this._assembler=meshAssembler;}if(!this._renderData){const rd=this._renderData=meshAssembler.createData(this);rd.material=this.getRenderMaterial(0);this._markForUpdateRenderData();this._updateColor();}}
 setPoints(points){this.points=points;if(this.renderData)this.renderData.vertDirty=true;this._markForUpdateRenderData();}
 initializeBlend(effect:EffectAsset){
  if(this.ownedMaterial)return;
  const material=new Material();material.name='painted-blend:'+this.node.uuid;material.initialize({effectAsset:effect});
  this.ownedMaterial=material;this.customMaterial=material;
 }
 setBlend(first:SpriteFrame,second:SpriteFrame,weightA:number,weightB:number,opacity:number,lighter:boolean){
  const material=this.ownedMaterial;if(!material)return false;
  if(this.spriteFrame!==first||this.secondaryFrame!==second){
   this.spriteFrame=first;this.secondaryFrame=second;
   const uv=paintedSecondaryUV(first.uv,second.uv);this.uvMapping.set(uv[0],uv[1],uv[2],uv[3]);
   material.setProperty('secondaryTexture',second.texture);material.setProperty('secondaryUV',this.uvMapping);
  }
  this.mixParameters.set(weightA,weightB,Math.max(0,Math.min(1,opacity)),lighter?1:0);
  material.setProperty('blendParameters',this.mixParameters);this.enabled=true;this._markForUpdateRenderData();return true;
 }
 onDestroy(){const material=this.ownedMaterial;this.ownedMaterial=null;super.onDestroy();material?.destroy();}
}
const foes={dust:['a',0],box:['a',1],mop:['a',2],battery:['a',3],bag:['b',0],drone:['b',1],vacuum:['b',2],fridge:['b',3],sign:['c',0],boxBoss:['c',1],clock:['c',2],vendor:['c',3]};
export function paintedAtlasFor(id:string):string{
 if(FINISHED_ROSTER[id])return FINISHED_ROSTER[id].atlas;
 if(id==='spark')return FINISHED_SPARK.atlas;
 if(CARRIER_ART[id])return CARRIER_ATLAS;
 return `assets/painted/enemies-${(foes[id]||foes.dust)[0]}.webp`;
}
export class PaintedActor{
 node:Node; id:string; controlled=false; layers:PaintedMeshSprite[]=[]; frames=new Map<string,SpriteFrame>(); pending=new Set<string>();
 width=90;height=86;clock=-1;pose:any;face:any; flip=1;unit=62;disposed=false;outcome:any;ui:any;
 private requestedBlend:BlendRequest|null=null;
 constructor(parent:Node,id:string,ui:any){this.id=id;this.ui=ui;this.node=new Node('painted:'+id);this.node.layer=parent.layer;parent.addChild(this.node);this.node.addComponent(UITransform).setContentSize(130,130);
  const n=new Node('complete-pose-blend');n.layer=parent.layer;this.node.addChild(n);const t=n.addComponent(UITransform);t.setAnchorPoint(.5,.92);t.setContentSize(90,86);const s=n.addComponent(PaintedMeshSprite);s.sizeMode=Sprite.SizeMode.CUSTOM;s.enabled=false;this.layers.push(s);
  const loading=paintedEffect().then(effect=>{if(!isValid(n,true))return;s.initializeBlend(effect);this.applyFrames();}).catch(error=>{if(isValid(n,true))this.ui?.errors.push('painted-blend material: '+String(error));});
  this.ui?.track?.(loading);
  this.update(null,0,0);
 }
 place(x:number,y:number,unit=this.unit,flip=1){this.node.setPosition(x,-y,0);this.unit=unit;const full=unit*companionScale(this.id);this.width=full*1.44;this.height=full*1.38;this.node.setScale(flip,1,1);this.flip=flip;for(const s of this.layers)s.node.getComponent(UITransform).setContentSize(this.width,this.height);return this;}
 frameInfo(cel,face):FrameInfo{
  const kit=FINISHED_ROSTER[this.id];
  if(kit){const expression=({blink:'blink',down:'blink',hurt:'hurt',victory:'victory'})[face];if(cel===0&&expression)return {path:`assets/cocos/expressions/${this.id}-0-${expression}.png`,rect:undefined};return {path:kit.atlas,rect:kit.frames[Math.min(cel,kit.frames.length-1)] as [number,number,number,number]};}
  if(this.id==='spark'){const expression=sparkFace({to:face},cel);return expression==='neutral'?{path:FINISHED_SPARK.atlas,rect:FINISHED_SPARK.frames[cel].rect as [number,number,number,number]}:{path:`assets/cocos/expressions/spark-${cel}-${expression}.png`,rect:undefined};}
  if(CARRIER_ART[this.id])return {path:CARRIER_ATLAS,rect:[cel*320,CARRIER_ART[this.id].row*320,320,320]};
  const [sheet,row]=foes[this.id]||foes.dust;return {path:`assets/painted/enemies-${sheet}.webp`,rect:[cel*256,row*256,256,256]};
 }
 resolveFrame(info:FrameInfo,key:string){
  if(this.frames.has(key)||this.pending.has(key))return;
  this.pending.add(key);
  const loading=assets.frame(info.path,info.rect).then(frame=>{this.frames.set(key,frame);this.pending.delete(key);this.applyFrames();}).catch(error=>{this.pending.delete(key);if(isValid(this.node,true))this.ui?.errors.push(info.path+': '+String(error));});
  this.ui?.track?.(loading);
 }
 applyFrames(){
  if(!isValid(this.node,true)||!this.requestedBlend)return;
  const request=this.requestedBlend,first=this.frames.get(request.keys[0]),second=this.frames.get(request.keys[1]);
  if(first&&second)this.layers[0].setBlend(first,second,request.weights[0],request.weights[1],request.opacity,request.lighter);
 }
 update(actor:any,time:number,dt:number,idleTime=time,outcome=this.outcome){
  if(!isValid(this.node,true))return;
  const clock=animationClock(actor,time,idleTime),raw=rigPose(this.id,actor,time,idleTime),p=blendRigPose(this.pose,raw,this.clock<0?-1:clock-this.clock);
  for(const key of ['boltCel','boltFrom','boltMix','shidunCel','shidunFrom','shidunMix','shidunCharge','shidunTime','rosterCel','rosterRecovery','rosterSkill','sparkCel','sparkRecovery','carrierFrom','carrierCel','carrierMix'])if(raw[key]!==undefined)p[key]=raw[key];
  p.rosterClock=clock;p.sparkClock=clock;this.pose=p;this.clock=clock;this.face=faceTransition(this.face,expressionFor(this.id,actor,time,clock,{outcome,preview:undefined}),clock);
  let selected;
  if(CARRIER_ART[this.id])selected=paintedLayers(p.carrierFrom||0,p.carrierCel||0,p.carrierMix??1,{short:true});
  else if(this.id==='pudding'||this.id==='bolt'&&p.boltCel>=0){const special=this.id==='pudding'?'shidun':'bolt';selected=paintedLayers(p[special+'From']||0,p[special+'Cel']||0,p[special+'Mix']??1,{short:true});}
  else if(this.id==='spark'){const val=Math.max(0,Math.min(5,p.sparkCel||0)),a=Math.floor(val),b=Math.ceil(val);selected=paintedLayers(sparkCel({...p,sparkCel:a}),sparkCel({...p,sparkCel:b}),val-a);}
  else if(FINISHED_ROSTER[this.id]){const val=Math.max(0,Math.min(4,p.rosterCel||0)),a=Math.floor(val),b=Math.ceil(val);selected=paintedLayers(rosterCel({...p,rosterCel:a}),rosterCel({...p,rosterCel:b}),val-a);}
  else selected=paintedLayers(0,3,p.enemyHit||0,{short:true});
  const hero=!!FINISHED_ROSTER[this.id]||this.id==='spark';
  const angle=Math.max(-.1,Math.min(.32,(p.lean||0)*.22)),c=Math.cos(angle),sin=Math.sin(angle),points=[];
  for(const py of ys)for(const px of xs){
   let x,y;
   if(hero){const q=this.id==='spark'?sparkVertex(px,py,p):rosterVertex(this.id,px,py,p);const dx=(q[0]-256)*.91/480,dy=(q[1]-518)*.91/480;x=(dx*c-dy*sin)*this.width;y=-(dx*sin+dy*c+(p.sink||0))*this.height;}
   else {const q=deformPoint(this.id,preparePoint(this.id,px/512,py/544),p);x=(q.x-.5)*this.width;y=(rigFor(this.id).foot-q.y)*this.height;}
   points.push([x,y]);
  }
  const first=selected[0],second=selected[1]||[first[0],0],infos=[this.frameInfo(first[0],this.face.to),this.frameInfo(second[0],this.face.to)];
  const keys=infos.map(info=>info.path+'|'+JSON.stringify(info.rect)) as [string,string];
  this.requestedBlend={keys,weights:[first[1],second[1]],opacity:p.alpha??1,lighter:hero};
  this.layers[0].setPoints(points);
  for(let i=0;i<2;i++)this.resolveFrame(infos[i],keys[i]);
  this.applyFrames();
 }
 destroy(){this.disposed=true;this.node.destroy();}
}
