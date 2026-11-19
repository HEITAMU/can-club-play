import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import crypto from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const domain = path.join(root, 'cocos/assets/scripts/domain');
const require = createRequire(import.meta.url);
const esbuild = process.env.CAN_CLUB_ESBUILD ? require(process.env.CAN_CLUB_ESBUILD) : require('esbuild');
const manifest = JSON.parse(await fs.readFile(path.join(domain, 'migration-manifest.json'), 'utf8'));
const ruleChanges = await Promise.all((manifest.ruleChanges || []).map(async change => ({ ...change, patch: JSON.parse(await fs.readFile(path.join(root, 'cocos', change.patch), 'utf8')) })));
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'can-club-parity-'));
const originalDir = path.join(temporary, 'original');
await fs.mkdir(originalDir);
const filenames = execFileSync('git', ['ls-tree', '--name-only', manifest.sourceCommit], { cwd: root, encoding: 'utf8' })
  .trim().split('\n').filter(name => name.endsWith('.mjs'));
for (const name of filenames)
  await fs.writeFile(path.join(originalDir, name), execFileSync('git', ['show', `${manifest.sourceCommit}:${name}`], { cwd: root }));

const bundles = ['core', 'activities', 'equipment', 'campaign', 'companions', 'ascension', 'growth-curve', 'equipment-routes', 'token-rewards', 'team-plans', 'battle-flow', 'battle-cues', 'onboarding', 'rig-motion', 'painted-transition', 'vfx-atlas', 'vfx-motion'];
const entries = folder => bundles.map(name => `export * as ${name.replaceAll('-', '_')} from ${JSON.stringify(path.join(folder, name + (folder === domain ? '.ts' : '.mjs')))};`).join('\n');
const plugin = { name: 'baseline-query-specifiers', setup(build) {
  build.onResolve({ filter: /\?v=/ }, args => ({ path: path.resolve(args.resolveDir, args.path.split('?')[0]) }));
} };
await esbuild.build({ stdin: { contents: entries(originalDir), resolveDir: originalDir }, outfile: path.join(temporary, 'original.mjs'), bundle: true, format: 'esm', platform: 'node', plugins: [plugin], tsconfigRaw: {} });
await esbuild.build({ stdin: { contents: entries(domain), resolveDir: domain }, outfile: path.join(temporary, 'migrated.mjs'), bundle: true, format: 'esm', platform: 'node', tsconfigRaw: {} });
await esbuild.build({ entryPoints: [path.join(root, 'cocos/assets/scripts/game/GameSession.ts')], outfile: path.join(temporary, 'session.mjs'), bundle: true, format: 'esm', platform: 'node', tsconfigRaw: {} });
await esbuild.build({ entryPoints: [path.join(root, 'cocos/assets/scripts/platform/Rewarded.ts')], outfile: path.join(temporary, 'rewarded.mjs'), bundle: true, format: 'esm', platform: 'node', tsconfigRaw: {} });
await esbuild.build({ entryPoints: [path.join(originalDir, 'painted-fx.mjs')], outfile: path.join(temporary, 'original-painter.mjs'), bundle: true, format: 'esm', platform: 'node', plugins: [plugin], tsconfigRaw: {} });
await esbuild.build({ entryPoints: [path.join(root, 'cocos/assets/scripts/render/NativeStripGeometry.ts')], outfile: path.join(temporary, 'strip-geometry.mjs'), bundle: true, format: 'esm', platform: 'node', tsconfigRaw: {} });
const original = await import(pathToFileURL(path.join(temporary, 'original.mjs')));
const migrated = await import(pathToFileURL(path.join(temporary, 'migrated.mjs')));
const { GameSession, SAVE_KEY } = await import(pathToFileURL(path.join(temporary, 'session.mjs')));
const { createRewardedService } = await import(pathToFileURL(path.join(temporary, 'rewarded.mjs')));
const { paintVFX } = await import(pathToFileURL(path.join(temporary, 'original-painter.mjs')));
const { stripGeometry } = await import(pathToFileURL(path.join(temporary, 'strip-geometry.mjs')));
const NOW = Date.UTC(2026, 10, 19, 8, 0, 0);
const originalNow = Date.now;
Date.now = () => NOW;
test.after(async () => { Date.now = originalNow; await fs.rm(temporary, { recursive: true, force: true }); });

