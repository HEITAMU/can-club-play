# 0.8.21 · 主页与游戏内页美术统一

## 修改依据

用户提供每日挑战实际截图并指出 0.8.20 主页与其他页面不搭。以现有游戏内页为依据修正主页，保留暖奶油面板、不规则浅金边拼片、背景与按钮分色，以及避免复古和重金属的既有约束。旧版问题不只在颜色：偏灰白背景、整块雾紫辅助面板、柔焦陶瓷浮雕、弱轮廓及独立线性设置图标共同造成脱节。

## 本次结果

| 部位 | 实现 |
| --- | --- |
| 背景 | 暖杏奶油，页面延展色 #FDD4AA；原画含柔和明暗与厚涂云纹 |
| 主入口 | 奶油金面，原画中央取样约 RGB(253,215,143)，清楚的暖棕轮廓与短底影 |
| 辅助入口 | 亮奶油面，蓝紫仅作云朵与图标的局部色彩 |
| 标题与按钮文字 | #61331F，与内页暖棕文字一致；副标题 #936744 |
| 文字体系 | 中文使用现有系统字体，菜单继承内页 850 字重；英文副标题 Georgia 粗体；不增加金色立体描边 |
| 设置按钮 | 网页和原生均复用正式 ui-atlas 的 settingsButton；保留 44px 触区、设置动作与点击音效 |
| 拼片 | 保留四片不规则星图及蓝紫厚涂画面，浅金内边与暖棕细轮廓形成清楚边界；无卷草雕花和厚金属托座 |

## 素材与接入

由内置 image_gen 图像工具编辑，不使用 CLI。PNG 保留最终输出字节；WebP 仅作同尺寸 quality 95 编码，菜单透明通道逐字节一致。旧版资产保留。

| 用途 | 原稿文件 | 实际尺寸 | Cocos 资源 | 网页资源 |
| --- | --- | --- | --- | --- |
| 主页背景与拼片 | exec-7f7d6fbb-e1f1-49cf-b343-94d0bafd869d.png | 981×1602 | fourfold/cocos/assets/resources/art/home-celestial-v9.png | fourfold/assets/art/home-celestial-v9.webp |
| 菜单透明图集 | exec-0f166187-9b45-437c-a38c-7408e3fead5f.png | 1536×1024 | fourfold/cocos/assets/resources/art/home-menu-v9.png | fourfold/assets/art/home-menu-v9.webp |

背景工具输出为 981×1602，与请求的 941×1672 不同；接入采用真实尺寸、等比显示，并保持原先归一化标题位置及一主两辅的相对布局，没有强行拉伸或裁切图案。标题字号按原屏幕比例调整。各按钮按新图透明边界重新裁片，文字放在现有留白区域，辅助标签垂直位置对齐。

有效轮廓和阴影均位于裁片内。原图裁片外存在零散的 alpha=1/255 像素，未将这些近透明噪点扩入按钮裁片；alpha≥2/255 的像素全部包含。PNG 原稿和 WebP 的原始 alpha 保持一致。

| 入口 | 裁片 [x,y,w,h] | 文字区域（裁片局部坐标） |
| --- | --- | --- |
| story | [37,73,1453,369] | [373,85,820,190] |
| daily | [30,475,711,492] | [81,310,548,115] |
| rank | [765,475,727,493] | [89,318,551,115] |

## 验证范围

现有主页测试 4/4 通过，覆盖真实 PNG/manifest、共享布局区域、原生缩放适配及三个路由。已核对新图尺寸与 WebP alpha；代码与素材变更仅涉及主页。此记录不等同于 Cocos 编辑器或微信真机验证，也没有重新声称音效实听通过。上线后的浏览器验收另外核对实际资源、字体、触点与设置开关。

## 0.8.22 长屏接缝收尾

0.8.21 上线后的浏览器检查确认：390×844 与 320×568 的文字、15 个内部触点、设置开关均正常。390×844 实际截图显示等比居中的原画与上下各约 103.55px 的纯色填充之间有可见横缝。为解决该具体问题，网页对原画顶底各 8% 高度应用透明过渡，原生用单个 Graphics 节点覆绘同范围的页面底色渐变。两端范围读取共享 HOME_ART.edgeFade；原画字节、画面比例和控件几何不变。此为场景呈现修正，没有再次重绘或通过代码修改位图。

## 背景完整提示词

