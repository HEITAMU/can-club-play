/** Stage the actual Cocos Web runtime for the repository's existing static site. */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repository=path.dirname(project), built=path.join(project,'build/web-mobile');
const output=path.join(repository,'cocos-preview');
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const write=async(name,data)=>{const target=path.join(output,name);await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,data);};
const manifest=JSON.parse(await fs.readFile(path.join(built,'asset-manifest.json'),'utf8'));
const buildReport=JSON.parse(await fs.readFile(path.join(built,'BUILD-REPORT.json'),'utf8'));
if(buildReport.engineVersion!=='3.8.8'||buildReport.creatorEditorBuild!==false)throw Error('Build the Cocos 3.8.8 source Web runtime first.');

let sourceImages=0,derivedImages=0,derivedBytes=0;
for(const [key,record] of Object.entries(manifest.assets)){
  if(record.sourceBytesPreserved){
    const source=await fs.readFile(path.join(repository,key));
    if(sha(source)!==record.sourceSha256)throw Error(`Original artwork no longer matches the built manifest: ${key}`);
    // The HTML base is cocos-preview/r/<runtime hash>/. Keep existing authored
    // files in their original location; the digest also separates old SW caches.
    record.path='../../../'+key+'?v='+record.sourceSha256.slice(0,16);
    sourceImages++;
  }else{
    const data=await fs.readFile(path.join(built,record.path));
    if(record.sha256&&sha(data)!==record.sha256)throw Error(`Generated artwork hash mismatch: ${key}`);
    const target='art/'+sha(data)+path.extname(record.path);
    await write(target,data);record.path='../../'+target;
    derivedImages++;derivedBytes+=data.length;
  }
}

const names=['cc.js','system.min.js','builtin-effects.mjs','painted-blend-shader.mjs','uniform-chunks.json','COCOS-LICENSE.md','game.js','boot.mjs'];
const files=new Map(await Promise.all(names.map(async name=>[name,await fs.readFile(path.join(built,name))])));
files.set('asset-manifest.json',Buffer.from(JSON.stringify(manifest)));
files.set('BUILD-REPORT.json',Buffer.from(JSON.stringify(buildReport,null,2)+'\n'));
const digest=crypto.createHash('sha256');
for(const [name,data] of [...files].sort(([a],[b])=>a<b?-1:a>b?1:0))digest.update(name+'\0').update(data).update('\0');
const revision=digest.digest('hex').slice(0,20),runtime='r/'+revision;
for(const [name,data] of files)await write(runtime+'/'+name,data);

// The old site's service worker special-cases every index.html. A separate
// play.html remains a normal network navigation; all runtime URLs are immutable.
const html=(await fs.readFile(path.join(built,'index.html'),'utf8')).replace('<head>','<head><base href="./'+runtime+'/">');
await write('play.html',html);
const report={engineVersion:'3.8.8',runtimeRevision:revision,entry:'play.html',runtimeDirectory:runtime,sourceRuntime:true,creatorEditorBuild:false,
  reusedOriginalImages:sourceImages,generatedImages:derivedImages,generatedImageBytes:derivedBytes,
  sourceBaseline:manifest.sourceCommit,verification:'The CI browser flow opens this exact staged route before publication.'};
await write('PREVIEW-REPORT.json',JSON.stringify(report,null,2)+'\n');
await write('README.md',`# 罐头远征队 · Cocos 3.8.8 试玩\n\n打开 [实际 Cocos 试玩](play.html)。当前运行文件指纹：\`${revision}\`。\n\n此页面由 \`cocos/\` 的同一份 TypeScript 业务、原生节点和官方 Cocos 3.8.8 源码引擎构建。已保留的正式 WebP 原图按 SHA-256 复用，表情与治疗纹理使用确定性生成的 PNG；没有替换为 HTML 界面或整页截图。\n\n生成方法：在 \`cocos/\` 执行 \`npm run build:web\`，再执行 \`npm run build:preview\`。运行文件和派生图片使用内容指纹路径，避免旧站缓存混用版本。\n\n此 Web 试玩不代表 Creator 编辑器正式构建、微信开发工具或手机真机验收通过；实际状态见 [迁移验收](../cocos/docs/MIGRATION-STATUS.md)。\n`);
console.log(JSON.stringify(report));
