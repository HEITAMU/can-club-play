# 第3套自由题材十选一候选

日期：2026-11-21。生成方式：内置 image_gen，每个候选独立生成一张完整原画。

## 当前状态

用户从十稿选择09「逐星之鹿」方向并指出后半身穿帮后，现已确认修正版。第3套正式采用 `art-source/candidates/celestial-stag-v1.png`，仅修后腰、骨盆和两条后腿，保留前半身与画风；采用记录见 `stag-anatomy-refinement.md`。原10张全部保留为历史候选，09原图为修订前稿，不作为当前运行原画。

第5套 `celestial-libra-v2`「天秤星衡」也已采用，见 `themes-3-5-fresh-redraws.md`。第3、5套已接入本地但未公开发布；旧 `celestial-jade-v1`、`celestial-tide-v2` 的PNG和WebP已完整归档。

## 原始生成要求（历史）

用户已撤掉沙漏方向：“还有一张，你不要做沙漏了，随便什么，跟其他不撞色不撞构图就行，出10张，我挑一张”。本轮属于十选一审稿，不把十张当成十套新增运行主题。沙漏v2/v3/v4仅留作历史。

生成十稿时，另一张 `celestial-libra-v2.png` 深紫天秤尚未明确定稿或接入；当时第3、5套运行仍为 `celestial-jade-v1`、`celestial-tide-v2`，候选没有因生成完成而自动进入运行目录。后续选用结果见上节，主页继续搁置。

## 参考、色系与构图

直接参考 `cocos/assets/resources/art/celestial-pillars-v1.png` 和 `celestial-frost-v4.png` 的二维厚涂、笔触、明暗塑形、局部雕金及背景质感，不复制柱群、黑洞、盘环、月亮、云海和星位。

现有六张的主体分别为蓝色罗盘、红色玫瑰、创生之柱、紫色天秤、黄色日轮、银蓝黑洞。十个候选以未被这六张占用的绿、墨绿、橄榄绿、偏绿黑金为主；十张是互斥备选，绿色系之间接近是为同一个空缺槽位服务，而非十套同时上场。主体与轮廓分别采用风帆、三角弦架、偏心叶扇、斜向书页、长S形、长弧羽面、折返台阶、不完整弧形仪器、横向跃姿、角形迷宫。

保留一点塔罗式象征构图，禁止卡牌外框、文字、编号、UI、宝石透亮和3D商品渲染。绘画里不加题目或选项号，编号仅存在于审稿界面/文件名。

## 原始十稿清单（历史）

候选目录：`art-source/candidates/slot3-ten-options-v1/`。全部为生成原始PNG的逐字节副本，无程序绘画、滤镜、裁切或缩放。10张均已生成、逐张检查并保存，现作为历史候选保留；用户已选09方向，其后半身修正版另存为 `celestial-stag-v1.png` 并采用。04古书、05灵蛇、09跃鹿在十稿交付前已各作一次定向修正，本目录保留的是那一阶段的修正版；09的后半身修复发生在用户选中之后。

| 编号 | 主题 | 文件 | 尺寸 | 状态 |
| --- | --- | --- | --- | --- |
| 01 | 星海帆船 | `01-star-sail.png` | 1302×1208 | 历史备选 |
| 02 | 星弦竖琴 | `02-celestial-harp.png` | 1302×1208 | 历史备选 |
| 03 | 银杏星叶 | `03-ginkgo-leaf.png` | 1302×1208 | 历史备选 |
| 04 | 古星图书 | `04-star-atlas.png` | 1302×1208 | 历史备选 |
| 05 | 墨绿灵蛇 | `05-emerald-serpent.png` | 1302×1208 | 历史备选 |
| 06 | 长羽星翎 | `06-star-feather.png` | 1302×1208 | 历史备选 |
| 07 | 天穹长阶 | `07-celestial-steps.png` | 1302×1208 | 历史备选 |
| 08 | 测星六分仪 | `08-star-sextant.png` | 1302×1208 | 历史备选 |
| 09 | 逐星之鹿 | `09-leaping-stag.png` | 1302×1208 | 方向已采用，此图为修订前稿 |
| 10 | 星穹迷宫 | `10-star-labyrinth.png` | 1302×1208 | 历史备选 |

