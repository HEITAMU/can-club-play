# 0.8.17 · 星图归位主页重构

## 目标与取舍

用户澄清，要求改变整个主页的格局和美术，使它更像《四格诡局》的游戏主页。0.8.16 只柔化旧构图的色彩与材质，未解决这次反馈。此版重新安排整屏构图和入口层级。

顶部改为开放夜空和实时标题；中央用四片略有转角的圆角星图片、月牙、星座连线和环绕云光表现“转动四格、复原星图”。去掉旧主页的建筑拱框、牌匾和三枚等宽竖排入口。没有给插画增加棋盘点击区、外框、旋钮或新的功能入口。

底部在同一幅云海背景中安排一个主要闯关入口，下方并排每日挑战、好友荣誉榜。主入口继续显示真实已解锁关卡，初始为“开始解谜”。场景保持细金边、深蓝与柔紫、温暖月光的厚涂质感，减少厚重硬边和装置感。

## 原稿与运行资源

| 用途 | 最终生成源文件 | 原稿尺寸 | 原生资源 | 网页资源 |
| --- | --- | --- | --- | --- |
| 整屏背景 | exec-c3cd215b-5d03-4613-a69e-ad1c2b034b3a.png | 941×1672 | home-celestial-v5.png | home-celestial-v5.webp |
| 透明菜单图集 | exec-77f93101-3033-4ad4-a369-0c9db25b3320.png | 1536×1024 | home-menu-v5.png | home-menu-v5.webp |

背景经过两次定向修订，先减去厚重金属包边和尖锐切面，再把过于松散的形状收回到可识别的四片圆角星图。最终采用第三次输出。先前两张候选不作为运行资源。

PNG 以生成原稿原字节保存，未进行重绘、裁剪或拉伸。WebP 仅作同尺寸 quality 95 编码；菜单 alpha 通道与 PNG 一致。已有 v3/v4 文件保留，避免覆盖历史原稿。

## 共享布局契约

网页与 Cocos 读取 `HomeScene.js`。整幅背景全宽等比显示；长屏垂直居中，可用高度不足时从顶部开始纵向滚动。标题、副标题和按钮文字为实时内容，图片中未烘焙文字。

| 元素 | 位置与比例 |
| --- | --- |
| 主标题 | 原图区域 [94.1, 133.76, 752.8, 125.4]；字号 106 原图像素 |
| 副标题 | 原图区域 [235.25, 284.24, 470.5, 50.16]；字号 27 原图像素 |
| 主入口 | 横向 12%，纵向 64%，宽度 76% |
| 每日入口 | 横向 10%，纵向 79%，宽度 38% |
| 好友榜入口 | 横向 52%，纵向 79%，宽度 38% |

按钮高度按各自图集裁片比例计算，点击区域至少 44×44 CSS 像素。390px 视口下主入口文字 24px、辅助入口文字 18px；小屏有独立最小字号。主入口和两个辅助入口各有独立的美术区域、文字区域、点击范围，不再沿用三个胶囊按钮的统一文字偏移。

图集矩形均为 [x, y, width, height]。文字矩形相对其裁片左上角：

| 入口 | 图集裁片 | 文字区域 |
| --- | --- | --- |
| story | [48, 53, 1438, 385] | [362, 105, 820, 190] |
| daily | [53, 509, 672, 450] | [62, 285, 548, 115] |
| rank | [800, 509, 675, 450] | [62, 285, 551, 115] |

`hero/settings/buttons` 使用页面坐标；`image/title/subtitle` 使用背景容器局部坐标；`buttonArtwork/buttonLabels` 使用对应按钮局部坐标。Cocos 统一按 windowScale 转换。原生 assetManifest 同步到实际资源名与尺寸，生产校验读取的是真实 PNG 尺寸。

网页主页和安全区使用深蓝背景，进入关卡或排行榜时按实际页面切回暖色背景。三种入口仍调用已有路由。两步提示、通关留图、数字开关及原有游戏内画面不由本次重构改变。

## 验证与边界

`tests/home-layout.test.mjs` 验证长短屏完整场景、入口与文字区域、触区、原生缩放、真实主入口/每日/排行路由，以及实际 PNG 与生产 manifest 校验。全套 Node 回归包含已有提示与通关流程。网页另在发布后的真实浏览器查看 390×844、320×568 等尺寸与交互。

原生测试执行生产方法并使用轻量 cc 替身；它不等同于 Cocos Creator GPU 渲染、微信开发者工具或微信真机验收。

## 完整绘制提示词

### 初始整屏构图

