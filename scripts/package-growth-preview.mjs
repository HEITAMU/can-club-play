import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dest=path.join(root,'dist/growth-preview');
await fs.mkdir(dest,{recursive:true});
let html=await fs.readFile(path.join(root,'index.html'),'utf8');
// A .html page is deliberate: the stable service worker treats every */index.html
// navigation as the stable shell. A distinct filename bypasses that fallback.
html=html.replaceAll('0.28.0-preview','0.28.0-preview.10').replace('<meta charset="utf-8">','<meta charset="utf-8"><base href="../">').replace(/(href|src)="game\.bundle\.(mjs|css)/g,'$1="growth-preview/game.bundle.$2').replace('<link rel="manifest" href="manifest.webmanifest">','');
await fs.writeFile(path.join(dest,'play.html'),html);
await fs.copyFile(path.join(root,'game.bundle.mjs'),path.join(dest,'game.bundle.mjs'));
// CSS URLs resolve relative to the stylesheet, independently of HTML <base>.
const css=(await fs.readFile(path.join(root,'game.bundle.css'),'utf8')).replace(/url\((['"]?)(?:\.\/)?assets\//g,'url($1../assets/');
await fs.writeFile(path.join(dest,'game.bundle.css'),css);
console.log('Packaged growth-preview/play.html with shared original artwork and isolated save storage.');
