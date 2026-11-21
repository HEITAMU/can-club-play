# 第4、5、7套星图宏观宇宙重绘

版本：0.8.13；日期：2026-11-21。

## 初轮要求、后续变化与运行资源

用户最初指定重绘第4、5、7套，要求整体更帅，并进一步明确为“星辰大海的这种宏观的帅”；当时明确排除武器、龙等方向，系列风格须与其余四套保持统一。主页本轮搁置。

初轮保留第一套深蓝星月、第二套暗红玫瑰、第三套翠绿星庭、第六套琥珀日轮。初轮三套引用深蓝星月与琥珀日轮作为参考。后续用户曾确认青色与银色可用，要求第4套改为创生之柱，并以蓝、红、黄三张的画风和质感为准；又追加绿色候选和“不要每个都加月亮”的要求。追加生成与局部修改记录见 `pillars-jade-redraw-v1-design.md`。该阶段的绿色候选未替换运行旧绿。

沙漏方向已撤回。用户已确认十稿09方向的鹿后半身修正版，正式采用第3套 `celestial-stag-v1`「逐星之鹿」与第5套 `celestial-libra-v2`「天秤星衡」，均已接入本地、尚未发布。采用记录见 `stag-anatomy-refinement.md` 与 `themes-3-5-fresh-redraws.md`。原10张保留为历史候选，下表列本轮最终运行资源。

| 序号 | 新名称 | 运行资源 | 主体 |
|---|---|---|---|
| 3 | 逐星之鹿 | celestial-stag-v1 | 绿金跃鹿，后腰、骨盆与两条后腿已修正；保留前半身和二维厚涂画风 |
| 4 | 创生之柱 | celestial-pillars-v1 | 三根铜金色星云气柱、深蓝空间、雕纹和色釉层次；无装饰月亮 |
| 5 | 天秤星衡 | celestial-libra-v2 | 深紫背景、正面展开的金色天秤、同高双盘和二维厚涂材质 |
| 7 | 银白引力 | celestial-frost-v4 | 银白吸积盘与弯曲光环、局部精细浅雕纹、四颗立体金属星、前景冰冷天体 |

## 接入原则

- 保留主题ID与顺序，普通关仍固定深蓝；每日日期、七套轮换、题目、计分、提示与存档不变。
- 保留既有连续取图窗口和1200毫秒旋转；依新图实际尺寸映射原画，不逐格重新裁绘。
- 第7套暗部更多，使用银白编号、深蓝描边和阴影。其余编号方式不变。
- PNG为内置 image_gen 生成的原样文件；网页WebP只做同尺寸quality95格式压缩，不改变图案、尺寸和构图。第3、4、7套为1302×1208，第5套为1301×1209。
- 旧 `celestial-jade-v1` 与 `celestial-tide-v2` 的PNG和WebP完整移入 `fourfold/art-source/archive/`；其他已替换原画继续归档。运行目录与主题清单只引用当前采用资源。
- 本轮另补原生美术加载的25秒超时、最多3并发和旧请求隔离；渲染与微信真机验证边界见发布说明。

## 初轮完整生成提示词（历史记录）

生成方式：内置 image_gen；每张单独生成，三个请求分别使用旧主题为编辑目标、深蓝和琥珀为系列参考，背景不透明。

### amethyst 初轮紫色星系（已被创生之柱替换）

