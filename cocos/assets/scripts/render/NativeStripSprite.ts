import {_decorator,Sprite} from 'cc';
import {stripGeometry,StripDeformation,StripVertex} from './NativeStripGeometry';
const {ccclass}=_decorator;
const MAX_VERTICES=48,INDICES=Uint16Array.from(Array.from({length:12},(_,i)=>{
 const v=i*4;return [v,v+1,v+2,v+1,v+3,v+2];
}).flat());
const stripAssembler={
 createData(sprite:NativeStripSprite){
  const data=sprite.requestRenderData();data.dataLength=MAX_VERTICES;data.resize(MAX_VERTICES,72);data.chunk.setIndexBuffer(INDICES);return data;
 },
 updateRenderData(sprite:NativeStripSprite){
  const data=sprite.renderData,frame=sprite.spriteFrame;if(!data||!frame)return;
  this.updateUVs(sprite);this.updateColor(sprite);
  if(data.vertDirty)this.updateVertexData(sprite);
  data.updateRenderData(sprite,frame);
 },
 updateVertexData(sprite:NativeStripSprite){
  const data=sprite.renderData;if(!data)return;
  for(let i=0;i<MAX_VERTICES;i++){
   const vertex=sprite.stripVertices[i];data.data[i].x=vertex?.x||0;data.data[i].y=vertex?.y||0;
  }
  data.vertDirty=true;
 },
 updateUVs(sprite:NativeStripSprite){
  const data=sprite.renderData,frame=sprite.spriteFrame;if(!data||!frame)return;
  const uv=frame.uv,buffer=data.chunk.vb,stride=data.floatStride;
  for(let i=0;i<MAX_VERTICES;i++){
   const point=sprite.stripVertices[i],u=point?.u||0,v=point?.v||0,index=i*stride;
   // SpriteFrame.uv order is bottom-left, bottom-right, top-left, top-right.
   buffer[index+3]=(uv[4]*(1-u)+uv[6]*u)*(1-v)+(uv[0]*(1-u)+uv[2]*u)*v;
   buffer[index+4]=(uv[5]*(1-u)+uv[7]*u)*(1-v)+(uv[1]*(1-u)+uv[3]*u)*v;
  }
 },
 updateColor(sprite:NativeStripSprite){
  const data=sprite.renderData;if(!data)return;const buffer=data.chunk.vb,color=sprite.color;
  for(let i=0;i<MAX_VERTICES;i++){
   const index=i*data.floatStride+5;buffer[index]=color.r/255;buffer[index+1]=color.g/255;buffer[index+2]=color.b/255;buffer[index+3]=color.a/255;
  }
 },
 fillBuffers(sprite:NativeStripSprite){
  const data=sprite.renderData;if(!data)return;
  const chunk=data.chunk,buffer=chunk.vb,m=sprite.node.worldMatrix;
  for(let i=0;i<MAX_VERTICES;i++){
   const p=data.data[i],index=i*data.floatStride;
   let rhw=m.m03*p.x+m.m07*p.y+m.m15;rhw=rhw?1/rhw:1;
   buffer[index]=(m.m00*p.x+m.m04*p.y+m.m12)*rhw;
   buffer[index+1]=(m.m01*p.x+m.m05*p.y+m.m13)*rhw;
   buffer[index+2]=(m.m02*p.x+m.m06*p.y+m.m14)*rhw;
  }
  data.vertDirty=false;
  const mesh=chunk.meshBuffer,ib=mesh.iData;let offset=mesh.indexOffset;
  // Unused quads have coincident vertices, retain fixed buffer allocation, and
  // generate no fragments. No mesh allocation occurs during phase animation.
  for(const index of INDICES)ib[offset++]=chunk.vertexOffset+index;
  mesh.indexOffset+=INDICES.length;
 }
};
/** Native Sprite triangles: original twelve translated texture strips, no Canvas. */
@ccclass('NativeStripSprite')
export class NativeStripSprite extends Sprite{
 stripVertices:StripVertex[]=[];
 protected _flushAssembler(){
  if(this._assembler!==stripAssembler){this.destroyRenderData();this._assembler=stripAssembler;}
  if(!this._renderData){
   const data=this._renderData=stripAssembler.createData(this);data.material=this.getRenderMaterial(0);
   this._markForUpdateRenderData();this._updateColor();
  }
 }
 setStripState(width:number,height:number,deform?:StripDeformation,reveal?:number){
  this.stripVertices=stripGeometry(width,height,deform,reveal).flat();
  if(this.renderData)this.renderData.vertDirty=true;
  this._markForUpdateRenderData();
 }
}
