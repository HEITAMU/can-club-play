# 0.8.20 · 现代奶油系主页

## 最终约束

用户要求整套主页色系舒适、精致并与游戏相配，随后明确“不想复古、金属痕迹重”。因此在暖奶油界面、不规则拼片和分色按钮的基础上，同时调整材质、文字与小图标，避免仅改变色相而保留厚重金属语言。

## 色彩角色

| 元素 | 配色/程序值 | 作用 |
| --- | --- | --- |
| 大面积背景 | 奶油白，#F5ECE4 | 明亮柔和的留白，降低背景存在感 |
| 主要入口 | 柔杏色，原图中央约RGB(240,200,175) | 用温暖色温区分主要操作，不使用黄铜金属面 |
| 两个辅助入口 | 雾紫，中央约RGB(203,199,218)和(203,197,216) | 比背景深，和蓝紫拼图呼应 |
| 标题/按钮文字 | 深灰紫 #47445D | 在三种浅底上统一阅读层级 |
| 副标题 | #827A8C | 轻于主标题 |
| 拼图与细边 | 蓝紫星图，细浅香槟色边线 | 颜色集中在核心玩法意象，金色作为小面积点缀 |

纹理有渐变与明暗，上述取样不是要求每个像素使用纯色。主页不使用新的金属渐变字体、铜褐色描边或仿旧纸面。

## 美术与界面

四片不规则星图保留原有位置、分片关系与轮廓特点，去除金边上的卷草雕花、厚铜金侧面和锐利白色高光；边缘改细、浅、哑光。月牙和菜单图标同步简化雕刻与反光。按钮面保留轻微厚涂层次，柔和接触影提供体积，没有重金属框。

实时标题、副标题与菜单采用系统无衬线字体；网页字距分别为 .065em、.22em、.015em，不使用文字阴影。原生标题描边移除。主页设置按钮为44px区域内的38px奶油圆底、1.65px雾紫线条齿轮；网页为 `assets/home-settings-soft-v1.svg`，原生用同坐标 Graphics 绘制，保留已有动作与点击音效。游戏内设置按钮与其他游戏页面未在本次重绘范围。

## 原稿

| 用途 | 最终生成文件 | 尺寸 | 运行资源 |
| --- | --- | --- | --- |
| 背景/细边不规则拼片 | exec-f73dd235-4c1b-4eb7-adcf-0a9b6e1f79b9.png | 941×1672 | home-celestial-v8 |
| 哑光浅杏/雾紫菜单 | exec-85bf5584-8039-4d68-95b7-8cf395ac5c32.png | 1536×1024 | home-menu-v8 |

内置图像编辑以 v7 两张原稿为目标；PNG保留最终输出原字节，WebP仅作同尺寸quality95编码，菜单alpha逐字节一致。没有通过代码对原画调色或重绘。历史版本保留。

## 图集与验证

新柔边略超出旧裁片，因此扩大裁片并补偿文字的局部坐标，使原图上的文字区域保持原位置：

| 入口 | 裁片 [x,y,w,h] | 文字区域（相对裁片） |
| --- | --- | --- |
| story | [40,47,1449,397] | [370,111,820,190] |
| daily | [44,510,680,454] | [71,284,548,115] |
| rank | [791,510,689,454] | [71,284,551,115] |

两端读取同一 `HomeScene.js`。保留一主两辅布局、现有文字与入口；原生manifest同步v8。现有4项主页测试通过，覆盖图集/实际PNG、布局区域、原生缩放与三个路由。格式编码、图片比例、透明通道已核对。此类素材/文字调整没有新增行为测试或重复无关玩法回归；这些检查不替代真实Cocos或微信设备渲染。

## 背景材质编辑提示词

Use case: precise-object-edit. Asset type: Fourfold mobile puzzle game homepage art, material refinement for a MODERN SOFT CREAM UI. The supplied image is the EDIT TARGET. Preserve the entire 941x1672 composition, the exact four IRREGULAR star-map fragment outlines and gaps, their positions and size, blue-violet constellation images, crescent, clean ivory background and empty live-UI spaces. User wants these irregular shapes and a gold-colored edge, but explicitly DOES NOT want a retro, antique or heavy metallic look. Replace the thick sculpted orange-gold frames on every fragment with a VERY THIN LIGHT CHAMPAGNE-COLORED SATIN RIM, softly rounded and nearly flush with the picture surface, like a fine painted edge on smooth matte ceramic, not real heavy metal. Completely remove carved corner flourishes, scroll engravings, bronze/brown undercuts, thick bevels and mirror-sharp gold reflections. Keep the irregular outlines; do not turn them into squares or jigsaw-nub pieces. Refine the crescent similarly: luminous soft butter-gold/ivory with a smooth delicate gradient, no engraved gold-metal sculpture. Keep the rich blue-violet star-map imagery clean and dimensional, with soft cloud detail and tiny warm points of light; avoid flat vector simplification. Shallow diffuse warm-gray contact shadows provide light depth, without heavy brown cast shadows. The background remains a clean pale warm ivory, not aged parchment, no weathering/patina, no paper stains, no dark vignette. Very sparse champagne orbital lines remain quiet. Overall feels contemporary, calm and refined, a high-quality modern cozy puzzle game with gentle matte surfaces, not antique jewelry, gilded furniture, steampunk or treasure relics. No new objects, panels, text, UI or watermark. Only lighten/refine the materials and edge detail; preserve the layout and irregular puzzle identity.

## 菜单材质编辑提示词

Use case: precise-object-edit. Asset type: production TRANSPARENT menu atlas for a contemporary soft-cream puzzle game. Edit supplied atlas, preserving full 1536x1024 canvas, EXACT three sprite placements/sizes, the one wide top primary panel and two lower secondary panels, current clear caption zones and icon identities. User explicitly rejects antique/retro/heavy metal styling. Replace the thick shiny gold tubing, copper undercuts, beveled metal gloss, engraved look and sculpted ornamental relief with very restrained thin light-cream/champagne edges and soft shallow shadows. Panels should feel smooth matte ceramic/coated paper, subtly dimensional, neither flat vector nor shiny plastic. Top primary panel: soft warm APRICOT CREAM face #EFC7A4 to #F3D2B4, clearly warmer and darker than a pale ivory page, no yellow brass or amber metal. Lower two panels: matching cool MISTY LAVENDER faces #BFC0D5 to #D0CFE1, all the way through their blank lower caption areas; avoid cream/white lower halves. Keep the four-point star, crescent/constellation and crown/laurel at the existing locations, but draw them as clean simple matte butter-champagne illustrations with soft gradients, not embossed golden jewelry: no engravings or mirror reflections. Cloud details become small soft painted ivory/lavender wisps with low relief, not baroque carvings or heavy glossy sculpture. The panel edges must not be a gold metal frame; a thin soft cream line and a gentle colored lower shadow are enough. Clean modern cozy-game polish, balanced warm/cool colors, generous uncluttered caption space. Preserve the original silhouettes and icon proportions so existing hitboxes and captions still align. Primary approximately x48 y53 w1438 h385; left x53 y509 w672 h450; right x796 y509 w680 h450. Absolutely no text, numbers, extra icons or panels. Fully transparent alpha between and around the three sprites, no painted backdrop.

