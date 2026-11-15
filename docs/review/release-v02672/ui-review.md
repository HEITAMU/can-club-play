# v0.26.72 H5 UI review

- Removed the battle chapter header; arena pause menu freezes combat and offers resume or return. Activity return preserves the selected commission and difficulty.
- Moved the owned-character horizontal portrait rail under crew navigation. Skills precede breakthrough / signature progression.
- Replaced the equipment display panel with a painted outfitter room; retained five interactive slots and active set effects beneath it.
- Illustrated every commission choice, detail header and difficulty tile. Six hard encounters use distinct location paintings; recruit cards include the existing character portraits. Replaced tier wording with 难度.

## Art

Style reference: assets/scenes/commissions-v02646.webp. Generated with imagegen, preserving ink outlines, warm paper texture, teal shadows and amber lighting; no generated labels or controls.

- equipment-room-v02672.webp: empty cat outfitter room, timber frame, teal plaster, warm lantern at upper right, hanging cloth at edges, centered woven rug; no characters, text or equipment slots. 640×960 WebP.
- quest-locations-v02672.webp: 3×2 location atlas, frost-covered cold-store entrance / canal supply line / iron barricade / alarm bell house / dark railway generator / clockwork tower. 1152×768 WebP, cropped with an inset to prevent panel seams.

## Verification

Browser review with isolated full-roster test state: battle pause freezes HP; resume and return controls work; activity return retains coldstore difficulty 1 without awarding completion. Profile ordering, horizontal portrait rail and equipment layout reviewed at mobile widths including 320px. Six hard encounter cards and their detail/difficulty art reviewed. Fixed legacy multiply background blending and character positioning overrides.

Full regression run: 277/277 tests pass after updating the intentional difficulty-label expectation. Web bundle and WeChat package builds pass. This release's visual redesign targets the H5 interface; no claim of WeChat device visual verification.
