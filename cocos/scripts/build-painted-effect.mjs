import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {paintedEffectSource} from '../vendor/painted-blend-shader.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'assets/resources/effects/canclub-painted-blend.effect');
await fs.mkdir(path.dirname(file),{recursive:true});
await fs.writeFile(file,paintedEffectSource());
console.log('Creator painted blend effect synchronized.');
