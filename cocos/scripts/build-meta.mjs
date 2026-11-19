import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
// RFC 4122 UUIDv5, stable across clones and platforms.
const namespace=Buffer.from('6ba7b8119dad11d180b400c04fd430c8','hex');
function uuid(name){const data=crypto.createHash('sha1').update(namespace).update('can-club-cocos/'+name).digest().subarray(0,16);data[6]=(data[6]&15)|80;data[8]=(data[8]&63)|128;const h=data.toString('hex');return [h.slice(0,8),h.slice(8,12),h.slice(12,16),h.slice(16,20),h.slice(20)].join('-');}
let manifest;try{manifest=JSON.parse(await fs.readFile(path.join(root,'asset-manifest.json'),'utf8'));}catch{}
const imageInfo=new Map(Object.values(manifest?.assets||{}).map(a=>['assets/resources/'+a.path,a]));
async function write(relative,isDir){
 const id=uuid(relative),ext=path.extname(relative).toLowerCase(),name=path.basename(relative,ext);
 let importer=isDir?'directory':ext==='.ts'?'typescript':ext==='.scene'?'scene':ext==='.effect'?'effect':ext==='.json'?'json':/\.(png|jpe?g)$/.test(ext)?'image':'text';
 let meta={ver:isDir?'1.2.0':importer==='typescript'?'4.0.24':importer==='scene'?'1.1.50':importer==='image'?'1.0.27':importer==='effect'?'1.7.1':'1.0.0',importer,imported:true,uuid:id,files:[],subMetas:{},userData:{}};
 if(importer==='typescript')meta.userData={isPlugin:false,loadPluginInWeb:true,loadPluginInNative:true,loadPluginInEditor:false};
 if(importer==='image'){
  const info=imageInfo.get(relative)||{};
  meta.files=['.json',ext];
  meta.subMetas={'6c48a':{ver:'1.0.22',importer:'texture',imported:true,uuid:id+'@6c48a',displayName:name,id:'6c48a',name:'texture',files:['.json'],subMetas:{},userData:{wrapModeS:'clamp-to-edge',wrapModeT:'clamp-to-edge',minfilter:'linear',magfilter:'linear',mipfilter:'none',anisotropy:0,isUuid:true,imageUuidOrDatabaseUri:id,visible:false}}};
  meta.userData={type:'texture',hasAlpha:info.hasAlpha??true,redirect:id+'@6c48a',fixAlphaTransparencyArtifacts:false};
 }
 if(importer==='scene')meta.files=['.json'];
 if(importer==='json')meta.files=['.json'];
 if(importer==='effect'){meta.files=['.json'];meta.userData={combinations:[{}]};}
 await fs.writeFile(path.join(root,relative+'.meta'),JSON.stringify(meta,null,2)+'\n');
}
async function walk(dir,relative){for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.name.endsWith('.meta'))continue;const rel=path.posix.join(relative,e.name);await write(rel,e.isDirectory());if(e.isDirectory())await walk(path.join(dir,e.name),rel);}}
await walk(path.join(root,'assets'),'assets');
// Scene references remain stable even before the entry script is first written.
await write('assets/scripts/CanClubGame.ts',false);
console.log('Creator metadata synchronized.');
