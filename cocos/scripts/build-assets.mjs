import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import crypto from 'node:crypto';
const require=createRequire(import.meta.url),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sharp=require('sharp');
const args=process.argv.slice(2),sourceFlag=args.indexOf('--source');
const frozenSource=path.join(root,'../../baseline-preview11');
let defaultSource=frozenSource;try{await fs.access(path.join(frozenSource,'assets/finished/orange-v0213.webp'));}catch{defaultSource=path.join(root,'..');}
const source=path.resolve(sourceFlag>=0?args[sourceFlag+1]:process.env.CAN_CLUB_SOURCE||defaultSource);
const resources=path.join(root,'assets/resources'),out=path.join(resources,'art');
const manifestPath=path.join(root,'asset-manifest.json');
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
let previous;try{previous=JSON.parse(await fs.readFile(manifestPath,'utf8'));}catch{}
const assets=previous?.assets||{},audit=[];
const list=[
 'finished/orange-v0213.webp','finished/ink-v0213.webp','finished/milk-v0213.webp','finished/spark-v0211.webp',
 'finished/mint-v0213.webp','finished/bolt-v0216.webp','finished/pudding-v0216.webp','finished/star-v0213.webp',
 'finished/orange-portrait-v0213.webp','finished/ink-portrait-v0213.webp','finished/milk-portrait-v0213.webp','finished/spark-portrait-v0211.webp',
 'finished/mint-portrait-v0213.webp','finished/bolt-portrait-v0213.webp','finished/pudding-portrait-v0216.webp','finished/star-portrait-v0213.webp',
 'painted/enemies-a.webp','painted/enemies-b.webp','painted/enemies-c.webp','painted/carriers-v02652.webp','painted/items.webp',
 'materials/harbor-materials-v02641.webp','materials/scrap-v02643.webp',
 'scenes/neighborhood-v0220.webp','scenes/streets-v019.webp','scenes/commissions-v02646.webp','scenes/formation-room-v02620.webp',
 'scenes/formation-ground-v02646.webp','scenes/quest-locations-v02672.webp','scenes/equipment-room-v02672.webp',
 'ui/battle-results-v02641.webp','ui/cat-tag-wide-v02679.webp','ui/paper-grain-v02642.webp','ui/companion-keepsakes-v0282.webp',
 'ui/income-stall-v0272.webp','ui/equipment-slots-v0281.webp','ui/equipment-v02643.webp','ui/runes-v02643.webp','ui/skills-v02644.webp',
 'ui/crew-props-v02642.webp','ui/commission-board-v02641.webp','ui/journal-challenge-v02677.webp',
 'ui/critical-physical-v02658.webp','ui/critical-magic-v02658.webp',
 'vfx/effects-v0216.webp','vfx/shidun-impact-v0211.webp','vfx/can-rescue-v0192.webp',
 ...Array.from({length:6},(_,i)=>`mobile/street-${i}-v02684.webp`)
];
async function prepare(sourcePath,key,relative,originalCopy=false) {
 const dest=path.join(out,relative),data=await fs.readFile(sourcePath),hash=sha(data);
 let record=assets[key];
 if(!args.includes('--refresh')&&record?.sourceSha256===hash) {
  try{await fs.access(dest);audit.push({...record,key,reused:true});return;}catch{}
 }
 const image=sharp(data),meta=await image.metadata();
 // Preserve authored pixels and resolution. Conversion never invokes resize or palette quantization.
 const bytes=originalCopy?data:await image.png({compressionLevel:9,adaptiveFiltering:true}).toBuffer();
 await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,bytes);
 const converted=await sharp(bytes).metadata();
 if(converted.width!==meta.width||converted.height!==meta.height)throw Error(`Resolution changed: ${key}`);
 record={path:'art/'+relative,resource:'art/'+relative.replace(/\.[^.]+$/,''),width:meta.width,height:meta.height,bytes:bytes.length,sha256:sha(bytes),sourceSha256:hash,hasAlpha:!!meta.hasAlpha};
 assets[key]=record;audit.push({...record,key,reused:false});
}
let sourceExists=true;try{await fs.access(path.join(source,'assets/finished/orange-v0213.webp'));}catch{sourceExists=false;}
if(sourceExists) {
 let index=0;
 await Promise.all(Array.from({length:3},async()=>{while(index<list.length){const relative=list[index++];await prepare(path.join(source,'assets',relative),'assets/'+relative,relative.replace(/\.webp$/,'.png'));}}));
} else if(!previous)throw Error('原画输入不存在；传 --source <冻结preview11源码路径>。已有资源不需要重复转换。');
async function sourceArt(dir,relative=''){
 let entries;try{entries=await fs.readdir(dir,{withFileTypes:true});}catch{return;}
 for(const e of entries) {
  const rel=path.posix.join(relative,e.name),file=path.join(dir,e.name);
  if(e.isDirectory())await sourceArt(file,rel);
  else if(/\.(png|jpe?g)$/i.test(e.name))await prepare(file,'assets/cocos/'+rel,'cocos/'+rel,true);
 }
}
await sourceArt(path.join(root,'source-art'));
for(const [key,record] of Object.entries(assets))try{await fs.access(path.join(resources,record.path));}catch{throw Error(`Missing prepared resource ${key}; run npm run prepare:project from the source repository.`);}
const manifest={version:'0.28.0-preview.11-cocos.1',sourceCommit:'28eb867',resolutionPolicy:'original-authored-pixels',assets};
await fs.mkdir(resources,{recursive:true});
await fs.writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile(path.join(resources,'asset-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
await fs.writeFile(path.join(root,'docs/asset-audit.json'),JSON.stringify({sourceCommit:'28eb867',count:Object.keys(assets).length,totalBytes:Object.values(assets).reduce((n,a)=>n+a.bytes,0),forbidden:['assets/concepts','orange-puppet','finished/orange-parts'],assets:audit},null,2)+'\n');
console.log(JSON.stringify({assets:Object.keys(assets).length,bytes:Object.values(assets).reduce((n,a)=>n+a.bytes,0),output:out}));
