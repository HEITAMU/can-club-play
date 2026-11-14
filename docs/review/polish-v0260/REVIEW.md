# Web 0.26.0

- Replaced backpack rows with 4-column item cells (16 per page); equipment sidebar uses 2 columns. Existing filters, item IDs, wear/unequip, and stories retained.
- Removed in-game title header. Currency, growth-list bag and settings now sit above bottom navigation. Equipment character is bounded by the space between 54px slots; profile and battle art are smaller.
- Warm paper, plum, terracotta, honey and lavender UI palette. Existing illustrated scene artwork is unchanged.
- Normal damage 10px, critical 13px, status 9px. Native damage label size matches.
- Melee movement approaches, holds at impact, and eases back. Ranged normals have zero travel offset; projectile and damage clocks remain unchanged.
- Removed high-frequency shield charge shake; reduced hit displacement. Authored pose drawings blend across transitions. Active sprites may draw at 60Hz, idle remains capped at 30Hz. This is an incremental 2D animation improvement, not an AFK Journey-quality skeletal rebuild. Crossfades cannot replace missing intermediate artwork.
- Preserved v0.25.2 browser timer wrappers and image-loading recovery.

Validation: 190 existing web/native tests passed after rebuilding native runtime; 2 new movement/grid tests passed. Browser verified boot, combat damage/settlement, equip/unequip and inventory navigation. Final equipment DOM at 480px game width: character 112×112, no slot overlap. UI/layout changes target the GitHub Pages edition; native layout remains separate.
