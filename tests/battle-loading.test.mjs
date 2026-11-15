import test from 'node:test';import assert from 'node:assert/strict';
import {loadBattleAssets,battleAssetsReady,SHARED_BATTLE_ASSETS} from '../battle-loading.mjs';
import {damageTextStyle} from '../damage-text-style.mjs';
test('all critical decorations are mandatory battle assets',()=>{for(const damageType of ['magic','physical'])assert.ok(SHARED_BATTLE_ASSETS.includes(damageTextStyle({crit:true,damageType}).icon));});
test('loading progress counts unique decoded assets and cannot complete before decode',async()=>{let decode;const done=new Promise(r=>decode=r),p=[],cache={entries:new Map(),subscribe(u,fn){fn({decode:()=>u==='a'?done:Promise.resolve()});return ()=>{};}};let complete=false;const pending=loadBattleAssets(['a','a','b'],{cache,onProgress:(n,total)=>p.push([n,total])}).then(()=>complete=true);await new Promise(r=>setTimeout(r,0));assert.equal(complete,false);assert.deepEqual(p,[[0,2],[1,2]]);decode();await pending;assert.deepEqual(p.at(-1),[2,2]);});
test('missing or undecodable assets fail instead of pretending to be fully loaded',async()=>{await assert.rejects(loadBattleAssets(['broken'],{timeout:10,cache:{subscribe(){return ()=>{};}}}),/timeout/);await assert.rejects(loadBattleAssets(['corrupt'],{cache:{subscribe(u,fn){fn({decode:async()=>{throw Error('bad');}});return ()=>{};}}}),/decode/);assert.equal(battleAssetsReady(['a'],{entries:new Map([['a',{ready:true}]])}),false);});

test('downloaded image is not battle-ready until decoded',async()=>{
 let finish;const img={decode:()=>new Promise(r=>finish=r)},cache={entries:new Map([['a',{ready:true,img}]]),subscribe(u,fn){fn(img);return ()=>{};}};
 const pending=loadBattleAssets(['a'],{cache});assert.equal(battleAssetsReady(['a'],cache),false);finish();await pending;assert.equal(battleAssetsReady(['a'],cache),true);
});
test('failure detaches every listener and suppresses progress from abandoned loads',async()=>{
 const callbacks={},progress=[];let listeners=0;
 const cache={subscribe(u,fn){callbacks[u]=fn;listeners++;return ()=>listeners--;}};
 const pending=loadBattleAssets(['bad','slow'],{cache,onProgress:n=>progress.push(n)});
 callbacks.bad({decode:async()=>{throw Error('corrupt');}});await assert.rejects(pending,/decode/);assert.equal(listeners,0);
 callbacks.slow({decode:async()=>{}});await Promise.resolve();assert.deepEqual(progress,[0]);
});
test('a failed decode invalidates the cached image so retry can fetch again',async()=>{
 const {ImageCache}=await import('../image-cache.mjs');const images=[];
 const cache=new ImageCache({createImage:()=>{const img={width:100,decode:async()=>{if(images.indexOf(img)===0)throw Error('bad');}};images.push(img);return img;}});
 const first=loadBattleAssets(['a'],{cache});images[0].onload();await assert.rejects(first,/decode/);assert.equal(cache.entries.get('a').ready,false);
 const retry=loadBattleAssets(['a'],{cache});assert.equal(images.length,2);images[1].onload();await retry;assert.equal(battleAssetsReady(['a'],cache),true);
});
