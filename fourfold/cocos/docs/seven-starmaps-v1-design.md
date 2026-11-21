# 七套星图美术与接入记录

版本：0.8.12；日期：2026-11-21。

## 设计方向

用户认可新主页的精细质感，要求棋盘拥有七种不同色彩、不同图案，明确包含暗红。保留已认可的深蓝星月作为第一套，新绘六幅完整星图。每套先是一幅连续原画，再由运行层按归位位置取出九块；不把独立九张图硬拼在一起。

| 序号 | 主题 | 资源名 | 原图尺寸 |
|---|---|---|---|
| 1 | 深蓝星月 | `celestial-mural-v2` | 1302 × 1208 |
| 2 | 暗红玫瑰 | `celestial-ruby-v1` | 1301 × 1209 |
| 3 | 翠绿星庭 | `celestial-jade-v1` | 1302 × 1208 |
| 4 | 紫晶梦境 | `celestial-amethyst-v1` | 1302 × 1208 |
| 5 | 青蓝潮汐 | `celestial-tide-v1` | 1301 × 1209 |
| 6 | 琥珀日轮 | `celestial-solar-v1` | 1301 × 1209 |
| 7 | 银白星霜 | `celestial-frost-v1` | 1302 × 1208 |

PNG原画保存在 `fourfold/cocos/assets/resources/art/<资源名>.png`；同尺寸WebP保存在 `fourfold/assets/art/<资源名>.webp`。新六幅使用内置 image_gen 生成，不使用CLI。PNG直接复制生成结果，WebP仅以quality=94进行同尺寸格式压缩，没有重新裁绘或缩放图案。深蓝沿用0.8.9已验证原画。

## 构图与材质

- 深蓝：四芒星盘、连续天文轨道、月牙、紫云与行星。
- 暗红：深酒红珐琅、金边浮雕玫瑰、S形藤蔓、花苞和红宝石。
- 翠绿：翡翠叶片、雕刻金枝、舒展树冠、星光与翡翠行星。
- 紫晶：纵向通透棱晶、斜向光带、雕纹镶边和悬垂晶石。
- 青蓝：珍珠母贝海螺、青蓝潮纹、扇贝、珊瑚和珍珠星座。
- 琥珀：通透琥珀日轮、多芒日焰、铜金流线与晨曦云。
- 银白：六枝冰晶、银色霜羽、冰凌与斜向彗尾。

各图均不烘焙数字、九宫格线、圆角棋片、旋钮或棋盘外框。独立棋片的厚度、高光、圆角和编号由游戏统一绘制；银白主题采用深铜编号增强对比。

## 接入与切换

两端共用 `TileThemes.js`。按用户最新指定，普通关始终使用原深蓝星月；七套只在每日挑战中随机轮换。日期来自既有UTC+8日期键，每七日按确定性的随机顺序使用七套，跨轮边界也不连续重复；同日所有玩家和重复进入保持同一图案。选择主题不改变题库、难度、解锁、用时、步数、提示上限或排行榜规则。当前主题加载完成后再显示棋盘，旧请求不能覆盖新局；加载失败可以重试当前局。

`buildThemeArtwork` 按原图真实尺寸缩放已有sourceRect端点，保留金轨覆盖的图像条带。目标顺序 `123456789` 下九块仍属于同一连续画布。独立预览页 `tests/theme-gallery.html` 可查看七套完整原画、归位九块与打乱状态，不写存档。

## 生成方式与完整提示词

所有新主题调用内置 image_gen，参考图1为 `celestial-mural-v2.png`，参考图2为 `home-celestial-v3.png`；背景不透明。以下“统一提示词”与各主题的“主题补充”依次连接，即每次调用的完整提示词。每套独立生成一次并保留，不是同图调色。

### 统一提示词

