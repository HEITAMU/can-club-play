/**
 * Native Cocos 3.8.8 browser smoke test.
 *
 * Run against an already built and served development bundle:
 *   CAN_CLUB_URL=http://127.0.0.1:8765/cocos/build/web-mobile/ \
 *     node cocos/tests/browser-smoke.mjs
 *
 * This script launches its own disposable browser contexts. It never connects to
 * a person's browser/profile or imports a player's save. Resource/progression
 * fixtures below exist only in those temporary test contexts and are labelled
 * as development data in the report. It does not validate WeChat devices.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { chromium } = require(process.env.CAN_CLUB_PLAYWRIGHT || 'playwright');
const sharp = require('sharp');
const target = new URL(process.env.CAN_CLUB_URL || 'http://127.0.0.1:8765/cocos/build/web-mobile/');
target.searchParams.set('smoke', '1');
const output = path.resolve(process.env.CAN_CLUB_SMOKE_OUT || path.join(root, 'cocos/qa/browser-smoke'));
const timeout = Math.max(10000, Number(process.env.CAN_CLUB_SMOKE_TIMEOUT || 60000));
const touchCancelDiagnostic = 'Ignored attempt to cancel a touchcancel event with cancelable=false, for example because scrolling is in progress and cannot be interrupted.';
await fs.mkdir(output, { recursive: true });

const report = {
  startedAt: new Date().toISOString(),
  url: target.href,
  status: 'running',
  scope: 'Real Cocos 3.8.8 engine, native scene nodes, browser touch, asset loading and application flow',
  isolation: 'New nonpersistent browser context per viewport; development fixtures only; no player profile, cookies or save imported',
  limitations: ['Not a Creator editor import/build test', 'Not WeChat DevTools or phone-device validation', 'Screenshots require visual review'],
  viewports: [],
};

let browser;
try {
  browser = await chromium.launch({
    headless: process.env.CAN_CLUB_HEADED !== '1',
    ...(process.env.CAN_CLUB_BROWSER_CHANNEL ? { channel: process.env.CAN_CLUB_BROWSER_CHANNEL } : {}),
    ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
  });
  report.browser = {version: browser.version(), channel: process.env.CAN_CLUB_BROWSER_CHANNEL || 'playwright-chromium'};
  for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 740 }]) {
    const label = `${viewport.width}x${viewport.height}`;
    const result = { viewport, status: 'running', checks: [], captures: [], errors: [], expectedEngineDiagnostics: [], fixture: 'Fresh account initially; isolated unlocked stage 3, rank-5 Lv.80 starters and resources for equipment/recruitment; temporary stage 101 with one original network response delayed to verify navigation, then prior encounter restored; isolated Lv.1 injured team and full milk energy for healing render capture; isolated rank-2 Lv.30 orange for native ascension, training and automatic skill unlock at Lv.40/80/120' };
    report.viewports.push(result);
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
    const initialStorage = await context.storageState();
    assert.equal(initialStorage.cookies.length, 0, 'test context must start without user cookies');
    assert.equal(initialStorage.origins.length, 0, 'test context must start without user storage');
    const page = await context.newPage();
    page.setDefaultTimeout(timeout);
    page.setDefaultNavigationTimeout(timeout);
    const requests = new Set();
    let intentionalReload = false;
    let expectingTouchCancelDiagnostic = false;
    let resolveBootFailure;
    // Resolve with an Error (rather than reject before ready installs a handler)
    // so an exception during the earliest script evaluation cannot be lost.
    const bootFailure = new Promise(resolve => { resolveBootFailure = resolve; });
    page.on('request', request => requests.add(request));
    page.on('requestfinished', request => requests.delete(request));
    page.on('requestfailed', request => {
      requests.delete(request);
      const error = request.failure()?.errorText || 'request failed';
      if (intentionalReload && error === 'net::ERR_ABORTED') return;
      if (!/\/favicon\.ico(?:\?|$)/.test(request.url())) result.errors.push(`${error}: ${request.url()}`);
    });
    page.on('response', response => {
      if (response.status() >= 400 && !/\/favicon\.ico(?:\?|$)/.test(response.url())) result.errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
    page.on('pageerror', error => {
      result.errors.push(`pageerror: ${error.message}`);
      resolveBootFailure(new Error(`Browser startup exception: ${error.stack || error.message}`));
    });
    page.on('console', message => {
      if (message.type() === 'error' && !/\/favicon\.ico(?:\?|$)/.test(message.location().url || '')) {
        const text = message.text();
        // Cocos 3.8.8 calls preventDefault on canvas touchcancel without testing
        // cancelable. Classify at most one exact diagnostic only during our
        // explicit native cancellation below; all other errors still fail.
        if (expectingTouchCancelDiagnostic && text === touchCancelDiagnostic && result.expectedEngineDiagnostics.length === 0) {
          result.expectedEngineDiagnostics.push({ message: text, location: message.location(), trigger: 'Explicit native touchCancel; Cocos 3.8.8 preventDefault on a noncancelable event' });
          return;
        }
        result.errors.push(`console: ${text}`);
        // Cocos catches some boot exceptions and reports their error objects to
        // the console. Warnings and ordinary log messages are not boot failures.
        if (/\b(?:TypeError|ReferenceError|SyntaxError|RangeError|EvalError|URIError|Error):\s/.test(text))
          resolveBootFailure(new Error(`Browser startup exception: ${text}`));
      }
    });
    await page.addInitScript(() => { globalThis.__CAN_CLUB_BROWSER_SMOKE__ = { isolated: true, developmentFixtures: true }; });

    const frames = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const drawFrames = () => page.evaluate(async () => {
      const cc = globalThis.__CAN_CLUB_ENGINE__;
      for (let i = 0; i < 2; i++) await new Promise(resolve => cc.director.once(cc.Director.EVENT_AFTER_DRAW, resolve));
    });
    const state = () => page.evaluate(() => {
      const app = globalThis.__CAN_CLUB_APP__, s = app.session, cc = globalThis.__CAN_CLUB_ENGINE__;
      const canvas = document.querySelector('#GameCanvas');
      return {
        ...app.inspect(),
        engineVersion: cc?.VERSION,
        realScene: !!cc?.director?.getScene() && cc.director.getScene() instanceof cc.Scene,
        stage: s.state.stage, highest: s.state.highest, levels: { ...s.state.levels },
        roster: { owned: [...s.state.roster.owned], shards: { ...s.state.roster.shards } },
        party: [...s.state.party], heroIds: s.battle?.heroes.map(h => h.catId), heroLevels: s.battle?.heroes.map(h => h.level),
        battleTime: s.battle?.time || 0, battleRevision: s.battleRevision,
        mode: s.mode, paused: s.paused, guideActive: s.guideActive, gearGuide: s.state.gearGuide,
        activeTouches: [...(app.activeTouches || [])], loadingVisible: app.loadingRoot?.activeInHierarchy,
        report: s.report ? JSON.parse(JSON.stringify(s.report)) : null,
        inventory: JSON.parse(JSON.stringify(s.state.inventory)),
        canvasSize: canvas ? { width: canvas.width, height: canvas.height } : null,
        pageFitsViewport: document.documentElement.scrollWidth <= innerWidth + 1 && document.documentElement.scrollHeight <= innerHeight + 1,
        legacySave: localStorage.getItem('can-club-save-v1'),
      };
    });
    const waitState = async expected => {
      await page.waitForFunction(expected => {
        const failure = globalThis.__CAN_CLUB_BOOT_ERROR__;
        if (failure) throw new Error(`Cocos boot failed: ${failure.stack || failure.message}`);
        const app = globalThis.__CAN_CLUB_APP__;
        if (!app) return false;
        const actual = { ...app.inspect(), mode: app.session.mode, report: !!app.session.report, guideActive: !!app.session.guideActive };
        return Object.entries(expected).every(([key, value]) => actual[key] === value);
      }, expected);
      await frames();
    };
    const ready = async () => {
      await Promise.race([
        (async () => {
          await page.waitForFunction(() => {
            const failure = globalThis.__CAN_CLUB_BOOT_ERROR__;
            if (failure) throw new Error(`Cocos boot failed: ${failure.stack || failure.message}`);
            return globalThis.__CAN_CLUB_APP__?.inspect && globalThis.__CAN_CLUB_ENGINE__?.director;
          });
          // The app exposes a boolean, not a startup Promise. Readiness includes
          // its asset preload and two completed Cocos draw frames.
          await waitState({ ready: true, loading: false });
        })(),
        bootFailure.then(error => { throw error; }),
      ]);
    };
    const healthy = async () => {
      const current = await state();
      assert.deepEqual(current.errors || [], [], `${label}: native UI resource errors`);
      assert.deepEqual(result.errors, [], `${label}: browser/network errors`);
      assert.equal(current.pageFitsViewport, true, `${label}: document escaped viewport`);
      assert.equal(current.legacySave, null, `${label}: stable-version save key must remain untouched`);
      return current;
    };
    const assetsReady = async () => {
      await frames();
      await page.waitForFunction(() => {
        const cc = globalThis.__CAN_CLUB_ENGINE__, scene = cc?.director?.getScene();
        if (!scene) return false;
        let missing = 0, rendered = 0;
        const walk = node => {
          if (!node.activeInHierarchy) return;
          const sprite = node.getComponent(cc.Sprite);
          if (sprite?.enabledInHierarchy) { rendered++; if (!sprite.spriteFrame?.texture) missing++; }
          for (const child of node.children) walk(child);
        };
        walk(scene);
        return rendered > 0 && missing === 0;
      });
      await frames();
      await healthy();
    };
    const capture = async name => {
      await assetsReady();
      const filename = `${label}-${name}.png`;
      const png = await page.screenshot({ path: path.join(output, filename), fullPage: false });
      const metadata = await sharp(png).metadata(), statistics = await sharp(png).stats();
      assert.equal(metadata.width, viewport.width);
      assert.equal(metadata.height, viewport.height);
      assert.ok(statistics.channels.slice(0, 3).some(channel => channel.stdev > 3), `${label}: screenshot is effectively blank`);
      result.captures.push(filename);
    };

    // Scroll the real Cocos ScrollView if necessary, then dispatch browser touch
    // at the native button's reported CSS screen rectangle. No DOM button proxy.
    const nativePoint = async (name, { reveal = true, allowNonButton = false, allowDisabled = false } = {}) => {
      await page.waitForFunction(() => globalThis.__CAN_CLUB_APP__?.inspect().loading === false);
      await page.waitForFunction(name => globalThis.__CAN_CLUB_APP__?.inspect().nodeNames.includes(name), name);
      if (name === 'guide-continue') await page.waitForFunction(() => {
        const app = globalThis.__CAN_CLUB_APP__;
        return app.session.time - (app.guideTouchAt ?? -Infinity) >= 0.25;
      });
      if (reveal) await page.evaluate(name => {
        const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__;
        let target;
        const walk = node => {
          if (!node.activeInHierarchy) return;
          if (node.name === name) target = node;
          for (const child of node.children) walk(child);
        };
        walk(cc.director.getScene());
        if (!target) throw new Error('Missing native node: ' + name);
        // The app's helper measures the UITransform's own four corners. Cocos's
        // getBoundingBoxToWorld() includes children and can mistake an entire
        // scroll-content height for its clipped viewport.
        app.revealTarget(target);
      }, name);
      await frames();
      const hit = await page.evaluate(({ name, allowNonButton, allowDisabled }) => {
        const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__;
        const inspected = app.inspect();
        if (!Array.isArray(inspected.buttons)) throw new Error('inspect().buttons must expose native CSS screen rectangles');
        let button = [...inspected.buttons].reverse().find(button => button.name === name);
        let target;
        const walk = node => {
          if (!node.activeInHierarchy) return;
          if (node.name === name) target = node;
          for (const child of node.children) walk(child);
        };
        walk(cc.director.getScene());
        const component = target?.getComponent(cc.Button);
        if (!target || (!button && !(allowNonButton && !component) && !(allowDisabled && component && !component.interactable))) return { button: null, clips: [] };
        const frame = cc.view.getFrameSize(), size = inspected.size;
        const scale = Math.min(frame.width / size.width, frame.height / size.height);
        const dx = (frame.width - size.width * scale) / 2, dy = (frame.height - size.height * scale) / 2;
        const rootTransform = app.root.getComponent(cc.UITransform);
        // A button can lie inside the browser viewport but outside a Cocos mask.
        // Measure each mask's own four corners, excluding its content children.
        const ownRect = node => {
          const t = node.getComponent(cc.UITransform), a = t.anchorPoint, w = t.width, h = t.height;
          const points = [[-a.x * w, -a.y * h], [(1 - a.x) * w, -a.y * h], [-a.x * w, (1 - a.y) * h], [(1 - a.x) * w, (1 - a.y) * h]]
            .map(([x, y]) => rootTransform.convertToNodeSpaceAR(t.convertToWorldSpaceAR(new cc.Vec3(x, y, 0))));
          const left = Math.min(...points.map(p => p.x)), right = Math.max(...points.map(p => p.x));
          const top = Math.min(...points.map(p => -p.y)), bottom = Math.max(...points.map(p => -p.y));
          return { name: node.name, x: dx + left * scale, y: dy + top * scale, width: (right - left) * scale, height: (bottom - top) * scale };
        };
        const clips = [];
        if (!button) button = { ...ownRect(target), interactable: component?.interactable };
        for (let p = target.parent; p; p = p.parent) if (p.getComponent(cc.Mask)?.enabledInHierarchy) clips.push(ownRect(p));
        return { button, clips };
      }, { name, allowNonButton, allowDisabled });
      const { button, clips } = hit;
      assert.ok(button, `${label}: missing native button ${name}`);
      if (!allowDisabled) assert.notEqual(button.interactable, false, `${label}: disabled native button ${name}`);
      const visible = { left: Math.max(0, button.x), top: Math.max(0, button.y), right: Math.min(viewport.width, button.x + button.width), bottom: Math.min(viewport.height, button.y + button.height) };
      for (const clip of clips) {
        visible.left = Math.max(visible.left, clip.x); visible.top = Math.max(visible.top, clip.y);
        visible.right = Math.min(visible.right, clip.x + clip.width); visible.bottom = Math.min(visible.bottom, clip.y + clip.height);
      }
      assert.ok(button.width > 0 && button.height > 0 && visible.right - visible.left > 1 && visible.bottom - visible.top > 1, `${label}: button ${name} is clipped outside its visible viewport: ${JSON.stringify(hit)}`);
      const x = (visible.left + visible.right) / 2, y = (visible.top + visible.bottom) / 2;
      return { x, y, button, clips, visible };
    };
    const click = async (name, options) => {
      const point = await nativePoint(name, options);
      result.lastAction = { kind: 'tap', name, ...point };
      const { x, y } = point;
      await page.touchscreen.tap(x, y);
      await frames();
    };
    const drag = async (from, to) => {
      // Bring both pieces into the real ScrollView, then remeasure without
      // scrolling between touch-down and release.
      await nativePoint(from); await nativePoint(to);
      const start = await nativePoint(from, { reveal: false }), end = await nativePoint(to, { reveal: false });
      const b = start.button;
      assert.ok(end.x < b.x || end.x > b.x + b.width || end.y < b.y || end.y > b.y + b.height, 'formation drop must release outside the source node');
      result.lastAction = { kind: 'drag', from, to, start, end };
      const cdp = await context.newCDPSession(page);
      let pressed = false;
      try {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: start.x, y: start.y, id: 1 }] });
        pressed = true;
        await frames();
        for (let step = 1; step <= 12; step++) {
          const t = step / 12;
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t, id: 1 }] });
          await frames();
        }
        assert.equal(await page.evaluate(() => globalThis.__CAN_CLUB_APP__.inspect().nodeNames.includes('formation-drag-ghost')), true, 'native touch move must create the formation drag visual');
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        pressed = false;
        await frames();
      } finally {
        if (pressed) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }).catch(() => {});
        await cdp.detach();
      }
    };
    const advance = async ticks => {
      await page.evaluate(async ticks => {
        const app = globalThis.__CAN_CLUB_APP__;
        for (let i = 0; i < ticks; i++) {
          app.advance(0.1);
          if (i % 12 === 0) await new Promise(resolve => requestAnimationFrame(resolve));
        }
      }, ticks);
      await frames();
    };
    // Passed directly to page.evaluate. Inspect the live native renderer, not
    // just the effect sampler or a fabricated node.
    const healingState = ({ tick = 0, freeze = false } = {}) => {
      const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__, s = app.session;
      if (tick) app.advance(tick);
      const ribbons = [];
      const walk = node => {
        if (!node.activeInHierarchy) return;
        const ribbon = node.getComponent('HealingRibbon');
        if (ribbon?.enabledInHierarchy) {
          const geometry = ribbon.geometry, count = geometry?.vertexCount || 0, data = ribbon.renderData, vb = data?.chunk?.vb;
          let expectedOpacity = 1;
          const opacityChain = [], ancestorRenderers = [], ancestorSprites = [];
          for (let p = node; p; p = p.parent) {
            const opacity = p.getComponent(cc.UIOpacity), renderer = p._uiProps?.uiComp, sprite = p.getComponent(cc.Sprite);
            if (opacity) {
              opacityChain.push({ name: p.name, opacity: opacity.opacity, enabled: opacity.enabledInHierarchy });
              if (opacity.enabledInHierarchy) expectedOpacity *= opacity.opacity / 255;
            }
            if (renderer) ancestorRenderers.push({ name: p.name, renderer: renderer.constructor.name, enabled: renderer.enabledInHierarchy, alpha: renderer.color?.a });
            if (p !== node && sprite) ancestorSprites.push({ name: p.name, enabled: sprite.enabledInHierarchy, alpha: sprite.color.a });
          }
          // Only explicit UIOpacity is allowed to attenuate this effect. Its
          // particle alpha already lives in geometry; a disabled pooled parent
          // Sprite must not multiply stale color alpha into the submitted mesh.
          let geometryAlpha = 0, bufferAlpha = 0, maxAlphaError = 0, alphaMismatchCount = 0;
          const alphaMismatchSamples = [];
          for (let i = 0; i < count; i++) {
            const source = geometry.vertices[i * 6 + 5], expected = source * expectedOpacity;
            const actual = vb?.[i * data.floatStride + 8], finite = Number.isFinite(actual), error = finite ? Math.abs(actual - expected) : 1;
            geometryAlpha = Math.max(geometryAlpha, source);
            if (finite) bufferAlpha = Math.max(bufferAlpha, actual);
            maxAlphaError = Math.max(maxAlphaError, error);
            if (!finite || error > 2e-5) {
              alphaMismatchCount++;
              if (alphaMismatchSamples.length < 3) alphaMismatchSamples.push({ vertex: i, source, expected, actual: finite ? actual : String(actual), error });
            }
          }
          const b = app.bounds(node), size = app.inspect().size;
          ribbons.push({ name: node.name, vertexCount: count, geometryAlpha, bufferAlpha, bufferLength: vb?.length || 0,
            expectedOpacity, appliedOpacity: node._uiProps?.opacity, selfColorAlpha: ribbon.color.a,
            parentSpriteAlpha: node.parent?.getComponent(cc.Sprite)?.color.a,
            parentSpriteEnabled: node.parent?.getComponent(cc.Sprite)?.enabledInHierarchy,
            maxAlphaError, alphaMismatchCount, alphaMismatchSamples, opacityChain, ancestorRenderers, ancestorSprites,
            texture: !!ribbon.spriteFrame?.texture, material: !!ribbon.getRenderMaterial(0), bounds: b,
            onScreen: b.width > 0 && b.height > 0 && b.x < size.width && b.y < size.height && b.x + b.width > 0 && b.y + b.height > 0 });
        }
        for (const child of node.children) walk(child);
      };
      walk(cc.director.getScene());
      const healEvents = globalThis.__CAN_CLUB_BROWSER_SMOKE__.healEvents || [];
      // Capture the original ribbon after its entry fade becomes legible; do
      // not freeze at the first almost-transparent mesh or alter effect alpha.
      if (freeze && healEvents.length && ribbons.some(r => r.vertexCount > 0 && r.geometryAlpha > .3 && r.onScreen)) {
        s.pause(); app.refresh();
      }
      return { paused: s.paused, battleTime: s.battle.time, ribbons, healEvents: [...healEvents] };
    };

    try {
      await page.goto(target.href, { waitUntil: 'domcontentloaded' });
      await ready();
      const initial = await healthy();
      assert.equal(initial.engineVersion, '3.8.8');
      assert.equal(initial.realScene, true);
      assert.ok(initial.canvasSize.width > 0 && initial.canvasSize.height > 0);
      assert.deepEqual(initial.party, ['orange', 'ink']);
      assert.deepEqual(initial.heroIds, ['orange', 'ink']);
      assert.deepEqual(initial.heroLevels, [1, 1]);
      assert.equal(initial.stage, 1);
      assert.equal(initial.highest, 0);
      assert.ok(Object.values(initial.levels).every(level => level === 1));
      result.checks.push('Cocos 3.8.8 real scene/canvas; fresh first battle has two Lv.1 starters');
      await capture('01-fresh-intro');

      await click('intro-start'); await waitState({ guideStep: 1 });
      await click('guide-continue'); await waitState({ guideStep: 2 });
      await click('tab-cats'); await waitState({ tab: 'cats', guideStep: 3 });
      await click('upgrade-orange'); await waitState({ guideStep: 4 });
      assert.equal((await state()).levels.orange, 2);
      await click('crew-mode-equipment'); await waitState({ mode: 'equipment', guideStep: 5 });
      await click('equipped-claw'); await waitState({ modal: 'equipment', guideStep: 6 });
      await capture('02-equipment-tutorial');
      await click('guide-continue'); await waitState({ guideStep: 7 });
      await click('tab-battle'); await waitState({ tab: 'battle', guideStep: 8 });
      await click('guide-continue'); await waitState({ guideStep: 11 });
      await click('guide-continue'); await waitState({ guideStep: 12 });
      await click('open-can'); await waitState({ guideStep: 13 });
      await click('guide-continue'); await waitState({ guideStep: 9, modal: 'quests' });
      await capture('growth-notebook');
      await click('modal-close');
      await waitState({ running: true, guideActive: false });
      result.checks.push('Entire initial tutorial through real native buttons; training, equipment inspection, can practice and growth-goals modal');

      await click('tab-bag'); await waitState({ tab: 'bag' });
      const before = await state();
      await advance(24);
      const after = await state();
      assert.ok(after.battleTime > before.battleTime || after.battleRevision > before.battleRevision || after.highest > before.highest, 'patrol must continue while bag is displayed');
      assert.equal(after.tab, 'bag');
      result.checks.push('Switching to bag keeps the same logical patrol moving');

      // Isolated development fixture: unlock the first salvage flow and make its
      // victory quick. This is not claimed as a normal player's earned progress.
      await page.evaluate(() => {
        const app = globalThis.__CAN_CLUB_APP__, s = app.session;
        app.close();
        Object.assign(s.state, { highest: 3, runCleared: 3, stage: 4, gold: 100000, supplies: 100, badges: 100, gearGuide: 0, gearGuideItem: '', guideStep: 9, battleReport: null });
        s.state.levels.orange = s.state.levels.ink = 80;
        s.state.roster.stars.orange = s.state.roster.stars.ink = 5;
        s.state.inventory.materials.scrap = 500;
        s.state.inventory.materials.essence = 20;
        s.state.growth.notes = 100;
        s.state.roster.shards.milk = 20;
        s.state.guidance.equipmentWorn = false;
        s.battle.syncStats(s.state);
        s.maybeGearGuide();
        s.save();
        app.refresh();
      });
      await waitState({ guideStep: 14 });
      await click('guide-continue'); await waitState({ guideStep: 15 });
      await click('tab-map'); await waitState({ tab: 'map', guideStep: 16 });
      await capture('03-street');
      await click('district-board'); await waitState({ modal: 'arena', guideStep: 17 });
      await click('street-group-equipment'); await waitState({ modal: 'street', guideStep: 18 });
      await click('street-choice-salvage'); await waitState({ guideStep: 19 });
      await capture('04-salvage');
      await click('street-fight'); await waitState({ tab: 'battle', guideStep: 9, loading: false });
      await page.evaluate(async () => {
        const app = globalThis.__CAN_CLUB_APP__;
        for (let i = 0; i < 3000 && !app.session.report; i++) {
          app.advance(0.1);
          if (i % 12 === 0) await new Promise(resolve => requestAnimationFrame(resolve));
        }
        if (!app.session.report) throw new Error('First salvage did not produce a battle report');
      });
      await waitState({ report: true, guideActive: false });
      const settled = await healthy();
      assert.equal(settled.report.win, true);
      assert.ok(settled.report.gearUid);
      assert.ok(settled.inventory.items.some(item => item.id === settled.report.gearUid));
      await capture('05-settlement');
      const settledReport = settled.report;
      await advance(30);
      assert.deepEqual((await state()).report, settledReport, 'report must survive time and wait for explicit dismissal');
      await page.evaluate(() => globalThis.__CAN_CLUB_APP__.session.save());
      await page.waitForLoadState('networkidle');
      intentionalReload = true;
      await page.reload({ waitUntil: 'domcontentloaded' });
      await ready();
      intentionalReload = false;
      assert.deepEqual((await state()).report, settledReport, 'report must be restored from test-local storage');
      assert.equal((await state()).guideActive, false, 'tutorial must not intercept the restored report');
      result.checks.push('Native street/salvage flow; real combat reward; settlement persists, survives reload and blocks tutorial interception');

      await click('result-gear'); await waitState({ report: true, modal: 'equipment', guideActive: false });
      assert.deepEqual((await state()).report, settledReport, 'opening reward details must preserve the settlement');
      await click('modal-close'); await waitState({ report: true, modal: 'report', guideActive: false });
      assert.deepEqual((await state()).report, settledReport, 'closing reward details must return to the same settlement');
      // A real gesture over decorative report content must not act as a tap.
      const crest = await nativePoint('result-crest', { allowNonButton: true });
      const reportPanel = await nativePoint('result-layer', { allowNonButton: true });
      const outside = { x: viewport.width / 2, y: Math.max(3, Math.min(20, reportPanel.visible.top / 2)) };
      assert.ok(outside.y < reportPanel.visible.top, 'background gesture must start outside the settlement panel');
      result.lastAction = { kind: 'report-swipe', name: 'result-crest', ...crest };
      const reportTouch = await context.newCDPSession(page);
      try {
        await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...outside, id: 1 }] });
        await frames();
        await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: outside.x + 45, y: outside.y, id: 1 }] });
        await frames();
        await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await frames();
        assert.deepEqual((await state()).report, settledReport, 'swiping the outside backdrop must not dismiss the report');
        await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...outside, id: 1 }] });
        await frames();
        await page.evaluate(() => {
          const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__;
          const receipt = globalThis.__CAN_CLUB_BROWSER_SMOKE__.cancelReceipt = { native: null, cocos: false };
          window.addEventListener('touchcancel', event => { receipt.native = { cancelable: event.cancelable, target: event.target?.id }; }, { once: true, capture: true, passive: true });
          app.find('modal-backdrop').once(cc.Node.EventType.TOUCH_CANCEL, () => { receipt.cocos = true; }, undefined, true);
        });
        expectingTouchCancelDiagnostic = true;
        try {
          await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
          await frames();
        } finally { expectingTouchCancelDiagnostic = false; }
        result.cancelReceipt = await page.evaluate(() => globalThis.__CAN_CLUB_BROWSER_SMOKE__.cancelReceipt);
        assert.deepEqual(result.cancelReceipt, { native: { cancelable: false, target: 'GameCanvas' }, cocos: true }, 'native cancellation must reach the canvas and Cocos backdrop');
        assert.deepEqual((await state()).report, settledReport, 'a cancelled backdrop touch must not dismiss the report');
        await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...outside, id: 1 }, { x: crest.x, y: crest.y, id: 2 }] });
        await frames();
        await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await frames();
        assert.deepEqual((await state()).report, settledReport, 'two fingers split across backdrop and panel must not dismiss the report');
        await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: crest.x, y: crest.y, id: 1 }] });
        await frames();
        await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: crest.x, y: Math.max(crest.visible.top + 4, crest.y - 40), id: 1 }] });
        await frames();
        await reportTouch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await frames();
      } finally { await reportTouch.detach(); }
      assert.deepEqual((await state()).report, settledReport, 'swiping decorative settlement content must not dismiss the report');
      await page.evaluate(() => {
        const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__;
        const content = app.find('result-content'), scroll = content?.parent?.getComponent(cc.ScrollView);
        if (!scroll) throw new Error('Missing native report ScrollView');
        scroll.stopAutoScroll(); scroll.scrollToTop(0);
      });
      await frames();
      await click('result-crest', { allowNonButton: true });
      await waitState({ report: false, tab: 'cats', mode: 'equipment', guideStep: 20 });
      result.checks.push('Settlement reward details preserve the report; inside/outside swipe, touch cancellation and cross-surface multitouch do not dismiss it; real crest tap closes it and resumes equipment teaching');
      await click('guide-continue'); await waitState({ guideStep: 21 });
      await click('gear-' + settledReport.gearUid); await waitState({ modal: 'equipment', guideStep: 22 });
      await click('gear-equip'); await waitState({ guideStep: 23 });
      const wearing = await state();
      assert.ok(Object.values(wearing.inventory.equipped.orange).includes(settledReport.gearUid));
      await click('guide-continue'); await waitState({ guideStep: 9, tab: 'battle', guideActive: false });
      result.checks.push('Closing the first salvage report resumes equipment teaching; item inspect/equip completes the original guide');

      await click('tab-cats'); await waitState({ tab: 'cats' });
      await click('crew-mode-equipment'); await waitState({ mode: 'equipment' });
      await click('equipped-claw'); await waitState({ modal: 'equipment' });
      const gearBefore = await state();
      const clawId = gearBefore.inventory.equipped.orange.claw;
      const oldLevel = gearBefore.inventory.items.find(item => item.id === clawId).enhance;
      if (!gearBefore.nodeNames.includes('gear-enhance')) await click('gear-more');
      await click('gear-enhance');
      const newLevel = (await state()).inventory.items.find(item => item.id === clawId).enhance;
      assert.equal(newLevel, oldLevel + 1);
      await capture('06-equipment-enhanced');
      await click('modal-close');
      // Hold real native controls across actual patrol settlement and the next
      // battle. No click retries: destroying/replacing a pressed Button loses END.
      const armPress = async (name, tag) => page.evaluate(({ name, tag }) => {
        const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__, probe = globalThis.__CAN_CLUB_BROWSER_SMOKE__;
        const node = app.find(name);
        if (!node) throw new Error('Missing press target ' + name);
        probe.pressTargets ||= {}; probe.presses ||= {};
        probe.pressTargets[tag] = node;
        const trace = probe.presses[tag] = { name, uuid: node.uuid, starts: 0, ends: 0, cancels: 0, clicks: 0 };
        node.on(cc.Node.EventType.TOUCH_START, () => trace.starts++, undefined, true);
        node.on(cc.Node.EventType.TOUCH_END, () => trace.ends++, undefined, true);
        node.on(cc.Node.EventType.TOUCH_CANCEL, () => trace.cancels++, undefined, true);
        node.on(cc.Button.EventType.CLICK, () => trace.clicks++);
      }, { name, tag });
      const readPress = tag => page.evaluate(tag => globalThis.__CAN_CLUB_BROWSER_SMOKE__.presses[tag], tag);
      const pressAcrossPatrol = async (name, tag) => {
        // Freeze only probe setup. Settlement may otherwise replace a page
        // button between binding the listener and the first physical START.
        // Resume real patrol while the finger is down; all continuity checks
        // below still span actual settlement and next-battle preparation.
        const wasPaused = await page.evaluate(() => {
          const s = globalThis.__CAN_CLUB_APP__.session, paused = s.paused;
          s.paused = true;
          return paused;
        });
        let cdp;
        let held = false;
        try {
          assert.equal(wasPaused, false, name + ': continuity fixture must begin with patrol running');
          await waitState({ loading: false });
          await frames();
          const point = await nativePoint(name);
          await armPress(name, tag);
          result.lastAction = { kind: 'hold-through-patrol', name, ...point };
          cdp = await context.newCDPSession(page);
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: point.x, y: point.y, id: 1 }] }); held = true;
          await frames();
          assert.equal((await readPress(tag)).starts, 1, name + ': native START must reach the target before advancing combat');
          const transition = await page.evaluate(async ({ name, tag, wasPaused }) => {
            const app = globalThis.__CAN_CLUB_APP__, s = app.session, probe = globalThis.__CAN_CLUB_BROWSER_SMOKE__;
            s.paused = wasPaused;
            const before = s.battleRevision;
            for (let i = 0; i < 600 && s.battleRevision === before; i++) {
              app.advance(.1);
              if (i % 8 === 0) await new Promise(resolve => requestAnimationFrame(resolve));
            }
            if (s.battleRevision <= before) throw new Error('Patrol did not naturally settle and start the next battle while pressed');
            return { before, after: s.battleRevision, sameTarget: probe.pressTargets[tag] === app.find(name) };
          }, { name, tag, wasPaused });
          await waitState({ loading: false });
          assert.equal(transition.sameTarget, true, name + ': background settlement must retain the pressed node');
          assert.equal(await page.evaluate(({ name, tag }) => {
            const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__, node = globalThis.__CAN_CLUB_BROWSER_SMOKE__.pressTargets[tag];
            return cc.isValid(node, true) && node === app.find(name) && node.getComponent(cc.Button)._pressed;
          }, { name, tag }), true, name + ': control must remain enabled and pressed after background loading');
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); held = false;
          await frames();
          const trace = await readPress(tag);
          assert.deepEqual([trace.starts, trace.ends, trace.cancels, trace.clicks], [1, 1, 0, 1], name + ': one real press must produce one click');
          assert.deepEqual((await state()).activeTouches, [], 'physical release must flush deferred UI work');
          return { ...trace, transition };
        } catch (error) {
          result.failedPress = await page.evaluate(({ name, tag }) => {
            const app = globalThis.__CAN_CLUB_APP__, probe = globalThis.__CAN_CLUB_BROWSER_SMOKE__;
            return { ...probe.presses?.[tag], currentUuid: app.find(name)?.uuid, sameTarget: probe.pressTargets?.[tag] === app.find(name) };
          }, { name, tag }).catch(() => ({ name, tag, unavailable: true }));
          throw error;
        } finally {
          try {
            if (held) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
          } finally {
            try {
              await page.evaluate(paused => { globalThis.__CAN_CLUB_APP__.session.paused = paused; }, wasPaused);
            } finally {
              if (cdp) await cdp.detach();
            }
          }
        }
      };
      result.inputContinuity = {};
      result.inputContinuity.navigation = await pressAcrossPatrol('tab-bag', 'navigation');
      await waitState({ tab: 'bag' });
      result.inputContinuity.pageButton = await pressAcrossPatrol('bag-tab-materials', 'page-button');
      await page.waitForFunction(() => globalThis.__CAN_CLUB_APP__.pages.bagTab === 'materials');
      result.checks.push('Native navigation and in-page controls stay pressed across real patrol settlement and next-battle preparation; each release delivers exactly one click');

      // Isolated resource-delay fixture: hold an actual, previously unrequested
      // stage-101 background request, then navigate while it is still loading.
      // The original response is released unchanged; no fake image or game state
      // handler replaces the production loader. Restore the fixture stage after.
      const coldPattern = '**/assets/mobile/street-5-v02684.webp*';
      let releaseCold;
      const coldGate = new Promise(resolve => { releaseCold = resolve; });
      const coldRoute = async route => { await coldGate; await route.continue(); };
      await page.route(coldPattern, coldRoute);
      const coldPoint = await nativePoint('tab-map');
      await armPress('tab-map', 'cold-load');
      const coldRequest = page.waitForRequest(request => request.url().includes('/assets/mobile/street-5-v02684.webp'));
      const restoreStage = await page.evaluate(() => {
        const s = globalThis.__CAN_CLUB_APP__.session, stage = s.state.stage;
        s.state.stage = 101;
        if (!s.startBattle({ seed: 8388 }) || s.battle.stage !== 101) throw new Error('Could not start isolated cold-resource encounter');
        return stage;
      });
      const coldTouch = await context.newCDPSession(page);
      let coldHeld = false;
      try {
        await coldRequest; await frames();
        const pending = await state();
        assert.equal(pending.loading, true, 'the real background request must still be pending');
        assert.equal(pending.loadingVisible, false, 'background loading must not obscure the active bag page');
        result.lastAction = { kind: 'tap-during-background-load', name: 'tab-map', ...coldPoint };
        await coldTouch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: coldPoint.x, y: coldPoint.y, id: 1 }] }); coldHeld = true;
        await frames();
        assert.equal((await readPress('cold-load')).starts, 1, 'loading must not intercept the real navigation START');
        await coldTouch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); coldHeld = false;
        await waitState({ tab: 'map', loading: true });
        const trace = await readPress('cold-load');
        assert.deepEqual([trace.starts, trace.ends, trace.cancels, trace.clicks], [1, 1, 0, 1]);
        result.inputContinuity.coldLoad = { ...trace, navigatedWhileLoading: true };
      } finally {
        releaseCold();
        if (coldHeld) await coldTouch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await coldTouch.detach();
        await page.unroute(coldPattern, coldRoute);
      }
      await waitState({ loading: false });
      await page.evaluate(stage => {
        const s = globalThis.__CAN_CLUB_APP__.session; s.state.stage = stage;
        if (!s.startBattle({ seed: 7388 })) throw new Error('Could not restore the original test encounter');
      }, restoreStage);
      await waitState({ loading: false });
      await click('tab-bag'); await waitState({ tab: 'bag' });
      await click('bag-tab-materials');
      result.checks.push('An actual delayed background resource request cannot intercept other-page navigation; original network response and encounter restored afterwards');
      await capture('07-materials');
      await click('bag-tab-keepsakes');
      await capture('08-keepsakes');
      await click('tab-map'); await waitState({ tab: 'map', guideActive: false });
      await click('district-board'); await waitState({ modal: 'arena', guideActive: false });
      await capture('commission-board');
      await click('street-group-equipment'); await waitState({ modal: 'street', guideActive: false });
      await capture('equipment-list');
      await click('street-choice-salvage');
      await click('street-fight'); await waitState({ tab: 'battle', loading: false });
      await page.evaluate(async () => {
        const app = globalThis.__CAN_CLUB_APP__;
        for (let i = 0; i < 3000 && !app.session.report; i++) {
          app.advance(.1); if (i % 12 === 0) await new Promise(resolve => requestAnimationFrame(resolve));
        }
        if (!app.session.report) throw new Error('Repeat salvage did not settle');
      });
      await waitState({ report: true });
      const repeated = (await state()).report;
      assert.equal(repeated.win, true);
      const repeatPanel = await nativePoint('result-layer', { allowNonButton: true });
      const backgroundY = Math.max(3, Math.min(20, repeatPanel.visible.top / 2));
      assert.ok(backgroundY < repeatPanel.visible.top);
      await page.touchscreen.tap(viewport.width / 2, backgroundY);
      await waitState({ report: false, tab: 'map', modal: 'street' });
      await click('modal-close'); await waitState({ modal: '' });
      result.checks.push('A second real salvage settles normally; a genuine outside tap closes its report and restores the original commission route');
      await click('tab-battle'); await waitState({ tab: 'battle' });
      await capture('09-battle');
      result.checks.push('Native equipment enhancement, material bag and companion-keepsake bag');

      // Spend only the 20 milk keepsakes granted by the isolated fixture above.
      await click('tab-bag'); await waitState({ tab: 'bag' });
      await click('bag-tab-keepsakes');
      const beforeRecruit = await state();
      assert.equal(beforeRecruit.roster.owned.includes('milk'), false);
      assert.equal(beforeRecruit.roster.shards.milk, 20);
      await click('keepsake-milk'); await waitState({ modal: 'keepsake' });
      await click('recruit-milk'); await waitState({ modal: 'recruit', loading: false });
      const recruited = await state();
      assert.equal(recruited.roster.owned.includes('milk'), true);
      assert.equal(recruited.roster.shards.milk, 0);
      assert.equal(recruited.party[2], 'milk', 'recruitment automatically fills the first empty party position');
      await click('recruit-ok'); await waitState({ modal: '' });
      await click('tab-cats'); await waitState({ tab: 'cats' });
      await click('crew-mode-formation'); await waitState({ mode: 'formation' });
      // First remove the automatic placement through native controls. Without
      // this, a broken drag could falsely pass the final party[2] assertion.
      await click('formation-bench-milk'); await click('formation-dismiss');
      await waitState({ loading: false });
      assert.equal((await state()).party.includes('milk'), false);
      await drag('formation-bench-milk', 'formation-slot-2');
      await page.waitForFunction(() => globalThis.__CAN_CLUB_APP__.session.state.party[2] === 'milk');
      await waitState({ loading: false });
      assert.deepEqual((await state()).party, ['orange', 'ink', 'milk']);
      assert.equal((await state()).nodeNames.includes('formation-drag-ghost'), false);
      await capture('10-formation-drag');
      result.checks.push('Native keepsake recruitment; remove auto-placement and drag milk outside the source node into the third formation position');

      await click('tab-battle'); await waitState({ tab: 'battle', loading: false });
      // Reset only this disposable test's combat setup. Injured Lv.1 actors and
      // full milk energy make the original skill emit real heal events before
      // the two starters can end the encounter; no effect is manually spawned.
      await page.evaluate(() => {
        const app = globalThis.__CAN_CLUB_APP__, s = app.session;
        Object.assign(s.state, { stage: 4, runCleared: 3, speed: 1 });
        for (const id of ['orange', 'ink', 'milk']) s.state.levels[id] = 1;
        if (!s.startBattle({ seed: 7388 })) throw new Error('Could not start isolated healing encounter');
        app.refresh();
      });
      await waitState({ tab: 'battle', loading: false, running: true });
      await page.evaluate(() => {
        const app = globalThis.__CAN_CLUB_APP__, s = app.session, probe = globalThis.__CAN_CLUB_BROWSER_SMOKE__;
        const milk = s.battle.heroes.find(h => h.catId === 'milk');
        if (!milk) throw new Error('Recruited milk is absent from the real battle');
        for (const h of s.battle.heroes) { h.hp = Math.floor(h.maxHp * .55); h.energy = h === milk ? 100 : 0; }
        probe.healEvents = [];
        probe.stopHealingCapture = s.subscribe(e => {
          if (e.type === 'combat') probe.healEvents.push(...e.events.filter(hit => hit.type === 'heal' && hit.from === milk.id && hit.value > 0));
        });
      });
      let healing;
      for (let i = 0; i < 240; i++) {
        healing = await page.evaluate(healingState, { tick: .1, freeze: true });
        result.lastHealingAudit = healing;
        if (healing.paused) break;
        await frames();
      }
      assert.equal(healing?.paused, true, 'real milk healing must create visible native HealingRibbon geometry');
      assert.ok(healing.healEvents.length > 0, 'actual game combat must emit milk healing events');
      // Freeze only simulation time so two real rendering frames can submit the
      // gradient before inspection and capture; do not open a pause overlay.
      await assetsReady();
      await drawFrames();
      healing = await page.evaluate(healingState);
      result.lastHealingAudit = healing;
      assert.ok(healing.ribbons.length > 0, 'native healing streams must remain visible while simulation is frozen');
      assert.ok(healing.ribbons.every(r => r.name === 'healing-stream' && r.vertexCount > 0 && r.texture && r.material));
      assert.ok(healing.ribbons.some(r => r.onScreen && r.bufferLength > 0 && r.bufferAlpha > .02), 'healing assembler must submit visible nontransparent vertex data');
      for (const ribbon of healing.ribbons.filter(r => r.onScreen && r.geometryAlpha > 0)) {
        const detail = JSON.stringify(ribbon);
        assert.equal(ribbon.selfColorAlpha, 255, `healing alpha belongs to vertex geometry: ${detail}`);
        assert.equal(ribbon.parentSpriteEnabled, false, `healing must disable the pooled standard sprite: ${detail}`);
        assert.equal(ribbon.parentSpriteAlpha, 255, `pooled parent sprite must reset its previous particle alpha: ${detail}`);
        assert.ok(ribbon.ancestorSprites.every(parent => parent.alpha === 255), `healing has an unintended ancestor sprite fade: ${detail}`);
        assert.ok(Math.abs(ribbon.appliedOpacity - ribbon.expectedOpacity) <= 2e-5, `healing inherited opacity must match explicit UIOpacity components: ${detail}`);
        assert.equal(ribbon.alphaMismatchCount, 0, `submitted healing alpha must equal each geometry alpha times explicit ancestor opacity: ${detail}`);
      }
      result.healing = healing;
      await capture('11-healing-ribbon');
      await page.evaluate(() => {
        globalThis.__CAN_CLUB_BROWSER_SMOKE__.stopHealingCapture?.();
        const app = globalThis.__CAN_CLUB_APP__; app.session.resume(); app.refresh();
      });
      result.checks.push('Actual milk skill emits healing; after two Cocos draw events each visible HealingRibbon submitted vertex alpha matches geometry times explicit ancestor opacity, with pooled parent sprite alpha reset');

      // Native workflow: stars raise the cap; level milestones now award
      // skill ranks automatically without consuming study resources.
      await page.evaluate(() => {
        const app = globalThis.__CAN_CLUB_APP__, s = app.session;
        s.paused = true; s.mode = 'profile'; s.selected = 'orange';
        s.state.levels.orange = 30; s.state.roster.stars.orange = 2;
        s.state.breakthroughs.orange = 0; s.state.legacyLevelCaps.orange = 0;
        s.state.roster.shards.orange = 1000; s.state.gold = 1e8;
        s.state.badges = 1000; s.state.growth.notes = 10000; s.state.growth.seals = 1000;
        s.battle.syncStats(s.state, { preserveHealthRatio: true }); app.refresh();
      });
      await click('tab-cats'); await waitState({ tab: 'cats', mode: 'profile' });
      const growthState = () => page.evaluate(() => {
        const app = globalThis.__CAN_CLUB_APP__, s = app.session.state;
        const hero = app.session.battle.heroes.find(h => h.catId === 'orange');
        return { level: s.levels.orange, rank: s.roster.stars.orange, skill: s.breakthroughs.orange, gold: s.gold, shards: s.roster.shards.orange, notes: s.growth.notes, badges: s.badges, seals: s.growth.seals, legacyCap: s.legacyLevelCaps.orange, hp: hero?.maxHp, atk: hero?.atk, heroSkill: hero?.skillRank, skillRule: s.skillUnlockRuleVersion };
      });
      const buttonState = name => page.evaluate(name => {
        const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__, node = app.find(name);
        if (!node) throw new Error('Missing growth control: ' + name);
        return { enabled: node.getComponent(cc.Button)?.interactable, text: node.getComponentsInChildren(cc.Label).map(l => l.string).join(' ') };
      }, name);
      const readDialog = () => page.evaluate(() => {
        const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__;
        const root = app.find('dialog-content');
        if (!root) throw new Error('Missing native skill dialog content');
        return root.getComponentsInChildren(cc.Label).map(l => l.string).join(' ');
      });
      const atCap = await growthState();
      assert.equal((await buttonState('upgrade-orange')).enabled, false);
      await click('upgrade-orange', { allowDisabled: true });
      assert.deepEqual(await growthState(), atCap, 'native tap at level cap must be inert');
      await click('cat-tag-orange'); await waitState({ modal: 'cat-tag' });
      const capLabels = await page.evaluate(() => {
        const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__;
        return ['ascension-current-cap', 'ascension-next-cap'].map(name => app.find(name).getComponent(cc.Label).string);
      });
      assert.deepEqual(capLabels, ['等级上限 Lv.30', '等级上限 Lv.40']);
      await capture('12-growth-ascension');
      await click('cat-tag-upgrade');
      const promoted = await growthState();
      assert.equal(promoted.rank, 3); assert.equal(promoted.level, 30); assert.equal(promoted.skill, 0);
      assert.equal(promoted.shards, atCap.shards - 20); assert.equal(promoted.hp, atCap.hp); assert.equal(promoted.atk, atCap.atk);
      await click('modal-close'); await waitState({ modal: '' });
      for (let i = 0; i < 9; i++) await click('upgrade-orange');
      const belowUnlock = await growthState();
      assert.equal(belowUnlock.level, 39); assert.equal(belowUnlock.skill, 0);
      assert.equal((await state()).nodeNames.includes('breakthrough-orange'), false, 'manual study button must not exist');
      await capture('13-growth-auto-locked');
      await click('skill-level-orange'); await waitState({ modal: 'skill' });
      assert.equal((await state()).nodeNames.includes('study-skill'), false, 'dialog must not contain manual study');
      assert.match(await readDialog(), /Lv\.40 自动解锁/, 'dialog tells the player when the next effect is automatic');
      await capture('14-growth-auto-details');
      await click('modal-close'); await waitState({ modal: '' });
      const resources = { badges: belowUnlock.badges, notes: belowUnlock.notes, seals: belowUnlock.seals };
      await click('upgrade-orange');
      const unlocked40 = await growthState();
      assert.equal(unlocked40.level, 40); assert.equal(unlocked40.skill, 1); assert.equal(unlocked40.heroSkill, 1);
      assert.equal(unlocked40.rank, 3);
      for (const [key, val] of Object.entries(resources)) assert.equal(unlocked40[key], val, key + ' unchanged by automatic unlock');
      await click('skill-level-orange'); await waitState({ modal: 'skill' });
      assert.match(await readDialog(), /Lv\.80 自动解锁/, 'next milestone must show Lv.80');
      assert.equal((await state()).nodeNames.includes('study-skill'), false);
      await capture('15-growth-auto-unlocked');
      const persistedGrowth = await page.evaluate(() => {
        const envelope = JSON.parse(localStorage.getItem('can-club-growth-preview-v1'));
        const s = JSON.parse(envelope.payload);
        return { level: s.levels.orange, rank: s.roster.stars.orange, skill: s.breakthroughs.orange, gold: s.gold, shards: s.roster.shards.orange, notes: s.growth.notes, badges: s.badges, seals: s.growth.seals, legacyCap: s.legacyLevelCaps.orange, skillRule: s.skillUnlockRuleVersion };
      });
      for (const [key,value] of Object.entries(persistedGrowth)) assert.equal(value, unlocked40[key], 'saved: ' + key);
      intentionalReload = true;
      try { await page.reload({ waitUntil: 'domcontentloaded' }); await ready(); }
      finally { intentionalReload = false; }
      const reloaded = await growthState();
      for (const key of ['level','rank','skill','legacyCap','skillRule']) assert.equal(reloaded[key], unlocked40[key], 'reload: ' + key);
      // Check the other two threshold crossings through real native training
      // controls. High-rank, below-threshold fixtures are confined to QA.
      await click('tab-cats'); await waitState({ tab: 'cats' });
      const furtherUnlocks = [];
      for (const [level,rank] of [[79,2],[119,3]]) {
        await page.evaluate(({level,rank}) => {
          const app = globalThis.__CAN_CLUB_APP__, s = app.session;
          s.paused = true; s.mode = 'profile';
          s.state.roster.stars.orange = 9; s.state.levels.orange = level;
          s.state.breakthroughs.orange = rank-1;
          s.battle.syncStats(s.state, { preserveHealthRatio: true }); app.refresh();
        }, {level,rank});
        await waitState({ mode:'profile', tab:'cats', loading:false });
        const before = await growthState();
        assert.equal(before.heroSkill, rank-1);
        await click('upgrade-orange');
        const after = await growthState();
        assert.ok(after.level >= level+1, 'native training must cross level threshold');
        assert.equal(after.skill, rank); assert.equal(after.heroSkill, rank);
        for(const key of ['badges','notes','seals']) assert.equal(after[key],before[key], 'automatic unlock does not spend '+key);
        furtherUnlocks.push({ before, after });
      }
      await capture('16-growth-auto-max');
      result.growthRules = { atCap, capLabels, promoted, belowUnlock, unlocked40, persistedGrowth, reloaded, furtherUnlocks };
      result.checks.push('Native level cap/ascension, no manual skill actions, Lv.40/80/120 auto-unlocks without spending notes/badges/seals, and save/reload consistency');
      await assetsReady();
      await page.waitForLoadState('networkidle');
      const final = await healthy();
      result.final = { engineVersion: final.engineVersion, tab: final.tab, running: final.running, guideStep: final.guideStep, nativeNodeCount: final.nodeNames.length, pendingRequests: requests.size };
      result.status = 'passed';
      console.log(`[browser-smoke] ${label}: passed ${result.checks.length} flow groups, ${result.captures.length} screenshots`);
    } catch (error) {
      result.status = 'failed';
      result.failure = error.stack || String(error);
      try { result.lastState = await state(); } catch { /* Startup can fail before the app hook exists. */ }
      try { await page.screenshot({ path: path.join(output, `${label}-FAILED.png`) }); } catch { /* Preserve the original failure. */ }
      throw error;
    } finally {
      await context.close();
    }
  }
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.failure = error.stack || String(error);
  process.exitCode = 1;
  console.error(error);
} finally {
  await browser?.close();
  report.finishedAt = new Date().toISOString();
  await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(`[browser-smoke] ${report.status}; report: ${path.join(output, 'report.json')}`);
}
