import fs from 'node:fs';import {createRequire} from 'node:module';import {execFileSync} from 'node:child_process';
import {Battle,initialState} from '../core.mjs';import {rigPose} from '../rig-motion.mjs';import {renderPuppetFrame} from '../rig-renderer.mjs';import {prepareRosterFrames,setRosterCanvasFactory} from '../finished-roster-renderer.mjs?v=0.21.14';import {sampleShidun,paintShidun} from '../shidun-fx.mjs';
const require=createRequire(import.meta.url),{createCanvas,loadImage,Image}=require('@napi-rs/canvas'),sharp=require('sharp');sharp.concurrency(1);sharp.cache(false);const pending=[];setRosterCanvasFactory(createCanvas,c=>{const im=new Image();pending.push(new Promise((r,j)=>{im.onload=r;im.onerror=j;}));im.src=c.toBuffer('image/png');return im;});const atlas=await loadImage(await sharp('assets/finished/pudding-v0216.webp').png().toBuffer());prepareRosterFrames('pudding',atlas);await Promise.all(pending);
const c=createCanvas(960,720),ctx=c.getContext('2d');
const bg=await loadImage(await sharp('assets/scenes/streets-v019.webp').png().toBuffer());ctx.drawImage(bg,0,0,418,627,0,0,960,720);
const hero={hp:1000,catId:'pudding',action:{shieldStrike:true,elapsed:.5,impactAt:.42,duration:1.07},shieldPunch:{state:'punching'},shidunImpactAt:0};
const sprite=createCanvas(340,326);renderPuppetFrame(sprite.getContext('2d'),'pudding',rigPose('pudding',hero,.5,.5),atlas,340,326,null,{to:'neutral'});ctx.drawImage(sprite,90,300);
for(const p of sampleShidun(hero,.035,{x:260,y:480},210,960,720))paintShidun(ctx,p);
fs.writeFileSync('docs/review/shidun/v0211/impact-preview.png',c.toBuffer('image/png'));
