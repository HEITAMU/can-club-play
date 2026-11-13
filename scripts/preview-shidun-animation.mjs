import fs from 'node:fs';import {createRequire} from 'node:module';import {execFileSync} from 'node:child_process';
import {Battle,initialState} from '../core.mjs';import {rigPose} from '../rig-motion.mjs';import {renderPuppetFrame} from '../rig-renderer.mjs';import {prepareRosterFrames,setRosterCanvasFactory} from '../finished-roster-renderer.mjs?v=0.21.14';import {sampleShidun,paintShidun} from '../shidun-fx.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage,Image}=require('@napi-rs/canvas'),sharp=require('sharp');sharp.concurrency(1);sharp.cache(false);const pending=[];setRosterCanvasFactory(createCanvas,c=>{const im=new Image();pending.push(new Promise((r,j)=>{im.onload=r;im.onerror=j;}));im.src=c.toBuffer('image/png');return im;});const atlas=await loadImage(await sharp('assets/finished/pudding-v0216.webp').png().toBuffer());prepareRosterFrames('pudding',atlas);await Promise.all(pending);
const bg=await loadImage(await sharp('assets/scenes/streets-v019.webp').png().toBuffer());
const effect=await loadImage('assets/vfx/shidun-impact-v0211.png');
const dir='docs/review/shidun/v0211';fs.mkdirSync(dir+'/animation',{recursive:true});
for(let i=0;i<60;i++){
 const t=i/30,c=createCanvas(960,720),ctx=c.getContext('2d');ctx.drawImage(bg,0,0,418,627,0,0,960,720);
 const impact=t-.65;
 const hero={hp:1000,catId:'pudding',shieldPunch:t<.65?{state:'charging',firstAt:0,config:{minCharge:.65}}:{state:'normal'},action:impact>=0&&impact<.8?{shieldStrike:true,elapsed:impact+.42,impactAt:.42,duration:1.25}:null};
 const sprite=createCanvas(340,326);renderPuppetFrame(sprite.getContext('2d'),'pudding',rigPose('pudding',hero,t,t),atlas,340,326,null,{to:'neutral'});ctx.drawImage(sprite,90,300);
 if(impact>=0&&impact<.6){const f=Math.min(11,Math.floor(impact/.05));ctx.drawImage(effect,(f%3)*512,Math.floor(f/3)*256,512,256,290,233,660,330);}
 fs.writeFileSync(dir+'/animation/'+String(i).padStart(3,'0')+'.png',c.toBuffer('image/png'));
}
execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-framerate','30','-i',dir+'/animation/%03d.png','-vf','split[a][b];[a]palettegen[p];[b][p]paletteuse','-loop','0',dir+'/punch-animation.gif']);
