# 七套星图实时试转模板

`fourfold-live-board.html` 是可独立打开的完整离线模板。它默认显示已修正后半身的「逐星之鹿」，可以切换全部七套图，点击四个金色旋钮试转，并支持顺逆时针、撤销、合法打乱、恢复拼合、数字显示及整图对照。

页面嵌入项目现有的原尺寸 quality95 WebP、真实棋盘底图和全部代码；不依赖网络、游戏存档或计分逻辑。PNG 原稿及正式 WebP 不会被打包脚本修改。

## 共用来源

- `tests/interactive-board.js`：同一份页面控制器。
- `cocos/assets/scripts/Core.js`：从真实源码抽取 `GOAL`、`SQUARES`、`rotate`，不重写规则，也不打包无关的每日题库。
- `cocos/assets/scripts/TurnMotion.js`：同一套 1200ms 四格换位轨迹；图案保持正立。
- `cocos/assets/scripts/TileThemes.js`：当前七套主题和原图裁切映射。
- `referenceLayout.json`、`reference.css`：原棋盘格位、枢轴、裁切和边框材质；CSS 通过 `:where(#ff-live-board)` 隔离，保持原选择器优先级。

## 重新生成

在仓库根目录运行：

```bash
node fourfold/tools/build-board-previews.mjs
node fourfold/tools/verify-board-export.mjs
node fourfold/tools/verify-board-export.mjs /workspace/fourfold-live-board.html
```

依赖 Node.js 和支持 AVIF 的 Pillow，无需安装 npm 包。`CODEX_PRIMARY_RUNTIME_PYTHON` 可指定 Python，否则使用 `python3`。

脚本同时生成消息内预览 `/workspace/fourfold-live-board.html`。该片段保持所有图片原尺寸，使用预览专用 AVIF 编码，将整个片段控制在 980,000 字节以内；可以用 `--fragment /absolute/path.html` 指定输出。实际品质、尺寸、字节数与源图哈希记在 `preview-build-report.json`。完整离线模板始终使用原有 quality95 WebP。

## 验证边界

`verify-board-export.mjs` 会实际执行打包后的 JavaScript，并用有限 DOM 替身验证挂载、七套图加载、真实顺逆时针结果、动画锁、撤销、切图与恢复时取消旧动画、整图对照和数字开关。它是交付文件的逻辑及 DOM 接口验证，不是浏览器渲染、Cocos Creator 或微信真机验收。