### 文件校验

| 编号 | 字节数 | SHA-256 |
| --- | --- | --- |
| 01 | 2397289 | `8631929a56eba00b19a9b19e5d1e3d7eca0c6938b5ac33a8da6ad57b7a8dc587` |
| 02 | 2371690 | `a1156433251e7ab25743bfd39fc9c520ca5f316581546bd2f45346269989d515` |
| 03 | 2332981 | `b533123872f7b22ba12ad8c81ef616ef921a4adbfb7a1ea6d2a332829685341e` |
| 04 | 2443813 | `6cd5526fe04ced8f3957d006df18db073f5e90c37d7ef345ff2da1b2d2604a6b` |
| 05 | 2204423 | `92ce6638a9e461a0e1867956794b000a79ffd3a39d570c7726b037bb115d48c5` |
| 06 | 2282318 | `99e28a03b57dd499d2fb072b1a1d1e33b980e9a58a7a349d74ed78e7e49d9635` |
| 07 | 2207360 | `bef1430f2e35c81af3dd9504969ec0483a1b4f2b6996aaf9bbb85d816bd0d38f` |
| 08 | 2294927 | `0cb7b309eeff7eae31a4e1411bba376c69091cc0119d95804d2c7d15e7845ef0` |
| 09 | 2155529 | `cb0e09598b53fe11d53482153e9cae718917df9d84de47eedf522f6e90a7db92` |
| 10 | 2571515 | `bc06a371d340e7d7e3a26cf81eea78304a8766c9afa6f574a22aa3be5a2e3b41` |

## 完整提示词

两张输入图都是风格参考，输入顺序为创生之柱、银色黑洞。

### 01 星海帆船

生成标识：`slot3_ten_01_star_sail`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: a single magnificent unarmed celestial sailing ship, represented as a bold two-dimensional painted silhouette. One large billowing emerald mainsail sweeps from the upper-left toward the center-right, with one smaller triangular foresail offset to its right. The hull forms a broad substantial curved wedge across the lower third, with the prow pointing right. Large unequal sail masses, not a forest of little masts. The sails are opaque deep emerald and moss-green, sculpted by broad flowing painted folds. Local gold seams and engraved hull ridges carry the reference craftsmanship. Make the mast, rigging and hull coherently connected, but subordinate small ropes to the large sails. Deep bottle-green background, olive-green shadowed hull, restrained warm-gold edges. No sea, waves, clouds, people, flags, guns, glowing trails or crescent-shaped hull. It should feel like a grand voyage through space, not a small ship model on a stand.
```

### 02 星弦竖琴

生成标识：`slot3_ten_02_celestial_harp`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: one monumental asymmetric triangular HARP. A broad carved green resonant body rises from lower-left into a proud curving neck at upper-left, and the top beam descends toward the right, making a distinct open triangular silhouette. A coherent fan of fine warm-gold strings connects the neck to the sloping soundboard; the strings remain clearly visible and do not merge into a flat panel. The curved body is rich malachite-green and pine-green painted material with rounded thick-paint shading, and selected edges have fine gold relief. Keep the foot compact and elegant; no heavy furniture pedestal. Frontal ornamental composition, a little diagonal energy, taking about 80% of the canvas, not product photography. Deep spruce-green ground with a few small stars. No performer, lyre symmetry, balanced bowls, feathers, wings, additional instruments or large fog.
```

### 03 银杏星叶

