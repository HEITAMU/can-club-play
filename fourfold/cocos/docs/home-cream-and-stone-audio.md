# 0.8.18 · 暖奶油主页与石质音效

## 最终采用的美术方向

用户最终明确：希望暖奶油色 UI 面板配合拼图元素，避免背景完全是天空；拼图片采用本轮第一张候选里的不规则轮廓与金色包边。此前全屏天空的深色、亮蓝试色均未采用。

整页以暖奶油色为底，深暖棕实时标题、一个主入口与两个并排辅助入口。蓝紫色集中在四块不规则金边星图片内，保留原候选的月牙、星座线和精细金边，辅以少量浅金轨道。四片拼图与三个菜单面板之外不再套额外大展示框。

| 用途 | 最终生成文件 | 尺寸 | 运行资源 |
| --- | --- | --- | --- |
| 奶油底与不规则金边拼片 | exec-f502ac01-4678-4ad2-8bac-f9c791349dd0.png | 941×1672 | home-celestial-v6 |
| 奶油菜单透明图集 | exec-0205a974-2ad1-4f9c-bf6e-5846b89d5552.png | 1536×1024 | home-menu-v6 |

内置图像编辑以首张不规则拼片候选 `exec-82e31b18-2965-43ab-bd0e-b76987c9c90d.png` 为背景编辑目标，以 `home-menu-v5.png` 为菜单编辑目标。最终 PNG 保留原生成字节，WebP 仅作同尺寸 quality95 编码，菜单 alpha 与 PNG 完全一致。历史 v5 原图保留。

网页与 Cocos 共用 `HomeScene.js` 的画面、标题、点击区、图集与文字框。原生 `assetManifest.json` 同步实际 v6 文件与尺寸。菜单 story、daily 沿用旧裁片；rank 裁片扩大为 [796,509,680,450]，容纳新左缘，文字区域改为相对 [66,285,551,115]。主入口继续显示真实已解锁关卡。布局整体与 0.8.17 相同。

## 删除的说明

删除网页好友榜页面下方的 `rankHintRule`、对应赋值与样式，原文为“每日挑战每局可用2次提示，成绩照常参与排行”。代码检查确认原生每日页面最后只有“发起同关挑战”按钮，没有同样说明，因此没有误删其他原生文字。

## 音效设计与资源

| 音效 | 时长 | 设计 |
| --- | --- | --- |
| ui-stone-press-v1.mp3 | 0.28秒 | 短促、偏暖的石质触碰、细微干擦和接触共鸣 |
| stone-turn-v1.mp3 | 1.20秒 | 接触起动、随移动速度起伏的颗粒摩擦、短促沉稳落位 |

两段均为原创、确定性的程序拟音，无第三方采样。源 WAV 为48kHz单声道24bit；运行MP3为48kHz、192kbit/s。解码时长分别为13440/48000与57600/48000秒。网页和原生运行文件逐字节相同。详细频段、随机种子、电平、来源、脚本和校验在 `art-source/audio/`，不将素材描述为实地石板录音或在线模型生成成品。

## 播放行为

网页 `audio.mjs` 非阻塞预取音频，首次真实 pointer/keyboard 手势创建并解锁 AudioContext。按钮与转动分通道去重；旋钮不叠加普通按钮声。旋转只在真实动作开始时播放1.2秒素材，短暂解码延迟通过对应偏移接入，超过160ms放弃，不在页面离开或动作取消后补播。减少动态效果的120ms过渡使用短石触音，不加速、升调长素材。

原生使用两个常驻可停止的 AudioSource，音频加载不串入可玩美术的加载门槛。资源晚到时不会补播；STARTED 回调也核对当前声音需求，避免平台延迟启动复活已取消声音。取消/返回/重开/后台/组件禁用/静音/销毁均清理相关声音，前台恢复不自动续播。

两端沿用 `fourfold:sound`，默认开启，设置准确显示“音效：开/关”。旧正弦提示音及每隔数秒的背景单音已移除；本次未添加背景音乐。

## 验证边界

