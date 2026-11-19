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


test('ten quality caps and three automatic skill unlock thresholds apply to all eight companions', () => {
  assert.deepEqual(R.ASCENSION_LEVEL_CAPS, [10,20,30,40,60,80,100,120,140,160]);
  assert.deepEqual(R.SKILL_STUDY_LEVELS, [1,40,80,120]);
  assert.equal(G.MAX_LEVEL, 160);
  for (const cat of G.CATS) {
    for (let rank=0;rank<10;rank++) {
      const s=state();s.roster.stars[cat.id]=rank;
      assert.equal(G.levelCap(s,cat.id),R.ASCENSION_LEVEL_CAPS[rank]);
      const q=G.starQuote(s,cat.id);
      assert.equal(q.cap,R.ASCENSION_LEVEL_CAPS[rank]);
      assert.equal(q.nextCap,R.ASCENSION_LEVEL_CAPS[Math.min(9,rank+1)]);
    }
    for (const [level,rank] of [[1,0],[5,0],[39,0],[40,1],[79,1],[80,2],[119,2],[120,3],[160,3]]) {
      const s=state(); s.levels[cat.id]=level;
      assert.equal(R.skillRankForLevel(level),rank);
      assert.equal(G.catStats(s,cat.id).skillRank,rank);
      assert.equal(S.skillRank(s,cat.id),rank);
      assert.equal(G.breakthroughQuote(s,cat.id).rank,rank);
    }
  }
});

test('quality raises only level cap; training changes stats and auto-unlocks exactly at level thresholds', () => {
  for (const cat of G.CATS) for (let rank=0;rank<10;rank++) {
    const s=state();s.roster.stars[cat.id]=rank;
    const cap=R.ASCENSION_LEVEL_CAPS[rank];s.levels[cat.id]=cap-1;
    const oldGold=s.gold,cost=G.upgradeCost(cap-1),beforeRank=G.catStats(s,cat.id).skillRank;
    assert.deepEqual(G.upgradeQuote(cap-1,10,cap),{levels:1,cost});
    assert.equal(G.upgrade(s,cat.id,10,NOW),1);
    assert.equal(s.levels[cat.id],cap);assert.equal(s.gold,oldGold-cost);
    assert.equal(s.breakthroughs[cat.id],R.skillRankForLevel(cap));
    assert.equal(G.catStats(s,cat.id).skillRank,R.skillRankForLevel(cap));
    assert.ok(G.catStats(s,cat.id).skillRank>=beforeRank);
    const stopped=snapshot(s);assert.equal(G.upgrade(s,cat.id,10,NOW),0);assert.equal(snapshot(s),stopped);
    const quote=G.starQuote(s,cat.id),before=G.catStats(s,cat.id);
    assert.equal(G.ascendCompanion(s,cat.id),rank<9);
    assert.equal(s.levels[cat.id],cap);assert.equal(G.catStats(s,cat.id).hp,before.hp);assert.equal(G.catStats(s,cat.id).atk,before.atk);
    if(rank<9){assert.equal(s.roster.shards[cat.id],1000-quote.shards);assert.equal(G.upgrade(s,cat.id,1,NOW),1);}
    else assert.equal(snapshot(s),stopped);
  }
});

test('levels 40,80,120 unlock automatically; no study materials or confirmation are needed', () => {
  for (const cat of G.CATS) for (const [level,expected] of [[39,0],[79,1],[119,2]]) {
    const s=state();s.roster.stars[cat.id]=9;s.levels[cat.id]=level;s.breakthroughs[cat.id]=expected;
    const badges=s.badges,notes=s.growth.notes,seals=s.growth.seals;
    assert.equal(G.catStats(s,cat.id).skillRank,expected);
    const quote=G.breakthroughQuote(s,cat.id);
    assert.equal(quote.requiredLevel,level+1);
    assert.equal(quote.automatic,true);assert.equal(quote.canLearn,false);
    const old=snapshot(s);assert.equal(G.breakthrough(s,cat.id),false);assert.equal(snapshot(s),old);
    assert.equal(G.upgrade(s,cat.id,1,NOW),1);
    assert.equal(s.levels[cat.id],level+1);
    assert.equal(s.breakthroughs[cat.id],expected+1);
    assert.equal(G.catStats(s,cat.id).skillRank,expected+1);
    assert.equal(s.badges,badges);assert.equal(s.growth.notes,notes);assert.equal(s.growth.seals,seals);
    assert.equal(G.breakthroughQuote(s,cat.id).rank,expected+1);
  }
});

