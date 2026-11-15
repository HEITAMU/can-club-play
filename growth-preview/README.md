# 成长试玩 v0.28.0

试玩： https://heitamu.github.io/can-club-play/growth-preview/play.html?v=0.28.0-preview

原版： https://heitamu.github.io/can-club-play/?v=0.27.6

本目录是独立试玩导出，根目录 v0.27.6 源码、构建、美术及原版存档保持不变。

源码与验证记录： [experiment/growth-v0.28.0](https://github.com/HEITAMU/can-club-play/tree/af6cac9d79c1d97200310b9cdbf1751f5a8b12d6)，说明见 docs/review/growth-v0280/README.md。

基线回退点：stable/v0.27.6-before-growth，99ba272ce6bf703fdd9d5f8821b22a2db511d881。

试玩保存到独立的 can-club-growth-preview-v1，不读取或覆盖原版存档。返回旧链接即可继续原版。

入口须使用 play.html：避免原版 Service Worker 的目录/index.html 缓存回退。不要更改原版 SW 来部署本试验。
