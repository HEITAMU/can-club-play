# 第3、5套联合重绘记录

日期：2026-11-21。生成方式：内置 image_gen；原图生成后只作文件复制，不以程序绘画或滤镜改图。

**最终采用状态：** 用户已确认十选一09鹿方向的后半身修正版，并要求将后续定稿替换进棋盘。第3套采用 `celestial-stag-v1`「逐星之鹿」，见 `stag-anatomy-refinement.md`；第5套采用本文件记录的 `celestial-libra-v2`「天秤星衡」。两套均已接入本地、尚未公开发布。沙漏v2/v3/v4方向已被明确撤回，只作历史候选；十稿历史见 `slot3-ten-options-v1.md`。下方的“当前”“最新”“待审”均是当次审稿阶段的历史记录，不覆盖本段采用结果。

天秤运行PNG为 `cocos/assets/resources/art/celestial-libra-v2.png`，与来源 `art-source/candidates/celestial-libra-v2.png` 逐字节一致，1301×1209；源文件字节数与SHA-256保留在下表。网页 `assets/art/celestial-libra-v2.webp` 仅作同尺寸quality95格式压缩，318670字节，SHA-256：`9d60ab03d63613164b0630da68c491e2f115a05bbaed4164e70070a6d54b472d`。内部ID仍为 `tide`，主题顺序、取图与编号方式保持；旧 `celestial-tide-v2` 的PNG和WebP已完整归档。

## 当时要求：创生之柱与银色黑洞的画风

用户在看到二维沙漏与天秤候选后，进一步指定：“参照创生之柱和银色黑洞那两图的风格，不要抄构造”，并追加“沙漏做成倾斜构图”。本节覆盖下方早期生成记录中的“最新”方向。

- 第3套：绿色沙漏v4。用户再次要求倾斜构图后，加强了主体沿左上至右下的对角线倾斜，倾斜发生在二维画面内，保留双胆、细颈和落砂，不使用产品拍摄透视。
- 第5套：深紫天秤座v2。保留正面、左右平衡的独立构造，细化厚涂材质，并清理前稿底部装饰云层。
- 直接风格参考改为已定稿的 `celestial-pillars-v1.png` 与 `celestial-frost-v4.png`。仅借用笔触、厚涂塑形、色彩明暗、金属刻纹、小星星材质与背景质感，不复制柱群、黑洞、盘环、月球、云海或具体星位。
- 保留用户指定的二维厚涂与少量塔罗象征感。绿色和紫色仍各自独立，不能把两个参考的蓝/银/铜配色直接搬过来。
- 编辑目标分别是 `art-source/candidates/celestial-hourglass-v2.png` 与 `art-source/candidates/celestial-libra-v1.png`；输入顺序为目标图、创生之柱、银色黑洞。
- 新版已生成并保存为待审候选。前稿和新版均未定稿，运行资源仍为第3套 `celestial-jade-v1`、第5套 `celestial-tide-v2`。

### 最新候选文件

| 文件 | 尺寸 | 字节数 | SHA-256 |
| --- | --- | --- | --- |
| `celestial-hourglass-v4.png` | 1302×1208 | 2252070 | `44b488f833440e7b57669ac942b35a28118320524f4f5bff2b1b8b450d6970fc` |
| `celestial-libra-v2.png` | 1301×1209 | 2287487 | `7c67d56ff13330f4b5c140d405a47a25641425d4139d3c63e916d8a93b19e8b9` |

原始RGB PNG已逐字节复制至 `art-source/candidates/`。沙漏主体左上至右下倾斜，天秤保留两盘等高的正面结构，背景云层已去除。此处只记录实际产出与检查，不表示用户已经定稿。

### 沙漏v4：再次加强斜向构图

用户再次要求“沙漏做成倾斜构图”。本次以 `celestial-hourglass-v3.png` 为唯一编辑输入，保留绿金配色、二维厚涂、造型与细节，将主体斜向幅度明显加大；提示词目标约45度。完整主体仍在画幅内，没有增加产品镜头透视。天秤v2保持上一轮稿件。v3作为历史前稿保留。

生成标识：`emerald_hourglass_2d_v4`。原始PNG逐字节保存为 `art-source/candidates/celestial-hourglass-v4.png`，尚未定稿或接入。

