/** Preview11 paintVFX strip geometry, expressed in Cocos's local Y-up coordinates. */
export type StripDeformation={axis:'x'|'y';phase:number;amplitude:number};
export type StripVertex={x:number;y:number;u:number;v:number};
export type StripQuad=[StripVertex,StripVertex,StripVertex,StripVertex];
export function stripGeometry(width:number,height:number,deform?:StripDeformation,reveal?:number):StripQuad[]{
  const dw=Math.abs(width),dh=height,quads:StripQuad[]=[];
  if(!(dw>0&&dh>0))return quads;
  const bands=deform?12:1;
  const clipping=reveal!==undefined;
  const clipX=-dw/2,clipEnd=clipX+dw*(reveal??1);
  const clipLeft=Math.min(clipX,clipEnd),clipRight=Math.max(clipX,clipEnd);
  for(let i=0;i<bands;i++){
    let x=-dw/2,y=-dh/2,w=dw,h=dh,u=0,v=0,uw=1,vh=1;
    if(deform){
      const start=i/bands,mid=(i+.5)/bands;
      const falloff=(1-mid)**1.5;
      const wave=(Math.sin(mid*8-deform.phase)+Math.sin(mid*17-deform.phase*1.3)*.25)*falloff*deform.amplitude;
      if(deform.axis==='y'){
        x+=wave*dw;y+=start*dh;h=dh/bands+.35;v=start;vh=1/bands;
      }else{
        x+=start*dw;y+=wave*dh;w=dw/bands+.35;u=start;uw=1/bands;
      }
    }
    // The original Canvas clip is fixed before deformation, so intersect each
    // displaced strip and adjust its UVs. Scaling the whole image is incorrect.
    const left=clipping?Math.max(x,clipLeft):x;
    const right=clipping?Math.min(x+w,clipRight):x+w;
    const top=clipping?Math.max(y,-dh/2):y;
    const bottom=clipping?Math.min(y+h,dh/2):y+h;
    if(right<=left||bottom<=top)continue;
    const u0=u+(left-x)/w*uw,u1=u+(right-x)/w*uw;
    const v0=v+(top-y)/h*vh,v1=v+(bottom-y)/h*vh;
    quads.push([
      {x:left,y:-bottom,u:u0,v:v1},
      {x:right,y:-bottom,u:u1,v:v1},
      {x:left,y:-top,u:u0,v:v0},
      {x:right,y:-top,u:u1,v:v0}
    ]);
  }
  return quads;
}