function fixture(api, { stage = 1, level = 1, rank = 0, party = ['orange', 'ink'], rich = false } = {}) {
  const state = api.core.initialState(NOW);
  state.onboarded = true;
  state.guideStep = api.onboarding.GUIDE_DONE;
  state.gearGuide = 4;
  state.guidance.equipmentWorn = true;
  state.activities.cleared.salvage = 1;
  state.highest = Math.max(0, stage - 1);
  state.runCleared = state.highest;
  state.stage = stage;
  state.roster.owned = api.core.CATS.map(c => c.id);
  state.party = [...party];
  for (const c of api.core.CATS) { state.levels[c.id] = level; state.roster.stars[c.id] = rank; }
  if (rich) {
    state.gold = 1e12; state.growth.notes = 1e8; state.growth.seals = 1e8; state.badges = 1e8;
    state.inventory.materials.scrap = 1e8; state.inventory.materials.essence = 1e8;
    for (const id of state.roster.owned) state.roster.shards[id] = 10000;
  }
  return state;
}

function combatState(battle) {
  const fields = ['id', 'hp', 'maxHp', 'shield', 'energy', 'atk', 'armor', 'magicResist', 'stun', 'burn', 'burnTime', 'charge', 'shieldState', 'turns', 'normalRound', 'selfShieldRound'];
  const actors = [...battle.heroes, ...battle.enemies].map(a => Object.fromEntries(fields.map(k => [k, a[k]])));
  return { time: battle.time, result: battle.result, round: battle.round, turnActor: battle.turnActor, canCd: battle.canCd, kills: battle.kills, actors };
}

function baselineFields(state) {
  const { growthRuleVersion, legacyLevelCaps, ...rest } = state;
  return rest;
}

test('all full modules match the frozen source plus exact, separately authorized rule edits', async () => {
  for (const entry of manifest.modules) {
    const source = await fs.readFile(path.join(originalDir, entry.source), 'utf8');
    assert.equal(crypto.createHash('sha256').update(source).digest('hex'), entry.sourceSha256);
    let expected = source.replace(/(['"])(\.\/[^'"]+?)\.mjs(?:\?[^'"]*)?\1/g, '$1$2$1');
    for (const correction of manifest.displayCorrections || [])
      if (correction.target === entry.target) expected = expected.replaceAll(correction.find, correction.replace);
    for (const change of ruleChanges) {
      assert.equal(change.id, change.patch.id);
      assert.ok(change.authorization && change.tests.length);
      for (const file of change.patch.files.filter(file => file.target === entry.target)) for (const edit of file.edits) {
        assert.ok(edit.find.length > 0, `${change.id}: edits require an exact source context`);
        assert.equal(expected.split(edit.find).length - 1, 1, `${entry.target}: each authorized edit must match exactly once`);
        expected = expected.replace(edit.find, edit.replace);
      }
    }
    const actual = await fs.readFile(path.join(domain, entry.target), 'utf8');
    assert.equal(actual.split('\n').slice(2).join('\n'), expected, entry.target);
  }
});

test('Preview11 identities, 3500 stages, qualities, and save isolation are preserved', () => {
  assert.equal(migrated.core.MAX_STAGE, 3500);
  assert.equal(migrated.core.CATS.length, 8);
  assert.deepEqual(migrated.core.CATS, original.core.CATS);
  assert.deepEqual(migrated.ascension.ASCENSION_COSTS, original.ascension.ASCENSION_COSTS);
  assert.deepEqual(migrated.team_plans.TEAM_PLANS, original.team_plans.TEAM_PLANS);
  assert.equal(SAVE_KEY, 'can-club-growth-preview-v1');
  assert.equal(migrated.equipment.GEAR_MAX, 15);
});