```text
Use case: precise-object-edit. Edit this existing green-and-gold painted hourglass illustration. Preserve its established two-dimensional thick-painted style, emerald/forest-green and warm-gold palette, brush texture, engraved gold edges, star shapes, material treatment and identity. The user repeats that the hourglass needs a diagonal composition: make the tilt MUCH MORE OBVIOUS than in the supplied image.
COMPOSITION CHANGE ONLY: the whole hourglass should run on a strong 45-DEGREE DIAGONAL from UPPER LEFT to LOWER RIGHT. Put the center of the upper cap near (27% canvas width, 25% canvas height), the waist near the canvas center, and the center of the lower cap near (73% width, 75% height). Its long axis should have nearly equal horizontal and vertical displacement: a bold diagonal, not a slight lean. Top/bottom caps, both side supports, both chambers and the sand flow must all turn coherently as one structurally connected hourglass. Recompose/repaint so the ENTIRE ornamental silhouette remains inside the frame with small comfortable margins. Keep it large and dominant, extending across the diagonal.
This is an IN-PLANE turn within a 2D illustration. Keep the same front-view drawing of the hourglass with thick paint providing volume. Do not invent a new low-angle camera, three-dimensional product perspective, thick plinth, oversized columns, shiny photoreal glass or gemstone surfaces.
Adapt the immediate dark-green background and a few small stars/constellation curves to the stronger diagonal composition, preserving their present visual language and rich painterly texture. Do not rotate the entire canvas or create blank corners. Keep one clear connected golden falling stream through the narrow waist into the lower chamber and the paired rounded chamber structure.
No new subjects, copied nebula pillars, black-hole disks, moons, clouds, words, borders or card frame. Do not redesign the hourglass, change the subject, recolor it, flatten the painted modeling or add elements. Full-bleed opaque artwork at the same near-square landscape aspect ratio, approximately 1302 x 1208.
```

### 基础画风对齐的完整提示词（沙漏v3、天秤v2）

#### 斜向沙漏 · 厚涂风格重绘

槽位：3；生成标识：`emerald_hourglass_2d_v3`；候选文件名：`celestial-hourglass-v3.png`。

```text
Use case: style-transfer. Repaint the first input artwork using the PAINTING STYLE of inputs 2 and 3.
INPUT ROLES: Image 1 is the actual edit target and defines the new subject and its own color identity. Image 2 is the approved Pillars of Creation illustration, and image 3 is the approved silver black-hole illustration. Images 2 and 3 are STRICTLY STYLE/MATERIAL/BRUSHWORK references, not content or composition sources.
The user wants a TWO-DIMENSIONAL illustrated design with volume suggested through thick painted color modeling, with a little symbolic tarot-art feeling. Use the same refined flowing brushwork, layered opaque painted forms, deep colored recesses, luminous but controlled edge strokes, fine engraved-looking metal accents and varied rich pigment background as the two approved references. All volume is painterly, not a 3D product visualization. Surfaces should feel richly painted, with irregular flowing brush planes and local relief detail, not uniformly polished machined gold or a flat vector icon.
Borrow the two references' texture, coherent brush directions, carefully graded colored light/shadow, painted small metallic stars and subtle embedded incisions. Preserve a clear bold foreground subject with strong visual weight. Highlights follow the form, with saturated midtones and meaningful dark sides. Keep the high-quality fine painted finish; no crude oil-paint clumps, noisy speckle or photoreal glass.
DO NOT borrow or recreate either reference's physical construction, composition or recognizable objects: no pillar-shaped nebula columns, no cloud-column trio, no black circular center, no accretion disk, no ring vortex, no lunar body, no cloud banks copied along the lower corners, no reference star placements. Do not simply transplant their blue/silver/copper palette. Use the target's own dominant palette and subject.
No extra subjects, text, tarot-card frame, border, numbers, symbols used as lettering, UI or grid. Full-bleed continuous painting, fully opaque. Keep approximately the target's 1.078:1 near-square landscape canvas proportions.
EDIT TARGET: the green hourglass illustration. Keep the unmistakeable paired chambers, narrow neck, connected delicate support frame, top and bottom ornamental bands, and warm falling star-sand. This remains an hourglass, not a nebula or a gem.
CRITICAL COMPOSITION CHANGE requested by the user: make the hourglass a diagonal composition. Its upper chamber and cap sit toward UPPER LEFT, and its lower chamber and cap sit toward LOWER RIGHT. The long axis leans approximately 23 degrees from upright, within the flat illustration plane. Redraw the surrounding composition to suit this diagonal; do not rotate the whole canvas. Keep the entire hourglass comfortably inside the frame, with all structural parts tilted coherently and connected. Do not introduce looking-up camera perspective or foreshorten it like a photographed product. The hourglass itself dominates about 80% of the canvas.
Repaint the chamber volumes in deep forest green, emerald and subdued jade layers using the approved references' thicker flowing painterly transitions. Their green matter looks opaque and richly colored in the illustrated convention; no white glass reflection stripes or transparent crystal. The star-sand is warm muted gold, with substantial painted flowing masses and one thin continuous stream through the neck into a clear lower mound. Do not turn it into an enormous cloud bank, liquid gemstone, ring or waterfall outside the hourglass.
The frame is still warm gold, now with painterly surface variations, bronze recesses and finely incised highlights embedded along the structural curves, comparable in touch to the gold relief in the approved references. Keep it slender and integral to the hourglass, not bulky furniture columns or a huge plinth.
Preserve a clearly EMERALD GREEN identity, distinct from the other five finished images and the purple Libra companion. Background is deep forest-green pigment with the subtle layered painted depth of the two style references, in green. A few scattered small sculpted-looking painted gold stars and fine curved constellation strokes balance the negative areas; preserve none of the style references' exact arrangements. No moon, additional sphere, pillars or cosmic rings.
```

