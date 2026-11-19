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
| 姿态混合与治疗几何对照 | 12 项通过；不等同于 GPU 截图逐像素一致 |
| 包体与 Creator 远程构建配置 | 6 项通过；正式产物测试使用隔离文件夹夹具，不代替编辑器执行 |
| Web 与微信共享入口构建 | 通过 |
| 完整 Creator 工程 ZIP 生成 | 通过，包含 PNG、元数据、场景、脚本与设置 |
| 真实 Cocos 浏览器流程 | 正在 CI 运行与修复，尚未宣布通过 |
| Creator 3.8.8 编辑器导入与正式构建 | 未在当前环境执行 |
| 微信开发者工具和手机真机 | 未执行 |

CI 入口：[Cocos 3.8.8 migration](https://github.com/HEITAMU/can-club-play/actions/workflows/cocos-migration-ci.yml)。以对应提交的实际结果为准，失败轮次也保留错误报告与截图。

## 微信包体的含义

完整工程 ZIP 包含源码、原图、导入元数据、验证脚本和开发引擎，不能拿它的压缩大小判断微信上传主包是否超限。构建报告区分微信主包、分包和远程美术文件。

当前默认 PNG 资源共 114 项，磁盘总计 85,702,127 字节。源码引擎微信开发主包约 2 MB，精确值随提交、调试开关和构建设置记录在 `build/wechatgame/BUILD-REPORT.json`。美术资源输出到单独的 `build/remote-art/`，不能再复制回主包。全部图片若同时解码，RGBA 纹理本身约 279.5 MiB；这不是实际运行峰值，也不包含引擎、图像解码副本与其他内存。

首屏预载按当前参战角色、敌人图集和场景选择，其他页面原图在首次使用时请求。新账号的预载名单从 43 张降为 21 张：PNG 从 39,450,420 字节降到 17,838,836 字节，纹理 RGBA 预算从 119.264 MiB 降为 56.800 MiB。没有缩图、删帧或降低画质；这是名单和图片尺寸的计算，实际进程内存仍须真机测量。已访问页面的纹理目前继续缓存。

包体检查递归计算文件字节，遵守显式打包排除项，主包超过 4 MiB 就使构建失败；主包与所有分包另受本工程的 30 MiB 保守总预算约束。此统计发生在开发者工具重新打包之前，不能代替上传校验。

依据：[Cocos 3.8 小游戏分包](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/subpackage.html)、[发布到微信小游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html)。官方文档列出微信主包 4 M、总分包 30 M，并允许远程美术资源；远程下载脚本不在本工程方案内。

## 正式发布仍需的实际条件

配置并部署已登记的 HTTPS 资源下载域名，在 Creator 3.8.8 执行正式构建，再通过微信开发者工具与真机检查首屏、触摸、切页、后台恢复、长时运行和资源缓存。广告位未配置时不给广告奖励；真实广告完成由微信 SDK 回调确认。

构建成功、包体符合预算、浏览器流程通过、Creator 正式构建通过和微信真机通过是不同检查，报告分别记录。当前工程不宣称已经上架或经过微信审核。
