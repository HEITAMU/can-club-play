# Growth redesign — 0.26.30

- Replaced breakthrough UI with 绝活研习 / 升级技能. Eight active skills have four levels, current/next previews and an expandable level list.
- The existing breakthroughs rank maps directly to active skill rank. Research no longer adds HP/ATK or gates character level caps. Character cap is 160.
- Badge promotion adds 4 percentage points of base HP/ATK per rank, with no character level prerequisite. Retired badge-only skill bonuses were removed; owned ranks and resource balances remain intact.
- Existing character-level passive unlocks (5/40/80) are unchanged. This release trains active skills only.
- Material buttons show names and owned/required counts. Tapping opens an anchored description card; acquisition navigation lives inside the card. Seals identify escort tier 3+.
- Full test suite: 191 passed, zero failures. New tests verify level-one growth, exact/atomic spending, save preservation and all eight active skill effects.
- Live UI: verified material descriptions and routes for escort medals, notes and character-specific tokens. Equal top/bottom panel edges preserved. Contrast follow-up fixes material labels and widens action buttons.