#### 天秤座 · 厚涂风格重绘

槽位：5；生成标识：`violet_libra_2d_v2`；候选文件名：`celestial-libra-v2.png`。

```text
Use case: style-transfer. Repaint the first input artwork using the PAINTING STYLE of inputs 2 and 3.
INPUT ROLES: Image 1 is the actual edit target and defines the new subject and its own color identity. Image 2 is the approved Pillars of Creation illustration, and image 3 is the approved silver black-hole illustration. Images 2 and 3 are STRICTLY STYLE/MATERIAL/BRUSHWORK references, not content or composition sources.
The user wants a TWO-DIMENSIONAL illustrated design with volume suggested through thick painted color modeling, with a little symbolic tarot-art feeling. Use the same refined flowing brushwork, layered opaque painted forms, deep colored recesses, luminous but controlled edge strokes, fine engraved-looking metal accents and varied rich pigment background as the two approved references. All volume is painterly, not a 3D product visualization. Surfaces should feel richly painted, with irregular flowing brush planes and local relief detail, not uniformly polished machined gold or a flat vector icon.
Borrow the two references' texture, coherent brush directions, carefully graded colored light/shadow, painted small metallic stars and subtle embedded incisions. Preserve a clear bold foreground subject with strong visual weight. Highlights follow the form, with saturated midtones and meaningful dark sides. Keep the high-quality fine painted finish; no crude oil-paint clumps, noisy speckle or photoreal glass.
DO NOT borrow or recreate either reference's physical construction, composition or recognizable objects: no pillar-shaped nebula columns, no cloud-column trio, no black circular center, no accretion disk, no ring vortex, no lunar body, no cloud banks copied along the lower corners, no reference star placements. Do not simply transplant their blue/silver/copper palette. Use the target's own dominant palette and subject.
No extra subjects, text, tarot-card frame, border, numbers, symbols used as lettering, UI or grid. Full-bleed continuous painting, fully opaque. Keep approximately the target's 1.078:1 near-square landscape canvas proportions.
EDIT TARGET: the purple Libra/balance-scale illustration. Keep LIBRA as the unmistakable large foreground subject: a central support, a left-right balanced beam, two coherent chain suspensions and two shallow pans at equal height. Keep its own broad frontal, largely symmetrical construction, clearly independent of the reference subjects.
Repaint the scale using the approved references' flowing, finely layered thick-paint modeling. Give the gold structure expressive brush planes, warm lit edges, darker bronze depth and a limited amount of integrated fine engraving. The outlines and chain connections remain precise and legible. This is still a 2D ornamental painting, not a realistically photographed scale or polished 3D luxury object. Maintain elegant proportions and sufficient substance without heavy furniture-like support columns.
Use rich opaque purple painted insets in the bowls, subdued violet midtones and deep aubergine shadows, along with controlled warm champagne-gold accents. The bowl rims and gold beam should acquire the same tactile brush and modeled relief quality as the approved two images. Do not add gemstones, transparent surfaces or jewelry.
Rework the background as a richly layered dark imperial PURPLE pigment field with subtle directional brush depth, borrowing only the quality of background painting from the approved references. REMOVE the decorative cloud bank currently along the bottom of the target; use quiet dark-purple painted space and a few delicately painted gold star points or constellation curves there. Do not replace those clouds with pillars, a disk, a vortex, a planet or any borrowed source structure. The central scale is the single clear hero.
Preserve a distinctly PURPLE identity. No blue/silver dominance, no orange/copper background, no green. Do not insert an hourglass, whale, Justice figure, sword, moon or zodiac wheel. Keep the two bowls, chain attachment points and central pivot structurally intelligible. Painted illumination adds depth within this frontal composition rather than creating a new camera angle.
```

## 早期过程记录

下文保留原蓝、红、黄作为直接参考时的审稿与提示词历史；其中“当前”仅描述当次阶段，不覆盖上面的最新要求。

## 前一轮要求与状态

用户先要求紫色和青色两套从头重绘，颜色和内容可变，但不能与其他定稿撞色、撞内容。随后要求其中一张为沙漏，另一张再重绘。

