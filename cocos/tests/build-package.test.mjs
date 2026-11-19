import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {build} from 'esbuild';
import {measureWechatPackage,assertWechatPackageBudget} from '../scripts/check-wechat-package.mjs';
import {creatorWechatConfig,creatorRuntimeConfig,injectCreatorRuntimeConfig,finalizeCreatorWechat,validateRemoteBundleConfig} from '../scripts/build-creator.mjs';
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
 await write(path.join(dir,'src/bundle-scripts/resources/index.123abc.js'),'/* original hashed bundle */');
 const entry="// Creator output fixture\n'use strict';\nglobalThis.configAtBoot=globalThis.CAN_CLUB_CONFIG;\nglobalThis.strictAtBoot=(function(){return this===undefined;})();\n";
 await write(path.join(dir,'game.js'),entry);
 const settingsBefore=await fs.readFile(path.join(dir,'src/settings.123abc.json'),'utf8');
 const scriptBefore=await fs.readFile(path.join(dir,'src/bundle-scripts/resources/index.123abc.js'),'utf8');
 const remoteOutput=path.join(temporary,'creator-deploy');
 const report=await finalizeCreatorWechat({output:dir,remoteOutput,server,rewardedAdUnitId:'adunit-creator-fixture'});
 assert.equal(report.packageBudget.passed,true);assert.equal(report.releaseReady,false);
 assert.equal(report.adConfigured,true);
 const configured=await fs.readFile(path.join(dir,'game.js'),'utf8');
 const context={CAN_CLUB_CONFIG:{sourceRuntime:true,rewardedAdUnitId:'adunit-stale'}};
 vm.runInNewContext(configured,context);
 assert.equal(context.strictAtBoot,true,'insertion must preserve the original directive prologue');
 assert.equal(context.configAtBoot.rewardedAdUnitId,'adunit-creator-fixture');
 assert.equal(context.configAtBoot.sourceRuntime,false);assert.equal(context.configAtBoot.creatorEditorBuild,true);
 assert.equal(report.runtimeEntry.configuredSha256,crypto.createHash('sha256').update(configured).digest('hex'));
 assert.equal(report.runtimeEntry.addedBytes,Buffer.byteLength(configured)-Buffer.byteLength(entry));
 assert.ok(report.packageBudget.mainBytes>=Buffer.byteLength(configured));
 assert.equal(await fs.readFile(path.join(dir,'src/settings.123abc.json'),'utf8'),settingsBefore);
 assert.equal(await fs.readFile(path.join(dir,'src/bundle-scripts/resources/index.123abc.js'),'utf8'),scriptBefore);
 assert.equal(await fs.stat(path.join(remoteOutput,'remote/resources/native/full-size.png')).then(s=>s.size),6*1024*1024);
 await assert.rejects(fs.access(path.join(dir,'remote')));
 await fs.access(path.join(dir,'src/bundle-scripts/resources/index.123abc.js'));
 const missing=await fixture('creator-missing-metadata');
 await assert.rejects(finalizeCreatorWechat({output:missing,remoteOutput,server}),/no verifiable settings/);
});
test('Creator configuration rejects invalid IDs and missing entry before mutating output',async()=>{
 const dir=await fixture('creator-config-errors'),entry='globalThis.started=true;';
 await write(path.join(dir,'game.js'),entry);
 assert.throws(()=>creatorRuntimeConfig('not-an-ad-unit'),/Invalid WECHAT_REWARDED_AD_UNIT_ID/);
 await assert.rejects(finalizeCreatorWechat({output:dir,remoteOutput:path.join(temporary,'unused'),server:'https://assets.example.test/',rewardedAdUnitId:'bad-id'}),/Invalid WECHAT_REWARDED_AD_UNIT_ID/);
 assert.equal(await fs.readFile(path.join(dir,'game.js'),'utf8'),entry);
 const missing=await fixture('creator-no-game-entry');
 await assert.rejects(injectCreatorRuntimeConfig(missing,creatorRuntimeConfig()),/missing.*game.js/);
});
test('real rewarded service consumes the Creator entry configuration and still requires a completed SDK callback',async()=>{
 const compiled=await build({entryPoints:[path.join(root,'assets/scripts/platform/Rewarded.ts')],bundle:true,format:'cjs',platform:'node',write:false,tsconfigRaw:{}});
 const dir=await fixture('creator-reward-runtime');
 await write(path.join(dir,'game.js'),"'use strict';\n");
 await injectCreatorRuntimeConfig(dir,creatorRuntimeConfig('adunit-creator-test'));
 let sdkCalls=0,callback;
 const context=vm.createContext({module:{exports:{}},setTimeout,clearTimeout,wx:{createRewardedVideoAd(options){
  sdkCalls++;assert.equal(options.adUnitId,'adunit-creator-test');
  return {load:async()=>{},show:async()=>{},onClose:fn=>callback=fn,onError:()=>{},offClose:()=>{},offError:()=>{},destroy:()=>{}};
 }}});
 vm.runInContext(await fs.readFile(path.join(dir,'game.js'),'utf8'),context);
 vm.runInContext(compiled.outputFiles[0].text,context);
 const create=context.module.exports.createConfiguredRewardedService;
 let service=create(),watch=service.watch();await new Promise(resolve=>setImmediate(resolve));
 callback({isEnded:false});assert.equal((await watch).completed,false);
 watch=service.watch();await new Promise(resolve=>setImmediate(resolve));
 callback({isEnded:true});assert.equal((await watch).completed,true);service.dispose();
 assert.equal(sdkCalls,2);
 await write(path.join(dir,'game.js'),'/* clean export */\n');
 await injectCreatorRuntimeConfig(dir,creatorRuntimeConfig());
 vm.runInContext(await fs.readFile(path.join(dir,'game.js'),'utf8'),context);
 service=create();assert.equal(service.available,false);assert.equal((await service.watch()).completed,false);
 assert.equal(sdkCalls,2,'an empty formal build configuration must not call the SDK or grant rewards');
 service.dispose();
});
test('shared Creator compatibility restores old saves and freezes combat positions when modern APIs are absent',async()=>{
 const compiled=await build({stdin:{contents:"import './platform/Compatibility'; export {installCompatibility} from './platform/Compatibility'; export {GameSession} from './game/GameSession'; export {BattleCues,formationPositions} from './domain/battle-cues';",resolveDir:path.join(root,'assets/scripts'),loader:'ts'},bundle:true,format:'cjs',platform:'neutral',target:'es2019',write:false,tsconfigRaw:{}});
 const context=vm.createContext({module:{exports:{}}});
 vm.runInContext('delete Array.prototype.at; delete globalThis.structuredClone;',context);
 vm.runInContext(compiled.outputFiles[0].text,context);
 const result=vm.runInContext(`(()=>{
  const {GameSession,BattleCues,formationPositions}=module.exports;
  let saved=null;const services={load:()=>saved,save:value=>saved=value,now:()=>1795046400000};
  const first=new GameSession(services);first.state.party.push(null,null);first.save();
  const restored=new GameSession(services),positions=formationPositions(restored.battle),cues=new BattleCues();
  const hero=restored.battle.heroes[0].id,enemy=restored.battle.enemies[0].id,original=positions[hero].x;
  cues.addRoute('snapshot',hero,[enemy],'hit','attack',0,positions);
  positions[hero].x+=100;
  return {party:restored.state.party,last:restored.state.party.at(-1),storedX:cues.routes.get('snapshot').positions[hero].x,original,saveOK:restored.saveOK};
 })()`,context);
 assert.deepEqual(JSON.parse(JSON.stringify(result.party)),['orange','ink']);
 assert.equal(result.last,'ink');assert.equal(result.saveOK,true);assert.equal(result.storedX,result.original);
});
test('shared compatibility leaves native implementations unchanged',async()=>{
 const compiled=await build({entryPoints:[path.join(root,'assets/scripts/platform/Compatibility.ts')],bundle:true,format:'cjs',platform:'neutral',write:false,tsconfigRaw:{}});
 const context=vm.createContext({module:{exports:{}},structuredClone});
 vm.runInContext('globalThis.originalAt=Array.prototype.at;globalThis.originalClone=structuredClone;',context);
 vm.runInContext(compiled.outputFiles[0].text,context);
 assert.equal(vm.runInContext('Array.prototype.at===originalAt&&structuredClone===originalClone',context),true);
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
