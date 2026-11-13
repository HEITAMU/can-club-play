import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import crypto from "node:crypto";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  out = path.join(root, "dist/wechat");
const localRequire = createRequire(path.join(root, "wechat/package.json")),
  require = createRequire(import.meta.url);
function dependency(name) {
  try {
    return localRequire(name);
  } catch {
    try {
      return require(name);
    } catch {
      return require(path.join(root, "qa/wechat-tools/node_modules", name));
    }
  }
}
const sharp = dependency("sharp"),
  esbuild = dependency("esbuild");
const appid = process.env.WECHAT_APPID || "wx43da24c6ac1e5a12";
if (!/^wx[a-f\d]{16}$/.test(appid))
  throw Error("WECHAT_APPID 必须为 wx 开头的正式或测试 AppID");
await fs.rm(out, { recursive: true, force: true });
await fs.mkdir(out, { recursive: true });
const list = [
  "anatomy/cats-a-v0200.webp",
  "anatomy/cats-b.webp",
  "anatomy/cats-c.webp",
  "anatomy/cats-d.webp",
  "painted/enemies-a.webp",
  "painted/enemies-b.webp",
  "painted/enemies-c.webp",
  "painted/items.webp",
  "scenes/streets-v019.webp",
  "vfx/effects.webp",
  "vfx/can-rescue-v0192.webp",
  "finished/spark-v0211.webp",
  "finished/orange-v0213.webp",
  "finished/ink-v0213.webp",
  "finished/milk-v0213.webp",
  "finished/mint-v0213.webp",
  "finished/bolt-v0213.webp",
  "finished/star-v0213.webp",

];
const assets = {},
  packages = [],
  audit = [];
