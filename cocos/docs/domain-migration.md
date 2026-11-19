# Preview11 游戏逻辑迁移记录

## 源版本与迁移边界

目标引擎固定为 **Cocos Creator 3.8.8**。新的游戏运行入口只引用 `cocos/assets/scripts/` 下的 TypeScript 源码；原来的网页入口与根目录 `.mjs` 留作版本备份和迁移比对，不参与 Cocos 游戏运行。

本次规则基线是 `experiment/growth-v0.28.0` 的提交 **`28eb8674f4b35a381ca37363d29189a9b4911da7`**，即已发布的成长试玩 Preview11 对应的完整源码。不能用 `main` 根目录旧版模块代替这个基线：`main` 的 `8b30d6b` 包含已发布的 Preview11 bundle，但根目录游戏源码仍属于较早的稳定版。

因此本次保留的是 Preview11 的 **3,500 关**、八名伙伴、十档品质、两套推荐阵容、最新失物信物奖励与固定数值的开罐支援，而不是将旧版 600 关规则重新接到新入口。`main` 发布后修复的结算层优先级已接入 `GameSession`；图片预加载及启动预算属于资源层，独立于这里的数值模块。

`assets/scripts/domain/migration-manifest.json` 记录了每个完整迁移模块的源文件、目标文件与源 SHA-256。目前共 58 个 TypeScript 模块：

- 55 个完整模块保持原源代码的执行内容，仅增加迁移说明、`@ts-nocheck`，并将 `.mjs?v=…` 引用换成 Creator 使用的无扩展名相对引用。
- `crew-skill.ts` 从原入口提取八名伙伴的技能说明与相关计算，供原生界面使用。
- `material-info.ts` 提取材料说明、来源和持有量读取。
- `loot-data.ts` 提取奖励材料名称与图集单元映射。

完整模块覆盖战斗、成长、关卡、伙伴、升阶、养成继承、装备、绝活、委托、日常、周常、经营、信物奖励、引导、动作轨道、战斗表现参数和音频配方。保留的原画动作采样和纯渲染辅助函数供 Cocos 层复用；浏览器 DOM 入口没有复制进运行层。

唯一有意修正的源文案是 `battle-cues.ts` 中两处过期的「回血20%」，改为「回复40生命值」。Preview11 真实开罐规则已经是固定恢复 40、固定伤害 50、冷却 5.6 秒，原战报文字没有同步。这个修正列在 manifest 的 `displayCorrections` 中，不改变战斗事件或数值，也不会被严格内容比较误认为规则改写。

## 保持的规则与身份

| 范围 | 保持内容 |
| --- | --- |
| 新号 | 第 1 关，橘座与阿墨两人，均为 1 级，200 鱼币；其余伙伴通过原招募规则获得 |
| 伙伴身份 | `orange`、`ink`、`milk`、`spark`、`mint`、`bolt`、`pudding`、`star`；石墩继续使用兼容 ID `pudding` |
| 战斗 | 原回合顺序、能量、普攻/绝活、护盾、中断、控制、命中时点与胜负结算；动画不决定真实伤害 |
| 主线 | 3,500 关完整敌方配置与奖励曲线；普通巡街胜利后自动推进，失败后继续巡街 |
| 培养 | 原升级曲线、品质升阶成本和倍率、两套推荐阵容、培养继承、绝活研习 |
| 装备 | 五个部位、套装、符文、副属性、锁定、穿脱、强化 +15、分解与洗炼 |
| 委托 | 原材料来源、三条装备路线、每日轮换、每周挑战、练习与可领取次数区分 |
| 失物信物 | 每日三次奖励，胜利随机 5 份；完整观看视频后可选 5 份；原票据和重复领取保护 |
| 经营 | 离线鱼币/物资、经营建筑、日常/旅程/成长任务、原广告经营助力限制 |

## GameSession：唯一应用状态控制器

`assets/scripts/game/GameSession.ts` 不依赖 `cc`、DOM、微信 API 或图片。Cocos 页面和战场只读它的状态并调用它的方法；数值操作委托给 `domain` 原模块，避免在界面里重新实现一套规则。

