# 柔和星空主页

版本：0.8.16；日期：2026-11-21。

## 用户要求与实现

用户在两步提示接入期间补充：“主页需要重绘美术，现在这版太硬了，温和一些”。本轮以现有v3主图和按钮为参照，通过内置 image_gen 重绘两份运行资源；没有使用CLI或其他模型。保留月牙、左下云海、右下环形行星、星座、标题牌和三个真实菜单入口。

新主图为 `home-celestial-v4.png`（1173×1341），来自 `exec-ce86a1d5-4977-4b79-b157-2331147b83bd.png`。新透明按钮图集为 `home-menu-v4.png`（1448×1086），来自 `exec-695c001a-178e-48cd-9f8c-5ed4887eba3d.png`。两份PNG按原稿字节复制，v3原图继续保留；WebP使用同尺寸quality95格式编码，保留透明通道，没有缩放、模糊、调色或程序重画。

`HomeScene.js`保留原标题区域、三按钮裁片与布局，改用两份v4资源，并增加网页/Cocos共用的主页背景和文字颜色。按钮实体的alpha>=128边界均在原frames内；图集间隙不作为运行裁片。首页文字仍由代码绘制，能显示真实解锁关数。设置、关卡逻辑、棋盘美术和0.8.15两步提示不变。

## 主图完整提示词

```text
Use case: style-transfer. Asset type: production mobile game homepage hero illustration for 四格诡局. Image 1 is the current homepage and the edit target. The user says the current art is too hard and wants it REDRAWN to feel gentler and warmer. Repaint the whole illustration, not a blur filter or washed-out overlay.

Keep the recognizable celestial composition: floating crescent at upper-left, layered lavender clouds flowing from lower-left, ringed planet at lower-right, a restrained constellation toward upper-right, a spacious open sky, and one EMPTY title plaque centered near the top. Keep the image portrait around 7:8, target 1173 by 1341. Title plaque must remain in normalized x=16%..84%, y=6.5%..20.5%, with a broad completely blank interior for live game text. Keep the top-left corner quiet for a real settings button. No buttons in this illustration.

NEW ART DIRECTION: a tranquil, inviting, finely painted celestial fantasy. Sophisticated 2D thick-paint illustration with gentle sculptural volume, soft lost-and-found edges and precise intentional detail. The old heavy polished gold, razor bevels, dark bronze outlines and rigid architectural look should become warm ivory and pale champagne, satin ceramic/enamel and softly worn gilding. Moon and planet retain shallow elegant engraving, but with rounded forms and broad soft light, not sharp carved metal. Reduce the dark-versus-bright contrast, orange saturation and glassy specular streaks substantially. Use a calm smoky indigo/lavender night sky, muted peach and cream at the margins, warm pearl light, and mauve-blue clouds with plush, rounded, painterly depth. Clouds remain detailed and dimensional, not blurry cotton and not rigid spiral sculptures. The planet may have subtle peach, lilac and honey bands; its ring is a smooth graceful ellipse with a softly rounded edge. Moonlight should be gentle diffuse illumination. A few small stars with restrained soft glows replace the harsh large spiky starbursts. Keep delicate constellation lines and only a few flowing orbital arcs, no laser-like gold streaks. The open arch and title plaque should have softer rounded contours, thinner pale-gold trim and very little hard dark outline. Make the little lantern discreet and diffuse. Lower and side edges dissolve naturally into a warm pale peach-cream background.

Preserve polished craftsmanship and readable forms at phone size. This is still the same elegant illustrated celestial game, not a new cartoon, not childish pastel candy, not a photorealistic render, and not a generic flat vector UI. No grainy noise, no gritty textures, no blanket blur, no extreme bloom, no excessive sparkling. No new objects, animals or characters. No board, grid, tiles, knobs, compass, pedestal, books or tabletop. No text, letters, digits, labels, logos or watermark.
```

## 按钮图集完整提示词

```text
Use case: style-transfer. Production mobile-game menu sprite atlas with TRUE TRANSPARENT background. Image 1 is the EDIT TARGET: the existing three-button atlas. Image 2 is a STYLE REFERENCE: the newly repainted gentle celestial homepage. Repaint all three buttons to belong perfectly with Image 2, while retaining Image 1's usable atlas layout and blank label areas.

Preserve the 4:3 canvas, target 1448x1086, exactly THREE separate horizontal capsule buttons of identical size and front-facing orientation, at the existing positions: first outer bounds approximately x=37..1407,y=88..348; second x=37..1407,y=419..679; third x=37..1407,y=752..1012. Preserve their left-side icon identities: a four-point star on top, a crescent moon in the middle, crown and laurel on the bottom. Leave the central70% of each face empty for dynamic Chinese game labels. No other sprites.

The old art is too hard, metallic and high-contrast. Create softer hand-painted thick-paint forms with rounded satin ivory/champagne edges, very shallow warm gilded relief, broad diffuse highlights, and subtle painterly dimensional shading. Match the gentle peach-cream, lavender and soft pearly moonlight of Image2. Top button: mellow honey-apricot face; middle: warm pearl-cream face; bottom: softly muted lavender face. Retain small soft lavender cloud accents near the outer ends and restrained shallow leaf engraving. Icons should be softly sculpted ivory-and-pale-gold with clean rounded contours, not knife-sharp stars, harsh bronze or gleaming chrome. Elegant premium celestial illustration, detailed and legible at phone size, never flat or childish. Avoid strong dark contour lines and deep extruded lower lips. Keep enough gentle edge contrast for each button to read on a peach-cream background. No blur filter, no plastic jelly, no glossy glass, no glaring white highlight.

TRANSPARENCY IS ESSENTIAL: all pixels outside the three intentional rounded button silhouettes must be transparent, including all wide gaps. Clean antialiased edges, no haze, no outer shadows, no floating specks, no yellow/red halos, no decorative fragments outside contours. Show all three complete sprites with generous transparent margins, no cropped edges. Do not paint a checkerboard, black or white backdrop. No text, letters, numbers, logos, labels or watermark.
```

## 验证边界

已检查新图尺寸、标题安全区域、图集裁片与五种视口的全宽排布。原生验证使用生产组件方法及cc替身，不等同于Creator或微信真机验收；公开网页以发布后的实际浏览器检查为准。
