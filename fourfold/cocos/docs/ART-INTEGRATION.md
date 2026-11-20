# 四格诡局参考原稿接入

版本：0.8.1；更新：2026-11-21；目标编辑器：Cocos Creator 3.8.8。

## 运行资源与坐标

当前原生加载 `assets/resources/art/` 中的 `home-scene.png`、`ui-atlas.png`、`reference-daily.png`、`reference-clean.png`，以及 `assetManifest.json` 和 `referenceLayout.json`。

- `reference-daily.png` 是用户指定每日挑战图的 854×1842 高清原稿，用于分别裁取横幅、导航、操作按钮、棋盘外框和旋转钮。
- `reference-clean.png` 仅为运行组件清理了日期、两个计数和四个旋钮，并补齐遮挡处；九个原图数字保留在各自图案中。清理图为图像编辑结果，不能声称在编辑区域以外逐像素无损。
- `referenceLayout.json` 固定所有原稿裁切与控件坐标。原图排列为 2/9/5、7/8/1、4/6/3，运行时按 token 编号取对应原图，显示位置由真实关卡状态决定。
- 外框为817×765，内棋盘为747×694。此版本按照用户要求保留参考稿的比例，不将它强行改成正方形。

网页使用同源 WebP 资源，`reference.css` 按同一份坐标映射展示。原生 `Game.ts` 中的主页和每日排布与网页 `layout.mjs` 使用相同几何公式；原生计算时先扣除微信安全区。所有旧题库和存档键保持不变。

## 全宽适配与短屏排布

原生以真实窗口宽高比例推导逻辑高度，采用 `ResolutionPolicy.FIXED_WIDTH`，并在 `screen` 的 `window-resize` 事件后更新画布、相机及页面。取消固定390×844的 `SHOW_ALL` 和整张长图的高度contain，避免两次缩小导致界面成为中央窄条。微信胶囊下沿和底部安全区按宽度比例换算，不再扣除letterbox。

主页插画和三个菜单独立排布：常规插画裁片为 `[0,0,854,1140]`，短屏为 `[0,128,854,1012]`，仅移除标题上方装饰和下方空白，保留原图y=136至1135的标题、书本主体。常规插画全宽，短屏宽度为页面宽度减8；三个按钮始终为页面宽度的80%，各皮肤保持原比例，点击高度至少44，间距5。常规布局从上方开始，短屏能放下时整组垂直居中。

每日页根据可用高度在七行与五行布局之间切换。常规为导航、横幅、数据牌、棋盘、方向、提示、分享七行；短屏将导航与横幅合为一行，将提示和分享合为一行。棋盘外框始终为页面宽度减16，保持817:765，数据牌和按钮均独立等比展示。390×650且无额外安全区时，短屏每日内容约639.7高、主页约639.4高，可以完整放入窗口。

如果极短窗口或较大安全区仍无法容纳内容，使用垂直 `ScrollView` 和矩形 `Mask`，保持组件宽度，底部控件可滚动进入安全区。切换方向或棋子换位重绘时保留滚动位置；不会再次横向缩小整页。

## 每日界面与真实操作

每日页以原稿独立裁片组成实际界面。横幅日期先用清理图对应小裁片覆盖，再绘制实时日期；数据牌使用已清理数值的原稿组件，绘制真实步数和用时。没有将示例的08步、00:42固定写进游戏。

棋盘区域在底图上先盖藏蓝色底，再放金色分隔条及九个独立原图裁片；因此旋转动画的空隙不会透出原图的固定棋子或数字。四个旋钮从原稿单独取图，用圆形Mask裁切，方向改变时镜像箭头。

返回、设置、顺逆时针、提示、分享都是独立触控节点，点击范围至少44×44。按压以覆盖高亮反馈，保持原画控件比例。逆时针选择后描边高亮并弱化顺时针。普通关同样使用这九个原图裁片和原稿信息牌。

Web端旋转按横纵两个半径计算轨迹，并校正到真实目标格中心；原生使用真实格中心位置进行换位。两端均继续调用原有旋转、最优路径、存档、解锁、分享与每日题库逻辑。

## 验证与边界

规则回归覆盖18个正式闯关关卡和30天每日关卡；核心规则与固定题库文件不因美术接入修改。网页有 `tests/layout-preview.html`，可在390×650、390×844、320×568、460×936四种真实iframe视口下检查主页、每日和普通关。

原生以TypeScript剥离解析、资源范围校验，以及最小cc节点替身配合真实Core验证界面节点、换位、通关、存档、路由与缺图重试。九组视口及安全区检查与网页 `layout.mjs` 逐项比对，覆盖全宽组件、原图比例、主页主体裁切范围、点击区域、长短布局、滚动范围、滚动位置保留，以及真实窗口比例和安全区换算。

上述原生验证使用节点API替身，不替代Cocos Creator编辑器构建、GPU渲染、真实滚动手势或微信真机验证；这些环境尚未运行。首次导入时需检查字体、Mask、透明边缘、安全区、微信开放数据域。

## API依据

- [Cocos3.8 SpriteFrame与ImageAsset](https://docs.cocos.com/creator/3.8/manual/en/asset/sprite-frame.html)
- [Cocos3.8 Texture2D](https://docs.cocos.com/creator/3.8/manual/en/asset/texture.html)
- [Cocos3.8 Sprite](https://docs.cocos.com/creator/3.8/manual/en/ui-system/components/editor/sprite.html)
- [Cocos3.8 Mask](https://docs.cocos.com/creator/3.8/manual/en/ui-system/components/editor/mask.html)
- [Cocos3.8 多分辨率适配](https://docs.cocos.com/creator/3.8/manual/en/ui-system/components/engine/multi-resolution.html)
- [Cocos3.8 Screen事件](https://docs.cocos.com/creator/3.8/manual/en/engine/event/event-screen.html)
- [Cocos3.8 ScrollView](https://docs.cocos.com/creator/3.8/manual/en/ui-system/components/editor/scrollview.html)
