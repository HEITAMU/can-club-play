import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../wechat/package.json',import.meta.url));
const {chromium}=require('playwright');
const root=path.resolve(import.meta.dirname,'..');
const server=http.createServer((req,res)=>{const p=path.resolve(root,'.'+new URL(req.url,'http://local').pathname.replace(/\/$/,'/index.html'));if(!p.startsWith(root+'/'))return res.writeHead(403).end();try{const b=fs.readFileSync(p);res.setHeader('Content-Type',({'.mjs':'text/javascript','.js':'text/javascript','.html':'text/html','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml'})[path.extname(p)]||'application/octet-stream');res.end(b);}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,serviceWorkers:'block'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 let release;const hold=new Promise(r=>release=r);let requested;const request=new Promise(r=>requested=r);
 await page.route('**/critical-physical-v02658.webp',async route=>{requested();await hold;await route.continue();});
 await page.goto(`http://127.0.0.1:${server.address().port}/`,{waitUntil:'domcontentloaded'});
 await request;assert.equal(await page.locator('#boot-status').isVisible(),true);
 assert.ok(Number(await page.locator('#loading-progress').getAttribute('value'))<100);
 release();await page.locator('#boot-status').waitFor({state:'hidden',timeout:30000});
 assert.deepEqual(errors,[]);
 const report={version:'0.26.88',viewport:'390x844',coldStart:true,criticalAssetHeldBehindLoading:true,enteredAfterRelease:true,pageErrors:errors};
 fs.writeFileSync(path.join(root,'docs/review/release-v02688/browser.json'),JSON.stringify(report,null,2)+'\n');console.log(report);
}finally{await browser.close();server.close();}
