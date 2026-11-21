# 第3套双极星云候选与审稿记录（历史）

日期：2026-11-21；工程版本：0.8.13（本地待发布）。

**已被后续要求覆盖：** 本文件及彗星、风暴巨行星、巨鲸、沙漏均为历史方向。用户现已确认鹿后半身修正版，并采用第3套 `celestial-stag-v1`「逐星之鹿」和第5套 `celestial-libra-v2`「天秤星衡」，两套已接入本地、尚未发布。最新采用记录见 `stag-anatomy-refinement.md` 与 `themes-3-5-fresh-redraws.md`。原10张仍为历史候选，以下参考分工与提示词仅为历史。

## 双极星云阶段的用户要求（历史）

- 原绿色可以重绘为其他颜色，但主色必须与现有蓝、红、黄、青、银及铜金创生之柱有区别。
- 允许选用已发现的真实宇宙奇观作题材。
- 每张要有清楚、独立、占主要画面的主体，不能画成通用星云背景。
- 创生之柱已获确认，但其他图不得抄它的云柱、翻卷云海、构图或星芒安排。系列统一体现在材质与光影。
- 原蓝色、红色、黄色三图是金属倒角、细雕纹、珐琅厚度和手绘质感的主要参考。不把创生之柱整图继续用于第3套新主题的风格转移。
- 不把月亮当作每张必备元素；该阶段双极星云候选没有月亮。
- NGC 6302初稿展示后，用户追加要求：背景色做出与原蓝、红、黄三张相同的感觉。仅调整背景的饱满度、彩色暗部和手绘纹理，保留主体。
- 用户随后指出主体太像宝石、不要透亮。该阶段v3保留背景与主体轮廓，去掉玻璃感和硬切面，改为不透亮的紫色层次与局部金属细节。

## 历史稿与运行边界

`art-source/candidates/celestial-bipolar-v3.png` 是未采用历史稿，不进入运行主题。当前第3套为 `jade / 逐星之鹿 / celestial-stag-v1`，第5套为 `tide / 天秤星衡 / celestial-libra-v2`；已按确认原稿更新显示名、资源名和实际图片尺寸，内部ID与原有顺序保持。旧绿色、青蓝的PNG和WebP完整保存在 `art-source/archive/`。

第4套 `amethyst / 创生之柱 / celestial-pillars-v1` 已按用户确认接入，左上已加一颗较大的金色四芒星。第7套当前运行 `frost / 银白引力 / celestial-frost-v4`，保留已确认构图并已补精细刻纹与金属星芒，见 `silver-gravity-refinement.md`。

## 方向调整

| 草稿 | 结果与判断 |
|---|---|
| 绿色极光初稿（去月亮） | 用户指出画风偏离；亮绿发光带与原系列的厚实色釉不一致，未采用。PNG保留为历史候选celestial-jade-aurora-v2。 |
| 压低荧光的绿色修正版 | 材质有所收敛，但仍以三条装饰带为主体，未接入。 |
| 铜金恒星摇篮 | 颜色过于接近创生之柱，云海主体又偏背景化，未采用。 |
| 深紫M42星云稿 | 虽拉开主色，但仍是满幅星云/云壁组织，不能满足独立主体要求，未采用。 |
| NGC 6302深紫双极初稿 | 回到明确的双极轮廓与独立前景，用户继续要求调整背景感觉。 |
| NGC 6302背景修正版v2 | 调整原先近黑的底色为饱满深紫，匹配蓝/红/黄的细腻手绘底色；随后用户要求主体去宝石感、去透亮。 |
| NGC 6302不透亮主体v3 | 保留背景与轮廓，主体改为不透亮的紫色气体层次与局部金色细纹；未采用历史稿，后续重绘要求已覆盖。 |

## 双极星云阶段的参考分工（历史）