test('unaffordable study resources do not prevent automatic unlocking; manual study is always inert', () => {
  const s=state();s.roster.stars.orange=9;s.levels.orange=39;s.badges=0;s.growth.notes=0;s.growth.seals=0;
  assert.equal(G.upgrade(s,'orange',1,NOW),1);
  assert.equal(s.breakthroughs.orange,1);
  assert.equal(G.breakthroughQuote(s,'orange').canLearn,false);
  const snapshotBefore=snapshot(s);
  assert.equal(G.breakthrough(s,'orange'),false);assert.equal(snapshot(s),snapshotBefore);
  assert.equal(G.breakthrough(s,'unknown'),false);assert.equal(snapshot(s),snapshotBefore);
});

test('real session auto-updates live battle skill and exact skill effects at the threshold', () => {
  for (const cat of G.CATS) {
    const s=state();s.party=[cat.id];s.roster.stars[cat.id]=9;s.levels[cat.id]=39;
    const session=sessionFor(s);
    const before=session.battle.heroes[0].skillRank;
    assert.equal(before,0);
    assert.equal(session.breakthrough(cat.id),false);
    const materials=[session.state.badges,session.state.growth.notes,session.state.growth.seals];
    assert.equal(session.upgrade(cat.id),1);
    assert.equal(session.battle.heroes[0].skillRank,1);
    assert.equal(session.battle.heroes[0].level,40);
    assert.deepEqual([session.state.badges,session.state.growth.notes,session.state.growth.seals],materials);
  }
  const s=state();s.party=['ink'];s.roster.stars.ink=9;s.levels.ink=39;
  const low=new G.Battle(s,{stage:3500,seed:123,now:NOW});
  assert.equal(G.upgrade(s,'ink',1,NOW),1);
  const high=new G.Battle(s,{stage:3500,seed:123,now:NOW});
  // Equalize attack and the other stats so the difference is specifically the skill unlock.
  const a=low.heroes[0],b=high.heroes[0];
  b.atk=a.atk;b.crit=a.crit=0;
  low.skill(a);high.skill(b);
  assert.ok(high.enemies.reduce((n,e)=>n+e.hp,0)<low.enemies.reduce((n,e)=>n+e.hp,0));
});

test('old saves keep progress and receive a one-time refund of paid study materials', () => {
  const refund=[{badges:0,notes:0,seals:0},{badges:8,notes:50,seals:0},{badges:28,notes:190,seals:6},{badges:68,notes:490,seals:24}];
  for(let paid=0;paid<=3;paid++){
    const source=state(old);source.roster.stars.orange=9;source.levels.orange=30;source.breakthroughs.orange=paid;
    const before= {badges:source.badges,notes:source.growth.notes,seals:source.growth.seals,gold:source.gold,stars:source.roster.stars.orange};
    const current=G.normalizeState(source,NOW);
    assert.equal(current.skillUnlockRuleVersion,R.SKILL_UNLOCK_RULE_VERSION);
    assert.equal(current.levels.orange>=30,true);
    assert.equal(G.catStats(current,'orange').skillRank,R.skillRankForLevel(current.levels.orange));
    assert.equal(current.badges,before.badges+refund[paid].badges);
    assert.equal(current.growth.notes,before.notes+refund[paid].notes);
    assert.equal(current.growth.seals,before.seals+refund[paid].seals);
    assert.equal(current.roster.stars.orange,before.stars);
    assert.equal(current.gold,before.gold);
    const saved=G.encodeSave(current);
    assert.deepEqual(G.decodeSave(saved,NOW),current,'reloading cannot refund twice');
    assert.deepEqual(G.decodeSave(G.encodeSave(G.decodeSave(saved,NOW)),NOW),current,'repeat save cannot refund twice');
  }
});

