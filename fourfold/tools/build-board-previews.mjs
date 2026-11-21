#!/usr/bin/env node
/**
 * Build the same controller as a portable full-quality HTML and a compact
 * in-conversation fragment. No npm packages or browser/network access needed.
 * Production images are read only. Only the inline copy uses AVIF encoding.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const project = path.dirname(toolsDir);
const scriptDir = path.join(project, 'cocos/assets/scripts');
const resourceDir = path.join(project, 'cocos/assets/resources/art');
const args = process.argv.slice(2);
const outputIndex = args.indexOf('--fragment');
const fragmentPath = outputIndex < 0 ? '/workspace/fourfold-live-board.html' : path.resolve(args[outputIndex + 1]);
const outputDir = path.join(project, 'art-source/previews');
const offlinePath = path.join(outputDir, 'fourfold-live-board.html');
const read = name => fs.readFileSync(name, 'utf8');
const { TILE_THEMES } = await import(pathToFileURL(path.join(scriptDir, 'TileThemes.js')));
const reference = JSON.parse(read(path.join(resourceDir, 'referenceLayout.json')));

// Exact source extraction: the preview needs only the pure permutation rule,
// not the separate 25,000-puzzle daily bank imported by the full Core module.
// Boundaries are deliberately strict: a source change should fail the build,
// not silently substitute a second copy of the game rules.
const coreSource = read(path.join(scriptDir, 'Core.js'));
const start = coreSource.indexOf("export const GOAL = '123456789';");
const end = coreSource.indexOf('export const inverse =');
if (start < 0 || end <= start || !coreSource.slice(start, end).includes('export function rotate(board, q, dir=1)')) {
  throw new Error('Core source boundaries changed; review preview extraction.');
}
const coreSlice = coreSource.slice(start, end);

function moduleBody(source, expectedExports) {
  const actual = [...source.matchAll(/^export\s+(?:const|function|class)\s+([\w$]+)/gm)].map(match => match[1]);
  for (const name of expectedExports) if (!actual.includes(name)) throw new Error(`Missing module export ${name}`);
  const body = source.replace(/^export\s+(?=(?:const|function|class)\s)/gm, '');
  if (/^\s*(import|export)\s/m.test(body)) throw new Error('Unsupported module syntax in portable preview');
  return `${body}\nreturn { ${expectedExports.join(', ')} };`;
}

const controllerSource = read(path.join(project, 'tests/interactive-board.js'));
const imports = [...controllerSource.matchAll(/^import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?\s*$/gm)];
const allowedModules = new Map([
  ['Core.js', ['GOAL', 'SQUARES', 'rotate']],
  ['TurnMotion.js', ['TURN_DURATION_MS', 'createTurnMotion', 'sampleTurn']],
  ['TileThemes.js', ['TILE_THEMES', 'buildThemeArtwork']],
]);
if (imports.length !== allowedModules.size) throw new Error('Review changed controller dependencies');
const bindings = imports.map(match => {
  const moduleName = path.basename(match[2].split('?')[0]);
  const allowed = allowedModules.get(moduleName);
  if (!allowed) throw new Error(`Unexpected controller module: ${moduleName}`);
  const entries = match[1].split(',').map(value => value.trim()).filter(Boolean);
  for (const entry of entries) if (!allowed.includes(entry.split(/\s+as\s+/)[0])) throw new Error(`Unexpected import ${entry}`);
  const objectBinding = entries.map(value => value.replace(/\s+as\s+/, ': ')).join(', ');
  return `const { ${objectBinding} } = FFModules[${JSON.stringify(moduleName)}];`;
});
const controllerBody = controllerSource.replace(/^import\s*\{[^}]+\}\s*from\s*['"][^'"]+['"];?\s*$/gm, '');
const bundledScript = [
  '(() => {',
  '"use strict";',
  'const FFModules = {};',
  `FFModules['Core.js'] = (() => { ${moduleBody(coreSlice, ['GOAL', 'SQUARES', 'rotate'])} })();`,
  `FFModules['TurnMotion.js'] = (() => { ${moduleBody(read(path.join(scriptDir, 'TurnMotion.js')), allowedModules.get('TurnMotion.js'))} })();`,
  `FFModules['TileThemes.js'] = (() => { ${moduleBody(read(path.join(scriptDir, 'TileThemes.js')), allowedModules.get('TileThemes.js'))} })();`,
  `const previewModule = (() => { ${bindings.join('\n')}\n${moduleBody(controllerBody, ['createBoardSession', 'mountBoardPreview'])} })();`,
  "const root = document.getElementById('ff-live-board');",
  "const payload = JSON.parse(document.getElementById('ff-preview-data').textContent);",
  "const preview = previewModule.mountBoardPreview(root, payload);",
  "Promise.resolve(preview.ready).catch(error => { root.dataset.previewError = String(error.message || error); });",
  '})();',
].join('\n');
new vm.Script(bundledScript, { filename: 'fourfold-preview-bundle.js' });
if (/\b(fetch|XMLHttpRequest|WebSocket)\s*\(|\bimport\s*\(/.test(bundledScript)) throw new Error('Portable preview must not request network resources');

// Only the existing board artwork rules are needed. Exclude unrelated screen
// chrome and make every inherited selector local to this preview root.
const referenceCss = read(path.join(project, 'reference.css'));
const cssEnd = referenceCss.indexOf('/* Daily controls are independent crops;');
if (cssEnd < 0) throw new Error('Reference CSS boundary changed; review the board styles.');
const scopedReferenceCss = referenceCss.slice(0, cssEnd)
  .replace(/\.game-screen/g, ':where(#ff-live-board) .game-screen')
  .replace(/url\(['"]?assets\/art\/reference-daily\.webp['"]?\)/g, 'var(--ff-reference-image)');
const styles = scopedReferenceCss + '\n' + read(path.join(project, 'tests/interactive-board.css')) + '\n#ff-preview-surface{background:transparent;width:100%;padding:0;box-sizing:border-box;}\n';
if (/url\(\s*['"]?(?!data:|var\()[^)]/.test(styles)) throw new Error('Portable CSS contains a non-inline URL');

const fragmentTemplate = read(path.join(toolsDir, 'preview-fragment.template.html'));
const documentTemplate = read(path.join(toolsDir, 'preview-document.template.html'));
function makeFragment(assetUrls) {
  const payload = JSON.stringify({reference, themes: TILE_THEMES, assetUrls, defaultTheme: 'jade'}).replace(/</g, '\\u003c');
  return fragmentTemplate.replace('/* @@STYLES@@ */', styles)
    .replace('@@DATA@@', payload)
    .replace('/* @@SCRIPT@@ */', bundledScript.replace(/<\/script/gi, '<\\/script'));
}
const dataUrl = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;
const fullUrls = {reference: dataUrl(path.join(project, 'assets/art/reference-daily.webp'), 'image/webp')};
for (const theme of TILE_THEMES) fullUrls[theme.resource] = dataUrl(path.join(project, `assets/art/${theme.resource}.webp`), 'image/webp');
const offlineFragment = makeFragment(fullUrls);
const offline = documentTemplate.replace('<!-- @@FRAGMENT@@ -->', offlineFragment);
fs.mkdirSync(outputDir, {recursive: true});
fs.writeFileSync(offlinePath, offline);