生成标识：`slot3_ten_03_ginkgo_leaf`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: ONE gigantic GINKGO LEAF, treated as a substantial elegant cosmic symbol. Its narrow stem begins in the lower-right and the wide irregular fan-shaped leaf spreads broadly toward upper-left and across the left side. A natural shallow notch at the top and a slightly folded right edge give a distinctive asymmetric fan silhouette, not a flower, tree crown, radial sun or circular badge. The leaf occupies roughly 75% of the image. Dominant deep olive and emerald, with muted fresh-green planes and dark pine-green folds. Broad soft thick-painted undulations give weight; no transparent membrane. Fine selectively raised champagne-gold leaf veins fan organically from the stem; most veins remain painted green and gold is restrained. Dark warm olive-green pigment background. A few tiny gold stars balance the open right margin. No multiple leaves, flower, clouds, jewelry, bright yellow autumn palette or gemstone veins.
```

### 04 古星图书

生成标识：`slot3_ten_04_star_atlas`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: one large ancient open STAR-ATLAS BOOK, in an asymmetric diagonal ornamental composition. The heavy green spine runs from lower-left toward upper-right. The left group of pages spreads broadly toward the left, while the upper-right page curls once over itself, making unequal open shapes rather than two balanced wings. Deep forest-green painted covers and olive-gray parchment pages; keep the pages muted sage/gray-green rather than bright white or yellow, so the full picture is unmistakably green. Show substantial stacked page edges and broad smoothly painted page folds, with local champagne-gold edging and fine incisions in the cover. On the pages, only a sparse arrangement of small stars and a few connecting curves: absolutely no writing, fake letters, numbers, compass circles or diagrams resembling a game grid. Flat illustrated perspective, no photoreal tabletop or product shot. Quiet dark pine-green background; no other book, hourglass, quill, moon, clouds or objects.
```

### 05 墨绿灵蛇

生成标识：`slot3_ten_05_emerald_serpent`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: ONE complete powerful serpent in a long open S-shaped silhouette, with a thick weighty body. The calm closed-mouth head points toward upper-left; the body sweeps right across the upper-middle, bends left through the lower-middle and tapers toward lower-right. Keep the head, neck, body and tail anatomically continuous and readable. Do not coil it into a circle or an ouroboros. Flat decorative side/three-quarter illustration with a small understated eye, not a realistic reptile close-up. Thick opaque forest-green and dark olive painted scales have broad grouped modeling; selected scale ridges catch delicate gold engravings integrated into the form. The body stays mostly green, not plated gold armor. Green-black backdrop with restrained subtle stars. No fangs, attack pose, wings, horns, dragon features, gemstones, multiple snakes, weapons, flowers, pedestal or large smoke.
```

### 06 长羽星翎

生成标识：`slot3_ten_06_star_feather`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: ONE monumental broad FEATHER, strong and dignified rather than delicate. A long gently bowed quill runs from lower-right toward upper-left. The vane on the left is wide and swept outward; the right vane is narrower and partially folded inward, producing a large unequal lance-like feather silhouette with clear soft barbs, not a blade. Use layered deep green-black, moss-green and muted olive painted feather planes. Broad grouped vanes have tactile thick-painted shading and smoothly flowing fine brushwork, not photographic individual hairs. The central shaft and a few vane ridges carry restrained champagne-gold incisions. The feather is opaque, full and rounded, not a glass sheet, jewelry ornament or neon ribbon. Background near-black with a clear dark forest-green cast, lightly textured and punctuated by very few small gold stars. No bird, wing pair, quill ink bottle, peacock eye, gems, moon, ring, sword, cloud plume or blue/silver highlights.
```

### 07 天穹长阶