构造参数为注入的存储、时钟和广告播放服务：

```ts
const session = new GameSession({
  load: () => storage.getItem(SAVE_KEY),
  loadBackup: () => storage.getItem(BACKUP_KEY), // 可选
  save: encoded => storage.setItem(SAVE_KEY, encoded),
  clear: () => { /* 仅清理本游戏当前存档与备份 */ }, // 可选
  now: () => Date.now(),                         // 可选
  reward: placement => rewarded.watch(),         // 可选，tokens / business
});
```

运行时使用 `platform/Services.ts` 中的适配器，该适配器会在覆盖当前存档前保存可解码的上一份副本。上面的示例仅说明注入接口。

### 状态与更新

公开 `state`、`battle`、`tab`、`selected`、`mode`、`running`、`paused`、`loading`、`hidden`、`events`、`navigation`、`lastReward`、`lastRequest`、`rewardPending`、`saveOK`，以及 `report`、`intro`、`guideActive`、`guide`、`teamPlans` 读取器。

`tab` 取 `battle / cats / formation / bag / map`；`mode` 取 `profile / equipment / formation`。每帧调用 `update(dt)`，由它推进战斗、下场巡街、入场等待、离线收入刷新和定时保存。

- 切到伙伴、背包、街区或者创建普通弹层，不暂停逻辑战斗。
- `pause()` / `resume()` 只用于明确的暂停操作；`setHidden()` 用于应用隐藏/恢复；`setLoading()` 用于实际资源准备。
- 暂停菜单的显式「返回街区」使用 `returnToStreet()`：委托中会退出当前挑战、恢复普通巡街并回到原委托目录；普通巡街中保留暂停后的现场，重新点出战时继续。底栏切页不会调用此方法。
- 页面重建不能重新创建 `GameSession`，不能调用 `startBattle()` 充当刷新，否则会重置进行中的战斗。
- 活动、擂台和周常结算写入 `state.battleReport`，暂停后续战斗，刷新或重启仍然保留，直到明确调用 `closeReport()`。
- 结算存在时 `guideActive` 为 false，`guideEvent()` 不接受推进，防止已修复的教程抢占结算输入再次出现。
- `events` 是战斗事件队列，上限 512；渲染层用 `drainEvents()` 消费，或者订阅 `combat` 事件，两者选择一种处理方式以免播放重复特效。

### 操作接口

| 类别 | 方法 |
| --- | --- |
| 生命周期 | `subscribe(listener)`、`update(dt)`、`save()`、`setLoading(bool)`、`setHidden(bool)`、`pause()`、`resume()` |
| 战斗 | `startBattle(options)`、`useCan()`、`closeReport(action?)`、`reportRequest(report?)`、`returnToStreet()` |
| 页面/伙伴 | `changeTab(tab)`、`selectCrew(id)`、`setMode(mode)` |
| 培养 | `upgrade(id, count)`、`inherit(from, to)`、`recruit(id)`、`ascend(id)`、`breakthrough(id)` |
| 阵容 | `setParty(slot, id)`、`removeParty(id)`、`applyTeamPlan(id)`；`applyTeam(id)` 为同义入口 |
| 装备 | `equip(uid, id)`、`unequip(id, slot)`、`enhance(uid)`、`reforge(uid, index)`、`dismantle(uid)`、`lockGear(uid)` |
| 收入/任务 | `claimIdle()`、`claimQuests(id?)`、`claimDaily(id)`、`claimDailyChest()`、`claimJourney(id)`、`upgradeStall(id)` |
| 委托/挑战 | `startActivity(request)`、`startArena(tier)`、`startWeekly(tier)` |
| 设置 | `toggleSound()`、`toggleMusic()`、`toggleSpeed()` |
| 教程 | `startIntro()`、`guideEvent(event)`、`restoreGuide()`、`maybeGearGuide(wearing?)`、`skipGuide()` |
| 激励视频 | `watchTokenReward(id)`、`watchChosenTokens(id)`、`claimChosenTokens(id)`、`watchBusinessBoost()`；三个信物方法均要求真实服务完成回调 |
| 存档 | `exportSave()`、`inspectSave(encoded)`、`importSave(encoded)`、`reset()` |