Use case: stylized-concept. Asset type: a completely NEW full-screen portrait main-menu background for the existing celestial rotation-puzzle game 四格诡局. Reference images 1 and 2 are ONLY references for the approved hand-painted celestial materials, meticulous shallow gold ornament, enamel blues, and painterly volume; DO NOT copy either composition, central compass, concentric dial, or rock pillars. The previous homepage was rejected for its whole composition, so this must be a fresh game-specific composition.

Canvas portrait 9:16, target1080x1920. This is a complete atmospheric mobile GAME HOME background, not a postcard in a frame. Open, calm, welcoming, intimate. Airy painterly night-blue space with soft cream-and-lavender clouds forming a flowing S-shaped sweep through the lower half. Rich blue remains present, while broad diffuse warm light and gentle edges make the whole feeling soft. Sophisticated 2D thick-paint illustration with carefully shaped three-dimensional volume, warm ivory and muted champagne gilding, restrained soft glows, and some very fine engraved star-map details. No blurry filter, no flat vectors, no hard black outlines, no sharp chrome highlights.

COMPOSITION AND PURPOSE: The visual focal point between y=26% and y=56% is ONE celestial picture quietly coming back together. Show a small number of irregular-edged, rounded star-map fragments floating in a loose graceful turning motion, almost meeting to reveal a single continuous crescent-and-constellation image. The fragment imagery must visibly belong to the SAME continuous picture, not separate character cards. Their edges may be gently squared in places, but no aligned 2x2 block, no grid, no jigsaw tabs, no board, no knobs, no mechanical frame or giant circular disk. Give the scene depth by modest overlap and differing angles, with one small fragment entering its place; a thin luminous trail and softly curling clouds suggest rotation and reassembly without arrows. Keep the movement calm and delicate. Make the newly forming crescent near the upper-right of this central composition; a small ringed planet sits farther away toward the LEFT as a secondary distant accent, reversing the former stereotyped moon-left/planet-right layout. Few intentional constellation points, not noisy glitter. The center should look like restoring a beautiful star map, not collecting cards or opening loot.

LAYOUT RESERVES FOR REAL INTERACTIVE UI: Top y=7%..21%, x=12%..88% must be calm open blue sky with subtle warm light, enough uninterrupted contrast for the large game title that will be drawn by code. NO title plaque or cartouche. Keep upper-left and upper-right corners calm for a settings icon. From y=62% downward, create a coherent soft cloud landing area but keep all important subjects out of three empty zones: one main horizontal button zone x=12%..88%,y=64%..75%; two smaller side-by-side entry zones x=10%..48% and x=52%..90%, both y=79%..93%. DO NOT draw any buttons, badges, text boxes or UI in those zones; actual painted buttons will be overlaid there. Clouds and slender star lines can gently lead toward these zones without crossing them with sharp busy details. Bottom edge and outer edges should settle into calm smoky night blue so the scene can blend into a full-height app.

Entirely remove the old architecture idea: NO arch, no columns, no lantern, no window, no parchment title sign, no framed illustration. Also no table, bookshelf, book, stand, chessboard or central puzzle apparatus. No characters, no currencies, no trophies, no invented game features. No text, letters, numerals, logos or watermark. The reference look is luxurious hand-painted astronomy, but keep the mood gentle and human, not rigid, intimidating, washed-out or candy-like.

### 质感修订

Use case: precise-object-edit. Edit target is the supplied NEW portrait game-home background. Preserve its whole composition, dimensions, night-blue/lavender palette, cloud flows, planet position, title empty sky at the top, and empty interactive-menu area in the lower half.

Change ONLY the central four separated star-map pieces. They currently look like broken glass windows with thick gold frames. Make them feel like ONE gently separated, beautifully painted celestial image quietly turning back into place. Keep four pieces and their approximate positions, keep the shared crescent and connected constellation imagery, but completely remove the thick carved frames and the individual scrollwork corner ornaments. Replace the thick gold bevels and copper underside with an extremely thin muted champagne-gold seam. Soften every sharp fracture, spear point and knife-like corner into a natural rounded, flowing curve. The outer contours should feel intentionally shaped and smooth, not shattered, splintered, torn, jagged or dangerous. The faces have satin painted enamel with plush light and very shallow thickness, not transparent glass or shiny crystal. Preserve rich blue pigment and refined painterly volume; do not wash everything white. The gold crescent itself remains dimensional, softly luminous and finely engraved.