```text
Use case: style-transfer.
Asset type: a full-bleed continuous illustrated mural texture for the existing FOURFOLD celestial puzzle game, approximately 1302 x 1208 pixels, near-square landscape aspect ratio 1.078:1. Opaque background.
Input roles: image 1 is the old theme being completely redrawn in subject and composition. Image 2 is the APPROVED deep-navy celestial mural: it is the primary immutable SERIES STYLE reference. Image 3 is the APPROVED amber-sun mural: it is a supporting reference for surface craftsmanship, fine metal engraving, painterly lighting and depth.
User correction is critical: convey the awe and grandeur of the cosmos at astronomical scale, 星辰大海的宏观的帅. No weapons, dragons, eagles, beasts, fantasy armor or warrior emblems. Powerful means vast celestial scale, confident large shapes, contrast and depth, not combat.
Series invariants: keep the same refined hand-painted illustrative finish as image 2; smooth rich colored enamel fields, sculpted beveled metal celestial details, restrained chased engraving, fine clean star-orbit lines and a few distinctive four-point star lights. Upper-left warm sculptural illumination, clean silhouettes, subtle brushwork and controlled relief shadows. This should unmistakably sit beside the approved navy, ruby, green and amber murals in one collection. Preserve illustrative craftsmanship; do not become NASA photography, a photoreal planet render, a sci-fi film still, a futuristic HUD or a neon poster.
Composition: an expansive cosmic scene across the WHOLE canvas, straight-on mural artwork rather than a physical object or framed medallion. Use overlapping scale, foreground celestial arcs and much smaller distant celestial bodies to convey vastness. Spread distinctive large forms and continuous curves across corners, mid-edges and center, because code will cut the mural into nine pieces. Avoid a central isolated logo with empty corners. Keep all edges filled, no external border.
No text, numbers, letters, labels, grid, tiles, seams, knobs, buttons, frames, watermark, UI, roses, leaves, feather ornaments, shell, lace, pearl necklaces, dangling jewelry, flowing fabric ribbons, decorative snowflake centerpiece. Avoid glitter noise, random debris, confetti stars, white blown-out regions and muddy tiny detail. Richly crafted and legible at phone size.

Specific theme 4: PURPLE GALACTIC EXPANSE / 紫曜星河.
Palette: unmistakable deep royal purple and aubergine enamel, violet nebular depth, champagne-gold celestial inlays, restrained pale lavender starlight. Avoid pink.
Replace the large faceted jewelry crystal and ribbons with a magnificent, asymmetrical sweeping spiral GALAXY seen obliquely across the canvas. An intense but controlled pale-gold galactic core is slightly above and to the left of center. Two broad, confident spiral arms sweep across the upper-right and lower-left regions, with nested violet/enamel shadow planes and narrow sculpted champagne-gold ridges; the curves continue naturally into the canvas edges. The arms feel like vast stellar streams, not petals or satin. A large partially cropped purple planet at the lower-right carries one thin engraved gold crescent rim, its darker body and a much smaller distant moon establish astronomical scale. Sparse crisp constellation stars and very fine orbital arcs connect the outer regions without filling them with sparkle.
The result should feel majestic, forceful and spacious while using exactly the approved image-2 sculpted celestial illustration language. No sword, spear, armor, dragon, bird, crystal pendant, ribbon or flower shape.
```

### tide

```text
Use case: style-transfer.
Asset type: a full-bleed continuous illustrated mural texture for the existing FOURFOLD celestial puzzle game, approximately 1302 x 1208 pixels, near-square landscape aspect ratio 1.078:1. Opaque background.
Input roles: image 1 is the old theme being completely redrawn in subject and composition. Image 2 is the APPROVED deep-navy celestial mural: it is the primary immutable SERIES STYLE reference. Image 3 is the APPROVED amber-sun mural: it is a supporting reference for surface craftsmanship, fine metal engraving, painterly lighting and depth.
User correction is critical: convey the awe and grandeur of the cosmos at astronomical scale, 星辰大海的宏观的帅. No weapons, dragons, eagles, beasts, fantasy armor or warrior emblems. Powerful means vast celestial scale, confident large shapes, contrast and depth, not combat.
Series invariants: keep the same refined hand-painted illustrative finish as image 2; smooth rich colored enamel fields, sculpted beveled metal celestial details, restrained chased engraving, fine clean star-orbit lines and a few distinctive four-point star lights. Upper-left warm sculptural illumination, clean silhouettes, subtle brushwork and controlled relief shadows. This should unmistakably sit beside the approved navy, ruby, green and amber murals in one collection. Preserve illustrative craftsmanship; do not become NASA photography, a photoreal planet render, a sci-fi film still, a futuristic HUD or a neon poster.
Composition: an expansive cosmic scene across the WHOLE canvas, straight-on mural artwork rather than a physical object or framed medallion. Use overlapping scale, foreground celestial arcs and much smaller distant celestial bodies to convey vastness. Spread distinctive large forms and continuous curves across corners, mid-edges and center, because code will cut the mural into nine pieces. Avoid a central isolated logo with empty corners. Keep all edges filled, no external border.
No text, numbers, letters, labels, grid, tiles, seams, knobs, buttons, frames, watermark, UI, roses, leaves, feather ornaments, shell, lace, pearl necklaces, dangling jewelry, flowing fabric ribbons, decorative snowflake centerpiece. Avoid glitter noise, random debris, confetti stars, white blown-out regions and muddy tiny detail. Richly crafted and legible at phone size.

Specific theme 5: CYAN CELESTIAL OCEAN / 苍澜星海.
Palette: deep petrol teal and cyan enamel, oceanic blue depth, restrained turquoise light, warm champagne-gold/brass relief matching image 2. Avoid milky pearl-dominant coloring.
Replace the shell and decorative waves with a COLOSSAL RINGED PLANET suspended in a vast cyan stellar ocean. The majestic teal planet dominates the left-middle of the canvas, with broad beautiful atmospheric enamel bands, one strong terminator shadow and a thin precisely beveled warm-gold illuminated rim. Its wide oblique ring plane cuts decisively across nearly the full image from lower-left toward upper-right; show the front/back overlap correctly. Rings are layered teal-and-gold celestial relief with fine chasing, clean luminous edges and enough width to read as a vast ring system, not chains or fabric. In the lower-right distance is a smaller unringed blue moon, partly in shadow, with another tiny distant warm-gold moon nearer the upper-left. Very broad subdued blue star-cloud currents and a handful of linked celestial stars connect the remaining regions.
Convey immense scale and calm power, an endless ocean of stars, not a literal seascape, animal scene or battle. It must share the original navy mural's clean illustrative golden planet/ring materials and ornament density. No dragon, fish, shell, coral, trident, tentacles, bird, flowing satin, pearl ornaments or armored character.
```

