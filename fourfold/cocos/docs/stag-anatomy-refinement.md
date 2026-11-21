# 逐星之鹿后半身结构修正

日期：2026-11-21。生成方式：内置 image_gen 的局部编辑；不使用程序绘画或滤镜。

## 用户选择与范围

用户从第3套10张候选中选择09鹿方向，并指出：“鹿可以，但是后半身有穿帮”。这先确认了题材方向并要求修复后半身。查看修正版后，用户明确表示“就这个了”，并要求将后续定稿替换进棋盘；本稿现已正式采用。

编辑输入为 `art-source/candidates/slot3-ten-options-v1/09-leaping-stag.png`。它是10选1中的鹿稿，已经修短尾巴，但后肢根部仍有结构问题。原10张及提示词历史保留在 `slot3-ten-options-v1.md`。

## 实际检查与修复目标

原图可以数到两只后蹄，但两条细后腿像从同一个卷曲块面分叉；腹部下缘又有宽长的肢状轮廓汇入后腿，造成多出一条大腿的观感。臀部、近远侧大腿和关节的连续关系不清楚。

本次重绘后腰、骨盆、臀部、腹股沟与两条后腿，建立近侧腿从可见髋部连续伸出、远侧腿根被臀部部分遮挡的结构。每条腿应有独立可追踪的关节和后蹄，删除多余腹下分叉。保留短尾、鹿角、头颈、胸部、两条前腿、右上跃姿、绿金色系、二维厚涂和背景。

这是一幅风格化游戏原画，不将它改成写实动物照片或解剖图，也不增加肢体或配件。

## 正式采用状态（本地接入，未发布）

修正版原始PNG逐字节保存为 `art-source/candidates/celestial-stag-v1.png`，没有裁切、缩放或格式转换。实际尺寸1302×1208，2082365字节，SHA-256：`ec8fec31b3271219fa115f8a46242b41ddef8d66d3e45f66df5e1b353859cc20`。用户已确认这一修正版；第3套采用名称「逐星之鹿」，保留内部ID `jade` 与原有顺序。

运行PNG为 `cocos/assets/resources/art/celestial-stag-v1.png`，与上述原稿逐字节一致。网页 `assets/art/celestial-stag-v1.webp` 使用quality95、同尺寸压缩，296990字节，SHA-256：`15d9e23a23045855b7f8115b561b9c4c3542d0d72a9f037b13f416952adeef2e`。`TileThemes.js` 和 `assetManifest.tileThemes` 已同步名称、路径与实际尺寸，不改九格取图、编号、旋转或每日轮换规则。

第5套同步采用 `celestial-libra-v2`「天秤星衡」，见 `themes-3-5-fresh-redraws.md`。旧 `celestial-jade-v1`、`celestial-tide-v2` 的PNG和WebP完整移入 `art-source/archive/`。本次为本地接入，尚未公开发布。

## 视觉核对

修正版的腹底多余肢状分叉已去除，腹线连续。近侧大腿从可见臀部接出，远侧腿从后方露出；两条后腿各自通向独立后蹄，未见接错蹄、共用小腿或重复肢体。原先卷曲C形臀腿连接已重画。前半身、跃起方向与绿金厚涂风格保留。这是生成后所作的视觉检查；用户随后已确认采用。

## 完整提示词

生成标识：`stag_hindquarters_v1`。输入只有上述09鹿原画，继承已确认方向的画风，不引入新风格参考。

```text
Use case: precise-object-edit. Correct the anatomical construction of the REAR HALF of this existing green-and-gold leaping stag illustration. The user has chosen this stag concept but identified an obvious error in the hindquarters. Preserve the approved style and the recognizable design.
EDIT ONLY the lower-left rear torso, pelvis, rump, groin and TWO hind legs. Keep the antlers, face, ears, neck, chest, both front legs, right-upward leaping direction, short tail, green/gold palette, background stars/curves and two-dimensional thick-painted finish as close to the source as possible. Do not redesign the animal or change the composition.
SPECIFIC ERROR: the current hind limbs appear to split from one shared curled muscle mass, and a broad extra limb-like strip runs from the underside of the belly toward the rear legs, making a false third thigh. Remove that extra limb-shaped underside branch and replace the curled C-shaped hindquarter with one naturally connected pelvis and rump.
REBUILD THE ANATOMY clearly:
- A single coherent torso and spine connect smoothly into one broad rounded pelvis/haunch. The belly has one clean continuous underside and a readable groin.
- Exactly TWO hind legs, one near and one far. The near thigh emerges naturally from the visible side of the hip. The far leg's upper attachment is partially occluded BEHIND the rump; it does not branch out of the near leg.
- Each leg has its own continuous readable upper thigh, forward stifle/knee, lower leg running back toward the hock, slender lower segment and compact cloven hoof. Show plausible deer joint bends, not straight human arms, wavy ribbons or fused joints.
- Retain an airborne leaping pose with both hind limbs trailing toward the lower-left, but slightly offset their bends and their two hooves so each leg can be visually traced independently. Clear small background gaps distinguish their lower silhouettes. No extra leg, duplicated thigh, disconnected joint or shared leg root.
- Keep one SHORT natural deer tail properly attached to the top-rear of the rump; do not lengthen it.
Paint the repaired anatomy with the SAME flowing opaque green brush planes, dark forest-green shadows, moss/olive highlights and restrained embedded gold engraving. Form follows the actual muscles and leg structure; ornamental strokes must not look like extra body parts. No photoreal flesh, anatomical cutaway, exposed muscles, flat vector shapes, glowing translucent body, armor or added accessories. Preserve the established fine illustrated celestial/tarot-like style and avoid a 3D product render.
Fully opaque full-bleed art at the same approximately 1302 by 1208 pixels and same near-square landscape ratio. No words, numbers, border or card frame.
```
