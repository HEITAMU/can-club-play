# 创生之柱与绿色候选追加重绘

版本：0.8.13（本地待发布）；日期：2026-11-21。

## 用户决定与采用范围

- 第5套青色、第7套银色曾确认初稿可用；第7套当前运行细化稿 `celestial-frost-v4`，见 `silver-gravity-refinement.md`。第3套鹿后半身修正版现已获用户确认，并与第5套天秤一同接入本地：`celestial-stag-v1`「逐星之鹿」、`celestial-libra-v2`「天秤星衡」。本文件记录早期生成，当前采用状态见 `stag-anatomy-refinement.md` 与 `themes-3-5-fresh-redraws.md`；尚未公开发布。
- 第4套紫色星系重新绘为「创生之柱」，颜色不限，运行资源为 `celestial-pillars-v1`；内部主题ID仍为 `amethyst`，顺序与日期映射保持。
- 第3套初版「翡翠极光」保存为 `art-source/candidates/celestial-jade-aurora-v2.png`，用户随后指出画风偏离，已标记为未采用历史候选，从未写入主题表或运行资源目录。当时继续使用的 `celestial-jade-v1` 现已由鹿定稿替换并归档。后续方向的历史与当前状态见文末。
- 两张都以原深蓝、暗红、琥珀的金属浮雕、精细刻纹、暖金倒角和珐琅层次为主要美术标准。
- 初稿生成期间用户补充“不要每个都加那个月亮”。因此两张均额外进行局部编辑，移除左上装饰月亮，保留三柱/极光主体；后续不得把月牙当作所有主题的固定组件。
- 主页继续搁置。

## 创生之柱与绿色初稿的参考分工（历史）

风格参考依序为 `celestial-mural-v2.png`、`celestial-ruby-v1.png`、`celestial-solar-v1.png`。绿色另使用旧绿色原图作为配色和材质参考，替换其枝树主体。创生之柱只取NASA照片中的三根高低不一、斜向伸展的气柱轮廓，不照搬摄影噪粒或写实摄影材质。

