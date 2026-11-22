# 0.8.26 · 按下与石板落位

用户要求旋转动画再慢一倍，按旋钮时有明确的触感按钮声，拼图旋转到位后再有石板落好的声音；两个“啪嗒”分开，普通按钮也应听得清楚。

## 时间与素材

网页和原生共用 `TurnMotion.js`，正常旋转为 2400ms：240ms 聚焦、1920ms 换位、240ms 收稳。原有运动曲线、实际槽位和正立图案不变。网页减少动态效果分支采用 240ms 淡化换位，两条素材仍以原速播放。

| 动作 | 素材 | 解码时长 | 播放增益 |
| --- | --- | --- | --- |
| 普通有效按钮 | `ui-stone-press-v3.mp3` | 0.240s | 0.9 |
| 有效旋钮按下 | `ui-stone-press-v3.mp3` | 0.240s | 1.0 |
| 实际完成、提交棋盘 | `stone-seat-v3.mp3` | 0.320s | 1.0 |

v3 重做接触主体与紧密回弹，落位声增加低中频重量和少量短颗粒；不使用 v2 整段连续摩擦。峰值约 −3.76dBFS，两条整体 RMS 分别约 −19.13 / −19.57dBFS。素材由本地确定性程序原创合成，无外部采样、实录或在线模型结果。母版、生成脚本、精确电平和校验见 `art-source/audio/README-v3.md`。

## 网页事件所有权

通用 click 处理器播放普通按钮音；旋钮仍排除在通用处理之外，避免叠加。`spin()` 通过可玩、提示方向和几何校验后调用 `beginTurn()`，同步取得一次性 token 并请求第一声。

动画的全部 `finished` Promise 成功、动作代次仍有效，或 requestAnimationFrame 回退确实走完之后，才提交棋盘和步数。完成渲染及胜利状态更新后调用 `finishTurn(token)` 播放第二声。没有以 2400ms 计时器预订落位声。正常渲染保留声音尾部；重复完成、旧 token、取消和新动作均不能再次触发同一落位。

`stopTurn()` 失效 token 与两个转动声道，普通 UI 声道独立；`stopAll()` 同时清理普通按钮声和待淡出的声源。重开、返回、设置、视口取消、后台、静音及销毁均阻止旧转动声。素材加载失败会在下一次有效操作重试；等待超过 140ms 的接触声丢弃，不跳过瞬态去播放尾声。

网页预取不会创建 AudioContext。真实 pointer/keyboard 手势负责创建及恢复 suspended / interrupted 状态；一次 decode 调用同时兼容 callback 与 Promise 返回。关于 interrupted 的处理依据为 [MDN 状态说明](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/state)，旧解码接口兼容依据为 [WebKit 215242](https://bugs.webkit.org/show_bug.cgi?id=215242)。这两处修复不等于已查明用户设备无声的唯一原因。

## 原生事件所有权

两个可停止的 AudioSource 分别承载 press / seat。普通按钮与旋钮复用 press 资源，增益不同。有效 `spin()` 建立 motion 后请求 press；`update()` 唯一提交点更新棋盘、完成正常或胜利重绘后请求 seat。

seat 绑定已完成的棋盘、局次与音频取消代次，并记一次性消费标记。正常同局重绘允许尾声结束；新旋转、弹窗、下一关、重开、主页、后台、组件禁用、静音和销毁使旧音无效。迟到的 STARTED 回调也检查所有权。缺失素材只按后续有效点击重试，资源加载完成不会补播旧动作。

## 验证范围

`web-audio.test.mjs`、`native-audio.test.mjs` 与 `turn-motion.test.mjs` 使用生产代码验证普通按钮去重、两个接触点、2399ms/2400ms 边界、实际完成提交、减少动态效果、静音、加载失败恢复及取消路径。连同提示、通关、交互棋盘和固定题库求解检查，定向回归共 62/62 通过。

`tests/audio-preview.html` 使用生产网页音频控制器和真实 AudioContext，经 AnalyserNode 读取非零输出，可操作试听、2.4 秒旋转、取消和音效开关。它是独立验收页，不加入游戏正常流程。浏览器仪表能验证输出信号，不能代替人耳、iPhone 或微信真机听感验收；平台替身测试也不代替 Creator 编辑器验收。
