# 星图有点乱 · 主页字标 v1

用户于 2026-11-22 确定新游戏名，并要求主页使用带游戏特色的艺术字。

## 成品

- Cocos：`assets/resources/art/home-title-starmap-v1.png`，1086×362，保留透明度。
- 网页：`../../assets/art/home-title-starmap-v1.webp`，同图、同尺寸，约 130 KiB。
- 位置由 `HomeScene.js` 共用：981×1602 原画上的 `[128,126,725,241.6666666667]`，等比缩放。
- 移除旧英文副标题。分享、加载界面、浏览器标题与无障碍名称使用新中文名；保存键、资源目录和场景脚本类名保留，以保持已有存档和 Creator 场景关联。
- 原主页插画和三个菜单入口不变。Cocos 添加独立 Sprite，继续沿用有界并发加载与销毁流程。

## 图像制作

通过内置图像生成制作透明字标，以已确认的 `home-celestial-v9.png` 为风格参考。之后仅等比导出运行尺寸和 WebP 编码，无背景重绘。

Prompt: Production transparent Chinese game wordmark. Exact text 星图有点乱, five correct readable characters in one line, expressive softly rounded custom lettering. Match the reference’s hand-painted midnight indigo/violet star-map enamel, fine honey-gold edges, soft tactile paintwork, subtle lavender highlights. Tiny crescent and a few star/constellation accents, restrained playful baseline. No other text, no opaque plate, no extra background, no neon or retro arcade styling. Transparent alpha. Readable at phone width.

## 验证

主页共用坐标、Cocos 资源生命周期、网页音频诊断的现有测试共 18 项通过；浏览器检查实际艺术字与菜单。未运行 Creator 编辑器构建或微信真机。