test('support combat log describes the fixed forty-point heal without changing events', () => {
  const state = fixture(migrated);
  const battle = new migrated.core.Battle(state, { seed: 5, now: NOW });
  battle.openCan();
  const cues = new migrated.battle_cues.BattleCues();
  cues.consume(battle.events.splice(0), battle, migrated.battle_cues.formationPositions(battle));
  assert.match(cues.entries[0].effect, /回复40生命值/);
  assert.doesNotMatch(cues.entries[0].effect, /20%/);
});

test('native effect strip vertices and clipped UVs match the original Canvas draw commands', () => {
  const image = {};
  for (const art of ['flame', 'fish']) for (const deform of [undefined, { axis: 'x', phase: 1.3, amplitude: 0.15 }, { axis: 'y', phase: 2.1, amplitude: 0.27 }]) for (const reveal of [undefined, 0, 0.45, 1]) {
    const particle = { art, width: 80, height: 100, x: 0, y: 0, angle: 0, alpha: 1, deform, reveal };
    const atlas = original.vfx_atlas.VFX_ATLAS.rects[original.vfx_motion.FX_CELLS[art]];
    const calls = [];
    let clipping = null;
    // Record the frozen painter's actual sampling/deformation commands; this
    // fixture never reimplements its wave or band formulas.
    const context = {
      save() {}, restore() {}, translate() {}, rotate() {}, scale() {}, beginPath() {}, clip() {},
      rect(x, y, width, height) { clipping = { left: x, right: x + width, top: y, bottom: y + height }; },
      drawImage(_image, sx, sy, sw, sh, dx, dy, dw, dh) { calls.push({ sx, sy, sw, sh, dx, dy, dw, dh }); },
    };
    paintVFX(context, image, [particle]);
    const expected = calls.flatMap(({ sx, sy, sw, sh, dx, dy, dw, dh }) => {
      const left = clipping ? Math.max(dx, clipping.left) : dx;
      const right = clipping ? Math.min(dx + dw, clipping.right) : dx + dw;
      const top = clipping ? Math.max(dy, clipping.top) : dy;
      const bottom = clipping ? Math.min(dy + dh, clipping.bottom) : dy + dh;
      if (left >= right || top >= bottom) return [];
      const vertex = (x, y) => ({
        x, y: -y,
        u: (sx + (x - dx) / dw * sw - atlas[0]) / atlas[2],
        v: (sy + (y - dy) / dh * sh - atlas[1]) / atlas[3],
      });
      return [[vertex(left, bottom), vertex(right, bottom), vertex(left, top), vertex(right, top)]];
    });
    const actual = stripGeometry(particle.width, particle.height / (atlas[2] / atlas[3]), deform, reveal);
    const scenario = `${art} ${deform?.axis || 'plain'} reveal=${reveal}`;
    assert.equal(actual.length, expected.length, scenario);
    for (let quad = 0; quad < expected.length; quad++) for (let vertex = 0; vertex < 4; vertex++) for (const axis of ['x', 'y', 'u', 'v'])
      assert.ok(Math.abs(actual[quad][vertex][axis] - expected[quad][vertex][axis]) < 1e-9, `${scenario} quad ${quad} vertex ${vertex} ${axis}`);
  }
});

test('all eight characters retain initial stats and each completed quality-level strength endpoint', () => {
  for (const [level, rank] of [[1, 0], [5, 0], ...[10, 20, 30, 40, 60, 80, 100, 120, 140, 160].map((level, rank) => [level, rank])]) {
    const oldState = fixture(original, { level, rank });
    const newState = fixture(migrated, { level, rank });
    for (const cat of original.core.CATS) {
      assert.deepEqual(migrated.core.catStats(newState, cat.id), original.core.catStats(oldState, cat.id), `${cat.id} Lv.${level} rank ${rank}`);
      const quote = migrated.companions.starQuote(newState, cat.id), oldQuote = original.companions.starQuote(oldState, cat.id);
      for (const key of ['rank', 'nextRank', 'shards', 'notes', 'owned', 'have', 'maxed']) assert.equal(quote[key], oldQuote[key], `${cat.id}: ${key}`);
    }
    assert.equal(migrated.core.power(newState), original.core.power(oldState));
  }
});

