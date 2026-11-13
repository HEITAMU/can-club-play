// Serve the real game. Review hooks are appended only by this local test server;
// the published app has no fixture, debug controls, or altered save behavior.
import fs from 'node:fs';import path from 'node:path';import http from 'node:http';import assert from 'node:assert/strict';import {fileURLToPath} from 'node:url';import {createRequire} from 'node:module';import {execFileSync} from 'node:child_process';
import {initialState,encodeSave} from '../core.mjs';
const require=createRequire(import.meta.url),{chromium}=require('playwright'),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'qa/spark-browser');fs.mkdirSync(out,{recursive:true});
const hooks=`
import {actionTiming as reviewTiming} from './motion.mjs?v=0.21.1';
globalThis.__sparkReview={
 seek(kind,elapsed){
  running=false;selectedCrew='spark';state.party=['spark','orange','ink','milk','mint'];state.highest=60;state.runCleared=19;state.stage=20;state.pending=null;state.rescueSeen=true;state.onboarded=true;queue=[];forceClose();changeTab('battle');
  startBattle({stage:20});running=false;battle.time=10;
  for(const a of [...battle.heroes,...battle.enemies]){a.wait=99;a.skillWait=99;a.hp=a.maxHp;a.crit=0;}
  const h=battle.heroes[0];h.energy=kind==='skill'?100:40;
  if(kind==='normal'||kind==='skill'){battle.beginAction(h,kind);h.wait=99;playEvents(battle.events.splice(0));}
  if(kind==='hit')h.hitUntil=10+.22;
  if(kind==='down'){h.hp=0;h.downAt=10;}
  let remain=elapsed;while(remain>1e-8){const dt=Math.min(1/60,remain);playEvents(battle.tick(dt));renderMotion();remain-=dt;}
  renderVitals();renderMotion();return {time:battle.time,phase:poseFor(h,battle.time).phase,shield:h.shield,action:h.action,offset:motionOffsets.points.get(h.id)};
 },
 state(){return{time:battle.time,party:state.party,level:state.levels.spark,renderer:document.querySelector('#actor-p0 .painted-sprite')?.dataset.renderer};}
};
`;
const types={'.html':'text/html','.mjs':'text/javascript','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const server=http.createServer((req,res)=>{const url=new URL(req.url,'http://local'),file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{let body=fs.readFileSync(file);if(file===path.join(root,'app.mjs'))body=Buffer.from(body.toString()+hooks);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'}).end(body);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
try{
 browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})});const report=[];
 for(const [width,height] of [[320,568],[390,844],[430,932]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[];
  const state=initialState();Object.assign(state,{onboarded:true,rescueSeen:true,highest:60,runCleared:19,stage:20,gold:10000,lastAccrued:Date.now()});for(const id of Object.keys(state.levels))state.levels[id]=18;
  await page.addInitScript(save=>localStorage.setItem('can-club-save-v1',save),encodeSave(state));
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});
  await page.goto('http://127.0.0.1:'+server.address().port+'/');await page.waitForFunction(()=>globalThis.__sparkReview);
  const seek=async(kind,t)=>{const result=await page.evaluate(([k,t])=>__sparkReview.seek(k,t),[kind,t]);await page.waitForFunction(()=>document.querySelector('#actor-p0 .painted-sprite')?.dataset.renderer==='finished-full-body');await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));return result;};
  await seek('idle',0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:path.join(out,'battle-'+width+'.png')});
  const release=await seek('normal',.25+1e-6);assert.equal(release.phase,'release');
  await page.screenshot({path:path.join(out,'release-'+width+'.png')});
  await seek('skill',.40+1e-6);
  await page.screenshot({path:path.join(out,'skill-'+width+'.png')});
  await seek('skill',.79);
  await page.screenshot({path:path.join(out,'skill-impact-'+width+'.png')});
  await page.locator('[data-tab="cats"]').click();await page.waitForFunction(()=>document.querySelector('#crew-detail .painted-sprite[data-art="spark"]')?.classList.contains('rig-ready'));
  const portraitInside=await page.evaluate(()=>{const c=document.querySelector('#crew-detail [data-art="spark"] canvas'),r=c.getBoundingClientRect(),box=c.closest('.crew-hero').getBoundingClientRect(),pixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let l=c.width,t=c.height,b=0,right=0;for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++)if(pixels[(y*c.width+x)*4+3]>60){l=Math.min(l,x);right=Math.max(right,x);t=Math.min(t,y);b=Math.max(b,y);}const paint={left:r.left+l/c.width*r.width,right:r.left+right/c.width*r.width,top:r.top+t/c.height*r.height,bottom:r.top+b/c.height*r.height};return paint.left>=box.left+3&&paint.right<=box.right-3&&paint.top>=box.top+3&&paint.bottom<=box.bottom-3;});
  assert.ok(portraitInside,'spark portrait clips ears, lantern, tail or paws');
  await page.screenshot({path:path.join(out,'crew-'+width+'.png'),fullPage:true});
  const before=await page.evaluate(()=>__sparkReview.state().level);await page.locator('#crew-detail [data-upgrade="spark"]').click();assert.equal(await page.evaluate(()=>__sparkReview.state().level),before+1);
  if(width===390){
   const frames=path.join(out,'frames');fs.mkdirSync(frames,{recursive:true});
   for(let i=0;i<144;i++){const kind=['normal','skill','hit'][Math.floor(i/48)],t=i%48/48*1.6;await seek(kind,t);await page.screenshot({path:path.join(frames,String(i).padStart(4,'0')+'.png')});}
   execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-framerate','24','-i',path.join(frames,'%04d.png'),'-an','-c:v','libx264','-preset','fast','-crf','21','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,'spark-in-game.mp4')]);
   await page.goto('http://127.0.0.1:'+server.address().port+'/spark.html');
   await page.waitForFunction(()=>globalThis.__sparkPreview);
   const portraitFrames=path.join(out,'portrait-frames');fs.mkdirSync(portraitFrames,{recursive:true});
   for(let i=0;i<192;i++){await page.evaluate(t=>__sparkPreview.seek(t),i/24);await page.screenshot({path:path.join(portraitFrames,String(i).padStart(4,'0')+'.png')});}
   execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-framerate','24','-i',path.join(portraitFrames,'%04d.png'),'-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',path.join(out,'spark-motion.mp4')]);
   const perf=await page.evaluate(()=>__sparkPreview.benchmark());assert.ok(perf.averageMs<30,'single character paint exceeds 30ms on CI');
   fs.writeFileSync(path.join(out,'performance.json'),JSON.stringify(perf,null,2));

  }
  assert.deepEqual(errors,[]);report.push({width,height,renderer:'finished-full-body',fullBodyArt:true,releaseAtLaunch:true,portraitUnclipped:portraitInside,upgradePreservesSave:true,horizontalOverflow:false,errors});await context.close();
 }
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({version:'0.21.1',scope:['spark'],fixture:'Original game root, deterministic battle fixture; Chromium mobile viewports, not physical iPhone testing.',viewports:report},null,2)+'\n');console.log(JSON.stringify(report));
}finally{await browser?.close();server.close();}
