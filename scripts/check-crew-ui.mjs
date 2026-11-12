import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {CATS,initialState,encodeSave,catStats,upgradeQuote} from '../core.mjs';
const out='review-artifacts';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true}),errors=[],report={viewports:[],checks:[]};
function fixture(){const s=initialState();Object.assign(s,{gold:500000,highest:50,runCleared:50,stage:51,onboarded:true,rescueSeen:true});s.party=['orange','ink','milk','mint','bolt'];Object.assign(s.levels,{orange:28,ink:50,milk:13});return s;}
async function open(width=390,height=844,s=fixture(),touch=false){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:touch,isMobile:touch});const page=await context.newPage();
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.addInitScript(save=>{if(!localStorage.getItem('can-club-save-v1'))localStorage.setItem('can-club-save-v1',save);},encodeSave(s));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});return {page,context,s};
}
async function saved(page){return page.evaluate(()=>JSON.parse(JSON.parse(localStorage.getItem('can-club-save-v1')).payload));}
async function cats(page){await page.locator('[data-tab="cats"]').click();await page.locator('#crew-detail .rig-ready').waitFor();}
async function formation(page){await page.locator('[data-crew-mode="formation"]').click();await page.waitForFunction(()=>[...document.querySelectorAll('.formation-slot[data-drag-cat] .painted-sprite')].every(e=>e.classList.contains('rig-ready')));}
async function center(locator){const r=await locator.boundingBox();assert.ok(r);return {x:r.x+r.width/2,y:r.y+r.height/2};}
async function drag(page,source,target){const a=await center(source),b=await center(target);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:16});await page.mouse.up();await page.waitForTimeout(400);}
async function touchDrag(page,source,target,{cancel=false}={}){const a=await center(source),b=await center(target),cdp=await page.context().newCDPSession();await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...a,id:1}]});for(let i=1;i<=12;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/12,y:a.y+(b.y-a.y)*i/12,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:cancel?'touchCancel':'touchEnd',touchPoints:[]});await page.waitForTimeout(400);await cdp.detach();}
try{
 for(const [w,h] of [[390,844],[375,667],[320,568],[1280,900]]){
  const {page,context}=await open(w,h);await cats(page);
  assert.equal(await page.locator('#crew-roster [data-upgrade-count="10"]').count(),8);
  assert.equal(await page.locator('.crew-attributes dd').count(),8);
  assert.equal(await page.locator('#crew-roster [data-upgrade="star"]').isDisabled(),true);
  await page.screenshot({path:out+'/archive-'+w+'.png'});
  await formation(page);
  const layout=await page.evaluate(()=>{const r=document.querySelector('.formation-board').getBoundingClientRect();return {pageWidth:document.documentElement.scrollWidth,overflow:[...document.querySelectorAll('.formation-slot')].some(s=>{const b=s.getBoundingClientRect();return b.left<r.left||b.right>r.right+1||b.top<r.top||b.bottom>r.bottom+1;}),occupied:document.querySelectorAll('.formation-slot[data-drag-cat]').length};});
  assert.equal(layout.pageWidth,w);assert.equal(layout.overflow,false);assert.equal(layout.occupied,5);
  await page.screenshot({path:out+'/formation-'+w+'.png'});report.viewports.push({w,h,...layout});await context.close();
 }
 {
  const {page,context,s}=await open();await cats(page);
  const cost=upgradeQuote(s.levels.ink).cost;await page.locator('#crew-roster [data-upgrade="ink"]').click();
  let data=await saved(page);assert.equal(data.levels.ink,60);assert.equal(data.gold,s.gold-cost);assert.equal(await page.locator('.crew-identity h3').textContent(),'橘座');
  await formation(page);
  for(const c of CATS.filter(c=>s.highest>=c.unlock)){
   const before=await saved(page),quote=upgradeQuote(before.levels[c.id]);await page.locator('.formation-bench [data-upgrade="'+c.id+'"]').click();data=await saved(page);
   assert.equal(data.levels[c.id],before.levels[c.id]+quote.levels);assert.equal(data.gold,before.gold-quote.cost);
   const slot=data.party.indexOf(c.id);if(slot>=0)assert.equal(await page.locator('[data-formation-slot="'+slot+'"] small').textContent(),'Lv.'+data.levels[c.id]);
  }
  report.checks.push('Every unlocked card buys exactly ten levels for the summed cost; archive selection and formation values stay in sync');await context.close();
 }
 {
  const {page,context}=await open();await cats(page);await formation(page);
  await drag(page,page.locator('[data-formation-slot="0"]'),page.locator('[data-formation-slot="3"]'));
  let data=await saved(page);assert.deepEqual(data.party,['mint','ink','milk','orange','bolt']);assert.equal(data.levels.orange,28);assert.equal(data.levels.mint,1);
  await drag(page,page.locator('.formation-bench [data-drag-cat="spark"]'),page.locator('[data-formation-slot="1"]'));
  data=await saved(page);assert.deepEqual(data.party,['mint','spark','milk','orange','bolt']);assert.equal(data.levels.spark,50);assert.equal(data.levels.ink,1);
  await page.screenshot({path:out+'/formation-replaced.png'});
  const before=await saved(page),a=await center(page.locator('[data-formation-slot="0"]'));await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(6,12,{steps:10});await page.mouse.up();await page.waitForTimeout(400);
  assert.deepEqual((await saved(page)).party,before.party);assert.equal(await page.locator('.formation-ghost').count(),0);
  await page.reload({waitUntil:'networkidle'});assert.deepEqual((await saved(page)).party,before.party);
  report.checks.push('Mouse drag swaps allies, replacement preserves training, invalid drops do nothing, and formation survives reload');await context.close();
 }
 {
  const {page,context}=await open(375,667,fixture(),true);await cats(page);await formation(page);
  await touchDrag(page,page.locator('[data-formation-slot="0"]'),page.locator('[data-formation-slot="2"]'));
  let data=await saved(page);assert.deepEqual(data.party,['milk','ink','orange','mint','bolt']);
  await touchDrag(page,page.locator('[data-formation-slot="0"]'),page.locator('[data-formation-slot="4"]'),{cancel:true});assert.deepEqual((await saved(page)).party,data.party);assert.equal(await page.locator('.formation-ghost').count(),0);
  await page.locator('[data-formation-slot="3"]').tap();await page.locator('[data-formation-slot="1"]').tap();assert.deepEqual((await saved(page)).party,['milk','mint','orange','ink','bolt']);
  report.checks.push('Real touch drag swaps positions, touch cancellation preserves formation, and tap-to-select placement works');await context.close();
 }
 {
  const {page,context}=await open(320,568);await cats(page);await formation(page);
  const source=page.locator('.formation-bench [data-drag-cat="spark"]');await source.scrollIntoViewIfNeeded();const a=await center(source),edge=await page.locator('#other-view').boundingBox();
  await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(a.x,edge.y+5,{steps:14});await page.waitForFunction(()=>document.querySelector('#other-view').scrollTop<2,{},{timeout:6000});
  const b=await center(page.locator('[data-formation-slot="1"]'));await page.mouse.move(b.x,b.y,{steps:12});await page.mouse.up();await page.waitForTimeout(400);assert.equal((await saved(page)).party[1],'spark');
  report.checks.push('Dragging from the bench on a short screen automatically scrolls back to the formation');await context.close();
 }
 {
  const s=fixture();s.levels.orange=96;const {page,context}=await open(390,844,s);await cats(page);
  const quote=upgradeQuote(96);assert.equal(quote.levels,4);assert.ok((await page.locator('#crew-roster [data-upgrade="orange"] small').textContent()).includes('4'));
  await page.locator('#crew-roster [data-upgrade="orange"]').click();assert.equal((await saved(page)).levels.orange,100);assert.equal((await saved(page)).gold,s.gold-quote.cost);assert.equal(await page.locator('#crew-roster [data-upgrade="orange"]').isDisabled(),true);await context.close();
  const poor=fixture();poor.gold=upgradeQuote(28).cost-1;const p=await open(320,568,poor);await cats(p.page);assert.equal(await p.page.locator('#crew-roster [data-upgrade="orange"]').isDisabled(),true);assert.equal(await p.page.locator('#crew-detail [data-upgrade="orange"]').isDisabled(),false);await p.context.close();
  report.checks.push('Batch upgrade caps at level 100 and is disabled when the full batch is unaffordable; single-level training remains available');
 }
 {
  const s=fixture();s.stage=120;s.highest=119;s.runCleared=119;for(const id of s.party)s.levels[id]=1;
  const {page,context}=await open(390,844,s);
  await page.waitForFunction(()=>document.querySelectorAll('#actors .rig-ready').length===10);
  assert.equal(await page.locator('#actors .nameplate').count(),0);
  const positions=await page.locator('#actors .actor').evaluateAll(els=>Object.fromEntries(els.map(e=>[e.id,{left:e.style.left,top:e.style.top,size:parseFloat(e.style.getPropertyValue('--actor-size'))}])));
  await page.locator('#battle-start').click();await page.locator('#actors .downed').first().waitFor({timeout:15000});
  if(await page.locator('#battle-start').textContent()==='暂停战斗')await page.locator('#battle-start').click();
  const fallen=await page.locator('#actors .downed').evaluateAll(els=>els.map(e=>({id:e.id,left:e.style.left,top:e.style.top,size:parseFloat(e.style.getPropertyValue('--actor-size')),text:e.querySelector('.actor-tag').textContent,canvas:e.querySelector('canvas').width,visible:getComputedStyle(e).opacity})));
  for(const a of fallen){assert.equal(a.left,positions[a.id].left);assert.equal(a.top,positions[a.id].top);assert.ok(Math.abs(a.size-positions[a.id].size)<.1);assert.equal(a.text,'无法战斗');assert.ok(a.canvas>60);assert.equal(a.visible,'1');}
  assert.ok(!await page.locator('#actors').textContent().then(x=>x.includes('休息')));await page.screenshot({path:out+'/incapacitated-battle.png'});
  report.checks.push('Battle actors have no visible names; incapacitated partners stay in place at full size with the unable-to-fight label');await context.close();
 }
 assert.deepEqual(errors,[]);report.result='passed';report.browserErrors=errors;console.log(JSON.stringify(report,null,2));
}catch(error){report.result='failed';report.error=error.stack;report.browserErrors=errors;for(const context of browser.contexts())for(const page of context.pages())try{await page.screenshot({path:out+'/failure.png',fullPage:true});}catch{}console.error(error);process.exitCode=1;
}finally{await writeFile(out+'/ui-report.json',JSON.stringify(report,null,2));await browser.close();}