The four surfaces must visually belong to a single continuous image, not four independent framed cards. Do not arrange them into a neat2x2 board, do not add a grid, frame, stand, dial, knobs, jigsaw tabs or arrows. Keep the gentle turning path and surrounding star light restrained. Everything outside the central pieces remains as before. No text, letters, numerals, UI buttons or watermark.

### 最终四片星图修订

Use case: precise-object-edit. Keep the supplied portrait game-home image's whole background, planet, clouds, empty top title area and lower menu area exactly as they are. Revise ONLY the four floating blue star-map surfaces in the middle.

The four surfaces must have the calm, deliberately crafted shape of the actual game's image tiles: softly rounded SQUARE or very slightly rectangular enamel pieces with equal general size, like thick-paint picture tiles. Give each tile four coherent sides and generous, smooth rounded corners. They should not look like amorphous water blobs, irregular broken glass, jagged shards, playing cards or separate framed paintings. Preserve the extremely fine pale-gold rim and the shallow painterly thickness; NO heavy metal frame or ornamental corner hardware. Use rich blue painted enamel and gentle diffuse highlights.

Arrange the four tiles in a loose, airy clockwise turning cluster, with slightly different angles and clear gaps; do NOT align them into an actual2x2 board or a regular grid. One tile floats a little farther out, implying that it is about to turn into place. The painted imagery across the four is clearly portions of ONE continuous celestial mural: the crescent on the upper-right tile, continuation of thin star-constellation paths on the other three, soft lavender cloud portions along the lower tiles. The crescent remains elegant, sculpted and softly lit. Do not duplicate a full crescent on every tile. Keep the group's overall footprint within the same middle region. Preserve the gentle orbital light trail. This is a lyrical, approachable illustration of rotating parts to restore an image, with the recognizable softly rounded picture-tile shape of a puzzle game, without a board apparatus.

No grid, no dial, no base, no knobs, no thick outlines, no angular fracture cuts, no jigsaw tabs, no text or UI.

### 透明菜单图集

Use case: stylized-concept. Asset type: a production transparent main-menu UI atlas for the celestial rotation-puzzle game 四格诡局. The supplied image is the STYLE reference for the new homepage; match its finely painted blue enamel, creamy moonlight, warm muted gold and lavender clouds. Create a NEW HIERARCHICAL menu set: ONE large main play button above TWO compact secondary entry tiles side by side. This is not three equal horizontal bars.

Canvas landscape3:2, target1536x1024, TRUE alpha transparency outside the three shapes. Place exactly3 complete separate sprites:
1) TOP PRIMARY BUTTON: bounds about x=120..1416,y=70..350 (width1296,height280). A wide, softly sculpted cloud-cradled ivory-gold plaque with gently curved ends, warm cream/honey face, a very fine satin champagne edge and shallow painted depth. A small refined four-point celestial-star relief occupies the leftmost18%; the central and right70% are smooth empty warm-cream space for the live main-play label. Slightly fuller volume and warmth so this reads as the main action. No hard bronze lower lip, no rigid metallic outline.
2) LOWER-LEFT DAILY ENTRY: bounds about x=130..710,y=525..915 (width580,height390). A compact softly rounded rectangular tile with a graceful cloud-like curved base, muted twilight-blue enamel in its upper half, warm ivory lower band. A softly lit small crescent moon and a few tiny constellation dots in the upper half. Leave the lower40% a calm empty ivory label area. It must feel like an inviting game menu control, not a playing card, tarot card or collectible item.
3) LOWER-RIGHT FRIEND-RANK ENTRY: bounds about x=826..1406,y=525..915 (width580,height390). Match the left tile shape and dimensions. Muted lavender upper enamel, warm ivory lower band, a small elegant pale-gold laurel wreath with a restrained crown in its upper half. Leave the lower40% empty and uncluttered for its live label.

All three belong to one hand-painted2D illustration family, with rounded comfortable shapes, refined shallow relief, fine warm rims and broad soft highlights. Icons feel integrated into the enamel, not pasted sticker glyphs. Keep the wide primary control clearly dominant and the two secondary controls equivalent. Painterly depth and high craft, no vector look, no coarse outlines, no glossy plastic gel, no photorealism, no heavy fantasy armor. Preserve clean readable silhouettes at mobile size.

Absolutely no text, Chinese characters, English letters, numbers, fake labels, badges, notifications, currencies or extra sprites. Keep all cloud decoration inside each silhouette. Outside the three complete intentional shapes the alpha must be0: no haze, dust, floating pixels, white halos, outer shadows, yellow/red contamination or checkerboard backdrop. Large transparent margins and gaps, no cropping any of the shapes.

