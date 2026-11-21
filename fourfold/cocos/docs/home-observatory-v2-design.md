# 星盘机关主页设计

版本：0.8.10；日期：2026-11-21。

## 用户目标

主页的星图手册没有对应功能，重新绘制主页，让主视觉直接关联四格旋转玩法，并保持现有精细深蓝金色画风。

## 交付与取舍

使用内置 image_gen，以原 `home-scene.png` 为编辑目标，以 `celestial-mural-v2.png` 为棋盘材质与构图参考。输出1174×1340的 `home-observatory-v2.png`；网页文件 `home-observatory-v2.webp` 仅进行同尺寸格式压缩。

主物件为正面九格星盘与四个交点星钮；移除书本、天球仪、书架及手册铭牌。保留暖色观星室、单侧灯光、深蓝星空、细金属雕纹和少量紫色。原画没有标题、数字、菜单或设置图标，真实标题及操作区由运行层提供。

主页主按钮显示“开始解谜”或真实已解锁的“挑战第N关”。点按图中的星盘也进入同一普通关；每日挑战和好友荣誉榜仍是独立入口。画面按全宽等比显示，不裁切主体，短屏滚动。

## 完整生成提示词

```text
Use case: stylized-concept.
Asset type: production mobile puzzle game HOME HERO illustration, not a complete screen.
Input image 1 is the OLD homepage to redesign; keep the warm illustrated observatory/paper/gold visual family, but replace its composition and remove the open book, book stand, armillary sphere and the book's title plaque.
Input image 2 is the approved current puzzle artwork: use its precise midnight-blue enamel, satin champagne-gold carved metal, four-point compass star and continuous orbit rings as the art reference for the new hero.

Create a refined new homepage hero for FOURFOLD, centered on the game's actual 3-by-3 rotating star-chart puzzle mechanism. The main object is a beautiful front-facing square celestial puzzle board: exactly THREE columns and THREE rows, NINE navy enamel pieces in a rounded champagne-gold and dark copper frame. Together the nine pieces form ONE visually continuous four-point compass star and astronomical rings, using image 2 as the reference. Exactly FOUR small round brass rotation controls sit at the four interior grid intersections (one-third and two-thirds of the board in both axes). Each piece has a thin polished bevel and fine engraved star-chart detail. No digits on the pieces. It should look like a finely crafted astronomical instrument, with clean geometry and shallow tactile depth, not a toy.

Composition: nearly square PORTRAIT, target 1344 × 1536 (7:8). All artwork composed natively for this ratio. The board is large and unmistakable, occupying roughly x=11%..89% and y=28%..94% of the image. Show it straight-on, not isometric or steeply tilted, with a subtle lower edge and restrained cast shadow on a small integrated pedestal. It is the central focus, with no book, manual, collectible chest, character or irrelevant prop.

At the TOP, leave one elegant BLANK cream title plaque, approximately x=18%..82%, y=5%..19%, with a fine gold bevel and a dark warm-brown edge. Its interior must be empty and smooth because the game will render its title there. Below it leave a quiet small horizontal strip at y=20%..25% for the runtime subtitle. Leave the far top-left corner relatively quiet for a real settings control. Do not draw a settings icon.

Environment: an intimate warm observatory alcove, warm apricot parchment plaster, a softly arched celestial recess behind the instrument, a restrained navy-and-gold starfield, and one discreet amber lantern on the far upper-right edge. Simplify the scene so the puzzle is the focus. Fine orbital linework in the warm background, soft amber illumination, clean dark blue negative spaces, small muted violet accents. Use the detailed, softly painted 2.5D illustration style of the references, with more controlled metal highlights and elegant craftsmanship. Avoid thick crude cartoon contours, random grit, excessive sparkles, sharp neon glare, or heavy visual clutter. The lower and side edges of the canvas should finish in warm apricot/parchment tones that can blend into the app's menu background.

NO text, NO letters, NO numerals, NO watermark, NO menu buttons, NO fake UI badges, NO extra title plaques or signs, NO book, NO instruction manual. The actual title, subtitle, three menu buttons and settings control will be live UI drawn separately by the game. Produce only the finished hero illustration, full bleed.
```

