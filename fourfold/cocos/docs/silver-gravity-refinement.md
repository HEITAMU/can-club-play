# 银白引力细节与星芒修订

日期：2026-11-21；工程版本：0.8.13（本地待发布）。

## 用户要求与边界

用户先确认银色黑洞构图可用，之后要求细节更符合原系列，再明确“把星星做成我们的质感就好了”。因此保留黑洞、斜向吸积带、右下天体和既有星轨，只修订表面层次和星芒材质。

材质参考始终为原蓝、红、黄三图。银白与冰蓝为主体色，暖金为局部细节；不加入机械结构、宝石镶嵌，也不复制创生之柱元素。

## 两轮修订

1. v3细节稿：左上银弧与左下回流增加局部浅雕纹；吸积带分出冰蓝色釉、珍珠银亮面和蓝灰暗沿；精修右下天体的陨坑与球面明暗。
2. v4星芒稿：只把原有四颗大四芒星改为有中脊、倒角、暗铜侧面与受控高光的雕刻金属星，维持数量、位置、大小及其他画面。

最终运行资源使用 `celestial-frost-v4`，内部ID `frost` 和名称「银白引力」不变；编号继续为银白字面配深蓝描边。v2、v3源PNG和WebP留在 `art-source/archive/`。所有运行图片尺寸由实际文件读取后写入清单。

## 完整细节修订提示词（v3）

输入依次为原银白v2、蓝、红、黄。

```text
Refine the SURFACE DETAILS of the user's approved silver celestial black-hole illustration in image 1. Keep its exact composition. Images 2 (original blue), 3 (original red) and 4 (original amber) are the definitive series craftsmanship references: crisp hand-painted relief, fine recessed metal engravings, modeled enamel layers, sculpted bevels, controlled highlights and dark side-plane depth.

COMPOSITION LOCK:
Preserve the black central void's size, shape and position; the silver gravitational-lensing arc; the sweeping accretion band running from lower-left to upper-right; the icy cratered foreground world in lower-right; the small distant world in upper-right; all existing stars, beads, orbit paths and broad flow movements. Same canvas size, framing and silver/ice-blue/navy identity. This is a detail refinement of an approved composition, not a new artwork concept.

MAKE THESE THREE TARGETED CRAFTSMANSHIP IMPROVEMENTS:
1. On SELECT portions of the existing broad silver ridges above-left of the black hole and the returning silver flow below-left, add delicate shallow-carved flowing ornamental engravings using the same refined artisan vocabulary as the blue/red/amber references: a few small graceful chased scroll/leaf-shaped marks, fine recessed lines and slightly raised modeled ridges following the actual flow. Introduce tiny restrained pale champagne-gold inlays where they help unify the series. Integrate these details INTO the current flowing silver surfaces and taper them naturally away. Do not create a uniform continuous engraved frame around the hole.
2. In the bright diagonal accretion band, resolve currently broad white glare into nuanced layers of pearly SILVER metal highlights, ice-blue ENAMEL midtones and thin blue-gray underside shadows. Refine selected flowing edges with precise narrow bevels and controlled specular strokes. Preserve continuous fluid motion and celestial energy; it must not become a rigid segmented metal ring, clock face, piece of machinery or stacked jewelry bands. No tiled panels, rivets, gears, etched text or hard engineering geometry. Keep the central luminous flow powerful but with readable detail instead of featureless white bloom.
3. Refine the existing lower-right icy world's crater rims and terminator with clean rounded hand-painted relief, subtle silver bevel highlights, small clear recessed shadows and a very few warm reflected glints. Preserve its spherical curvature and existing crater distribution. No faceted gemstone surface, no crystal clusters, no complete gold border around the planet and no jewelry setting.

Overall keep the same premium hand-painted celestial illustration style as the approved originals, with more precise craftsmanship and tactile depth than the existing silver draft. Silver-white remains the main subject color; navy remains the background. Gold is an understated accent, not a palette takeover. Retain the existing textured navy ground, but clean any coarse muddy strokes at detail transitions if needed.
Do not add new objects or borrow any Pillars-of-Creation shapes. Do not add crescent moon, feathers, wings, weapons, dragons, characters, jewelry, gold clock rings, text, numbers, borders, tile grid or UI. Opaque background. One finished refined image only.
```

## 四芒星材质修订（v4）

输入为银白细节v3与蓝、红、黄原图；仅以原系列参考星芒的金属材质。

```text
Make a very precise LOCALIZED STAR-MATERIAL EDIT to image 1, the approved refined silver black-hole mural. The user says that making its stars match the established series material is the remaining change needed.

Edit ONLY the existing FOUR prominent four-point golden stars. They are approximately at normalized positions (0.63,0.055), (0.098,0.248), (0.78,0.595) and (0.298,0.79). Use the actual visible stars in image 1 as the targets. Keep exactly the same count, positions, four-point silhouettes, orientation and overall sizes.

Replace the stars' flat white-hot glowy appearance with the same visibly SCULPTED WARM-GOLD relief material seen in the original blue, red and amber reference artworks (images 2–4). Each star should have a clearly modeled raised center, four crisp tapered metal points, very shallow ridges running from center into the points, precise little beveled edges, subtle copper-colored side faces and a few controlled champagne/ivory specular highlights from upper-left light. They should look thick and carefully hand-painted, with a small amount of delicate recessed artisan line detail where size permits. Make the material read as fine carved gold, not as a flat light sprite. Retain a small restrained soft halo, but the gold object itself must be clearly visible instead of washed out white. Reference the blue mural's gold sculptural star craft, without copying its whole compass.
Do not add gem centers, crystals, circular settings, pendant attachments, more star points, star trails or oversized decoration.

ABSOLUTE PRESERVATION of everything else in image 1:
the dark black-hole void; its position and size; engraved silver lensing arcs; the diagonal accretion band with ice-blue and pearl-silver layers; newly added shallow surface carvings; lower-left flow; foreground cratered world in lower-right; small distant world upper-right; every thin golden orbit line and tiny spherical gold bead; all background brush texture, colors, lighting, canvas dimensions and framing. Do not redraw or relight these. Do not add or remove other stars or objects. No moon, clouds, pillars, new planets, rings, text, grid, frame, UI, watermark or logo.
The reference images are for STAR MATERIAL ONLY. Deliver this same silver illustration with its four existing star accents upgraded to the collection's sculpted gold finish. Opaque background, one image.
```

## 最终运行文件

- `cocos/assets/resources/art/celestial-frost-v4.png`：1302×1208，2583064字节，原样保留生成PNG。
- `assets/art/celestial-frost-v4.webp`：1302×1208，463010字节，仅做同尺寸质量95格式压缩。
- 目视核对四颗原有四芒星已呈现立体中脊、金色倒角、暗铜侧面和受控高光；黑洞、吸积带、天体及浅刻纹构图保留。
- 第3、5套仍在另行重绘，最新审稿边界见 `themes-3-5-fresh-redraws.md`。本文件只记录第7套细化，不代表全七套已发布。
