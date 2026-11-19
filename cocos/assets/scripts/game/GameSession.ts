// @ts-nocheck
// Engine-independent application controller for the Preview11 rules.
// Rendering, input, storage transport and real rewarded-video playback are injected.
import * as G from '../domain/core';
import * as Gear from '../domain/equipment';
import * as Campaign from '../domain/campaign';
import { activityInfo, activityLockReason } from '../domain/activities';
import { battleReport } from '../domain/battle-flow';
import { battleRate } from '../domain/motion';
import { GUIDE, GUIDE_CAN, GUIDE_DONE, nextGuide, guideResume } from '../domain/onboarding';
import { GROWTH_SAVE_KEY } from '../domain/growth-curve';
import { applyTeamPlan as applyPlan, TEAM_PLANS } from '../domain/team-plans';
import { grantChosenTokens, tokenRewardReady } from '../domain/token-rewards';
import { businessBoostQuote, grantBusinessBoost } from '../domain/rewarded-economy';

export const SAVE_KEY = GROWTH_SAVE_KEY;
export const BACKUP_KEY = SAVE_KEY + '-backup';
export const LEGACY_SAVE_KEY = 'can-club-save-v1';

export interface SessionServices {
  load(): string | null;
  loadBackup?(): string | null;
  save(encoded: string): void;
  clear?(): void;
  now?: () => number;
  reward?: (placement: 'tokens' | 'business') => Promise<boolean | { completed: boolean }>;
}

export class GameSession {
  state: any;
  battle: any = null;
  tab = 'battle';
  selected = 'orange';
  mode = 'profile';
  running = false;
  paused = false;
  hidden = false;
  loading = false;
  events: any[] = [];
  time = 0;
  endElapsed = 0;
  nextDelay = 0;
  entranceRemaining = 0;
  revision = 0;
  battleRevision = 0;
  growthRunFrom: number | null = null;
  notice = '';
  message = '';
  saveOK = true;
  rewardPending = false;
  navigation: any = null;
  lastReward: any = null;
  lastRequest: any = {};
  private services: SessionServices;
  private listeners = new Set<(event: any) => void>();
  private idleClock = 0;
  private saveClock = 0;
  private pausedRunning = false;

  constructor(services: SessionServices) {
    this.services = services;
    let encoded: string | null = null;
    try { encoded = services.load(); } catch { this.saveOK = false; }
    if (encoded) {
      try { this.state = G.decodeSave(encoded, this.now()); }
      catch {
        try {
          const backup = services.loadBackup?.();
          if (backup) {
            this.state = G.decodeSave(backup, this.now());
            this.notice = '已恢复最近一份可用备份。';
          }
        } catch { /* Preserve unreadable records in the storage adapter. */ }
        if (!this.state) this.notice = '存档未能读取，已开启新远征。';
      }
    }
    this.state ||= G.initialState(this.now());
    G.accrueIdle(this.state, this.now());
    Campaign.refreshCampaign(this.state, this.now());
    this.battle = new G.Battle(this.state, { now: this.now() });
    this.battleRevision++;
    // A persisted result always takes precedence over tutorial input. This carries
    // the post-Preview11 settlement/interception fix into the Cocos controller.
    if (this.report) this.running = false;
    else if (!this.state.onboarded) this.running = false;
    else if (this.guideActive) this.restoreGuide();
    else if (!this.maybeGearGuide()) this.running = this.state.runCleared < G.MAX_STAGE;
    if (!this.notice && this.state.growthRebalancePending)
      this.notice = '成长调整：已补回升星材料与多付鱼币，可点猫牌提升。';
  }

  now() { return this.services.now?.() ?? Date.now(); }
  get report() { return this.state.battleReport; }
  get intro() { return !this.state.onboarded; }
  get guideActive() { return this.state.onboarded && !this.report && !!GUIDE[this.state.guideStep]; }
  get guide() { return this.guideActive ? { ...GUIDE[this.state.guideStep], step: this.state.guideStep } : null; }
  get teamPlans() { return TEAM_PLANS; }
  get adAvailable() { return typeof this.services.reward === 'function'; }

