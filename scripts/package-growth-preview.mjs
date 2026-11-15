import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dest=path.join(root,'dist/growth-preview');
await fs.mkdir(dest,{recursive:true});
let html=await fs.readFile(path.join(root,'index.html'),'utf8');
// A .html page is deliberate: the stable service worker treats every */index.html
// navigation as the stable shell. A distinct filename bypasses that fallback.
html=html.replace('<meta charset="utf-8">','<meta charset="utf-8"><base href="../">').replace(/(href|src)="game\.bundle\.(mjs|css)/g,'$1="growth-preview/game.bundle.$2').replace('<link rel="manifest" href="manifest.webmanifest">','');
await fs.writeFile(path.join(dest,'play.html'),html);
for(const file of ['game.bundle.mjs','game.bundle.css'])await fs.copyFile(path.join(root,file),path.join(dest,file));
console.log('Packaged growth-preview/play.html with shared original artwork and isolated save storage.');
