import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
for(const script of ['build-painted-effect.mjs','prepare-faces.mjs','build-assets.mjs','build-meta.mjs']){
 const child=spawnSync(process.execPath,[path.join(root,'scripts',script)],{cwd:root,stdio:'inherit',env:process.env});
 if(child.status!==0)throw Error(`${script} failed`);
}
console.log('Creator project prepared with original-resolution imported art.');
