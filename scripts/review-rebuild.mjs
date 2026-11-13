import fs from 'node:fs';
import {createRequire} from 'node:module';
import {characterFrame} from './render-anatomy-review.mjs';
import {actionTiming} from '../motion.mjs';
import {ARTICULATED} from '../articulated-data.mjs';
const require=createRequire(import.meta.url),{createCanvas}=require('@napi-rs/canvas'),sharp=require('sharp');
fs.mkdirSync('qa/rebuild',{recursive:true});
for(const id of Object.keys(ARTICULATED)){
 const canvas=createCanvas(1440,960),ctx=canvas.getContext('2d');ctx.fillStyle='#34484e';ctx.fillRect(0,0,1440,960);
 for(const [row,kind] of ['normal','skill'].entries()){
  const timing=actionTiming({catId:id,side:'p'},kind),times=[0,timing.windup*.65,timing.windup,timing.impactAt,timing.impactAt+timing.hold,timing.duration-.12];
  times.forEach((t,col)=>{ctx.fillStyle='#ead7b4';ctx.font='16px sans-serif';ctx.fillText(kind+' '+t.toFixed(2)+'s',col*240+15,row*480+26);ctx.drawImage(characterFrame(id,t,t===0?'neutral':kind==='skill'?'skill':'attack',kind,288),col*240-24,row*480+30);
   ctx.save();ctx.translate(col*240+240,row*480+270);ctx.scale(-1,1);ctx.drawImage(characterFrame(id,t,t===0?'neutral':kind==='skill'?'skill':'attack',kind,260),-10,0);ctx.restore();});
 }
 fs.writeFileSync('qa/rebuild/'+id+'-hands.png',canvas.toBuffer('image/png'));
}
console.log('Rendered actual game limbs at six action times, in both facing directions.');
await sharp(characterFrame('orange',0,'neutral','idle',288).toBuffer('image/png')).webp({quality:94,alphaQuality:100}).toFile('assets/rebuild/orange-portrait.webp');
