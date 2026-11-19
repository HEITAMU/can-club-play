import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {measureWechatPackage,assertWechatPackageBudget} from '../scripts/check-wechat-package.mjs';
import {creatorWechatConfig,finalizeCreatorWechat,validateRemoteBundleConfig} from '../scripts/build-creator.mjs';
import {installRuntimeMaterials} from '../vendor/builtin-effects.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temporary=await fs.mkdtemp(path.join(os.tmpdir(),'can-club-build-gates-'));
test.after(()=>fs.rm(temporary,{recursive:true,force:true}));
const write=async(file,data)=>{await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,typeof data==='object'?JSON.stringify(data):data);};
async function sized(file,size){await write(file,'');await fs.truncate(file,size);}
async function fixture(name,game={}){const dir=path.join(temporary,name);await write(path.join(dir,'game.json'),game);return dir;}

test('recursive main-package gate catches nested files and exits nonzero',async()=>{
 const dir=await fixture('large-main');await sized(path.join(dir,'assets/deep/native/large.png'),4*1024*1024);
 const report=await measureWechatPackage(dir);
 assert.equal(report.passed,false);assert.throws(()=>assertWechatPackageBudget(report),{code:'CAN_CLUB_WECHAT_PACKAGE_TOO_LARGE'});
 const cli=spawnSync(process.execPath,[path.join(root,'scripts/check-wechat-package.mjs'),dir],{encoding:'utf8'});
 assert.notEqual(cli.status,0);assert.match(cli.stdout,/"passed": false/);
});
test('one subpackage can exceed 4 MiB while main+subpackages remain below the conservative 30 MiB budget',async()=>{
 const dir=await fixture('subpackages',{subpackages:[{name:'a',root:'packages/a'},{name:'b',root:'packages/b'}]});
 await sized(path.join(dir,'packages/a/image.bin'),5*1024*1024);
 await sized(path.join(dir,'packages/b/image.bin'),1024);
 let report=assertWechatPackageBudget(await measureWechatPackage(dir));
 assert.ok(report.mainBytes<1024);assert.equal(report.subpackages[0].bytes,5*1024*1024);
 await sized(path.join(dir,'packages/b/image.bin'),26*1024*1024);
 report=await measureWechatPackage(dir);assert.equal(report.passed,false);assert.match(report.violations.join(' '),/30 MiB/);
});
test('explicit DevTools folder/file exclusions match budget measurement',async()=>{
 const dir=await fixture('ignores');await write(path.join(dir,'project.config.json'),{packOptions:{ignore:[{type:'folder',value:'diagnostics'},{type:'file',value:'README.md'}]}});
 await sized(path.join(dir,'diagnostics/nested/report.bin'),5*1024*1024);await sized(path.join(dir,'README.md'),5*1024*1024);
 assert.ok(assertWechatPackageBudget(await measureWechatPackage(dir)).mainBytes<1024);
});
test('Creator 3.8.8 bundle binding and server configuration preserve local Web resources',async()=>{
 assert.equal(await validateRemoteBundleConfig(root),'canclub_resources');
 const template=JSON.parse(await fs.readFile(path.join(root,'build-config/wechatgame.json'),'utf8'));
 const config=creatorWechatConfig(template,{server:'https://assets.example.test/game'});
 assert.equal(config.server,'https://assets.example.test/game/');
 assert.equal(config.packages.wechatgame.remoteServerAddress,config.server);
 assert.equal(config.mainBundleIsRemote,false);assert.equal(config.outputName,'creator-wechatgame');
 assert.equal(template.server,'');
 assert.throws(()=>creatorWechatConfig(template,{server:''}));
 assert.throws(()=>creatorWechatConfig(template,{server:'http://assets.example.test/game/'}));
});
test('Creator output check requires real remote export metadata and removes remote art from upload root',async()=>{
 const dir=await fixture('creator-output'),server='https://assets.example.test/game/';
 await write(path.join(dir,'src/settings.123abc.json'),{assets:{server,remoteBundles:['resources']}});
 await write(path.join(dir,'remote/resources/config.123abc.json'),{name:'resources'});
 await sized(path.join(dir,'remote/resources/native/full-size.png'),6*1024*1024);
 await write(path.join(dir,'src/bundle-scripts/resources/index.123abc.js'),'');
 const remoteOutput=path.join(temporary,'creator-deploy');
 const report=await finalizeCreatorWechat({output:dir,remoteOutput,server});
 assert.equal(report.packageBudget.passed,true);assert.equal(report.releaseReady,false);
 assert.equal(await fs.stat(path.join(remoteOutput,'remote/resources/native/full-size.png')).then(s=>s.size),6*1024*1024);
 await assert.rejects(fs.access(path.join(dir,'remote')));
 await fs.access(path.join(dir,'src/bundle-scripts/resources/index.123abc.js'));
 const missing=await fixture('creator-missing-metadata');
 await assert.rejects(finalizeCreatorWechat({output:missing,remoteOutput,server}),/no verifiable settings/);
});
test('runtime descriptors, materials and shader compilation follow the actual 3.8.8 engine lifecycle',async()=>{
 const stages=[[],[],[]],registry=new Map(),materialAssets=new Map();let compiled=0;
 class EffectAsset{static get(name){return registry.get(name);}onLoaded(){registry.set(this.name,this);}}
 const director={root:null};
 class Material{initialize(){assert.ok(director.root,'material creation captured a null Cocos root');this.passes=[{tryCompile:()=>{if(!director.root.pipeline)return false;compiled++;return true;}}];}}
 const enumValues=new Proxy({},{get:(object,key)=>key});
 const cc={gfx:new Proxy({},{get:()=>enumValues}),EffectAsset,Material,director,builtinResMgr:{addAsset:(key,value)=>materialAssets.set(key,value)},
  game:{onPostInfrastructureInitDelegate:{add:fn=>stages[0].push(fn)},onPostSubsystemInitDelegate:{add:fn=>stages[1].push(fn)},onPostProjectInitDelegate:{add:fn=>stages[2].push(fn)}}};
 installRuntimeMaterials(cc,JSON.parse(await fs.readFile(path.join(root,'vendor/uniform-chunks.json'),'utf8')));
 for(const callback of stages[0])callback();
 assert.ok(registry.has('canclub-painted-blend'));assert.equal(materialAssets.size,0);
 director.root={pipeline:null};for(const callback of stages[1])callback();assert.equal(materialAssets.size,7);assert.equal(compiled,0);
 director.root.pipeline={};for(const callback of stages[2])callback();assert.equal(compiled,7);
});
