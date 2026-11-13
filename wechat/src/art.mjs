import {FINISHED_SPARK} from '../../finished-spark-data.mjs';
import {setFinishedCanvasFactory} from '../../finished-spark-renderer.mjs';
import { ANATOMY } from "../../anatomy-data.mjs";
import { renderPuppetFrame } from "../../rig-renderer.mjs";
import { rigPose, rigFor, blendRigPose } from "../../rig-motion.mjs";
import { expressionFor, faceTransition, bowNock } from "../../expressions.mjs";
const foes = {
  dust: ["a", 0],
  box: ["a", 1],
  mop: ["a", 2],
  battery: ["a", 3],
  bag: ["b", 0],
  drone: ["b", 1],
  vacuum: ["b", 2],
  fridge: ["b", 3],
  sign: ["c", 0],
  boxBoss: ["c", 1],
  clock: ["c", 2],
  vendor: ["c", 3],
};
export class NativeArt {
  constructor(env, images) {
    this.env = env;
    setFinishedCanvasFactory((w,h)=>{const c=env.createCanvas();c.width=w;c.height=h;return c;});
    this.images = images;
    this.sprites = new Map();
  }
  image(path) {
    return this.images[path.replace(/^\.\//, "")];
  }
  actor(
    ctx,
    id,
    key,
    x,
    footY,
    size,
    time,
    actor = null,
    outcome = null,
    flip = 1,
  ) {
    const kit = id==='spark'?FINISHED_SPARK:ANATOMY[id],
      foe = foes[id] || foes.dust,
      img = this.image(
        kit ? kit.atlas : "assets/painted/enemies-" + foe[0] + ".webp",
      );
    if (!img) return;
    let cache = this.sprites.get(key);
    if (!cache) {
      const canvas = this.env.createCanvas();
      cache = {
        canvas,
        ctx: canvas.getContext("2d"),
        time: -1,
        face: null,
        pose: null,
      };
      this.sprites.set(key, cache);
    }
    const dpr = Math.min(2, this.env.pixelRatio || 1),
      w = Math.round(size * 1.44 * dpr),
      h = Math.round(size * 1.38 * dpr);
    if (cache.canvas.width !== w || cache.canvas.height !== h) {
      cache.canvas.width = w;
      cache.canvas.height = h;
    }
    const shape = rigPose(id, actor, time, time),
      pose = blendRigPose(
        cache.pose,
        shape,
        cache.time < 0 ? -1 : time - cache.time,
      );
    if(id==='spark'){pose.sparkCel=shape.sparkCel;pose.sparkRecovery=shape.sparkRecovery;pose.sparkClock=time;}
    pose.nock = bowNock(actor);
    const face = faceTransition(
      cache.face,
      expressionFor(id, actor, time, time, { outcome }),
      time,
    );
    renderPuppetFrame(
      cache.ctx,
      id,
      pose,
      img,
      w,
      h,
      kit ? null : [0, (foe[1] * img.height) / 4, img.width, img.height / 4],
      face,
    );
    cache.pose = pose;
    cache.face = face;
    cache.time = time;
    ctx.save();
    ctx.translate(x, footY);
    ctx.scale(flip, 1);
    ctx.drawImage(
      cache.canvas,
      -size * 0.72,
      -size * (rigFor(id).foot + 0.2),
      size * 1.44,
      size * 1.38,
    );
    ctx.restore();
  }
  item(ctx, index, x, y, size = 28) {
    const img = this.image("assets/painted/items.webp");
    if (img)
      ctx.drawImage(
        img,
        ((index % 4) * img.width) / 4,
        (Math.floor(index / 4) * img.height) / 4,
        img.width / 4,
        img.height / 4,
        x - size / 2,
        y - size / 2,
        size,
        size,
      );
  }
  scene(ctx, index, x, y, w, h) {
    const img = this.image("assets/scenes/streets-v019.webp");
    if (!img) return;
    const cellW = img.width / 3,
      cellH = img.height / 2;
    let sw = cellW,
      sh = cellH;
    if (w / h > cellW / cellH) sh = (cellW * h) / w;
    else sw = (cellH * w) / h;
    ctx.drawImage(
      img,
      (index % 3) * cellW + (cellW - sw) / 2,
      Math.floor(index / 3) * cellH + (cellH - sh) / 2,
      sw,
      sh,
      x,
      y,
      w,
      h,
    );
  }
  resetBattle() {
    for (const key of this.sprites.keys())
      if (key.startsWith("battle-")) this.sprites.delete(key);
  }
}
