import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8'),version=source.match(/const RELEASE='([^']+)'/)[1];
function worker({partial=false}={}){
 const events={},stores=new Map(),requests=[],navigated=[],notified=[],base='https://example.test/game/';
 const resolve=k=>new URL(typeof k==='string'?k:k.url,base).href;
 const clients=[{url:base},{url:base+'?v='+version},{url:'https://example.test/other/'}].map((c,i)=>({...c,postMessage:msg=>notified.push([i,msg]),navigate:async url=>navigated.push([i,url])}));
 const caches={open:async name=>{if(!stores.has(name))stores.set(name,new Map());const data=stores.get(name);return {put:async(k,r)=>data.set(resolve(k),r.clone()),match:async k=>data.get(resolve(k))?.clone(),keys:async()=>[...data.keys()].map(url=>({url}))};},keys:async()=>[...stores.keys()],delete:async key=>stores.delete(key)};
 vm.runInNewContext(source,{URL,Response,caches,setTimeout:fn=>{fn();return 1;},clearTimeout(){},fetch:async(url,options)=>{requests.push([url,options]);return new Response(String(url).includes('index.html')?'game.bundle.mjs?v='+version:'bundle',{status:partial&&String(url).includes('.css')?503:200});},self:{location:{origin:'https://example.test',href:base+'sw.js'},skipWaiting:async()=>{},clients:{claim:async()=>{},matchAll:async()=>clients},addEventListener:(name,fn)=>events[name]=fn}});
 return {requests,navigated,notified,async event(name){let p;events[name]({waitUntil:v=>p=v});await p;},async page(){let p;events.fetch({request:{url:base,method:'GET',mode:'navigate'},respondWith:v=>p=v,waitUntil(){}});return p;}};
}
test('complete new shell moves only stale game tabs once and signals save before navigation',async()=>{
 const w=worker();await w.event('install');await w.event('activate');assert.equal(w.navigated.length,1);assert.equal(new URL(w.navigated[0][1]).searchParams.get('v'),version);assert.equal(w.notified[0][1].type,'GAME_UPDATE_READY');assert.ok(w.requests.every(([,options])=>options.cache==='no-store'));
});
test('partial installation never reloads clients into a missing bundle',async()=>{const w=worker({partial:true});await w.event('install');await w.event('activate');assert.equal(w.navigated.length,0);});
test('navigation bypasses HTTP caches with a release-specific URL',async()=>{const w=worker();await w.page();assert.equal(new URL(w.requests[0][0]).searchParams.get('_shell'),version);assert.equal(w.requests[0][1].cache,'no-store');});