样式参考仅使用 `celestial-mural-v2.png`、`celestial-ruby-v1.png`、`celestial-solar-v1.png`。真实轮廓参考为NASA/Hubble的NGC 6302图像：[Butterfly Nebula (NGC 6302)](https://science.nasa.gov/image-detail/ngc-6302-the-butterfly-nebula/)，下载源为 `https://science.nasa.gov/wp-content/uploads/2023/07/caldwell-69.jpg`。原始参考署名：NASA, ESA, and J. Kastner (RIT)。

候选取真实天体双极轮廓为灵感，重新设计为紫色珐琅与金属浮雕。紫色是系列美术配色，图案是风格化创作，不作为天文照片复原。

## 完整初稿提示词

生成工具：内置 image_gen；背景不透明；输入依次为蓝、红、黄原图与NASA NGC 6302轮廓参考。

```text
Create ONE finished illustration for the existing celestial puzzle-art series. This is a new theme 3 candidate. Full-bleed opaque artwork, approximately 1302 x 1208 pixels, near-square landscape 1.078:1.

THE USER'S CENTRAL REQUIREMENT: a clearly defined, substantial HERO SUBJECT in the foreground, with its own independent silhouette and composition, exactly as the blue compass, red rose and amber sun each have a distinct strong subject. NOT a generic space background or wall-to-wall cloudy scenery. Unify MATERIAL, not repeated visual elements.

REFERENCE ROLES:
Images 1, 2 and 3 are the original approved BLUE COMPASS, RED ROSE, AMBER SUN. These THREE are the sole definitive STYLE and MATERIAL references. Match their crisp hand-painted sculptural bas-relief, thick translucent enamel, precise sculpted gold bevels, finely recessed engraving, smooth dimensional color planes, controlled bright edges, dark copper sidewalls and clean illustrated depth. Do not copy their actual subject matter.
Image 4 is a real NASA/Hubble image of bipolar planetary nebula NGC 6302. It is ONLY the subject silhouette reference: a compact dark waist with two immense broad oppositely flaring gas lobes, diagonally oriented. Do not copy the photograph's softness, pale cyan color, grainy starfield or wispy texture.
Do not use any Pillars of Creation elements. There must be no gas pillars, no carved cloud mountains, no rolling cloud sea, no corner scroll-cloud banks, no borrowed placement of a large upper-left star.

SUBJECT: NGC 6302 as a bold, majestic DEEP PURPLE celestial relief sculpture/illustration, a vast bipolar nebula, not a literal butterfly. The central waist is slightly above/right of image center. One immense sculpted gas lobe flares decisively toward the UPPER-RIGHT, the other toward the LOWER-LEFT. Each lobe is broad, angular-organic, irregular and asymmetric, like powerful opposing stellar outflows seen in the actual reference, with small secondary side fans belonging to the same continuous formation. Together these make one clearly bounded monumental object occupying roughly 75–80% of the mural, close to but not clipped by the outer edges. Keep dark clean background visible around its edges to show its silhouette immediately. The subject should be visually readable at thumbnail size.
A tiny restrained pale-gold core in the central waist anchors the form; it is not a large circle, jewel or sun emblem. The waist and two opposing lobes must be obvious. No insect body, antennae, eyes, legs, bird feathers or anatomical wings.

RENDERING THE MAIN OBJECT:
Model the great lobes as substantial purple ENAMEL masses with sculpted raised ridges, rich translucent layered interiors, crisp broad highlights and very clear darker edge faces. The enamel should have the same tangible thickness and elegant polished-painterly treatment as the red rose petals and amber sun's modeled surfaces, but the shape is exclusively the real nebula's bipolar outflow. Strong concave channels and convex radial ridges flow away from the narrow center into the two broad terminal lobes. Fine engraved champagne-gold inlays follow these internal flow directions; selected outer edges have precise slightly raised gold bevels, with visible dark bronze undersides. This should feel artisan-crafted and hand-painted, not solid plastic or industrial chrome. Fine details must be crisp, not blurred or covered in glow.
The outer silhouette is carefully sculpted, broad and commanding, with irregular stepped/fluted rims that recall the nebula's real contour. Avoid lacy frills, scalloped rose petals, flowing fabric ribbons, parallel decorative bands and ragged fuzzy cloud edges. No rounded billowing scroll-cloud texture. Do not turn the nebula into a pendant, brooch, medallion or tiny logo.

COLOR:
Deep amethyst, imperial violet, smoky purple and dark aubergine dominate the main body and background; they must establish a DISTINCT purple theme beside the existing blue/red/yellow/cyan/silver/copper themes. Rich saturated yet controlled jewel-tone purple, not pink, pastel lilac or fluorescent magenta. Main body should be purple 75% or more, with limited pale champagne-gold bevels/engraving (about 15%). Highlights inside the enamel are muted lavender, not large white glare. Warm metal is a secondary surface accent, not broad orange/copper clouds. The open background is a quieter very dark plum with subtle painterly enamel texture, creating a clear contrast to the brighter sculpted object.

SUPPORTING COMPOSITION:
Only a few tiny understated celestial star points in remaining background corners. Any fine constellation lines stay sparse and subordinate. NO large orbit rings, NO crescent moon, NO planet sphere, NO surrounding cloud banks, NO giant isolated upper-left star. Keep every corner quiet enough to make the diagonal bipolar object feel like the clear main subject. The full artwork is a single continuous mural for later puzzle cropping, not separate icons or tiles.

AVOID:
Photographic or realistic astronomical wallpaper; full-frame generic nebula haze; fog; particle noise; candy colors; neon light beams; cloth; feathers; flowers; leaves; crystal pendants; jewelry hardware; insects; animals; warriors; dragons; weapons; pillars; terrestrial cliffs; mountains; three repeated curves; a central black hole; ringed planets; sun disks; symmetrical decorative emblem; existing reference compositions; text; numbers; watermark; border; grid; tile seams; UI.

Deliver one coherent, clean, highly crafted hero-subject illustration. Judge success by: immediate independent NGC 6302 bipolar silhouette, material finish indistinguishable in family from blue/red/yellow, visibly deep-purple color identity, quiet background, and ZERO copied Pillars-of-Creation motifs.
```

## 背景修正

输入以NGC 6302初稿为编辑目标，蓝、红、黄原图只作为背景颜色与表面纹理参考。

```text
Precisely edit ONLY THE BACKGROUND of input image 1, the purple-and-gold diagonal bipolar-nebula illustration. The user asks that the background color and finish feel like the original blue, red and amber series images.

Reference roles: image 1 is the target to edit; image 2 is the approved blue mural, image 3 the approved red mural, image 4 the approved amber mural. Study ONLY the background handling of images 2–4: saturated jewel-tone pigment, softly modeled light/dark tonal depth, subtle fine painterly diagonal grain and mellow opaque enamel-like richness. They are colorful painted grounds, not empty black space and not smooth synthetic gradients.

CHANGE:
Replace all of image 1's currently near-black / black-burgundy empty background outside the main purple celestial subject with a richer, more visible deep royal-PURPLE / dark amethyst painted ground. Lift the darkest near-black background to a saturated deep grape-purple, with gently varied smoky violet and plum midtones. Rough guide: deep ground around #2D194D, quieter shadows around #211236, subtle broader lit areas around #442563; keep this subdued enough to preserve the bright foreground separation. The hue stays decisively PURPLE, independently recognizable beside blue/red/yellow/cyan/silver themes.
Give this ground the SAME subtle tactile hand-painted texture and restrained tonal variation seen in the original blue/red/amber references: extremely fine visible brushwork, soft shifting pigment depth, rich colored shadows, slight matte-enamel sheen, no crunchy grain or photographic star noise. A restrained soft lift behind the existing subject is allowed; avoid any visible circular spotlight or gradient banding. The background should feel crafted and fully painted, not flat black or blank.

PRESERVE EXACTLY:
The entire purple bipolar hero subject: its outline, lobes, central waist, positions, size, enamel interior colors, sculpted edges, gold bevels, tiny core, bright highlights and all foreground detail. Preserve every existing small gold star, small bead and constellation line at its current position. Preserve the canvas size and composition. Do not change the object design and do not add new motifs.

Do not copy any subject from the style references: NO blue compass, red rose, amber sun, moon, planet, cloud bank, pillars, swirling nebula background, outer frame, new stars, new orbit rings, fog, sparkle field, text, grid, logo or UI. No recoloring of the foreground. Background-only tonal/material refinement, matching the reference series' background feel while retaining this design's purple color identity. One image only, opaque background.
```

## 背景修正版v2文件（历史）

- 路径：`art-source/candidates/celestial-bipolar-v2.png`。
- 尺寸：1301×1209；PNG原文件，2365842字节。
- SHA-256：`4fe2b8915db3bc0e07d364f961a59f4320ee2a525539994c087290e2ba0c5cbd`。
- 以最终生成源文件直接复制，没有缩放、裁切或程序改画。仅作为审稿候选，不加入运行主题。
- 根代理目视确认背景由近黑酒红提为更饱满的深紫，出现细腻手绘纹理；双极主体、金边和星座布局保留。此项为美术候选审核，不代表用户已最终选用。

## 主体去宝石与去透亮修订（v3）

用户随后指出主体太像宝石，并要求不要透亮。v3保留已调好的深紫背景与双极轮廓，将白亮玻璃感、硬切面和整圈金边改为不透亮的连续紫色气体层次与局部金色细纹。

历史候选：`art-source/candidates/celestial-bipolar-v3.png`，1301×1209，2115834字节，SHA-256：`373c5498a626319113399e8353c646f4f6ed6834b5090ecc2b923571f11852b3`。未采用，已被后续要求覆盖，从未进入运行主题。

```text
Edit the purple bipolar celestial illustration in image 1, correcting ONLY the main purple object's material and shading. The user rejects its current gemstone-like, transparent, glowing quality. Images 2, 3 and 4 are the approved original blue, red and amber style references.

MANDATORY CHANGE: The main PURPLE object must become OPAQUE, SUBSTANTIAL, DEEP-COLORED, softly MATTE / satin hand-painted enamel with gently modeled nebular volume. Remove the glass transparency, luminous magenta veins, bright white interior strips, jewel facets, crystalline planes and wet glossy shine. No see-through material anywhere in the purple body. Do not simply darken the existing faceted gemstone; repaint its surface structure as continuous organic flowing gas layers with soft but clear modeled mass. Strong foreground identity remains.
Retain the independent bipolar NGC 6302-inspired two-lobe silhouette: one broad irregular outflow toward upper-right and one toward lower-left, meeting at the narrow waist. Preserve its overall size, position, outline and diagonal balance. Within these lobes use broad continuous, curved dark-purple and smoky gray-violet planes, opaque overlapping strata, restrained fine hand-painted flow striations, rich plum shadow pockets and controlled muted highlights. These are dense, powerful stellar gas outflows interpreted in the series' painted relief language, not a literal solid gemstone, leaf, wing membrane, ribbon or jewelry. Avoid sharp angular facet junctions. The texture should have the tangible but softly painted body seen in the reference images, with a readable light side and deeper edge faces.

COLOR/LIGHT CONTROL:
Dominant body deep imperial purple, amethyst purple and subdued smoky violet; keep purple opaque and richly pigmented. Highlights are muted grey-violet / dusty purple, NOT white, pink, fluorescent magenta or transparent lavender. Reduce the very bright central waist to a small restrained warm light, no starburst glare flooding the body. No bloom, no internal neon beams, no specular glass streaks.
The existing gold around the object currently makes it look like a set gemstone. Thin and soften the thick enclosing gold rims into SELECTIVE, INTERRUPTED warm-metal accents embedded along only a few contours and interior flow ridges. Fine artisan engraving can appear locally, like the reference series, but do not enclose every surface in a complete gold setting. Avoid hard polished gold mounting edges or cabochon/brooch construction. The object remains a cosmic phenomenon with a crafted illustration finish.

PRESERVE THE NEW BACKGROUND:
Keep image 1's existing richer deep-purple painted background, subtle fine brush texture, its saturation and tonal depth EXACTLY as they are. The user specifically just requested this background and now only wants the subject corrected. Preserve every small star, constellation line and bead at its existing location. Do not add moon, planet, orbit ring, cloud banks, pillars, rolling cloud sea, new stars, text, numbers, frame, grid or UI.

Use the style references ONLY for painted surface craftsmanship and color-depth control. Do not import their compass, rose, sun, leaves or composition. Do not borrow any Pillars-of-Creation elements. Same opaque canvas size and framing. The final main subject must be visibly NONTRANSPARENT and NONJEWEL-LIKE, with quiet matte-purple volume and clear foreground silhouette.
```