首版沙漏被明确否定：“沙漏这张不要，风格已经偏了”。用户补充风格要求：“做成二维的，用厚涂凸显三维感，类似于一点塔罗牌的感觉，用我们定的风格做出来”。另一张巨鲸也被否定，并指定“做成天秤座”。

当前待审候选为：第3套绿色沙漏、第5套深紫天秤座。两张都采用正面二维装饰构图，以手绘厚涂明暗与色块叠压形成体积，金色细节和背景质感以原深蓝、暗红、琥珀三图为标准。塔罗牌仅提供象征性构图参考，不添加卡牌边框、文字、编号或人物。

两张当前均为审稿候选，尚未采用。运行主题仍为第3套 `celestial-jade-v1` 和第5套 `celestial-tide-v2`。不修改内部主题ID、轮换顺序或图块几何，不因生成完成自动替换资源。主页继续搁置。0.8.13尚未发布。

## 风格基准与五套固定图

只给本轮生成器传入以下三张原图作风格和材质参考，不传入被否定的沙漏、鲸鱼、彗星或风暴球：

1. `cocos/assets/resources/art/celestial-mural-v2.png`：深蓝星月。
2. `cocos/assets/resources/art/celestial-ruby-v1.png`：暗红玫瑰。
3. `cocos/assets/resources/art/celestial-solar-v1.png`：琥珀日轮。

另两套稳定主题为 `celestial-pillars-v1`「创生之柱」和 `celestial-frost-v4`「银白引力」。新图避免复制其主体、主色组织和构图；不使用柱状星云、黑洞、月亮填空或大云海。创生之柱保持左上较大星星定稿，银色保持四颗金属质感星星版本。

## 版本与审稿状态

| 方向 | 状态 | 处理 |
| --- | --- | --- |
| 绿色极光、紫色双极星云等 | 历史未采用方向 | 原记录见 `theme3-candidate-redraws.md`；不能当作当前候选 |
| 翡翠彗星、紫色风暴巨行星 | 被后续重绘要求覆盖 | 不接入运行主题 |
| 绿色沙漏首稿 | 用户明确否定画风 | 厚底座、粗柱、产品透视、写实玻璃方向作废 |
| 深紫巨鲸首稿 | 用户明确否定并改为天秤座 | 不接入运行主题 |
| 绿色沙漏二维厚涂稿 | 已生成，待审 | `art-source/candidates/celestial-hourglass-v2.png` |
| 深紫天秤座二维厚涂稿 | 已生成，待审 | `art-source/candidates/celestial-libra-v1.png` |

实际像素尺寸和文件哈希见下表；候选原画已放在 `art-source/candidates/`，不加入 Cocos resources，也不生成运行WebP。

## 候选原画记录

| 文件 | 尺寸 | 字节数 | SHA-256 |
| --- | --- | --- | --- |
| `celestial-hourglass-v2.png` | 1302×1208 | 2361011 | `63345584261c5c2989423cdb2a3cd05fd5dba4227002b4af546da4b3f99aab8f` |
| `celestial-libra-v1.png` | 1301×1209 | 2199890 | `965a3867986aded95542acf60518ab4bee406962f5837052048fa28e93d5337c` |

两张均为原始RGB PNG，逐字节复制保存，没有裁切、缩放、重绘、压缩转换或写入运行主题。图片生成完成不表示用户已定稿。

## 前一轮完整提示词

### 绿色沙漏 · 二维厚涂

槽位：3；生成标识：`emerald_hourglass_2d_v2`。

