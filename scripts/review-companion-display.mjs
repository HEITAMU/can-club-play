import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {initialState,encodeSave,CATS} from '../core.mjs';
import {generateGear} from '../equipment.mjs';
import {companionSize} from '../companion-display.mjs';

const require=createRequire(new URL('../wechat/package.json',import.meta.url));
const {chromium}=require('playwright');
const out=path.resolve('qa/companion-display-v02620');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const report=[];
const spriteData=el=>{
 const r=el.getBoundingClientRect(),c=el.querySelector('canvas'),d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
 let hash=2166136261,pixels=0;for(let i=0;i<d.length;i+=4){if(d[i+3]>50)pixels++;hash=Math.imul(hash^d[i]^d[i+1]^d[i+2]^d[i+3],16777619);}
 return {width:r.width,height:r.height,canvas:[c.width,c.height],hash,pixels,renderer:el.dataset.renderer};
};
const waitForChange=async(locator,hash)=>{const end=Date.now()+10000;while(Date.now()<end){if((await locator.evaluate(spriteData)).hash!==hash)return;await new Promise(resolve=>setTimeout(resolve,100));}throw new Error('Idle pixels did not change');};
try{
 for(const [width,height] of [[320,568],[390,844],[430,932]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});
  const s=initialState();s.roster.owned=CATS.map(c=>c.id);s.party=['orange','ink','milk','spark','pudding'];
  Object.assign(s,{onboarded:true,rescueSeen:true,gold:100000,highest:100,stage:1,runCleared:0});for(const id in s.levels)s.levels[id]=60;
  s.inventory.equipped={};s.inventory.items=Array.from({length:35},(_,i)=>generateGear(i+1,20,{slot:'claw',set:'hunt'}));s.inventory.serial=35;
  await page.addInitScript(save=>localStorage.setItem('can-club-save-v1',save),encodeSave(s));
  await page.goto(process.env.REVIEW_URL||'http://127.0.0.1:4173/');
  await page.waitForSelector('#actor-p0 .rig-ready');
  const unit=await page.evaluate(()=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--companion-unit')));
  const battle=await page.locator('#actor-p0 .companion-body').evaluate(spriteData);
  assert.ok(Math.abs(battle.width-unit)<.03,'battle scale');
  await page.screenshot({path:path.join(out,`battle-${width}.png`)});
  await page.locator('[data-tab="cats"]').click();
  const figures=[];
  for(const {id} of CATS){
   await page.locator('[data-crew-mode="profile"]').click();await page.locator(`[data-crew="${id}"]`).click();
   const profile=page.locator(`.crew-portrait .companion-body[data-art="${id}"]`);
   await profile.scrollIntoViewIfNeeded();await page.waitForSelector(`.crew-portrait .rig-ready[data-art="${id}"]`);
   const a=await profile.evaluate(spriteData);await waitForChange(profile,a.hash);const b=await profile.evaluate(spriteData);
   assert.ok(Math.abs(a.width-companionSize(unit,id))<.03,`${id} profile width ${a.width}`);
   assert.ok(a.pixels>100&&a.hash!==b.hash,`${id} profile idle is alive`);
   await page.locator('[data-crew-mode="equipment"]').click();
   const gear=page.locator(`.equipment-character .companion-body[data-art="${id}"]`);
   await page.waitForSelector(`.equipment-character .rig-ready[data-art="${id}"]`);
   const c=await gear.evaluate(spriteData);await waitForChange(gear,c.hash);const d=await gear.evaluate(spriteData);
   assert.ok(Math.abs(c.width-a.width)<.03,`${id} equipment matches profile`);
   assert.deepEqual(c.canvas,a.canvas,`${id} canvas resolution is identical`);
   assert.ok(c.pixels>100&&c.hash!==d.hash,`${id} equipment idle is alive`);
   figures.push({id,size:a.width,canvas:a.canvas,profileAnimated:a.hash!==b.hash,equipmentAnimated:c.hash!==d.hash});
  }
  await page.locator('[data-crew="orange"]').click();await page.waitForSelector('.equipment-character .rig-ready');
  await page.screenshot({path:path.join(out,`equipment-${width}.png`)});
  const drawer=page.locator('.equipment-bag .gear-list');await drawer.evaluate(e=>{e.scrollTop=e.scrollHeight;});
  const scroll=await drawer.evaluate(e=>({scrollTop:e.scrollTop,height:e.clientHeight,total:e.scrollHeight}));
  assert.ok(scroll.scrollTop>0&&Math.abs(scroll.scrollTop+scroll.height-scroll.total)<2);
  await page.locator('[data-crew-mode="formation"]').click();await page.waitForSelector('.formation-board .rig-ready');
  assert.equal(await page.locator('.formation-board .companion-body').count(),5);
  const standing=page.locator('.formation-board .companion-body');
  const still=await standing.evaluateAll(es=>es.map(e=>({id:e.dataset.art,width:e.getBoundingClientRect().width,ready:e.classList.contains('rig-ready')})));
  for(const e of still){assert.ok(e.ready);assert.ok(Math.abs(e.width-companionSize(unit,e.id))<.03,`${e.id} formation scale`);}
  const first=standing.first();const before=await first.evaluate(spriteData);await waitForChange(first,before.hash);const after=await first.evaluate(spriteData);assert.notEqual(before.hash,after.hash);
  await page.screenshot({path:path.join(out,`formation-${width}.png`)});
  const src=await page.locator('.formation-slot[data-drag-cat="orange"]').boundingBox(),dst=await page.locator('[data-formation-slot="2"]').boundingBox();
  await page.mouse.move(src.x+src.width/2,src.y+src.height/2);await page.mouse.down();await page.mouse.move(dst.x+dst.width/2,dst.y+dst.height/2,{steps:12});
  const ghost=await page.locator('.formation-ghost .companion-body').evaluate(spriteData);assert.ok(Math.abs(ghost.width-unit)<.03);assert.ok(ghost.pixels>100);
  await page.mouse.up();assert.equal(await page.locator('[data-formation-slot="2"]').getAttribute('data-drag-cat'),'orange');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);
  report.push({width,height,unit,figures,drawer:scroll,formation:still,dragPreservesScale:true,errors});await context.close();
 }
 fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
