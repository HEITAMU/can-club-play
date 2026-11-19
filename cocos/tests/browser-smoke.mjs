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
    ...(process.env.CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.CHROMIUM_EXECUTABLE_PATH } : {}),
  });
  for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 740 }]) {
    const label = `${viewport.width}x${viewport.height}`;
    const result = { viewport, status: 'running', checks: [], captures: [], errors: [], fixture: 'Fresh account initially; test-only unlocked stage 3, Lv.80 starter team and resources for equipment flow' };
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
    page.on('pageerror', error => result.errors.push(`pageerror: ${error.message}`));
    page.on('console', message => {
      if (message.type() === 'error' && !/\/favicon\.ico(?:\?|$)/.test(message.location().url || '')) result.errors.push(`console: ${message.text()}`);
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
        const app = globalThis.__CAN_CLUB_APP__;
        if (!app) return false;
        const actual = { ...app.inspect(), mode: app.session.mode, report: !!app.session.report, guideActive: !!app.session.guideActive };
        return Object.entries(expected).every(([key, value]) => actual[key] === value);
      }, expected);
      await frames();
    };
    const ready = async () => {
      await page.waitForFunction(() => globalThis.__CAN_CLUB_APP__?.inspect && globalThis.__CAN_CLUB_ENGINE__?.director);
      await page.evaluate(async () => { await globalThis.__CAN_CLUB_APP__.ready; });
      await waitState({ loading: false });
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
    const click = async name => {
      await page.waitForFunction(() => globalThis.__CAN_CLUB_APP__?.inspect().loading === false);
      await page.waitForFunction(name => globalThis.__CAN_CLUB_APP__?.inspect().nodeNames.includes(name), name);
      if (name === 'guide-continue') await page.waitForFunction(() => {
        const app = globalThis.__CAN_CLUB_APP__;
        return app.session.time - (app.guideTouchAt ?? -Infinity) >= 0.25;
      });
      await page.evaluate(name => {
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
      const buttons = await page.evaluate(() => globalThis.__CAN_CLUB_APP__.inspect().buttons);
      assert.ok(Array.isArray(buttons), 'inspect().buttons must expose native CSS screen rectangles');
      const button = [...buttons].reverse().find(button => button.name === name);
      assert.ok(button, `${label}: missing native button ${name}`);
      assert.notEqual(button.interactable, false, `${label}: disabled native button ${name}`);
      const x = button.x + button.width / 2, y = button.y + button.height / 2;
      assert.ok(button.width > 0 && button.height > 0 && x > 0 && x < viewport.width && y > 0 && y < viewport.height, `${label}: button ${name} is outside the viewport: ${JSON.stringify(button)}`);
      await page.touchscreen.tap(x, y);
      await frames();
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
      await click('street-fight'); await waitState({ tab: 'battle', guideStep: 9 });
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