test('all legacy levels and qualities retain combat stats through the prior quality-strength conversion', () => {
  for (let level=1;level<=160;level++) for(let rank=0;rank<10;rank++){
    const source=state(old);source.bones=level%3;
    for(const cat of old.CATS){source.levels[cat.id]=level;source.roster.stars[cat.id]=rank;source.breakthroughs[cat.id]=3;}
    const migrated=G.normalizeState(source,NOW);
    for(const cat of old.CATS){
      const before=old.catStats(source,cat.id),after=G.catStats(migrated,cat.id);
      assert.ok(after.hp>=before.hp&&after.atk>=before.atk,cat.id+' '+level+' '+rank);
      assert.ok(migrated.levels[cat.id]>=level&&migrated.levels[cat.id]<=160);
      assert.equal(migrated.roster.stars[cat.id],rank);
      assert.equal(after.skillRank,R.skillRankForLevel(migrated.levels[cat.id]));
    }
  }
});

test('old backup restore, earlier growth compensation and automatic-skill conversion are idempotent', () => {
  for(const revision of [undefined,1,2]){
    const source=state(old);source.gold=1e8;source.growthRevision=revision;source.levels.orange=80;source.roster.stars.ink=7;source.breakthroughs.ink=3;
    const migrated=G.decodeSave(old.encodeSave(source),NOW);
    assert.deepEqual(G.decodeSave(G.encodeSave(migrated),NOW),migrated);
    const restored=new GameSession({load:()=> 'broken',loadBackup:()=>G.encodeSave(migrated),save(){},now:()=>NOW});
    assert.deepEqual(restored.state.levels,migrated.levels);
    assert.deepEqual(restored.state.roster,migrated.roster);
    assert.deepEqual(restored.state.growth,migrated.growth);
    assert.equal(restored.state.gold,migrated.gold);
  }
});

test('inheritance stays gated by quality and skill ranks track receiving levels, not the original owner', () => {
  const s=state();s.party=['orange','ink'];s.roster.stars.orange=7;s.roster.stars.milk=7;
  s.levels.orange=120;s.levels.milk=39;s.breakthroughs.orange=3;s.breakthroughs.milk=0;
  assert.equal(G.inheritTraining(s,'orange','milk'),true);
  assert.equal(s.levels.orange,39);assert.equal(s.levels.milk,120);
  assert.equal(s.breakthroughs.orange,0);assert.equal(s.breakthroughs.milk,3);
  assert.equal(G.catStats(s,'orange').skillRank,0);assert.equal(G.catStats(s,'milk').skillRank,3);
  s.roster.stars.orange=0;
  const prior=snapshot(s);
  assert.equal(G.inheritTraining(s,'milk','orange'),false);assert.equal(snapshot(s),prior);
  assert.equal(G.setParty(s,0,'milk'),true);
  assert.equal(s.party[0],'milk');
  assert.equal(s.levels.orange,39);
});

test('current-format save has no legacy quality exemptions, and reset clears previous progress', () => {
  const s=state();s.levels.orange=160;s.levels.ink=-20;s.legacyLevelCaps.orange=NaN;
  const normalized=G.decodeSave(G.encodeSave(s),NOW);
  assert.equal(normalized.levels.orange,10);assert.equal(normalized.levels.ink,1);
  assert.equal(normalized.breakthroughs.orange,0);
  const oldSource=state(old);oldSource.levels.orange=160;
  const session=sessionFor(G.normalizeState(oldSource,NOW));
  assert.equal(session.state.levels.orange,160);
  assert.equal(session.state.breakthroughs.orange,3);
  assert.equal(session.breakthrough('orange'),false);
  assert.equal(G.levelCap(session.state,'orange'),10);
  session.reset();
  assert.equal(session.state.levels.orange,1);
  assert.equal(session.state.breakthroughs.orange,0);
  assert.equal(G.levelCap(session.state,'orange'),10);
});
