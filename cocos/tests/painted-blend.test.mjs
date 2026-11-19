import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
const esbuild = process.env.CAN_CLUB_ESBUILD ? require(process.env.CAN_CLUB_ESBUILD) : require('esbuild');
const { createCanvas } = process.env.CAN_CLUB_CANVAS ? require(process.env.CAN_CLUB_CANVAS) : require('@napi-rs/canvas');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'cocos/assets/scripts/domain/migration-manifest.json'), 'utf8'));
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'can-club-painted-blend-'));
test.after(() => fs.rm(temporary, { recursive: true, force: true }));
const originalDir = path.join(temporary, 'original');
await fs.mkdir(originalDir);
for (const name of execFileSync('git', ['ls-tree', '--name-only', manifest.sourceCommit], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(name => name.endsWith('.mjs')))
  await fs.writeFile(path.join(originalDir, name), execFileSync('git', ['show', `${manifest.sourceCommit}:${name}`], { cwd: root }));
const imports = [
  "export {renderPuppetFrame} from './rig-renderer.mjs';",
  "export {paintCarrier} from './carrier-art.mjs';",
  "export {paintedLayers} from './painted-transition.mjs';",
  "export {setRosterCanvasFactory} from './finished-roster-renderer.mjs';",
  "export {setFinishedCanvasFactory} from './finished-spark-renderer.mjs';",
  "export {FINISHED_ROSTER} from './finished-roster-data.mjs';",
  "export {FINISHED_SPARK} from './finished-spark-data.mjs';",
].join('\n');
const queryPlugin = { name: 'frozen-preview11-specifiers', setup(build) {
  build.onResolve({ filter: /\?v=/ }, args => ({ path: path.resolve(args.resolveDir, args.path.split('?')[0]) }));
} };
await esbuild.build({ stdin: { contents: imports, resolveDir: originalDir }, outfile: path.join(temporary, 'original.mjs'), bundle: true, format: 'esm', platform: 'node', plugins: [queryPlugin], tsconfigRaw: {} });
await esbuild.build({ entryPoints: [path.join(root, 'cocos/assets/scripts/render/PaintedBlendMath.ts')], outfile: path.join(temporary, 'blend-math.mjs'), bundle: true, format: 'esm', platform: 'node', tsconfigRaw: {} });
const original = await import(pathToFileURL(path.join(temporary, 'original.mjs')));
const { mixPaintedSamples, paintedSecondaryUV } = await import(pathToFileURL(path.join(temporary, 'blend-math.mjs')));
const { PAINTED_MIX_GLSL, paintedEffectSource } = await import(pathToFileURL(path.join(root, 'cocos/vendor/painted-blend-shader.mjs')));
original.setRosterCanvasFactory(createCanvas);
original.setFinishedCanvasFactory(createCanvas);

const normalize = pixel => pixel.map(channel => channel / 255);
const premultiplied = pixel => {
  const [r, g, b, a] = normalize(pixel);
  return [r * a, g * a, b * a, a];
};
const readPixel = (canvas, x = 0, y = 0) => [...canvas.getContext('2d').getImageData(x, y, 1, 1).data];
function pixelCanvas(pixel) {
  const canvas = createCanvas(1, 1), ctx = canvas.getContext('2d');
  const data = ctx.createImageData(1, 1);
  data.data.set(pixel);
  ctx.putImageData(data, 0, 0);
  return canvas;
}

// Actual Canvas 2D operations, matching the frozen renderer's transparent actor
// surface before that surface is composited over the scene with source-over.
function canvasBlend(a, b, weightA, weightB, opacity, mode, background = null) {
  const surface = createCanvas(1, 1), ctx = surface.getContext('2d');
  ctx.globalCompositeOperation = mode;
  for (const [sample, weight] of [[a, weightA], [b, weightB]]) if (weight > 0) {
    ctx.globalAlpha = weight * opacity;
    ctx.drawImage(pixelCanvas(sample), 0, 0);
  }
  if (!background) return readPixel(surface);
  const scene = pixelCanvas(background), sceneCtx = scene.getContext('2d');
  sceneCtx.globalCompositeOperation = 'source-over';
  sceneCtx.drawImage(surface, 0, 0);
  return readPixel(scene);
}

function overBackground(mixed, background) {
  const destination = premultiplied(background);
  return mixed.map((channel, index) => channel + destination[index] * (1 - mixed[3]));
}

// Canvas stores premultiplied 8-bit surfaces and rounds each draw. GPU math keeps
// float precision until the final framebuffer write. Compare premultiplied
// channels (not unstable RGB after unpremultiplying almost-transparent pixels),
// with a three-LSB bound for input premultiplication, two draws and final output.
const MAX_ERROR = 3 / 255;
function closeToCanvas(actual, referenceBytes, scenario) {
  const reference = premultiplied(referenceBytes);
  for (let channel = 0; channel < 4; channel++) {
    assert.ok(Number.isFinite(actual[channel]), `${scenario}: channel ${channel} must be finite`);
    assert.ok(actual[channel] >= 0 && actual[channel] <= 1, `${scenario}: channel ${channel} must stay normalized`);
    assert.ok(Math.abs(actual[channel] - reference[channel]) <= MAX_ERROR + 1e-12,
      `${scenario}: channel ${channel}, float=${actual[channel]}, Canvas=${reference[channel]}, rgba8=${referenceBytes}`);
  }
}

const pairs = [
  [[241, 44, 38, 255], [35, 91, 239, 255]],
  [[238, 180, 98, 94], [32, 157, 204, 163]],
  [[255, 0, 183, 0], [31, 201, 72, 255]],
  [[255, 255, 255, 0], [0, 0, 0, 0]],
  [[243, 27, 189, 1], [17, 221, 241, 2]],
  [[67, 116, 153, 211], [241, 232, 200, 63]],
];
const backgrounds = [[0, 0, 0, 0], [25, 44, 56, 255], [246, 225, 185, 255], [46, 97, 163, 107]];

test('opaque hero drawings retain full alpha through the approved short blend', () => {
  const a = [235, 85, 32, 255], b = [41, 120, 221, 255];
  for (const fraction of [0, 0.41, 0.43, 0.46, 0.5, 0.54, 0.57, 0.59, 1]) {
    const layers = original.paintedLayers(0, 1, fraction);
    const weightA = layers.find(([cel]) => cel === 0)?.[1] || 0;
    const weightB = layers.find(([cel]) => cel === 1)?.[1] || 0;
    const actual = mixPaintedSamples(normalize(a), normalize(b), weightA, weightB);
    assert.ok(Math.abs(actual[3] - 1) < 1e-12, `hero alpha must stay 1 at fraction ${fraction}`);
    closeToCanvas(actual, canvasBlend(a, b, weightA, weightB, 1, 'lighter'), `opaque fraction ${fraction}`);
  }
  const incorrect = canvasBlend(a, b, 0.5, 0.5, 1, 'source-over');
  assert.ok(incorrect[3] < 200, 'the old two-source-over-sprite regression must be visibly distinguishable');
});

for (const mode of ['lighter', 'source-over']) test(`${mode} premultiplied samples match real Canvas edges, weights, opacity and backgrounds`, () => {
  for (let pair = 0; pair < pairs.length; pair++) {
    const [a, b] = pairs[pair];
    for (const weightB of [0, 0.17, 0.5, 0.83, 1]) for (const opacity of [0, 0.19, 0.65, 1]) {
      const weightA = 1 - weightB, scenario = `${mode} pair ${pair} wB=${weightB} opacity=${opacity}`;
      const actual = mixPaintedSamples(normalize(a), normalize(b), weightA, weightB, opacity, mode);
      closeToCanvas(actual, canvasBlend(a, b, weightA, weightB, opacity, mode), scenario + ' transparent actor surface');
      for (const background of backgrounds)
        closeToCanvas(overBackground(actual, background), canvasBlend(a, b, weightA, weightB, opacity, mode, background), scenario + ` over ${background}`);
      for (let channel = 0; channel < 3; channel++) assert.ok(actual[channel] <= actual[3] + 1e-12, `${scenario}: RGB must already be premultiplied`);
    }
  }
});

test('source-over keeps original layer order and applies pose opacity before composing layers', () => {
  const a = [255, 0, 0, 255], b = [0, 0, 255, 255];
  const actual = mixPaintedSamples(normalize(a), normalize(b), 0.5, 0.5, 0.5, 'source-over');
  assert.deepEqual(actual, [0.1875, 0, 0.25, 0.4375]);
  closeToCanvas(actual, canvasBlend(a, b, 0.5, 0.5, 0.5, 'source-over'), 'ordered red then blue, opacity before layers');
  assert.notEqual(actual[3], 0.75 * 0.5, 'applying opacity after source-over would change the original enemy fade');
  const reversed = mixPaintedSamples(normalize(b), normalize(a), 0.5, 0.5, 0.5, 'source-over');
  assert.notEqual(actual[0], reversed[0], 'the later layer must remain on top');
});

test('a single selected frame has no second-sample contribution in either mode', () => {
  const sample = [207, 101, 43, 113], unrelated = [11, 224, 186, 255];
  for (const mode of ['lighter', 'source-over']) for (const opacity of [0, 0.2, 0.7, 1]) for (const background of backgrounds) {
    const expected = canvasBlend(sample, unrelated, 1, 0, opacity, 'source-over', background);
    closeToCanvas(overBackground(mixPaintedSamples(normalize(sample), normalize(unrelated), 1, 0, opacity, mode), background), expected, `${mode} first frame alone`);
    closeToCanvas(overBackground(mixPaintedSamples(normalize(unrelated), normalize(sample), 0, 1, opacity, mode), background), expected, `${mode} second frame alone`);
  }
});

test('same-frame selections collapse before blending, retaining original alpha and color', () => {
  const sample = [189, 94, 37, 109];
  for (const fraction of [0, 0.2, 0.5, 0.8, 1]) for (const short of [false, true]) {
    const layers = original.paintedLayers(4, 4, fraction, { short });
    assert.deepEqual(layers, [[4, 1]]);
    for (const mode of ['lighter', 'source-over']) {
      const result = mixPaintedSamples(normalize(sample), normalize(sample), layers[0][1], 0, 0.65, mode);
      closeToCanvas(result, canvasBlend(sample, sample, 1, 0, 0.65, 'source-over'), `${mode} same frame fraction ${fraction}`);
    }
  }
});

test('frozen enemy and material-carrier painters use source-over, unlike finished heroes', () => {
  const red = [255, 0, 0, 255], blue = [0, 0, 255, 255];
  const enemyAtlas = createCanvas(64, 16), ec = enemyAtlas.getContext('2d');
  ec.fillStyle = '#ff0000'; ec.fillRect(0, 0, 16, 16);
  ec.fillStyle = '#0000ff'; ec.fillRect(48, 0, 16, 16);
  const target = createCanvas(128, 128);
  const pose = { alpha: 0.7, sink: 0, lean: 0, breath: 0, head: 0, reach: 0, enemyHit: 0.5 };
  original.renderPuppetFrame(target.getContext('2d'), 'dust', pose, enemyAtlas, 128, 128, [0, 0, 16, 16]);
  closeToCanvas(mixPaintedSamples(normalize(red), normalize(blue), 0.5, 0.5, 0.7, 'source-over'), readPixel(target, 58, 64), 'frozen enemy renderer');

  const carrierAtlas = createCanvas(80, 32), cc = carrierAtlas.getContext('2d');
  cc.fillStyle = '#ff0000'; cc.fillRect(0, 0, 16, 16);
  cc.fillStyle = '#0000ff'; cc.fillRect(16, 0, 16, 16);
  const carrier = createCanvas(16, 16), carrierCtx = carrier.getContext('2d');
  carrierCtx.scale(16, 16); carrierCtx.globalAlpha = 0.7;
  original.paintCarrier(carrierCtx, carrierAtlas, 'carrierScrap', { carrierFrom: 0, carrierCel: 1, carrierMix: 0.5 });
  closeToCanvas(mixPaintedSamples(normalize(red), normalize(blue), 0.5, 0.5, 0.7, 'source-over'), readPixel(carrier, 8, 8), 'frozen carrier renderer');

  const kit = original.FINISHED_ROSTER.orange, heroAtlas = createCanvas(kit.width, kit.height), hc = heroAtlas.getContext('2d');
  hc.fillStyle = '#ff0000'; hc.fillRect(...kit.frames[0]);
  hc.fillStyle = '#0000ff'; hc.fillRect(...kit.frames[8]);
  const hero = createCanvas(128, 128);
  original.renderPuppetFrame(hero.getContext('2d'), 'orange', { ...pose, alpha: 1, rosterCel: 0.5, rosterClock: 0 }, heroAtlas, 128, 128, null, { to: 'neutral' });
  closeToCanvas(mixPaintedSamples(normalize(red), normalize(blue), 0.5, 0.5), readPixel(hero, 58, 64), 'frozen finished hero renderer');
  assert.ok(readPixel(hero, 58, 64)[3] >= 253, 'hero lighter overlap retains opaque silhouette');
  assert.ok(readPixel(carrier, 8, 8)[3] < 160, 'carrier opacity is composed in source-over order');
});

test('secondary sampling maps atlas crops and standalone expressions to the same local point', () => {
  const uv = (x, y, w, h, tw, th) => [x / tw, (y + h) / th, (x + w) / tw, (y + h) / th, x / tw, y / th, (x + w) / tw, y / th];
  const pairs = [
    [uv(0, 0, 512, 544, 2048, 1632), uv(0, 1088, 512, 544, 2048, 1632)],
    [uv(1024, 544, 512, 544, 2048, 2176), uv(512, 1632, 512, 544, 2048, 2176)],
    [uv(512, 544, 512, 544, 2048, 1900), uv(0, 0, 512, 544, 512, 544)],
    [uv(0, 0, 512, 544, 512, 544), uv(1536, 544, 512, 544, 2048, 1900)],
  ];
  for (const [first, second] of pairs) {
    const [sx, sy, ox, oy] = paintedSecondaryUV(first, second);
    for (const u of [0, 0.2, 0.5, 0.9, 1]) for (const v of [0, 0.4, 1]) {
      const inputU = first[4] + (first[6] - first[4]) * u, inputV = first[5] + (first[1] - first[5]) * v;
      const expectedU = second[4] + (second[6] - second[4]) * u, expectedV = second[5] + (second[1] - second[5]) * v;
      assert.ok(Math.abs(inputU * sx + ox - expectedU) < 1e-12);
      assert.ok(Math.abs(inputV * sy + oy - expectedV) < 1e-12);
    }
  }
});

test('Creator effect embeds the shared GLSL and uses premultiplied source-over for the final scene', async () => {
  const effect = paintedEffectSource();
  const checkedInEffect = await fs.readFile(path.join(root, 'cocos/assets/resources/effects/canclub-painted-blend.effect'), 'utf8');
  assert.equal(checkedInEffect, effect, 'Creator asset must match the common shader generator exactly');
  assert.ok(effect.includes(PAINTED_MIX_GLSL));
  assert.match(effect, /blendSrc:\s*one\s/);
  assert.match(effect, /blendDst:\s*one_minus_src_alpha\s/);
  assert.match(effect, /blendSrcAlpha:\s*one\s/);
  assert.match(effect, /blendDstAlpha:\s*one_minus_src_alpha\s/);
  // This checks source generation, not GPU compilation or actual on-device color.
  const runtime = await fs.readFile(path.join(root, 'cocos/vendor/painted-blend-shader.mjs'), 'utf8');
  assert.ok(runtime.includes('${PAINTED_MIX_GLSL}'), 'runtime shader assembly must embed the common GLSL function');
});
