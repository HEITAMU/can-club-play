import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';import {spawn} from 'node:child_process';
import {ORDER,CHARACTERS} from './characters.mjs';import {drawActor} from './render.mjs';import {sceneAction,renderStage} from './stage.mjs';import {sampleAction} from './motion.mjs';
import {scriptedShieldPunch,shieldPunchPose} from './shield-punch.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage,GlobalFonts}=require('@napi-rs/canvas'),sharp=require('sharp');
const root=path.dirname(fileURLToPath(import.meta.url));GlobalFonts.registerFromPath('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc','Review CJK');
export async function resources(){const atlas=JSON.parse(fs.readFileSync(path.join(root,'assets/atlas.json')));const files=new Set(Object.values(atlas.characters).flatMap(a=>[a.atlas,...Object.values(a.partAtlases||{}),...Object.values(a.faceAtlases||{})]));const images=Object.fromEntries(await Promise.all([...files].map(async p=>[p,await loadImage(path.join(root,p))])));return{atlas,images};}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const {atlas,images}=await resources();fs.mkdirSync(path.join(root,'review'),{recursive:true});
 const thumbs=createCanvas(1600,200),tc=thumbs.getContext('2d');ORDER.forEach((id,i)=>drawActor(tc,atlas,images,id,{face:'neutral'},i*160+78,190,175));await sharp(thumbs.toBuffer('image/png')).webp({quality:94,alphaQuality:100}).toFile(path.join(root,'assets/portraits.webp'));
 const sheet=createCanvas(1500,840),ctx=sheet.getContext('2d');ctx.fillStyle='#2d474c';ctx.fillRect(0,0,1500,840);ORDER.forEach((id,i)=>{const x=i%5*300+145,y=Math.floor(i/5)*400+355;drawActor(ctx,atlas,images,id,{face:'neutral'},x,y,270);ctx.fillStyle='#f2dfbb';ctx.font='bold 26px "Review CJK"';ctx.fillText(CHARACTERS[id].name,x-95,y+38);ctx.font='15px "Review CJK"';ctx.fillStyle='#b9cdc0';ctx.fillText(CHARACTERS[id].personality,x-95,y+65);});fs.writeFileSync(path.join(root,'review/lineup.png'),sheet.toBuffer('image/png'));
 for(const id of ['night','spark','mint','pudding','inkstone']){
  const a=sceneAction(id,-1),strip=createCanvas(1500,380),sc=strip.getContext('2d');sc.fillStyle='#2d474c';sc.fillRect(0,0,1500,380);
  [-.1,a.release-.01,a.hit,a.retreat,a.end+.1].forEach((t,i)=>{const p=sampleAction(a,t);drawActor(sc,atlas,images,id,p,i*300+130,310,255);sc.font='bold 18px "Review CJK"';sc.fillStyle='#e7d7b6';sc.fillText(p.phase,i*300+40,355);});fs.writeFileSync(path.join(root,`review/${id}-poses.png`),strip.toBuffer('image/png'));
 }

 const ults=createCanvas(1440,1096),uc=ults.getContext('2d');uc.fillStyle='#213b40';uc.fillRect(0,0,1440,1096);
 for(const [i,id] of ORDER.entries()){const index=1,a=sceneAction(id,index),t=id==='pudding'?2.07:a.hit+.24,x=i%3*480,y=Math.floor(i/3)*274;uc.save();uc.translate(x,y+26);renderStage(uc,atlas,images,id,index,t,480,248);uc.restore();uc.font='bold 17px "Review CJK"';uc.fillStyle='#f0ddb6';uc.fillText(CHARACTERS[id].name,x+18,y+20);}fs.writeFileSync(path.join(root,'review/ultimates.png'),ults.toBuffer('image/png'));
 const sequence=createCanvas(1800,742),sq=sequence.getContext('2d');sq.fillStyle='#213b40';sq.fillRect(0,0,1800,742);
 for(const [i,t] of [.2,1.35,1.8,1.97,2.12,3.1].entries()){const x=i%3*600,y=Math.floor(i/3)*371;sq.save();sq.translate(x,y+34);const res=renderStage(sq,atlas,images,'pudding',1,t,600,325);sq.restore();sq.font='bold 21px "Review CJK"';sq.fillStyle='#f0ddb6';sq.fillText(res.pose.phase,x+20,y+25);}fs.writeFileSync(path.join(root,'review/xuanyue-sequence.png'),sequence.toBuffer('image/png'));
 if(process.argv.includes('--video')){
  const clips=[['pudding',-1],['pudding',1],['pudding',1,true],['orange',1],['ink',1],['milk',1],['spark',1],['mint',1],['bolt',1],['star',1],['night',1],['inkstone',1]],w=960,h=590,fps=24;
  const out=path.join(root,'review/batch01-motion.mp4');const enc=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',out],{stdio:['pipe','ignore','pipe']});let error='';enc.stderr.on('data',b=>error+=b);const cv=createCanvas(w,h),v=cv.getContext('2d');
  for(const [id,index,interrupted]of clips){const a=sceneAction(id,index),end=a.end+.25;for(let f=0;f<Math.ceil((end+.25)*fps);f++){const t=f/fps-.25;v.fillStyle='#213b40';v.fillRect(0,0,w,h);v.save();v.translate(0,52);renderStage(v,atlas,images,id,index,t,w,520,{interrupted});v.restore();v.font='bold 25px "Review CJK"';v.fillStyle='#f0ddb6';v.fillText(CHARACTERS[id].name+' · '+(index<0?'普攻':interrupted?'蓄力被控打断':'大技能'),32,36);v.font='16px "Review CJK"';v.fillStyle='#aac3b9';v.fillText(CHARACTERS[id].personality,290,34);if(!enc.stdin.write(cv.toBuffer('image/png')))await new Promise(r=>enc.stdin.once('drain',r));}console.log('video',id);}
  enc.stdin.end();await new Promise((res,rej)=>enc.on('exit',code=>code===0?res():rej(Error(error))));console.log(out);
 }
 console.log('Review images rendered from the actual reusable rig.');
}
