import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../wechat/package.json',import.meta.url)),sharp=require('sharp');
const root=new URL('../',import.meta.url),out=new URL('assets/mobile/',root);await fs.mkdir(out,{recursive:true});
const report=[];
for(let i=0;i<6;i++){
 const source=new URL('assets/scenes/streets-v019.webp',root),dest=new URL(`street-${i}-v02684.webp`,out);
 await sharp(await fs.readFile(source)).extract({left:i%3*418,top:Math.floor(i/3)*627,width:418,height:627}).webp({quality:84,effort:6}).toFile(dest.pathname);
 report.push({file:dest.pathname.split('/').at(-1),bytes:(await fs.stat(dest)).size});
}
console.log(JSON.stringify(report));