新增8项网页音效与生产事件测试、6项原生音频测试，覆盖有效按钮、旋转提示门槛、去重、静音、慢加载、失败、取消及前后台生命周期。此前提示、关卡、布局、资源和通关流程纳入完整回归。

音频已做实际编码/重新解码、采样时长、峰值、首尾边界、两端文件一致性检查。替身测试及音频数值检查不等于人耳听感验收，也不替代 Cocos Creator 或微信真机渲染/播放。

## 最终背景编辑提示词

Use case: precise-object-edit. Asset type: portrait background illustration for Fourfold, a warm cream UI game homepage. The supplied image is the EDIT TARGET and contains the exact four puzzle fragments the user wants. Preserve the four central IRREGULAR fragments exactly: their non-square asymmetrical wavy/angular contours, sculpted fine ornamental GOLD EDGES, positions, gaps, crescent moon, constellation lines and blue-violet painted interiors. Do NOT turn them into rounded squares or ordinary jigsaw-nub pieces. Keep the first image's refined gold ornament and dimensional edges. Replace the FULL-SCREEN SKY OUTSIDE those four fragments with a luminous warm vanilla / ivory / soft apricot CREAM app background. At least two-thirds of the overall page should read as warm cream rather than blue sky. The saturated blue-violet night sky belongs mainly INSIDE the fragments. The fragments float directly over the cream page with gentle warm contact shadows and a small soft light halo; no surrounding display frame, no board, no grid, no knobs. Keep a few sparse very fine honey-gold orbit curves and tiny stars as subtle accents on the cream ground; existing outer clouds become restrained warm ivory/apricot wisps at the far corners, not a sky panorama. No big cloud bands across the lower central UI region. Upper 6–20 percent stays clean cream space for a live dark-brown title; lower 62–95 percent stays clean cream space where three separate cream UI menu panels will be overlaid in code. Do not draw UI panels or buttons into this background, do not draw text or plaques. Keep the EXACT full-frame 941x1672 portrait layout and fragment positions/scale so existing live UI coordinates remain valid. Style: sophisticated soft painted game art, warm tactile ivory material, subtle rich color within the puzzle, gold detail, calm friendly polish. No full-screen blue sky, no black/night backdrop, no arch/window, no heavy outer frame, no new objects, no text, no watermark.

## 最终菜单编辑提示词

Use case: precise-object-edit. Asset type: production TRANSPARENT menu sprite atlas for a warm cream fantasy puzzle-game homepage. Edit the supplied existing atlas; preserve its full 1536x1024 canvas and EXACT three sprite silhouettes, positions, bounding boxes and internal blank caption zones. Keep one wide primary panel across the upper row, two smaller rounded panels at lower left/lower right. Repaint their materials into softly dimensional WARM VANILLA / IVORY / CREAM UI PANELS with restrained honey-gold bevels and gentle warm shadows. Cream should dominate every panel, not purple cloud mass or blue sky fills. Upper main panel: slightly warmer honey cream, small sculpted gold four-point star at the existing left position, broad clean empty cream caption zone across center/right. Lower-left: keep a graceful small gold crescent and a few tiny star/constellation accents in its existing upper icon region, backed mostly by cream; use only small muted blue-violet enamel accents around the icon, not a whole blue card face. Lower-right: keep the gold crown and laurel in the existing upper icon region, backed by cream, only tiny muted violet accents. Lower halves remain clean cream for live dark-brown captions. Reduce the large blue/purple clouds to subtle ivory relief edging so these read clearly as tactile warm cream game UI panels, coherent with rich blue-violet gold-edged puzzle pieces above them on the homepage. Maintain detail and soft rounded edge lighting, gentle depth, no thick dark outline or hard plastic shine. No text, letters, numbers or extra icons. Keep the exact sprite placements: primary approximately x48 y53 w1438 h385; left x53 y509 w672 h450; right x800 y509 w675 h450. Background between and around sprites must be truly fully transparent alpha=0, not a painted backdrop. Preserve no new surrounding large frame.

