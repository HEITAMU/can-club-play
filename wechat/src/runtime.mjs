import { NativeGame } from "./game.mjs";
import {
  initialState,
  normalizeState,
  encodeSave,
  decodeSave,
  accrueIdle,
} from "../../core.mjs";
const KEY = "can-club-wechat-v1",
  BACKUP = KEY + "-backup";
export function readSave(api, now = Date.now()) {
  for (const key of [KEY, BACKUP]) {
    try {
      const raw = api.getStorageSync(key);
      if (raw)
        return { state: decodeSave(raw, now), recovered: key === BACKUP };
    } catch {}
  }
  return { state: initialState(now), recovered: false };
}
export function writeSave(api, state) {
  const encoded = encodeSave(state);
  try {
    const previous = api.getStorageSync(KEY);
    if (previous) {
      try {
        decodeSave(previous);
        api.setStorageSync(BACKUP, previous);
      } catch {}
    }
    api.setStorageSync(KEY, encoded);
    return true;
  } catch {
    return false;
  }
}
export async function boot(api, manifest, options = {}) {
  const canvas = api.createCanvas(),
    ctx = canvas.getContext("2d");
  let app = null,
    hidden = false,
    last = 0,
    frame = null,
    failed = false,
    loading = false,
    touchId = null,
    savedAt = 0,
    idleAt = 0;
  const info = () =>
    api.getWindowInfo ? api.getWindowInfo() : api.getSystemInfoSync();
  let screen = info();
  const raf =
    options.requestAnimationFrame ||
    globalThis.requestAnimationFrame?.bind(globalThis) ||
    canvas.requestAnimationFrame?.bind(canvas) ||
    ((f) => setTimeout(() => f(Date.now()), 16));
  const caf =
    options.cancelAnimationFrame ||
    globalThis.cancelAnimationFrame?.bind(globalThis) ||
    canvas.cancelAnimationFrame?.bind(canvas) ||
    clearTimeout;
  const showToast = (message) =>
    api.showToast?.({ title: message, icon: "none", duration: 2200 });
  const modal = (title, content, extra = {}) =>
    new Promise((resolve) =>
      api.showModal({
        title,
        content,
        ...extra,
        success: resolve,
        fail: () => resolve({ confirm: false }),
      }),
    );
  const audio = {};
  function sound(name) {
    if (!app?.state.sound || !api.createInnerAudioContext) return;
    if (name === "hit" && Date.now() - (sound.lastHit || 0) < 130) return;
    if (name === "hit") sound.lastHit = Date.now();
    try {
      const a = audio[name] || (audio[name] = api.createInnerAudioContext());
      if (!a.src) a.src = "audio/" + name + ".wav";
      a.volume = name === "hit" ? 0.16 : 0.28;
      a.seek?.(0);
      a.play();
    } catch {}
  }
  const env = {
    width: screen.windowWidth,
    height: screen.windowHeight,
    pixelRatio: screen.pixelRatio || 1,
    safeTop: Math.max(screen.safeArea?.top || 0, screen.statusBarHeight || 0),
    safeBottom: Math.max(
      0,
      screen.windowHeight - (screen.safeArea?.bottom || screen.windowHeight),
    ),
    createCanvas: () => api.createCanvas(),
    sound,
    save: (state) => {
      if (!writeSave(api, state)) showToast("存档写入失败，请在设置中复制备份");
    },
    copy: (value) =>
      api.setClipboardData({
        data: value,
        success: () => showToast("存档已复制"),
        fail: () => showToast("未能复制存档"),
      }),
    input: async (title, placeholder) => {
      const r = await modal(title, "", {
        editable: true,
        placeholderText: placeholder,
        confirmText: "导入",
      });
      return r.confirm ? r.content || "" : "";
    },
    confirm: async (title, content) => !!(await modal(title, content)).confirm,
    share: () =>
      api.shareAppMessage?.({
        title: "罐头远征队 · 带上猫猫，一起巡逻",
        query: "from=friend",
      }),
  };
  function loadingView(message, progress = 0) {
    const d = Math.min(2, env.pixelRatio);
    canvas.width = Math.round(screen.windowWidth * d);
    canvas.height = Math.round(screen.windowHeight * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.fillStyle = "#294a54";
    ctx.fillRect(0, 0, screen.windowWidth, screen.windowHeight);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 26px sans-serif";
    ctx.fillStyle = "#f5e7c7";
    ctx.fillText(
      "罐头远征队",
      screen.windowWidth / 2,
      screen.windowHeight * 0.42,
    );
    ctx.font = "13px sans-serif";
    ctx.fillText(message, screen.windowWidth / 2, screen.windowHeight * 0.49);
    ctx.fillStyle = "#607971";
    ctx.fillRect(
      screen.windowWidth * 0.15,
      screen.windowHeight * 0.54,
      screen.windowWidth * 0.7,
      5,
    );
    ctx.fillStyle = "#e0b574";
    ctx.fillRect(
      screen.windowWidth * 0.15,
      screen.windowHeight * 0.54,
      screen.windowWidth * 0.7 * progress,
      5,
    );
  }
  function schedule() {
    if (!hidden && frame === null) frame = raf(loop);
  }
  function loop(now) {
    frame = null;
    if (hidden || !app) return;
    const dt = last ? Math.min(0.1, Math.max(0, (now - last) / 1000)) : 0;
    last = now;
    app.update(dt);
    idleAt += dt;
    savedAt += dt;
    if (idleAt >= 1) {
      accrueIdle(app.state);
      idleAt = 0;
    }
    if (savedAt >= 10) {
      app.save();
      savedAt = 0;
    }
    app.render();
    schedule();
  }
  const touch = (list) =>
    Array.from(list || []).find(
      (t) => touchId === null || t.identifier === touchId,
    );
  api.onTouchStart((e) => {
    if (failed) {
      initialize().catch(() => {});
      return;
    }
    if (!app || hidden || touchId !== null) return;
    const t = touch(e.touches);
    if (t) {
      touchId = t.identifier ?? 0;
      app.down(t.clientX, t.clientY);
    }
  });
  api.onTouchMove((e) => {
    const t = touch(e.touches);
    if (t && app && !hidden) app.move(t.clientX, t.clientY);
  });
  api.onTouchEnd((e) => {
    const t = touch(e.changedTouches);
    if (!t) return;
    app?.up(t.clientX, t.clientY);
    touchId = null;
  });
  api.onTouchCancel(() => {
    touchId = null;
    app?.cancel();
  });
  api.onHide(() => {
    hidden = true;
    last = 0;
    touchId = null;
    app?.cancel();
    if (frame !== null) {
      caf(frame);
      frame = null;
    }
    if (app) {
      accrueIdle(app.state);
      app.save();
    }
    for (const a of Object.values(audio)) a.stop();
  });
  api.onShow(() => {
    hidden = false;
    last = 0;
    if (app) {
      accrueIdle(app.state);
      app.save();
      schedule();
    }
  });
  api.onWindowResize?.(() => {
    screen = info();
    Object.assign(env, {
      width: screen.windowWidth,
      height: screen.windowHeight,
      safeTop: Math.max(screen.safeArea?.top || 0, screen.statusBarHeight || 0),
      safeBottom: Math.max(
        0,
        screen.windowHeight - (screen.safeArea?.bottom || screen.windowHeight),
      ),
    });
    if (app) app.resize(env.width, env.height);
  });
  api.showShareMenu?.({ menus: ["shareAppMessage"] });
  api.onShareAppMessage?.(() => ({ title: "罐头远征队 · 带上猫猫，一起巡逻" }));
  async function initialize() {
    if (loading) return;
    loading = true;
    failed = false;
    try {
      let done = 0;
      loadingView("猫猫正在收拾行李…");
      for (const pack of manifest.packages) {
        await new Promise((resolve, reject) => {
          const task = api.loadSubpackage({
            name: pack.name,
            success: resolve,
            fail: reject,
          });
          task?.onProgressUpdate?.((r) =>
            loadingView(
              "载入美术 " +
                Math.round(
                  ((done + r.progress / 100) / manifest.packages.length) * 100,
                ) +
                "%",
              ((done + r.progress / 100) / manifest.packages.length) * 0.8,
            ),
          );
        });
        done++;
        loadingView(
          "载入美术 " +
            Math.round((done / manifest.packages.length) * 100) +
            "%",
          (done / manifest.packages.length) * 0.8,
        );
      }
      const images = {};
      let loaded = 0;
      await Promise.all(
        Object.entries(manifest.assets).map(
          ([key, path]) =>
            new Promise((resolve, reject) => {
              const image = api.createImage();
              image.onload = () => {
                images[key] = image;
                loaded++;
                loadingView(
                  "准备出发…",
                  0.8 + (loaded / Object.keys(manifest.assets).length) * 0.2,
                );
                resolve();
              };
              image.onerror = () => reject(Error("图片加载失败：" + path));
              image.src = path;
            }),
        ),
      );
      const saved = readSave(api);
      accrueIdle(saved.state);
      app = new NativeGame(canvas, normalizeState(saved.state), env, images);
      if (saved.recovered) app.toast("已从备份恢复存档");
      app.render();
      if (options.autoStart !== false) schedule();
      return app;
    } catch (error) {
      failed = true;
      loadingView("加载未完成，点屏幕重试");
      api.getLogManager?.().warn("can-club load failed", String(error));
      if (options.throwOnError) throw error;
      return null;
    } finally {
      loading = false;
    }
  }
  const game = await initialize();
  return {
    get app() {
      return app;
    },
    canvas,
    env,
    game,
    stop() {
      hidden = true;
      if (frame !== null) caf(frame);
      frame = null;
    },
    retry: initialize,
  };
}