  subscribe(listener: (event: any) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(type: string, details: any = {}) {
    const event = { type, ...details };
    for (const listener of [...this.listeners]) listener(event);
  }

  toast(message: string) {
    this.notice = this.message = message;
    this.emit('notice', { message });
  }

  private fail(message: string) { this.toast(message); return false; }

  save() {
    try {
      this.services.save(G.encodeSave(this.state));
      this.saveOK = true;
    } catch { this.saveOK = false; }
    this.emit('save', { ok: this.saveOK });
    return this.saveOK;
  }

  private changed(reason: string, details: any = {}) {
    this.revision++;
    this.save();
    this.emit('state', { reason, revision: this.revision, ...details });
  }

  private combat(events: any[]) {
    if (!events?.length) return;
    this.events.push(...events);
    // A hidden battle continues logically; it must not accumulate minutes of VFX.
    if (this.events.length > 512) this.events.splice(0, this.events.length - 512);
    this.emit('combat', { events });
  }

  drainEvents() { return this.events.splice(0); }

  setLoading(loading: boolean) { this.loading = !!loading; }

  setHidden(hidden: boolean) {
    this.hidden = !!hidden;
    G.accrueIdle(this.state, this.now());
    this.changed(hidden ? 'hide' : 'show');
  }

  pause() {
    if (this.paused || this.report) return false;
    this.pausedRunning = this.running;
    this.paused = true;
    this.running = false;
    this.emit('state', { reason: 'pause' });
    return true;
  }

  resume() {
    if (!this.paused) return false;
    this.paused = false;
    this.running = this.pausedRunning && !this.guideActive && !this.report;
    this.emit('state', { reason: 'resume' });
    return true;
  }

  update(delta: number) {
    if (this.hidden || !Number.isFinite(delta) || delta <= 0) return;
    const dt = Math.min(0.1, delta);
    this.time += dt;
    this.idleClock += dt;
    this.saveClock += dt;
    if (!this.loading && this.guideActive && this.state.guideStep === 13 && this.battle)
      this.combat(this.battle.tickCanDemo(dt));
    if (!this.guideActive && !this.loading && !this.paused && this.entranceRemaining > 0) {
      this.entranceRemaining -= dt;
      if (this.entranceRemaining <= 0) {
        this.entranceRemaining = 0;
        this.running = !this.report;
        this.emit('state', { reason: 'entrance-complete' });
      }
    }
    // Deliberately independent of tab/modal rendering: patrol continues on every page.
    if (!this.guideActive && !this.loading && !this.paused && this.running && !this.report && this.battle && !this.battle.result) {
      let remaining = dt * battleRate(this.state.speed);
      while (remaining > 0 && !this.battle.result) {
        const slice = Math.min(0.1, remaining);
        this.combat(this.battle.tick(slice));
        remaining -= slice;
      }
      if (this.battle.result && !this.battle.resolved) this.finishBattle();
    }
    if (!this.guideActive && !this.loading && !this.paused && this.nextDelay > 0 && !this.report) {
      this.nextDelay -= dt;
      if (this.nextDelay <= 0) this.startBattle();
    }
    if (this.battle?.result) this.endElapsed += dt;
    if (this.idleClock >= 1.2) {
      this.idleClock = 0;
      G.accrueIdle(this.state, this.now());
      Campaign.refreshCampaign(this.state, this.now());
      this.emit('state', { reason: 'income' });
    }
    if (this.saveClock >= 6) { this.saveClock = 0; this.save(); }
  }

  startBattle(options: any = {}) {
    if (this.report) return false;
    if (this.guideActive || !this.state.onboarded) {
      this.running = false;
      this.nextDelay = 0;
      return false;
    }
    const { arenaTier = 0, weeklyTier = 0, activity = null, entrance = false } = options;
    if (this.state.runCleared >= G.MAX_STAGE && !arenaTier && !weeklyTier && !activity) {
      this.running = false;
      this.nextDelay = 0;
      this.navigation = { panel: 'victory' };
      this.emit('navigation', this.navigation);
      return false;
    }
    const stage = arenaTier || weeklyTier || activity ? options.stage : this.state.stage;
    let next;
    try { next = new G.Battle(this.state, { ...options, stage, now: this.now() }); }
    catch (error) { return this.fail(error.message || '当前关卡尚未开放'); }
    this.lastRequest = { ...options };
    this.battle = next;
    this.battleRevision++;
    this.events.length = 0;
    this.nextDelay = 0;
    this.endElapsed = 0;
    this.paused = false;
    this.entranceRemaining = entrance || activity || arenaTier || weeklyTier ? 1.1 : 0;
    this.running = this.entranceRemaining <= 0;
    this.navigation = null;
    this.emit('battle-start', { battle: next, revision: this.battleRevision });
    return true;
  }

  useCan() {
    if (this.report || this.paused || this.loading || this.tab !== 'battle' || !this.battle || this.battle.result || (!this.running && this.state.guideStep !== GUIDE_CAN)) return false;
    if (!this.battle.openCan()) return false;
    this.state.rescueSeen = true;
    this.combat(this.battle.events.splice(0));
    this.guideEvent('can');
    this.changed('can');
    return true;
  }

  private finishBattle() {
    const current = this.battle;
    for (const actor of [...current.heroes, ...current.enemies]) actor.action = null;
    const before = { ...this.state.inventory.materials };
    const result = G.settleBattle(this.state, current, this.now());
    this.running = false;
    if (!result) return;
    this.lastReward = result;
    if (!current.activity && !current.weekly && current.mode !== 'arena') {
      this.state.battleReport = null;
      this.changed('patrol-result', { result });
      this.emit('battle-end', { battle: current, result, report: null });
      if (!result.win) { this.startBattle(); return; }
      if (this.maybeGearGuide()) return;
      this.nextDelay = result.complete ? 0 : 1.2;
      if (result.complete) {
        this.navigation = { panel: 'victory' };
        this.emit('navigation', this.navigation);
      }
      return;
    }
    const report = battleReport(current, result);
    report.rewards.scrap = this.state.inventory.materials.scrap - before.scrap;
    report.rewards.essence = this.state.inventory.materials.essence - before.essence;
    this.state.battleReport = report;
    this.changed('battle-result', { result, report });
    this.emit('battle-end', { battle: current, result, report });
  }

  reportRequest(report = this.report) {
    if (!report) return {};
    return report.mode === 'activity' ? {
      activity: {
        kind: report.route.group === 'materials' ? report.route.id : report.route.group,
        id: report.route.group === 'materials' ? '' : report.route.id,
        tier: report.route.tier,
        runeSearch: report.route.runeSearch === true,
      },
    } : report.mode === 'patrol' ? { entrance: true } : report.request || {};
  }

  closeReport(action = '') {
    const report = this.report;
    if (!report || this.rewardPending) return false;
    this.state.battleReport = null;
    this.changed('close-result');
    if (this.state.gearGuide === 2 && report.win && report.gearUid) {
      this.state.gearGuideItem = report.gearUid;
      if (this.maybeGearGuide(true)) return report;
    }
    if (action === 'retry') {
      this.changeTab('battle');
      this.startBattle(this.reportRequest(report));
    } else if (action === 'crew') {
      this.lastRequest = this.reportRequest(report);
      this.mode = 'formation';
      this.changeTab('cats');
      this.navigation = { panel: 'formation', retry: this.lastRequest };
      this.emit('navigation', this.navigation);
    } else if (report.mode === 'activity') {
      this.startBattle();
      this.changeTab('map');
      this.navigation = { panel: 'street', route: report.route, detail: false };
      this.emit('navigation', this.navigation);
    } else if (report.mode !== 'patrol') {
      this.startBattle();
      this.changeTab('map');
      this.navigation = { panel: 'challenges' };
      this.emit('navigation', this.navigation);
    } else this.startBattle();
    return report;
  }

  returnToStreet() {
    if (this.report || this.rewardPending) return false;
    const activity = this.battle?.activity;
    this.paused = false;
    this.pausedRunning = false;
    this.running = false;
    this.entranceRemaining = 0;
    this.nextDelay = 0;
    // This is the pause menu's explicit leave action. Ordinary bottom tabs do
    // not use it and continue the current battle on every page.
    if (activity) {
      const route = {
        group: ['recruit', 'hunt', 'hard'].includes(activity.kind) ? activity.kind : 'materials',
        id: activity.id || activity.kind,
        tier: activity.tier,
        runeSearch: activity.runeSearch === true,
      };
      this.startBattle();
      this.changeTab('map');
      this.navigation = { panel: 'street', route, detail: false };
      this.emit('navigation', this.navigation);
    } else this.changeTab('map');
    return true;
  }

  changeTab(tab: string) {
    if (tab === 'relics') tab = 'bag';
    if (!['battle', 'cats', 'formation', 'bag', 'map'].includes(tab)) return false;
    if (tab === 'formation') this.mode = 'formation';
    this.tab = tab;
    if (tab === 'battle' && !this.guideActive && !this.running && !this.paused && this.battle && !this.battle.result && !this.report && this.entranceRemaining <= 0) this.running = true;
    this.guideEvent(tab === 'cats' ? 'companions' : tab);
    this.revision++;
    this.emit('state', { reason: 'tab', tab });
    return true;
  }

  selectCrew(id: string) {
    if (!G.ownsCompanion(this.state, id)) return false;
    this.selected = id;
    this.emit('state', { reason: 'selected', id });
    return true;
  }

  setMode(mode: string) {
    if (!['profile', 'equipment', 'formation'].includes(mode)) return false;
    this.mode = mode;
    this.guideEvent(mode);
    this.emit('state', { reason: 'mode', mode });
    return true;
  }

  upgrade(id = this.selected, count = 1) {
    if (!G.ownsCompanion(this.state, id)) return this.fail('尚未结识这位伙伴');
    const quote = G.upgradeQuote(this.state.levels[id], count, G.levelCap(this.state, id));
    if (!quote.levels) return this.fail('已经达到当前等级上限');
    if (this.state.gold < quote.cost) return this.fail('本次升级需要 ' + quote.cost + ' 鱼币');
    const before = G.catStats(this.state, id), beforePower = G.power(this.state);
    const done = G.upgrade(this.state, id, count, this.now());
    if (!done) return false;
    this.battle?.syncStats(this.state);
    this.guideEvent('upgrade');
    const after = G.catStats(this.state, id);
    this.changed('upgrade', { id, done, before, after, beforePower, afterPower: G.power(this.state) });
    if (after.skillRank > before.skillRank) this.toast(G.CATS.find(c => c.id === id).name + '的绝活自动解锁至 Lv.' + (after.skillRank + 1));
    return done;
  }

  inherit(from: string, to = this.selected) {
    const quote = G.inheritanceQuote(this.state, from, to);
    if (quote.valid && !quote.ready) return this.fail('先将' + G.CATS.find(c => c.id === quote.blockedId).name + '的等级上限提升到 Lv.' + quote.requiredLevel);
    if (!G.inheritTraining(this.state, from, to)) return this.fail('没有可继承的更高培养等级');
    this.battle?.syncStats(this.state, { preserveHealthRatio: true });
    this.changed('inherit', { from, to });
    return true;
  }

  private restartWithCrew() {
    if (!this.battle) return;
    const request = {
      stage: this.battle.stage,
      arenaTier: this.battle.arenaTier || 0,
      weeklyTier: this.battle.weekly?.tier || 0,
      activity: this.battle.activity?.request || null,
    };
    if (this.report || this.guideActive || !this.state.onboarded) {
      try { this.battle = new G.Battle(this.state, { ...request, now: this.now() }); }
      catch { this.battle = new G.Battle(this.state, { now: this.now() }); }
      this.battleRevision++;
      this.running = false;
      this.events.length = 0;
      this.emit('battle-start', { battle: this.battle, revision: this.battleRevision });
    } else this.startBattle(request);
  }

  setParty(slot: number, id: string) {
    const inheritance = G.inheritanceFor(this.state, slot, id);
    if (!G.setParty(this.state, slot, id)) return this.fail('这位伙伴尚不能上阵');
    this.changed('formation', { slot, id });
    this.restartWithCrew();
    if (inheritance && !inheritance.ready) this.toast('已换上伙伴，培养仍保留在原伙伴；升星后可继承。');
    return true;
  }

  removeParty(id: string) {
    if (!G.removeParty(this.state, id)) return this.fail('至少保留一位出战伙伴');
    this.changed('formation', { id });
    this.restartWithCrew();
    return true;
  }

  applyTeam(id: string) {
    if (!applyPlan(this.state, id)) return false;
    this.changed('team-plan', { id });
    this.restartWithCrew();
    return true;
  }
  applyTeamPlan(id: string) { return this.applyTeam(id); }

  private equipmentChanged(reason: string, uid: string) {
    this.battle?.syncStats(this.state, { refreshEquipment: true, preserveHealthRatio: true });
    this.changed(reason, { uid });
  }

  equip(uid: string, id = this.selected) {
    if (!Gear.equipGear(this.state, uid, id, G.unlocked(this.state).map(c => c.id))) return false;
    this.equipmentChanged('equip', uid);
    this.guideEvent('equipped');
    return true;
  }

  unequip(id = this.selected, slot: string) {
    const uid = this.state.inventory.equipped[id]?.[slot];
    if (!Gear.unequipGear(this.state, id, slot)) return false;
    this.equipmentChanged('unequip', uid);
    return true;
  }

  enhance(uid: string) {
    if (!Gear.enhanceGear(this.state, uid)) return this.fail('鱼币或修补零件不足，或装备已强化到上限');
    this.equipmentChanged('enhance', uid);
    return true;
  }

  reforge(uid: string, index: number) {
    if (!Gear.reforgeGear(this.state, uid, index)) return this.fail('本次洗炼需要 2 份打磨砂');
    this.equipmentChanged('reforge', uid);
    return true;
  }

  dismantle(uid: string) {
    const reward = Gear.dismantleGear(this.state, uid);
    if (!reward) return this.fail('已锁定或正在穿戴的装备不能分解');
    this.changed('dismantle', { uid, reward });
    return reward;
  }

  lockGear(uid: string) {
    const item = this.state.inventory.items.find(e => e.id === uid);
    if (!item) return false;
    item.locked = !item.locked;
    this.changed('gear-lock', { uid, locked: item.locked });
    return true;
  }

  recruit(id: string) {
    if (!G.recruitCompanion(this.state, id)) return this.fail('结识伙伴需要 20 份对应信物');
    this.changed('recruit', { id });
    if (this.state.party.includes(id)) this.restartWithCrew();
    return true;
  }

  ascend(id = this.selected) {
    if (!G.ownsCompanion(this.state, id)) return this.fail('尚未结识这位伙伴');
    const before = G.catStats(this.state, id), beforePower = G.power(this.state);
    const cap = G.levelCap(this.state, id);
    if (!G.ascendCompanion(this.state, id)) return this.fail('升星所需信物或训练笔记不足，或已达到最高品质');
    this.state.growthRebalancePending = false;
    this.growthRunFrom = this.state.highest;
    this.battle?.syncStats(this.state, { preserveHealthRatio: true });
    this.changed('ascend', { id, cap, nextCap: G.levelCap(this.state, id), before, after: G.catStats(this.state, id), beforePower, afterPower: G.power(this.state) });
    return true;
  }

  // Retained for old callbacks and saves. Skill ranks now follow level only.
  breakthrough() { return this.fail('绝活随角色等级自动解锁，无需研习'); }

  claimIdle() {
    G.accrueIdle(this.state, this.now());
    const supplies = this.state.idleSupplies || 0;
    const gold = G.claimIdle(this.state, this.now());
    this.changed('claim-idle', { gold, supplies });
    return { gold, supplies };
  }

  claimQuests(id?: string) {
    let gold = 0;
    if (id) {
      const quest = G.QUESTS.find(q => q.id === id);
      if (!quest || this.state.claimed.includes(id) || G.questValue(this.state, quest) < quest.goal) return false;
      this.state.claimed.push(id);
      this.state.gold += quest.reward;
      gold = quest.reward;
    } else gold = G.claimQuests(this.state);
    if (gold) this.changed('quest-reward', { gold });
    return gold;
  }

  claimDaily(id: string) {
    const reward = Campaign.claimDaily(this.state, id, this.now());
    if (reward) this.changed('daily-reward', { reward });
    return reward;
  }

  claimDailyChest() {
    const reward = Campaign.claimDailyChest(this.state, this.now());
    if (reward) this.changed('daily-chest', { reward });
    return reward;
  }

  claimJourney(id: string) {
    const reward = Campaign.claimJourney(this.state, id);
    if (reward) this.changed('journey-reward', { reward });
    return reward;
  }

  upgradeStall(id: string) {
    if (!G.upgradeStall(this.state, id, this.now())) return this.fail('经营物资不足，或设施已升到最高等级');
    this.changed('stall-upgrade', { id });
    return true;
  }

  startActivity(request: any) {
    const info = activityInfo(this.state, request, this.now());
    if (!info.open) return this.fail(activityLockReason(this.state, info) || '当前委托尚未开放');
    if (this.state.guideStep === 19) this.guideEvent('depart');
    this.changeTab('battle');
    return this.startBattle({ activity: info.request });
  }

  startArena(tier: number) {
    if (!G.arenaOpen(this.state, tier)) return this.fail('擂台尚未解锁');
    this.changeTab('battle');
    return this.startBattle({ arenaTier: tier });
  }

  startWeekly(tier: number) {
    if (!Campaign.weeklyInfo(this.state, tier, this.now()).open) return this.fail('每周挑战尚未解锁');
    this.changeTab('battle');
    return this.startBattle({ weeklyTier: tier });
  }

  toggleSound() { this.state.sound = !this.state.sound; this.changed('sound'); return this.state.sound; }
  toggleMusic() { this.state.music = !this.state.music; this.changed('music'); return this.state.music; }
  toggleSpeed() { this.state.speed = this.state.speed === 1 ? 2 : 1; this.changed('speed'); return this.state.speed; }

  beginIntro() {
    if (this.state.onboarded) return false;
    this.state.onboarded = true;
    this.guideEvent('start');
    this.changed('intro-complete');
    return true;
  }
  startIntro() { return this.beginIntro(); }

  guideEvent(event: string) {
    // Settlement overlays own their input until explicitly dismissed.
    if (this.report) return false;
    const previous = this.state.guideStep;
    const next = nextGuide(previous, event, this.state.runCleared);
    if (next === previous) return false;
    this.state.guideStep = next;
    if (GUIDE[next]) { this.running = false; this.nextDelay = 0; }
    if (next === GUIDE_CAN && this.battle) this.battle.canCd = 0;
    if (next === 3) { this.selected = 'orange'; this.mode = 'profile'; }
    if (previous === 19) this.state.gearGuide = 2;
    if (previous === 23) {
      this.state.gearGuide = 4;
      this.tab = 'battle';
      this.startBattle();
    } else if (previous < 14 && next === GUIDE_DONE && (!this.running || this.battle?.result === 'win')) this.startBattle();
    this.changed('guide', { previous, step: next });
    this.emit('guide', { previous, step: next, guide: this.guide });
    if (previous < 14 && next === GUIDE_DONE) {
      this.navigation = { panel: 'quests' };
      this.emit('navigation', this.navigation);
    }
    return true;
  }

  restoreGuide() {
    if (this.report) return false;
    if (this.state.guideStep >= 14) return this.restoreGearGuide();
    const plan = guideResume(this.state.guideStep);
    this.state.guideStep = plan.step;
    this.selected = 'orange';
    this.mode = plan.mode;
    this.tab = plan.tab;
    this.running = false;
    this.nextDelay = 0;
    this.emit('guide', { step: this.state.guideStep, guide: this.guide });
    return true;
  }

  maybeGearGuide(wearing = false) {
    if (!this.state.onboarded || this.state.guideStep !== GUIDE_DONE || this.state.highest < 3 || this.report) return false;
    if (this.state.guidance?.equipmentWorn && this.state.activities.cleared.salvage) { this.state.gearGuide = 4; return false; }
    const loose = this.state.inventory.items.some(e => !Gear.gearOwner(this.state, e.id));
    if (wearing && this.state.gearGuide === 2 && loose) { this.state.gearGuide = 3; this.state.guideStep = 20; }
    else if (!this.state.gearGuide) { this.state.gearGuide = 1; this.state.guideStep = 14; }
    else if (this.state.gearGuide === 2 && loose) { this.state.gearGuide = 3; this.state.guideStep = 20; }
    else return false;
    if (this.state.guideStep === 20 && !this.state.gearGuideItem) this.state.gearGuideItem = this.newestLooseGear();
    this.restoreGearGuide();
    this.changed('gear-guide');
    return true;
  }

  private newestLooseGear() {
    return this.state.inventory.items.filter(e => !Gear.gearOwner(this.state, e.id)).sort((a, b) => +b.id.slice(1) - +a.id.slice(1))[0]?.id || '';
  }

  private restoreGearGuide() {
    this.running = false;
    this.nextDelay = 0;
    const step = this.state.guideStep;
    if (step >= 20) {
      if (!this.state.gearGuideItem) this.state.gearGuideItem = this.newestLooseGear();
      this.state.guideStep = step === 22 ? 21 : step;
      this.selected = 'orange';
      this.mode = 'equipment';
      this.tab = 'cats';
    } else if (step <= 15) this.tab = 'battle';
    else {
      this.tab = 'map';
      this.navigation = step === 17 ? { panel: 'arena' } : step >= 18 ? { panel: 'street', route: { group: 'equipment', id: 'salvage', tier: 1 }, detail: step === 19 } : null;
      if (this.navigation) this.emit('navigation', this.navigation);
    }
    this.emit('guide', { step: this.state.guideStep, guide: this.guide });
    return true;
  }

  skipGuide() {
    if (this.report) return false;
    if (this.state.guideStep >= 14) this.state.gearGuide = 4;
    this.state.onboarded = true;
    this.state.guideStep = GUIDE_DONE;
    this.tab = 'battle';
    this.startBattle();
    this.changed('guide-skip');
    this.emit('guide', { step: GUIDE_DONE, guide: null });
    return true;
  }

  async watchTokenReward(id: string) {
    const owner = this.state, report = this.report;
    if (this.rewardPending || !report || !G.CATS.some(c => c.id === id) || !tokenRewardReady(owner, report.tokenTicket)) return false;
    if (!this.services.reward) return this.fail('当前环境未接入激励视频，随机信物已正常入包。');
    this.rewardPending = true;
    this.emit('reward', { pending: true, placement: 'tokens' });
    const ticket = report.tokenTicket;
    try {
      const result = await this.services.reward('tokens');
      const completed = result === true || result?.completed === true;
      const granted = this.state === owner && grantChosenTokens(owner, ticket, id, completed);
      if (granted) this.changed('token-reward', { id, count: 5 });
      else this.toast(completed ? '这份自选奖励已经领取' : '未完整看完视频，不发放自选奖励。');
      return granted;
    } catch {
      return this.fail('广告暂时不可用，本次未发放自选奖励。');
    } finally {
      this.rewardPending = false;
      this.emit('reward', { pending: false, placement: 'tokens' });
    }
  }
  watchChosenTokens(id: string) { return this.watchTokenReward(id); }
  claimChosenTokens(id: string) { return this.watchTokenReward(id); }

  async watchBusinessBoost() {
    if (this.rewardPending) return false;
    if (!this.services.reward) return this.fail('当前环境未接入激励视频');
    const owner = this.state;
    const quote = businessBoostQuote(owner, this.now(), G.idleRate(owner));
    if (!quote.available) return this.fail(quote.wait ? '请等待 ' + quote.wait + ' 秒后再试' : '今日经营助力次数已用完');
    this.rewardPending = true;
    this.emit('reward', { pending: true, placement: 'business' });
    try {
      const result = await this.services.reward('business');
      const completed = result === true || result?.completed === true;
      const granted = this.state === owner && grantBusinessBoost(owner, quote, completed, this.now());
      if (granted) this.changed('business-reward', { gold: quote.gold, supplies: quote.supplies });
      else this.toast('未完整观看或本次奖励已失效');
      return granted;
    } catch { return this.fail('广告暂时不可用，本次未发放奖励。'); }
    finally { this.rewardPending = false; this.emit('reward', { pending: false, placement: 'business' }); }
  }

  exportSave() {
    G.accrueIdle(this.state, this.now());
    this.save();
    return G.encodeSave(this.state);
  }

  inspectSave(encoded: string) { return G.decodeSave(encoded, this.now()); }

  importSave(encoded: string) {
    if (this.rewardPending) return this.fail('请等待本次广告结束');
    let incoming;
    try { incoming = this.inspectSave(encoded); }
    catch (error) { return this.fail(error.message || '存档无法读取'); }
    this.replaceState(incoming);
    this.changed('import');
    return true;
  }

  reset() {
    if (this.rewardPending) return this.fail('请等待本次广告结束');
    this.services.clear?.();
    this.replaceState(G.initialState(this.now()));
    this.changed('reset');
    return true;
  }

  private replaceState(state: any) {
    this.state = state;
    G.accrueIdle(state, this.now());
    this.selected = 'orange';
    this.mode = 'profile';
    this.tab = 'battle';
    this.paused = false;
    this.running = false;
    this.nextDelay = 0;
    this.entranceRemaining = 0;
    this.events.length = 0;
    this.endElapsed = 0;
    this.navigation = null;
    this.growthRunFrom = null;
    this.battle = new G.Battle(state, { now: this.now() });
    this.battleRevision++;
    if (state.onboarded && !this.report) {
      if (this.guideActive) this.restoreGuide();
      else if (!this.maybeGearGuide()) this.running = state.runCleared < G.MAX_STAGE;
    }
    this.emit('battle-start', { battle: this.battle, revision: this.battleRevision });
  }
}
