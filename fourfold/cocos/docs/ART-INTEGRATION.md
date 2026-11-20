# 四格诡局参考原稿接入

版本：0.8.0；更新：2026-11-21；目标编辑器：Cocos Creator 3.8.8。

## 运行资源与坐标

当前原生加载 `assets/resources/art/` 中的 `home-scene.png`、`ui-atlas.png`、`reference-daily.png`、`reference-clean.png`，以及 `assetManifest.json` 和 `referenceLayout.json`。

- `reference-daily.png` 是用户指定每日挑战图的 854×1842 高清原稿，用于完整静态界面、棋盘外框、旋转钮。
- `reference-clean.png` 仅为运行组件清理了日期、两个计数和四个旋钮，并补齐遮挡处；九个原图数字保留在各自图案中。清理图为图像编辑结果，不能声称在编辑区域以外逐像素无损。
- `referenceLayout.json` 固定所有原稿裁切与控件坐标。原图排列为 2/9/5、7/8/1、4/6/3，运行时按 token 编号取对应原图，显示位置由真实关卡状态决定。
- 外框为817×765，内棋盘为747×694。此版本按照用户要求保留参考稿的比例，不将它强行改成正方形。

网页使用同源 WebP 资源，`reference.css` 按同一份坐标映射展示。主页继续使用0.7.2的等比适配，短屏居中留背景；所有旧题库和存档键保持不变。

## 每日界面与真实操作

每日页将完整原稿等比放入可用区域。日期、当前步数与用时三个区域先用清理图的相应小裁片覆盖，再绘制实时文字。没有将示例的08步、00:42固定写进游戏。

棋盘区域在底图上先盖藏蓝色底，再放金色分隔条及九个独立原图裁片；因此旋转动画的空隙不会透出原图的固定棋子或数字。四个旋钮从原稿单独取图，用圆形Mask裁切，方向改变时镜像箭头。

返回、设置、顺逆时针、提示、分享都是独立触控节点。按压以覆盖高亮反馈，避免移动控件时露出底图上的重复按钮。逆时针选择后描边高亮并弱化顺时针。普通关同样使用这九个原图裁片和原稿信息牌。

Web端旋转按横纵两个半径计算轨迹，并校正到真实目标格中心；原生使用真实格中心位置进行换位。两端均继续调用原有旋转、最优路径、存档、解锁、分享与每日题库逻辑。

## 验证与边界

规则回归覆盖18个正式闯关关卡和30天每日关卡；核心规则与固定题库文件不因美术接入修改。网页有 `tests/layout-preview.html`，可在390×650、390×844、320×568、460×936四种真实iframe视口下检查主页、每日和普通关。

原生以TypeScript剥离解析、资源范围校验，以及最小cc节点替身配合真实Core验证界面节点、换位、通关、存档、路由与缺图重试。这不替代Cocos Creator编辑器构建、GPU渲染或微信真机验证；这些环境尚未运行。首次导入时需检查字体、Mask、透明边缘、安全区、微信开放数据域。

## API依据

- [Cocos3.8 SpriteFrame与ImageAsset](https://docs.cocos.com/creator/3.8/manual/en/asset/sprite-frame.html)
- [Cocos3.8 Texture2D](https://docs.cocos.com/creator/3.8/manual/en/asset/texture.html)
- [Cocos3.8 Sprite](https://docs.cocos.com/creator/3.8/manual/en/ui-system/components/editor/sprite.html)
- [Cocos3.8 Mask](https://docs.cocos.com/creator/3.8/manual/en/ui-system/components/editor/mask.html)
