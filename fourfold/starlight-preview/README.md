# 点亮星图 · 独立玩法试玩

用于理解和体验第二套玩法，未加入正式主页。8 个手工编排的小关卡；可通过下拉选关直接体验后段。单独使用 `STARMAP_LIGHT_DEMO_V1` 保存选关、完成记录和声音偏好，不读取或修改原拼图的存档。

点击一块星片使它原地顺时针转 90°。月亮固定为光源，只有两侧接口相对的星片才传递月光。点亮全部目标星星即完成；允许所有合法解法，不要求走预设答案。通关后留在完整棋盘上，点下一关继续。提供撤销、重来、提示、选关和声音开关。

原始插画质感沿用已认可的主页。独立星片通过内置图像生成制作，再等比导出 PNG / WebP；可见星路按真实连接数据绘制，便于准确交互。背景音乐与按键声复用现有共享模块。

规则代码在 `../cocos/assets/scripts/StarlightCore.js`，没有浏览器或引擎依赖，便于后续 Cocos 接入。本次交付为浏览器玩法原型，不是 Creator 导出包或微信真机验收。

检查：`node --test core.test.mjs`。覆盖关卡可解性、首次一步引导、任意合法旋转后的提示恢复、边界与互相连接、其他解法与环路、旋转对称性。

验证记录：6 项规则测试通过。浏览器实测首关通关和下一关、撤销、提示与选关；检查 320 × 568 和 390 × 720 的嵌入视口，修正小屏按钮折行后无横向或纵向溢出。未进行实体手机或微信环境测试。

图像提示词：Production front-facing square celestial tile on transparent alpha, matching home-celestial-v9 painted indigo/violet enamel and fine honey-gold rim. Quiet dark interior with subtle nebula texture, soft rounded corners and shallow tactile bevel. No paths, symbols, large stars, text or UI. Routes are rendered separately from game data.
