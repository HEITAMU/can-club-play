# Fish-market palette and single shield shell — 0.26.36

Companion/profile and inventory use harbor blue, dusk plum, lantern gold and canvas cream. Character display and active actions carry warm focus, attributes recede into blue, skill study is green and badge promotion plum. Bag tiles, equipment empty slots and set text share the same readable palette. Compact layout and scale remain unchanged.

Removed shield-shell sprites from skill-application and block-impact effects. Persistent actor-bound guards remain the only shield shells; cast sparkles and hit flashes remain. This prevents the second lower-offset shell beneath an Orange skill target and extra shield overlays during blocking. Guard ownership continues to depend on actual living actors with positive shields, not empty formation slots.

Full suite: 192 passed. Added real Orange skill rendering regression asserting exactly two shells for two shielded actors, none at a supplied empty center, no extra shell during block feedback, and one shell after the second actor dies. Existing movement, death and shield-break tests pass.

Live color review: profile, equipment, backpack equipment and materials inspected. No mechanics changed by the palette.