```text
Use case: stylized-concept. Paint a new artwork in EXACTLY the established illustrated style of the three supplied references: blue celestial compass, red rose, amber sun. They are style/material references ONLY.
The user's key instruction: TWO-DIMENSIONAL ornamental painting, with painted volume created by thick painterly color modeling, a little of the symbolic composition and gravitas of a tarot illustration. This is a flat front-facing illustrated composition. Shallow relief is an ILLUSION painted within the shapes using warm highlights, rich darker sides and layered color planes. Preserve the originals' clean softly blended brush finish, saturated opaque color fields and fine crafted gold edges. It must not look like a 3D object or luxury product rendered in front of a camera. No forced perspective, foreshortening, PBR reflections, ray tracing, realistic glass or visible underside of large pedestals.
The three references define the art direction: deep rich painted background, a distinct large symbolic foreground subject, graceful but confident silhouette, carefully modeled champagne-gold details with short precise leaf/scroll incisions, dark bronze shading in recesses, restrained hand-painted highlights. Use broad coherent colored masses. No plastic, woodgrain, gemstone facets, transparent crystal, thick cloudy fog, photoreal texture, glitter or graphic flat-vector fills. Do not copy a reference's compass, rose, sun, cloud banks, moons or composition.
Full-bleed continuous illustration about 1302 x 1208 pixels, near-square landscape 1.078:1, fully opaque. Tarot-like compositional clarity WITHOUT a card border, frame, text, numbers, lettering, zodiac labels, UI or grid. A few small dimensional painted gold stars and fine constellation lines may accompany the subject. They must use the originals' sculpted-looking PAINTED material, not flat light effects. No characters, weapons, dragons, animal, planet or black hole.
SUBJECT: an unmistakable large HOURGLASS, front-facing and upright, composed like a majestic symbolic illustration. Dominant deep emerald / forest green background, jade green colored masses and warm gold details. No cyan, navy or yellow-dominant ground.
Show two broad rounded chambers converging to a narrow waist, with a clear thin stream of golden star-sand passing through the neck. The upper sand mass is distinct from the lower accumulated mound. Paint the sand as smooth warm-gold layered pigment forms with a small amount of granulated brush detail, not bright glitter or hundreds of hard sparkles.
The silhouette occupies about 82% of image height and 65% of width. The top and bottom are shallow elegant curved gold bands, almost frontal. Two slim slightly curved ornamental gold supports connect them, with integrated shallow relief engraving. The supports should be graceful structural strokes similar in thickness and craftsmanship to the gold stems in the red reference; absolutely no bulky furniture legs, lathe-turned columns or thick round platforms. Do not show the bottom surface of a cylindrical plinth.
The chambers are stylized painted jade-green forms bounded by delicate modeled gold contours. Indicate their volume with darker green side bands and softly illuminated green planes, rather than a shiny transparent glass vessel. Keep the shapes harmonious, opaque in overall painted feeling, and clear around the central neck. The falling sand and lower mound remain readable through illustration convention, not realistic optical transparency.
Use modest asymmetry in a few surrounding four-point gold stars and a fine flowing constellation line to balance the central vertical subject. The background remains softly varied dark green pigment of the same richness as the original blue/red/amber backgrounds. No corner cloud masses or moon. Keep a clean ceremonial emblem feeling, with painted depth and beautiful colored surfaces, not a photographed timepiece.
```

### 紫色天秤座 · 二维厚涂

槽位：5；生成标识：`violet_libra_2d_v1`。

```text
Use case: stylized-concept. Paint a new artwork in EXACTLY the established illustrated style of the three supplied references: blue celestial compass, red rose, amber sun. They are style/material references ONLY.
The user's key instruction: TWO-DIMENSIONAL ornamental painting, with painted volume created by thick painterly color modeling, a little of the symbolic composition and gravitas of a tarot illustration. This is a flat front-facing illustrated composition. Shallow relief is an ILLUSION painted within the shapes using warm highlights, rich darker sides and layered color planes. Preserve the originals' clean softly blended brush finish, saturated opaque color fields and fine crafted gold edges. It must not look like a 3D object or luxury product rendered in front of a camera. No forced perspective, foreshortening, PBR reflections, ray tracing, realistic glass or visible underside of large pedestals.
The three references define the art direction: deep rich painted background, a distinct large symbolic foreground subject, graceful but confident silhouette, carefully modeled champagne-gold details with short precise leaf/scroll incisions, dark bronze shading in recesses, restrained hand-painted highlights. Use broad coherent colored masses. No plastic, woodgrain, gemstone facets, transparent crystal, thick cloudy fog, photoreal texture, glitter or graphic flat-vector fills. Do not copy a reference's compass, rose, sun, cloud banks, moons or composition.
Full-bleed continuous illustration about 1302 x 1208 pixels, near-square landscape 1.078:1, fully opaque. Tarot-like compositional clarity WITHOUT a card border, frame, text, numbers, lettering, zodiac labels, UI or grid. A few small dimensional painted gold stars and fine constellation lines may accompany the subject. They must use the originals' sculpted-looking PAINTED material, not flat light effects. No characters, weapons, dragons, animal, planet or black hole.
SUBJECT: LIBRA, represented by one magnificent classical balance-scale symbol in a cosmic ornamental illustration. No human Justice figure. Dominant saturated deep imperial purple / aubergine background, darker violet and muted amethyst painted areas, warm champagne-gold details. No blue, red or orange dominant palette and no pastel pink.
Composition is straight-on and broadly horizontal, with a central elegant vertical gold support and a gracefully arched horizontal balance beam extending far left and right. Two distinct shallow scale pans hang at equal height from fine gold paired chains, one on each side. The scale mechanism is visually coherent and legible: the beam pivots at the center; the chains descend from the two beam ends into the two bowls. Pans remain clearly separated from the background. The balanced left/right silhouette fills about 83% of the width and 72% of the height.
Paint the central spine and beam as elegant gold forms with subtle curved contours, shallow inset scroll/leaf relief, warm highlighted edges and dark copper recesses. The central finial is a small restrained pointed gold flourish. Keep it subordinate to the whole balance symbol. The foot is a compact ornamental curl, not a solid furniture pedestal. All parts stay in the picture plane: no looking up at an object, no exaggerated foreshortening, no photographic product render.
The two bowls have rich opaque purple inset surfaces and precise thin modeled gold rims. Their lower shells carry a small amount of carved pattern in the same painted gold as the original series. Do not make bowls of crystal or gems, do not fill them with jewels, and do not wrap the whole design in a circle or a star compass.
Fine gold constellation strokes with small modeled star points around the open spaces support the celestial identity, but the scales remain the clear large foreground subject. Keep these marks sparse and compositionally distinct from the other references. No moon, sun, planet, black hole, cloud columns, rose, comet, whale, hourglass, sword, wings or zodiac wheel. Aim for the symbolic dignity of a tarot painting, with the exact refined thick-painted modeling and material vocabulary of the supplied blue/red/amber set.
```

