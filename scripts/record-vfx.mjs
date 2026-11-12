import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs';
import {fixture,advance,draw} from './review-vfx.mjs';
const require=createRequire(import.meta.url),{createCanvas}=require('@napi-rs/canvas');
const ids=['orange','milk','spark','mint','bolt','star'],names=['护盾 · 承伤 · 破碎','治疗 · 螺旋上升','火焰 · 翻卷与燃烧','冰晶 · 飞行与碎裂','挥击 · 展开与撞击','星光 · 回能与消散'];
let scenes=ids.map(fixture);
for(const v of scenes){v.b.enemies[0].wait=2.2;v.b.enemies[0].interval=.9;v.b.enemies[0].atk=70;}
fs.mkdirSync('qa',{recursive:true});
const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgba','-video_size','1170x744','-framerate','60','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart','qa/vfx-v016.mp4'],{stdio:['pipe','ignore','inherit']});
for(let frame=0;frame<360;frame++){
 const c=createCanvas(1170,744),ctx=c.getContext('2d');ctx.fillStyle='#243940';ctx.fillRect(0,0,1170,744);
 for(let i=0;i<scenes.length;i++){
  const v=scenes[i],x=i%3*390,y=Math.floor(i/3)*372;const image=draw(v);ctx.drawImage(image,x,y+42);ctx.font='18px "Review CJK"';ctx.fillStyle='#e1cea8';ctx.fillText(names[i],x+16,y+29);advance(v,1/60*.9);
 }
 const bytes=ctx.getImageData(0,0,c.width,c.height).data;if(!ff.stdin.write(Buffer.from(bytes.buffer,bytes.byteOffset,bytes.byteLength)))await once(ff.stdin,'drain');
 if([72,90,102,114,190].includes(frame))fs.writeFileSync('qa/motion-'+frame+'.png',c.toBuffer('image/png'));
}
ff.stdin.end();const [code]=await once(ff,'exit');if(code)throw Error('Video render failed: '+code);console.log('Six skills, 60 fps, six-second same-renderer review in qa/vfx-v016.mp4.');