生成标识：`slot3_ten_07_celestial_steps`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: a single monumental floating STAIRWAY, a clear angular ascending zigzag silhouette through space. It begins as broad emerald steps at lower-left, climbs toward the right, turns once at a substantial mid-level landing, then climbs diagonally back toward upper-left, ending at a short open landing near the top. The complete stair path is coherent and visually continuous; no impossible disconnected steps. Use a flat ornamental illustration with carefully painted plane shading, not a 3D architectural render. Large deep jade-green and moss-green stair planes with dark forest-green risers, fine champagne-gold bevels and very selective shallow carved ornament along one outer edge. The subject occupies about 80% of the picture with strong angular negative spaces. No columns or building, no door or ring portal at the end, no figures, no horizon, no clouds, no waterfalls and no stairwell walls. Quiet nearly black-green painted cosmic background with a few tiny stars. The stairway is the dominant symbolic object, not a tiny path in a landscape.
```

### 08 测星六分仪

生成标识：`slot3_ten_08_star_sextant`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: one ornate celestial SEXTANT, front-facing in the picture plane and tilted diagonally, recognizable as an open triangular measuring instrument rather than a round compass. A single partial arc (no more than a third of a circle) runs from lower-left across the lower-middle toward the right; two unequal diagonal structural arms meet at an upper-left pivot and connect to that curved lower edge. A small side sighting tube and a small rectangular mirror are visibly attached, subordinate to the broad asymmetric triangular open silhouette. Mark the arc only with sparse engraved ticks, no readable numerals. Dominant deep olive-green enamel-like painted body, green-black inset planes and selected warm antique-gold edge ridges. Thick painted modeling, precise local carvings, no photoreal metal. Dark muted olive-green background. No full circular disk, central compass star, concentric rings, balanced bowls, zodiac wheel, glass gem, telescope tripod, weapons or other objects.
```

### 09 逐星之鹿

生成标识：`slot3_ten_09_leaping_stag`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: one powerful mature STAG leaping sideways through space, with a complete full-body silhouette. The head points toward upper-right, the solid torso stretches broadly across the center, the front legs reach forward, and the rear legs tuck back toward lower-left. Strong anatomically coherent shoulder and haunch masses, two connected antlers spreading back toward upper-middle, no front-facing trophy head. Painterly deep spruce-green and moss-green body planes, muted olive highlights and dark forest shadows; no brown/golden or white/silver dominant fur. No individual photoreal hairs: treat the whole animal as an opaque carefully modeled thick-painted figure. A few antler ridges and selected shoulder contours have delicate gold relief integrated into the painting, not armor or jewelry. Small serious eye, calm majestic presence, no smile or cute deer proportions. Deep green-black starfield remains quiet. No forest trees, rocks, landscape, moon, antler halo, weapons, wings or extra creatures.
```

### 10 星穹迷宫

生成标识：`slot3_ten_10_star_labyrinth`。

```text
Use case: stylized-concept. Create ONE new full-bleed painting for an established celestial puzzle-art series.
STYLE REFERENCES: input 1 is the approved Pillars of Creation painting; input 2 is the approved silver-black-hole painting. Borrow ONLY their refined painterly finish, thick painted color modeling, flowing brush planes, rich shaded recesses, selectively luminous edge strokes and delicate integrated metallic engraving. DO NOT borrow their subjects, silhouettes, compositions or palettes.
A TWO-DIMENSIONAL ornamental illustration with a little symbolic tarot-art dignity. Volume is painted through layered color, brushwork and controlled light/shadow, not a 3D product render or a photographic object. Strong, dignified, substantial foreground subject with a distinctive coherent silhouette; no cute expression or delicate jewelry feel. Rich opaque colored matter, not transparent glass, crystal or faceted gemstones. Foreground must read immediately and occupy most of the canvas, with a softly varied darker painted ground. Model the local champagne-gold details as finely painted shallow relief with darker bronze recesses, not a gold cage or pasted-on ornaments.
PALETTE RULE: the image must read principally GREEN, deep forest/emerald/olive, or green-black as specified below. The existing six pictures already occupy blue, red, yellow/amber, purple and silver-blue; do not make those the dominant colors. Gold is an accent, not the entire background. Green background and green foreground should have different values so the subject stays readable.
The image must have its own structure. No hourglass, scales/Libra, rose, compass-star disk, sun emblem, moon, black-hole disk, galaxy vortex, nebula pillars, copied corner cloud banks, weapon, dragon or whale. No large space fog used instead of a subject. Only a few tiny sculpted-looking painted gold stars or subtle constellation marks in remaining open areas. Do not copy exact star placements from either reference.
Full-bleed opaque continuous art, approximately 1302 x 1208 pixels, near-square landscape 1.078:1. No card frame, border, writing, numbers, logos, UI or game-board grid. Do not include more than the one main subject described below.