```text
Use case: style-transfer.
Asset type: one full-bleed continuous mural texture for a premium celestial sliding/rotation puzzle game. This is artwork ONLY, not a mockup.
Input image 1 is the approved navy-and-gold full puzzle mural: use it as the material-quality and near-square aspect-ratio reference. Input image 2 is the approved homepage: use its luxurious engraved gold, silky soft sculptural lighting and painterly craftsmanship as a supporting style reference. Do NOT copy its arch, plaque, window, lamp or UI.
Primary request: create a completely new illustrated motif and composition for the specified color theme, retaining the exquisite tactile illustration quality. It must NOT be a mere hue-shift of the central four-point compass.
Format/composition: near-square landscape about 1302 x 1208, straight-on flat artwork canvas, sharp and complete edge-to-edge. One uninterrupted mural. It will be cut in code into nine puzzle pieces, so spread beautiful recognizable details through the whole canvas: all four corners, mid-edge regions and center. Let graceful continuous curves cross the invisible thirds naturally. Do not draw any grid. No nine separate icons or cards.
Materials: sculpted and engraved champagne-gold or specified metal inlays, smooth deep colored vitreous enamel, delicate leaf or theme-specific carving, fine brushed-metal highlights, clean rounded sculptural edges, restrained relief shadows. Warm consistent light from upper left. Highly polished hand-painted fantasy illustration, dense enough to reward close looking yet readable at phone scale.
Constraints: no text, letters, numerals, labels, logos, watermarks, tiles, grid dividers, buttons, rotation arrows, knobs, frames, outer rims, UI, perspective board, table, photographic prop, jagged edges, random debris or noisy speckles. No baked edge shadow around the entire image. Keep the background opaque. No large blank zone.
```

### 暗红玫瑰

```text
Theme: RUBY ROSE / 暗红玫瑰. Dominant deep burgundy, garnet and dark wine-red enamel; antique champagne gold, ruby jewel accents and restrained rosy highlights. The whole canvas must unmistakably read dark red, never orange or brown.
Design a large exquisite layered ruby-enamel rose slightly left of center, its sculpted petal edges delicately lined with engraved gold. A graceful S-curving gold vine sweeps diagonally from the lower left across the center toward upper right, bearing differently oriented carved leaves and small ruby buds. Thin rose-gold celestial orbits and tiny linked star constellations pass behind the botanical relief, with a small garnet eclipse disc in the upper-left distance and a distinctive open gold leaf curl in the lower-right. Use varied rose petals, leaf silhouettes, a jewel teardrop and small gold stars across the mid-edge and corner regions so every puzzle fragment carries identity. Rich atmospheric crimson depth, elegant and magical, no horror or blood. No central four-point compass, no large enclosing circle.
```

### 翠绿星庭

```text
Theme: JADE STAR GARDEN / 翠绿星庭. Dominant deep emerald, forest green and luminous jade enamel with champagne-gold relief, small warm ivory glints. The whole canvas must unmistakably read rich green.
Design an elegant asymmetrical celestial tree of life: a slim sinuously curving engraved golden trunk rises from lower center and branches into sweeping jade-enamel leaves across the upper two-thirds. The leaves have translucent carved jade veins with fine gold borders, alternating small and large shapes. Open branching structure, not a circular emblem. Its roots and thin orbital lines flow through the lower corners, meeting an emerald globe low on the right and a gold crescent seed pod low on the left. Tiny stars suspended between branches form a quiet constellation; a distinct gold leaf cluster occupies upper left, a small luminous seed jewel upper right. Every region contains a branch, leaf, orbital arc or recognizable detail, while the canopy remains readable. Smooth sculptural jade and chased metal, no central four-point compass, no enclosing circular frame.
```

### 紫晶梦境

