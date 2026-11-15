import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {startupAssets,COMMON_UI_ASSETS} from '../startup-assets.mjs';
import {FINISHED_ROSTER} from '../finished-roster-data.mjs';
import {webAsset} from '../web-assets.mjs';
test('startup covers owned companions and common first-visit assets without unowned atlases',()=>{
 const urls=startupAssets(['orange','ink','orange']);
 assert.equal(urls.length,new Set(urls).size);
 for(const id of ['orange','ink'])for(const key of ['atlas','portrait'])assert.ok(urls.includes(webAsset(FINISHED_ROSTER[id][key])));
 assert.ok(!urls.includes(webAsset(FINISHED_ROSTER.pudding.atlas)));
 for(const url of COMMON_UI_ASSETS)assert.ok(urls.includes(url));
});
test('all startup URLs exist, including spark, and shared payload stays below 2 MB',()=>{
 for(const url of startupAssets([...Object.keys(FINISHED_ROSTER),'spark']))assert.ok(fs.existsSync(new URL('../'+url,import.meta.url)),url);
 const bytes=COMMON_UI_ASSETS.reduce((n,url)=>n+fs.statSync(new URL('../'+url,import.meta.url)).size,0);
 assert.ok(bytes<2*1024*1024,bytes+' shared bytes');
});
