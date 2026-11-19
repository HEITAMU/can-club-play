import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
import crypto from 'node:crypto';
import {measureWechatPackage,assertWechatPackageBudget} from './check-wechat-package.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const exists=async file=>{try{await fs.access(file);return true;}catch{return false;}};
export function creatorRuntimeConfig(rewardedAdUnitId=''){
 if(typeof rewardedAdUnitId!=='string'||rewardedAdUnitId&&!/^adunit-[\w-]+$/.test(rewardedAdUnitId))throw Error('Invalid WECHAT_REWARDED_AD_UNIT_ID');
 return {sourceRuntime:false,creatorEditorBuild:true,rewardedAdUnitId};
}
export async function injectCreatorRuntimeConfig(output,config){
 const entry=path.join(output,'game.js');
 if(!await exists(entry))throw Error('Creator output is missing the WeChat game.js entry.');
 const source=await fs.readFile(entry,'utf8'),marker='/* can-club-creator-runtime:start */';
 if(source.includes(marker))throw Error('Creator entry already finalized; rebuild before applying a new runtime configuration.');
 const {default:ts}=await import('typescript');
 const parsed=ts.createSourceFile('game.js',source,ts.ScriptTarget.ESNext,true,ts.ScriptKind.JS);
 if(parsed.parseDiagnostics.length)throw Error('Creator game.js cannot be parsed; runtime configuration was not inserted.');
 // Preserve the emitted bytes, including its directive prologue. Only the
 // fixed WeChat entry changes; hashed settings and bundle scripts stay intact.
 let offset=source.length;
 for(const statement of parsed.statements){
  if(ts.isExpressionStatement(statement)&&ts.isStringLiteral(statement.expression))continue;
  offset=statement.getStart(parsed);break;
 }
 const addition=';\n'+marker+'\nglobalThis.CAN_CLUB_CONFIG='+JSON.stringify(config)+';\n/* can-club-creator-runtime:end */\n';
 const result=source.slice(0,offset)+addition+source.slice(offset);
 await fs.writeFile(entry,result);
 const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
 return {entry:'game.js',originalSha256:sha(source),configuredSha256:sha(result),addedBytes:Buffer.byteLength(result)-Buffer.byteLength(source)};
}
export function creatorServer(value){
 let url;try{url=new URL(value);}catch{throw Error('WECHAT_CREATOR_SERVER must name the real registered HTTPS resource server.');}
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash)throw Error('Creator resource server must be HTTPS without credentials, query or fragment.');
 return url.href.replace(/\/?$/,'/');
}
export function creatorWechatConfig(template,{server,appid}){
 const config=structuredClone(template);
 config.server=creatorServer(server);config.useBuiltinServer=false;
 config.buildPath='project://build';config.outputName='creator-wechatgame';
 config.mainBundleIsRemote=false;
 config.packages??={};config.packages.wechatgame??={};
 // Current common builder setting and the documented platform setting agree.
 config.packages.wechatgame.remoteServerAddress=config.server;
 if(appid){if(!/^wx[a-f\d]{16}$/.test(appid))throw Error('Invalid WECHAT_APPID');config.packages.wechatgame.appid=appid;}
 return config;
}
export async function validateRemoteBundleConfig(projectRoot=root){
 const meta=JSON.parse(await fs.readFile(path.join(projectRoot,'assets/resources.meta'),'utf8'));
 const builder=JSON.parse(await fs.readFile(path.join(projectRoot,'settings/v2/packages/builder.json'),'utf8'));
 const bundle=builder.bundleConfig?.custom?.[meta.userData?.bundleConfigID]?.configs;
 if(meta.userData?.bundleName!=='resources'||!meta.userData?.isBundle||
    bundle?.miniGame?.overwriteSettings?.wechatgame?.isRemote!==true||
    bundle?.miniGame?.overwriteSettings?.wechatgame?.compressionType!=='merge_all_json'||
    bundle?.web?.preferredOptions?.isRemote!==false)
  throw Error('Creator resources must bind the configured WeChat remote bundle and local Web bundle.');
 return meta.userData.bundleConfigID;
}
async function allFiles(directory){
 const result=[];
 for(const entry of await fs.readdir(directory,{withFileTypes:true})){
  const full=path.join(directory,entry.name);
  if(entry.isSymbolicLink())throw Error('Unexpected build symlink: '+full);
  if(entry.isDirectory())result.push(...await allFiles(full));else if(entry.isFile())result.push(full);
 }
 return result;
}
export async function finalizeCreatorWechat({output,remoteOutput,server,rewardedAdUnitId=''}){
 const runtimeConfig=creatorRuntimeConfig(rewardedAdUnitId);
 const expectedServer=creatorServer(server),files=await allFiles(output);
 let emittedSettings=null,settingsFile=null;
 for(const file of files.filter(file=>/^settings(?:\.[\w-]+)?\.json$/.test(path.basename(file)))){
  const data=JSON.parse(await fs.readFile(file,'utf8'));
  if(data.assets?.remoteBundles){emittedSettings=data;settingsFile=file;break;}
 }
 if(!emittedSettings)throw Error('Creator output has no verifiable settings JSON with assets.remoteBundles.');
 if(!emittedSettings.assets.remoteBundles.includes('resources'))throw Error('Creator did not export resources as a remote bundle.');
 if(creatorServer(emittedSettings.assets.server)!==expectedServer)throw Error('Creator output resource server does not match the configured server.');
 const remote=path.join(output,'remote'),resources=path.join(remote,'resources');
 if(!await exists(resources))throw Error('Creator output is missing remote/resources.');
 const remoteFiles=await allFiles(remote);
 const bundleVersion=emittedSettings.assets.bundleVers?.resources??'';
 if(typeof bundleVersion!=='string'||!/^[\w-]*$/.test(bundleVersion))throw Error('Creator resources bundle version is invalid.');
 const suffix=bundleVersion?'.'+bundleVersion:'';
 const bundleConfig=path.join(resources,'config'+suffix+'.json');
 const bundleScript=path.join(output,'src/bundle-scripts/resources','index'+suffix+'.js');
 if(!remoteFiles.includes(bundleConfig))throw Error('Creator resources is missing the exact config'+suffix+'.json requested by settings.assets.bundleVers.');
 if(!files.includes(bundleScript))throw Error('Creator resources is missing the local bundle script index'+suffix+'.js required by the WeChat adapter.');
 if(JSON.parse(await fs.readFile(bundleConfig,'utf8')).name!=='resources')throw Error('Creator resources config has the wrong bundle name.');
 if(files.some(file=>file.startsWith(path.join(output,'assets/resources')+path.sep)))
  throw Error('Creator left a local resources bundle in the WeChat package; inspect the platform bundle settings.');
 const remoteAssetBytes=(await Promise.all(remoteFiles.map(file=>fs.stat(file)))).reduce((sum,file)=>sum+file.size,0);
 const runtimeEntry=await injectCreatorRuntimeConfig(output,runtimeConfig);
 // Keep a complete deployment directory outside the DevTools upload root.
 // The engine requests <server>/remote/resources/config.<hash>.json and the
 // matching import/native files; its src/bundle-scripts remain in the main.
 await fs.mkdir(remoteOutput,{recursive:true});
 await fs.rm(path.join(remoteOutput,'remote'),{recursive:true,force:true});
 await fs.rename(remote,path.join(remoteOutput,'remote'));
 const packageBudget=await measureWechatPackage(output);
 const report={creatorVersion:'3.8.8',sourceRuntime:false,creatorEditorBuild:true,remoteBundle:'resources',bundleVersion,
  bundleConfigFile:path.relative(output,bundleConfig),localBundleScript:path.relative(output,bundleScript),
  server:expectedServer,settingsFile:path.relative(output,settingsFile),mainDirectory:output,runtimeEntry,adConfigured:!!runtimeConfig.rewardedAdUnitId,
  deploymentDirectory:remoteOutput,remoteAssetBytes,packageBudget,
  publicationVerified:false,releaseReady:false,
  remaining:['Deploy complete remote/ directory to the registered HTTPS server','WeChat DevTools and real-device verification']};
 await fs.writeFile(path.join(remoteOutput,'Creator-WeChat-BUILD-REPORT.json'),JSON.stringify(report,null,2)+'\n');
 assertWechatPackageBudget(packageBudget);
 return report;
}
async function main(){
 const args=process.argv.slice(2),value=name=>{const index=args.indexOf(name);return index<0?undefined:args[index+1];};
 const runtimeConfig=creatorRuntimeConfig(process.env.WECHAT_REWARDED_AD_UNIT_ID||'');
 const server=value('--server')||process.env.WECHAT_CREATOR_SERVER;
 const config=creatorWechatConfig(JSON.parse(await fs.readFile(path.join(root,'build-config/wechatgame.json'),'utf8')),{server,appid:process.env.WECHAT_APPID});
 await validateRemoteBundleConfig();
 const manifest=JSON.parse(await fs.readFile(path.join(root,'asset-manifest.json'),'utf8'));
 for(const item of Object.values(manifest.assets))if(!await exists(path.join(root,'assets/resources',item.path)))
  throw Error('Prepared Creator resource missing. Run npm run prepare:project before building.');
 const configuration=path.join(root,'build/creator-wechat-config.json');
 await fs.mkdir(path.dirname(configuration),{recursive:true});
 await fs.writeFile(configuration,JSON.stringify(config,null,2)+'\n');
 if(args.includes('--config-only')){console.log(JSON.stringify({configuration,server:config.server,adConfigured:!!runtimeConfig.rewardedAdUnitId,editorInvoked:false}));return;}
 const editor=value('--editor')||process.env.COCOS_CREATOR;
 if(!editor)throw Error('Set COCOS_CREATOR to the installed Creator 3.8.8 executable, or pass --editor. No editor is bundled.');
 const output=path.join(root,'build',config.outputName);
 // This dedicated directory contains only regenerable Creator output, never
 // source assets or the source-runtime build. A failed invocation cannot pass
 // by accidentally validating an older successful build.
 await fs.rm(output,{recursive:true,force:true});
 const code=await new Promise((resolve,reject)=>{
  const child=spawn(editor,['--project',root,'--build','configPath='+configuration],{cwd:root,stdio:'inherit',env:process.env});
  child.once('error',reject);child.once('close',(code,signal)=>signal?reject(Error('Creator stopped: '+signal)):resolve(code));
 });
 // Creator's documented CLI success is 36, not POSIX 0. A wrapper may map it
 // to 0; in either case the actual emitted bundle/settings are verified below.
 if(code!==36&&code!==0)throw Error('Creator build failed, exit '+code);
 const report=await finalizeCreatorWechat({output,remoteOutput:path.join(root,'build/creator-remote-art'),server:config.server,rewardedAdUnitId:runtimeConfig.rewardedAdUnitId});
 console.log(JSON.stringify({...report,creatorExitCode:code},null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)await main();