Use case: style-transfer with precise layout preservation.
Asset type: production Fourfold mobile puzzle game homepage BACKGROUND, exactly 941 x 1672.
Inputs: image 1 is the EDIT TARGET, current home-celestial-v8; image 2 (the user phone screenshot) is a STYLE REFERENCE for this SAME game's actual play screen; image 3 is the game's existing UI atlas, another STYLE REFERENCE. Ignore phone/browser chrome, all UI text, and the puzzle-board layout in image 2. Do not copy reference layout or add its panels.
Primary request: bring this homepage back into the existing warm, illustrated, dimensional puzzle-game art style. The last homepage became too gray, airy and generic. Make it visually belong to the supplied game screen while avoiding antique/heavy metallic styling.
Preserve ALL current composition: the exact four irregular separated star-map fragment shapes and positions, crescent, clouds and constellations, top empty title area and bottom empty menu areas, sparse orbit lines, unchanged dimensions and crop. No new UI panels.
Background: clean warm APRICOT CREAM, approximately #F8D7B2 at edges with softly luminous #FCE4C6 near the middle, matching the game's warm creamy peach page. No gray/near-white porcelain backdrop, no full-screen sky, no paper aging. Very restrained creamy painted clouds in corners as in the target.
Fragments: preserve rich saturated indigo/royal blue/violet star-map paintings, slightly clearer confident thick-brush color transitions and tiny warm stars like the reference game's banner. The crescent remains a smooth illustrated warm butter-gold shape.
Edges: a slim PAINTED butter/champagne-gold lip with a crisp fine warm-brown outside contour and soft short warm contact shadow, visually related to the existing UI atlas. It should have clear hand-painted depth, a clean bounded silhouette and small restrained rim highlights. Moderately more defined than the target's almost hairline edge, MUCH thinner than the screenshot board frame. No thick metal shell, copper slabs, embossed engravings, carved flourishes, baroque scrollwork, aged brass, mirror gold, glass or plastic gloss.
Overall: polished hand-painted 2D cozy celestial puzzle game, warm and readable, saturated illustrations against calm warm cream negative space. Match reference style through outline clarity, creamy warmth, layered painterly color and shallow depth, not through metal ornament.
No letters, no numbers, no logos, no watermark, no controls. Keep target geometry and empty live-text/live-button space invariant.

## 菜单完整提示词

Use case: style-transfer with precise-object-edit.
Asset type: production TRANSPARENT UI atlas for Fourfold. EXACT 1536 x 1024 canvas.
Inputs: image 1 is the EDIT TARGET (home-menu-v8 atlas); image 2 is the game's existing ui-atlas and the authoritative material/edge/color reference; image 3 is the actual game screen, style reference only. Ignore screenshot browser chrome and all text.
Primary request: redraw these THREE homepage controls to clearly belong to the existing warm creamy hand-painted game UI. The current pink primary and gray-lavender cards look disconnected. Keep the existing silhouettes, positions, dimensions, icon identities and generous blank label areas, but change the palette and rendering to match reference 2.
Top primary panel: warm CREAMY HONEY YELLOW face, #F8CC82 to #FFE3A4, like the reference primary yellow button but softer and not metallic. Retain its four-point star on the left, small lavender/ivory cloud accents around the edges, and the wide blank center for live text.
Bottom two auxiliary cards: bright WARM CREAM faces #FFE8C4 to #FFF0D7 across the whole panel, including the blank lower caption areas. Do not use lavender as the entire card face. Keep the left moon/constellation and right crown/laurel icons, using butter-gold/soft ochre with clear hand-painted shading and small muted blue-violet clouds behind the icons; color is concentrated in the icons instead of flooding the cards.
All three edges: the existing game's clear rounded WARM BROWN fine outer contour, slim butter-gold inside rim, creamy upper edge, and SHORT shallow warm-brown lower contact shadow. Keep a readable clean boundary even on a peach page. Thickness and highlights should convey a painted game object, not luxury jewelry. No thick bronze base, reflective metal frame, sculpted ornate bevel, engraved carving, glass or plastic shine. A hand-painted 2D illustration with confident shapes and layered smooth brush shading, not a flat minimal app panel or blurry porcelain.
Layout invariants: primary approximately x44 y51 width1441 height389; left x48 y514 width672 height446; right x795 y514 width681 height446. Do not move/scale panels or icons. Do not encroach into the existing center primary caption area or lower halves of the two cards.
No text, numbers or extra objects. True transparent alpha everywhere outside the 3 sprites; no painted gray backdrop, no full-canvas glow or shadow veil. Keep all shadows short and within the existing padded sprite regions.
Important cloud rendering: reduce the target’s protruding whipped-cream/porcelain sculpted cloud border. Clouds should be a few painted wisps within the panel near its edges, low relief with readable brush-shaped contours; keep the overall banner footprint and icon positions. The outer boundary must read as one clear game button, not a cloud sculpture.

