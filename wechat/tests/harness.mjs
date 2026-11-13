import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let canvas;
try {
  canvas = require("@napi-rs/canvas");
} catch {
  canvas = createRequire(new URL("../package.json", import.meta.url))(
    "@napi-rs/canvas",
  );
}
export const { createCanvas, loadImage, GlobalFonts } = canvas;
export const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
  ),
  build = path.join(root, "dist/wechat");
export const runtime = require(path.join(build, "runtime.js")),
  manifest = JSON.parse(
    await fs.readFile(path.join(build, "asset-manifest.json"), "utf8"),
  );
let cache;
export async function images() {
  if (!cache)
    cache = Object.fromEntries(
      await Promise.all(
        Object.entries(manifest.assets).map(async ([k, p]) => [
          k,
          await loadImage(path.join(build, p)),
        ]),
      ),
    );
  return cache;
}
export async function harness({
  width = 390,
  height = 844,
  state = null,
  storage = new Map(),
  failedPack = false,
} = {}) {
  const all = await images(),
    callbacks = {},
    calls = [],
    modals = [],
    raf = new Map();
  let n = 0,
    fail = failedPack;
  if (state)
    storage.set(
      "can-club-wechat-v1",
      JSON.stringify({
        format: "CAN-CLUB-1",
        checksum: checksum(JSON.stringify(state)),
        payload: JSON.stringify(state),
      }),
    );
  const api = {
    createCanvas: () => createCanvas(1, 1),
    getWindowInfo: () => ({
      windowWidth: width,
      windowHeight: height,
      pixelRatio: 1,
      safeArea: { top: 28, bottom: height - 20 },
      statusBarHeight: 28,
    }),
    getStorageSync: (k) => storage.get(k) || "",
    setStorageSync: (k, v) => storage.set(k, v),
    showModal: (opts) => {
      calls.push(["modal", opts.title]);
      opts.success(modals.shift() || { confirm: true });
    },
    setClipboardData: (opts) => {
      calls.push(["copy", opts.data]);
      opts.success();
    },
    showToast: (opts) => calls.push(["toast", opts.title]),
    showShareMenu: () => {},
    onShareAppMessage: (fn) => (callbacks.share = fn),
    shareAppMessage: (opts) => calls.push(["share", opts]),
    loadSubpackage: (opts) => {
      calls.push(["pack", opts.name]);
      queueMicrotask(() => {
        if (fail) {
          fail = false;
          opts.fail({ errMsg: "offline" });
        } else opts.success();
      });
      return { onProgressUpdate: () => {} };
    },
    getLogManager: () => ({ warn: () => {} }),
  };
  for (const event of [
    "TouchStart",
    "TouchMove",
    "TouchEnd",
    "TouchCancel",
    "Hide",
    "Show",
    "WindowResize",
  ])
    api["on" + event] = (fn) => (callbacks[event] = fn);
  // Boot uses API-created image values; @napi requires the actual native Image instance.
  let imageIndex = 0;
  api.createImage = () => {
    const key = Object.keys(manifest.assets)[
        imageIndex++ % Object.keys(manifest.assets).length
      ],
      original = all[key];
    Object.defineProperty(original, "src", {
      configurable: true,
      set(value) {
        if (value !== manifest.assets[key])
          throw Error("Unexpected asset path: " + value);
        queueMicrotask(() => original.onload?.());
      },
    });
    return original;
  };
  const result = await runtime.boot(api, manifest, {
    autoStart: false,
    requestAnimationFrame: (fn) => {
      const id = ++n;
      raf.set(id, fn);
      return id;
    },
    cancelAnimationFrame: (id) => raf.delete(id),
  });
  return {
    ...result,
    get app() {
      return result.app;
    },
    callbacks,
    calls,
    modals,
    storage,
    api,
    raf,
    resize(w, h) {
      width = w;
      height = h;
      callbacks.WindowResize();
    },
    tick(dt) {
      result.app.update(dt);
      result.app.render();
    },
    tap(id) {
      result.app.render();
      const b = result.app.buttons.find((b) => b.id === id);
      if (!b) throw Error("Missing button " + id);
      result.app.down(
        (b.x + b.w / 2) * result.app.scale,
        (b.y + b.h / 2) * result.app.scale,
      );
      result.app.up(
        (b.x + b.w / 2) * result.app.scale,
        (b.y + b.h / 2) * result.app.scale,
      );
      result.app.render();
    },
    touch(event, x, y, id = 1) {
      callbacks[event]({
        touches: [{ clientX: x, clientY: y, identifier: id }],
        changedTouches: [{ clientX: x, clientY: y, identifier: id }],
      });
    },
  };
}
function checksum(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