NASA原始参考：[Pillars of Creation (NIRCam Image)](https://science.nasa.gov/asset/webb/pillars-of-creation-nircam-image/)。参考图署名：NASA, ESA, CSA, STScI；图像处理 Joseph DePasquale、Anton Koekemoer、Alyssa Pagan（STScI）。项目插画为按参考重新生成的风格化作品。

## 生成方式与文件

内置 image_gen，以本地参考图进行生成，再用同一工具局部移除月亮。背景不透明。用于运行的PNG保留生成原文件，WebP仅同尺寸格式压缩；绿色候选不压入运行包。初轮紫色星系PNG/WebP转移到 `art-source/archive/` 供回溯。

## 完整初稿提示词

### 创生之柱

```text
Create ONE finished continuous full-bleed illustration for an existing premium celestial puzzle-art series. Canvas target 1302 x 1208, near-square landscape aspect 1.078:1, opaque.
CRITICAL STYLE AND MATERIAL LOCK: Reference images 1 (blue), 2 (red), and 3 (amber) are the authoritative art direction. Match their SAME hand-painted, sculpted bas-relief rendering, crisp dimensional beveled champagne-gold metal, recessed fine engraved ornament, rich smooth translucent enamel, layered rounded volumes, controlled warm specular highlights, deep clean jewel-tone shadow, subtle fine brush texture, and visually clear foreground/background separation. It must look painted by the SAME artist in the SAME collection. The original images' precise crafted surfaces and large readable ornamental masses matter more than astronomical realism. Same level of dimensional modeling and ornate detail as the blue compass, red rose, and amber sun. Do not merely place gold lines over a photograph.
The emotional register is immense, majestic cosmic scale and elemental power. The subject is a celestial phenomenon. No people, humanoids, weapons, dragons, creatures, armour, buildings, jewelry pendants, text, numbers, logo, watermark, UI, outer frame, panel divisions, or baked-in 3x3 grid. Not a photo, not a noisy astronomy poster, not flat vector art, not blurry glow, not chrome 3D product rendering. Sparse carefully placed four-point gold stars, thin gold celestial orbit arcs and tiny gold beads can repeat the collection vocabulary. Compose a single connected mural with distinct substantial shapes reaching multiple regions so later nine puzzle crops remain informative. Do not repeat any existing reference's central subject.
TASK: Redraw the rejected purple galaxy theme as PILLARS OF CREATION, with no obligation to use purple. Reference image 4 is an actual nebula and is ONLY a silhouette/subject reference; NEVER adopt its photographic surface, noisy starfield or sharp camera diffraction.
Translate its recognizable THREE colossal irregular dust-and-gas columns into the materials and painting language of images 1–3. The formation rises diagonally from a broad connected bank across the lower-left and bottom toward the upper-middle/right. One very large tall column dominates, two narrower shorter columns stand farther right; irregular rounded wind-carved pillar crowns and luminous ragged gas edges, tips fully visible. Clearly towering nebular gas formations, not literal stone pillars, architecture, trees, hands, horns, flames or animals. Give the columns layered smoky enamel volumes in burnished copper, ochre and antique gold, deep bronze shadow and luminous amber inner seams, selected sculpted gold rim ridges and finely engraved gilded contours that use the reference series' craftsmanship. Large clean sculptural masses with atmospheric wisps only at the edges, not uniformly mushy clouds.
Surround them with deep ink-blue/petrol-blue celestial enamel space, subtle turquoise backlighting between columns and a few distant small starbursts for astonishing scale. Keep visible dark-blue channels separating the three spires. Arrange a small engraved gold crescent near the upper-left and restrained sweeping thin orbit arcs in background open areas to bind the piece to the same series. Lower corners hold connected stylized blue/bronze cloud relief, without ornamental flowers or ribbon loops. Golden lighting from above-left. Restrained, strong, monumental, legible, with crafted surface texture equally close to the original blue/red/amber art. One image only.
```

### 翡翠极光候选

```text
Create ONE finished continuous full-bleed illustration for an existing premium celestial puzzle-art series. Canvas target 1302 x 1208, near-square landscape aspect 1.078:1, opaque.
CRITICAL STYLE AND MATERIAL LOCK: Reference images 1 (blue), 2 (red), and 3 (amber) are the authoritative art direction. Match their SAME hand-painted, sculpted bas-relief rendering, crisp dimensional beveled champagne-gold metal, recessed fine engraved ornament, rich smooth translucent enamel, layered rounded volumes, controlled warm specular highlights, deep clean jewel-tone shadow, subtle fine brush texture, and visually clear foreground/background separation. It must look painted by the SAME artist in the SAME collection. The original images' precise crafted surfaces and large readable ornamental masses matter more than astronomical realism. Same level of dimensional modeling and ornate detail as the blue compass, red rose, and amber sun. Do not merely place gold lines over a photograph.
The emotional register is immense, majestic cosmic scale and elemental power. The subject is a celestial phenomenon. No people, humanoids, weapons, dragons, creatures, armour, buildings, jewelry pendants, text, numbers, logo, watermark, UI, outer frame, panel divisions, or baked-in 3x3 grid. Not a photo, not a noisy astronomy poster, not flat vector art, not blurry glow, not chrome 3D product rendering. Sparse carefully placed four-point gold stars, thin gold celestial orbit arcs and tiny gold beads can repeat the collection vocabulary. Compose a single connected mural with distinct substantial shapes reaching multiple regions so later nine puzzle crops remain informative. Do not repeat any existing reference's central subject.
TASK: A new GREEN candidate in this series, an immense EMERALD AURORA OVER A PLANETARY HORIZON. Reference image 4 is the old green theme; preserve its deep forest-green and luminous jade/emerald palette and its green enamel/gold material family, but replace the tree-and-leaves subject completely.
A vast dark emerald planetary limb curves across the lower half of the canvas, seen from far out in space, with a thin luminous pale-jade atmospheric rim and broad sculpted cloud shapes modeled in layered polished translucent enamel. Over its northern horizon rises a monumental auroral crown: three broad sweeping, dimensional emerald plasma curtains arch from lower-left through the center to upper-right, with clear folds and a controlled glowing jade core, suggesting colossal magnetic forces and scale. Make the aurora feel like a huge cosmic energy field, not fabric, satin ribbons, foliage, feathers or decorative vines. Its main contoured edges are translated into raised, finely chased warm gold relief, using exactly the engraved/beveled artisan detailing of images 1–3; the interiors have deep smooth emerald enamel thickness and restrained pearlescent jade highlights. Strong broad flowing forms, crisp relief depth, calm but commanding.
The deep black-green upper space has a small distant crescent/planet near the upper-left, sparse sculpted four-point gold stars and two very fine gold orbital arcs with tiny beads. Keep the dominant field emphatically GREEN, not cyan, blue or pastel. Balance dark forest-green space with bright gold edges and translucent emerald volumes; no large all-black empty quarter. A few low sculpted cloud relief forms sweep through bottom corners and join the planet shape. Avoid a complete ringed gas giant, since another approved theme already has that subject. No tree, branches, leaves, flowers, crystal clusters, jewelry, weapon or dragon. It should feel grand, strong and cosmic while matching the original blue/red/amber illustration texture closely. One image only.
```

## 局部编辑记录

去月亮版本仅移除各自左上装饰天体，重建原背景；绿色下方大面积行星弧面属于主构图，保留。生成后用户确认创生之柱定稿，并要求在左上再加一颗较大的星星；以局部编辑加入一颗金色四芒星。

### 创生之柱 · 去月亮版

```text
Make a precise localized edit to the attached finished illustration. Completely REMOVE the entire large gold crescent moon in the upper-left corner, including its gold rim, engraved decoration, glow and residual outline. Seamlessly repaint that region as the existing deep ink-blue hand-painted enamel sky, continuing its subtle painterly texture and blue atmosphere. No replacement celestial object: no moon, crescent, round planet, orb, sun, medallion, jewelry or new prominent symbol anywhere in the upper-left. Preserve the existing thin gold orbit lines where they naturally pass through the sky, but do not add an obvious substitute motif. Preserve EVERYTHING ELSE: the exact three colossal bronze/gold Pillars of Creation gas formations, their irregular silhouettes, engraved raised gold edges, layered clouds, warm lighting, copper and blue colors, existing sparse four-point stars and gold beads, lower-corner cloud relief, same composition, canvas aspect and full image dimensions. No crop, no frame, no text, no grid. This is the same illustration with only the unwanted moon removed, not a redesigned scene. The final upper-left must be moon-free.
```

### 翡翠极光 · 去月亮候选

```text
Make a precise localized edit to the attached finished illustration. Completely REMOVE the small circular green moon/planet with the thick engraved golden crescent rim in the upper-left corner, including its disk, crescent, gold engraving, glow and residual circular outline. Seamlessly repaint that region as existing deep forest-green hand-painted enamel space, continuing its subtle painterly texture. No replacement celestial object: no moon, crescent, round planet, orb, sun, medallion, jewelry or new prominent symbol in the upper-left. Preserve the existing thin gold orbit arcs and their trajectory where they naturally continue, but do not add a substitute icon. Preserve EVERYTHING ELSE: exact monumental green aurora curtains and flowing gold engraved relief edges, the large curved planetary HORIZON across the BOTTOM (this bottom horizon must remain), luminous emerald plasma, sculpted jade clouds, existing sparse four-point gold stars and beads, the same deep green/gold palette, modeling, artisan material finish, lighting and composition. Same canvas aspect and full image dimensions, no crop, no frame, no text, no grid. This is the same illustration with only the unwanted upper-left moon removed, not a redesigned scene. Final upper-left must be moon-free.
```

## 当前采用状态

- 创生之柱主体已获用户确认，最终稿按追加要求在左上加一颗较大的四芒星。
- 绿色去月亮初稿尺寸为1301×1209，因用户反馈画风偏离而未采用，不进入运行主题。
- 第3、5套已采用 `celestial-stag-v1`、`celestial-libra-v2`；旧 `celestial-jade-v1`、`celestial-tide-v2` 的PNG和WebP已移入archive。第7套保持 `celestial-frost-v4`。七套主题的内部ID、顺序和轮换保持。
- 公开试玩仍是0.8.12；0.8.13尚未发布。之前直接推送main被自动审批拦截，理由是触发公开发布需要明确授权，不绕过此限制。

## 创生之柱最终加星提示词

用户已确认三柱主体；以下局部编辑产生当前运行定稿 `celestial-pillars-v1.png`（1302×1208）。

```text
Precisely edit the attached approved Pillars of Creation illustration. The user has approved this exact artwork. Make ONLY this single localized addition:
Place ONE larger warm-gold FOUR-POINT STAR in the currently empty upper-left area, centered at approximately 13% of the canvas width and 14% of the canvas height (about x=170,y=170 on this 1302x1208 canvas). It should be noticeably larger than the existing small stars, approximately 150 pixels across and 180 pixels tall, but remain a secondary accent to the colossal gas pillars. Four elegant tapered points, slightly longer vertical tips, a beautifully sculpted beveled gold center, fine shallow carved ridges, warm champagne highlights and a subtle controlled amber halo. Match the existing stars' visual vocabulary and the image's dimensional hand-painted engraved-gold/enamel craft. The new star should read as a strong celestial light with thickness and precise metal facets, not a hanging pendant, medallion, compass dial, weapon or generic flat clipart.
Preserve the dark blue sky around it; place the star without covering existing orbit curves or nearby smaller stars if possible. Preserve EVERY OTHER PART of the image exactly: all three Pillars of Creation shapes, gold engraved ridges, bronze and amber cloud volume, blue channels, existing stars and beads, fine orbit arcs, lower cloud relief, brush texture, lighting, colors, canvas size and framing. Do not add a moon, crescent, round planet or any other object. Do not change the pillar geometry, do not crop, do not add text or a border. One localized extra larger four-point golden star in the upper-left, nothing else.
```

最终PNG保留生成源文件字节，网页WebP只做同尺寸质量95格式压缩。运行资源维持amethyst主题ID，未改变每日轮换。该次加星接入的验证记录：相关主题与连续取图测试5项通过，七套PNG/WebP尺寸均与清单一致；当时青色、银色及其余原图与上一提交逐字节一致。该次未完成新稿的浏览器渲染或Creator/微信真机验收。

## 第3套后续方向历史与当前状态

用户反馈绿色极光画风偏离，随后明确颜色可以不是绿色，以创生之柱的成功质感为准；又要求新图色系与其余主题有明显区别，并可采用已发现的真实宇宙奇观。

因此初版绿色极光不作为选用稿。其后压低荧光的修正版仍偏装饰带，铜金「恒星摇篮」草稿又与创生之柱色系太近；深紫M42稿仍采用大片星云组织画面。用户进一步指出“太背景化”“不要抄创生之柱的元素”。随后曾尝试以NGC 6302清楚的双极轮廓为独立主体，直接使用原蓝/红/黄作为材质参考；该方向也未采用，已被后续要求覆盖。这一阶段的完整审稿记录见 `theme3-candidate-redraws.md`。

彗星、风暴巨行星、巨鲸和沙漏均为历史方向。用户选中09鹿后要求修正后半身，随后确认修正版并要求接入。第3套 `celestial-stag-v1` 和第5套 `celestial-libra-v2` 已正式采用、接入本地但未发布。原10张均保留，最新采用记录见 `stag-anatomy-refinement.md` 与 `themes-3-5-fresh-redraws.md`。
