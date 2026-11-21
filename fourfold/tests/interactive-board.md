# 星图实时试转模板

入口：`interactive-board.html`，也可从 `theme-gallery.html` 顶部「实时试转」进入。静态服务的根目录应包含整个 `fourfold/`。

## 复用接口

```js
import { mountBoardPreview } from './interactive-board.js';
const preview = mountBoardPreview(document.querySelector('#ff-live-board'), {
  reference,                 // 原 referenceLayout.json
  themes,                    // 原 TileThemes.js 中 TILE_THEMES
  assetUrls: {
    reference: referenceUrl, // reference-daily.webp，金框与四颗旋钮
    // [theme.resource]: fullArtworkUrl —— 七幅完整原画
  },
  defaultTheme: 'jade',
});
await preview.ready;
```

先加载 `reference.css`，再加载 `interactive-board.css`。控制器限定在 `#ff-live-board`，URL 可全部注入为 data URL；它不 fetch、不读取或写入游戏存档，不依赖游戏主页。`interactive-board-page.js` 仅负责独立页面的 JSON/资源地址引导。离线打包可仅保留 `reference.css` 里「Daily controls」注释之前的棋盘样式，并给 `.game-screen` 选择器加根容器前缀。

返回接口：`ready`、`selectTheme(id)`、`rotate(q, dir)`、`shuffle()`、`reset()`、`undo()`、`setDirection(1 | -1)`、`setNumbersVisible(boolean)`、`setCompare(boolean)`、`getState()`、`destroy()`。`rotate`、`undo`、`selectTheme` 返回 Promise<boolean>；被中止或被忙状态拒绝时返回 false。独立页面公开 `window.fourfoldBoardPreview` 以便检查。

每次旋转沿 `TurnMotion.js` 的 1200ms 轨迹换位，图块自身和数字保持正立。原稿不等宽槽位、源图裁切、真实旋钮中心全部取自 reference JSON；没有均分成规则九宫格。系统启用减少动态效果时，采用180ms轻微淡入，规则更新相同。

切换主题恢复该主题的完整拼合，并清空当前试转历史；恢复拼合、重新打乱也建立新局。打乱由18次合法四格旋转生成，之后的撤销只撤销用户在该乱局上完成的动作。整图对照取消未完成的动作，保留已经完成的棋盘与撤销历史，再点返回棋盘可继续。

## 验证

```sh
node --test fourfold/tests/interactive-board.test.mjs fourfold/tests/turn-motion.test.mjs
```

测试覆盖：合法打乱可重放、多步撤销、动画期间拒绝连点、旧动作不能重复提交、取消撤销不消耗历史、主题图片乱序返回、实际控制器四块正立动画、复原/整图/打乱/切主题/销毁的旧回调隔离。控制器测试使用小型 DOM 与 RAF 替身，不替代浏览器渲染验证。

实际页面建议检查：320px 宽时无横向溢出；四个旋钮点击区至少44px；七主题各自原图与九块拼合对应；顺逆方向可逆；中途换主题或恢复拼合后等待两秒不会跳回旧图；整图对照返回后保持原乱局；加载失败可重试。
