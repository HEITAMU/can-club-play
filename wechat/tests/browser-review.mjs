import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url),
  { chromium } = require("playwright"),
  root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."),
  out = path.join(root, "qa/wechat-browser");
await fs.mkdir(out, { recursive: true });
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      ),
      file = path.resolve(root, "." + pathname);
    if (!file.startsWith(root + path.sep)) throw Error("path");
    const data = await fs.readFile(file);
    res.setHeader(
      "Content-Type",
      {
        ".mjs": "text/javascript",
        ".js": "text/javascript",
        ".json": "application/json",
        ".html": "text/html",
        ".png": "image/png",
        ".jpg": "image/jpeg",
      }[path.extname(file)] || "application/octet-stream",
    );
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
let browser;
const report = [];
try {
  browser = await chromium.launch({ headless: true });
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [430, 932],
  ]) {
    const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
      }),
      page = await context.newPage(),
      errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(
      "http://127.0.0.1:" +
        server.address().port +
        "/wechat/tests/browser.html",
    );
    await page.waitForFunction(() => window.ready);
    const point = async (id) =>
      page.evaluate((id) => {
        fixture.app.render();
        const a = fixture.app,
          b = a.buttons.find((b) => b.id === id);
        if (!b) throw Error("Missing " + id);
        return { x: (b.x + b.w / 2) * a.scale, y: (b.y + b.h / 2) * a.scale };
      }, id);
    const tap = async (id) => {
      const p = await point(id);
      await page.touchscreen.tap(p.x, p.y);
    };
    await page.screenshot({ path: path.join(out, `battle-${width}.png`) });
    await tap("pause");
    await tap("can");
    await page.evaluate(() => {
      for (let i = 0; i < 10; i++) {
        fixture.app.update(0.1);
        fixture.app.render();
      }
    });
    assert.ok(await page.evaluate(() => fixture.app.battle.canCd > 0));
    await page.screenshot({ path: path.join(out, `can-${width}.png`) });
    await tap("tab-cats");
    await page.screenshot({ path: path.join(out, `crew-${width}.png`) });
    await tap("train-orange");
    assert.equal(
      await page.evaluate(() => fixture.app.state.levels.orange),
      38,
    );
    await tap("formation");
    const from = await point("slot-0"),
      to = await point("slot-1"),
      cdp = await context.newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [from],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [to],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    assert.deepEqual(
      await page.evaluate(() => fixture.app.state.party.slice(0, 2)),
      ["ink", "orange"],
    );
    await page.screenshot({ path: path.join(out, `formation-${width}.png`) });
    const bench = await point("bench-spark");
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [bench],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [to],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    assert.equal(
      await page.evaluate(() => fixture.app.state.party[1]),
      "spark",
    );
    assert.equal(await page.evaluate(() => fixture.app.state.levels.spark), 38);
    await tap("tab-map");
    await page.screenshot({ path: path.join(out, `map-${width}.png`) });
    await tap("tab-relics");
    await page.screenshot({ path: path.join(out, `relics-${width}.png`) });
    await tap("settings");
    await tap("export");
    assert.ok(await page.evaluate(() => window.copied.includes("CAN-CLUB-1")));
    assert.deepEqual(errors, []);
    report.push({
      width,
      height,
      checks: [
        "boot",
        "battle",
        "rescue-animation",
        "upgrade10",
        "touch-swap",
        "bench-inheritance",
        "map",
        "relics",
        "export",
      ],
      errors,
    });
    await context.close();
  }
  await fs.writeFile(
    path.join(out, "report.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report));
} finally {
  await browser?.close();
  server.close();
}
