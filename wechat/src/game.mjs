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
    this.tab = tab;
    this.scroll = 0;
    this.pointer = null;
  }
  start(run = true, { stage = this.state.stage, farm = false } = {}) {
    if (this.state.pending) {
      this.battle = new G.Battle(this.state, { stage });
      this.running = false;
      this.modal = { type: "loot" };
      return;
    }
    if (this.state.runCleared === 120 && !farm) {
      this.battle = this.battle || new G.Battle(this.state);
      this.running = false;
      this.modal = { type: "victory" };
      return;
    }
    this.battle = new G.Battle(this.state, { stage, farm });
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
      });
      return;
    }
    this.running = !this.running;
  }
  update(dt) {
    this.time += dt;
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
      if (b.result === "win") {
        this.nextDelay -= dt;
        if (this.nextDelay <= 0)
          this.start(true, {
            stage: this.farming ? b.stage : this.state.stage,
            farm: this.farming,
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
        e.value > 0 &&
        (e.type !== "burn" || e.serial % 7 === 0)
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
    const quote = G.upgradeQuote(this.state.levels[id], count);
    if (
      !quote.levels ||
      this.state.gold < quote.cost ||
      this.state.highest < cat(id).unlock
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
    if (!this.battle?.result) this.start(run, { stage, farm: this.farming });
    this.toast(
      inheritance
        ? cat(id).name + "继承 Lv." + inheritance.fromLevel
        : "阵容已调整",
    );
  }
  close() {
    if (this.modal?.type === "intro" || this.modal?.type === "loot") return;
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
      "鱼骨 " + fmt(this.state.bones),
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
    text(c, ch.name, 14, this.top + 16, 21, C.ink, 800);
    this.button(
      "stage",
      "第 " + stage + " 关  ›",
      284,
      this.top + 2,
      92,
      29,
      () => {
        this.modal = { type: "chapter", index: Math.floor((stage - 1) / 20) };
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
          ? "蓄力 " + bv.seconds.toFixed(1) + "秒 · 开罐打断"
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
    this.art.scene(c, Math.floor((stage - 1) / 20), 0, 0, w, ah);
    c.fillStyle = "#203a4530";
    c.fillRect(0, 0, w, ah);
    box(c, 12, 10, 100, 23, "#29464bbd", null, 6);
    text(
      c,
      this.farming ? "旧关巡逻" : "街区巡逻",
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
        e.crit ? 17 : 13,
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
        b.result === "win" ? "巡逻成功" : "先整备，再出发",
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
          ? "下一关"
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
      this.farming ? "返回闯关" : "去练练",
      12,
      y + 63,
      87,
      25,
      () => {
        if (this.farming) this.start(true);
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
    const q = G.upgradeQuote(this.state.levels[id]),
      open = this.state.highest >= cat(id).unlock;
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
    this.button(
      "profile",
      "伙伴档案",
      14,
      y,
      177,
      33,
      () => {
        this.mode = "profile";
        this.scroll = 0;
      },
      { fill: this.mode === "profile" ? "#7d8f78" : C.panel },
    );
    this.button(
      "formation",
      "调整阵容",
      199,
      y,
      177,
      33,
      () => {
        this.mode = "formation";
        this.scroll = 0;
      },
      { fill: this.mode === "formation" ? "#7d8f78" : C.panel },
    );
    y += 45;
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
        open = this.state.highest >= a.unlock;
      this.button(
        "pick-" + a.id,
        "",
        x,
        y,
        65,
        91,
        () => {
          this.selected = a.id;
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
        open ? "Lv." + this.state.levels[a.id] : "第" + a.unlock + "关",
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
    const a = cat(this.selected),
      st = G.catStats(this.state, a.id),
      open = this.state.highest >= a.unlock,
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
        : "第 " + a.unlock + " 关加入",
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
      ["间隔", st.interval.toFixed(2) + "秒"],
      ["暴击", Math.round(st.crit * 100) + "%"],
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
    if (open) {
      this.button(
        "single-upgrade",
        level === 100 ? "已满级" : "升1级 · " + fmt(G.upgradeCost(level)),
        14,
        y,
        224,
        40,
        () => this.train(a.id, 1),
        {
          fill: "#b59662",
          color: C.dark,
          disabled: level === 100 || this.state.gold < G.upgradeCost(level),
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
        "通过第 " + a.unlock + " 关后加入",
        195,
        y + 15,
        12,
        C.muted,
        600,
        "center",
      );
      y += 40;
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
        open = this.state.highest >= a.unlock;
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
        open ? "Lv." + this.state.levels[a.id] : "第" + a.unlock + "关",
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
  drawRelics(y) {
    const c = this.ctx;
    text(c, "远征背包", 16, y + 12, 24, C.ink, 850);
    text(c, "每件最多叠加 5 层", 16, y + 40, 11, C.muted);
    y += 62;
    G.RELICS.forEach((r, i) => {
      const x = 14 + (i % 2) * 187,
        sy = y + Math.floor(i / 2) * 137,
        level = this.state.relics[r.id] || 0;
      box(c, x, sy, 175, 125, level ? "#5a7169" : C.panel, C.rim, 12);
      c.globalAlpha = level ? 1 : 0.5;
      this.art.item(c, i, x + 35, sy + 34, 49);
      c.globalAlpha = 1;
      text(c, r.name, x + 66, sy + 24, 12, C.ink, 800);
      text(
        c,
        level ? "× " + level : "未获得",
        x + 66,
        sy + 46,
        11,
        level ? C.gold : C.muted,
      );
      rich(c, r.desc, x + 14, sy + 78, 147, { size: 11, line: 19 });
    });
    return y + 6 * 137;
  }
  drawMap(y) {
    const c = this.ctx;
    box(c, 14, y, 362, 104, "#68816d", "#b6c4a5", 13);
    this.art.item(c, 14, 48, y + 34, 45);
    text(c, "街角小鱼摊", 81, y + 25, 18, C.ink, 800);
    text(
      c,
      G.idleRate(this.state) + " 鱼币 / 分钟 · 最多积累4小时",
      81,
      y + 49,
      10,
      C.ink,
    );
    this.button(
      "claim-idle",
      "领取 " + fmt(this.state.idle),
      229,
      y + 67,
      132,
      27,
      () => {
        const n = G.claimIdle(this.state);
        this.save();
        this.toast("领取 " + n + " 鱼币");
      },
      { fill: "#c3b783", color: C.dark, size: 11 },
    );
    y += 121;
    text(c, "整条街，一起走", 16, y + 13, 23, C.ink, 850);
    y += 42;
    G.CHAPTERS.forEach((ch, i) => {
      const sy = y + i * 110,
        open = this.state.runCleared >= i * 20;
      this.button(
        "chapter-" + i,
        "",
        14,
        sy,
        362,
        99,
        () => (this.modal = { type: "chapter", index: i }),
        { fill: C.panel, disabled: !open },
      );
      c.save();
      round(c, 15, sy + 1, 105, 97, 9);
      c.clip();
      this.art.scene(c, i, 15, sy + 1, 105, 97);
      c.restore();
      text(c, ch.name, 134, sy + 26, 19, C.ink, 800);
      text(
        c,
        i * 20 + 1 + "—" + (i * 20 + 20) + " 关",
        134,
        sy + 51,
        11,
        C.muted,
      );
      text(
        c,
        open
          ? Math.min(20, Math.max(0, this.state.runCleared - i * 20)) + " / 20"
          : "通关上一街区开启",
        134,
        sy + 78,
        11,
        open ? C.gold : C.muted,
      );
    });
    y += 660;
    box(c, 14, y, 362, 132, "#625d73", "#aaa2b9", 13);
    text(c, "换班远征", 30, y + 26, 20, C.ink, 800);
    rich(
      c,
      "从第1关再出发，保留伙伴、等级与鱼币。鱼骨永久提高全队生命和攻击；本轮战利品重置。",
      30,
      y + 52,
      330,
      { size: 11, line: 18 },
    );
    const gain = G.prestigeGain(this.state);
    this.button(
      "prestige",
      gain ? "换班 · 获得 " + gain + " 鱼骨" : "通过第20关开启",
      190,
      y + 93,
      170,
      28,
      async () => {
        if (
          !(await this.env.confirm(
            "换班远征",
            "保留伙伴、等级、鱼币与历史成就，重置本轮关卡和战利品，获得 " +
              gain +
              " 鱼骨。",
          ))
        )
          return;
        if (G.prestige(this.state)) {
          this.save();
          this.modal = null;
          this.change("battle");
          this.start(false);
          this.toast("新的远征开始了");
        }
      },
      {
        size: 11,
        fill: "#bcad8c",
        color: C.dark,
        disabled: !gain || !!this.state.pending,
      },
    );
    return y + 148;
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
      rich(
        c,
        "猫猫自动战斗。点击「开罐啦」给队友回血，让罐头盖打断敌方蓄力。\n在伙伴里升级、拖动调整阵容。",
        45,
        y + 244,
        300,
        { size: 13, line: 24 },
      );
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
      text(c, "挑一件战利品", 195, y + 35, 25, C.ink, 850, "center");
      (this.state.pending?.options || []).forEach((id, i) => {
        const ri = G.RELICS.findIndex((r) => r.id === id),
          r = G.RELICS[ri],
          sy = y + 70 + i * 93;
        this.button(
          "loot-" + id,
          "",
          37,
          sy,
          316,
          82,
          () => this.chooseRelic(id),
          { fill: "#62796c", stroke: C.gold },
        );
        this.art.item(c, ri, 70, sy + 40, 50);
        text(c, r.name, 109, sy + 23, 16, C.ink, 800);
        rich(c, r.desc, 109, sy + 48, 225, { size: 11, line: 18 });
      });
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
        ["help", "玩法说明", () => (this.modal = { type: "help" })],
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
        "微信测试版 · v0.21.0",
        195,
        y + h - 24,
        10,
        C.muted,
        500,
        "center",
      );
    }
    if (m.type === "help") {
      text(c, "一起守住这条街", 42, y + 36, 24, C.ink, 850);
      rich(
        c,
        "猫猫自动普攻，能量满后释放技能。\n开罐啦：全队回血20%，罐头盖命中全体敌人并打断蓄力。\n伙伴：每张卡可升10级；档案可升1级。拖动调整阵容，替换队员继承培养。\n街区：小鱼摊离线产鱼币，最多4小时。旧关巡逻奖励为原来的60%。",
        42,
        y + 80,
        306,
        { size: 12, line: 24 },
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
        text(c, q.desc, 38, sy + 15, 8, C.muted);
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
      const ch = G.CHAPTERS[m.index];
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
        "120关远征完成。可以继续巡逻收集资源，也可以在街区换班，带着鱼骨重新出发。",
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
