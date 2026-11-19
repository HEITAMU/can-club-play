# 罐头远征队 · Cocos Creator 3.8.8

此目录是后续开发的主工程，迁移来源为冻结的 `0.28.0-preview.11`（`28eb867`）。当前数值、角色 ID、存档格式与业务代码沿用该基线；渲染和交互由 Cocos 原生节点实现。

## 打开工程

源码克隆后，先在本目录执行 `npm ci && npm run prepare:project`，再使用 **Cocos Creator 3.8.8** 打开本目录。准备脚本从仓库保留的原始 WebP 重建完整尺寸 PNG、原表情和治疗粒子、effect 与所有元数据，不需要原开发机器上的路径。

CI 的 `cocos-creator-project-*` 产物内提供 **CanClub-Creator-3.8.8.zip**，已包含全部 PNG、`.meta`、脚本和设置。下载并解压后直接在 Creator 中打开 `can-club-cocos/`，无需先生成资源；ZIP 不含 node_modules、build、temp 等派生目录。

入口场景为 `assets/scenes/Main.scene`，启动组件为 `assets/scripts/CanClubGame.ts`。设计宽度 390、高度 844，按宽适配并根据可视区域计算高度。`package.json` 锁定 Creator 版本，场景与脚本的 UUID 由构建脚本稳定生成。

`assets/scripts/domain/` 存放迁移的纯逻辑；`game/` 管理会话；`render/` 与 `ui/` 负责原生显示和输入；`platform/` 处理存档、音频、广告和平台生命周期。Web 与微信都调用同一份 `bootGame`。

## 开发构建

```bash
cd cocos
npm ci
npm run prepare:project
npm run build:web
npm run build:wechat
```

默认 `npm run build` 同时生成两端。`node scripts/build.mjs --web --code-only` 复用现有资源，只重新打包代码和同步元数据。需要重新生成原表情贴片时使用 `node scripts/build.mjs --faces`。

依赖的精确版本与下载完整性记录在 `package-lock.json`；共享业务 bundle 使用与 Preview11 微信端一致的 ES2019 语法目标。这个语法目标不代替设备验收。

输出：

- `build/web-mobile/`：真实 Cocos 3.8.8 WebGL 引擎的独立开发版本，可由静态服务器托管。
- `build/wechatgame/`：同一业务入口对应的微信源引擎开发主包。
- `build/remote-art/`：微信完整尺寸资源，与主包分开。

这些脚本在没有 Creator 编辑器的环境中使用 **官方 3.8.8 源码编译的引擎**。它们不伪装为 Creator 编辑器正式构建。`vendor/engine-manifest.json` 记录引擎版本、提交、模块及 SHA-256。正式发布前仍须在 Creator 3.8.8 中打开工程、导入资源、构建，并用微信开发者工具及真机核验。

Creator 命令行正式构建配置在 `build-config/web-mobile.json` 与 `build-config/wechatgame.json`；可在编辑器构建面板导入/核对后使用：

```bash
CocosCreator --project /absolute/path/to/cocos --build "configPath=/absolute/path/to/cocos/build-config/wechatgame.json"
```

## 原画与资源

`assets/resources/art/` 使用正式原画转换后的 PNG，保持原始分辨率和像素，不将 2048 图集缩到 1024，不丢掉敌人姿势，不引入 `assets/concepts`、`orange-puppet` 或旧分层试作。

`asset-manifest.json` 和 `docs/asset-audit.json` 记录每项资源的原路径、资源路径、尺寸、字节数和 SHA-256。`render/Assets.ts` 接受旧路径，例如 `assets/finished/orange-v0213.webp`，正式 Creator 下经 `resources.load` 读取对应 Texture2D；独立运行版本经资源清单读取相同原画。SpriteFrame 裁切使用原图坐标。

开发 Web 使用通过 SHA-256 核对的原始 WebP 字节，表情贴片使用 PNG；这只改变传输容器，不用移动端缩图替代原始图集。正式 Creator 导入及默认微信开发资源继续使用 PNG。引擎 downloader/parser 注册 WebP 并不等于每台微信设备的解码均已验收，因此微信的 `WECHAT_TEXTURE_FORMAT=webp` 仅作为明确选择的真机验证候选。

