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
    const result = { viewport, status: 'running', checks: [], captures: [], errors: [], fixture: 'Fresh account initially; isolated unlocked stage 3, Lv.80 starters and resources for equipment/recruitment; isolated Lv.1 injured team and full milk energy for healing render capture' };
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
        result.errors.push(`console: ${text}`);
        // Cocos catches some boot exceptions and reports their error objects to
        // the console. Warnings and ordinary log messages are not boot failures.
        if (/\b(?:TypeError|ReferenceError|SyntaxError|RangeError|EvalError|URIError|Error):\s/.test(text))
          resolveBootFailure(new Error(`Browser startup exception: ${text}`));
      }
    });
    await page.addInitScript(() => { globalThis.__CAN_CLUB_BROWSER_SMOKE__ = { isolated: true, developmentFixtures: true }; });

    const frames = () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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
    const nativePoint = async (name, { reveal = true } = {}) => {
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
      const hit = await page.evaluate(name => {
        const app = globalThis.__CAN_CLUB_APP__, cc = globalThis.__CAN_CLUB_ENGINE__;
        const inspected = app.inspect();
        if (!Array.isArray(inspected.buttons)) throw new Error('inspect().buttons must expose native CSS screen rectangles');
        const button = [...inspected.buttons].reverse().find(button => button.name === name);
        let target;
        const walk = node => {
          if (!node.activeInHierarchy) return;
          if (node.name === name) target = node;
          for (const child of node.children) walk(child);
        };
        walk(cc.director.getScene());
        if (!target || !button) return { button: null, clips: [] };
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
        for (let p = target.parent; p; p = p.parent) if (p.getComponent(cc.Mask)?.enabledInHierarchy) clips.push(ownRect(p));
        return { button, clips };
      }, name);
      const { button, clips } = hit;
      assert.ok(button, `${label}: missing native button ${name}`);
      assert.notEqual(button.interactable, false, `${label}: disabled native button ${name}`);
      const visible = { left: Math.max(0, button.x), top: Math.max(0, button.y), right: Math.min(viewport.width, button.x + button.width), bottom: Math.min(viewport.height, button.y + button.height) };
      for (const clip of clips) {
        visible.left = Math.max(visible.left, clip.x); visible.top = Math.max(visible.top, clip.y);
        visible.right = Math.min(visible.right, clip.x + clip.width); visible.bottom = Math.min(visible.bottom, clip.y + clip.height);
      }
      assert.ok(button.width > 0 && button.height > 0 && visible.right - visible.left > 1 && visible.bottom - visible.top > 1, `${label}: button ${name} is clipped outside its visible viewport: ${JSON.stringify(hit)}`);
      const x = (visible.left + visible.right) / 2, y = (visible.top + visible.bottom) / 2;
      return { x, y, button, clips, visible };
    };
    const click = async name => {
      const point = await nativePoint(name);
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
          let geometryAlpha = 0, bufferAlpha = 0;
          for (let i = 0; i < count; i++) {
            geometryAlpha = Math.max(geometryAlpha, geometry.vertices[i * 6 + 5]);
            if (vb) bufferAlpha = Math.max(bufferAlpha, vb[i * data.floatStride + 8] || 0);
          }
          const b = app.bounds(node), size = app.inspect().size;
          ribbons.push({ name: node.name, vertexCount: count, geometryAlpha, bufferAlpha, bufferLength: vb?.length || 0,
            texture: !!ribbon.spriteFrame?.texture, material: !!ribbon.getRenderMaterial(0), bounds: b,
            onScreen: b.width > 0 && b.height > 0 && b.x < size.width && b.y < size.height && b.x + b.width > 0 && b.y + b.height > 0 });
        }
        for (const child of node.children) walk(child);
      };
      walk(cc.director.getScene());
      const healEvents = globalThis.__CAN_CLUB_BROWSER_SMOKE__.healEvents || [];
      if (freeze && healEvents.length && ribbons.some(r => r.vertexCount > 0 && r.geometryAlpha > .02 && r.onScreen)) {
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

      await click('result-close'); await waitState({ report: false, tab: 'cats', mode: 'equipment', guideStep: 20 });
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
      await click('tab-bag'); await waitState({ tab: 'bag' });
      await click('bag-tab-materials');
      await capture('07-materials');
      await click('bag-tab-keepsakes');
      await capture('08-keepsakes');
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
      await frames();
      await assetsReady();
      healing = await page.evaluate(healingState);
      assert.ok(healing.ribbons.length > 0, 'native healing streams must remain visible while simulation is frozen');
      assert.ok(healing.ribbons.every(r => r.name === 'healing-stream' && r.vertexCount > 0 && r.texture && r.material));
      assert.ok(healing.ribbons.some(r => r.onScreen && r.bufferLength > 0 && r.bufferAlpha > .02), 'healing assembler must submit visible nontransparent vertex data');
      result.healing = healing;
      await capture('11-healing-ribbon');
      await page.evaluate(() => {
        globalThis.__CAN_CLUB_BROWSER_SMOKE__.stopHealingCapture?.();
        const app = globalThis.__CAN_CLUB_APP__; app.session.resume(); app.refresh();
      });
      result.checks.push('Actual milk skill emits healing; native HealingRibbon has geometry, texture, material and nontransparent submitted vertices after two draw frames');
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
