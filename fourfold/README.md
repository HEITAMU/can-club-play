# 四格诡局 · FOURFOLD

微信好友同关挑战 × 3×3 四格旋转益智游戏。目标：转动任一 2×2 方块（顺时针或逆时针），用尽量少的操作把九枚印记归位，争夺真实好友最优解。

> 工程版本：**Cocos Creator 3.8.8**。网页试玩和 Cocos 小游戏通过 `cocos/assets/scripts/Core.js` 与网页的 `CoreHardWeb.js` 使用一致的规则与固定题库。网页试玩版不冒充 Cocos 渲染版，微信好友榜与微信广告仅能在微信小游戏内运行。

## 试玩

打开本文件夹 `index.html` 的静态站点（推荐 GitHub Pages；本地用 `python3 -m http.server 8000`），直接手机或电脑浏览器开玩。建议手机竖屏。键盘 `1–4` 旋转四个位置、空格切换旋转方向、R 重开。

## 0.7.1 美术接入

主页、普通关与每日挑战采用已确认的星图美术。按钮、脚印/沙漏数据牌、九块星图和旋转钮均为独立可操作组件；步数与时间实时显示。每日页删除重复顶部标题，仅在日期横幅内显示“每日挑战”。网页资源约 0.8 MB，Cocos 使用同源 PNG；原生接入与验证边界见 `cocos/docs/ART-INTEGRATION.md`。

## 玩法闭环

- **18 份闯关档案**：完成当前局面才解锁下一关，存档自动保存至本地。
- **每日同题**：固定 UTC+8 日期，保证同一天每个人拿到完全一样的题目；分享时携带日期和挑战步数。
- **真正的最优解**：9! 个合法排列组成的状态图，使用双向广度优先搜索；理论最少步数与实际提示均由算法算出，非凭空设定。
- **荣誉**：最优解、极致推演、逻辑高手、破局者；理论最优与玩家得分显示分开。
- **公平分数**：主要比较步数，相同步数比较用时；使用提示者不上传微信排名。
- **自愿分享**：公开战绩+同题链接，不做强制分享、转发后解锁、邀请奖励、虚构好友。
- **可选广告**：原生微信激励视频（提示）、结算 Banner 预留，未配置广告单元时仅测试免费提示。

## 工程结构

```text
index.html / app.js / style.css        网页试玩（微信关系链/广告不可用）
assets/art/                            网页美术 WebP 与图集坐标
cocos/assets/resources/art/            原生 PNG 与共用美术清单
cocos/package.json                    Cocos Creator 3.8.8 主工程入口
cocos/assets/scenes/Main.scene        启动场景，附加 FourfoldGame
cocos/assets/scripts/Game.ts          原生 Cocos 组件、微信分享/广告/好友榜
cocos/assets/scripts/Core.js          两端共用规则与双向 BFS
cocos/build-templates/wechatgame/
  openDataContext/index.js             好友排行的独立开放数据域
cocos/docs/RELEASE.md                  小游戏构建及上线核验清单
tests/core.test.mjs                    规则一致性自动测试
```

## Cocos Creator 打开方式

1. Cocos Dashboard 安装 **3.8.8**，选择“导入项目”，目录指向本仓库的 `cocos/`（其中包含 `package.json` 和 `assets/`）。
2. 在资源面板打开 `assets/scenes/Main.scene`，点击 **预览**；场景会由 `Game.ts` 创建 Canvas、UI、相机和交互按钮。
3. 打开「项目 → 构建发布 → 微信小游戏」，填自己的 AppID，勾选“生成开放数据域工程模版”，构建。`build-templates/wechatgame/openDataContext/index.js` 应当拷贝进构建产物。
4. 完整发布流程见 `cocos/docs/RELEASE.md`。开通广告位前 `Game.ts` 里的 `AD_IDS` 为空，不会调用虚构广告。

## 已做验证 / 未做验证

**已验证：** 原生共用规则脚本的 Node.js 测试（旋转逆操作、题目可解、最优路径、日期题稳定、成绩排序与分享参数）；TypeScript 静态解析。**未验证：** 没有在本环境运行 Cocos Creator 3.8.8 编辑器/微信开发者工具进行真机打包与审核，因此不能声称“已上线/通过微信审核”。微信 AppID、流量主广告位与隐私协议需要实际账号配置。好友关系链在网页无法测试。GitHub Pages 网页已实际验证主页、普通关、每日挑战、顺逆时针、首关通关与下一关解锁、重开、提示、分享复制反馈及荣誉榜跳转；每日页只显示一个“每日挑战”，棋盘实测宽高相等。网页验证不替代 Cocos 引擎渲染或微信真机测试。

**注意：** 好友排名目前采用 `wx.setUserCloudStorage` 客户端分数上传。它适合好友娱乐竞技，但不能防止故意修改客户端。若有现金奖品或正式竞技赛事，须加服务端规则校验/重放验证。日常同题依 UTC+8 日期轮换；不依赖未经证实的市场规模数字。
