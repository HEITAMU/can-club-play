import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {CATS,initialState,encodeSave,catStats,upgradeCost} from '../core.mjs';
const out='review-artifacts';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const report={viewports:[],checks:[]},errors=[];
function fixture(){
 const s=initialState();Object.assign(s,{gold:40000,highest:50,runCleared:50,stage:51,onboarded:true,rescueSeen:true});
 s.party=['orange','ink','milk','mint','bolt'];Object.assign(s.levels,{orange:28,ink:50,milk:13});s.relics={bell:1};return s;
}
async function open(width,height,s=fixture()){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
 const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.addInitScript(save=>localStorage.setItem('can-club-save-v1',save),encodeSave(s));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
 await page.locator('[data-tab="cats"]').click();
 await page.locator('#crew-detail .rig-ready').waitFor();
 return {page,context,s};
}
async function select(page,id){
 await page.locator('[data-crew="'+id+'"]').click();
 await page.locator('[data-profile-cat="'+id+'"] .rig-ready').waitFor();
 assert.equal(await page.locator('[data-crew="'+id+'"]').getAttribute('aria-pressed'),'true');
}
try{
 for(const [w,h] of [[390,844],[375,667],[320,568],[1280,900]]){
  const {page,context}=await open(w,h);
  assert.equal(await page.locator('.crew-pick').count(),8);
  const layout=await page.evaluate(()=>{
   const root=document.querySelector('.crew-profile'),r=root.getBoundingClientRect();
   return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,profileWidth:r.width,profileScroll:root.scrollWidth,hero:document.querySelector('.crew-hero').getBoundingClientRect().height,stats:[...document.querySelectorAll('.crew-attributes dd')].map(e=>e.textContent),canvas:document.querySelector('.crew-portrait canvas').width};
  });
  assert.ok(layout.scroll<=w,'page overflow '+w);
  assert.ok(layout.profileScroll<=layout.profileWidth+1,'profile overflow '+w);
  assert.ok(layout.canvas>0,'portrait rendered');
  assert.equal(layout.stats.length,4);
  await page.screenshot({path:out+'/crew-'+w+'.png'});
  report.viewports.push({width:w,height:h,...layout});
  await context.close();
 }
 const {page,context,s}=await open(390,844);
 const baseHP=catStats(s,'orange').hp;
 assert.equal(await page.locator('.crew-attributes dd').first().textContent(),baseHP.toLocaleString('zh-CN'));
 for(const c of CATS){
  await select(page,c.id);
  assert.equal(await page.locator('.crew-identity h3').textContent(),c.name);
  assert.equal(await page.locator('.crew-skill-title h4').textContent(),c.skill);
 }
 await select(page,'star');
 assert.equal(await page.locator('#crew-detail [data-upgrade]').count(),0);
 assert.ok((await page.locator('.crew-locked-note').textContent()).includes('60'));
 await page.screenshot({path:out+'/crew-locked.png'});
 report.checks.push('Eight characters switch; locked role has no upgrade or deployment action');

 await select(page,'milk');
 await page.screenshot({path:out+'/crew-milk.png'});
 const cost=upgradeCost(13);
 await page.locator('#crew-detail [data-upgrade]').click();
 assert.equal(await page.locator('.crew-level b').textContent(),'14');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('can-club-save-v1')));
 const data=JSON.parse(saved.payload);
 assert.equal(data.levels.milk,14);
 assert.equal(data.gold,40000-cost);
 assert.ok((await page.locator('.crew-passive-title span').textContent()).includes('已觉醒'));
 report.checks.push('Upgrade updates level, attributes and cost, persists exactly one purchase');

 await select(page,'spark');
 await page.locator('.crew-deployment summary').click();
 assert.ok((await page.locator('[data-equip="1"]').textContent()).includes('继承 Lv.50'));
 await page.locator('[data-equip="1"]').click();
 assert.equal(await page.locator('.crew-level b').textContent(),'50');
 assert.ok((await page.locator('.crew-position').textContent()).includes('前排 2'));
 assert.ok((await page.locator('.crew-active-skill').textContent()).includes('6 秒'));
 await select(page,'ink');
 assert.equal(await page.locator('.crew-level b').textContent(),'1');
 report.checks.push('Replacement conserves training and updates awakened duration');

 await select(page,'mint');
 await page.locator('[data-inherit-open]').click();
 await page.locator('[data-inherit="orange"]').click();
 assert.equal(await page.locator('#modal-backdrop').isVisible(),false);
 assert.equal(await page.locator('.crew-level b').textContent(),'28');
 assert.ok((await page.locator('.crew-active-skill').textContent()).includes('2.6秒'));
 assert.equal(await page.locator('.crew-position').textContent(),'后排 2');
 report.checks.push('Training inheritance returns to selected character without changing formation');

 await page.locator('.crew-deployment summary').click();
 await page.locator('[data-equip="0"]').click();
 assert.equal(await page.locator('.crew-position').textContent(),'前排 1');
 assert.equal(await page.locator('.crew-level b').textContent(),'28');
 await page.locator('[data-tab="battle"]').click();
 await page.locator('#battle-start').click();
 await page.waitForTimeout(1200);
 assert.equal(await page.locator('#actors .actor:not(.enemy)').count(),5);
 const visible=await page.locator('#actors .actor:not(.enemy)').evaluateAll(els=>els.every(el=>el.querySelector('canvas').width>0&&getComputedStyle(el).display!=='none'));
 assert.ok(visible);
 report.checks.push('Reposition preserves level; all five combat actors remain rendered');
 await context.close();

 const fresh=initialState();fresh.gold=0;fresh.onboarded=true;
 const poor=await open(320,568,fresh);
 assert.equal(await poor.page.locator('#crew-detail [data-upgrade]').isDisabled(),true);
 await poor.context.close();
 const capped=fixture();capped.levels.orange=100;
 const max=await open(390,844,capped);
 assert.equal(await max.page.locator('#crew-detail [data-upgrade]').isDisabled(),true);
 assert.equal(await max.page.locator('#crew-detail [data-upgrade]').textContent(),'已满级');
 await max.context.close();
 report.checks.push('Insufficient currency and maximum level disable upgrade');
 assert.deepEqual(errors,[]);
 report.browserErrors=errors;
 report.result='passed';
 console.log(JSON.stringify(report,null,2));
}catch(error){
 report.result='failed';report.error=error.stack;report.browserErrors=errors;
 for(const context of browser.contexts())for(const page of context.pages()){
  try{await page.screenshot({path:out+'/failure.png',fullPage:true});}catch{}
 }
 console.error(error);process.exitCode=1;
}finally{
 await writeFile(out+'/ui-report.json',JSON.stringify(report,null,2));
 await browser.close();
}