`startBattle` 参数延续原入口：`{stage, arenaTier, weeklyTier, activity, entrance}`。`startActivity` 接收 `activityInfo` 规范化的请求，检查实际解锁状态。`closeReport('retry')` 再挑战原活动，`closeReport('crew')` 转到阵容并保留重试请求，空参数按原结算来源回到委托或挑战。

### 订阅事件与界面路由

`subscribe(listener)` 返回退订函数。监听参数包含 `type` 和下表字段：

| type | 主要字段 | 用途 |
| --- | --- | --- |
| `state` | `reason`、`revision`，以及本次变更数据 | 刷新页面数值；页面刷新不改变战斗生命周期 |
| `battle-start` | `battle`、`revision` | 绑定新的战斗对象并重建当前演员 |
| `combat` | `events` | 原战斗命中/技能/治疗/护盾/中断事件 |
| `battle-end` | `battle`、`result`、`report` | 表现结算；`report` 为空表示自动巡街结果 |
| `guide` | `step`、`previous?`、`guide` | 刷新对应的原生高亮和教程卡片 |
| `navigation` | `panel`、`route?`、`detail?`、`retry?` | 打开委托、挑战、阵容、成长任务或通关页面 |
| `notice` | `message` | 展示提示 |
| `save` | `ok` | 保存状态 |
| `reward` | `pending`、`placement` | 广告请求状态和按钮交互锁 |

事件同步派发。关闭结算时，应先结束旧弹层，再应用新的 `session.navigation`；不要用旧结算的 `route` 无条件再打开委托，否则会覆盖首件装备穿戴教学。`closeReport()` 返回 false 表示当前不可关闭，例如广告等待中。

构造时可能恢复教程路由，早于界面完成订阅；初次渲染除了订阅后续事件，还要读取 `session.navigation`、`session.report`、`session.guide`。

伙伴页按钮应通过 `changeTab('cats')` 推进伙伴教学，通过 `setMode('equipment')` 推进装备教学。打开具体装备前调用 `guideEvent('gear')`，穿戴成功由 `equip()` 推进 `equipped`。委托入口保留原 `board / equipment-source / salvage / depart` 事件；其余说明卡使用 `continue`。

首次引导第 13 步自然完成后，恢复第一场巡街并发出 `{panel:'quests'}`，延续原入口展示成长目标的行为。跳过教学或结束装备教学不会触发这个弹层。

## 存档与广告完成约束

继续使用原 `encodeSave/decodeSave`，不另创格式：

- 当前键：`can-club-growth-preview-v1`。
- 有效副本键：`can-club-growth-preview-v1-backup`。
- 编码格式：`CAN-CLUB-GROWTH-1`。
- 原稳定版键 `can-club-save-v1` 保持独立，既不自动导入，也不覆盖。

当前记录无法解码时尝试有效副本。新号与显式重置始终由原 `initialState()` 建立，不带开发者进度。导入先由 `inspectSave` 校验，界面展示预览并确认后再调用 `importSave`。测试覆盖物品、进度和待领取票据的旧存档读取与回写。

广告奖励不能由界面倒计时、关闭弹窗或者模拟成功发放。服务返回 `true` 或 `{completed:true}` 后，Session 才调用原票据发奖函数。一次请求只对应当前状态对象与票据；等待中阻止并发请求、关闭结算、导入与重置。已领取票据持久化，不能再次领取。

平台广告适配器还按每次请求创建独立 SDK 实例和监听函数，完成后解绑并销毁。这样上一条广告的延迟回调不会误结算下一条广告。完成与取消重复回调保持幂等；不可用、错误、超时或未完整观看均不授予奖励。

## 已执行验证

测试入口：`cocos/tests/domain-parity.test.mjs`。测试从 Git 的固定源提交读取原 `.mjs`，分别编译原模块、迁移模块、`GameSession` 和真实平台 `Rewarded.ts`，运行实际行为比对；不使用简化的战斗替身，也不只搜索文字。

