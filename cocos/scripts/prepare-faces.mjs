// Build-time only: bake the original facial replacement into full, unscaled cels.
// The runtime never uploads a Canvas each frame; Cocos meshes sample these textures.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {createRequire} from 'node:module';
import { FINISHED_ROSTER } from './reference/finished-roster-data.mjs';
import { FINISHED_SPARK } from './reference/finished-spark-data.mjs';
import {setRosterCanvasFactory,layer} from './reference/finished-roster-renderer.mjs';
import {setFinishedCanvasFactory,facialLayer} from './reference/finished-spark-renderer.mjs';
import {paintHealing} from './reference/healing-fx.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),source=path.resolve(root,'..');
const out=path.join(root,'source-art/expressions');await fs.mkdir(out,{recursive:true});
setRosterCanvasFactory(createCanvas);setFinishedCanvasFactory(createCanvas);
const rows=[];
for(const [id,art] of Object.entries(FINISHED_ROSTER)){
  const atlas=await loadImage(path.join(source,art.atlas));
  for(const face of ['blink','hurt','victory']){const l=layer(id,atlas,0,{to:face}),name=`${id}-0-${face}.png`;await fs.writeFile(path.join(out,name),l.image.toBuffer('image/png'));rows.push({id,cel:0,face,path:'assets/cocos/expressions/'+name,width:l.image.width,height:l.image.height});}
}
const spark=await loadImage(path.join(source,FINISHED_SPARK.atlas));
for(let cel=0;cel<FINISHED_SPARK.frames.length;cel++)for(const face of ['blink','attack','hurt','victory']){
 const l=facialLayer(spark,cel,face),name=`spark-${cel}-${face}.png`;await fs.writeFile(path.join(out,name),l.image.toBuffer('image/png'));rows.push({id:'spark',cel,face,path:'assets/cocos/expressions/'+name,width:l.image.width,height:l.image.height});
}
await fs.writeFile(path.join(root,'source-art/expressions.json'),JSON.stringify({method:'Original Preview11 facialLayer/layer; native canvas only at build time; original 512x544 size',frames:rows},null,2));
await fs.mkdir(path.join(root,'source-art/effects'),{recursive:true});
for(const art of ['heal-light','heal-mote','heal-cross'])for(const vertical of art==='heal-light'?[false,true]:[false]){
 const c=createCanvas(256,256),p={art,x:128,y:128,width:art==='heal-light'?256:128,height:art==='heal-light'?256:128,alpha:1,phase:0,vertical};
 paintHealing(c.getContext('2d'),p);await fs.writeFile(path.join(root,'source-art/effects',art+(vertical?'-vertical':'')+'.png'),c.toBuffer('image/png'));
}
console.log(`Prepared ${rows.length} original expression cels at 512x544; no pose or costume redraw.`);