原图、57张原表情贴片和4张原治疗粒子纹理保留后，资源超过旧项目的微信本地包预算。不要为塞进主包而缩角色、删帧或移除页面。将 `build/remote-art` 的内容部署到已登记的 HTTPS 下载域名，再构建：

```bash
WECHAT_ASSET_BASE_URL=https://your-registered-domain.example/can-club/ \
WECHAT_APPID=your_appid \
WECHAT_REWARDED_AD_UNIT_ID=your_adunit \
node scripts/build.mjs --wechat
```

上面的域名和 ID 是占位示例，不能直接用于发布。未配置远程资源地址时，构建报告明确记录未配置，运行时显示资源未配置错误，不把缺失资源当作成功加载。

## 存档与广告

存档 key 保留 `can-club-growth-preview-v1`，备份 key 为其后缀 `-backup`。先验证旧存档再写备份；当前设备的每名玩家各自保存。H5 源站存储与微信本地存储是两个独立空间，兼容同一存档格式不等于自动跨平台传送存档。

激励广告只有 SDK 明确返回 `isEnded === true` 才完成；提前关闭、SDK 出错、缺少广告位、忙碌及超时均不给奖励。每次观看有独立实例与监听，旧请求的重复/延迟回调不能完成新请求；超时后服务退役以避免继续接收不明来源回调。业务会话继续执行奖品单次领取约束。

`platform/Audio.ts` 复用原音乐谱、合成器与音效配方，浏览器使用 AudioContext，微信使用 wx.createWebAudioContext，设置开关与前后台状态由同一服务处理。

## 原画姿态过渡

每个完整角色使用单个 28 顶点网格。相邻姿态在一次 fragment shader 中采样，两层先按原权重和透明度转成预乘颜色，再按冻结版规则合成：8 名伙伴在透明表面上相加（Canvas `lighter`），敌人和载体按先后顺序 `source-over`。结果再以 `ONE / ONE_MINUS_SRC_ALPHA` 与背景混合，避免两个独立 Sprite 的遮挡使伙伴的重叠线条变暗。

正式 Creator 的 `assets/resources/effects/canclub-painted-blend.effect` 和独立运行描述均来自 `vendor/painted-blend-shader.mjs` 中同一段 GLSL。`npm run test:painted` 使用真实 Canvas 实现比较合成数学与原绘制模式；它不把 Canvas 和 WebGL 的边缘抗锯齿、过滤或最终画面认定为逐像素相同。

## 开发引擎材质的边界

`vendor/builtin-effects.mjs` 是源码引擎独立运行时的 2D 启动材质辅助，注册 Sprite、Graphics、Mask 及置灰材质。它不替代正式 Creator 的 effect importer；分离 Alpha 压缩纹理等路径未作为本次 PNG/WebP 资源使用。Creator 工程本身不加载这份开发辅助，也不替换编辑器内置材质。

源码打包通过、浏览器运行通过、Creator 编辑器构建通过、微信开发者工具通过、微信真机通过是分别记录的验证状态。请查看当前构建的 `BUILD-REPORT.json` 与项目交接文档中的实际结果。

## 持续验证

`.github/workflows/cocos-migration-ci.yml` 在 `migration/cocos-3.8.8` 分支推送时运行，也可手动触发。它依次安装锁定依赖、对照官方引擎声明检查类型、对照冻结 Preview11 验证业务和形变几何、构建 Web/微信共同入口，再在真实 Chromium 中运行 Cocos 场景和原生触控流程。工作流只有 `contents: read` 权限。

`npm run test:domain` 可独立运行业务对照；`npm run test:browser` 需要已构建并由静态服务器托管的 Web 版本，默认地址为 `http://127.0.0.1:8765/cocos/build/web-mobile/`，可用 `CAN_CLUB_URL` 覆盖。测试创建独立浏览器上下文，不读取玩家的实际存档。

CI 上传 `cocos-browser-qa-*`（截图与检查报告）、`cocos-web-build-*`（可复核 Web 包及微信构建状态）和 `cocos-creator-project-*`（带完整导入资源的工程 ZIP）。截图仍需视觉审查；非空截图、逻辑一致和几何数值对照不等于 Canvas 与 WebGL 逐像素一致，也不等于 Creator 编辑器或微信真机已通过。
