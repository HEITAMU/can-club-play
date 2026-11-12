import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs';
import {reviewFrame} from './render-anatomy-review.mjs';
const require=createRequire(import.meta.url),sharp=require('sharp');
fs.mkdirSync('docs/review',{recursive:true});
await sharp(reviewFrame(0,'neutral').toBuffer('image/png')).webp({quality:92}).toFile('docs/review/anatomy-v015.webp');
const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgba','-video_size','1200x800','-framerate','24','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p','-movflags','+faststart','docs/review/anatomy-v015.mp4'],{stdio:['pipe','ignore','inherit']});
const phases=[['待机',undefined,'idle'],['普攻',undefined,'normal'],['技能',undefined,'skill'],['受击','hurt','hit'],['胜利','victory','idle']];
for(let i=0;i<240;i++){
 const phase=Math.floor(i/48),[label,expression,action]=phases[phase],time=i%48/24,frame=reviewFrame(time,expression,action),ctx=frame.getContext('2d');
 ctx.font='18px "Review CJK"';ctx.fillStyle='#b7c6b9';ctx.fillText(label+' · 拼装动作检查',900,780);
 const rgba=ctx.getImageData(0,0,1200,800).data;
 if(!ff.stdin.write(Buffer.from(rgba.buffer,rgba.byteOffset,rgba.byteLength)))await once(ff.stdin,'drain');
}
ff.stdin.end();const [code]=await once(ff,'exit');if(code!==0)throw Error('ffmpeg failed: '+code);
console.log('Wrote assembled character still and 10-second motion review.');
