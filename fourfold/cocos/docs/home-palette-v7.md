# 0.8.19 · 主页背景与按钮配色分离

用户要求：背景和按键的颜色分开，由助手搭配一套色系。

## 采用的色彩关系

- 页面背景：浅象牙燕麦色，减少上一版大面积杏橙晕染；程序衔接底色 #F0E8DE。
- 主要闯关入口：蜂蜜杏金，颜色覆盖中央的大面积按钮面，避免只有边框有颜色。
- 每日挑战与好友榜：相同的低饱和灰紫面板，呼应不规则拼片内部的蓝紫色，但比拼片更浅更柔和。
- 标题、按钮文字：深李棕 #523D47；副标题 #806A70。
- 金色包边与图标作为三个入口和拼片共同的细节。

图像是带明暗和材质的厚涂，不使用均匀纯色色块。PNG 中三个文字区域中心取样约为 RGB(253,208,141)、(211,193,212)、(209,191,210)，和背景边缘约 RGB(240,232,222) 有明确区分。此数值只用于记录本次原图，不代表每个像素固定颜色。

## 资源

| 用途 | 最终原稿 | 尺寸 | 资源 |
| --- | --- | --- | --- |
| 浅象牙背景与原有不规则拼片 | exec-e666695e-4f4e-4dd5-be4d-8f46a8a28419.png | 941×1672 | home-celestial-v7 |
| 金色主入口与灰紫辅助入口 | exec-2d533ffd-8451-41f5-9825-945311454fa1.png | 1536×1024 | home-menu-v7 |

使用内置图像编辑，以 v6 对应 PNG 为编辑目标。PNG 原稿按原字节保存；网页 WebP 仅作同尺寸 quality95 编码，菜单 alpha 与原稿一致。未修改不规则拼片形态、实时文字内容、菜单布局、裁片坐标、音效、两步提示和关卡规则。历史 v6 资源保留。

## 接入与检查

网页与 Cocos 仍共用 `HomeScene.js`。同步资源名、颜色、原生 manifest、网页预载与版本号。原生真实 PNG/manifest 校验和既有主页布局测试通过，菜单透明通道与尺寸检查通过。此次颜色调整未新增行为测试，也未重跑与改动无关的全部玩法回归。

## 背景编辑提示词

Use case: precise-object-edit. Asset type: existing Fourfold portrait game-homepage background. The supplied image is the EDIT TARGET. Change ONLY the large background surface outside the central four puzzle fragments: replace its rather yellow/apricot cream color with a PALE OAT IVORY / EGGSHELL neutral cream, subtly cooler and much less orange, approximate base #F1EEE6 with soft #E8E1D4 shadows and #FAF7F0 highlights. Keep it luminous, warm-neutral and tactile, not cold blue/gray and not stark white. This very light, quiet background will be behind separate honey-gold and muted-lavender UI buttons; it must be clearly different from those colored buttons. Preserve the exact four IRREGULAR blue-violet star-map fragments, all of their gold sculpted edges, details, crescent moon, constellation, size, positions, silhouette, shape and color. Preserve the entire existing 941x1672 layout and full portrait frame. Retain the sparse fine gold orbit curves, subtle warm cast shadow around the fragments and small ivory wisps near corners; reduce the general orange/yellow wash over blank areas. Keep the upper title and lower menu spaces clear. Do not change or recolor the fragments, do not add any panel/frame/buttons/text, do not turn the background into a sky, do not globally darken or flatten the artwork. No watermark.

## 菜单编辑提示词

Use case: precise-object-edit. Asset type: transparent production UI sprite atlas for Fourfold, recolor only. The supplied image is the EDIT TARGET. Preserve the EXACT 1536x1024 canvas, all three silhouettes, positions, sizes, gold icons, cloud relief, dimensional quality, edges and clear caption areas. Establish a coordinated palette clearly distinct from the game's very pale neutral oat-ivory page (#F1EEE6): TOP wide PRIMARY BUTTON has a rich but gentle HONEY APRICOT GOLD face, centered around #E6B46F with softly luminous #F2CD91 center and restrained #C48C47 shadows. Its complete blank label area must visibly read as honey/apricot, NOT near-white cream. Keep the sculpted star and thin gold trim, with ivory relief clouds. The TWO LOWER secondary buttons share the SAME MUTED DUSTY LAVENDER / MAUVE-GRAY surface, centered around #B7ABC7, lighter #C9BFD6 in label centers, deeper #A092B3 near edges. Their full clear lower caption zones must stay visibly lavender, NOT cream or white; no white fade washing the lower halves out. Keep the existing crescent, constellation and crown/laurel icons in soft gold, their existing location/size; cloud relief can be pale warm lavender/ivory. Thin champagne-gold trim unifies all three panels. The primary is warm and gently brighter, secondary buttons are quieter cool lavender, while all three remain clearly colored against a nearly ivory page. Keep sophisticated soft painted tactile game-panel material, with warm delicate edge highlights, no hard black outlines, neon or plastic gloss. No text, letters, numbers, extra panels, icons or objects. Keep exact positions: primary approx x48 y53 w1438 h385; left x53 y509 w672 h450; right x796 y509 w680 h450. Preserve full transparent alpha between and around all panels. No opaque rectangular backdrop.