test('all 3500 fixed campaign encounters retain enemy stats and drops', () => {
  for (let stage = 1; stage <= 3500; stage++)
    assert.deepEqual(migrated.core.enemiesFor(stage), original.core.enemiesFor(stage), `stage ${stage}`);
});

for (const scenario of [
  { name: 'new account', stage: 1 },
  { name: 'first boss', stage: 5, level: 5 },
  { name: 'physical carry', stage: 120, level: 40, rank: 3, party: ['orange', 'bolt', 'ink', 'milk', 'star'] },
  { name: 'shield carry', stage: 150, level: 40, rank: 3, party: ['pudding', 'orange', 'spark', 'milk', 'mint'] },
  { name: 'late campaign', stage: 3500, level: 160, rank: 9, party: ['pudding', 'orange', 'ink', 'milk', 'star'] },
]) test(`seeded battle and settlement parity: ${scenario.name}`, () => {
  const oldState = fixture(original, scenario), newState = fixture(migrated, scenario);
  const beforeOld = new original.core.Battle(oldState, { seed: 7521, now: NOW });
  const beforeNew = new migrated.core.Battle(newState, { seed: 7521, now: NOW });
  for (let tick = 0; tick < 8000 && !beforeOld.result; tick++) {
    if (tick % 91 === 5) assert.equal(beforeNew.openCan(), beforeOld.openCan());
    assert.deepEqual(beforeNew.tick(0.1), beforeOld.tick(0.1), `events at tick ${tick}`);
    assert.deepEqual(combatState(beforeNew), combatState(beforeOld), `actors at tick ${tick}`);
  }
  assert.ok(beforeOld.result, 'scenario completes');
  assert.deepEqual(migrated.core.settleBattle(newState, beforeNew, NOW), original.core.settleBattle(oldState, beforeOld, NOW));
  assert.deepEqual(baselineFields(newState), oldState);
});

test('equipment generation, all +1..+15 enhancements, reforge, and dismantle match', () => {
  const oldState = fixture(original, { rich: true }), newState = fixture(migrated, { rich: true });
  for (const slot of ['claw', 'coat', 'collar', 'brace', 'rune']) for (const tier of [1, 100, 301, 600]) {
    const options = { slot, quality: 3, set: 'guard', rune: 'focus' };
    const a = original.equipment.addGear(oldState, tier, options), b = migrated.equipment.addGear(newState, tier, options);
    assert.deepEqual(b, a);
    for (let level = 0; level < 16; level++) {
      assert.deepEqual(migrated.equipment.enhanceQuote(b.item), original.equipment.enhanceQuote(a.item));
      assert.equal(migrated.equipment.enhanceGear(newState, b.item.id), original.equipment.enhanceGear(oldState, a.item.id));
      assert.deepEqual(migrated.equipment.gearValues(b.item), original.equipment.gearValues(a.item));
    }
    assert.equal(migrated.equipment.reforgeGear(newState, b.item.id, 0), original.equipment.reforgeGear(oldState, a.item.id, 0));
    assert.deepEqual(migrated.equipment.dismantleGear(newState, b.item.id), original.equipment.dismantleGear(oldState, a.item.id));
  }
  assert.deepEqual(baselineFields(newState), oldState);
});

