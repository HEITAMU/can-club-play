"""Pack imagegen cutout kits without repainting; retain alpha and source rectangles."""
from pathlib import Path
from PIL import Image
import json, sys

root=Path(__file__).resolve().parents[1]
out=root/'assets'/'cutout'
out.mkdir(parents=True,exist_ok=True)
sources=dict(zip('abcd',sys.argv[1:5]))
ids=[['orange','ink'],['milk','spark'],['mint','bolt'],['pudding','star']]
parts=['body','head','hand','tail']
metadata={}
for (sheet,source),cats in zip(sources.items(),ids):
    im=Image.open(source).convert('RGBA')
    im.save(out/f'partners-{sheet}.webp',quality=91,method=6)
    for row,id in enumerate(cats):
        entry={'atlas':f'./assets/cutout/partners-{sheet}.webp','width':im.width,'height':im.height,'parts':{}}
        for col,part in enumerate(parts):
            x,y=round(col*im.width/4),round(row*im.height/2)
            right,bottom=round((col+1)*im.width/4),round((row+1)*im.height/2)
            cell=im.crop((x,y,right,bottom))
            box=cell.getchannel('A').point(lambda p:255 if p>24 else 0).getbbox()
            if not box:raise ValueError(f'Empty part: {id} {part}')
            left,top,r,b=box
            entry['parts'][part]=[x+left,y+top,r-left,b-top]
        metadata[id]=entry
fx=Image.open(sys.argv[5]).convert('RGBA')
assert fx.getchannel('A').getextrema()[0]==0,'VFX must have transparent background'
fx.save(out/'effects.webp',quality=92,method=6)
(root/'cutout-data.mjs').write_text('// Packed from generated, separate painted body parts.\nexport const CUTOUTS='+json.dumps(metadata,separators=(',',':'))+';\n')
print(json.dumps({'atlases':[{ 'name':p.name,'bytes':p.stat().st_size} for p in out.glob('*.webp')],'actors':len(metadata),'fxSize':fx.size}))
