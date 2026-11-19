# Cocos Creator 3.8.8 迁移验收

更新日期：2026-11-19。后续开发入口为仓库的 `cocos/`，引擎版本固定为 **3.8.8**。

## 版本与备份

- 迁移前主线完整备份：[`backup/pre-cocos-3.8.8-20261119`](https://github.com/HEITAMU/can-club-play/tree/backup/pre-cocos-3.8.8-20261119)，提交 `8b30d6b9e2961950a4252c7ef82e743e2503165d`。
- 最新成长试玩源码完整备份：[`backup/preview11-source-before-cocos-20261119`](https://github.com/HEITAMU/can-club-play/tree/backup/preview11-source-before-cocos-20261119)，提交 `28eb8674f4b35a381ca37363d29189a9b4911da7`。
- 迁移工作分支：[`migration/cocos-3.8.8`](https://github.com/HEITAMU/can-club-play/tree/migration/cocos-3.8.8)。纯业务以 Preview11 为准，包含主线后续的结算与资源修复，不回退到根目录旧规则。

## 已迁移内容

八名伙伴、3500 关、十档品质、两套队伍方案、每日信物额度、装备五部位与 +15 强化、战斗结算、引导、活动、设置和存档已进入同一份 TypeScript 业务代码。页面由 Cocos 原生 Node、Sprite、Label、Graphics、ScrollView、EditBox 与 Button 构建。

原画完整姿态、轻形变、短过渡与各角色专用动作沿用冻结版数据。角色交叉过渡保留原 Canvas 的伙伴相加与敌人先后覆盖规则；治疗光带保留原曲线、连续渐变与前后遮挡。原始 53 张 WebP 转 PNG 的 RGBA 像素逐项一致，新增表情和治疗纹理由确定性脚本生成。

存档继续使用 `can-club-growth-preview-v1`，不写稳定版的 `can-club-save-v1`。测试在独立上下文中建立测试档案，没有把任何玩家的存档打进工程。

## 验证状态

| 检查 | 实际状态 |
| --- | --- |
| 官方 3.8.8 引擎声明类型检查 | 通过 |
| 冻结 Preview11 业务对照 | 22 项通过，含全 3500 关、八伙伴、存档、装备及真实战斗时序 |
| 姿态混合、治疗几何与特效池复用 | 14 项通过；不等同于 GPU 截图逐像素一致 |
| 包体、Creator 配置与共享兼容 | 14 项通过；包含正式 Bundle 配置与脚本版本、资源加载完成及重试隔离、正式入口广告配置、严格模式保留、空广告位、SDK 完成回调与缺少新 API 的读档/战斗快照；正式产物测试使用隔离文件夹夹具，不代替编辑器执行 |
| Web 与微信共享入口构建 | 通过 |
| 完整 Creator 工程 ZIP 生成 | 通过，包含 PNG、元数据、场景、脚本与设置 |
| 真实 Cocos 浏览器流程 | 通过：Chrome 157.0.8103.78 中 390×844 与 320×740，各 12 组真实流程和 14 张截图；包含按压跨真实结算和后台资源加载时切页 |
| Creator 3.8.8 编辑器导入与正式构建 | 未在当前环境执行 |
| 微信开发者工具和手机真机 | 未执行 |

CI 入口：[Cocos 3.8.8 migration](https://github.com/HEITAMU/can-club-play/actions/workflows/cocos-migration-ci.yml)。以对应提交的实际结果为准，失败轮次也保留错误报告与截图。

最近含运行代码的验收提交为 **`60aec3c602db0aa66ca9e9193e13c35ecaf82c4b`**，完整 CI 为 [运行 44490882731](https://github.com/HEITAMU/can-club-play/actions/runs/44490882731)。类型检查与 50 项自动检查（22 项业务、14 项绘制、14 项构建及兼容）通过。实际浏览器原始报告保存在 [verification/browser-20261119-input.json](verification/browser-20261119-input.json)，两种尺寸各通过 12 组流程、产生 14 张截图，结束时均没有未处理错误或剩余资源请求。浏览器产物 ID 为 `14511764669`，下载 ZIP 的 SHA-256 为 `7d8cc98a68d49351ee354479202b6651fdcbf98c7d150e49acc6f1905fb6487a`。

此前 [运行 44448283945](https://github.com/HEITAMU/can-club-play/actions/runs/44448283945) 曾通过，原始报告仍保留为 [verification/browser-20261119.json](verification/browser-20261119.json)。随后同一运行代码的自动复跑 [44448891897](https://github.com/HEITAMU/can-club-play/actions/runs/44448891897) 和 [44448893262](https://github.com/HEITAMU/can-club-play/actions/runs/44448893262) 均在强化后点击背包时超时；它们不能记为通过。本轮据此修复了后台结算重建按下节点、后台加载层覆盖其他页面这两条会影响原生输入的路径，并增加直接覆盖它们的真实触摸用例。旧失败报告没有记录完整的 START/END，因此不把其中某一条路径宣称为那两次失败唯一已证实的原因。

覆盖完整新手引导、背包切页时战斗继续、两次委托实际战斗与结算、结算读档恢复、奖励详情返回、装备教学与强化、材料及信物页面、伙伴招募与跨节点触摸拖放，以及真实治疗事件的渲染。新增用例分别按住底部导航与页面按钮，跨过一次真实巡街结算和下一战准备后松手；两个尺寸均保留同一节点，收到 1 次 START、1 次 END、0 次 CANCEL、1 次 CLICK。另延迟一条实际场景资源请求，验证后台仍加载时能通过真实触摸进入街区，随后释放原始网络响应并恢复原战斗。测试使用独立上下文和明确标注的开发数据；初始新号断言之前不注入进度。

每个尺寸在主动取消触摸用例中各记录了一条已确认的 Cocos 3.8.8 引擎诊断：引擎在不可取消的 `touchcancel` 上调用 `preventDefault()`。仅对该命令至随后两帧内的完整诊断文本分类，最多一次；其他 console error、所有 pageerror、资源错误仍导致失败。报告同时保存 DOM `cancelable:false`、`GameCanvas` 目标以及 Cocos `TOUCH_CANCEL` 已到达的收据。这不是对引擎问题的修复，也不声称真实设备永远不会出现同类诊断。

## 本轮续接与试玩

- [实际 Cocos 3.8.8 试玩](https://heitamu.github.io/can-club-play/cocos-preview/play.html?v=2d9092b1b4e67195f216)，运行文件指纹 **`2d9092b1b4e67195f216`**。CI 直接打开同一个 `cocos-preview/play.html`，重建后核对指纹一致。
- [完整 Creator 工程包下载入口](https://github.com/HEITAMU/can-club-play/actions/workflows/cocos-migration-ci.yml)：选择当前提交的成功运行，下载 `cocos-creator-project-*`。其中包含 PNG、元数据、场景与脚本；解压后用 Creator 3.8.8 打开 `can-club-cocos/`。CI 下载产物保留 14 天；长期源码及重建方式见 [工程说明](../README.md)。工程包生成不等于编辑器导入验收。
- 导航只在选中页或已结识伙伴数量变化时重建。持有实际触摸时暂缓页面、导航和弹层的破坏性重绘，松手后再消费保留的刷新标记；ScrollView 的模拟取消不结束物理触摸。后台换关不在其他页面显示挡触摸的加载层，已成功加载的资源不重复闪屏，战斗仍等待资源与两次绘制完成再继续。
- 正式 Creator 微信导出检查按实际 Bundle 版本核对远程配置和本地脚本，并在任何部署目录变动前验证。正式 Web 输出改为 `build/creator-web-mobile/`，便于与源码引擎构建独立验收。
- 结算背景与面板共用触摸记录；滑动、取消、跨区域双指不误关结算，真实轻点关闭后按原引导或委托路线继续。奖励详情关闭后恢复原结算。
- 原纸纹、委托横幅、阵容地面与结算奖章比例已恢复；奖励显示数量和品质。强化等级增加深色描边；场景缩略图按原 SVG 等比居中裁切，避免仓库齿轮被压窄。
- 治疗与条带效果复用时恢复父 Sprite 的透明度。真实治疗事件经过两次 Cocos 绘制后，逐顶点检查提交的透明度与几何和显式 UIOpacity 相符。
- 缺少 `Array.at` / `structuredClone` 时的兼容代码进入共享场景入口；正式 Creator 微信构建会在固定 `game.js` 入口注入广告配置，保留严格模式和哈希资源。已有原生 API 不被覆盖，未配置广告位不发奖励。
- CI 使用固定版本和校验值的 CJK 字体供截图，字体只安装到验收机器，不进入游戏资源。

历史视觉审查逐张覆盖 [运行 44447540084](https://github.com/HEITAMU/can-club-play/actions/runs/44447540084) 的 28 张图，发现并修正场景缩略图比例问题，随后复核两种尺寸的委托列表、委托板和详情共 6 张图。本轮输入修复另外抽查运行 44490882731 两种尺寸的强化装备、材料背包和街区共 6 张图；未见新增加载遮罩残留、缺图或操作区越界。街区截图中的暗层对应当前“装备引导 3/6”，不是残留加载层。静态截图审查不代表完整动画、真实手机性能或与旧 Canvas 的逐像素一致。

## 微信包体的含义

完整工程 ZIP 包含源码、原图、导入元数据、验证脚本和开发引擎，不能拿它的压缩大小判断微信上传主包是否超限。构建报告区分微信主包、分包和远程美术文件。

当前默认 PNG 资源共 114 项，磁盘总计 85,702,127 字节。本轮源码引擎微信开发主包为 **1,942,479 字节**，精确值随提交、调试开关和构建设置记录在 `build/wechatgame/BUILD-REPORT.json`。美术资源输出到单独的 `build/remote-art/`，不能再复制回主包。全部图片若同时解码，RGBA 纹理本身约 279.5 MiB；这不是实际运行峰值，也不包含引擎、图像解码副本与其他内存。

首屏预载按当前参战角色、敌人图集和场景选择，其他页面原图在首次使用时请求。新账号的预载名单从 43 张降为 21 张：PNG 从 39,450,420 字节降到 17,838,836 字节，纹理 RGBA 预算从 119.264 MiB 降为 56.800 MiB。没有缩图、删帧或降低画质；这是名单和图片尺寸的计算，实际进程内存仍须真机测量。已访问页面的纹理目前继续缓存。

包体检查递归计算文件字节，遵守显式打包排除项，主包超过 4 MiB 就使构建失败；主包与所有分包另受本工程的 30 MiB 保守总预算约束。此统计发生在开发者工具重新打包之前，不能代替上传校验。

依据：[Cocos 3.8 小游戏分包](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/subpackage.html)、[发布到微信小游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html)。官方文档列出微信主包 4 M、总分包 30 M，并允许远程美术资源；远程下载脚本不在本工程方案内。

## 正式发布仍需的实际条件

首先在正常安装并登录 Creator 3.8.8 的 Windows/macOS 桌面上完成工程导入与正式 Web 构建，使用 `build-config/web-mobile.json`，输出 `build/creator-web-mobile/`；这一步不依赖微信资源服务器。当前环境没有可用的编辑器桌面，未执行这项验收。

微信发布另需配置并部署已登记的 HTTPS 资源下载域名，在 Creator 3.8.8 执行正式微信构建，再通过微信开发者工具与真机检查首屏、触摸、切页、后台恢复、长时运行和资源缓存。广告位未配置时不给广告奖励；真实广告完成由微信 SDK 回调确认。

构建成功、包体符合预算、浏览器流程通过、Creator 正式构建通过和微信真机通过是不同检查，报告分别记录。当前工程不宣称已经上架或经过微信审核。