## 被后续要求覆盖的提示词记录

以下仅为审稿历史，不是当前生成指令。

### 新方案 · 翡翠彗星

生成标识：`emerald_comet_v1`。状态：被后续要求覆盖或明确否定，不采用。

```text
Paint a completely NEW full-bleed artwork for the exact same celestial puzzle series as the three attached images: blue compass, red rose, amber sun. These are the only style references. Match their refined hand-painted illustration, clearly separated strong foreground subject, rich opaque jewel-tone pigment, substantial satin enamel, modeled warm-gold relief details, fine artisan carving, warm upper-left lighting and clean soft-brush finish. The effect is carefully crafted painted art, not photography, not a plain space wallpaper and not a shiny gemstone or transparent glass ornament. Use restrained highlights with no white glass streaks or neon bloom. Keep the distinct main subject readable at thumbnail size.
Canvas approximately 1302 x 1208, near-square landscape 1.078:1, fully opaque. One continuous painting, no border, no numbers, no text, no grid or UI. Do not copy any reference's compass, rose or sun subject. No moon or crescent as filler. No pillars, rolling cloud-sea backdrop, butterfly/wing lobes, fabric ribbons, weapons, dragons, characters, crystal shards, jewelry settings or floating emblems. The background must have the same softly varied painted-pigment richness as the original series, in the new theme's own color. Only a few little sculpted gold stars or subtle constellation marks where needed; use original placements rather than copying an earlier image.
NEW SUBJECT: a monumental COMET, with one large irregular SOLID NUCLEUS and one broad curved tail. The palette is unmistakably DEEP EMERALD / forest green / subdued jade, with warm champagne-gold craftsmanship accents. No cyan or blue dominance, no fluorescent green.
COMPOSITION: the huge asymmetrical, cratered comet nucleus occupies the upper-left third, about 38% of canvas width. It is a substantial dark emerald, irregular rounded body with eroded cavities, overlapping opaque surface layers and a clearly modeled illuminated side and shaded side. It must look massive and weathered, not crystal-cut, not a jewel, not a polished glass marble. Its own distinctive rounded/craggy silhouette is immediately readable.
From behind the nucleus, ONE connected broad tapering fan of material sweeps diagonally through the center toward the LOWER-RIGHT, reaching close to the corner. The tail is a thick, confident flowing mass with varied jade-green painted bands and a few brighter textured ridges; internal movement follows the same direction and stays subordinate to the large nucleus. Show a natural comet head-plus-tail relationship and immense cosmic motion. No three separate parallel ribbons, wispy aurora curtains, thin feather plumes or straight blade shapes.
Treat a few ridges and the nucleus's natural layered contours with precise, locally engraved warm-gold relief like the reference craftsmanship. Gold details are embedded and irregular, not a full metal mounting around the nucleus. The tail has a few warm-gold carved highlights within broad green volume, not a continuous decorative ribbon border. The main surfaces are OPAQUE hand-painted green, with satin color depth and subdued glints.
Quiet deep forest-green ground surrounds the silhouette. A handful of small dimensional gold star points and a short asymmetric constellation in the remaining dark area create depth without competing. No other planet, ring, sun, black hole or moon. No giant clouds added to corners. The comet must be the clear foreground subject and fill most of the composition.
```

### 新方案 · 紫曜风暴

生成标识：`violet_storm_planet_v1`。状态：被后续要求覆盖或明确否定，不采用。

