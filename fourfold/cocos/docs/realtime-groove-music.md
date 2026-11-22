# 月下回旋 · v0.8.38

用户要求：给四格诡局制作好听、有记忆点、不吵的音乐；制作方式与此前的脉冲防线一致。

## 来源与实现

- 原创谱面：GrooveMusic.js，100 BPM，轻微切分，E 小调/Dorian 色彩，32 小节、76.8 秒。
- 音源：从用户的 Pulsefront C6.27 core/audio.js 移植 tone、hiss、note、trackVoice、reapVoices 与 setup。保留振荡器/噪声的分轨合成方法；调整分轨比例、主输出和压缩比，收轻高频。
- 四段编排：A 主题、A 轻微变化、B 回答、A 回归。旋律手写，节奏与贝斯有重复锚点。末尾不做战斗结算式渐弱，接回第一小节。
- 网页与 Cocos 导入同一份 JS；优先 wx.createWebAudioContext，浏览器回退 AudioContext/webkitAudioContext。正式播放不下载整曲 MP3，也未使用第三方录音采样或在线音乐生成服务。
- 独立音乐开关；首次手势启动；切后台暂停，回前台接续；旧恢复请求不能覆盖较新的播放状态。
- 25ms 调度，提前 140ms 排入音频时钟；迟到音符丢弃，声音节点结束后断开；销毁时释放所有音频节点与时钟。

## 验证

- node --test fourfold/tests/*.test.mjs：126/126 通过。
- 10 分钟调度模拟：循环后节点数量有界，无重复定时器；另覆盖暂停/关闭/隐藏/过期恢复与失速后的积压丢弃。
- 生产乐谱与音源用 web-audio-engine 离线渲染：44.1kHz 双声道；76.8 秒；1079 音符/打击事件；调度窗口内最多 23 个活跃源。
- 离线输出峰值约 -4.69 dBFS，综合响度约 -24.44 LUFS；无截幅。MP3 试听版仅加 25ms 进入、80ms 退出淡化，实时循环不做此淡化。
- 程序模拟、数值测量不代替真机听感。没有运行 Cocos Creator 编辑器构建，没有声明 iPhone/微信真机验收。

## 试听与再导出

打开 fourfold/music-preview.html，或打开游戏进入任意页面后听音乐。

tools/render-music-preview.mjs 用生产代码离线渲染试听。需要 web-audio-engine 与 wav-encoder；FOURFOLD_RENDER_DEPS 可指定已安装依赖的 node_modules 绝对路径。导出的音乐文件不是运行时依赖。
