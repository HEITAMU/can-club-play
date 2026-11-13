import fs from 'node:fs';
import {createRequire} from 'node:module';
import {renderPuppetFrame} from '../rig-renderer.mjs';
import {rigPose} from '../rig-motion.mjs';
import {actionTiming} from '../motion.mjs';
import {expressionFor} from '../expressions.mjs';
import {FINISHED_SPARK as ART} from '../finished-spark-data.mjs';
import {setFinishedCanvasFactory} from '../finished-spark-renderer.mjs?v=0.25.0';
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require('@napi-rs/canvas'),sharp=require('sharp');
setFinishedCanvasFactory(createCanvas);const atlas=await loadImage(await sharp(ART.atlas).png().toBuffer());fs.mkdirSync('qa/spark',{recursive:true});
export function sparkReviewFrame(time=0,kind='idle',face,width=360){
 const actor={catId:'spark',side:'p',hp:100,interval:1.5},timing=actionTiming(actor,kind),elapsed=time;
 if(['normal','skill'].includes(kind)&&elapsed<timing.duration)actor.action={kind,...timing,elapsed};
 if(kind==='hit')actor.hitUntil=.22;
 if(kind==='down'){actor.hp=0;actor.downAt=0;}
 const p=rigPose('spark',actor,time,time),key=face||expressionFor('spark',actor,time,time);
 const c=createCanvas(width,Math.round(width*138/144));renderPuppetFrame(c.getContext('2d'),'spark',p,atlas,c.width,c.height,null,{from:key,to:key,mix:1});return c;
}
const sheet=createCanvas(1440,1150),ctx=sheet.getContext('2d');ctx.fillStyle='#365c64';ctx.fillRect(0,0,1440,1150);
for(const [row,kind] of ['idle','normal','skill'].entries())for(let col=0;col<4;col++){
 const time=kind==='idle'?col*.65:actionTiming({catId:'spark',side:'p',interval:1.5},kind).duration*[.05,.20,.4,.8][col];
 ctx.drawImage(sparkReviewFrame(time,kind),col*360,row*380+20);ctx.font='18px sans-serif';ctx.fillStyle='#f3dfb3';ctx.fillText(kind+' '+time.toFixed(2),col*360+25,row*380+35);
}
fs.writeFileSync('qa/spark/motion-keyframes.png',sheet.toBuffer('image/png'));
const faces=createCanvas(1400,420),f=faces.getContext('2d');f.fillStyle='#365c64';f.fillRect(0,0,1400,420);
for(const [i,name] of ['neutral','blink','attack','hurt','victory'].entries()){f.drawImage(sparkReviewFrame(0,'idle',name,280),i*280,45);f.fillStyle='#f3dfb3';f.font='18px sans-serif';f.fillText(name,i*280+100,380);}
fs.writeFileSync('qa/spark/expressions.png',faces.toBuffer('image/png'));
await sharp(sparkReviewFrame(0,'idle','neutral',576).toBuffer('image/png')).webp({quality:94,alphaQuality:100}).toFile('assets/finished/spark-portrait-v0211.webp');
console.log('Rendered full-body motion, facial-only expressions, and the matching portrait.');
