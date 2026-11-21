// Shared by the web preview and Cocos. Coordinates use x right / y down.
// The puzzle moves whole illustrated tiles; their artwork remains upright.
// A deliberate page-turn pace: 120ms focus, 960ms travel, 120ms soft landing.
export const TURN_DURATION_MS = 1200;
export const TURN_KEYFRAME_COUNT = 49;

const clamp01 = value => Math.max(0, Math.min(1, value));
const smooth = value => { const t = clamp01(value); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

/** Rectangles must follow the clockwise order used by Core.SQUARES. */
export function createTurnMotion(rects, direction = 1, pivot) {
  if (!Array.isArray(rects) || rects.length !== 4 || rects.some(r =>
    !r || ![r.x, r.y, r.width, r.height].every(Number.isFinite) || r.width <= 0 || r.height <= 0)) {
    throw new TypeError('A turn needs four positive tile rectangles.');
  }
  const tiles = rects.map(r => ({ ...r, cx: r.x + r.width / 2, cy: r.y + r.height / 2 }));
  const center = pivot && Number.isFinite(pivot.x) && Number.isFinite(pivot.y)
    ? { x: pivot.x, y: pivot.y }
    : { x: tiles.reduce((n, r) => n + r.cx, 0) / 4, y: tiles.reduce((n, r) => n + r.cy, 0) / 4 };
  return {
    tiles, pivot: center, direction: direction < 0 ? -1 : 1,
    radiusX: Math.max(1e-6, (Math.max(...tiles.map(r => r.cx)) - Math.min(...tiles.map(r => r.cx))) / 2),
    radiusY: Math.max(1e-6, (Math.max(...tiles.map(r => r.cy)) - Math.min(...tiles.map(r => r.cy))) / 2),
    bounds: {
      left: Math.min(...tiles.map(r => r.x)), top: Math.min(...tiles.map(r => r.y)),
      right: Math.max(...tiles.map(r => r.x + r.width)), bottom: Math.max(...tiles.map(r => r.y + r.height)),
    },
  };
}

/**
 * Sample one of the four tiles. A short focus and landing bracket the quarter
 * orbit. Fit all four upright rectangles together so neither the board mask nor
 * a neighbouring tile can clip their artwork at the middle of a turn.
 */
export function sampleTurn(motion, index, progress) {
  const t = clamp01(Number.isFinite(progress) ? progress : 0);
  const travel = smooth((t - .1) / .8);
  const focus = smooth(t / .1) * smooth((1 - t) / .1);
  const arc = motion.direction * Math.PI / 2 * travel;
  const pulse = Math.sin(Math.PI * travel);
  const radiusScale = 1 - .06 * pulse * pulse;
  const { tiles, pivot, radiusX, radiusY, direction, bounds } = motion;
  const samples = tiles.map((source, i) => {
    const target = tiles[(i + direction + 4) % 4];
    const nx = (source.cx - pivot.x) / radiusX;
    const ny = (source.cy - pivot.y) / radiusY;
    const endX = -direction * ny * radiusX;
    const endY = direction * nx * radiusY;
    // Tiny corrections account for the reference art's unequal rows/columns
    // and its hand-drawn pivot, while preserving the exact destination rectangle.
    const correctionX = (target.cx - pivot.x - endX) * travel;
    const correctionY = (target.cy - pivot.y - endY) * travel;
    return {
      x: pivot.x + ((nx * Math.cos(arc) - ny * Math.sin(arc)) * radiusX + correctionX) * radiusScale,
      y: pivot.y + ((nx * Math.sin(arc) + ny * Math.cos(arc)) * radiusY + correctionY) * radiusScale,
      width: lerp(source.width, target.width, travel),
      height: lerp(source.height, target.height, travel),
    };
  });
  // Ease the lift in/out, then apply a common safe fit. Using the same factor
  // prevents one tile from changing size independently of the other three.
  let fit = 1 - .32 * pulse - .025 * focus;
  for (const r of samples) {
    fit = Math.min(fit,
      2 * (r.x - bounds.left) / r.width, 2 * (bounds.right - r.x) / r.width,
      2 * (r.y - bounds.top) / r.height, 2 * (bounds.bottom - r.y) / r.height);
  }
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
    const first = samples[a], second = samples[b];
    fit = Math.min(fit, Math.max(
      2 * Math.abs(first.x - second.x) / (first.width + second.width),
      2 * Math.abs(first.y - second.y) / (first.height + second.height)));
  }
  fit = clamp01(fit);
  const source = tiles[index], sampled = samples[index];
  return {
    x: sampled.x, y: sampled.y, dx: sampled.x - source.cx, dy: sampled.y - source.cy,
    scaleX: fit * sampled.width / source.width, scaleY: fit * sampled.height / source.height,
    angle: direction * 90 * travel, focus,
  };
}