```text
Paint a completely NEW full-bleed artwork for the exact same celestial puzzle series as the three attached images: blue compass, red rose, amber sun. These are the only style references. Match their refined hand-painted illustration, clearly separated strong foreground subject, rich opaque jewel-tone pigment, substantial satin enamel, modeled warm-gold relief details, fine artisan carving, warm upper-left lighting and clean soft-brush finish. The effect is carefully crafted painted art, not photography, not a plain space wallpaper and not a shiny gemstone or transparent glass ornament. Use restrained highlights with no white glass streaks or neon bloom. Keep the distinct main subject readable at thumbnail size.
Canvas approximately 1302 x 1208, near-square landscape 1.078:1, fully opaque. One continuous painting, no border, no numbers, no text, no grid or UI. Do not copy any reference's compass, rose or sun subject. No moon or crescent as filler. No pillars, rolling cloud-sea backdrop, butterfly/wing lobes, fabric ribbons, weapons, dragons, characters, crystal shards, jewelry settings or floating emblems. The background must have the same softly varied painted-pigment richness as the original series, in the new theme's own color. Only a few little sculpted gold stars or subtle constellation marks where needed; use original placements rather than copying an earlier image.
NEW SUBJECT: a colossal UNRINGED STORM GAS GIANT, a single opaque powerful planetary globe with richly modeled atmosphere. The palette is unmistakably deep IMPERIAL PURPLE / smoky amethyst / dark grape, with restrained antique-gold details. No blue/cyan dominance, no red/orange dominance, no pink or fluorescent violet.
COMPOSITION: one huge complete spherical planet occupies roughly 75% of the canvas, centered slightly left and slightly above middle. Show its full clean circular silhouette with a small margin around it. Upper-left light, a rich broad shaded lower-right side and a subtle atmospheric edge establish enormous spherical volume. This is a strong foreground celestial body, not a tiny planet on a nebulous background. NO rings around the planet and no orbit lines encircling it.
Across the spherical surface flow broad, substantial purple atmospheric bands that visibly curve with the globe's latitude and perspective. Two or three unequal elliptical storms and a clearly defined larger sweeping storm pattern on the lower-left hemisphere create distinctive sculptural detail. Paint these as thick, smooth but tactile opaque color layers with rounded relief crests, controlled dark recesses and subtle fine brushwork. No crystalline facets, glass transparency, liquid marble sheen, white reflected window highlights or jewel shine. The planet has the weighted, hand-modeled depth of the reference art, using purple colored matter instead of light effects.
Integrate selective fine shallow GOLD engraving into a few raised storm ridges, like the artisan detail of the blue/red/amber images. Keep these accents local and elegant, not outlines enclosing every stripe. Do not wrap the whole planet in a gold rim, cage or jewelry mount. The sphere's diffuse light/shadow remains the primary volume cue.
Background: dark plum-purple painted enamel/pigment, saturated and softly textured like the original blue/red/amber backgrounds. A few small sculpted four-point gold stars and an understated short constellation can balance the open right edge. No other sphere, moon, satellite, sun, black hole, cloud sea or massive background fog. No space hardware. The broad atmospheric flow and storms give this single monumental planet its own identity, distinct from a ringed planet, a black hole, pillars, compass, rose or sun emblem.
```

### 翡翠星砂 · 沙漏

生成标识：`emerald_hourglass_v1`。状态：被后续要求覆盖或明确否定，不采用。

```text
Use case: stylized-concept. Create a new complete painting for the same celestial puzzle series as the three supplied reference images.
Input roles: the blue compass, red rose and amber sun are STYLE AND MATERIAL REFERENCES ONLY. Match their refined hand-painted modeled gold, rounded bevels, shallow carved scrollwork, rich painted color fields and clearly readable large foreground subject. Do not copy their subjects or compositions.
NEW SUBJECT: a monumental CELESTIAL HOURGLASS, an unmistakable physical hourglass with two broad rounded chambers meeting at one narrow neck, substantial upper and lower caps, and two strong supporting side columns. Large, confident, elegant and imposing. It floats in a deep emerald painted cosmos. The hourglass is the main subject, not a small prop.
Composition: one full uncut hourglass occupying about 88% of the height and 66% of the width, in a gentle three-quarter view tilted about 10 degrees clockwise, giving depth to the cap ellipses and carved side supports. The lower cap is closer. Keep the two chambers, neck and falling stream clearly visible; no overlapping star ornaments hide the structure.
The frame is substantial sculpted warm gold with the same satin highlights, darker bronze side planes, rounded edges and precise shallow leaf/scroll engraving as the original series. Rich dark emerald inlaid panels on the caps establish the green color identity, but do not use faceted gems or dangling jewelry. The silhouette should feel architectural and timeless, with a few graceful curves and strong proportions.
Inside, a dense mass of warm golden star-sand in the upper chamber tapers to the neck. A thin uninterrupted golden sand stream falls into a visibly accumulated conical sand mound in the lower chamber. The sand has weight, small irregular painted granules, warm midtones and local highlights; no luminous fog or cloud columns. Suggest immense cosmic time through this simple strong motif.
The chamber envelope is deeply shaded green and softly painted, with only quiet contour highlights so the sand remains legible. Do not render sparkling transparent crystal, glassy white streaks, polished-gem optics, glossy product photography or a jewelry pendant. Opaque painted masses and modeled metal carry the image; restrained reflected light only.
Palette: dominant deep EMERALD and forest green, middle jade green, warm antique gold accents. No cyan/blue dominance, no fluorescent green. Background is a rich softly varied opaque dark green pigment field, matching the quality and density of the original blue/red/amber backgrounds. Add a few small dimensional gold four-point stars of different sizes and one short asymmetrical constellation in the open areas, with sculpted material rather than flat glow.
No moon, crescent, compass, rose, sun face, planets, black hole, comet, butterfly nebula, large cloud banks, pillars, weapons, dragons, characters, lettering, numbers, logo, UI, border or grid. Avoid overdecorating every surface or surrounding the hourglass with ribbons.
Full-bleed continuous artwork, fully opaque, approximately 1302 by 1208 pixels, near-square landscape aspect 1.078:1. Match the supplied series' refined clean painted finish, detailed but coherent, strong foreground-to-background separation, warm upper-left illumination.
```

