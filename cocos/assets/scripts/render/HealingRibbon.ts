import {_decorator, Sprite, SpriteFrame, Texture2D, UITransform, builtinResMgr} from 'cc';

const {ccclass} = _decorator;
const SEGMENTS = 34;
const TAU = Math.PI * 2;
// Splitting a convex quad at two parallel boundaries yields at most six
// triangles in total. Keep one allocation while the ribbon animates.
export const HEALING_RIBBON_MAX_VERTICES = SEGMENTS * 18;
const INDICES = Uint16Array.from({length: HEALING_RIBBON_MAX_VERTICES}, (_, i) => i);
const STOPS = [0, .4, .62, 1];
const RGB = [[98, 200, 161], [208, 237, 182], [255, 241, 186], [126, 214, 173]];

export type HealingRibbonState = {
  width: number; height: number; phase: number; alpha: number; front: boolean;
};

function clipX(input: Float64Array, count: number, output: Float64Array, x: number, keepRight: boolean): number {
  if (!count) return 0;
  let used = 0;
  let ax = input[(count - 1) * 2], ay = input[(count - 1) * 2 + 1];
  let aInside = keepRight ? ax >= x : ax <= x;
  for (let i = 0; i < count; i++) {
    const bx = input[i * 2], by = input[i * 2 + 1];
    const bInside = keepRight ? bx >= x : bx <= x;
    if (aInside !== bInside) {
      const t = (x - ax) / (bx - ax);
      const y = ay + (by - ay) * t;
      if (!used || output[(used - 1) * 2] !== x || output[(used - 1) * 2 + 1] !== y) {
        output[used * 2] = x; output[used * 2 + 1] = y; used++;
      }
    }
    if (bInside && (!used || output[(used - 1) * 2] !== bx || output[(used - 1) * 2 + 1] !== by)) {
      output[used * 2] = bx; output[used * 2 + 1] = by; used++;
    }
    ax = bx; ay = by; aInside = bInside;
  }
  if (used > 1 && output[0] === output[(used - 1) * 2] && output[1] === output[(used - 1) * 2 + 1]) used--;
  return used;
}

/** Exact Preview11 trapezoids, clipped only where the linear gradient changes slope. */
export class HealingRibbonGeometry {
  // x / y (Cocos Y-up), followed by unrounded normalized r / g / b / alpha.
  readonly vertices = new Float32Array(HEALING_RIBBON_MAX_VERTICES * 6);
  readonly triangleSegments = new Uint8Array(HEALING_RIBBON_MAX_VERTICES / 3);
  vertexCount = 0;
  private readonly quad = new Float64Array(8);
  private readonly clippedA = new Float64Array(16);
  private readonly clippedB = new Float64Array(16);

  rebuild(p: HealingRibbonState): void {
    const previousCount = this.vertexCount;
    this.vertexCount = 0;
    const width = p.width, height = p.height;
    if (width > 0 && height > 0 && Number.isFinite(width + height + p.phase + p.alpha)) {
      const alpha = Math.max(0, Math.min(1, p.alpha));
      let ax = Math.cos(p.phase) * width * .43, ay = height * .52, at = 0;
      let aFront = Math.sin(p.phase) > 0;
      const firstBoundary = width * (STOPS[1] - .5);
      const secondBoundary = width * (STOPS[2] - .5);
      for (let segment = 0; segment < SEGMENTS; segment++) {
        const bt = (segment + 1) / SEGMENTS, angle = p.phase + bt * TAU * .88;
        const bx = Math.cos(angle) * width * (.43 - .09 * bt), by = height * (.52 - bt);
        if (aFront === p.front) {
          const dx = bx - ax, dy = by - ay, length = Math.hypot(dx, dy) || 1;
          const nx = -dy / length, ny = dx / length;
          const aw = width * .045 * Math.sin(Math.PI * at) ** .75 * (.85 + .15 * Math.sin(at * 29 + p.phase));
          const bw = width * .045 * Math.sin(Math.PI * bt) ** .75 * (.85 + .15 * Math.sin(bt * 29 + p.phase));
          const q = this.quad;
          q[0] = ax + nx * aw; q[1] = ay + ny * aw;
          q[2] = bx + nx * bw; q[3] = by + ny * bw;
          q[4] = bx - nx * bw; q[5] = by - ny * bw;
          q[6] = ax - nx * aw; q[7] = ay - ny * aw;
          // Each band's RGB is affine in X. GPU interpolation within its
          // triangles therefore equals Canvas's continuous linear gradient.
          let count = clipX(q, 4, this.clippedA, firstBoundary, false);
          this.append(this.clippedA, count, width, alpha, segment);
          count = clipX(q, 4, this.clippedA, firstBoundary, true);
          count = clipX(this.clippedA, count, this.clippedB, secondBoundary, false);
          this.append(this.clippedB, count, width, alpha, segment);
          count = clipX(q, 4, this.clippedA, secondBoundary, true);
          this.append(this.clippedA, count, width, alpha, segment);
        }
        ax = bx; ay = by; at = bt; aFront = Math.sin(angle) > 0;
      }
    }
    // Unused triangles collapse to the origin and have zero alpha. This keeps
    // native and Web index buffers fixed without retaining a previous phase.
    this.vertices.fill(0, this.vertexCount * 6, previousCount * 6);
  }

