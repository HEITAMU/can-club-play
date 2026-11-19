// @ts-nocheck
// Authorized growth change: ascension opens levels; levels open skill study.
import { ASCENSION_POWER, ascensionPower } from './ascension';
import { trainingPower } from './growth-curve';
import { mulDiv } from './integer-math';

export const GROWTH_RULE_VERSION = 1;
export const MAX_HERO_LEVEL = 160;
export const ASCENSION_LEVEL_CAPS = Object.freeze([10, 20, 30, 40, 60, 80, 100, 120, 140, 160]);
export const SKILL_STUDY_LEVELS = Object.freeze([1, 40, 80, 120]);
const safe = (value, max = MAX_HERO_LEVEL) => typeof value === 'number' && Number.isFinite(value)
  ? Math.max(0, Math.min(max, Math.floor(value))) : 0;
export const ascensionLevelCap = rank => ASCENSION_LEVEL_CAPS[safe(rank, 9)];
// Only the current quality permits new training or receiving inherited levels.
export const levelCap = (state, id) => ascensionLevelCap(state.roster?.stars?.[id]);
// Legacy protection is a read-time allowance, never a purchasing allowance.
export const retainedLevelCap = (state, id) => Math.max(levelCap(state, id), safe(state.legacyLevelCaps?.[id]));

export function levelGrowthPower(level) {
  const current = Math.max(1, safe(level));
  if (current <= ASCENSION_LEVEL_CAPS[0]) return ASCENSION_POWER[0];
  for (let rank = 1; rank < ASCENSION_LEVEL_CAPS.length; rank++) {
    const end = ASCENSION_LEVEL_CAPS[rank];
    if (current <= end) {
      const start = ASCENSION_LEVEL_CAPS[rank - 1], previous = ASCENSION_POWER[rank - 1];
      return Math.round(previous + (ASCENSION_POWER[rank] - previous) * (current - start) / (end - start));
    }
  }
  return ASCENSION_POWER[9];
}

// Keep the original integer rounding at each step. At each quality's maximum
// level, this equals its former level + quality strength; ascension alone adds none.
export function heroGrowthValue(value, level, bones = 0, power = levelGrowthPower(level)) {
  return [trainingPower(level), 100, 100 + 8 * bones, power].reduce((n, percent) => mulDiv(n, percent), value);
}

export function normalizeGrowthRules(state, raw, cats) {
  state.growthRuleVersion = GROWTH_RULE_VERSION;
  state.legacyLevelCaps = Object.fromEntries(cats.map(cat => [cat.id, 0]));
  if (safe(raw.growthRuleVersion, 1e6) >= GROWTH_RULE_VERSION) {
    for (const cat of cats) {
      state.legacyLevelCaps[cat.id] = safe(raw.legacyLevelCaps?.[cat.id]);
      state.levels[cat.id] = Math.min(state.levels[cat.id], retainedLevelCap(state, cat.id));
    }
    return;
  }
  // Convert already-paid quality strength once, without changing quality, skills,
  // currency, equipment or training counters. Existing levels never go backwards.
  for (const cat of cats) {
    const oldLevel = state.levels[cat.id], power = ascensionPower(state.roster.stars[cat.id]);
    const hp = heroGrowthValue(cat.hp, oldLevel, state.bones, power);
    const atk = heroGrowthValue(cat.atk, oldLevel, state.bones, power);
    let level = oldLevel;
    while (level < MAX_HERO_LEVEL && (heroGrowthValue(cat.hp, level, state.bones) < hp || heroGrowthValue(cat.atk, level, state.bones) < atk)) level++;
    state.levels[cat.id] = level;
    if (level > levelCap(state, cat.id)) state.legacyLevelCaps[cat.id] = level;
  }
}
