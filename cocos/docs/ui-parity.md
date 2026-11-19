# Cocos 原生页面迁移记录

## 对照基线

本次页面的数据、文案和交互对照 Preview11 源提交 `28eb8674f4b35a381ca37363d29189a9b4911da7`。工作区的对照副本是 `baseline-preview11`。没有采用仓库根目录中较旧的六伙伴规则。

界面使用 Cocos `Node`、`Label`、`Sprite`、`Graphics`、`Button`、`ScrollView`、`EditBox`。没有用网页、WebView、DOM 或整页截图承载游戏界面。人物来自共享 `UI.character` / `PaintedActor`，头像调用共享的原画裁切，角色业务全部经过 `GameSession`。

最终样式顺序依据原版 `scripts/build-web.mjs`：`warm-theme` 后还有 `companion-display`、`fishmarket-theme`、`commission-art`、`expedition-flow`、`journal-art`、`illustrated-ui`。因此装备页采用最后生效的 165 px 纸面装备区、下方套装条和右侧 253 px 背包；没有把已被覆盖的早期高大装备房间当成最终界面。

## 页面与功能

| 区域 | 原生实现 |
| --- | --- |
| 伙伴公共头部 | 养成 / 装备 / 阵容、实时鱼币、已结识伙伴横向头像栏；八伙伴共用同一全身单位尺寸 |
| 养成 | 左人物和猫牌、右七项属性、下方主动 / 被动 / 天赋；等级培养、消耗、培养继承、四级技能说明、研习成本及操作 |
| 猫牌 | 十品质名字与真实收益预览；信物 / 笔记当前量和成本；来源入口；原猫爪 SVG 路径转 `Graphics` |
| 装备 | 五槽、空槽筛选、右侧二列可滚动背包、全部筛选、两件 / 四件套装条；270 px 局部弹窗、穿戴 / 卸下、展开强化管理、洗炼、锁定、分解、物品故事 |
| 阵容 | 两套团队方案原文和头像、原室内背景、前二后三五落点、点击上阵 / 换位 / 下场、拖动人物、拖动时隐藏原位、宽松落区及触边滚动 |
| 背包 | 鱼币 / 勋章余额、装备部位筛选、装备网格、材料拥有量与来源、四列伙伴信物、招募及升阶入口 |
| 街区 | 原夜街背景、鱼摊和委托板的原画热点、成长清单与设置 |
| 委托 | 七分类插画、原装备三据点、材料五阶段、实际难度 / 开放条件 / 掉落 / 限额、夜巡妙招开关与真实概率、硬仗 |
| 信物委托 | 每日三次、每次随机五个；结算选择八伙伴之一后才能申请真实广告回调追加五个；领取状态与幂等由 Session 执行 |
| 鱼摊 | 实时鱼币 / 物资产率、累积领取、四经营项目当前级别 / 下一级变化 / 成本 |
| 手账与挑战 | 每日任务与交班礼、三十项成长之路、每周三难度、十二擂 |
| 成长清单 | 当前目标、装备和培养入口、成长任务状态与单项 / 全部领取 |
| 设置和存档 | 音效、音乐、自动保存状态、导出文字 / 文件、剪贴板 / 文件导入、校验预览、明确替换、重开确认、分享 |
| 暂停 | 继续、音效 / 音乐、显式返回街区；返回交给 `GameSession.returnToStreet()` 恢复原委托目录与巡街行为 |
| 结算 | 原胜败图、原文“拿下了！” / “暂时失利”、练习标记、可点材料 / 装备、失败重试 / 调阵容、广告选择与待领取状态 |
| 其他 | 开场、结识伙伴、通关、175 个二十关章节的街区进度 |

## 宿主接口

```ts
new Pages(ui, session, callbacks).render(parent, logicalWidth, pageHeight);
new Dialogs(ui, session, callbacks).render(parent, logicalWidth, screenHeight, type, data);
```

`pageHeight` 不包含底部导航。`screenHeight` 包含导航。UI 坐标以逻辑像素从左上角计。

```ts
callbacks = {
  open(type, data?),
  close(),
  refresh(),
  toast(text),
  closeReport(action = ''),
  getClipboard(): Promise<string>,
  setClipboard(text),
  exportSave(text),
  importSave(): Promise<string>,
  share(),
};
```

`closeReport` 由宿主先清除显式弹层栈，再调用 Session 的同名方法。Session 发出的引导和导航事件决定下一页。Dialogs 不自行把结算强制送回委托。`rewardPending` 时拒绝关闭结算。普通奖励详情关闭时，仍存在的 `session.report` 应恢复为底层结算。结算装备 / 材料详情传入 `inspect: true`，保留查看，不从待关闭的结算中执行穿戴或来源导航。用户关闭委托详情时调用 `Dialogs.dismiss()`，先返回该类委托列表；开始挑战等明确动作仍使用 `close()`。导入存档先关闭旧弹层，再让 `session.importSave()` 恢复新存档的引导和导航，避免后续关闭覆盖同步恢复结果。

