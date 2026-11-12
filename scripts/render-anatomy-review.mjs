// Render the exact game canvas path, including padding, head changes and shoulder rotations.
import {createRequire} from 'node:module';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {renderPuppetFrame} from '../rig-renderer.mjs';
import {ANATOMY} from '../anatomy-data.mjs';
import {rigPose} from '../rig-motion.mjs';
import {actionTiming} from '../motion.mjs';
import {EXPRESSIONS,expressionFor,bowNock} from '../expressions.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas'),sharp=require('sharp');
process.chdir(fileURLToPath(new URL('..',import.meta.url)));
const font='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc';
if(fs.existsSync(font))GlobalFonts.registerFromPath(font,'Review CJK');
const ids=Object.keys(ANATOMY),names=['橘座','阿墨','奶盖','火花','薄荷','螺丝','布丁','星斑'];
const labels={neutral:'平静',blink:'眨眼',attack:'攻击',skill:'施法',hurt:'受击',victory:'胜利',down:'退场'};
const images=Object.fromEntries(await Promise.all(ids.map(async id=>[id,await loadImage(ANATOMY[id].atlas)])));
export function characterFrame(id,time=0,expression,action='idle',width=288){
 const c=createCanvas(width,Math.round(width*138/144)),ctx=c.getContext('2d');
 const actor={id,catId:id,side:'p',hp:1},timing=actionTiming(actor,action),elapsed=time%2.4;
 if((action==='normal'||action==='skill')&&elapsed<timing.duration)actor.action={kind:action,...timing,elapsed};
 if(action==='hit'&&elapsed<.22)actor.hitUntil=time-elapsed+.22;
 if(action==='down'){actor.hp=0;actor.downAt=0;}
 const pose=rigPose(id,actor,time);pose.nock=bowNock(actor);
 const face=expression||expressionFor(id,actor,time,time);
 renderPuppetFrame(ctx,id,pose,images[id],c.width,c.height,null,{from:face,to:face,mix:1});return c;
}
export function reviewFrame(time=0,expression,action='idle'){
 const c=createCanvas(1200,800),ctx=c.getContext('2d');ctx.fillStyle='#293e46';ctx.fillRect(0,0,c.width,c.height);
 ids.forEach((id,i)=>{const x=i%4*300,y=Math.floor(i/4)*400;ctx.fillStyle='#d9c9a6';ctx.font='20px "Review CJK"';ctx.fillText(names[i],x+24,y+35);ctx.drawImage(characterFrame(id,time,expression,action),x+6,y+55);});return c;
}
export function expressionSheet(id){
 const c=createCanvas(1400,450),ctx=c.getContext('2d');ctx.fillStyle='#293e46';ctx.fillRect(0,0,c.width,c.height);
 ctx.font='24px "Review CJK"';ctx.fillStyle='#d9c9a6';ctx.fillText(names[ids.indexOf(id)]+' · 表情检查',25,40);
 EXPRESSIONS.forEach((face,i)=>{ctx.drawImage(characterFrame(id,0,face,'idle',200),i*200,95);ctx.font='18px "Review CJK"';ctx.fillText(labels[face],i*200+80,340);});return c;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 fs.mkdirSync('qa',{recursive:true});
 for(const face of EXPRESSIONS)fs.writeFileSync('qa/anatomy-'+face+'.png',reviewFrame(face==='attack'?.40:face==='skill'?.6:0,face,face==='attack'?'normal':face==='skill'?'skill':'idle').toBuffer('image/png'));
 for(const id of ids)fs.writeFileSync('qa/expressions-'+id+'.png',expressionSheet(id).toBuffer('image/png'));
 const portraits=createCanvas(1152,552),p=portraits.getContext('2d');
 ids.forEach((id,i)=>p.drawImage(characterFrame(id,0,'neutral'),i%4*288,Math.floor(i/4)*276));
 await sharp(portraits.toBuffer('image/png')).webp({quality:92,alphaQuality:100}).toFile('assets/anatomy/portraits.webp');
 console.log('Rendered seven expressions, eight expression sheets, and the matching loading portraits.');
}
