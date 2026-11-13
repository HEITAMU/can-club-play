import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { harness, manifest, build, runtime } from "./harness.mjs";
import * as G from "../../core.mjs";
const developed = () => ({
  ...G.initialState(),
  onboarded: true,
  highest: 60,
  runCleared: 60,
  stage: 61,
  gold: 999999,
  party: ["orange", "ink", "milk", "mint", "bolt"],
});
test("native boot, input, all tabs and all profiles render without DOM", async () => {
  const h = await harness();
  assert.equal(h.app.modal.type, "intro");
  h.tap("begin");
  assert.equal(h.app.running, true);
  h.tap("can");
  assert.ok(h.app.battle.canCd > 0);
  for (let i = 0; i < 30; i++) h.tick(0.1);
  assert.ok(h.app.battle.time > 0);
  for (const tab of ["cats", "relics", "map", "battle"]) h.tap("tab-" + tab);
  h.app.change("cats");
  for (const c of G.CATS) {
    h.app.selected = c.id;
    h.app.render();
  }
  assert.ok(h.app.buttons.length);
});
test("ten-level cost is atomic and capped, single upgrade stays available", async () => {
  const state = developed(),
    h = await harness({ state }),
    a = h.app;
  a.change("cats");
  const quote = G.upgradeQuote(1);
  const before = a.state.gold;
  h.tap("train-orange");
  assert.equal(a.state.levels.orange, 11);
  assert.equal(a.state.gold, before - quote.cost);
  a.state.gold = 1;
  a.train("orange");
  assert.equal(a.state.levels.orange, 11);
  a.state.gold = 999999;
  a.state.levels.orange = 97;
  a.train("orange");
  assert.equal(a.state.levels.orange, 100);
});
test("touch drag swaps occupied slots; bench replacement inherits training", async () => {
  const state = developed();
  state.levels.orange = 40;
  const h = await harness({ state }),
    a = h.app;
  a.change("cats");
  a.mode = "formation";
  a.render();
  const by = (id) => a.buttons.find((b) => b.id === id),
    from = by("slot-0"),
    to = by("slot-1");
  h.touch("TouchStart", from.x + 40, from.y + 30);
  h.touch("TouchMove", to.x + 40, to.y + 30);
  h.touch("TouchEnd", to.x + 40, to.y + 30);
  assert.deepEqual(a.state.party.slice(0, 2), ["ink", "orange"]);
  a.equip("star", 1);
  assert.equal(a.state.party[1], "star");
  assert.equal(a.state.levels.star, 40);
  assert.equal(a.state.levels.orange, 1);
});
test("dead rear allies remain in their original slots and render incapacity", async () => {
  const h = await harness({ state: developed() }),
    a = h.app;
  a.battle.heroes[3].hp = 0;
  a.render();
  const before = { ...a.centers.p3 };
  a.battle.heroes[2].hp = 0;
  a.render();
  assert.deepEqual(a.centers.p3, before);
  assert.ok(a.art.sprites.has("battle-p3"));
});
test("background saves immediately, cancels input, resumes without combat catchup", async () => {
  const h = await harness({ state: developed() }),
    a = h.app;
  a.running = true;
  h.tick(0.1);
  const time = a.battle.time;
  h.touch("TouchStart", 50, 50);
  h.callbacks.Hide();
  assert.equal(a.pointer, null);
  assert.ok(h.storage.get("can-club-wechat-v1"));
  h.callbacks.Show();
  assert.equal(a.battle.time, time);
  assert.equal(h.raf.size, 1);
  h.stop();
});
test("valid backup survives corrupt primary; primary write failures are reported", async () => {
  const state = developed(),
    storage = new Map(),
    api = {
      getStorageSync: (k) => storage.get(k),
      setStorageSync: (k, v) => storage.set(k, v),
    };
  assert.equal(runtime.writeSave(api, state), true);
  state.gold = 100;
  runtime.writeSave(api, state);
  storage.set("can-club-wechat-v1", "corrupt");
  const result = runtime.readSave(api);
  assert.equal(result.recovered, true);
  assert.equal(result.state.gold, 999999);
  assert.equal(
    runtime.writeSave(
      {
        ...api,
        setStorageSync: () => {
          throw Error("full");
        },
      },
      state,
    ),
    false,
  );
});
test("manual imported web save validates checksum and requires confirmation", async () => {
  const h = await harness(),
    state = developed();
  h.modals.push(
    { confirm: true, content: G.encodeSave(state) },
    { confirm: true },
  );
  await h.app.importSave();
  assert.equal(h.app.state.highest, 60);
  assert.equal(h.app.state.party.length, 5);
  const old = h.app.state;
  h.modals.push({ confirm: true, content: "broken" });
  await h.app.importSave();
  assert.equal(h.app.state, old);
});
test("load failure exposes retry and does not initialize a partial game", async () => {
  const h = await harness({ failedPack: true });
  assert.equal(h.app, null);
  await h.retry();
  assert.ok(h.app);
  h.stop();
});
test("pending loot after reload is playable after choice; all modals render at small height", async () => {
  const state = developed();
  state.stage = 6;
  state.runCleared = 5;
  state.pending = { stage: 5, options: ["claw", "coat", "bell"] };
  const h = await harness({ state, width: 320, height: 568 }),
    a = h.app;
  h.tap("loot-claw");
  a.pause();
  h.tick(0.1);
  assert.ok(a.battle && a.battle.time > 0);
  for (const type of [
    "settings",
    "quests",
    "help",
    "chapter",
    "inherit",
    "recruit",
    "victory",
  ]) {
    a.modal = { type, index: 0, id: "ink" };
    a.render();
  }
});
test("build is a native game bound to requested AppID and stays within budgets", async () => {
  const config = JSON.parse(
      await fs.readFile(path.join(build, "project.config.json")),
    ),
    report = JSON.parse(
      await fs.readFile(path.join(build, "BUILD-REPORT.json")),
    );
  assert.equal(config.appid, "wx43da24c6ac1e5a12");
  assert.equal(config.compileType, "game");
  assert.ok(report.mainBytes < 4 * 1024 ** 2);
  assert.ok(report.totalBytes < 20 * 1024 ** 2);
  assert.ok(manifest.packages.length > 0);
  assert.equal(manifest.packages.length, report.packages.length);
  assert.deepEqual(manifest.packages.map(p => p.name), report.packages.map(p => p.name));
  for (const p of report.packages) assert.ok(p.bytes < 4 * 1024 ** 2);
  for (const p of Object.values(manifest.assets))
    await fs.access(path.join(build, p));
});