```text
Theme: AMETHYST DREAM / 紫晶梦境. Dominant rich aubergine, royal purple and violet enamel with pale champagne gold, silver-gold filigree and luminous lilac crystal facets. It must read purple rather than blue.
Composition: a magnificent elongated faceted amethyst crystal rises slightly diagonally through the center, with its tall pointed crown in the upper middle and tapering base low in the middle. Fine engraved metal mounts hold only small edges of the jewel, leaving the translucent facets exposed. Two elegant diagonal ribbons of carved pale gold and soft lavender light weave behind and in front of the crystal, extending toward opposite edges; do not enclose it in a circular frame. Small differently shaped suspended crystals enrich upper left and mid-right, a little lilac crescent and a linked delicate constellation float in the upper right, a cluster of short purple prisms fills lower left, and silky purple cloud curls with tiny gem droplets fill lower right. Give each region a distinct combination of facet angle, ribbon curve, carved metal or crystal silhouette. Refined translucent jewel depth, precise brilliant edges, no noisy glitter, no central four-point compass.
```

### 青蓝潮汐

```text
Theme: CELESTIAL TIDE / 青蓝潮汐. Dominant deep turquoise and petrol-teal enamel, with pearly ivory, pale champagne gold and small sea-glass aqua accents. Clearly cyan/teal, not navy or green.
Composition: a sculptural mother-of-pearl nautilus shell, large and slightly left of center, its gorgeous spiral compartments and ribbed ridges traced with finely engraved gold. Let broad flowing tidal arabesques spiral outward from the shell toward the lower right and both upper corners. The waves are smooth turquoise enamel relief with pearl-white crests and hairline gold edges, not a literal photographic ocean. Add a recognizable small fan shell toward the upper right, an airy pearl-and-star constellation upper left, a branching engraved gold coral low on the left, and slender curved sea grass with pearl droplets low on the right. Continuous flowing lines connect all portions of the mural; all nine eventual fragments have distinct sculptural details. Luxurious pearl iridescence, luminous watery depth, controlled soft highlights. No central four-point compass, no large framing ring, no fish characters or faces.
```

### 琥珀日轮

```text
Theme: AMBER SUN / 琥珀日轮. Dominant warm cognac amber, burnt honey and deep caramel-brown enamel with engraved copper-gold metal, warm ivory highlights and luminous amber gemstone accents. Entire palette warm orange-gold/amber, no red-dominant background.
Composition: a large elegant sun with a smooth translucent amber center, without any face, placed slightly above center. Its corona uses many alternating long tapered and sinuous flame-shaped gold rays, each carved with refined acanthus-like details. This is a many-rayed solar relief, not a four-point compass, and has no enclosing circular frame. Long rays and curled bands of solar fire reach through the middle and lower areas. Upper left includes delicate dawn clouds and a small copper star cluster; upper right includes a faceted amber diamond suspended on a fine orbit; lower left holds a dramatic curled gold flame; lower middle three flowing sun-ray ribbons; lower right warm cloud layers and a small amber jewel constellation. The rays should stay sharply readable against darker enamel with luminous restrained edges, no overblown glow. Clean fine engraving, rich translucent stone, dimensional bevels.
```

### 银白星霜

```text
Theme: SILVER STAR FROST / 银白星霜. This is the LIGHT palette of the set: luminous pearl-white and pale icy blue enamel, cool silver metal, restrained slate-blue recessed shadows and tiny pale-champagne highlights. Clearly silver-white, not dark navy.
Composition: one elegant large six-branched sculpted ice crystal, offset slightly toward upper center. Its main branches divide into delicate silver-and-translucent-blue crystalline twigs, with varied lengths and faceted tips. This is a sixfold frost formation, not a compass star or mechanical disk. A flowing diagonal comet trail passes from upper left to lower right, consisting of clean silver inlay and opalescent blue ribbons. Include a soft carved frost feather across the upper-left region, a distinct tall transparent prism upper right, branching frozen leaves at mid-left, a three-pronged crystalline twig mid-right, a frost-scroll and small pearl cluster lower left, two graceful icicles near the lower center, and a curled icy plume lower right. Keep every region legible with controlled blue-grey contrast and sculpted silver shading; avoid blank white areas or flat monochrome. No outer border, no enclosing ring, no overexposure, no glittery noise, no central four-point compass.
```