let group = null;
const prepared = [];
for (const relative of list) {
  const source = "assets/" + relative,
    pipeline = sharp(path.join(root, source));
  const meta = await pipeline.metadata();
  if (relative.startsWith("painted/enemies-"))
    pipeline.extract({
      left: 0,
      top: 0,
      width: Math.floor(meta.width / 4),
      height: meta.height,
    });
  if (relative === "finished/spark-v0211.webp") pipeline.resize({width:1536});
  const jpg = relative.startsWith("scenes/");
  const data = await (
    jpg
      ? pipeline.jpeg({ quality: 93, chromaSubsampling: "4:4:4" })
      : pipeline.png({ compressionLevel: 9 })
  ).toBuffer();
  if (data.length > 3.8 * 1024 ** 2) throw Error("单图超出分包预算：" + source);
  prepared.push({relative,source,data});
}
// Largest-first placement avoids adding a package just because a late atlas is large.
for (const {relative,source,data} of prepared.sort((a,b)=>b.data.length-a.data.length)) {
  const jpg = relative.startsWith("scenes/");
  group = packages.find(p => p.bytes + data.length <= 3.8 * 1024 ** 2);
  if (!group) {
    group = {
      name: "art" + (packages.length + 1),
      root: "packs/art" + (packages.length + 1) + "/",
      bytes: 0,
    };
    packages.push(group);
    await fs.mkdir(path.join(out, group.root), { recursive: true });
    await fs.writeFile(
      path.join(out, group.root, "game.js"),
      "// Art-only subpackage.\n",
    );
  }
  const dest =
    group.root + path.basename(relative, ".webp") + (jpg ? ".jpg" : ".png");
  await fs.writeFile(path.join(out, dest), data);
  assets[source] = dest;
  group.bytes += data.length;
  audit.push({
    source,
    path: dest,
    bytes: data.length,
    sha256: crypto.createHash("sha256").update(data).digest("hex"),
  });
}
await esbuild.build({
  entryPoints: [path.join(root, "wechat/src/runtime.mjs")],
  outfile: path.join(out, "runtime.js"),
  bundle: true,
  platform: "neutral",
  format: "cjs",
  target: "es2019",
  minify: true,
  plugins: [
    {
      name: "versioned-imports",
      setup(build) {
        build.onResolve({ filter: /\?v=/ }, (args) => ({
          path: path.resolve(args.resolveDir, args.path.split("?")[0]),
        }));
        build.onLoad({ filter: /battle-cues\.mjs$/ }, async (args) => ({
          contents: (await fs.readFile(args.path, "utf8")).replace(
            "structuredClone(positions)",
            "JSON.parse(JSON.stringify(positions))",
          ),
          loader: "js",
        }));
      },
    },
  ],
});
const manifest = {
  version: "0.21.3",
  appid,
  packages: packages.map(({ name, root }) => ({ name, root })),
  assets,
};
await fs.writeFile(
  path.join(out, "asset-manifest.json"),
  JSON.stringify(manifest, null, 2),
);
await fs.writeFile(
  path.join(out, "game.js"),
  `// Generated native WeChat Mini Game entry; no HTML or web-view.\nif(!Array.prototype.at)Object.defineProperty(Array.prototype,'at',{value:function(i){i=Math.trunc(i)||0;return this[i<0?this.length+i:i];}});\nif(!Object.fromEntries)Object.fromEntries=function(entries){var result={};for(var pair of entries)result[pair[0]]=pair[1];return result;};\nrequire('./runtime.js').boot(wx,require('./asset-manifest.json'));\n`,
);
await fs.writeFile(
  path.join(out, "game.json"),
  JSON.stringify(
    {
      deviceOrientation: "portrait",
      showStatusBar: false,
      networkTimeout: { request: 10000, downloadFile: 20000 },
      subpackages: manifest.packages,
    },
    null,
    2,
  ),
);
await fs.writeFile(
  path.join(out, "project.config.json"),
  JSON.stringify(
    {
      description: "罐头远征队 · 微信小游戏测试工程",
      projectname: "can-club-expedition",
      appid,
      compileType: "game",
      miniprogramRoot: "./",
      setting: { es6: false, minified: true, urlCheck: true },
      packOptions: {
        ignore: [
          { type: "file", value: "BUILD-REPORT.json" },
          { type: "file", value: "README.md" },
        ],
      },
    },
    null,
    2,
  ),
);
await fs.mkdir(path.join(out, "audio"), { recursive: true });
function wav(notes) {
  const rate = 22050,
    len = Math.ceil(notes.reduce((n, p) => n + p[1], 0) * rate),
    buf = Buffer.alloc(44 + len * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + len * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24);
  buf.writeUInt32LE(rate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(len * 2, 40);
  let offset = 0;
  for (const [hz, duration] of notes) {
    const frames = Math.floor(duration * rate);
    for (let i = 0; i < frames; i++) {
      const u = i / frames,
        s =
          Math.sin((i / rate) * hz * Math.PI * 2) *
          Math.sin(Math.PI * Math.min(1, u * 8)) *
          Math.pow(1 - u, 2) *
          0.24;
      buf.writeInt16LE(Math.round(s * 32767), 44 + (offset + i) * 2);
    }
    offset += frames;
  }
  return buf;
}
for (const [name, notes] of Object.entries({
  tap: [[660, 0.09]],
  hit: [[180, 0.08]],
  reward: [
    [523, 0.09],
    [659, 0.09],
    [784, 0.15],
  ],
}))
  await fs.writeFile(path.join(out, "audio", name + ".wav"), wav(notes));
let total = 0,
  main = 0;
async function walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else {
      const size = (await fs.stat(p)).size;
      total += size;
      if (!p.startsWith(path.join(out, "packs") + path.sep)) main += size;
    }
  }
}
await walk(out);
if (main > 4 * 1024 ** 2 || total > 20 * 1024 ** 2)
  throw Error("包大小超过项目预算");
await fs.writeFile(
  path.join(out, "BUILD-REPORT.json"),
  JSON.stringify(
    {
      version: manifest.version,
      appid,
      mainBytes: main,
      totalBytes: total,
      packages,
      assets: audit,
    },
    null,
    2,
  ),
);
await fs.copyFile(
  path.join(root, "wechat/README.md"),
  path.join(out, "README.md"),
);
console.log(
  JSON.stringify(
    {
      out,
      appid,
      mainBytes: main,
      totalBytes: total,
      packages: packages.length,
    },
    null,
    2,
  ),
);
