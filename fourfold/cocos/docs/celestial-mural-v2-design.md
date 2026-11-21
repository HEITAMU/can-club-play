# 第二版完整星图设计

版本：0.8.9；日期：2026-11-21。

## 设计与交付

用户要求九块图在现有深蓝金色风格中重新设计，提升材质与精细度，同时解决通关后线条不能完整拼合的问题。

使用内置 image_gen 编辑/重设计现有 `celestial-mural.png`，未使用CLI或其他模型替代。输出原图1302×1208，保留为 `assets/resources/art/celestial-mural-v2.png`；网页文件 `fourfold/assets/art/celestial-mural-v2.webp` 仅作同尺寸格式压缩。两端共用一套源矩形，分别取完整星图的九个目标窗口，数字、圆角、内框与旋钮继续由运行层绘制。

视觉方向：深蓝珐琅、香槟金金属倒角、细雕纹与少量高光；完整四芒星与连续同心环承担拼图结构；月牙、星座、云纹和行星帮助辨认外围图块。没有在原画中加入数字、九格边线或UI。

后续按用户要求，为每一块增加独立的珐琅反光、细金倒角、深蓝收边和暗铜底沿。表面材质在运行时与所属图块一起移动；完整原画、九个取样窗口和通关目标保持一致。

## 完整生成提示词

```text
Use case: stylized-concept, production game texture redesign.
Input image 1 is the existing full star-chart artwork to redesign, and the palette/style reference.
Create ONE complete, continuous celestial mural for the 3×3 rotating puzzle game FOURFOLD. The game will cut this ONE painting into nine movable pieces mathematically. This is the texture only, not a UI mockup and not nine separate cards.

Keep the established elegant illustrated midnight-blue and warm gold astronomical style, but redesign the craft and composition to look substantially more refined. Think a beautifully made antique celestial instrument: deep indigo enamel, satin champagne-gold metal, carefully controlled warm highlights, clean fine engraved orbit lines, discreet violet edges and beautifully finished bevels. Retain a soft hand-painted storybook character so it belongs with the existing warm illustrated game interface. Rich, precise, tactile, calm; avoid plastic, crude cartoon outlines, excessive bloom, and glitter.

Composition: flat, front-facing, perfectly orthographic full-bleed artwork. A centered, balanced four-point compass star with elegant elongated points and a small luminous ivory-gold core; its horizontal and vertical points flow across the middle row and column. Two or three continuous concentric astronomical rings and a few graceful orbit curves must cross the whole composition coherently. The center and rings form a real, geometrically continuous design. Give the outer regions recognizable yet restrained features: a sculpted gold crescent in the upper-left, a small precise constellation in the upper-right, subtle muted violet cloud shapes at the lower-left, and a small elegant ringed planet at the lower-right. Add only a few deliberate diamond/star inlays. Each of the eventual nine regions should have a distinct readable detail or line pattern. Leave breathing space: fewer isolated specks, no random scratches, no rough fragments.

Canvas: nearly square LANDSCAPE, target 1792 pixels wide × 1664 pixels high (14:13 aspect ratio, close to the board's 747:694). Compose natively for this aspect ratio: circular rings must look circular, not squashed. Fill the entire canvas to all four edges with the navy enamel star-chart illustration. All important compass tips, moon, planet and decorative features must be fully inside the image, with a small comfortable margin. Continuous orbit lines may naturally pass beyond the canvas edges. The artwork should remain clear at small mobile-board size.

No text, no digits, no letters, no labels, no watermark. NO 3×3 grid, NO tile boundaries, NO separated cards, NO knobs, NO UI controls, NO board frame, NO beige outer background, NO corner badges, NO baked shadows around individual tile regions. Preserve a single uninterrupted mural.
```

