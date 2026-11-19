import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

// Cocos 3.8's current WeChat guidance: main <= 4 M, all subpackages <= 30 M;
// it explicitly places no independent size limit on one subpackage.
// Count main+subpackages against 30 MiB conservatively, and count source bytes
// before WeChat DevTools repacks them. This is not a claim about upload bytes.
export const WECHAT_PACKAGE_LIMITS={mainBytes:4*1024*1024,totalBytes:30*1024*1024};
export const WECHAT_PACKAGE_RULES_URL='https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/subpackage.html';
const normalize=value=>String(value||'').replaceAll('\\','/').replace(/^\.\//,'').replace(/\/+$/,'');
export async function measureWechatPackage(directory){
 const root=path.resolve(directory),game=JSON.parse(await fs.readFile(path.join(root,'game.json'),'utf8'));
 let config={};try{config=JSON.parse(await fs.readFile(path.join(root,'project.config.json'),'utf8'));}catch{}
 const ignored=(config.packOptions?.ignore||[]).filter(x=>x.type==='file'||x.type==='folder').map(x=>({...x,value:normalize(x.value)}));
 const subpackages=(game.subpackages||game.subPackages||[]).map(p=>({name:p.name||p.root,root:normalize(p.root),bytes:0,files:0}));
 for(const p of subpackages)if(!p.root||path.posix.isAbsolute(p.root)||p.root.split('/').includes('..'))throw Error('Invalid WeChat subpackage root: '+p.root);
 const files=[];
 async function walk(directory,relative=''){
  for(const entry of await fs.readdir(directory,{withFileTypes:true})){
   const name=path.posix.join(relative,entry.name),full=path.join(directory,entry.name);
   if(ignored.some(rule=>rule.type==='file'?name===rule.value:name===rule.value||name.startsWith(rule.value+'/')))continue;
   if(entry.isSymbolicLink())throw Error('WeChat package contains a symlink: '+name);
   if(entry.isDirectory())await walk(full,name);
   else if(entry.isFile())files.push({path:name,bytes:(await fs.stat(full)).size});
  }
 }
 await walk(root);
 let mainBytes=0,mainFiles=0;
 for(const file of files){
  const sub=subpackages.find(p=>file.path.startsWith(p.root+'/'));
  if(sub){sub.bytes+=file.bytes;sub.files++;}else{mainBytes+=file.bytes;mainFiles++;}
 }
 const totalBytes=files.reduce((n,f)=>n+f.bytes,0),violations=[];
 if(mainBytes>WECHAT_PACKAGE_LIMITS.mainBytes)violations.push(`主包 ${mainBytes} B 超过 4 MiB (${WECHAT_PACKAGE_LIMITS.mainBytes} B)`);
 if(totalBytes>WECHAT_PACKAGE_LIMITS.totalBytes)violations.push(`主包和所有分包 ${totalBytes} B 超过本工程的 30 MiB 保守总预算`);
 return {mainBytes,mainFiles,totalBytes,subpackages,limits:WECHAT_PACKAGE_LIMITS,measurement:'recursive uncompressed file bytes, honoring explicit file/folder pack ignores',rules:WECHAT_PACKAGE_RULES_URL,passed:violations.length===0,violations};
}
export function assertWechatPackageBudget(report){
 if(!report.passed){const error=new Error('WeChat package budget failed: '+report.violations.join('; '));error.code='CAN_CLUB_WECHAT_PACKAGE_TOO_LARGE';throw error;}
 return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const report=await measureWechatPackage(process.argv[2]||'build/wechatgame');
 console.log(JSON.stringify(report,null,2));assertWechatPackageBudget(report);
}
