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
| 包体、Creator 配置与共享兼容 | 10 项通过；包含正式入口广告配置、严格模式保留、空广告位、SDK 完成回调与缺少新 API 的读档/战斗快照；正式产物测试使用隔离文件夹夹具，不代替编辑器执行 |
| Web 与微信共享入口构建 | 通过 |
| 完整 Creator 工程 ZIP 生成 | 通过，包含 PNG、元数据、场景、脚本与设置 |
| 真实 Cocos 浏览器流程 | 通过：Chrome 157.0.8103.50 中 390×844 与 320×740，各 10 组真实流程和 14 张截图；本轮修正已复核 |
| Creator 3.8.8 编辑器导入与正式构建 | 未在当前环境执行 |
| 微信开发者工具和手机真机 | 未执行 |

CI 入口：[Cocos 3.8.8 migration](https://github.com/HEITAMU/can-club-play/actions/workflows/cocos-migration-ci.yml)。以对应提交的实际结果为准，失败轮次也保留错误报告与截图。

最近含运行代码的验收提交为 **`2f6deb7fd96c4dadff80fb0230507cba7c610462`**，完整 CI 为 [运行 44448283945](https://github.com/HEITAMU/can-club-play/actions/runs/44448283945)。实际浏览器原始报告保存在 [verification/browser-20261119.json](verification/browser-20261119.json)，两种尺寸各通过 10 组流程、产生 14 张截图，结束时均没有未处理错误或剩余资源请求。后续仅更新交接文档时，不改变这份运行代码的验收结论。

覆盖完整新手引导、背包切页时战斗继续、两次委托实际战斗与结算、结算读档恢复、奖励详情返回、装备教学与强化、材料及信物页面、伙伴招募与跨节点触摸拖放，以及真实治疗事件的渲染。测试使用独立上下文和明确标注的开发数据；初始新号断言之前不注入进度。

每个尺寸在主动取消触摸用例中各记录了一条已确认的 Cocos 3.8.8 引擎诊断：引擎在不可取消的 `touchcancel` 上调用 `preventDefault()`。仅对该命令至随后两帧内的完整诊断文本分类，最多一次；其他 console error、所有 pageerror、资源错误仍导致失败。报告同时保存 DOM `cancelable:false`、`GameCanvas` 目标以及 Cocos `TOUCH_CANCEL` 已到达的收据。这不是对引擎问题的修复，也不声称真实设备永远不会出现同类诊断。

## 本轮续接与试玩

- [实际 Cocos 3.8.8 试玩](https://heitamu.github.io/can-club-play/cocos-preview/play.html?v=5e0cfba8f77492db3374)，运行文件指纹 **`5e0cfba8f77492db3374`**。CI 直接打开同一个 `cocos-preview/play.html`，重建后核对指纹一致。
- [完整 Creator 工程包](https://github.com/HEITAMU/can-club-play/actions/runs/44448283945/artifacts/14493614154)包含 PNG、元数据、场景与脚本；解压后用 Creator 3.8.8 打开 `can-club-cocos/`。该 CI 下载产物保留到 2026-12-03；长期源码及重建方式见 [工程说明](../README.md)。工程包生成不等于编辑器导入验收。
- 结算背景与面板共用触摸记录；滑动、取消、跨区域双指不误关结算，真实轻点关闭后按原引导或委托路线继续。奖励详情关闭后恢复原结算。
- 原纸纹、委托横幅、阵容地面与结算奖章比例已恢复；奖励显示数量和品质。强化等级增加深色描边；场景缩略图按原 SVG 等比居中裁切，避免仓库齿轮被压窄。
- 治疗与条带效果复用时恢复父 Sprite 的透明度。真实治疗事件经过两次 Cocos 绘制后，逐顶点检查提交的透明度与几何和显式 UIOpacity 相符。
- 缺少 `Array.at` / `structuredClone` 时的兼容代码进入共享场景入口；正式 Creator 微信构建会在固定 `game.js` 入口注入广告配置，保留严格模式和哈希资源。已有原生 API 不被覆盖，未配置广告位不发奖励。
- CI 使用固定版本和校验值的 CJK 字体供截图，字体只安装到验收机器，不进入游戏资源。

视觉审查先逐张覆盖 [运行 44447540084](https://github.com/HEITAMU/can-club-play/actions/runs/44447540084) 的 28 张图，发现并修正场景缩略图比例问题；本轮只修改相关裁切，另复核两种尺寸的委托列表、委托板和详情共 6 张图。所审阅截图未见缺图、文字方框、结算遮挡或操作区越界。静态截图审查不代表完整动画、真实手机性能或与旧 Canvas 的逐像素一致。

## 微信包体的含义

完整工程 ZIP 包含源码、原图、导入元数据、验证脚本和开发引擎，不能拿它的压缩大小判断微信上传主包是否超限。构建报告区分微信主包、分包和远程美术文件。

当前默认 PNG 资源共 114 项，磁盘总计 85,702,127 字节。本轮源码引擎微信开发主包为 **1,940,907 字节**，精确值随提交、调试开关和构建设置记录在 `build/wechatgame/BUILD-REPORT.json`。美术资源输出到单独的 `build/remote-art/`，不能再复制回主包。全部图片若同时解码，RGBA 纹理本身约 279.5 MiB；这不是实际运行峰值，也不包含引擎、图像解码副本与其他内存。

首屏预载按当前参战角色、敌人图集和场景选择，其他页面原图在首次使用时请求。新账号的预载名单从 43 张降为 21 张：PNG 从 39,450,420 字节降到 17,838,836 字节，纹理 RGBA 预算从 119.264 MiB 降为 56.800 MiB。没有缩图、删帧或降低画质；这是名单和图片尺寸的计算，实际进程内存仍须真机测量。已访问页面的纹理目前继续缓存。

包体检查递归计算文件字节，遵守显式打包排除项，主包超过 4 MiB 就使构建失败；主包与所有分包另受本工程的 30 MiB 保守总预算约束。此统计发生在开发者工具重新打包之前，不能代替上传校验。

依据：[Cocos 3.8 小游戏分包](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/subpackage.html)、[发布到微信小游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html)。官方文档列出微信主包 4 M、总分包 30 M，并允许远程美术资源；远程下载脚本不在本工程方案内。

## 正式发布仍需的实际条件

配置并部署已登记的 HTTPS 资源下载域名，在 Creator 3.8.8 执行正式构建，再通过微信开发者工具与真机检查首屏、触摸、切页、后台恢复、长时运行和资源缓存。广告位未配置时不给广告奖励；真实广告完成由微信 SDK 回调确认。

构建成功、包体符合预算、浏览器流程通过、Creator 正式构建通过和微信真机通过是不同检查，报告分别记录。当前工程不宣称已经上架或经过微信审核。