SUBJECT: one monumental geometric LABYRINTH as a clearly bounded irregular diamond-shaped openwork stone relief floating in a painted green cosmos. A broad continuous maze path winds through four or five large angular turns, with only a few nested corridors, an obvious outer entrance and an off-center final alcove. This is a symbolic ancient labyrinth, not a 3x3 game board, square tile grid or tiny dense schematic. One corner of the outer boundary opens at lower-left; the opposite upper-right corner extends slightly farther so the silhouette is asymmetric. Use flat ornamental axonometric-looking illustration with shallow painted depth only, no photoreal architectural rendering. Substantial opaque dark emerald walls, muted moss-green corridor planes, dark-green recessed shadows and restrained fine champagne-gold bevels on selected edges. No facets that turn the whole object into a gemstone. Keep the maze huge, about 80% of the canvas, its bold angular negative spaces visible at thumbnail size. Background deep green-black with only a few small gold stars. No circular central hole, rings, buildings, towers, figures, chess pieces, text, icons, or other subjects.
```

## 定向修正记录

04降低书脊厚度和近景透视；05移除蛇头后方形似角/鬃的尖金饰；09将长卷尾改为短鹿尾。均通过内置image_gen编辑，未使用程序绘画或滤镜。

### 04 修正

生成标识：`slot3_ten_04_star_atlas_refined`。

```text
Use case: precise-object-edit. Refine this existing green-and-gold star-atlas book illustration. Retain its subject, green/sage-green palette, dark painted background, thick painterly brushwork, local carved gold edging, asymmetric opening and sparse star-map markings. Correct the overly deep product-like perspective: redraw the book as a flatter TWO-DIMENSIONAL decorative illustration, with substantially thinner painted spine and page-stack thickness. Keep the diagonal composition but reduce foreshortening. The page shapes should be broad and clear; make the top-right curl smaller and gentler. Show the complete book silhouette with small margins instead of a cropped close-up. Volume comes only from thick painted light/shadow and subtle edge modeling, not a huge cylindrical binding or a realistic heavy luxury prop. Keep the pages colored muted sage-green and olive-gray with rich colored shadows, not bright white/silver or yellow. Preserve the engraved green cover and the coherent page/spine relationship. No new objects, lettering, page numbers, moons, clouds, card frame or additional symbols. Remain a finely painted celestial-series image, fully opaque, at the same approximately 1302x1208 near-square landscape aspect.
```

### 05 修正

生成标识：`slot3_ten_05_emerald_serpent_refined`。

```text
Use case: precise-object-edit. Make one narrow correction to this existing emerald serpent illustration: REMOVE every raised pointed gold ornament projecting backward from the HEAD and immediately behind the head/upper neck. These currently resemble horns or a dragon mane. Give the snake a smooth natural closed-mouth serpent-head silhouette with ordinary rounded green scales and a small eye. Gold in this head area may appear only as very fine incised lines lying flat within the scales, with NO projecting horns, fins, spines, frills, crest, crown, ears or mane. It must read plainly as a snake, never a dragon. Preserve the entire long S-shaped body, tail, composition, scale modeling, body gold detailing, deep green palette, thick painterly style, background, stars and image dimensions. Do not redesign the snake or change its pose. No new objects, no fangs, no photoreal reptile texture, no border, no text. Only simplify the head and upper-neck silhouette as described.
```

### 09 修正

生成标识：`slot3_ten_09_leaping_stag_refined`。

```text
Use case: precise-object-edit. Correct ONLY the tail anatomy of this existing green-and-gold leaping stag painting. The animal currently has a long raised curling fox-like tail extending leftward from its rump. Remove that long curled tail entirely and replace it with a SHORT natural deer tail, a small tapered tuft attached correctly to the rear of the rump. Fill the vacated tail area with the existing dark green painted background. Preserve the powerful leaping pose, all four legs and hooves, antlers, head, torso, large green painterly planes, selective gold engraving, gold stars, composition and image proportions. Keep the same two-dimensional thick-painted celestial-series style. Do not add a new tail plume, ribbon, wing, dragon feature, background cloud or any new subject. Do not make the body photographic or change the animal into another species. Only shorten and naturalize the tail.
```
