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
  roster:{...G.initialState().roster,owned:G.CATS.map(c=>c.id)},
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
test("legacy pending loot is cleared on reload; all modals render at small height", async () => {
  const state = developed();
  state.stage = 6;
  state.runCleared = 5;
  state.pending = { stage: 5, options: ["claw", "coat", "bell"] };
  const h = await harness({ state, width: 320, height: 568 }),
    a = h.app;
  assert.equal(a.state.pending,null);
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
test('commission journal opens, daily claim works and weekly retry keeps its mode',async()=>{
 const h=await harness({state:developed()}),a=h.app;a.change('map');a.mapPlace='arena';h.tap('open-journal');assert.equal(a.mapPlace,'journal');a.state.campaign.progress.patrol=5;a.render();const gold=a.state.gold;h.tap('daily-patrol');assert.ok(a.state.gold>gold);assert.equal(a.buttons.some(b=>b.id==='daily-patrol'),false);
 a.mapPlace='arena';a.scroll=0;a.start(true,{weeklyTier:2});assert.equal(a.battle.weekly.tier,2);a.battle.result='lose';a.pause();assert.equal(a.battle.weekly.tier,2);assert.equal(a.state.arenaCleared,0);
});

test('backpack lists only unequipped items; companion orbit supports equip, lock and slot filters',async()=>{
 const h=await harness({state:developed()}),a=h.app;a.change('relics');a.render();assert.equal(a.buttons.filter(b=>b.id.startsWith('gear-slot-')).length,0);assert.equal(a.buttons.filter(b=>b.id.startsWith('bag-filter-slot-')).length,6);
 h.tap('bag-tab-materials');assert.equal(a.bagTab,'materials');h.tap('bag-tab-equipment');h.tap('bag-filter-slot-coat');assert.equal(a.bagSlot,'coat');
 a.change('cats');h.tap('equipment');assert.equal(a.mode,'equipment');assert.equal(a.buttons.filter(b=>b.id.startsWith('gear-slot-')).length,5);
 h.tap('gear-detail-claw');const id=a.bagDetail;assert.ok(id);tapScrolled(h,'gear-equip');assert.equal(a.state.inventory.equipped.orange.claw,undefined);assert.equal(a.bagDetail,null);
 a.bagSlot='claw';a.render();tapScrolled(h,'gear-equip-now-'+id);assert.equal(a.state.inventory.equipped.orange.claw,id);assert.equal(a.bagRows().some(e=>e.id===id),false);
 a.scroll=0;h.tap('gear-detail-claw');tapScrolled(h,'gear-lock');assert.equal(a.state.inventory.items.find(e=>e.id===id).locked,true);assert.equal(a.buttons.some(b=>b.id==='gear-dismantle'),false);h.stop();
});

function tapScrolled(h,id){const a=h.app;a.render();for(let y=0;y<=a.scrollMax+180;y+=180){a.scroll=Math.min(y,a.scrollMax);a.render();if(a.buttons.some(b=>b.id===id)){h.tap(id);return;}}throw Error('No reachable enabled button: '+id);}
test('native companion contracts, star growth and breakthroughs save exact costs',async()=>{
 const state=G.initialState();state.onboarded=true;state.highest=600;state.runCleared=3;state.stage=4;state.roster.shards.milk=20;state.roster.shards.orange=20;state.growth={notes:2000,seals:30};state.badges=100;state.levels.orange=40;
 const h=await harness({state}),a=h.app;a.openStreet('recruit','milk');tapScrolled(h,'street-recruit');assert.ok(a.state.roster.owned.includes('milk'));assert.equal(a.state.roster.shards.milk,0);assert.equal(a.state.party.at(-1),'milk');
 a.change('cats');a.selected='orange';tapScrolled(h,'ascend-orange');assert.equal(a.state.roster.stars.orange,1);assert.equal(a.state.roster.shards.orange,0);assert.equal(a.state.growth.notes,1970);
 tapScrolled(h,'breakthrough-orange');assert.equal(a.state.breakthroughs.orange,1);assert.equal(a.state.badges,92);assert.equal(a.state.growth.notes,1920);
 const restored=G.decodeSave(h.storage.get('can-club-wechat-v1'));assert.deepEqual(restored.roster,a.state.roster);assert.deepEqual(restored.growth,a.state.growth);h.stop();
});
test('native material replay preserves selected job and main campaign progress',async()=>{
 const state=developed();for(const id of state.party)state.levels[id]=40;
 const h=await harness({state}),a=h.app,before=[a.state.stage,a.state.highest];a.openStreet('materials','escort');tapScrolled(h,'street-fight');
 for(let i=0;i<400&&!a.battle.result;i++){a.update(.25);if(a.battle.canCd===0)a.can();}
 assert.equal(a.battle.result,'win');assert.equal(a.state.activities.cleared.escort,1);const badges=a.state.badges;
 a.pause();assert.equal(a.battle.activity.kind,'escort');assert.equal(a.battle.activity.tier,1);
 for(let i=0;i<400&&!a.battle.result;i++){a.update(.25);if(a.battle.canCd===0)a.can();}
 assert.equal(a.battle.result,'win');assert.equal(a.state.badges-badges,2);assert.deepEqual([a.state.stage,a.state.highest],before);a.update(1.5);assert.equal(a.tab,'map');assert.equal(a.mapPlace,'street');assert.deepEqual(a.streetView,{group:'materials',id:'escort',tier:1});a.render();h.stop();
});

test('contract auto-return cannot override a user navigation or rematch',async()=>{
 const h=await harness({state:developed()}),a=h.app;a.activityReturn.finish({kind:'escort',tier:2},a.time);a.change('cats');a.update(2);assert.equal(a.tab,'cats');
 a.change('battle');a.activityReturn.finish({kind:'escort',tier:2},a.time);a.start(true);a.update(2);assert.equal(a.tab,'battle');assert.equal(a.battle.mode,'patrol');h.stop();
});
