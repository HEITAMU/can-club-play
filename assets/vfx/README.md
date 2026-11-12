# Painted combat effects

v0.18.0: Cell 0 (the rejected crescent) is retired and absent from `FX_CELLS`.
All physical hits use local contact marks, fragments and dust. Monster normal
attacks share just melee/ranged visuals; each companion normal and skill has an
independent profile in `action-profiles.mjs`. The original atlas is retained so
this change does not require another image download.

Historical notes:

v0.17.1: The crescent was authored with its convex leading edge facing left.
`FX_FORWARD_X.slash` corrects this at draw time before the travel rotation and
team-facing transform. Fish, flames and other right-facing art remain unchanged.
Impact crescents also advance in the attack direction instead of drifting back.

Original v0.16 atlas:

Runtime atlas: `effects.webp` (455,896 bytes); original generated alpha PNG: `source.png`.
The 16 independent painted primitives are cropped by the rectangles in `vfx-atlas.mjs`.
Packing changes format only; the generated alpha and painted pixels are retained.

| Row | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| 1 | Crescent slash | Contact flash | Dust | Ember |
| 2 | Fire comet | Flame plume | Ice spear | Ice fragments |
| 3 | Healing ribbon | Heart | Milk comet | Fish projectile |
| 4 | Open-center shield | Shield fragments | Magic star | Lightning |

`vfx-motion.mjs` samples independent particles at an absolute combat timestamp.
`painted-fx.mjs` paints those samples onto one battle-sized Canvas. Flame and liquid silhouettes deform through 12 textured strips; slash reveals progress with the strike; the wake follows past flight samples instead of repeating whole projectile sprites. It does not use a
sprite flipbook or per-frame DOM particle creation. The persistent shield follows
actual shield values; burns and stun stars follow actual status durations. Cancelled
casts/projectiles stop immediately; completed impacts dissipate independently.

The generated image was checked composited over the game's dark background. Low-alpha
RGB outside the painted shapes may look bright in viewers that ignore alpha; it is
transparent when composited in the game.

Creation: built-in image generation, original game asset, transparent output.
Prompt: one square 4 × 4 equal-grid atlas of isolated gouache-and-ink VFX primitives;
flat hand-painted style, restrained cream highlights and warm brown contours, clear
alpha gutters, no labels/grid/characters/background; the ordered subjects are listed
above. Shield must have a transparent central window. Projectiles face right.

Validation: `node --test tests/*.test.mjs`; `NODE_PATH` may point to the shared runtime
modules for `node scripts/review-vfx.mjs`. The latter draws the same game battle,
character, projectile and particle functions into internal review contact sheets.
