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

Creator 命令行正式构建配置在 `build-config/web-mobile.json` 与 `build-config/wechatgame.json`。微信正式构建使用下文的资源服务器配置与检查脚本；Web 可在编辑器构建面板导入 `build-config/web-mobile.json`。

## Creator 正式微信构建

`assets/resources.meta` 已绑定 `canclub_resources` 配置；`settings/v2/packages/builder.json` 只将微信平台的 `resources` 标记为远程 Bundle，使用 `merge_all_json` 合并资源索引。Web 与编辑器继续使用本地资源。该结构对照 Cocos 官方 `cocos-test-projects` 的 **v3.8.8** 工程设置，说明与来源见 [Creator 远程资源配置](docs/creator-remote-resources.md)。

在安装了 Creator 3.8.8 的机器上，先准备工程资源，再使用实际已登记的 HTTPS 资源服务器地址构建。以下可执行文件、域名及 AppID 需要替换为自己的值：

```bash
COCOS_CREATOR=/absolute/path/to/CocosCreator \
WECHAT_CREATOR_SERVER=https://your-registered-domain.example/can-club/ \
WECHAT_APPID=your_appid \
npm run build:creator:wechat
```

脚本生成 `build/creator-wechat-config.json`，调用安装的编辑器，并检查它实际生成的 `settings`、`remoteBundles` 和 `remote/resources/config*.json`。Creator 命令行的成功码为 `36`；脚本正确处理该成功码。未指定编辑器、资源服务器未填或导出没有形成远程 Bundle 时，脚本失败并说明原因。

成功导出后，`build/creator-wechatgame/` 是导入微信开发者工具的主包，`build/creator-remote-art/remote/` 是必须部署到资源服务器的完整远程目录。以示例地址为例，文件应能通过 `https://your-registered-domain.example/can-club/remote/resources/config.<hash>.json` 访问。保持 `remote/` 层级及版本文件名；不要把远程资源复制回主包。脚本保留主包内必要的 `src/bundle-scripts`，并在资源移出后递归检查主包预算。

需要先生成配置供编辑器面板审阅，可执行 `node scripts/build-creator.mjs --config-only --server https://your-registered-domain.example/can-club/`。这不会调用编辑器，也不代表正式构建通过。当前环境没有 Creator 编辑器，正式编辑器导入与导出仍未验证。

## 原画与资源

`assets/resources/art/` 使用正式原画转换后的 PNG，保持原始分辨率和像素，不将 2048 图集缩到 1024，不丢掉敌人姿势，不引入 `assets/concepts`、`orange-puppet` 或旧分层试作。

`asset-manifest.json` 和 `docs/asset-audit.json` 记录每项资源的原路径、资源路径、尺寸、字节数和 SHA-256。`render/Assets.ts` 接受旧路径，例如 `assets/finished/orange-v0213.webp`，正式 Creator 下先确保 Bundle 索引已加载，再经 `resources.load` 按需读取对应 Texture2D；独立运行版本经资源清单读取相同原画。Bundle 索引加载不会一次解码全部纹理。SpriteFrame 裁切使用原图坐标。

开发 Web 使用通过 SHA-256 核对的原始 WebP 字节，表情贴片使用 PNG；这只改变传输容器，不用移动端缩图替代原始图集。正式 Creator 导入及默认微信开发资源继续使用 PNG。引擎 downloader/parser 注册 WebP 并不等于每台微信设备的解码均已验收，因此微信的 `WECHAT_TEXTURE_FORMAT=webp` 仅作为明确选择的真机验证候选。

原图、57 张原表情贴片和 4 张原治疗粒子纹理保留后，共 114 张纹理。完整 PNG 文件约 85.7 MB；如果所有纹理同时以 RGBA 展开，像素数据约 279.5 MiB，另有引擎及渲染开销。文件体积、首屏下载量与运行时显存/内存是不同指标，当前代码按页面和实际使用加载，没有对全部纹理执行统一预加载。

源码引擎开发包和 Creator 编辑器正式包的远程目录格式不同。验证源码引擎微信开发包时，将 `build/remote-art` 的内容部署到已登记的 HTTPS 下载域名，再构建：

```bash
WECHAT_ASSET_BASE_URL=https://your-registered-domain.example/can-club/ \
WECHAT_APPID=your_appid \
WECHAT_REWARDED_AD_UNIT_ID=your_adunit \
node scripts/build.mjs --wechat
```

上面的域名和 ID 是占位示例，不能直接用于发布。`WECHAT_ASSET_BASE_URL` 用于源码引擎资源清单；`WECHAT_CREATOR_SERVER` 用于正式 Creator Bundle，它们不能靠复制同一套输出文件互换。未配置开发包远程资源地址时，构建报告明确记录未配置，运行时显示资源未配置错误。