  private append(poly: Float64Array, count: number, width: number, alpha: number, segment: number): void {
    for (let i = 1; i + 1 < count; i++) {
      this.triangleSegments[this.vertexCount / 3] = segment;
      this.vertex(poly[0], poly[1], width, alpha);
      this.vertex(poly[i * 2], poly[i * 2 + 1], width, alpha);
      this.vertex(poly[(i + 1) * 2], poly[(i + 1) * 2 + 1], width, alpha);
    }
  }

  private vertex(x: number, y: number, width: number, alpha: number): void {
    const t = Math.max(0, Math.min(1, x / width + .5));
    let band = 0;
    while (band < 2 && t > STOPS[band + 1]) band++;
    const mix = (t - STOPS[band]) / (STOPS[band + 1] - STOPS[band]);
    const a = RGB[band], b = RGB[band + 1], out = this.vertices;
    let index = this.vertexCount++ * 6;
    out[index++] = x; out[index++] = -y;
    for (let channel = 0; channel < 3; channel++) out[index++] = (a[channel] + (b[channel] - a[channel]) * mix) / 255;
    out[index] = alpha;
  }
}

let whiteFrame: SpriteFrame | null = null;
function ribbonFrame(): SpriteFrame {
  if (!whiteFrame) {
    whiteFrame = new SpriteFrame();
    whiteFrame.texture = builtinResMgr.get<Texture2D>('white-texture');
    whiteFrame.packable = false;
  }
  return whiteFrame;
}

const ribbonAssembler = {
  createData(ribbon: HealingRibbon) {
    const data = ribbon.requestRenderData();
    data.dataLength = HEALING_RIBBON_MAX_VERTICES;
    data.resize(HEALING_RIBBON_MAX_VERTICES, INDICES.length);
    data.chunk.setIndexBuffer(INDICES);
    return data;
  },
  updateRenderData(ribbon: HealingRibbon) {
    const data = ribbon.renderData, frame = ribbon.spriteFrame;
    if (!data || !frame) return;
    const source = ribbon.geometry.vertices, buffer = data.chunk.vb, stride = data.floatStride;
    for (let i = 0; i < HEALING_RIBBON_MAX_VERTICES; i++) {
      const from = i * 6, to = i * stride;
      data.data[i].x = source[from]; data.data[i].y = source[from + 1];
      buffer[to + 3] = .5; buffer[to + 4] = .5;
      buffer[to + 5] = source[from + 2]; buffer[to + 6] = source[from + 3];
      buffer[to + 7] = source[from + 4]; buffer[to + 8] = source[from + 5];
    }
    data.updateRenderData(ribbon, frame);
  },
  updateUVs(ribbon: HealingRibbon) {
    // Sprite.onEnable calls this after an effect pool entry is reactivated.
    const data = ribbon.renderData;
    if (!data) return;
    for (let i = 0; i < HEALING_RIBBON_MAX_VERTICES; i++) {
      const offset = i * data.floatStride;
      data.chunk.vb[offset + 3] = .5; data.chunk.vb[offset + 4] = .5;
    }
  },
  updateColor() { /* Per-vertex color belongs to the original gradient. */ },
  fillBuffers(ribbon: HealingRibbon) {
    const data = ribbon.renderData;
    if (!data) return;
    const chunk = data.chunk, buffer = chunk.vb, matrix = ribbon.node.worldMatrix;
    const source = ribbon.geometry.vertices, stride = data.floatStride;
    const opacity = ribbon.node._uiProps.opacity;
    for (let i = 0; i < HEALING_RIBBON_MAX_VERTICES; i++) {
      const p = data.data[i], index = i * stride;
      let rhw = matrix.m03 * p.x + matrix.m07 * p.y + matrix.m15;
      rhw = rhw ? 1 / rhw : 1;
      buffer[index] = (matrix.m00 * p.x + matrix.m04 * p.y + matrix.m12) * rhw;
      buffer[index + 1] = (matrix.m01 * p.x + matrix.m05 * p.y + matrix.m13) * rhw;
      buffer[index + 2] = (matrix.m02 * p.x + matrix.m06 * p.y + matrix.m14) * rhw;
      buffer[index + 8] = source[i * 6 + 5] * opacity;
    }
    data.vertDirty = false;
    const mesh = chunk.meshBuffer, indices = mesh.iData;
    let offset = mesh.indexOffset;
    for (const index of INDICES) indices[offset++] = chunk.vertexOffset + index;
    mesh.indexOffset += INDICES.length;
  },
};

/** Cocos 3.8.8 native UI triangles; no generated image or per-frame Canvas. */
@ccclass('HealingRibbon')
export class HealingRibbon extends Sprite {
  readonly geometry = new HealingRibbonGeometry();

  protected _flushAssembler(): void {
    // Prevent the UI batcher's uniform alpha pass from replacing ribbon alpha.
    this._useVertexOpacity = true;
    if (this._assembler !== ribbonAssembler) {
      this.destroyRenderData(); this._assembler = ribbonAssembler;
    }
    if (!this._renderData) {
      this._renderData = ribbonAssembler.createData(this);
      this._renderData.material = this.getRenderMaterial(0);
      this._markForUpdateRenderData();
    }
  }

  setStream(p: HealingRibbonState): void {
    this.sizeMode = Sprite.SizeMode.CUSTOM;
    if (!this.spriteFrame) this.spriteFrame = ribbonFrame();
    this.node.getComponent(UITransform)!.setContentSize(Math.abs(p.width), p.height);
    this.geometry.rebuild(p);
    this._markForUpdateRenderData();
  }
}
