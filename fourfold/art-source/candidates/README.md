# 已采用原稿与历史候选

## 当前采用状态（本地接入，未发布）

用户已确认09鹿方向的后半身修正版，并要求将后续定稿替换进棋盘。以下两张已正式采用，来源原稿继续保存在本目录；目录名不表示这两张仍待审。

| 槽位 | 已采用原稿 | 名称 | 尺寸 | 状态 |
| --- | --- | --- | --- | --- |
| 3 / jade | `celestial-stag-v1.png` | 逐星之鹿 | 1302×1208 | 后半身修正版已确认，已接入本地 |
| 5 / tide | `celestial-libra-v2.png` | 天秤星衡 | 1301×1209 | 已采用，已接入本地 |

两张PNG逐字节复制到 `cocos/assets/resources/art/`；网页 `assets/art/` 使用同尺寸quality95 WebP，不裁切、缩放或改画。`TileThemes.js` 与 `assetManifest.tileThemes` 已同步。旧 `celestial-jade-v1`、`celestial-tide-v2` 的PNG和WebP已完整移入 `art-source/archive/`。尚未公开发布。

采用记录见 `cocos/docs/stag-anatomy-refinement.md` 与 `cocos/docs/themes-3-5-fresh-redraws.md`。原10张仍保留在 `art-source/candidates/slot3-ten-options-v1/`，其中09是后半身修订前稿，其余为历史备选。以上路径均相对于 `fourfold/`。

## 天秤前稿

- `celestial-libra-v1.png`：前稿，1301×1209，仅供回溯，不进入运行资源。

## 沙漏方向已撤回

用户已明确不要沙漏。以下三张全部为历史候选，不再待审，不接入运行：

- `celestial-hourglass-v4.png`：加强左上至右下倾斜的沙漏稿，1302×1208。
- `celestial-hourglass-v3.png`：较小幅度斜向构图稿，1302×1208。
- `celestial-hourglass-v2.png`：正面二维厚涂稿，1302×1208。

更早的沙漏首稿因画风偏离未采用；翡翠彗星、深紫风暴巨行星方向已被覆盖，深紫巨鲸也被明确否定。

## 已保存的历史候选

`celestial-bipolar-v3.png` 是NGC 6302双极轮廓的历史候选，未采用，已被后续重绘要求覆盖。该稿曾按当时反馈去掉宝石切面与透亮玻璃感，使用不透亮的紫色气体层次和局部金属细纹，并保留饱满手绘背景；不再作为当前待审方向。

`celestial-bipolar-v2.png` 是NGC 6302背景调整后的历史候选，未采用。用户随后要求主体去宝石感和透亮感，产生v3；整个双极星云方向之后又被覆盖。

`celestial-jade-aurora-v2.png` 是2026-11-21绘制的翡翠极光初稿，已去除左上月亮。用户明确指出画风偏离，属于未采用历史候选，不可作为当前选用稿。

上述三张仅供历史回溯。第3套双极星云阶段的审稿记录见 `cocos/docs/theme3-candidate-redraws.md`，早期绿色初稿提示词见 `cocos/docs/pillars-jade-redraw-v1-design.md`；这些路径均相对于 `fourfold/`。
