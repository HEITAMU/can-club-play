import {BACKDROP_FRACTION} from '../../battlefield-space.mjs';
import {FINISHED_ROSTER} from '../../finished-roster-data.mjs';
import {setRosterCanvasFactory} from '../../finished-roster-renderer.mjs';
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
    setRosterCanvasFactory((w,h)=>{const c=env.createCanvas();c.width=w;c.height=h;return c;},env.snapshotCanvas);
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
    const kit = id==='spark'?FINISHED_SPARK:FINISHED_ROSTER[id]||ANATOMY[id],
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
    if(FINISHED_ROSTER[id]){pose.boltCel=shape.boltCel;pose.shidunCel=shape.shidunCel;pose.shidunCharge=shape.shidunCharge;pose.shidunTime=shape.shidunTime;pose.rosterCel=shape.rosterCel;pose.rosterRecovery=shape.rosterRecovery;pose.rosterSkill=shape.rosterSkill;pose.rosterClock=time;}
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
  scene(ctx, index, x, y, w, h, activity=null) {
    const i=activity?({sweep:0,escort:1,salvage:2,recruit:3,hunt:4,hard:5})[activity.kind]??0:index;
    const img=this.image(activity?'assets/scenes/commissions-v02646.webp':'assets/scenes/streets-v019.webp');if(!img)return;
    const cw=img.width/3,ch=img.height/2,sx=i%3*cw,sy=Math.floor(i/3)*ch,cut=(activity?[300,286,286,276,278,286][i]/512:[290,270,265,275,245,270][i]/627)*ch,top=h*BACKDROP_FRACTION;
    ctx.drawImage(img,sx,sy,cw,cut,x,y,w,top);ctx.drawImage(img,sx,sy+cut,cw,ch-cut,x,y+top,w,h-top);
  }
  resetBattle() {
    for (const key of this.sprites.keys())
      if (key.startsWith("battle-")) this.sprites.delete(key);
  }
}