### frost

```text
Use case: style-transfer.
Asset type: a full-bleed continuous illustrated mural texture for the existing FOURFOLD celestial puzzle game, approximately 1302 x 1208 pixels, near-square landscape aspect ratio 1.078:1. Opaque background.
Input roles: image 1 is the old theme being completely redrawn in subject and composition. Image 2 is the APPROVED deep-navy celestial mural: it is the primary immutable SERIES STYLE reference. Image 3 is the APPROVED amber-sun mural: it is a supporting reference for surface craftsmanship, fine metal engraving, painterly lighting and depth.
User correction is critical: convey the awe and grandeur of the cosmos at astronomical scale, 星辰大海的宏观的帅. No weapons, dragons, eagles, beasts, fantasy armor or warrior emblems. Powerful means vast celestial scale, confident large shapes, contrast and depth, not combat.
Series invariants: keep the same refined hand-painted illustrative finish as image 2; smooth rich colored enamel fields, sculpted beveled metal celestial details, restrained chased engraving, fine clean star-orbit lines and a few distinctive four-point star lights. Upper-left warm sculptural illumination, clean silhouettes, subtle brushwork and controlled relief shadows. This should unmistakably sit beside the approved navy, ruby, green and amber murals in one collection. Preserve illustrative craftsmanship; do not become NASA photography, a photoreal planet render, a sci-fi film still, a futuristic HUD or a neon poster.
Composition: an expansive cosmic scene across the WHOLE canvas, straight-on mural artwork rather than a physical object or framed medallion. Use overlapping scale, foreground celestial arcs and much smaller distant celestial bodies to convey vastness. Spread distinctive large forms and continuous curves across corners, mid-edges and center, because code will cut the mural into nine pieces. Avoid a central isolated logo with empty corners. Keep all edges filled, no external border.
No text, numbers, letters, labels, grid, tiles, seams, knobs, buttons, frames, watermark, UI, roses, leaves, feather ornaments, shell, lace, pearl necklaces, dangling jewelry, flowing fabric ribbons, decorative snowflake centerpiece. Avoid glitter noise, random debris, confetti stars, white blown-out regions and muddy tiny detail. Richly crafted and legible at phone size.

Specific theme 7: SILVER GRAVITY / 银白引力.
Palette identity: luminous brushed silver and icy white are the main subject colors, with crisp ice-blue enamel, deep slate/ink-blue recesses and subtle pale-champagne highlights that tie it to image 2. Strong defined shadow planes; never washed-out pastel or a uniform white picture.
Replace the delicate snowflake, feathering and jewelry with a colossal BLACK-HOLE GRAVITATIONAL LENSING scene, interpreted in this collection's sculpted celestial mural language. A deep clean dark circular void sits a little left of upper center, enclosed by a brilliant but bounded silver-white lensing arc. A broad diagonal accretion plane spans from lower-left to upper-right across the whole canvas, bending into a raised luminous halo above and below the void. The plane has layered silver/ice-blue relief ridges, restrained fine engraving and a few very thin warm-gold inlays; it is a cosmic light structure, not a machine or decorative frame. The void, overlapping lensing arc and sweeping disk should be visually forceful and immediately readable. At the lower-right edge a partially cropped icy moon with subtle sculpted surface strata establishes foreground scale; a tiny distant sphere and a few clean star lights anchor the other corners. Keep the body of the disk luminous silver-white but preserve enough cool-dark background to express deep space.
Grand, mysterious and sharply structured. Keep hand-painted enamel-and-metal craft, do not turn into astrophotography or a sci-fi poster. No eagle, wing, feather, dragon, weapon, snowflake emblem, jewel necklace, fantasy armor or floral lace.
```