[Cocos 3.8 当前分包文档](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/subpackage.html) 给出的微信限制是主包不超过 4 M、所有分包不超过 30 M，单个分包不另设大小限制。本工程以未压缩文件字节递归计量，主包超过 4 MiB 时直接构建失败，并保守地将主包与所有分包之和控制在 30 MiB 内；这不是对微信上传压缩字节的预测。正式包和源码引擎开发包共用这个检查，最终仍以开发者工具的真实上传检查为准。

## 存档与广告

存档 key 保留 `can-club-growth-preview-v1`，备份 key 为其后缀 `-backup`。先验证旧存档再写备份；当前设备的每名玩家各自保存。H5 源站存储与微信本地存储是两个独立空间，兼容同一存档格式不等于自动跨平台传送存档。

激励广告只有 SDK 明确返回 `isEnded === true` 才完成；提前关闭、SDK 出错、缺少广告位、忙碌及超时均不给奖励。每次观看有独立实例与监听，旧请求的重复/延迟回调不能完成新请求；超时后服务退役以避免继续接收不明来源回调。业务会话继续执行奖品单次领取约束。

`platform/Audio.ts` 复用原音乐谱、合成器与音效配方，浏览器使用 AudioContext，微信使用 wx.createWebAudioContext，设置开关与前后台状态由同一服务处理。

## 原画姿态过渡

每个完整角色使用单个 28 顶点网格。相邻姿态在一次 fragment shader 中采样，两层先按原权重和透明度转成预乘颜色，再按冻结版规则合成：8 名伙伴在透明表面上相加（Canvas `lighter`），敌人和载体按先后顺序 `source-over`。结果再以 `ONE / ONE_MINUS_SRC_ALPHA` 与背景混合，避免两个独立 Sprite 的遮挡使伙伴的重叠线条变暗。

正式 Creator 的 `assets/resources/effects/canclub-painted-blend.effect` 和独立运行描述均来自 `vendor/painted-blend-shader.mjs` 中同一段 GLSL。`npm run test:painted` 使用真实 Canvas 实现比较合成数学与原绘制模式；它不把 Canvas 和 WebGL 的边缘抗锯齿、过滤或最终画面认定为逐像素相同。

## 开发引擎材质的边界

`vendor/builtin-effects.mjs` 是源码引擎独立运行时的 2D 启动材质辅助，注册 Sprite、Graphics、Mask 及置灰材质。它不替代正式 Creator 的 effect importer；分离 Alpha 压缩纹理等路径未作为本次 PNG/WebP 资源使用。Creator 工程本身不加载这份开发辅助，也不替换编辑器内置材质。

辅助按照 3.8.8 的初始化顺序运行：设备就绪后注册 Effect 描述，`director.init()` 后创建 Material，渲染管线完成后编译 Pass。Web 与微信使用同一注册函数。

源码打包通过、浏览器运行通过、Creator 编辑器构建通过、微信开发者工具通过、微信真机通过是分别记录的验证状态。请查看当前构建的 `BUILD-REPORT.json` 与项目交接文档中的实际结果。

## 持续验证

`.github/workflows/cocos-migration-ci.yml` 在 `migration/cocos-3.8.8` 分支推送时运行，也可手动触发。它依次安装锁定依赖、对照官方引擎声明检查类型、对照冻结 Preview11 验证业务和形变几何、构建 Web/微信共同入口，再在真实 Chromium 中运行 Cocos 场景和原生触控流程。工作流只有 `contents: read` 权限。

`npm run test:domain` 可独立运行业务对照；`npm run test:painted` 包括姿态合成与原治疗流带几何/渐变对照。`npm run test:build` 验证超预算时命令确实失败、单分包没有错误的 4 MiB 限制，以及正式输出配置检查；其中 Creator 输出使用文件夹 fixture，不冒充编辑器真实导出。`npm run test:browser` 需要已构建并由静态服务器托管的 Web 版本，默认地址为 `http://127.0.0.1:8765/cocos/build/web-mobile/`，可用 `CAN_CLUB_URL` 覆盖。测试创建独立浏览器上下文，不读取玩家的实际存档。

CI 上传 `cocos-browser-qa-*`（截图与检查报告）、`cocos-web-build-*`（可复核 Web 包及微信构建状态）和 `cocos-creator-project-*`（带完整导入资源的工程 ZIP）。截图仍需视觉审查；非空截图、逻辑一致和几何数值对照不等于 Canvas 与 WebGL 逐像素一致，也不等于 Creator 编辑器或微信真机已通过。

目前项目尚未配置和部署真实资源服务器域名，也没有完成 Creator 编辑器、微信开发者工具与真机验收；发布仍未完成。
