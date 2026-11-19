import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as esbuild from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'can-club-growth-'));
const oldDir = path.join(temp, 'preview11');
await fs.mkdir(oldDir);
const baseline = '28eb8674f4b35a381ca37363d29189a9b4911da7';
for (const name of execFileSync('git', ['ls-tree', '--name-only', baseline], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(n => n.endsWith('.mjs')))
  await fs.writeFile(path.join(oldDir, name), execFileSync('git', ['show', `${baseline}:${name}`], { cwd: root }));
await esbuild.build({ stdin: { contents: `export * as G from './assets/scripts/domain/core'; export * as R from './assets/scripts/domain/growth-rules'; export * as S from './assets/scripts/domain/skill-training'; export {GameSession} from './assets/scripts/game/GameSession';`, resolveDir: path.join(root, 'cocos') }, outfile: path.join(temp, 'current.mjs'), bundle: true, format: 'esm', platform: 'node', tsconfigRaw: {} });
await esbuild.build({ entryPoints: [path.join(oldDir, 'core.mjs')], outfile: path.join(temp, 'old.mjs'), bundle: true, format: 'esm', platform: 'node', plugins: [{ name: 'queries', setup(build) { build.onResolve({ filter: /\?v=/ }, args => ({ path: path.resolve(args.resolveDir, args.path.split('?')[0]) })); } }], tsconfigRaw: {} });
const { G, R, S, GameSession } = await import(pathToFileURL(path.join(temp, 'current.mjs')));
const old = await import(pathToFileURL(path.join(temp, 'old.mjs')));
const NOW = Date.UTC(2026, 10, 19, 12);
test.after(() => fs.rm(temp, { recursive: true, force: true }));

function state(api = G) {
  const s = api.initialState(NOW);
  s.roster.owned = api.CATS.map(c => c.id);
  s.gold = 1e12; s.badges = 1000; s.growth.notes = 10000; s.growth.seals = 1000;
  for (const id of s.roster.owned) s.roster.shards[id] = 1000;
  s.onboarded = true; s.guideStep = 9; s.gearGuide = 4;
  s.guidance.equipmentWorn = true; s.activities.cleared.salvage = 1;
  return s;
}
const snapshot = s => JSON.stringify(s);
const sessionFor = s => new GameSession({ load: () => G.encodeSave(s), save() {}, now: () => NOW });

test('ten quality caps and the three skill study gates are shared by all eight companions', () => {
  assert.deepEqual(R.ASCENSION_LEVEL_CAPS, [10, 20, 30, 40, 60, 80, 100, 120, 140, 160]);
  assert.deepEqual(R.SKILL_STUDY_LEVELS, [1, 40, 80, 120]);
  assert.equal(G.MAX_LEVEL, 160);
  for (const c of G.CATS) for (let rank = 0; rank < 10; rank++) {
    const s = state(); s.roster.stars[c.id] = rank;
    assert.equal(G.levelCap(s, c.id), R.ASCENSION_LEVEL_CAPS[rank]);
    const q = G.starQuote(s, c.id);
    assert.equal(q.cap, R.ASCENSION_LEVEL_CAPS[rank]);
    assert.equal(q.nextCap, R.ASCENSION_LEVEL_CAPS[Math.min(9, rank + 1)]);
  }
});

test('training stops at each cap, charges only completed levels, and promotion opens further training', () => {
  for (const c of G.CATS) for (let rank = 0; rank < 10; rank++) {
    const s = state(); s.roster.stars[c.id] = rank;
    const cap = R.ASCENSION_LEVEL_CAPS[rank]; s.levels[c.id] = cap - 1;
    const gold = s.gold, cost = G.upgradeCost(cap - 1);
    assert.deepEqual(G.upgradeQuote(cap - 1, 10, cap), { levels: 1, cost });
    assert.equal(G.upgrade(s, c.id, 10, NOW), 1);
    assert.equal(s.levels[c.id], cap); assert.equal(s.gold, gold - cost);
    const stopped = snapshot(s); assert.equal(G.upgrade(s, c.id, 10, NOW), 0); assert.equal(snapshot(s), stopped);
    const q = G.starQuote(s, c.id), before = G.catStats(s, c.id);
    assert.equal(G.ascendCompanion(s, c.id), rank < 9);
    assert.equal(s.levels[c.id], cap);
    assert.equal(G.catStats(s, c.id).hp, before.hp); assert.equal(G.catStats(s, c.id).atk, before.atk);
    if (rank < 9) {
      assert.equal(s.roster.shards[c.id], 1000 - q.shards); assert.equal(s.growth.notes, 10000 - q.notes);
      assert.equal(G.upgrade(s, c.id, 1, NOW), 1);
      assert.ok(G.catStats(s, c.id).hp > before.hp); assert.ok(G.catStats(s, c.id).atk >= before.atk);
    } else assert.equal(snapshot(s), stopped);
  }
});

test('skill study checks each level boundary before spending, without automatic learning on promotion', () => {
  for (const c of G.CATS) for (let rank = 0; rank < 3; rank++) {
    const s = state(), required = [40, 80, 120][rank];
    s.roster.stars[c.id] = 8; s.levels[c.id] = required - 1; s.breakthroughs[c.id] = rank;
    let q = G.breakthroughQuote(s, c.id);
    assert.equal(q.requiredLevel, required); assert.equal(q.levelReady, false); assert.equal(q.canAfford, true); assert.equal(q.canLearn, false);
    const blocked = snapshot(s); assert.equal(G.breakthrough(s, c.id), false); assert.equal(snapshot(s), blocked);
    assert.equal(G.ascendCompanion(s, c.id), true);
    assert.equal(G.breakthrough(s, c.id), false); assert.equal(s.breakthroughs[c.id], rank);
    assert.equal(G.upgrade(s, c.id, 1, NOW), 1); assert.equal(s.breakthroughs[c.id], rank);
    q = G.breakthroughQuote(s, c.id); assert.equal(q.canLearn, true);
    const before = { badges: s.badges, notes: s.growth.notes, seals: s.growth.seals };
    assert.equal(G.breakthrough(s, c.id), true); assert.equal(s.breakthroughs[c.id], rank + 1);
    assert.equal(s.badges, before.badges - q.cost); assert.equal(s.growth.notes, before.notes - q.notes); assert.equal(s.growth.seals, before.seals - q.seals);
  }
});

test('failed or maxed learning and ascension are atomic, including unavailable and unknown companions', () => {
  for (const missing of ['badges', 'notes', 'seals', 'maxed', 'unowned', 'unknown']) {
    const s = state(); s.roster.stars.orange = 9; s.levels.orange = 160; s.breakthroughs.orange = 1;
    if (missing === 'badges') s.badges = 0;
    if (missing === 'notes' || missing === 'seals') s.growth[missing] = 0;
    if (missing === 'maxed') s.breakthroughs.orange = 3;
    if (missing === 'unowned') s.roster.owned = ['ink'];
    const before = snapshot(s); assert.equal(G.breakthrough(s, missing === 'unknown' ? 'none' : 'orange'), false); assert.equal(snapshot(s), before);
  }
  for (const missing of ['shards', 'notes', 'maxed', 'unowned', 'unknown']) {
    const s = state(); s.roster.stars.orange = missing === 'maxed' ? 9 : 1;
    if (missing === 'shards') s.roster.shards.orange = 0;
    if (missing === 'notes') s.growth.notes = 0;
    if (missing === 'unowned') s.roster.owned = ['ink'];
    const before = snapshot(s); assert.equal(G.ascendCompanion(s, missing === 'unknown' ? 'none' : 'orange'), false); assert.equal(snapshot(s), before);
  }
});

test('session gates direct calls and synchronizes learned skill ranks to actual battle actors', () => {
  for (const c of G.CATS) {
    const s = state(); s.party = [c.id]; s.roster.stars[c.id] = 3; s.levels[c.id] = 39;
    const session = sessionFor(s), before = snapshot(session.state);
    assert.equal(session.breakthrough(c.id), false); assert.match(session.notice, /Lv\.40/); assert.equal(snapshot(session.state), before);
    assert.equal(session.upgrade(c.id), 1);
    assert.equal(session.breakthrough(c.id), true);
    assert.equal(session.battle.heroes[0].skillRank, 1);
    assert.equal(session.battle.heroes[0].level, 40);
    const stats = G.catStats(session.state, c.id), power = G.power(session.state);
    assert.equal(session.ascend(c.id), true);
    assert.equal(session.battle.heroes[0].maxHp, stats.hp); assert.equal(G.power(session.state), power);
  }
  const s = state(); s.party = ['ink']; s.roster.stars.ink = 3; s.levels.ink = 40;
  const session = sessionFor(s), low = new G.Battle(session.state, { stage: 3500, seed: 123, now: NOW });
  assert.equal(session.breakthrough('ink'), true);
  const high = new G.Battle(session.state, { stage: 3500, seed: 123, now: NOW });
  for (const battle of [low, high]) { battle.heroes[0].crit = 0; battle.skill(battle.heroes[0]); }
  assert.ok(high.enemies.reduce((n, e) => n + e.hp, 0) < low.enemies.reduce((n, e) => n + e.hp, 0), 'actual learned flying-fish skill must deal more damage');
});

test('legacy conversion preserves every level, quality, paid skill and original integer hp/attack', () => {
  for (let level = 1; level <= 160; level++) for (let rank = 0; rank < 10; rank++) {
    const source = state(old); source.bones = level % 3;
    for (const c of old.CATS) { source.levels[c.id] = level; source.roster.stars[c.id] = rank; source.breakthroughs[c.id] = 3; }
    const migrated = G.normalizeState(source, NOW);
    for (const c of old.CATS) {
      const a = old.catStats(source, c.id), b = G.catStats(migrated, c.id);
      assert.ok(b.hp >= a.hp && b.atk >= a.atk, `${c.id} level ${level} rank ${rank}`);
      assert.ok(migrated.levels[c.id] >= level && migrated.levels[c.id] <= 160);
      assert.equal(migrated.roster.stars[c.id], rank); assert.equal(migrated.breakthroughs[c.id], 3);
    }
    assert.equal(migrated.gold, source.gold); assert.deepEqual(migrated.growth, source.growth); assert.deepEqual(migrated.roster.shards, source.roster.shards); assert.equal(migrated.upgrades, source.upgrades);
  }
});

test('legacy conversion and the earlier growth compensation remain idempotent across save and backup restore', () => {
  for (const revision of [undefined, 1, 2]) {
    const source = state(old); source.gold = 1e8; source.growthRevision = revision; source.levels.orange = 80; source.roster.stars.ink = 7; source.breakthroughs.ink = 3;
    const migrated = G.decodeSave(old.encodeSave(source), NOW);
    const saved = G.encodeSave(migrated);
    assert.deepEqual(G.decodeSave(saved, NOW), migrated);
    assert.deepEqual(G.decodeSave(G.encodeSave(G.decodeSave(saved, NOW)), NOW), migrated);
    const restored = new GameSession({ load: () => 'broken', loadBackup: () => saved, save() {}, now: () => NOW });
    assert.deepEqual(restored.state.levels, migrated.levels); assert.deepEqual(restored.state.roster, migrated.roster);
    assert.deepEqual(restored.state.growth, migrated.growth); assert.equal(restored.state.gold, migrated.gold);
    if (revision === 2) { assert.equal(migrated.gold, source.gold); assert.deepEqual(migrated.growth, source.growth); }
  }
});

test('legacy protection cannot purchase or receive new over-cap training after a transfer', () => {
  const source = state(old); source.levels.orange = 160; source.roster.stars.milk = 9;
  const s = G.normalizeState(source, NOW);
  // The old quality on milk converted its strength; use an already-trained legal
  // recipient at Lv.1 to isolate the transfer boundary without changing the legacy owner.
  s.levels.milk = 1;
  assert.equal(s.legacyLevelCaps.orange, 160); assert.equal(G.levelCap(s, 'orange'), 10);
  assert.equal(G.inheritTraining(s, 'orange', 'milk'), true);
  assert.equal(s.levels.orange, 1); assert.equal(s.levels.milk, 160); assert.equal(s.legacyLevelCaps.orange, 160); assert.equal(s.legacyLevelCaps.milk, 0);
  assert.equal(G.upgrade(s, 'orange', 10, NOW), 9); assert.equal(G.upgrade(s, 'orange', 10, NOW), 0);
  const before = snapshot(s); assert.equal(G.inheritTraining(s, 'milk', 'orange'), false); assert.equal(snapshot(s), before);
  assert.deepEqual(G.decodeSave(G.encodeSave(s), NOW), s);
});

test('inheritance validates both receiving caps and formation changes never silently take blocked training', () => {
  const s = state(); s.party = ['orange', 'ink']; s.roster.stars.orange = 7; s.levels.orange = 120; s.breakthroughs.orange = 3;
  let before = snapshot(s); assert.equal(G.inheritTraining(s, 'orange', 'milk'), false); assert.equal(snapshot(s), before);
  const levels = { ...s.levels }, skills = { ...s.breakthroughs };
  assert.equal(G.setParty(s, 0, 'milk'), true); assert.equal(s.party[0], 'milk'); assert.deepEqual(s.levels, levels); assert.deepEqual(s.breakthroughs, skills);
  s.roster.stars.milk = 7;
  for (let i = 0; i < 4; i++) {
    assert.equal(G.inheritTraining(s, 'orange', 'milk'), true); assert.equal(G.inheritTraining(s, 'milk', 'orange'), true);
    assert.deepEqual(s.levels, levels); assert.deepEqual(s.breakthroughs, skills);
  }
  s.roster.stars.orange = 0; s.levels.milk = 40;
  before = snapshot(s); assert.equal(G.inheritanceQuote(s, 'orange', 'milk').blockedId, 'orange'); assert.equal(G.inheritTraining(s, 'orange', 'milk'), false); assert.equal(snapshot(s), before);
});

test('current-format saves do not acquire legacy exemptions; reset returns a fresh capped account', () => {
  const s = state(); s.levels.orange = 160; s.levels.ink = -20; s.legacyLevelCaps.orange = NaN; s.legacyLevelCaps.unknown = 160;
  const normalized = G.decodeSave(G.encodeSave(s), NOW);
  assert.equal(normalized.levels.orange, 10); assert.equal(normalized.levels.ink, 1); assert.equal(normalized.legacyLevelCaps.orange, 0); assert.equal(normalized.legacyLevelCaps.unknown, undefined);
  const legacy = state(old); legacy.levels.orange = 160;
  const session = sessionFor(G.normalizeState(legacy, NOW));
  assert.equal(session.state.levels.orange, 160);
  // The retained current level can meet a study gate, but never raises the
  // natural training or inheritance cap. Previously learned skills stay learned.
  assert.equal(session.breakthrough('orange'), true); assert.equal(G.levelCap(session.state, 'orange'), 10);
  session.reset(); assert.equal(session.state.levels.orange, 1); assert.equal(G.levelCap(session.state, 'orange'), 10);
  assert.ok(Object.values(session.state.legacyLevelCaps).every(value => value === 0));
});
