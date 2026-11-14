import {STREET_GROUPS,streetChoices,streetSelection,activityDrops} from '../../street-ui.mjs';
import {activityInfo,activityReward,rewardText} from '../../activities.mjs';
import {ActivityReturn} from '../../activity-navigation.mjs';
import {GEAR_SLOTS,GEAR_SETS,RUNES,QUALITIES,ATTRS,BAG_CAP,gearName,gearStory,gearOwner,gearValues,gearBonuses,attrText,materialRows,equipGear,unequipGear,enhanceQuote,enhanceGear,reforgeGear,dismantleGear,craftQuote,craftGear} from '../../equipment.mjs';
import {DAILY_TASKS,JOURNEY,refreshCampaign,dailyReward,claimDaily,claimDailyChest,claimJourney,weeklyInfo} from '../../campaign.mjs';
import {talentCards} from '../../talents.mjs';
import {businessBoostQuote,grantBusinessBoost} from '../../rewarded-economy.mjs';
import {DISTRICT_PLACES,paintDistrictAmbient,paintDistrictObjects} from '../../district.mjs';
import * as G from "../../core.mjs";
import { crewSkill } from "../../crew-profile.mjs";
import { formationPositions, BattleCues } from "../../battle-cues.mjs";
import {
  battleRate,
  poseFor,
  travelOffset,
  MotionOffsets,
} from "../../motion.mjs";
import { HealthTrails, rescueView, bossView } from "../../battle-ui.mjs";
import {
  CombatEffects,
  GuardEffects,
  StatusEffects,
  paintVFX,
} from "../../painted-fx.mjs";
import { C, fmt, box, round, text, rich, bar, ellipse } from "./draw.mjs";
import { NativeArt } from "./art.mjs";
const cat = (id) => G.CATS.find((c) => c.id === id),
  clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const palettes = {
  orange: "#aa875d",
  ink: "#738a99",
  milk: "#a78d91",
  spark: "#a56f5c",
  mint: "#648c7b",
  bolt: "#7e8b8d",
  pudding: "#9f8865",
  star: "#8d7d9b",
};
export class NativeGame {
  constructor(canvas, state, env, images) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.state = state;
    this.env = env;
    this.art = new NativeArt(env, images);
    this.time = 0;
    this.tab = "battle";
    this.mode = "profile";
    this.selected = "orange";
    this.scroll = 0;
    this.rail = 0;
    this.scrollMax = 0;
    this.buttons = [];
    this.pointer = null;
    this.modal = null;
    this.queue = [];
    this.notice = null;
    this.running = false;
    this.nextDelay = 0;
    this.endTime = 0;
    this.hitTexts = [];
    this.activityReturn = new ActivityReturn();
    this.farming = false;
    this.offsets = new MotionOffsets();
    this.cues = new BattleCues();
    this.fx = new CombatEffects(null);
    this.guards = new GuardEffects();
    this.statuses = new StatusEffects();
    this.trails = new HealthTrails();
    this.resize(env.width, env.height);
    this.start(false);
    if (!state.onboarded) this.modal = { type: "intro" };
    else if (state.pending) this.modal = { type: "loot" };
  }
  resize(w, h) {
    this.width = w;
    this.height = h;
    this.scale = w / 390;
    this.H = h / this.scale;
    this.dpr = Math.min(2, this.env.pixelRatio || 1);
    this.canvas.width = Math.round(w * this.dpr);
    this.canvas.height = Math.round(h * this.dpr);
    this.safeTop = (this.env.safeTop || 0) / this.scale;
    this.navY =
      this.H - Math.max(62, 62 + (this.env.safeBottom || 0) / this.scale);
    this.top = this.safeTop + 78;
    this.scroll = clamp(this.scroll, 0, this.scrollMax);
  }
  save() {
    this.env.save(this.state);
  }
  toast(message) {
    this.notice = { text: message, until: this.time + 2.8 };
  }
  change(tab) {
    if(tab!=="battle")this.activityReturn.cancel();
    this.districtRelease=null;
    this.tab = tab;
    if(tab==='map')this.mapPlace=null;
    this.scroll = 0;
    this.pointer = null;
  }
  start(run = true, { stage = this.state.stage, farm = false, arenaTier = 0, weeklyTier = 0, activity = null } = {}) {
    this.activityReturn.cancel();
    if (this.state.pending) {
      this.battle = new G.Battle(this.state, { stage });
      this.running = false;
      this.modal = { type: "loot" };
      return;
    }
    if (this.state.runCleared === G.MAX_STAGE && !farm && !arenaTier && !weeklyTier && !activity) {
      this.battle = this.battle || new G.Battle(this.state);
      this.running = false;
      this.modal = { type: "victory" };
      return;
    }
    this.battle = new G.Battle(this.state, { stage, farm, arenaTier, weeklyTier, activity });
    this.running = run;
    this.farming = farm;
    this.endTime = 0;
    this.nextDelay = 0;
    this.hitTexts = [];
    this.cues.clear();
    this.fx.clear();
    this.offsets.clear();
    this.guards.clear();
    this.trails.clear();
    this.art.resetBattle();
  }
  pause() {
    if (this.state.pending) {
      this.modal = { type: "loot" };
      return;
    }
    if (this.battle?.result) {
      this.start(true, {
        stage: this.farming ? this.battle.stage : this.state.stage,
        farm: this.farming,
        arenaTier: this.battle?.arenaTier||0,
        weeklyTier: this.battle?.weekly?.tier||0,
        activity: this.battle?.activity?.request||null,
      });
      return;
    }
    this.running = !this.running;
  }
  update(dt) {
    this.time += dt;
    if(this.tab==='battle'&&!this.modal){const route=this.activityReturn.update(this.time);if(route){this.openStreet(route.group,route.id);this.streetView.tier=route.tier;}}
    if(this.districtRelease&&this.time-this.districtRelease.at>=.27){if(this.tab==='map'&&!this.mapPlace){this.mapPlace=this.districtRelease.id;this.scroll=0;}this.districtRelease=null;}
    if (this.pointer?.dragging) {
      const y = this.pointer.y,
        edge = 34,
        speed = y < this.top + edge ? -300 : y > this.navY - edge ? 300 : 0;
      this.scroll = clamp(this.scroll + speed * dt, 0, this.scrollMax);
    }
    if (this.tab !== "battle" || this.modal || !this.running || !this.battle)
      return;
    const b = this.battle;
    if (b.result) {
      this.endTime += dt;
      if (b.result === "win" && b.mode==="patrol") {
        this.nextDelay -= dt;
        if (this.nextDelay <= 0)
          this.start(true, {
            stage: this.farming ? b.stage : this.state.stage,
            farm: this.farming,
        arenaTier: this.battle?.arenaTier||0,
        weeklyTier: this.battle?.weekly?.tier||0,
        activity: this.battle?.activity?.request||null,
          });
      }
      return;
    }
    let left = Math.min(0.5, dt * battleRate(this.state.speed));
    while (left > 0 && !b.result) {
      const step = Math.min(0.05, left);
      left -= step;
      this.consume(b.tick(step));
    }
    if (b.result) {
      const result = G.settleBattle(this.state, b);
      if (!result) return;
      this.save();
      this.nextDelay = 2.2;
      b.reward=result;
      if(result.gearLoot?.item)this.toast(gearName(result.gearLoot.item)+" 已放入背包");else if(result.gearLoot?.scrap)this.toast("背包已满，掉落折算为零件 +"+result.gearLoot.scrap);
      if(result.activity){this.running=false;this.activityReturn.finish(b.activity,this.time);this.toast(result.win?rewardText(result):"挑战结束");return;}
      if(result.arena){this.running=false;this.toast(result.win?(result.weekly?"徽章 +"+result.badges+" · 物资 +"+result.supplies+" · 鱼币 +"+result.gold:"擂台获胜，突破徽章 +"+result.badges):"挑战失败，没有损失");return;}
      if (result.win) {
        this.env.sound?.("reward");
        if (result.unlocked.length)
          this.queue.push({ type: "recruit", id: result.unlocked[0].id });
        if (this.state.pending) this.queue.push({ type: "loot" });
        if (result.complete) this.queue.push({ type: "victory" });
        if (this.queue.length) this.modal = this.queue.shift();
      } else this.running = false;
    }
  }
  consume(events) {
    if (!events.length) return;
    const b = this.battle,
      positions = this.centers || formationPositions(b);
    this.cues.consume(events, b, positions);
    for (const e of events) {
      if (
        ["hit", "heal", "burn"].includes(e.type) &&
        e.value > 0
      ) {
        this.hitTexts.push({ ...e, born: b.time });
        if (this.hitTexts.length > 40) this.hitTexts.shift();
      }
      if (e.type === "hit") this.env.sound?.("hit");
    }
  }
  can() {
    if (
      this.tab === "battle" &&
      this.running &&
      !this.modal &&
      this.battle?.openCan()
    ) {
      this.state.rescueSeen = true;
      this.consume(this.battle.events.splice(0));
      this.env.sound?.("tap");
      this.save();
    }
  }
  train(id, count = 10) {
    const quote = G.upgradeQuote(this.state.levels[id], count, G.levelCap(this.state,id));
    if (
      !quote.levels ||
      this.state.gold < quote.cost ||
      !G.ownsCompanion(this.state,id)
    )
      return;
    const n = G.upgrade(this.state, id, count);
    if (!n) return;
    this.battle?.syncStats(this.state);
    this.save();
    this.env.sound?.("reward");
    this.toast(
      cat(id).name + " Lv." + this.state.levels[id] + " · 升 " + n + " 级",
    );
  }
  equip(id, slot) {
    if (slot > this.state.party.length || this.state.party[slot] === id) return;
    const inheritance = G.inheritanceFor(this.state, slot, id);
    if (!G.setParty(this.state, slot, id)) return;
    this.save();
    const run = this.running,
      stage = this.battle?.stage;
    if (!this.battle?.result) this.start(run, { stage, farm: this.farming,arenaTier:this.battle?.arenaTier||0,weeklyTier:this.battle?.weekly?.tier||0,activity:this.battle?.activity?.request||null });
    this.toast(
      inheritance
        ? cat(id).name + "继承 Lv." + inheritance.fromLevel
        : "阵容已调整",
    );
  }
  close() {
    if (this.modal?.type === "intro") return;
    this.modal = this.queue.shift() || null;
  }
  chooseRelic(id) {
    if (!G.chooseRelic(this.state, id)) return;
    this.save();
    this.modal = this.queue.shift() || null;
    this.nextDelay = 1;
    this.toast("装备已生效");
  }
  exportSave() {
    this.env.copy?.(G.encodeSave(this.state));
  }
  async importSave() {
    const value = await this.env.input?.(
      "导入存档",
      "粘贴网页设置里导出的完整存档",
    );
    if (!value) return;
    let next;
    try {
      next = G.decodeSave(value);
    } catch (e) {
      this.toast(e.message);
      return;
    }
    if (
      !(await this.env.confirm(
        "替换当前存档",
        "将恢复为导入的关卡、队员与资源，覆盖当前微信进度。",
      ))
    )
      return;
    this.state = next;
    G.accrueIdle(this.state);
    this.save();
    this.modal = null;
    this.tab = "battle";
    this.start(false);
    this.toast("存档已导入");
  }
  async reset() {
    if (!(await this.env.confirm("重新开始", "这会替换此设备上的游戏进度。")))
      return;
    this.state = G.initialState();
    this.save();
    this.modal = { type: "intro" };
    this.start(false);
    this.tab = "battle";
  }
  button(
    id,
    label,
    x,
    y,
    w,
    h,
    fn,
    {
      fill = C.panel,
      stroke = C.rim,
      color = C.ink,
      size = 12,
      disabled = false,
      catId = null,
      slot = null,
      rail = false,
      draw = true,
    } = {},
  ) {
    const hit = {
      x: Math.max(x, this.clip?.x ?? 0),
      y: Math.max(y, this.clip?.y ?? 0),
      r: Math.min(x + w, this.clip ? this.clip.x + this.clip.w : 390),
      b: Math.min(y + h, this.clip ? this.clip.y + this.clip.h : this.H),
    };
    if (!disabled && hit.r > hit.x && hit.b > hit.y)
      this.buttons.push({
        id,
        label,
        x: hit.x,
        y: hit.y,
        w: hit.r - hit.x,
        h: hit.b - hit.y,
        fn,
        catId,
        slot,
        rail,
      });
    if (draw) {
      box(this.ctx, x, y, w, h, disabled ? "#516863" : fill, stroke, 9);
      if (label)
        text(
          this.ctx,
          label,
          x + w / 2,
          y + h / 2,
          size,
          disabled ? "#acbcb1" : color,
          750,
          "center",
        );
    }
  }
  hit(p) {
    return [...this.buttons]
      .reverse()
      .find(
        (b) => p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h,
      );
  }
  down(x, y) {
    const p = { x: x / this.scale, y: y / this.scale };
    this.pointer = {
      ...p,
      startX: p.x,
      startY: p.y,
      scroll: this.scroll,
      rail: this.rail,
      button: this.hit(p),
      moved: false,
      dragging: false,
    };
  }
  move(x, y) {
    const d = this.pointer;
    if (!d) return;
    d.x = x / this.scale;
    d.y = y / this.scale;
    const dx = d.x - d.startX,
      dy = d.y - d.startY;
    if (Math.hypot(dx, dy) < 8 && !d.moved) return;
    d.moved = true;
    if (
      d.button?.catId &&
      this.mode === "formation" &&
      this.tab === "cats" &&
      !this.modal
    ) {
      d.dragging = true;
      return;
    }
    if (d.button?.rail && Math.abs(dx) > Math.abs(dy)) {
      this.rail = clamp(d.rail - dx, 0, 8 * 72 - 362);
      return;
    }
    if (
      this.tab !== "battle" &&
      !this.modal &&
      d.startY >= this.top &&
      d.startY < this.navY
    )
      this.scroll = clamp(d.scroll - dy, 0, this.scrollMax);
  }
  up(x, y) {
    const d = this.pointer;
    if (!d) return;
    if (x !== undefined) {
      d.x = x / this.scale;
      d.y = y / this.scale;
    }
    this.pointer = null;
    if (d.dragging) {
      const target = this.hit(d);
      if (target?.slot !== null && target?.slot !== undefined)
        this.equip(d.button.catId, target.slot);
      return;
    }
    if (!d.moved && d.button && this.hit(d)?.id === d.button.id) {
      this.env.sound?.("tap");
      d.button.fn();
    }
  }
  cancel() {
    this.pointer = null;
  }
  render() {
    const c = this.ctx;
    c.setTransform(this.dpr * this.scale, 0, 0, this.dpr * this.scale, 0, 0);
    c.globalAlpha = 1;
    c.clearRect(0, 0, 390, this.H);
    c.fillStyle = C.bg;
    c.fillRect(0, 0, 390, this.H);
    this.buttons = [];
    this.clip = null;
    if (this.tab === "battle") this.drawBattle();
    else {
      c.save();
      c.beginPath();
      c.rect(0, this.top, 390, this.navY - this.top);
      c.clip();
      this.clip = { x: 0, y: this.top, w: 390, h: this.navY - this.top };
      const y = this.top + 14 - this.scroll;
      const bottom =
        this.tab === "cats"
          ? this.drawCrew(y)
          : this.tab === "relics"
            ? this.drawRelics(y)
            : this.drawMap(y);
      this.scrollMax = Math.max(0, bottom + this.scroll - this.navY + 20);
      c.restore();
      this.clip = null;
    }
    this.drawHeader();
    this.drawNav();
    if (this.modal) this.drawModal();
    if (this.pointer?.dragging) {
      const d = this.pointer;
      box(c, d.x - 42, d.y - 92, 84, 97, "#597b79ee", C.gold, 14);
      this.art.actor(
        c,
        d.button.catId,
        "drag-" + d.button.catId,
        d.x,
        d.y - 20,
        64,
        this.time,
      );
      text(c, cat(d.button.catId).name, d.x, d.y - 7, 11, C.ink, 750, "center");
    }
    if (this.notice && this.notice.until > this.time) {
      const w = Math.min(360, c.measureText(this.notice.text).width + 35);
      box(c, 195 - w / 2, this.navY - 50, w, 36, "#dfc78f", null, 9);
      text(c, this.notice.text, 195, this.navY - 32, 11, C.dark, 600, "center");
    }
  }
  drawHeader() {
    const c = this.ctx,
      y = this.safeTop;
    box(c, 0, 0, 390, this.top, C.bg, null, 0);
    this.art.item(c, 13, 25, y + 19, 24);
    text(c, "罐头远征队", 45, y + 19, 19, C.ink, 850);
    box(c, 12, y + 42, 105, 25, "#8d7653", "#cbb685", 7);
    this.art.item(c, 13, 27, y + 54, 19);
    text(c, fmt(this.state.gold), 41, y + 54, 14, C.ink, 800);
    text(c, "鱼币", 91, y + 55, 9);
    box(c, 124, y + 42, 84, 25, "#726889", "#aaa0c4", 7);
    text(
      c,
      "徽章 " + fmt(this.state.badges),
      166,
      y + 55,
      11,
      C.ink,
      650,
      "center",
    );
    this.button(
      "quests",
      "奖励",
      280,
      y + 42,
      43,
      26,
      () => (this.modal = { type: "quests" }),
      { size: 10 },
    );
    this.button(
      "settings",
      "设置",
      330,
      y + 42,
      46,
      26,
      () => (this.modal = { type: "settings" }),
      { size: 10 },
    );
  }
  drawNav() {
    const c = this.ctx;
    box(c, 0, this.navY, 390, this.H - this.navY, "#284650", "#8ca59d", 0);
    ["battle", "cats", "relics", "map"].forEach((id, i) => {
      const x = 10 + i * 95;
      this.button(
        "tab-" + id,
        "",
        x,
        this.navY + 5,
        86,
        49,
        () => this.change(id),
        {
          fill: this.tab === id ? "#5b7765" : "#284650",
          stroke: this.tab === id ? "#b4c4a3" : null,
        },
      );
      this.art.item(c, [12, 13, 14, 15][i], x + 43, this.navY + 21, 28);
      text(
        c,
        ["出战", "伙伴", "背包", "街区"][i],
        x + 43,
        this.navY + 44,
        11,
        this.tab === id ? "#ffe5ac" : C.muted,
        700,
        "center",
      );
    });
  }
  drawBattle() {
    const c = this.ctx,
      b = this.battle;
    if (!b) {
      text(c, "远征准备中", 195, this.top + 100, 18, C.ink, 750, "center");
      return;
    }
    const stage = b.stage,
      ch = G.chapterOf(stage),
      bv = bossView(b),
      bossH = bv ? 39 : 0,
      ay = this.top + 43 + bossH,
      ah = Math.max(180, this.navY - ay - 101),
      w = 390,
      t = b.time + (b.result ? this.endTime : 0);
    text(c, b.activity?b.activity.name:b.weekly?"本周 · "+b.weekly.name:b.mode==='arena'?"擂台 · "+b.arenaRule.name:ch.name, 14, this.top + 16, 21, C.ink, 800);
    this.button(
      "stage",
      b.activity?"难度 "+b.activity.tier+" ›":b.mode==='arena'?"第 "+b.arenaTier+" 擂 ›":"第 " + stage + " 关  ›",
      284,
      this.top + 2,
      92,
      29,
      () => {
        if(b.activity){const q=b.activity.request;this.openStreet(['hunt','hard','recruit'].includes(q.kind)?q.kind:'materials',q.id||q.kind);this.streetView.tier=q.tier;}else if(b.mode==='arena'){this.change('map');this.mapPlace='arena';}else this.modal = { type: "chapter", index: Math.floor((stage - 1) / 20) };
      },
    );
    for (let i = 0; i < 20; i++)
      box(
        c,
        14 + i * 18.3,
        this.top + 34,
        14,
        3,
        i < ((stage - 1) % 20) + 1 ? C.gold : "#718a86",
        null,
        1,
      );
    if (bv) {
      text(c, bv.name, 14, this.top + 53, 11);
      text(
        c,
        bv.charging
          ? "蓄力 " + Math.ceil(bv.seconds) + "秒 · 开罐打断"
          : fmt(bv.hp) + " / " + fmt(bv.maxHp),
        376,
        this.top + 53,
        10,
        bv.charging ? C.gold : C.muted,
        600,
        "right",
      );
      bar(c, 14, this.top + 64, 362, 5, bv.ratio, "#dc987c");
    }
    c.save();
    c.beginPath();
    c.rect(0, ay, w, ah);
    c.clip();
    c.translate(0, ay);
    this.art.scene(c, b.activity?.scene??Math.floor((stage - 1) / 20)%6, 0, 0, w, ah);
    c.fillStyle = "#203a4530";
    c.fillRect(0, 0, w, ah);
    box(c, 12, 10, 100, 23, "#29464bbd", null, 6);
    text(
      c,
      b.activity?"委托 · 难度 "+b.activity.tier:b.mode==='arena'?"突破徽章挑战":this.farming ? "旧关巡逻" : "街区巡逻",
      62,
      22,
      10,
      C.ink,
      650,
      "center",
    );
    box(c, 335, 10, 43, 23, "#29464bbd", null, 6);
    text(c, Math.floor(b.time) + "秒", 356, 22, 10, C.ink, 600, "center");
    const ground = formationPositions(b),
      actors = [...b.heroes, ...b.enemies],
      sizes = {},
      centers = {},
      points = {},
      base = Math.min(70, ah * 0.235, w * 0.17);
    for (const a of actors) {
      const size = base * (a.boss ? 1.27 : a.catId === "pudding" ? 1.22 : 1);
      sizes[a.id] = size;
      const src = ground[a.id],
        tar = ground[a.action?.targetId || b.targetFor(a)?.id],
        offset = this.offsets.value(
          a,
          travelOffset(a, poseFor(a, t), src, tar, w, ah, size, base, t),
          t,
        );
      points[a.id] = {
        x: (src.x * w) / 100 + offset.x,
        y: (src.y * ah) / 100 + offset.y,
        flip: tar ? (tar.x < src.x ? -1 : 1) : a.side === "e" ? -1 : 1,
      };
      centers[a.id] = {
        x: (points[a.id].x / w) * 100,
        y: ((points[a.id].y - size * 0.43) / ah) * 100,
      };
    }
    this.centers = centers;
    this.guards.render(actors, t, centers, sizes, this.fx);
    this.statuses.render(actors, t, centers, sizes, this.fx);
    const particles = this.fx.render(
        this.cues.active(t),
        t,
        w,
        ah,
        centers,
        sizes,
      ),
      atlas = this.art.image("assets/vfx/effects-v0216.webp"),
      can = this.art.image("assets/vfx/can-rescue-v0192.webp");
    paintVFX(
      c,
      atlas,
      particles.filter((p) => p.layer === 0),
      can,
      this.art.image("assets/vfx/shidun-impact-v0211.webp"),
    );
    for (const a of actors.sort((a, b) => points[a.id].y - points[b.id].y)) {
      const p = points[a.id],
        size = sizes[a.id];
      ellipse(c, p.x, p.y - 1, size * 0.29, size * 0.058, "#182c344f");
      this.art.actor(
        c,
        a.catId || (a.boss && a.type === "box" ? "boxBoss" : a.type),
        "battle-" + a.id,
        p.x,
        p.y,
        size,
        t,
        a,
        b.result,
        p.flip,
      );
      if (a.hp > 0) {
        const hy = p.y - size * 0.99;
        bar(
          c,
          p.x - 19,
          hy,
          38,
          4,
          this.trails.value(a.id, a.hp / a.maxHp, t),
          "#d9b283",
        );
        bar(
          c,
          p.x - 19,
          hy,
          38,
          4,
          a.hp / a.maxHp,
          a.side === "p" ? "#a8c69c" : "#dc987c",
        );
        if (a.shield > 0)
          bar(c, p.x - 19, hy - 3, 38, 2, a.shield / a.maxHp, "#b4dfe1");
        if (a.side === "p")
          bar(c, p.x - 19, hy + 6, 38, 2, a.energy / 100, "#e8c17d");
      } else if (a.side === "p") {
        box(c, p.x - 23, p.y + 1, 46, 14, "#314a4bc9", null, 4);
        text(c, "无法战斗", p.x, p.y + 8, 8, C.muted, 650, "center");
      }
    }
    paintVFX(
      c,
      atlas,
      particles.filter((p) => p.layer !== 0),
      can,
      this.art.image("assets/vfx/shidun-impact-v0211.webp"),
    );
    this.hitTexts = this.hitTexts.filter((e) => t - e.born < 0.9);
    for (const e of this.hitTexts) {
      const p = centers[e.to];
      if (!p) continue;
      const u = (t - e.born) / 0.9;
      c.globalAlpha = 1 - Math.max(0, (u - 0.6) / 0.4);
      text(
        c,
        (e.type === "heal" ? "+" : "") + fmt(e.value),
        (p.x * w) / 100,
        (p.y * ah) / 100 - 25 - u * 24,
        e.crit ? 13 : 10,
        e.type === "heal" ? "#dcf2a9" : e.crit ? "#ffe1a3" : "#fff1d6",
        850,
        "center",
      );
    }
    c.globalAlpha = 1;
    if (b.result) {
      box(c, 112, ah * 0.23, 166, 40, "#294850dc", C.gold, 10);
      text(
        c,
        b.result === "win" ? (b.activity?"委托完成":"巡逻成功") : "先整备，再出发",
        195,
        ah * 0.23 + 20,
        18,
        C.ink,
        800,
        "center",
      );
    }
    c.restore();
    const y = ay + ah + 9,
      rv = rescueView(b, this.running);
    this.button(
      "pause",
      b.result === "lose"
        ? "再试一次"
        : b.result === "win"
          ? (b.activity?"再战委托":b.mode==='arena'?"再战本擂":"下一关")
          : this.running
            ? "暂停"
            : "出发",
      10,
      y,
      70,
      55,
      () => this.pause(),
      { size: 12 },
    );
    this.button("can", "", 88, y, 222, 55, () => this.can(), {
      fill: rv.ready ? "#cda970" : "#657a70",
      stroke: rv.ready ? "#efdaa6" : C.rim,
      disabled: !rv.ready,
    });
    this.art.item(c, 5, 113, y + 25, 34);
    text(
      c,
      "开罐啦",
      204,
      y + 20,
      25,
      rv.ready ? "#3d5049" : C.ink,
      850,
      "center",
    );
    text(
      c,
      rv.ready ? "回血20% · 伤敌 · 打断" : rv.status,
      203,
      y + 43,
      10,
      rv.ready ? "#4f5b4d" : C.muted,
      650,
      "center",
    );
    this.button("speed", "×" + this.state.speed, 318, y, 62, 55, () => {
      this.state.speed = this.state.speed === 1 ? 2 : 1;
      this.save();
    });
    this.button(
      "farm",
      (b.activity||b.mode==='arena')?"返回巡逻":this.farming ? "返回闯关" : "去练练",
      12,
      y + 63,
      87,
      25,
      () => {
        if (this.farming||b.mode==='arena'||b.activity) this.start(true);
        else
          this.start(true, {
            farm: true,
            stage: Math.max(1, this.state.runCleared),
          });
      },
      { size: 10, draw: false },
    );
    text(
      c,
      "战力 " + fmt(G.power(this.state)),
      376,
      y + 76,
      11,
      C.muted,
      600,
      "right",
    );
  }
  quick(id, x, y, w) {
    const q = G.upgradeQuote(this.state.levels[id],10,G.levelCap(this.state,id)),
      open = G.ownsCompanion(this.state,id);
    this.button(
      "train-" + id,
      open
        ? q.levels
          ? "＋" + q.levels + "级 · " + fmt(q.cost)
          : "已满级"
        : "未结识",
      x,
      y,
      w,
      27,
      () => this.train(id),
      {
        size: 9,
        fill: "#a98c5a",
        disabled: !open || !q.levels || this.state.gold < q.cost,
        rail: this.mode === "profile",
      },
    );
  }
  drawCrew(y) {
    const c = this.ctx;
    this.button('companion-quests','结识',14,y,362,32,()=>this.openStreet('recruit'),{size:12});y+=44;
    for(const [i,[id,name]]of [['profile','养成'],['equipment','装备'],['formation','阵容']].entries())this.button(id,name,14+i*124,y,114,33,()=>{this.mode=id;if(id==='equipment'&&!G.ownsCompanion(this.state,this.selected))this.selected=G.unlocked(this.state)[0].id;this.bagDetail=null;this.bagCraft=null;this.scroll=0;},{fill:this.mode===id?'#7d8f78':C.panel});y+=45;
    if (this.mode === "formation") return this.drawFormation(y);
    c.save();
    c.beginPath();
    c.rect(14, y, 362, 124);
    c.clip();
    const previous = this.clip;
    this.clip = {
      x: 14,
      y: Math.max(y, this.top),
      w: 362,
      h: Math.max(0, Math.min(y + 124, this.navY) - Math.max(y, this.top)),
    };
    G.CATS.forEach((a, i) => {
      const x = 14 + i * 72 - this.rail,
        open = G.ownsCompanion(this.state,a.id);
      this.button(
        "pick-" + a.id,
        "",
        x,
        y,
        65,
        91,
        () => {
          this.selected = a.id;if(!open)this.mode="profile";this.bagDetail=null;this.bagPage=0;
        },
        {
          fill: this.selected === a.id ? palettes[a.id] : C.panel,
          stroke: this.selected === a.id ? C.gold : C.rim,
          rail: true,
        },
      );
      c.globalAlpha = open ? 1 : 0.48;
      this.art.actor(c, a.id, "rail-" + a.id, x + 32, y + 58, 49, this.time);
      c.globalAlpha = 1;
      text(c, a.name, x + 32, y + 69, 11, C.ink, 800, "center");
      text(
        c,
        open ? "Lv." + this.state.levels[a.id] : "待结识",
        x + 32,
        y + 83,
        9,
        C.muted,
        500,
        "center",
      );
      this.quick(a.id, x, y + 96, 65);
    });
    this.clip = previous;
    c.restore();
    y += 139;
    if(this.mode==="equipment")return this.drawEquipment(y);
    const a = cat(this.selected),
      st = G.catStats(this.state, a.id),
      open = G.ownsCompanion(this.state,a.id),
      level = this.state.levels[a.id],
      skill = crewSkill(a.id, level, st);
    box(c, 14, y, 362, 183, palettes[a.id], "#c8c6ad", 16);
    text(c, a.job, 34, y + 35, 12, C.ink, 650);
    text(c, a.name, 34, y + 70, 35, C.ink, 850);
    text(c, open ? "Lv. " + level : "等待结识", 34, y + 112, 21, C.ink, 800);
    text(
      c,
      open
        ? this.state.party.includes(a.id)
          ? "出战中"
          : "未出战"
        : "伙伴委托结识",
      34,
      y + 146,
      11,
      C.ink,
      650,
    );
    ellipse(c, 272, y + 142, 62, 15, "#d7c5a442");
    this.art.actor(c, a.id, "portrait-" + a.id, 270, y + 165, 137, this.time);
    y += 199;
    text(c, "人物属性", 19, y + 5, 16, C.ink, 850);
    text(
      c,
      "普攻 · " + (st.normalDamageType === "magic" ? "法术" : "物理"),
      371,
      y + 5,
      10,
      C.muted,
      600,
      "right",
    );
    y += 23;
    const stats = [
      ["生命", fmt(st.hp)],
      ["攻击", fmt(st.atk)],
      ["攻速", st.attackSpeed + "次/分"],
      ["暴击", st.crit + "%"],
      ["护甲", st.armor],
      ["魔抗", st.magicResist],
      ["护甲穿透", st.armorPen],
      ["法术穿透", st.magicPen],
    ];
    stats.forEach(([k, v], i) => {
      const x = 14 + (i % 4) * 92,
        sy = y + Math.floor(i / 4) * 57;
      box(c, x, sy, 86, 50, C.panel, null, 8);
      text(c, k, x + 10, sy + 14, 10, C.muted);
      text(c, v, x + 10, sy + 34, 17, C.ink, 800);
    });
    y += 129;
    text(c, "角色技能", 19, y, 16, C.ink, 850);
    text(c, "能量满自动释放", 371, y, 10, C.muted, 600, "right");
    y += 18;
    const activeH =
      rich(c, skill.description, 30, 0, 330, { draw: false }) + 58;
    box(c, 14, y, 362, activeH, C.panel, C.rim, 12);
    text(c, a.skill, 30, y + 22, 16, C.gold, 850);
    rich(c, skill.description, 30, y + 52, 330);
    y += activeH + 10;
    const passiveH = rich(c, skill.passive, 30, 0, 330, { draw: false }) + 52;
    box(c, 14, y, 362, passiveH, "#526c69", null, 12);
    text(
      c,
      open && level >= 5 ? "被动 · 已觉醒" : "被动 · Lv.5 解锁",
      30,
      y + 20,
      12,
      C.green,
      750,
    );
    rich(c, skill.passive, 30, y + 46, 330);
    y += passiveH + 14;
    for(const t of talentCards(a.id,level)){const th=rich(c,t.desc,30,0,330,{draw:false,size:12,line:19})+62;box(c,14,y,362,th,C.panel,C.rim,12);text(c,t.name+' · '+(t.active?'已解锁':'Lv.'+t.level+' 解锁'),30,y+25,15,t.active?C.gold:C.muted,700);rich(c,t.desc,30,y+49,330,{size:12,line:19});y+=th+14;}

    if(open)y=this.drawGrowth(y,a.id);
    if (open) {
      this.button(
        "single-upgrade",
        level >= G.levelCap(this.state,a.id) ? "已满级" : "升1级 · " + fmt(G.upgradeCost(level)),
        14,
        y,
        224,
        40,
        () => this.train(a.id, 1),
        {
          fill: "#b59662",
          color: C.dark,
          disabled: level >= G.levelCap(this.state,a.id) || this.state.gold < G.upgradeCost(level),
        },
      );
      this.button(
        "inherit",
        "培养继承",
        246,
        y,
        130,
        40,
        () => (this.modal = { type: "inherit", id: a.id }),
        {
          disabled: !G.unlocked(this.state).some(
            (d) => this.state.levels[d.id] > level,
          ),
        },
      );
      y += 54;
    } else {
      text(
        c,
        "收集 20 份信物即可结识",
        195,
        y + 15,
        12,
        C.muted,
        600,
        "center",
      );
      y += 40;
      this.button('companion-contract','伙伴委托 · '+(this.state.roster.shards[a.id]||0)+'/20 信物',14,y,362,36,()=>this.openStreet('recruit',a.id),{fill:C.gold,color:C.dark});y+=50;
    }
    return y;
  }
  drawFormation(y) {
    const c = this.ctx;
    box(c, 14, y, 362, 303, "#42615f", "#a4b7a1", 16);
    text(c, "拖动角色到位置上", 30, y + 24, 16, C.ink, 850);
    text(
      c,
      this.state.party.length + " / 5",
      358,
      y + 24,
      11,
      C.muted,
      650,
      "right",
    );
    ellipse(c, 195, y + 187, 159, 94, "#65867a");
    text(c, "后排", 94, y + 53, 10, C.muted, 600, "center");
    text(c, "前排", 278, y + 53, 10, C.muted, 600, "center");
    const slots = [
      [237, 80],
      [237, 183],
      [52, 65],
      [52, 141],
      [52, 217],
    ];
    slots.forEach(([x, dy], i) => {
      const id = this.state.party[i],
        active = i <= this.state.party.length;
      this.button(
        "slot-" + i,
        "",
        x,
        y + dy,
        100,
        68,
        () => {
          if (id) {
            this.selected = id;
            this.mode = "profile";
            this.scroll = 0;
          }
        },
        {
          catId: id,
          slot: i,
          fill: "#385751",
          stroke: this.pointer?.dragging && active ? C.gold : "#809c8a",
          disabled: !active,
        },
      );
      if (id) {
        this.art.actor(c, id, "slot-" + i, x + 50, y + dy + 50, 55, this.time);
        text(c, cat(id).name, x + 50, y + dy + 59, 10, C.ink, 650, "center");
      } else
        text(
          c,
          active ? "拖到这里" : "待开放",
          x + 50,
          y + dy + 36,
          11,
          C.muted,
          600,
          "center",
        );
      text(c, i + 1, x + 10, y + dy + 12, 10, C.muted, 650);
    });
    y += 318;
    text(c, "替换队员自动继承培养", 18, y, 11, C.muted);
    y += 19;
    G.CATS.forEach((a, i) => {
      const x = 14 + (i % 4) * 93,
        sy = y + Math.floor(i / 4) * 141,
        open = G.ownsCompanion(this.state,a.id);
      this.button(
        "bench-" + a.id,
        "",
        x,
        sy,
        83,
        104,
        () => {
          this.selected = a.id;
          this.mode = "profile";
          this.scroll = 0;
        },
        { catId: open ? a.id : null, fill: open ? palettes[a.id] : C.panel },
      );
      c.globalAlpha = open ? 1 : 0.45;
      this.art.actor(c, a.id, "bench-" + a.id, x + 41, sy + 71, 62, this.time);
      c.globalAlpha = 1;
      text(c, a.name, x + 41, sy + 82, 12, C.ink, 750, "center");
      text(
        c,
        open ? "Lv." + this.state.levels[a.id] : "待结识",
        x + 41,
        sy + 96,
        10,
        C.muted,
        500,
        "center",
      );
      this.quick(a.id, x, sy + 110, 83);
    });
    return y + 282;
  }
  bagRows(){return this.state.inventory.items.filter(e=>!gearOwner(this.state,e.id)&&(!this.bagSlot||e.slot===this.bagSlot)&&(!this.bagSet||e.set===this.bagSet)).sort((a,b)=>b.quality-a.quality||b.tier-a.tier||+b.id.slice(1)-+a.id.slice(1));}
  drawEquipment(y){
    const c=this.ctx,s=this.state;this.bagCat=this.selected;this.bagSet='';this.bagPage??=0;
    if(this.bagDetail)return this.drawGearDetail(y);if(this.bagCraft)return this.drawGearCraft(y);
    text(c,cat(this.selected).name,16,y+20,21,C.gold,850);this.button('bag-craft','拼装',296,y,80,30,()=>{this.bagCraft={set:'hunt',slot:'claw'};this.scroll=0;});y+=45;
    box(c,14,y,216,300,C.panel,null,14);this.art.actor(c,this.selected,'equipment-'+this.selected,122,y+235,151,this.time);
    const spots=[[20,14],[166,14],[20,122],[166,122],[93,235]];
    for(const [i,slot]of GEAR_SLOTS.entries()){
      const e=s.inventory.items.find(e=>e.id===s.inventory.equipped[this.selected]?.[slot.id]),[sx,sy]=spots[i],x=sx,gy=y+sy;
      this.button('gear-slot-'+slot.id,'',x,gy,58,58,()=>{this.bagSlot=slot.id;this.bagPage=0;},{fill:this.bagSlot===slot.id?'#617969':C.dark,stroke:e?QUALITIES[e.quality].color:C.rim});
      this.art.item(c,slot.icon,x+29,gy+18,25);text(c,slot.name,x+29,gy+36,9,C.ink,650,'center');text(c,e?(GEAR_SETS.find(z=>z.id===e.set)?.name||'妙招'):'＋',x+29,gy+49,9,C.gold,700,'center');
      if(e)this.button('gear-detail-'+slot.id,'···',x+34,gy-7,25,19,()=>{this.bagDetail=e.id;this.scroll=0;},{size:12});
    }
    text(c,this.bagSlot?GEAR_SLOTS.find(x=>x.id===this.bagSlot).name:'未装备',245,y+15,13,C.ink,750);this.button('bag-show-all','全部',330,y,46,25,()=>{this.bagSlot='';this.bagSet='';this.bagPage=0;},{size:10});
    const rows=this.bagRows();this.bagPage=Math.min(this.bagPage,Math.max(0,Math.ceil(rows.length/3)-1));
    rows.slice(this.bagPage*3,this.bagPage*3+3).forEach((e,i)=>{const gy=y+39+i*82;this.button('gear-item-'+e.id,'',240,gy,136,74,()=>{this.bagDetail=e.id;this.scroll=0;},{stroke:QUALITIES[e.quality].color});text(c,gearName(e),248,gy+19,9,C.ink,700);text(c,e.enhance?'+'+e.enhance:'',248,gy+38,11,C.gold);this.button('gear-equip-now-'+e.id,'装备',306,gy+38,62,26,()=>{if(equipGear(s,e.id,this.selected,G.unlocked(s).map(x=>x.id)))this.bagChanged();},{size:11});});
    if(!rows.length)text(c,'暂无装备',306,y+81,12,C.muted,500,'center');
    if(rows.length>3){this.button('bag-prev','‹',240,y+291,38,27,()=>this.bagPage--,{disabled:this.bagPage===0});text(c,(this.bagPage+1)+' / '+Math.ceil(rows.length/3),308,y+305,11,C.muted,500,'center');this.button('bag-next','›',338,y+291,38,27,()=>this.bagPage++,{disabled:(this.bagPage+1)*3>=rows.length});}
    return y+338;
  }
  drawRelics(y) {
    const c=this.ctx,s=this.state;this.bagTab??='equipment';this.bagPage??=0;this.bagSlot??='';this.bagSet??='';
    if(this.bagCraft)return this.drawGearCraft(y);
    text(c,'背包',16,y+20,24,C.ink,850);text(c,s.inventory.items.filter(e=>!gearOwner(s,e.id)).length,374,y+20,12,C.muted,500,'right');y+=44;
    for(const [i,id]of ['equipment','materials'].entries())this.button('bag-tab-'+id,['装备','材料'][i],14+i*187,y,175,36,()=>{this.bagTab=id;this.scroll=0;},{fill:this.bagTab===id?C.gold:C.panel,color:this.bagTab===id?C.dark:C.ink});y+=53;
    if(this.bagTab==='materials'){for(const m of materialRows(s)){box(c,14,y,362,62,C.panel,C.rim,12);this.art.item(c,m.icon,46,y+31,34);text(c,m.name,72,y+30,17,C.ink,800);text(c,fmt(m.count),360,y+30,18,C.gold,800,'right');y+=74;}return y;}
    for(const [i,slot]of [{id:'',name:'全部'},...GEAR_SLOTS].entries())this.button('bag-filter-slot-'+(slot.id||'all'),slot.name,14+i%3*124,y+Math.floor(i/3)*37,114,29,()=>{this.bagSlot=slot.id;this.bagPage=0;},{fill:this.bagSlot===slot.id?C.gold:C.panel,color:this.bagSlot===slot.id?C.dark:C.ink,size:11});y+=86;
    this.button('bag-filter-set',this.bagSet?GEAR_SETS.find(x=>x.id===this.bagSet).name:'全部套装',14,y,175,32,()=>{const ids=['',...GEAR_SETS.map(x=>x.id)];this.bagSet=ids[(ids.indexOf(this.bagSet)+1)%ids.length];this.bagPage=0;},{size:11});
    this.button('bag-craft','拼装',201,y,175,32,()=>{this.bagCraft={set:'hunt',slot:'claw'};this.scroll=0;},{size:11});y+=50;
    const rows=this.bagRows();this.bagPage=Math.min(this.bagPage,Math.max(0,Math.ceil(rows.length/6)-1));
    for(const e of rows.slice(this.bagPage*6,this.bagPage*6+6)){const desc=e.slot==='rune'?RUNES.find(x=>x.id===e.rune).desc:Object.entries(gearValues(e)).map(([k,v])=>attrText(k,v)).join(' / '),ht=rich(c,desc,72,0,282,{draw:false,size:11,line:18})+60;
      this.button('gear-item-'+e.id,'',14,y,362,ht,()=>{this.change('cats');this.mode='equipment';if(!G.ownsCompanion(s,this.selected))this.selected=G.unlocked(s)[0].id;this.bagCat=this.selected;this.bagDetail=e.id;},{fill:C.panel,stroke:QUALITIES[e.quality].color});this.art.item(c,GEAR_SLOTS.find(x=>x.id===e.slot).icon,43,y+33,36);text(c,gearName(e)+(e.enhance?' +'+e.enhance:''),72,y+25,15,C.ink,750);rich(c,desc,72,y+51,282,{size:11,line:18});y+=ht+12;}
    if(!rows.length){text(c,'暂无装备',195,y+25,14,C.muted,500,'center');y+=60;}
    if(rows.length>6){this.button('bag-prev','‹',14,y,110,33,()=>this.bagPage--,{disabled:this.bagPage===0});text(c,(this.bagPage+1)+' / '+Math.ceil(rows.length/6),195,y+17,12,C.muted,600,'center');this.button('bag-next','›',266,y,110,33,()=>this.bagPage++,{disabled:(this.bagPage+1)*6>=rows.length});y+=53;}return y;
  }
  bagChanged(message){this.save();if(message)this.toast(message);}
  drawGearDetail(y){
    const c=this.ctx,s=this.state,e=s.inventory.items.find(x=>x.id===this.bagDetail);if(!e){this.bagDetail=null;return this.tab==='cats'?this.drawEquipment(y):this.drawRelics(y);}
    const rune=e.slot==='rune',owner=gearOwner(s,e.id),set=GEAR_SETS.find(x=>x.id===e.set),q=enhanceQuote(e);
    this.button('bag-detail-back','‹ 返回装备',14,y,124,32,()=>{this.bagDetail=null;this.scroll=0;});y+=54;
    text(c,gearName(e)+(rune?'':' +'+e.enhance),16,y+19,23,C.gold,850);y+=39;
    for(const [k,v]of Object.entries(gearValues(e))){text(c,attrText(k,v),22,y+16,16,C.ink,700);y+=29;}
    const description=rune?RUNES.find(x=>x.id===e.rune).desc:set.name+'套装\n2 件：'+set.two+'\n4 件：'+set.four;
    y+=rich(c,description,20,y+10,350,{size:13,line:21})+27;
    this.button('gear-equip',owner===this.bagCat?'卸下':'装备 · '+cat(this.bagCat).name,14,y,362,38,()=>{if(owner===this.bagCat)unequipGear(s,this.bagCat,e.slot);else equipGear(s,e.id,this.bagCat,G.unlocked(s).map(c=>c.id));this.bagChanged();this.bagDetail=null;this.scroll=0;},{fill:C.gold,color:C.dark,size:13});y+=52;
    if(!rune){this.button('gear-enhance',q.maxed?'强化已满 +12':'强化 · '+q.gold+' 鱼币 / '+q.scrap+' 零件',14,y,362,36,()=>{if(enhanceGear(s,e.id))this.bagChanged('强化成功');},{disabled:q.maxed||s.gold<q.gold||s.inventory.materials.scrap<q.scrap,size:12});y+=48;
      for(const [i,a]of e.subs.entries()){this.button('gear-reforge-'+i,'洗炼副属性 '+(i+1)+' · '+ATTRS[a.key].name+' · 2 打磨砂',14,y,362,34,()=>{if(reforgeGear(s,e.id,i))this.bagChanged('副属性已更新');},{disabled:s.inventory.materials.essence<2,size:11});y+=46;}}
    this.button('gear-lock',e.locked?'解锁装备':'锁定装备',14,y,362,34,()=>{e.locked=!e.locked;this.bagChanged();});y+=48;
    this.button('gear-dismantle','分解装备',14,y,362,34,async()=>{if(!await this.env.confirm('分解 '+gearName(e),'装备会消失，返还修补零件和部分打磨砂。'))return;const r=dismantleGear(s,e.id);if(r){this.bagDetail=null;this.scroll=0;this.bagChanged('零件 +'+r.scrap+' · 打磨砂 +'+r.essence);}},{disabled:!!owner||e.locked});y+=55;y+=rich(c,gearStory(e),20,y,350,{size:13,line:21});return y+28;
  }
  drawGearCraft(y){const c=this.ctx,s=this.state,q=craftQuote(s),v=this.bagCraft;
    this.button('bag-craft-back','‹ 返回装备',14,y,124,32,()=>{this.bagCraft=null;this.scroll=0;});y+=58;text(c,'拼装装备',16,y+20,24,C.ink,850);y+=44;
    for(const [i,set]of GEAR_SETS.entries())this.button('craft-set-'+set.id,set.name,14+i%3*124,y+Math.floor(i/3)*44,114,34,()=>v.set=set.id,{fill:v.set===set.id?C.gold:C.panel,color:v.set===set.id?C.dark:C.ink});y+=102;
    for(const [i,slot]of GEAR_SLOTS.filter(x=>x.id!=='rune').entries())this.button('craft-slot-'+slot.id,slot.name,14+i*93,y,83,34,()=>v.slot=slot.id,{fill:v.slot===slot.id?C.gold:C.panel,color:v.slot===slot.id?C.dark:C.ink});y+=65;
    text(c,q.gold+' 鱼币 · '+q.scrap+' 零件 · '+q.essence+' 打磨砂',20,y+20,13,C.ink);y+=48;
    this.button('craft-confirm','拼装',14,y,362,40,()=>{const e=craftGear(s,v.set,v.slot);if(e){this.bagCraft=null;this.bagDetail=e.id;this.change('cats');this.mode='equipment';if(!G.ownsCompanion(s,this.selected))this.selected=G.unlocked(s)[0].id;this.bagCat=this.selected;this.bagChanged('装备已放入背包');}},{disabled:s.gold<q.gold||s.inventory.materials.scrap<q.scrap||s.inventory.materials.essence<q.essence||s.inventory.items.length>=BAG_CAP,fill:C.gold,color:C.dark});return y+65;
  }
  openStreet(group='recruit',id){this.modal=null;this.change('map');this.mapPlace='street';this.streetView={group,id:id||(group==='recruit'?'milk':''),tier:1};}
  drawDrops(reward,x,y,counts=true){const c=this.ctx,icons={gold:12,supplies:14,badges:9,notes:15,seals:11,essence:11,scrap:0,gear:4,shards:6};let dx=x;for(const [k,v]of Object.entries(reward)){if(!(v>0)||icons[k]===undefined)continue;this.art.item(c,icons[k],dx+12,y+12,24);if(counts){text(c,fmt(v),dx+28,y+12,11,C.ink,650);dx+=65;}else dx+=29;}return dx-x;}
  drawStreet(y){const c=this.ctx,s=this.state,v=this.streetView??={group:'recruit',id:'milk',tier:1},q=streetSelection(s,v),choices=streetChoices(v.group);text(c,STREET_GROUPS.find(g=>g.id===v.group).name,16,y+22,24,C.gold,850);y+=46;
    for(const [i,g]of STREET_GROUPS.entries())this.button('street-group-'+g.id,g.name,14+i%2*187,y+Math.floor(i/2)*40,175,32,()=>this.openStreet(g.id),{fill:g.id===v.group?C.gold:C.panel,color:g.id===v.group?C.dark:C.ink,size:12});y+=91;
    for(const [i,item]of choices.entries()){const x=14+i%3*124,gy=y+Math.floor(i/3)*68,info=activityInfo(s,{kind:v.group==='materials'?item.id:v.group,id:v.group==='materials'?'':item.id,tier:1});this.button('street-choice-'+item.id,'',x,gy,114,57,()=>{v.id=item.id;v.tier=1;this.scroll=0;},{fill:item.id===v.id?'#7d8f78':C.panel});text(c,item.name,x+57,gy+17,12,C.ink,750,'center');this.drawDrops(activityDrops(info),x+12,gy+29,false);}y+=Math.ceil(choices.length/3)*68+18;
    text(c,v.group==='recruit'?cat(v.id).name:q.name,16,y+20,19,C.ink,750);y+=41;
    this.button('street-prev','‹',14,y,98,32,()=>v.tier--,{disabled:q.tier<=1});text(c,q.tier,195,y+17,17,C.gold,800,'center');this.button('street-next','›',278,y,98,32,()=>v.tier++,{disabled:q.tier>=q.max||q.tier>q.cleared});y+=48;
    this.drawDrops(activityDrops(q),20,y);y+=43;
    this.button('street-fight',q.open?'挑战':'未开启',14,y,362,38,()=>{if(q.open){this.change('battle');this.start(true,{activity:q.request});}},{disabled:!q.open,fill:C.gold,color:C.dark});y+=58;
    if(q.kind==='recruit'){const owned=G.ownsCompanion(s,v.id),have=s.roster.shards[v.id]||0;this.button('street-recruit',owned?'已结识':'结识 · '+have+' / 20',14,y,362,36,()=>{if(G.recruitCompanion(s,v.id)){this.save();this.toast(cat(v.id).name+'加入了远征队');}},{disabled:owned||have<20});y+=55;}return y;
  }
  drawGrowth(y,id){const c=this.ctx,s=this.state,b=G.breakthroughQuote(s,id),a=G.starQuote(s,id);text(c,'突破 '+b.rank+' / 3',20,y+22,18,C.gold,800);y+=42;
    y+=rich(c,'徽章 '+s.badges+'/'+b.cost+' · 训练笔记 '+s.growth.notes+'/'+b.notes+' · 历练印记 '+s.growth.seals+'/'+b.seals,20,y,350,{size:12,line:19})+20;
    this.button('breakthrough-'+id,b.maxed?'突破已完成':s.levels[id]<b.requiredLevel?'Lv.'+b.requiredLevel+' 可突破':'突破',14,y,362,35,()=>{if(G.breakthrough(s,id)){this.battle?.syncStats(s,{preserveHealthRatio:true});this.save();this.toast('突破成功');}},{disabled:b.maxed||s.levels[id]<b.requiredLevel||!b.canAfford});y+=47;this.button('growth-materials','获取突破材料',14,y,362,32,()=>this.openStreet('materials','escort'));y+=58;
    text(c,'升星 '+a.rank+' / 5',20,y+20,18,C.gold,800);y+=40;y+=rich(c,'3 星 · '+a.talent,20,y,350,{size:12,line:19})+20;
    text(c,'信物 '+a.have+'/'+a.shards+' · 训练笔记 '+s.growth.notes+'/'+a.notes,20,y+15,12,C.ink);y+=36;this.button('ascend-'+id,a.maxed?'已满星':'升至 '+(a.rank+1)+' 星',14,y,362,35,()=>{if(G.ascendCompanion(s,id)){this.battle?.syncStats(s,{preserveHealthRatio:true});this.save();this.toast('升星成功');}},{disabled:a.maxed||a.have<a.shards||s.growth.notes<a.notes});y+=47;this.button('growth-shards','获取'+cat(id).name+'信物',14,y,362,32,()=>this.openStreet('recruit',id));return y+55;
  }
  async watchBusinessBoost() {
    if(this.adPending)return;
    const state=this.state,quote=businessBoostQuote(state,Date.now(),G.idleRate(state));
    if(!quote.available||!this.env.rewardedAds?.available)return;
    this.adPending=true;
    try {
      const result=await this.env.rewardedAds.watch();
      if(this.state!==state)return;
      if(grantBusinessBoost(state,quote,result.completed)){
        this.save();this.env.sound?.('reward');
        this.toast('补给到账：'+quote.gold+' 鱼币 · '+quote.supplies+' 物资');
      }else this.toast(result.status==='cancelled'?'未看完视频，本次不领取补给':result.status==='completed'?'本次补给未结算，请稍后重试':'视频暂不可用，正常收益不受影响');
    }catch{this.toast('视频暂不可用，稍后再试');}
    finally{this.adPending=false;}
  }
  drawMap(y) {
    const c=this.ctx,s=this.state;
    if(this.mapPlace){this.button('district-back','‹ 返回街区',14,y,120,30,()=>{this.mapPlace=null;this.scroll=0;},{size:12});y+=45;}
    if(!this.mapPlace){
      const available=this.navY-this.top,h=Math.min(available,390*1.5),w=h/1.5,x=(390-w)/2,sy=this.top+(available-h)/2;
      const img=this.art.image('assets/scenes/neighborhood-v0220.webp');if(img)c.drawImage(img,x,sy,w,h);
      paintDistrictObjects(c,{scene:img},x,sy,w,h,this.pointer&&!this.pointer.moved?this.pointer.button?.id?.replace('district-',''):null,this.districtRelease?{id:this.districtRelease.id,age:this.time-this.districtRelease.at}:null);
      paintDistrictAmbient(c,x,sy,w,h,this.time);
      for(const p of DISTRICT_PLACES)this.button('district-'+p.id,'',x+w*(p.x-p.w/2)/100,sy+h*(p.y-p.h/2)/100,w*p.w/100,h*p.h/100,()=>{if(!this.districtRelease)this.districtRelease={id:p.id,at:this.time};},{draw:false});
      return this.navY-20-this.scroll;
    }
    if(this.mapPlace==='stall'){
      text(c,'街角鱼摊',16,y+20,24,C.ink,850);y+=38;
      text(c,'经营物资 '+fmt(s.supplies)+' · 储存 '+Math.floor(G.idleMinutes(s)/60)+' 小时',16,y+14,12,C.gold);y+=30;
      text(c,G.idleRate(s)+' 鱼币 / 分钟',16,y+17,13,C.ink);
      this.button('claim-idle','领取 '+fmt(s.idle),220,y,156,32,()=>{const n=G.claimIdle(s);this.save();this.toast('领取 '+n+' 鱼币');});y+=48;
      const boost=businessBoostQuote(s,Date.now(),G.idleRate(s)),available=this.env.rewardedAds?.available;
      box(c,14,y,362,132,C.panel,C.rim,12);
      text(c,'经营补给',30,y+24,17,C.gold,800);
      text(c,'+'+fmt(boost.gold)+' 鱼币  ·  +'+boost.supplies+' 经营物资',30,y+49,13,C.ink);
      text(c,'自愿看完视频领取 · 今日剩余 '+boost.remaining+' 次',30,y+70,11,C.muted);
      const label=this.adPending?'视频加载中…':!available?'视频补给暂未开放':!boost.remaining?'今日补给已领完':boost.wait?'休息 '+boost.wait+' 秒':'看视频领补给';
      this.button('business-ad',label,30,y+88,330,30,()=>this.watchBusinessBoost(),{disabled:this.adPending||!available||!boost.available,size:12});y+=146;
      for(const u of G.STALL_UPGRADES){const q=G.stallQuote(s,u.id);box(c,14,y,362,114,C.panel,C.rim,12);text(c,u.name+' · Lv.'+q.level,30,y+25,17,C.gold,800);rich(c,u.effect,30,y+49,330,{size:12,line:18});this.button('stall-'+u.id,q.maxed?'已满级':'升级 · '+q.cost+' 物资',30,y+76,330,28,()=>{if(G.upgradeStall(s,u.id)){this.save();this.toast('鱼摊升级完成');}},{disabled:q.maxed||s.supplies<q.cost,size:11});y+=126;}return y;
    }
    if(this.mapPlace==='journal'){
      const a=refreshCampaign(s);text(c,'猫巷手账',16,y+24,24,C.ink,850);y+=53;
      for(const t of DAILY_TASKS){const r=dailyReward(s),claimed=a.claimed.includes(t.id);box(c,14,y,362,118,C.panel,C.rim,12);text(c,t.name+' · '+a.progress[t.id]+'/'+t.goal,30,y+25,16,C.gold,800);text(c,t.desc,30,y+48,11,C.ink);this.button('daily-'+t.id,claimed?'已领取':r.gold+' 鱼币 · '+r.supplies+' 物资',30,y+73,330,30,()=>{if(claimDaily(s,t.id)){this.save();this.toast('委托奖励已领取');}},{disabled:claimed||a.progress[t.id]<t.goal,size:12});y+=130;}
      this.button('daily-chest',a.chest?'交班礼已领取':'交班礼 · '+a.claimed.length+'/3 · 40 物资 / 2 徽章',14,y,362,36,()=>{if(claimDailyChest(s)){this.save();this.toast('交班礼已领取');}},{disabled:a.chest||a.claimed.length<3,size:12});y+=58;
      text(c,'成长之路 · '+a.journey.length+' / 30',16,y+22,21,C.ink,800);y+=42;
      for(const j of JOURNEY){const done=a.journey.includes(j.id);box(c,14,y,362,112,C.panel,C.rim,12);text(c,j.index+'. '+j.name+' · 第 '+j.stage+' 关',30,y+25,15,C.gold,700);text(c,j.gold+' 鱼币 / '+j.supplies+' 物资 / '+j.badges+' 徽章',30,y+48,11,C.ink);this.button('journey-'+j.id,done?'已领取':s.highest>=j.stage?'领取':'进行中',30,y+69,330,29,()=>{if(claimJourney(s,j.id)){this.save();this.toast('成长奖励已领取');}},{disabled:done||s.highest<j.stage,size:12});y+=124;}return y;
    }
    if(this.mapPlace==='street')return this.drawStreet(y);
    if(this.mapPlace==='arena'){text(c,'猫巷委托板',16,y+24,24,C.ink,850);y+=52;for(const group of STREET_GROUPS){box(c,14,y,362,112,C.panel,C.rim,12);text(c,group.name,30,y+24,18,C.gold,800);this.drawDrops(group.drops,30,y+37,false);this.button('street-'+group.id,'进入',30,y+69,330,29,()=>this.openStreet(group.id));y+=124;}this.button('open-journal','猫巷手账 · 每日 / 成长',14,y,362,36,()=>{this.mapPlace='journal';this.scroll=0;});y+=48;this.button('open-challenges','本周挑战与擂台',14,y,362,36,()=>{this.mapPlace='challenges';this.scroll=0;});return y+60;}
    if(this.mapPlace==='challenges'){
      this.button('open-journal','猫巷手账 · 每日委托 / 成长之路',14,y,362,40,()=>{this.mapPlace='journal';this.scroll=0;},{size:13});y+=58;
      text(c,'本周挑战 · '+weeklyInfo(s,1).name,16,y+23,20,C.gold,800);y+=50;
      for(const n of [1,2,3]){const q=weeklyInfo(s,n);box(c,14,y,362,100,C.panel,C.rim,12);text(c,['入门','进阶','极限'][n-1]+' · '+q.reward.badges+' 徽章 / '+q.reward.supplies+' 物资',30,y+27,14,C.ink,700);this.button('weekly-'+n,q.claimed?'已领 · 再次切磋':q.open?'挑战':'第 15 关开启',30,y+54,330,30,()=>{this.change('battle');this.start(true,{weeklyTier:n});},{disabled:!q.open,size:12});y+=112;}

      text(c,'街头擂台',16,y+22,24,C.ink,850);y+=50;
      for(let tier=1;tier<=G.ARENA_MAX;tier++){const a=G.arenaInfo(tier),first=tier>s.arenaCleared;box(c,14,y,362,148,C.panel,C.rim,12);text(c,'第 '+tier+' 擂 · '+a.name,30,y+24,17,C.gold,800);this.drawDrops({badges:1,gear:1},30,y+39,false);text(c,'每次 '+a.baseReward+' 徽章'+(first?' · 首通额外 '+a.firstBonus:''),30,y+98,11,C.muted);this.button('arena-'+tier,first?'挑战':'再次挑战',30,y+111,330,28,()=>{this.change('battle');this.start(true,{arenaTier:tier});},{disabled:!G.arenaOpen(s,tier),size:11});y+=160;}return y;
    }
    text(c,'街区巡逻 · '+G.MAX_STAGE+' 关',16,y+22,22,C.ink,850);y+=42;
    for(let i=0;i<G.MAX_STAGE/20;i++){const ch=G.CHAPTERS[i%6],open=s.runCleared>=i*20;this.button('chapter-'+i,'',14,y,362,90,()=>this.modal={type:'chapter',index:i},{fill:C.panel,disabled:!open});text(c,ch.name+' · '+(Math.floor(i/6)+1),30,y+29,18,C.ink,800);text(c,'第 '+(i*20+1)+'—'+(i*20+20)+' 关 · 鱼币与物资',30,y+59,12,C.muted);y+=102;}return y;
  }
  drawModal() {
    const c = this.ctx,
      m = this.modal;
    this.buttons = [];
    c.fillStyle = "#142a38d9";
    c.fillRect(0, 0, 390, this.H);
    const available = this.H - this.safeTop - 28,
      heights = {
        intro: 396,
        loot: 400,
        recruit: 380,
        settings: 430,
        quests: Math.min(572, available),
        chapter: 350,
        inherit: 380,
        help: 310,
        victory: 270,
      };
    const h = Math.min(heights[m.type] || 340, available),
      y = this.safeTop + (available - h) / 2,
      x = 20,
      w = 350;
    box(c, x, y, w, h, "#45656b", "#b7bea1", 18);
    const close = () => this.close();
    if (!["intro", "loot"].includes(m.type))
      this.button("close", "×", 330, y + 12, 26, 26, close, {
        draw: false,
        size: 23,
      });
    if (m.type === "intro") {
      text(c, "罐头远征队", 195, y + 36, 28, C.ink, 850, "center");
      this.art.actor(c, "orange", "intro-orange", 144, y + 170, 100, this.time);
      this.art.actor(c, "ink", "intro-ink", 248, y + 170, 100, this.time);
      rich(c, "带上猫猫，守住这条街。", 62, y + 204, 270, {
        size: 17,
        line: 24,
      });
      this.button(
        "begin",
        "出发巡逻",
        49,
        y + h - 62,
        292,
        42,
        () => {
          this.state.onboarded = true;
          this.save();
          this.modal = null;
          this.start(true);
        },
        { fill: C.gold, color: C.dark, size: 16 },
      );
    }
    if (m.type === "loot") {
      text(c,'旧装备已迁移',195,y+40,24,C.ink,800,'center');
      rich(c,'旧的全队叠加装备已经停用。背包中可查看新的角色装备与材料。',38,y+90,310,{size:14,line:23});
      this.button('loot-migrated','继续',39,y+h-65,312,38,()=>{this.state.pending=null;this.modal=null;this.save();});
    }
    if (m.type === "recruit") {
      const a = cat(m.id);
      text(c, a.name + " 加入队伍", 195, y + 39, 25, C.ink, 850, "center");
      this.art.actor(c, a.id, "new-" + a.id, 195, y + 210, 140, this.time);
      text(c, a.job + " · " + a.skill, 195, y + 241, 15, C.gold, 750, "center");
      rich(
        c,
        crewSkill(a.id, this.state.levels[a.id], G.catStats(this.state, a.id))
          .description,
        42,
        y + 272,
        306,
        { size: 11, line: 18 },
      );
      this.button("welcome", "一起出发", 49, y + h - 53, 292, 35, close, {
        fill: C.gold,
        color: C.dark,
      });
    }
    if (m.type === "settings") {
      text(c, "设置", 42, y + 34, 25, C.ink, 850);
      const rows = [
        [
          "audio",
          "声音 · " + (this.state.sound ? "开启" : "关闭"),
          () => {
            this.state.sound = !this.state.sound;
            this.save();
          },
        ],
        ["export", "复制存档", () => this.exportSave()],
        ["import", "导入网页存档", () => this.importSave()],
        ["share", "分享给朋友", () => this.env.share?.()],
        ["reset", "重新开始", () => this.reset()],
      ];
      rows.forEach(([id, label, fn], i) =>
        this.button(id, label, 39, y + 67 + i * 49, 312, 39, fn, {
          fill: i === 5 ? "#806d66" : C.panel2,
          size: 13,
        }),
      );
      text(
        c,
        "微信测试版 · v0.25.1",
        195,
        y + h - 24,
        10,
        C.muted,
        500,
        "center",
      );
    }
    if (m.type === "quests") {
      text(c, "巡逻奖励", 42, y + 32, 25, C.ink, 850);
      const rowH = Math.min(40, (h - 120) / G.QUESTS.length);
      G.QUESTS.forEach((q, i) => {
        const sy = y + 68 + i * rowH,
          done = this.state.claimed.includes(q.id),
          ready = G.questValue(this.state, q) >= q.goal;
        text(c, q.name, 38, sy, 11, done ? C.muted : C.ink, 650);
        text(
          c,
          done
            ? "已领"
            : ready
              ? "可领 " + fmt(q.reward)
              : Math.min(q.goal, G.questValue(this.state, q)) + "/" + q.goal,
          350,
          sy,
          10,
          ready && !done ? C.gold : C.muted,
          600,
          "right",
        );

      });
      this.button(
        "claim-quests",
        "领取已完成奖励",
        39,
        y + h - 50,
        312,
        34,
        () => {
          const n = G.claimQuests(this.state);
          this.save();
          this.toast(n ? "领取 " + n + " 鱼币" : "还没有可领取的奖励");
        },
        { fill: C.gold, color: C.dark },
      );
    }
    if (m.type === "chapter") {
      const ch = G.CHAPTERS[m.index%6];
      text(c, ch.name, 40, y + 33, 24, C.ink, 850);
      text(c, "选择已通关关卡可以练练", 40, y + 63, 11, C.muted);
      for (let i = 0; i < 20; i++) {
        const stage = m.index * 20 + i + 1,
          cleared = stage <= this.state.runCleared,
          allowed = stage <= this.state.stage;
        this.button(
          "level-" + stage,
          String(stage),
          39 + (i % 5) * 64,
          y + 88 + Math.floor(i / 5) * 50,
          56,
          41,
          () => {
            this.modal = null;
            this.change("battle");
            this.start(true, { stage, farm: cleared });
          },
          {
            disabled: !allowed,
            fill: cleared
              ? "#648772"
              : stage === this.state.stage
                ? "#bd9e69"
                : C.panel,
            color: stage === this.state.stage ? C.dark : C.ink,
          },
        );
      }
      text(
        c,
        "已通关巡逻获得 60% 鱼币",
        195,
        y + h - 28,
        11,
        C.muted,
        500,
        "center",
      );
    }
    if (m.type === "inherit") {
      text(c, "选择培养来源", 42, y + 33, 23, C.ink, 850);
      text(c, "双方交换等级，不额外消耗鱼币", 42, y + 62, 11, C.muted);
      G.unlocked(this.state)
        .filter((a) => this.state.levels[a.id] > this.state.levels[m.id])
        .forEach((a, i) =>
          this.button(
            "inherit-" + a.id,
            a.name + " Lv." + this.state.levels[a.id] + " → " + cat(m.id).name,
            39,
            y + 85 + i * 39,
            312,
            32,
            () => {
              G.inheritTraining(this.state, a.id, m.id);
              this.battle?.syncStats(this.state);
              this.save();
              this.close();
              this.toast("培养已继承");
            },
            { size: 12 },
          ),
        );
    }
    if (m.type === "victory") {
      text(c, "月光罐头，带回家了", 195, y + 45, 24, C.ink, 850, "center");
      rich(
        c,
        "600关巡逻完成。进度永久保留，可以重访旧关收集物资或继续挑战擂台。",
        44,
        y + 99,
        302,
        { size: 13, line: 24 },
      );
      this.button(
        "victory-map",
        "前往街区",
        49,
        y + h - 59,
        292,
        40,
        () => {
          this.modal = null;
          this.change("map");
        },
        { fill: C.gold, color: C.dark },
      );
    }
  }
}
