# 开放星空主页设计

版本：0.8.11；日期：2026-11-21。

## 方向与资源

用户喜欢上一稿的精细金属和光影质感，但明确不要棋盘形态，希望左上月亮、左下云、右下行星和星座融入完整主页。因此把棋盘、九格、旋钮和台座全部移除，以前中远景和斜向轨道构成开放星空。

使用内置 image_gen 编辑上一版主页，输出 `home-celestial-v3.png`（1173×1341）；另以同一风格生成透明三按钮图集 `home-menu-v3.png`（1448×1086），随后通过内置工具进行一次透明边缘清理。未使用CLI或其他模型。网页WebP仅做同尺寸格式压缩；原生保留生成PNG。

标题和菜单文字由游戏绘制。三个菜单分别使用星芒、月牙和桂冠图标，主按钮仍读取真实解锁关卡。星空插画本身不设隐形棋盘入口。图集坐标与主页排布由两端共用的 `HomeScene.js` 提供。

## 主场景提示词

```text
Use case: stylized-concept. Edit target: the supplied current homepage illustration.
The user loves this exact refined tactile illustration quality, carved champagne-gold metal, navy enamel colors, warm amber light and soft purple details. They explicitly DO NOT want a board. Redesign the ENTIRE homepage hero as an open, immersive celestial scene.

REMOVE the whole physical puzzle apparatus: all nine tiles, all grid dividers, all four knobs, the rectangular gold board frame, the pedestal and stand. Do not replace it with a circular board, compass disk, clock face, or a giant central medallion. This must read as a magical observatory opening into space, not an object displayed on a table.

New composition: a luminous carved gold crescent moon floating prominently in the upper-left of the scene; layered, silky muted-violet clouds curling up from the lower-left foreground; an elegant gold-and-amber ringed planet floating in the lower-right foreground; a small constellation of gold stars linked by fine lines in the upper-right distance. Give the moon engraved leaf details, the planet subtle brushed-metal bands and delicate rings, and the clouds soft sculptural volume with refined gold-lit edges. Let a few graceful orbital arcs sweep DIAGONALLY across the open midnight-blue sky to unite the composition. Different distances and gentle overlap create real depth. A small, restrained four-point star can glow near the middle, but no massive compass star or concentric mechanical disk. Keep the sky clean with a few intentional star points.

Warm apricot parchment architecture may softly frame the far sides and top as a graceful OPEN arch. The celestial scene must flow naturally and feel spacious; cloud curls and planet rings can overlap the warm edges. No heavy enclosing rectangle or instrument frame. One discreet warm lantern at the upper-right can support the old visual family, but all attention belongs to moon, clouds, planet and constellation. Keep the superb metallic bevels and engraving from the reference in the architectural accents and celestial objects, never coarse black outlines, plastic highlights, sand-like noise or excessive glitter. Finished soft painterly 2.5D mobile-game illustration.

Canvas stays nearly-square PORTRAIT 7:8, approximately1174×1340. Preserve only a BLANK cream title plaque near the top, x=18%..82%, y=6%..20%, with delicate gold bevel and warm dark-bronze rim. Empty interior, because runtime text will go there. The scene occupies the rest of the image. Top-left corner remains quiet for an actual settings button. Finish lower and side edges in warm apricot tones that can blend naturally into the homepage menu area.

No text, no letters, no digits, no menu buttons, no fake UI, no watermark. Absolutely no chessboard, puzzle board, grid, squares, tiles, knobs, desk, book, book stand, platform or physical compass disk.
```

## 三按钮图集提示词

```text
Use case: stylized-concept. Production game UI sprite atlas, TRANSPARENT background.
Create exactly THREE separate refined celestial menu buttons in three horizontal rows, for a luxurious illustrated astronomy puzzle game. They must belong with warm apricot parchment, navy enamel sky, softly sculpted violet clouds and engraved champagne-gold celestial objects.

Canvas: landscape 4:3, target1536×1152. Each button is a very wide, gently rounded capsule plaque, approximately x=6%..94% of the canvas and only18% of canvas height including its lower bevel. Button1 centered at y=17%, button2 at y=50%, button3 at y=83%. Large completely transparent gaps separate all three. Show all edges and soft shadows fully, no cropping. All three have exactly matching overall widths and heights, straight-on orthographic front views. Aim for a width:height ratio of about6.3:1 per complete button. They are elegant wide menu bars, not tall cards.

Shared craftsmanship: delicate polished champagne-gold double bevel, restrained thin dark-bronze lower lip that gives real thickness, fine clean engraved leaf flourishes near the rounded ends, subtle warm highlights along the upper rim. Softly painted2.5D premium fantasy game art, sophisticated and tactile. No harsh black contour, no plastic jelly gloss, no overbright bloom, no gritty noise, no giant gemstones. The background outside each plaque and its translucent shadow must be genuinely transparent.

Top button: rich satin honey-gold/amber enamel face. A small beautifully crafted FOUR-POINT STAR icon near its left end.
Middle button: warm ivory/cream enamel face. A small sculpted engraved gold CRESCENT MOON icon near its left end.
Bottom button: soft muted LAVENDER enamel face. A small refined gold CROWN WITH LAUREL icon near its left end.
Icons occupy no more than10% of each button's width and stay entirely in the leftmost18% of the button. Leave the central70% and right region broad, smooth, empty and uncluttered for runtime Chinese labels.

NO text, NO letters, NO digits, NO logos, NO watermark, NO extra small buttons, NO grid or page background. Exactly these three complete separated button sprites on real alpha transparency.
```

## 图集透明边缘清理提示词

```text
Use case: precise-object-edit.
Edit the supplied THREE-BUTTON TRANSPARENT SPRITE ATLAS. Preserve the three existing button interiors, their star/moon/crown icons, gold frames, colors, dimensions, locations and spacing.
Only clean the alpha silhouette: remove ALL floating yellow/red speckles, pale halos, loose cloud fragments and dirty pixels outside the actual outer bronze-and-gold capsule contours. In particular the strips above and below each button must become completely transparent. The only nontransparent pixels should belong to the three intentional button shapes themselves. Keep a narrow clean anti-aliased contour, no outer haze or floating shadow debris.
Do not add or redesign anything. Keep the fine metal bevels and the purple clouds INSIDE each capsule. Preserve empty label space. The output must have real alpha transparency, no black/white/checkerboard painted background, no text, no extra elements.
```

