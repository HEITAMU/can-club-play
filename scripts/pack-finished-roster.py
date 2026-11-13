"""Pack generated transparent cells without repainting, recoloring or limb assembly."""
from pathlib import Path
from PIL import Image
import numpy as np, json
from scipy import ndimage
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/finished'
ids=['orange','ink','milk','mint','bolt','star']
result={}
for id in ids:
 p=OUT/'roster-source'/f'{id}.png'
 if not p.exists():continue
 im=Image.open(p).convert('RGBA'); cw,ch=im.width/4,im.height/2
 cells=[]
 for i in range(8):
  cell=im.crop((round(i%4*cw),round(i//4*ch),round((i%4+1)*cw),round((i//4+1)*ch)))
  a=np.array(cell)[:,:,3];label,n=ndimage.label(a>80);counts=np.bincount(label.ravel());counts[0]=0
  # Bounding box includes all connected silhouette components but not isolated specks.
  mask=np.isin(label,np.where(counts>max(80,counts.max()*.008))[0]);ys,xs=np.where(mask)
  box=(max(0,int(xs.min())-2),max(0,int(ys.min())-2),min(cell.width,int(xs.max())+3),min(cell.height,int(ys.max())+3))
  footmask=mask & (np.indices(mask.shape)[0]>=ys.max()-8)
  fy,fx=np.where(footmask);foot=(float(np.median(fx)),float(ys.max()))
  cells.append((cell,box,foot))
 # One uniform scale for every pose avoids stretching heads and changing proportions.
 # Keep room for the widest gesture, and retain the same ground anchor.
 scale=min(440/max(b[2]-b[0] for _,b,_ in cells),470/max(f[1]-b[1] for _,b,f in cells))
 extra=[]
 bp=OUT/'roster-source'/f'{id}-between.png'
 if bp.exists():
  bi=Image.open(bp).convert('RGBA')
  for j in range(4):
   cell=bi.crop((round(j%2*bi.width/2),round(j//2*bi.height/2),round((j%2+1)*bi.width/2),round((j//2+1)*bi.height/2)))
   a=np.array(cell)[:,:,3];ys,xs=np.where(a>100);b=(int(xs.min()),int(ys.min()),int(xs.max())+1,int(ys.max())+1);fy,fx=np.where((a>100)&(np.indices(a.shape)[0]>=ys.max()-8));extra.append((cell,b,(float(np.median(fx)),float(ys.max()))))
 extraScale=min((cells[0][2][1]-cells[0][1][1])*scale*.98/np.median([f[1]-b[1] for _,b,f in extra]),440/max(b[2]-b[0] for _,b,_ in extra),470/max(f[1]-b[1] for _,b,f in extra)) if extra else scale
 height=1632 if extra else 1088
 atlas=Image.new('RGBA',(2048,height));frames=[]
 for i,(cell,b,foot) in enumerate(cells+extra):
  sc=scale if i<8 else extraScale
  crop=cell.crop(b);size=(round(crop.width*sc),round(crop.height*sc))
  x=round(256-(foot[0]-b[0])*sc);y=round(518-(foot[1]-b[1])*sc)
  # Clamp horizontally only when an extended prop needs extra space.
  x=max(8,min(504-size[0],x))
  packed=Image.new('RGBA',(512,544));packed.alpha_composite(crop.resize(size,Image.Resampling.LANCZOS),(x,y))
  atlas.alpha_composite(packed,(i%4*512,i//4*544));frames.append([i%4*512,i//4*544,512,544])
  if i==0:packed.save(OUT/f'{id}-portrait-v0213.webp',quality=94)
 atlas.save(OUT/f'{id}-v0213.webp',quality=94,method=3)
 result[id]={'atlas':f'./assets/finished/{id}-v0213.webp','portrait':f'./assets/finished/{id}-portrait-v0213.webp','frames':frames,'width':2048,'height':height,'face':{'orange':[.68,.35,.16,.10],'ink':[.60,.43,.15,.085],'milk':[.61,.44,.15,.105],'mint':[.68,.43,.13,.08],'bolt':[.68,.38,.16,.095],'star':[.65,.385,.17,.105]}[id],'period':{'orange':3.8,'ink':4.1,'milk':4,'mint':4.4,'bolt':3.5,'pudding':4.6,'star':4.2}[id]}
 print(id,im.size,round(scale,3),(OUT/f'{id}-v0213.webp').stat().st_size)
(ROOT/'finished-roster-data.mjs').write_text('// Complete painted characters. Stable IDs preserve existing saves.\nexport const FINISHED_ROSTER='+json.dumps(result,separators=(',',':'))+';\n')