test('three daily keepsake victories, random five, chosen five, replay protection and midnight reset match', () => {
  const a = fixture(original, { stage: 4 }), b = fixture(migrated, { stage: 4 });
  for (let index = 0; index < 3; index++) {
    const qa = original.activities.activityInfo(a, { kind: 'recruit', id: 'all', tier: 1 }, NOW);
    const qb = migrated.activities.activityInfo(b, { kind: 'recruit', id: 'all', tier: 1 }, NOW);
    assert.deepEqual(qb, qa);
    const ra = original.activities.settleActivity(a, qa, NOW, () => index / 3);
    const rb = migrated.activities.settleActivity(b, qb, NOW, () => index / 3);
    assert.deepEqual(rb, ra);
    assert.equal(rb.shards, 5);
    assert.equal(migrated.token_rewards.grantChosenTokens(b, rb.tokenTicket, 'star', false), false);
    assert.equal(original.token_rewards.grantChosenTokens(a, ra.tokenTicket, 'star', true), true);
    assert.equal(migrated.token_rewards.grantChosenTokens(b, rb.tokenTicket, 'star', true), true);
    assert.equal(migrated.token_rewards.grantChosenTokens(b, rb.tokenTicket, 'star', true), false);
  }
  assert.equal(migrated.activities.activityInfo(b, { kind: 'recruit', tier: 1 }, NOW).open, false);
  assert.equal(migrated.activities.activityInfo(b, { kind: 'recruit', tier: 1 }, NOW + 86400000).quota.remaining, 3);
  assert.deepEqual(baselineFields(b), a);
});

test('rotation locks, material stages, weekly rewards and Beijing day keys match', () => {
  const a = fixture(original, { stage: 3500 }), b = fixture(migrated, { stage: 3500 });
  for (let day = -1; day <= 7; day++) for (const kind of ['salvage', 'wardrobe', 'nightwatch', 'sweep', 'escort', 'parts', 'polish', 'recruit']) {
    const at = NOW + day * 86400000;
    assert.deepEqual(migrated.activities.activityInfo(b, { kind, tier: 1, runeSearch: true }, at), original.activities.activityInfo(a, { kind, tier: 1, runeSearch: true }, at));
  }
  for (const tier of [1, 2, 3]) assert.deepEqual(migrated.campaign.weeklyInfo(b, tier, NOW), original.campaign.weeklyInfo(a, tier, NOW));
});

test('old Preview11 saves retain inventory, token tickets and earned progress through the authorized rule migration', () => {
  const state = fixture(original, { stage: 2345, level: 125, rank: 6, rich: true });
  state.activities.tokenSerial = 7;
  state.activities.tokenRewards = [{ serial: 7, claimed: false }];
  state.battleReport = { win: true, mode: 'activity', title: '失物追寻', stage: 5, companion: 'mint', tokenTicket: 7, rewards: { shards: 5 }, route: { group: 'recruit', id: 'all', tier: 1 } };
  const oldSave = original.core.encodeSave(state);
  assert.deepEqual(baselineFields(migrated.core.decodeSave(oldSave, NOW)), original.core.decodeSave(oldSave, NOW));
  const normalized = migrated.core.decodeSave(oldSave, NOW);
  assert.deepEqual(migrated.core.decodeSave(migrated.core.encodeSave(normalized), NOW), normalized);
  assert.throws(() => migrated.core.decodeSave(oldSave.replace('CAN-CLUB-GROWTH-1', 'CAN-CLUB-1'), NOW));
});

function sessionFrom(state, extra = {}) {
  let stored = original.core.encodeSave(state);
  const session = new GameSession({ load: () => stored, save: encoded => { stored = encoded; }, now: () => NOW, ...extra });
  return { session, saved: () => stored };
}

test('session uses the same battle rules while switching pages and auto-advancing patrol', () => {
  const state = fixture(original, { stage: 1 });
  const { session } = sessionFrom(state);
  session.changeTab('bag');
  for (let frame = 0; frame < 1600 && session.state.highest === 0; frame++) session.update(0.1);
  assert.ok(session.state.highest >= 1, 'battle advanced while on bag page');
  assert.equal(session.tab, 'bag');
  assert.equal(session.state.battleReport, null);
  const stage = session.state.stage;
  for (let frame = 0; frame < 14; frame++) session.update(0.1);
  assert.equal(session.battle.stage, stage, 'next patrol starts automatically');
});