执行：

```bash
node --test cocos/tests/domain-parity.test.mjs
```

需要先安装 `cocos/package.json` 中的 `esbuild`。若复用工作区已有安装，可用 `CAN_CLUB_ESBUILD` 指向该模块目录。CI 必须保留 `28eb8674f4b35a381ca37363d29189a9b4911da7` Git 对象；只有当前 HEAD 的浅克隆不能执行历史基线比对，可使用完整历史检出。

本次 **22 项全部通过**，覆盖：

1. 55 个完整模块的 SHA-256 与迁移内容严格比较，仅允许导入路径和记录在案的文案修正。
2. 八名角色在六个代表等级、五个品质档位的属性与升阶报价，全部 3,500 关敌人配置。
3. 新号、首个首领、物理主核、护盾主核和第 3,500 关五组同随机种子完整战斗；逐 tick 比较事件、生命、护盾、能量、回合状态和最终结算。
4. 五个装备部位的生成、+1 至 +15 强化与上限、洗炼、分解。
5. 信物每日三次、随机/自选五份、跨日重置、重复票据；轮换委托和周常日期规则。
6. Preview11 存档与结算票据读写、当前存档失败时有效副本恢复、新号重置。
7. 背包页仍持续巡街、自动下一关；活动结算留存、重载恢复和教程拦截优先级；新号完整教学中的培养、开罐练习与成长任务交接；暂停菜单显式返回会无奖励退出委托并恢复原目录。
8. Session 广告请求完成限制、并发锁、结算关闭锁与重复领取防护；SDK 上一单回调不能完成或取消第二单。
9. 原 `paintVFX` 的真实 Canvas 绘制指令与原生 `stripGeometry` 顶点/UV 对照，覆盖横向、纵向条带形变和揭露裁剪；保持 12 段、0.35 像素交叠与固定裁剪框。

这些结果验证逻辑迁移与状态控制。Cocos 引擎构建、页面视觉、资源加载、手机触控和微信真机运行需要各自的验证记录，不能由这组 Node 测试代替。

## 浏览器烟测脚本

`cocos/tests/browser-smoke.mjs` 为可运行浏览器的 CI/开发环境准备。默认访问已构建并托管的 `http://127.0.0.1:8765/cocos/build/web-mobile/`，可用 `CAN_CLUB_URL` 覆盖；产物目录默认为 `cocos/qa/browser-smoke/`。

脚本要求真实 `cc.VERSION === '3.8.8'` 和 `cc.Scene`，在 390×844 与 320×740 两种尺寸上用真实浏览器触摸点击 Cocos 按钮。覆盖首次完整教学、切页继续战斗、两次真实打捞/结算、穿戴教学、结算存储与刷新恢复、奖励详情、滑动/取消/双指防误关闭、强化、材料和信物页面、招募与跨节点拖放，以及实际治疗事件渲染；检查请求失败、脚本错误、原生图片错误及可见 Sprite 的纹理装载，并截图供审阅。

每个尺寸单独建立全新的非持久化 browser context，不连接个人浏览器、不读取玩家存档。首次开场断言前没有预置进度；之后仅在这个临时 context 中设置标明为开发数据的第 3 关解锁、两名 80 级伙伴及资源，以缩短活动流程等待。报告中保留这一测试条件，不能把它当作正常玩家养成结果。

实际 CI [运行 44448283945](https://github.com/HEITAMU/can-club-play/actions/runs/44448283945)已对提交 `2f6deb7` 完整通过：两种尺寸各 10 组流程、14 张截图。原始 [浏览器报告](verification/browser-20261119.json)同时记录隔离测试数据、原生取消事件收据、单列的已确认引擎诊断与治疗顶点透明度。只有主动取消用例的确切窗口允许记录一条完整匹配的引擎诊断，其他错误继续失败。截图已另做视觉检查，仍不代表与旧版 Canvas 逐像素一致、Creator 编辑器正式构建或微信真机验收。
