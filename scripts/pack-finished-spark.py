"""Pack generated finished sprites; no generative repainting or hand reconstruction."""
from pathlib import Path
import json, shutil
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/finished'; SOURCE=OUT/'source'; SOURCE.mkdir(parents=True,exist_ok=True)
inputs=[('spark-keys.png','exec-867f38ed-2bd4-4c18-83d8-fd88bd90ee2c.png',3,2),('spark-between.png','exec-e7d656d0-dcb2-4a61-b6a8-0f6e5932e7ef.png',2,2),('spark-faces.png','exec-c16122d6-036b-4793-b393-ddbf297d48b5.png',2,2)]
for name,generated,_,_ in inputs:
    target=SOURCE/name
    if not target.exists(): shutil.copy(ROOT.parent/'generated_images'/generated,target)
reference=ROOT.parent/'upload/0FBB4437-566B-4783-928A-B6546D3AD64A.jpeg'
if reference.exists():shutil.copy(reference,SOURCE/'spark-reference.jpeg')

def sprites(name,cols,rows):
    im=Image.open(SOURCE/name).convert('RGBA'); result=[]
    for row in range(rows):
        for col in range(cols):
            cell=im.crop((round(col*im.width/cols),round(row*im.height/rows),round((col+1)*im.width/cols),round((row+1)*im.height/rows)))
            a=np.asarray(cell)[:,:,3]; labels,n=ndimage.label(a>48); sizes=np.bincount(labels.ravel());sizes[0]=0
            yy,xx=np.where(labels==sizes.argmax()); box=(max(0,int(xx.min())-8),max(0,int(yy.min())-8),min(cell.width,int(xx.max())+9),min(cell.height,int(yy.max())+9))
            part=cell.crop(box);part.info['origin']=(round(col*im.width/cols)+box[0],round(row*im.height/rows)+box[1]);result.append(part)
    return result

keys=sprites('spark-keys.png',3,2); between=sprites('spark-between.png',2,2)
# Rest -> anticipation -> rising -> raised -> reaching -> release -> follow-through -> lowering.
ordered=[keys[0],keys[1],between[0],keys[2],between[1],keys[3],between[2],keys[4],between[3]]
heads=[(124,20,389,223),(585,29,845,226),(171,30,491,280),(1066,28,1340,228),(717,30,1054,282),(122,563,391,772),(174,674,495,928),(586,575,856,780),(726,675,1053,932)]
atlas=Image.new('RGBA',(2048,1900)); frames=[]
for i,im in enumerate(ordered):
    a=np.asarray(im)[:,:,3]; h,w=a.shape
    hl,ht,hr,hb=heads[i];ox,oy=im.info['origin'];head_left=hl-ox;head_right=hr-ox;head_top=ht-oy;head_bottom=hb-oy
    # Match skull width, not total height: crouching must not enlarge the whole cat.
    scale=265/(head_right-head_left+1)
    fy,fx=np.where(a[round(h*.92):]>64); anchor=(int(fx.min())+int(fx.max()))/2
    bottom=int(np.where(a>64)[0].max())
    size=(round(w*scale),round(h*scale)); resized=im.resize(size,Image.Resampling.LANCZOS)
    x=round(256-anchor*scale);y=round(518-bottom*scale)
    assert x>=0 and y>=0 and x+size[0]<=512 and y+size[1]<=544,(i,x,y,size)
    cell=Image.new('RGBA',(512,544));cell.alpha_composite(resized,(x,y))
    px=i%4*512;py=i//4*544;atlas.alpha_composite(cell,(px,py))
    # Head bounds for facial animation only. Ear and skull contours remain the full-body painting.
    head=[x+head_left*scale,y+head_top*scale,265,(head_bottom-head_top)*scale]
    frames.append({'rect':[px,py,512,544],'head':[round(v,3) for v in head],'hand':'right','props':1})

faces={}
for i,(name,im) in enumerate(zip(['blink','attack','hurt','victory'],sprites('spark-faces.png',2,2))):
    resized=im.resize((320,256),Image.Resampling.LANCZOS);x=i*340;y=1640
    atlas.alpha_composite(resized,(x,y));faces[name]=[x,y,320,256]
atlas.save(OUT/'spark-v0211.webp',quality=94,method=6)
data={'atlas':'./assets/finished/spark-v0211.webp','width':2048,'height':1900,'frames':frames,'faces':faces,'cell':[512,544],'foot':[256,518],'headWidth':265,'weaponHand':'right'}
(ROOT/'finished-spark-data.mjs').write_text('// Finished full-body art. Only Spark uses this renderer.\nexport const FINISHED_SPARK='+json.dumps(data,separators=(',',':'))+';\n')
preview=Image.new('RGB',(1536,1632),'#365c64')
for i in range(9):preview.paste(atlas.crop(tuple([frames[i]['rect'][0],frames[i]['rect'][1],frames[i]['rect'][0]+512,frames[i]['rect'][1]+544])),(i%3*512,i//3*544),atlas.crop((frames[i]['rect'][0],frames[i]['rect'][1],frames[i]['rect'][0]+512,frames[i]['rect'][1]+544)))
(ROOT/'qa/spark').mkdir(parents=True,exist_ok=True);preview.save(ROOT/'qa/spark/packed.png')
print(json.dumps({'atlasBytes':(OUT/'spark-v0211.webp').stat().st_size,'frames':len(frames),'headWidth':265}))