const sources = [
  {key: 'reference', path: path.join(resourceDir, 'reference-daily.png')},
  ...TILE_THEMES.map(theme => ({key: theme.resource, path: path.join(resourceDir, `${theme.resource}.png`)})),
];
// Preserve the actual dimensions; only the inline transport copy is compressed.
// A strict whole-fragment byte cap includes every image, style, script, and label.
const python = process.env.CODEX_PRIMARY_RUNTIME_PYTHON || 'python3';
let selected;
for (const quality of [52, 51, 50, 48, 46, 44, 42, 40]) {
  const encoded = JSON.parse(execFileSync(python, [path.join(toolsDir, 'encode-preview-images.py')], {
    input: JSON.stringify({assets: sources, quality}), encoding: 'utf8', maxBuffer: 24 * 1024 * 1024,
  }));
  const fragment = makeFragment(encoded.assetUrls);
  if (Buffer.byteLength(fragment) <= 980000) {
    selected = {fragment, encoding: encoded.report};
    break;
  }
}
if (!selected) throw new Error('Inline preview exceeded the byte budget at every approved encoding quality');
fs.mkdirSync(path.dirname(fragmentPath), {recursive: true});
fs.writeFileSync(fragmentPath, selected.fragment);
const report = {
  offline: {path: path.relative(project, offlinePath), bytes: Buffer.byteLength(offline), images: 'existing full-size quality95 WebP'},
  inline: {path: fragmentPath, bytes: Buffer.byteLength(selected.fragment), ...selected.encoding},
  sourceModules: ['Core.js (GOAL/SQUARES/rotate exact source slice)', 'TurnMotion.js', 'TileThemes.js', 'tests/interactive-board.js'],
  networkRequests: false,
};
fs.writeFileSync(path.join(outputDir, 'preview-build-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
