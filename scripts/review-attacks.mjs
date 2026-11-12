// Actual game renderer at battle size and enlarged; no replacement art or poses.
import {createRequire} from 'node:module';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {ANATOMY} from '../anatomy-data.mjs';
import {rigPose} from '../rig-motion.mjs';
import {renderPuppetFrame} from '../rig-renderer.mjs';
import {actionTiming} from '../motion.mjs';
import {expressionFor,bowNock} from '../expressions.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage}=require('@napi-rs/canvas');
process.chdir(fileURLToPath(new URL('..',import.meta.url)));
const ids=Object.keys(ANATOMY),images=Object.fromEntries(await Promise.all(ids.map(async id=>[id,await loadImage(ANATOMY[id].atlas)])));
export function actorFrame(id,elapsed,width=216,kind='normal',face){
 const actor={id,catId:id,side:'p',hp:1},timing=actionTiming(actor,kind);
 if(elapsed>=0&&elapsed<timing.duration)actor.action={kind,...timing,elapsed};
 const pose=rigPose(id,actor,Math.max(0,elapsed),0);pose.nock=bowNock(actor);
 const key=face||expressionFor(id,actor,Math.max(0,elapsed),0),c=createCanvas(width,Math.round(width*138/144));
 renderPuppetFrame(c.getContext('2d'),id,pose,images[id],c.width,c.height,null,{from:key,to:key,mix:1});
 return c;
}
export function motionFrame(t,kind='normal'){
 const c=createCanvas(1000,620),ctx=c.getContext('2d');ctx.fillStyle='#293e46';ctx.fillRect(0,0,1000,620);
 ids.forEach((id,i)=>{const x=i%4*250,y=Math.floor(i/4)*310;ctx.fillStyle='#d9c9a6';ctx.font='18px sans-serif';ctx.fillText(id+' / '+kind,x+18,y+26);ctx.drawImage(actorFrame(id,t%1.8-.25,216,kind),x+17,y+35);ctx.drawImage(actorFrame(id,t%1.8-.25,69,kind),x+90,y+225);});
 return c;
}
export function sheet(){
 const c=createCanvas(1100,8*236),ctx=c.getContext('2d');ctx.fillStyle='#293e46';ctx.fillRect(0,0,c.width,c.height);
 ids.forEach((id,i)=>{const a={catId:id,side:'p'},timing=actionTiming(a),melee=['orange','pudding','bolt'].includes(id),prep=melee?timing.windup:timing.windup*.5,strike=melee?timing.impactAt:timing.windup;
  [-.01,prep,strike,strike+.1,timing.duration].forEach((t,j)=>{ctx.drawImage(actorFrame(id,t,190),j*220,i*236+32);ctx.drawImage(actorFrame(id,t,69),j*220+140,i*236+157);ctx.fillStyle='#d9c9a6';ctx.font='15px sans-serif';ctx.fillText(id+' '+['idle','lift','swing','follow','rest'][j],j*220+14,i*236+23);});});
 return c;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 fs.mkdirSync('qa',{recursive:true});fs.writeFileSync('qa/attacks-v0171.png',sheet().toBuffer('image/png'));
 const faces=createCanvas(1020,8*155),ctx=faces.getContext('2d');ctx.fillStyle='#293e46';ctx.fillRect(0,0,faces.width,faces.height);
 ids.forEach((id,i)=>['neutral','attack','blink','skill','hurt','victory','down'].forEach((face,j)=>{ctx.drawImage(actorFrame(id,-1,138,'normal',face),j*145,i*155+18);ctx.fillStyle='#d9c9a6';ctx.font='11px sans-serif';ctx.fillText(face,j*145+42,i*155+14);}));
 fs.writeFileSync('qa/faces-v0171.png',faces.toBuffer('image/png'));
 console.log('qa/attacks-v0171.png; qa/faces-v0171.png');
}
