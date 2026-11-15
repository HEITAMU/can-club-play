import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url),shell=fs.readFileSync(new URL('index.html',root),'utf8');
execFileSync(process.execPath,['scripts/package-growth-preview.mjs'],{cwd:root});
test('packaged trial shares existing art with correct HTML and external CSS URL bases',()=>{
 const html=fs.readFileSync(new URL('dist/growth-preview/play.html',root),'utf8'),css=fs.readFileSync(new URL('dist/growth-preview/game.bundle.css',root),'utf8');
 assert.match(html,/<base href="\.\.\/">/);assert.match(html,/src="growth-preview\/game.bundle.mjs\?v=/);assert.match(html,/href="growth-preview\/game.bundle.css\?v=/);
 const paths=[...css.matchAll(/url\(['"]?([^)'"\s]+)/g)].map(m=>m[1]).filter(x=>x.includes('assets/'));assert.ok(paths.length>20);
 for(const url of paths){const resolved=new URL(url,'https://example.test/can-club-play/growth-preview/game.bundle.css');assert.ok(resolved.pathname.startsWith('/can-club-play/assets/'),url);assert.ok(fs.existsSync(new URL(url.slice(3),root)),url);}
 assert.equal(fs.readFileSync(new URL('index.html',root),'utf8'),shell);
});
test('packaged app saves into the trial namespace and cannot register the stable worker',()=>{
 const bundle=fs.readFileSync(new URL('dist/growth-preview/game.bundle.mjs',root),'utf8');
 assert.ok(bundle.includes('can-club-growth-preview-v1'));assert.ok(bundle.includes('CAN-CLUB-GROWTH-1'));assert.ok(!bundle.includes('can-club-save-v1'));assert.ok(!bundle.includes('.serviceWorker.register('));
});
