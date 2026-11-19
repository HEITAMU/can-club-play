import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';
import {measureWechatPackage,assertWechatPackageBudget} from './check-wechat-package.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),require=createRequire(import.meta.url);
function dependency(name){
 try{return require(name);}catch{}
 throw Error(`Missing ${name}. Run npm ci in cocos/ to install the locked toolchain.`);
}
const esbuild=dependency('esbuild'),args=process.argv.slice(2);
const buildWeb=!args.includes('--wechat')||args.includes('--web'),buildWechat=!args.includes('--web')||args.includes('--wechat');
const run=script=>{const result=spawnSync(process.execPath,[path.join(root,'scripts',script)],{stdio:'inherit',cwd:root,env:process.env});if(result.status!==0)throw Error(`${script} failed`);};
if(!args.includes('--code-only')||args.includes('--faces')){
 let generatedReady=false;
 try{
  const entries=JSON.parse(await fs.readFile(path.join(root,'source-art/expressions.json'),'utf8')).frames;
  const generated=[...entries.map(e=>e.path.replace('assets/cocos/','')),...['heal-light','heal-light-vertical','heal-mote','heal-cross'].map(name=>'effects/'+name+'.png')];
  await Promise.all(generated.map(name=>fs.access(path.join(root,'source-art',name))));generatedReady=entries.length===57;
 }catch{}
 if(args.includes('--faces')||!generatedReady)run('prepare-faces.mjs');
 run('build-assets.mjs');
}
run('build-painted-effect.mjs');
run('build-meta.mjs');
const manifest=JSON.parse(await fs.readFile(path.join(root,'asset-manifest.json'),'utf8'));
const engine=JSON.parse(await fs.readFile(path.join(root,'vendor/engine-manifest.json'),'utf8'));
const hash=data=>crypto.createHash('sha256').update(data).digest('hex');
const write=async(p,s)=>{await fs.mkdir(path.dirname(p),{recursive:true});await fs.writeFile(p,s);};
const copy=async(a,b)=>{await fs.mkdir(path.dirname(b),{recursive:true});await fs.copyFile(a,b);};
const config={version:manifest.version,sourceCommit:manifest.sourceCommit,rewardedAdUnitId:process.env.WECHAT_REWARDED_AD_UNIT_ID||'',sourceRuntime:true,creatorEditorBuild:false};
if(config.rewardedAdUnitId&&!/^adunit-[\w-]+$/.test(config.rewardedAdUnitId))throw Error('Invalid WECHAT_REWARDED_AD_UNIT_ID');
// Match Preview11's WeChat ES2019 syntax baseline. Safari 14 is deliberately
// not an esbuild target: its destructuring-bug flag asks esbuild to perform a
// transform that esbuild does not implement. Device compatibility is a separate
// verification gate; the shared bundle still lowers optional chaining and ??=.
const shared={entryPoints:[path.join(root,'assets/scripts/CanClubGame.ts')],bundle:true,platform:'neutral',format:'cjs',target:'es2019',write:false,minify:!args.includes('--debug'),sourcemap:false,external:['cc'],tsconfigRaw:{compilerOptions:{experimentalDecorators:true,useDefineForClassFields:false,target:'ES2020'}}};
const result=await esbuild.build(shared),code=result.outputFiles[0].text;
const gameSettings={rendering:{renderMode:0,customPipeline:false},assets:{preloadBundles:[],preloadAssets:[]},screen:{designResolution:{width:390,height:844,policy:4},frameRate:60},launch:{launchScene:''},splashScreen:{totalTime:0}};
async function runtimeAssets(out,preferWebp){
 const assets={};let bytes=0,sourceCopies=0;
 for(const [key,record] of Object.entries(manifest.assets)){
  let relative=record.path,input=path.join(root,'assets/resources',record.path),keptSource=false;
  if(preferWebp&&/\.webp$/.test(key)){
   const original=path.join(root,'..',key);
   try{const data=await fs.readFile(original);if(hash(data)===record.sourceSha256){input=original;relative=record.path.replace(/\.png$/,'.webp');keptSource=true;}}catch{}
  }
  await copy(input,path.join(out,relative));
  const size=(await fs.stat(input)).size;bytes+=size;if(keptSource)sourceCopies++;
  assets[key]={...record,path:relative,bytes:size,sourceBytesPreserved:keptSource};
 }
 return {manifest:{...manifest,assets},bytes,sourceCopies};
}
if(buildWeb){
 const out=path.join(root,'build/web-mobile');await fs.mkdir(out,{recursive:true});
 const art=await runtimeAssets(out,true);
 await copy(path.join(root,'vendor/cc-web-3.8.8.js'),path.join(out,'cc.js'));
 await copy(path.join(root,'vendor/system.min.js'),path.join(out,'system.min.js'));
 await copy(path.join(root,'vendor/builtin-effects.mjs'),path.join(out,'builtin-effects.mjs'));
 await copy(path.join(root,'vendor/painted-blend-shader.mjs'),path.join(out,'painted-blend-shader.mjs'));
 await copy(path.join(root,'vendor/uniform-chunks.json'),path.join(out,'uniform-chunks.json'));
 await copy(path.join(root,'vendor/COCOS-LICENSE.md'),path.join(out,'COCOS-LICENSE.md'));
 await write(path.join(out,'asset-manifest.json'),JSON.stringify(art.manifest));
 await write(path.join(out,'game.js'),`export function loadGame(cc){const module={exports:{}};const exports=module.exports;const require=name=>{if(name==='cc')return cc;throw new Error('Unsupported runtime import '+name);};\n${code}\nreturn module.exports;}\n`);
 await write(path.join(out,'index.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no"><title>罐头远征队 · Cocos 3.8.8</title><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#16130f}#GameDiv,#Cocos3dGameContainer,#GameCanvas{width:100%;height:100%;display:block;touch-action:none}#GameDiv{position:relative}#boot-status{position:absolute;inset:45% 8% auto;color:#f3e6ce;text-align:center;font:16px sans-serif;pointer-events:none}</style></head><body><div id="GameDiv"><div id="Cocos3dGameContainer"><canvas id="GameCanvas" tabindex="0" oncontextmenu="event.preventDefault()"></canvas></div><div id="boot-status">正在准备远征…</div></div><script src="./system.min.js"></script><script type="module" src="./boot.mjs"></script></body></html>`);
 await write(path.join(out,'boot.mjs'),`import {loadGame} from './game.js';import {installRuntimeMaterials} from './builtin-effects.mjs';\nglobalThis.CAN_CLUB_CONFIG=${JSON.stringify(config)};const status=document.querySelector('#boot-status');try{const [cc,manifest,chunks]=await Promise.all([System.import('./cc.js'),fetch('./asset-manifest.json').then(r=>r.json()),fetch('./uniform-chunks.json').then(r=>r.json())]);globalThis.CAN_CLUB_ASSET_MANIFEST=manifest;globalThis.__CAN_CLUB_ENGINE__=cc;installRuntimeMaterials(cc,chunks);await cc.game.init({debugMode:1,overrideSettings:${JSON.stringify(gameSettings)}});cc.view.enableRetina(true);cc.view.resizeWithBrowserSize(true);const api=loadGame(cc);cc.game.run(async()=>{try{globalThis.__CAN_CLUB_APP__=await api.bootGame();status.remove();}catch(error){globalThis.__CAN_CLUB_BOOT_ERROR__={message:String(error.message||error),stack:error.stack||''};status.textContent='进入失败：'+error.message;console.error(error);}});}catch(error){globalThis.__CAN_CLUB_BOOT_ERROR__={message:String(error.message||error),stack:error.stack||''};status.textContent='资源加载失败：'+error.message;console.error(error);}\n`);
 await write(path.join(out,'BUILD-REPORT.json'),JSON.stringify({...config,engineVersion:engine.version,engineCommit:engine.gitCommit,assets:Object.keys(manifest.assets).length,assetBytes:art.bytes,originalWebpFiles:art.sourceCopies,entry:'bootGame',canvas:'Cocos WebGL native nodes',creatorEditorBuild:false},null,2));
 console.log(JSON.stringify({platform:'web-mobile',out,assets:Object.keys(manifest.assets).length,assetBytes:art.bytes,originalWebpFiles:art.sourceCopies}));
}
if(buildWechat){
 const out=path.join(root,'build/wechatgame'),remote=path.join(root,'build/remote-art');await fs.mkdir(out,{recursive:true});
 const preferWebp=process.env.WECHAT_TEXTURE_FORMAT==='webp',art=await runtimeAssets(remote,preferWebp);
 const base=process.env.WECHAT_ASSET_BASE_URL||'';
 if(base&&!/^https:\/\//.test(base))throw Error('WECHAT_ASSET_BASE_URL must be HTTPS and a registered download domain.');
 const runtimeManifest={...art.manifest,baseUrl:base?base.replace(/\/?$/,'/'):'' ,requiresRemoteBaseUrl:true};
 for(const [from,to] of [['cc-wechat-3.8.8.js','cc.js'],['web-adapter.js','web-adapter.js'],['engine-adapter.js','engine-adapter.js'],['COCOS-LICENSE.md','COCOS-LICENSE.md']])await copy(path.join(root,'vendor',from),path.join(out,to));
 const effects=await esbuild.build({entryPoints:[path.join(root,'vendor/builtin-effects.mjs')],bundle:true,format:'cjs',platform:'neutral',target:'es2019',write:false,minify:true,tsconfigRaw:{}});
 await write(path.join(out,'builtin-effects.js'),effects.outputFiles[0].text);
 await copy(path.join(root,'vendor/uniform-chunks.json'),path.join(out,'uniform-chunks.json'));
 await write(path.join(out,'runtime.js'),code.replace(/require\(["']cc["']\)/g,'require("./cc.js")'));
 await write(path.join(out,'asset-manifest.json'),JSON.stringify(runtimeManifest));
 await write(path.join(out,'runtime-config.json'),JSON.stringify(config,null,2));
 await write(path.join(out,'game.js'),`globalThis.__wxRequire=require;require('./web-adapter.js');const config=require('./runtime-config.json');globalThis.CAN_CLUB_CONFIG=config;globalThis.CAN_CLUB_ASSET_MANIFEST=require('./asset-manifest.json');function start(){const cc=require('./cc.js');require('./engine-adapter.js');require('./builtin-effects.js').installRuntimeMaterials(cc,require('./uniform-chunks.json'));cc.game.init({debugMode:1,overrideSettings:${JSON.stringify(gameSettings)}}).then(()=>cc.game.run(async()=>{try{await require('./runtime.js').bootGame();}catch(error){fail(error);}})).catch(fail);function fail(error){globalThis.__CAN_CLUB_BOOT_ERROR__={message:String(error.message||error),stack:error.stack||''};console.error(error);wx.showModal({title:'进入失败',content:String(error.message||error),showCancel:false});}}const info=wx.getSystemInfoSync();if(String(info.platform).toLowerCase()==='android')GameGlobal.requestAnimationFrame(start);else start();\n`);
 await write(path.join(out,'game.json'),JSON.stringify({deviceOrientation:'portrait',showStatusBar:false,networkTimeout:{request:20000,downloadFile:30000}},null,2));
 const appid=process.env.WECHAT_APPID||'wx43da24c6ac1e5a12';if(!/^wx[a-f\d]{16}$/.test(appid))throw Error('Invalid WECHAT_APPID');
 await write(path.join(out,'project.config.json'),JSON.stringify({description:'罐头远征队 Cocos 3.8.8 源引擎开发包',projectname:'can-club-cocos',appid,compileType:'game',miniprogramRoot:'./',setting:{es6:false,minified:true,urlCheck:true},packOptions:{ignore:[{type:'file',value:'BUILD-REPORT.json'},{type:'file',value:'README.md'}]}},null,2));
 const packageBudget=await measureWechatPackage(out),mainBytes=packageBudget.mainBytes;
 await write(path.join(out,'BUILD-REPORT.json'),JSON.stringify({...config,engineVersion:engine.version,engineCommit:engine.gitCommit,appid,mainBytes,packageBudget,remoteAssetBytes:art.bytes,remoteAssetCount:Object.keys(manifest.assets).length,remoteBaseConfigured:!!base,textureFormat:preferWebp?'webp-candidate-unverified-on-device':'png-original-resolution',adConfigured:!!config.rewardedAdUnitId,releaseReady:false,remaining:['Creator 3.8.8 editor import/build','WeChat DevTools and device verification',...(!base?['Registered resource download domain and deployment']:[])],entry:'bootGame'},null,2));
 assertWechatPackageBudget(packageBudget);
 await write(path.join(out,'README.md'),'# 微信源引擎开发包\n\n使用真实 Cocos 3.8.8 引擎，与 Web 共用 bootGame 和所有业务源文件。\n\n此目录是微信主包；../remote-art 是独立的完整原尺寸资源目录，不要把它放回主包。将 remote-art 中 art/ 目录部署到已登记的 HTTPS 下载域名，再设置 WECHAT_ASSET_BASE_URL 重建。空地址不模拟资源可用。\n\n正式 Creator 工程在上两级 cocos/，尚须 Creator 3.8.8 编辑器导入和微信真机验收；源码引擎构建不能替代这两项。\n');
 console.log(JSON.stringify({platform:'wechatgame',out,mainBytes,remoteAssetBytes:art.bytes,remoteBaseConfigured:!!base}));
}
