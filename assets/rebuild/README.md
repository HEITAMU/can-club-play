# 橘座逐只重做 · v0.22.0

本次运行替换仅包含橘座。以 v0.21.0 正式游戏的猫猫比例、脸型、毛色和服装为底版；其他七位伙伴仍使用原图集与原动作。

固定角色自身的左手持盾、右手空手。转身翻转整个角色，不交换部件。躯干图不含手臂或脚；左右臂、左右腿、尾巴和盾独立。运行时用完整的绘制手臂沿肩肘腕弯曲，不叠加带描边的上下臂。盾的握点与左腕共用位置，手指在盾把前方显示。

`source/orange.png` 为内置图像生成的原始透明部件页，参照 `assets/anatomy/cats-a-v0200.webp` 与 `docs/review/anatomy-v015.webp`。包装脚本仅提取透明包围框、等比缩放和打包，不重绘五官或手部。旧中性、眨眼、技能、受击、胜利、倒下表情保留；普攻使用同角色的新专注表情。原始页的分段上臂候选未接入运行图集。

重新打包：`python scripts/pack-rebuild.py`（Pillow、NumPy、SciPy）。运行图集坐标写入 `articulated-data.mjs`。

检查：`node --test tests/*.test.mjs`；`node scripts/review-rebuild.mjs` 生成同一游戏渲染函数的双向动作分解及加载图；`node scripts/browser-orange-review.mjs` 在原游戏页面内运行确定性战斗检查，输出手机尺寸截图和动画。浏览器测试不是 iPhone 或微信真机验收。