装备按钮用共享 `worldRect` 取得 UITransform 自身四角（不把子节点和滚动内容并入边界），再把世界矩形转换到逻辑页面坐标，以 `data.anchor = { x, y, w, h }` 传给 Dialogs。局部卡片尝试贴在点击位置的一侧，并限制在屏幕内；背景不变暗。无需宿主读取全局鼠标或 DOM。

Session 修改成功发出的 `state` 和 `navigation` 应由宿主合并到下一帧渲染。`income` 只需轻量更新余额，避免打断拖动与存档输入。通用刷新需要保存并恢复 `ScrollView` 的滚动偏移。Cocos 3.8.8 的 `getScrollOffset().x` 与 `scrollToOffset()` 横向输入方向相反，保存时转换为 `(-x, y)`。阵容拖放采用同一世界坐标系，视口触边判定也只测 UITransform 自身四角。引擎会把源节点外的 `TOUCH_END` 分派为该节点的 `TOUCH_CANCEL`；拖放依据原始 `getEventCode()` 区分有效释放、系统取消与滚动产生的模拟取消。

### 稳定节点名

| 用途 | 节点名 |
| --- | --- |
| 轻量更新鱼币 | `wallet-gold` |
| 背包勋章 | `wallet-badges` |
| 三模式 | `crew-mode-profile` / `crew-mode-equipment` / `crew-mode-formation` |
| 橘座培养 | `upgrade-orange` |
| 身上爪套 | `equipped-claw` |
| 装备整体 / 右背包 | `crew-equipment` / `equipment-bag` |
| 背包装备 | `gear-<uid>`，例如 `gear-g7` |
| 装备穿戴 | `gear-equip` |
| 装备管理展开 | `gear-more` |
| 对话正文 | `dialog-content` |
| 委托板 | `district-board` |
| 装备分类 / 废件仓库 / 出发 | `street-group-equipment` / `street-choice-salvage` / `street-fight` |
| 街区成长 / 设置 | `growth-quests` / `settings` |
| 结算和广告 | `result-layer` / `result-close` / `result-retry` / `result-crew` / `token-select-<id>` / `token-ad-claim` |

## 验证

- 两个入口文件用 TypeScript 转译检查，语法诊断为 0。
- 独立于引擎的构建烟测使用真实迁移 Domain 与真实 `GameSession`，提供原生 UI 对象桩。
- 覆盖 390 px 和 320 px 两宽、88 个页面 / 弹层场景，含八位已结识伙伴、五人阵容、足量背包、装备管理展开、材料 / 信物、难度列表、设置、导入导出、结算。
- 产生 4,312 个节点，244 个不同命名操作；没有负数或非有限尺寸；实际引用的 21 个图像文件全部存在，全部实例裁切通过实际 atlas 尺寸检查。手账 / 挑战入口和六类硬仗图的冻结 SVG 使用 1536×1024 逻辑图像坐标，而原图实为 1152×768；原生 SpriteFrame 坐标已按 3/4 换算。
- 另检查结算广告待完成时不可关闭，以及结束时只委托宿主执行对应动作；四个拖放事件用例覆盖源节点外释放、系统取消、ScrollView 模拟取消和下拖下场。
- 烟测结果在任务工作目录 `ui-render-smoke.json`。这不是 Creator 3.8.8 像素或设备触摸验收报告。

## 仍需真机 / 渲染验收的边界

代码端已迁移内容和操作入口，但本记录不声称逐像素等价。UI 对象桩不能验证 Cocos 的字体断行、遮罩、EditBox 键盘、实际触摸传递、设备安全区或按下动效。最终运行验证由宿主真实 Cocos 预览完成。

原 HTML 的技能强调标签已去标记，保留原文。猫牌星与吊坠、猫爪采用原向量路径；原 CSS 的色相滤镜、模糊光晕、渐变与阴影目前使用原图和原生实色描边近似。没有把这些处理宣称为原位像素复刻。街区环境动画、全局提示、导航、引导遮罩、角色动画和战斗层属于共享渲染 / 宿主范围。

## 治疗带原生网格

`render/HealingRibbon.ts` 将原 `healing-fx.mjs` 的 34 个梯形、相位、厚度、前后层选择和颜色直接迁入原生三角网格。原来的四个渐变色标保持不变；每个梯形只在两个内部色标的 X 位置裁分，在各片内使用顶点颜色线性插值，所以不再采用每段均色近似。Alpha 保留原浮点数值。组件使用引擎白纹理和固定 612 个预留顶点的 Sprite assembler，无运行期位图生成或 Canvas 绘制；`Effects.ts` 的其他特效分支保持原样。

`tests/healing-ribbon.test.mjs` 从冻结提交直接读取原 `paintHealing`，记录其路径与 gradient，再与原生几何和顶点插值比较。三项检查通过：204 组原始轮廓、超过三万处颜色 / Alpha 插值，以及 1200 个相位下的前后遮挡互补和缓冲复用。类型检查通过。上述证据覆盖几何和渐变计算，真实引擎截图、GPU 边缘抗锯齿和手机表现仍由宿主运行验收。