test('session result blocks tutorial interception, persists across reload, and requires explicit dismissal', () => {
  const state = fixture(original, { stage: 10, level: 80, rank: 9 });
  const { session, saved } = sessionFrom(state);
  assert.equal(session.startActivity({ kind: 'salvage', tier: 1 }), true);
  for (let frame = 0; frame < 2000 && !session.report; frame++) session.update(0.1);
  assert.ok(session.report);
  session.state.guideStep = 20;
  session.save();
  const expected = structuredClone(session.report);
  for (let frame = 0; frame < 100; frame++) session.update(0.1);
  assert.deepEqual(session.report, expected);
  assert.equal(session.guideEvent('continue'), false);
  assert.equal(session.guideActive, false);
  const restored = new GameSession({ load: saved, save() {}, now: () => NOW });
  assert.deepEqual(restored.report, expected);
  assert.equal(restored.running, false);
  assert.equal(restored.guideActive, false);
  assert.ok(restored.closeReport());
});

test('explicit pause-menu return abandons the activity without rewards and restores its directory', () => {
  const { session } = sessionFrom(fixture(original, { stage: 10, level: 30 }));
  assert.equal(session.startActivity({ kind: 'salvage', tier: 1 }), true);
  const before = structuredClone(session.state);
  session.pause();
  assert.equal(session.returnToStreet(), true);
  assert.equal(session.battle.activity, null);
  assert.equal(session.tab, 'map');
  assert.equal(session.paused, false);
  assert.equal(session.running, true, 'activity return resumes ordinary patrol');
  assert.equal(session.report, null);
  assert.equal(session.navigation.panel, 'street');
  assert.equal(session.navigation.route.id, 'salvage');
  assert.equal(session.navigation.detail, false);
  assert.equal(session.state.gold, before.gold);
  assert.deepEqual(session.state.activities, before.activities);
  assert.deepEqual(session.state.inventory, before.inventory);
  // The same explicit action while patrolling returns without advancing it;
  // going back to battle resumes, while normal bottom-tab changes never pause.
  session.changeTab('battle');
  session.pause();
  session.returnToStreet();
  assert.equal(session.running, false);
  session.changeTab('battle');
  assert.equal(session.running, true);
});

test('session video completion is required, concurrent requests are locked, and tickets cannot be replayed', async () => {
  const state = fixture(original, { stage: 4 });
  const q = original.activities.activityInfo(state, { kind: 'recruit', tier: 1 }, NOW);
  const reward = original.activities.settleActivity(state, q, NOW, () => 0);
  state.battleReport = { win: true, mode: 'activity', title: '失物追寻', stage: 5, companion: reward.companion, tokenTicket: reward.tokenTicket, rewards: { shards: 5 }, route: { group: 'recruit', id: 'all', tier: 1 } };
  let complete;
  let calls = 0;
  const { session } = sessionFrom(state, { reward: () => { calls++; return new Promise(resolve => { complete = resolve; }); } });
  const before = session.state.roster.shards.star;
  const first = session.watchChosenTokens('star');
  assert.equal(await session.watchChosenTokens('star'), false);
  assert.equal(session.closeReport(), false);
  complete(false);
  assert.equal(await first, false);
  assert.equal(session.state.roster.shards.star, before);
  const second = session.watchChosenTokens('star');
  complete({ completed: true });
  assert.equal(await second, true);
  assert.equal(session.state.roster.shards.star, before + 5);
  assert.equal(await session.watchChosenTokens('star'), false);
  assert.equal(calls, 2);
});