### 紫宙巨鲸

生成标识：`violet_cosmic_whale_v1`。状态：被后续要求覆盖或明确否定，不采用。

```text
Use case: stylized-concept. Paint a new complete artwork for the exact same celestial puzzle series as the three attached style references: blue compass, red rose, amber sun.
Input roles: these three images are STYLE AND MATERIAL references only. Match their clean refined hand-painted illustration, substantial modeled forms, rich opaque satin color, warm sculpted gold, crisp rounded bevels, shallow artisan engraving, restrained fine brushwork and strongly separated dominant foreground subject. Do not copy the compass, flower, sun, their outlines or their compositions.
NEW SUBJECT: a single monumental COSMIC WHALE swimming through a quiet deep-purple star field. This is a fantasy celestial emblem, not a scientific space photograph. Make it immense, dignified and powerful, with the substantial proportions of a great whale. One complete animal, a broad blunt head, thick torso, correctly connected pectoral flippers, a narrowing tail stock and a large horizontal split tail fluke. Small understated eye, closed mouth, no smiling face. No baby proportions or cute cartoon expression. No horns, scales, claws, wings, armor or dragon features.
COMPOSITION: a strong ascending diagonal silhouette occupying roughly 85% of the canvas width and 75% of its height. The massive head and ribbed throat are nearer at lower-left; the body curves gradually toward the upper-right where the entire tail fluke remains clearly visible. Show a three-quarter side view with real depth, one broad foreground pectoral fin sweeping downward and the far fin subtly visible behind the body. The head feels heavy and larger in perspective; the entire silhouette has generous breathing room. The eye is a small detail, not the focal point. Emphasize the whale's broad body and monumental mass rather than long decorative ribbons.
COLOR AND SURFACE: dominant deep imperial PURPLE, dark aubergine and clear muted violet midtones on the whale and background, with selective warm champagne-gold detail. No blue/cyan dominance, no rosy pink palette, no white/silver body. The whale is richly opaque, with smooth rounded volumes and carefully painted satin enamel-like shading. No translucency, no glass streaks, no gem facets, no wet photographic skin. Keep highlights warm and softly shaped, with rich colored shadows and clear modeling.
A few natural throat grooves and the strongest fin/tail crests carry fine gold relief, integrated into the form like the crafted details in the supplied original series. The gold has raised ridges, warm highlights and dark copper side planes. Local shallow scroll engraving follows the anatomy on selected ridges. Do not paste isolated gold leaves onto the body, outline every contour, cover it in tattoos, or cage the whale in decorative jewelry. Most of the body remains beautiful substantial purple painted matter.
BACKGROUND: a saturated deep plum-purple painted pigment field with restrained soft variation, equal in quality and richness to the original blue/red/amber backgrounds. Use only a few small dimensional four-point gold stars of varied size and a short subtle constellation in open areas. No moon, planet, comet, sun, black hole, large circles, orbit cage, galaxy disk, pillars, clouds, ocean waves, horizon, landscape, fabric ribbons or magical glowing trails. The surrounding space stays quiet so the whale is a clear foreground subject.
No human, weapon, dragon, gem, necklace, text, numbers, logos, frame, grid or UI. The mood is vast, majestic cosmic motion and quiet power. Fully opaque full-bleed continuous art, approximately 1302 x 1208 pixels, near-square landscape aspect ratio 1.078:1. Warm upper-left illumination and the same refined hand-crafted finish as the three supplied references.
```
