# 四格诡局原生美术接入

更新：2026-11-21；素材清单版本：`0.7.0`；目标编辑器：Cocos Creator **3.8.8**。

## 已接入的运行资源

所有图片位于 `assets/resources/art/`，由原生 `resources.load` 加载，不使用 WebView，也不把整张界面稿覆盖在可操作棋盘上。

| 资源 | 原生用途 |
| --- | --- |
| `home-scene.png` | 已确认的夜色星窗、打开的星图手册、游戏标题和浅色背景；不含三个菜单按钮。 |
| `celestial-mural.png` | 正方形星图原画，运行时均分为 9 个 `418×418` 的 `SpriteFrame`，按真实关卡棋盘排列。 |
| `ui-atlas.png` | 独立按钮、脚印/沙漏数据卡、返回、设置、旋转钮。 |
| `daily-banner.png` | 不含日期或文字的每日星空横幅，按清单中的 `dailyBanner.frame` 裁去透明外围。 |
| `assetManifest.json` | 图集裁切坐标与图片基准尺寸。 |

`Game.ts` 先读取清单，再加载全部四张 `ImageAsset`，创建本地 `Texture2D` 和 `SpriteFrame`。所有图块以 `Sprite.SizeMode.CUSTOM` 显示；图集和九宫切片设置 `packable=false`，避免动态打包改变运行裁切坐标。加载失败会停留在可重试的加载页，不以临时几何图形替代缺失美术。

## 页面与操作

- 主页下方三个按钮为独立原生节点：进入当前闯关、今日挑战、好友荣誉榜。每个按钮有独立触控范围和按压反馈。
- 普通闯关页标题为“第 N 关”；每日页没有额外顶端标题牌，仅在日期横幅内显示日期和“每日挑战”。
- 步数与用时统一通过同一个 `statCard()` 方法绘制，脚印/沙漏保留在原画内，标签与实时数值使用 `Label`。
- 棋盘尺寸始终为 `size × size`。九个原画块是独立 `Sprite`，四个旋钮位于内部交点。旋转执行后更新真实棋盘与步数；0.16 秒的格块换位只表现现有规则。
- 顺/逆时针、提示和同关分享均为真实控件。重开移入设置页；下一关出现在通关结算中。
- 原有存档键、最佳成绩比较、解锁、提示广告、结算广告与开放数据域排行榜保持原有数据通路。
- 普通关分享携带 `mode=story&level=N`；每日分享携带原日期 `mode=daily&day=YYYY-MM-DD`。从分享进入后仍调用同一个 `makePuzzle()`。
- 微信胶囊及底部安全区域来自 SDK，游戏不自行绘制虚假的微信系统按钮。

规则文件 `Core.js`、`DailyVerified.js`、`CoreHardWeb.js` 未因本次美术接入修改。关卡难度与每日题库由原有规则文件决定，不在美术层重新生成。

## 验证记录与边界

已完成：

1. 通过 Node 的 TypeScript 类型剥离解析及 JavaScript 语法检查。现有 `@ccclass` 声明沿用原来的 Cocos 写法，检查时单独去掉此行；这不是完整 TypeScript 类型检查。
2. 对实际四张 PNG 和 JSON 清单检查图集边界、每日横幅裁切和 9 个 `418×418` 正方形切片。
3. 使用最小 `cc` 节点替身配合**真实 Core.js 和题库**验证：主页独立按钮、统一数据卡、正方形棋盘、第一关真实通关及存档解锁、每日棋盘保持一致、普通/每日分享参数、主页排行榜路由，以及缺图失败后重试成功。

尚未完成：Cocos Creator 3.8.8 编辑器导入及构建、引擎 GPU 实际渲染、微信开发者工具和微信真机测试。节点替身只能检查代码路由与状态，不替代上述验证。首次用 Creator 打开工程时应确认图片与 JSON 正常导入，然后预览 `assets/scenes/Main.scene`；特别检查精灵朝向、透明边缘、实际文字字体、安全区和开放数据域。

## API 依据

- [Cocos 3.8 SpriteFrame 资源与 ImageAsset 加载](https://docs.cocos.com/creator/3.8/manual/en/asset/sprite-frame.html)
- [Cocos 3.8 Texture2D 资源](https://docs.cocos.com/creator/3.8/manual/en/asset/texture.html)
- [Cocos 3.8 Sprite 组件](https://docs.cocos.com/creator/3.8/manual/en/ui-system/components/editor/sprite.html)
