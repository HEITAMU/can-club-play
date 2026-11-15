# v0.26.73

- Portrait SVG images now use direct href rather than lazy observer activation. Horizontal rail resets old absolute positioning. Browser checked all visible portraits at 390px and 320px; no iPhone device claim.
- Profile upgrade submits a ten-level quote and exact cumulative cost, truncating at the level cap. Browser verified level 30 → 40; tests cover exact deduction and cap remainder.
- Replaced shield rank badge with a stitched collar and paw tag. Existing rank 0–5, costs, bonuses and save keys remain unchanged. Progression UI calls this 项牌进阶.
- Attributes use warm paper, understated brown numbers and fine dividers.
- Equipment room scene replaced by compact framed UI. Stage height 165px. Two active set-effect rows plus stage measure 253px, matching backpack. At 320px width layout has no horizontal overflow. Empty set effects remain hidden.
- 281 tests pass; H5 and WeChat builds pass. Visual changes target H5, not verified on WeChat devices.