test('session backup fallback, fresh saves and reset never import another account progress', () => {
  const own = fixture(original, { stage: 26, level: 40 });
  const session = new GameSession({ load: () => 'broken', loadBackup: () => original.core.encodeSave(own), save() {}, now: () => NOW });
  assert.equal(session.state.highest, 25);
  assert.match(session.notice, /备份/);
  session.reset();
  assert.equal(session.state.highest, 0);
  assert.deepEqual(session.state.party, ['orange', 'ink']);
  assert.equal(session.state.levels.orange, 1);
  assert.equal(session.state.onboarded, false);
});

test('the first-player tutorial preserves starter training, can practice, and the growth-goals handoff', () => {
  let saved = '';
  const session = new GameSession({ load: () => null, save: encoded => { saved = encoded; }, now: () => NOW });
  const routes = [];
  session.subscribe(event => { if (event.type === 'navigation') routes.push(event.panel); });
  assert.equal(session.startIntro(), true);
  session.guideEvent('continue');
  session.changeTab('cats');
  assert.equal(session.state.guideStep, 3);
  assert.equal(session.upgrade('orange', 1), 1);
  session.setMode('equipment');
  session.guideEvent('gear');
  session.guideEvent('continue');
  session.changeTab('battle');
  session.guideEvent('continue');
  session.guideEvent('continue');
  assert.equal(session.state.guideStep, migrated.onboarding.GUIDE_CAN);
  assert.equal(session.useCan(), true);
  assert.equal(session.state.guideStep, 13);
  assert.equal(session.running, false);
  session.update(0.1);
  session.guideEvent('continue');
  assert.equal(session.state.guideStep, migrated.onboarding.GUIDE_DONE);
  assert.equal(session.running, true);
  assert.deepEqual(routes, ['quests']);
  assert.equal(session.navigation.panel, 'quests');
  assert.deepEqual(session.state.party, ['orange', 'ink']);
  assert.equal(session.state.levels.orange, 2);
  assert.equal(session.state.levels.ink, 1);
  assert.equal(migrated.core.decodeSave(saved, NOW).guideStep, migrated.onboarding.GUIDE_DONE);
});

test('SDK callbacks from completed requests cannot complete or cancel the next video', async () => {
  const records = [], timers = new Map();
  let timerSerial = 0;
  const api = { createRewardedVideoAd() {
    const record = { close: null, error: null, destroyed: 0, shown: 0, release: null };
    const index = records.length;
    records.push(record);
    return {
      onClose: callback => { record.close = callback; },
      onError: callback => { record.error = callback; },
      offClose() {}, offError() {},
      load: () => index === 0 ? Promise.resolve() : new Promise(resolve => { record.release = resolve; }),
      show: async () => { record.shown++; },
      destroy: () => { record.destroyed++; },
    };
  } };
  const service = createRewardedService(api, 'adunit-real-test', {
    setTimer: callback => { timers.set(++timerSerial, callback); return timerSerial; },
    clearTimer: id => timers.delete(id),
  });
  const tick = () => new Promise(resolve => setImmediate(resolve));
  const first = service.watch();
  await tick();
  const staleClose = records[0].close, staleError = records[0].error;
  staleClose({ isEnded: true });
  assert.equal((await first).completed, true);
  assert.equal(records[0].destroyed, 1);
  const second = service.watch();
  assert.equal(records.length, 2, 'new SDK instance per request');
  staleClose({ isEnded: true });
  staleError({ errCode: 1004 });
  assert.equal(service.busy, true, 'old callbacks ignored while new request loads');
  assert.equal(records[1].shown, 0);
  records[1].release();
  await tick();
  staleClose({ isEnded: true });
  staleError({ errCode: 1004 });
  assert.equal(service.busy, true, 'old callbacks ignored while new video is showing');
  assert.equal((await service.watch()).status, 'busy');
  records[1].close({ isEnded: false });
  assert.equal((await second).completed, false);
  records[1].close({ isEnded: true });
  assert.equal(service.busy, false);
  assert.equal(records[1].destroyed, 1);
  service.dispose();
  assert.equal(timers.size, 0);
});
