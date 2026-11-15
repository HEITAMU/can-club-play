# v0.27.0 — reward visibility, figure scale and enemy hit art

Removed the fish-shop campaign shortcut and its event binding. Redrew the existing native SVG reward icon with a red/cream awning, cyan fish, gold coin and cream silhouette, plus an always-visible collection label. No new bitmap download is needed.

Shared battlefield unit increased approximately 12% (max 58→65 px); hero/enemy relationships and Shidun's ratio are preserved. Profile and equipment figures inherit the same increase, with profile space increased from 78→94 px and its panel from 260→276 px. Native battle uses the shared sizing function.

All 12 ordinary/boss atlas types now blend to their authored hit cel on the existing .22-second hit clock, even while charging or attacking. Return to idle is continuous; death does not trigger a live hit pose. The two existing material carriers keep their dedicated hit/death art. Native build previously discarded all but idle; it now packs idle/hit into 128px cells and its renderer addresses the second column. Gameplay timing and damage unchanged.

Validation: web and WeChat builds passed (native output 20,072,950 bytes, below 20 MiB). Existing full 329 tests passed; 3 additional tests cover all 12 hit paths in web/native crop layouts, scale bounds, and removal of the fish-shop route. Renderer contact sheet and icon contrast previews inspected. Local browser connection was unavailable; no device acceptance claimed.
