"""Pack generated cutout pixels and the established expression heads; no repainting."""
from PIL import Image
from scipy import ndimage
from pathlib import Path
import json, re
import numpy as np

root=Path(__file__).resolve().parent.parent
legacy=json.loads(re.search(r'export const ANATOMY=(.*);', (root/'anatomy-data.mjs').read_text()).group(1))
names=['reference','body','unusedRightUpper','rightArm','unusedLeftUpper','leftArm','rightLeg','leftLeg','tail','shield','neutral','attack']
data={}
for source in sorted((root/'assets/rebuild/source').glob('*.png')):
    name=source.stem
    if name!='orange': continue # Only one character is being rebuilt in this revision.
    im=Image.open(source).convert('RGBA'); a=np.array(im)[:,:,3]
    labels,n=ndimage.label(a>24)
    boxes={}
    for index,s in enumerate(ndimage.find_objects(labels),1):
        if s is None: continue
        ys,xs=s
        if (labels[s]==index).sum()<40: continue
        col=min(3,int((xs.start+xs.stop)/2/im.width*4));row=min(2,int((ys.start+ys.stop)/2/im.height*3))
        k=row*4+col
        b=[xs.start,ys.start,xs.stop,ys.stop]
        if k in boxes:
            old=boxes[k];b=[min(old[0],b[0]),min(old[1],b[1]),max(old[2],b[2]),max(old[3],b[3])]
        boxes[k]=b
    if len(boxes)!=12: raise ValueError((name,boxes))
    atlas=Image.new('RGBA',(1024,1280));parts={};faces={}
    def put(pic,box,slot):
        crop=pic.crop(box);crop.thumbnail((244,244),Image.Resampling.LANCZOS)
        x=slot%4*256+(256-crop.width)//2;y=slot//4*256+(256-crop.height)//2
        atlas.alpha_composite(crop,(x,y));return [x,y,*crop.size]
    for k,label in enumerate(names):
        if k in (0,2,4) or k>=10:continue
        b=boxes[k];b=[max(0,b[0]-2),max(0,b[1]-2),min(im.width,b[2]+2),min(im.height,b[3]+2)]
        parts[label]=put(im,b,len(parts))
    old=legacy[name];heads=Image.open(root/old['atlas']).convert('RGBA')
    for i,(face,rect) in enumerate(old['faces'].items()):
        x,y,w,h=rect
        if face=='attack':
            # The new focused face has the same silhouette, without the old angry teeth.
            faces[face]=put(im,boxes[11],7+i)
        else: faces[face]=put(heads,(x,y,x+w,y+h),7+i)
    out=root/f'assets/rebuild/{name}.webp';atlas.save(out,'WEBP',quality=94,method=6)
    data[name]={'atlas':f'./assets/rebuild/{name}.webp','width':1024,'height':1280,'parts':parts,'faces':faces}
    print(name, out.stat().st_size, boxes)
(root/'articulated-data.mjs').write_text('// Generated cutouts with established character heads; see scripts/pack-rebuild.py.\nexport const ARTICULATED='+json.dumps(data,separators=(',',':'))+';\n')
