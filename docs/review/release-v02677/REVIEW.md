# v0.26.77

- Cat tags use five minor steps per major material tier. Existing major tiers are preserved; five steps together cost the same and grant the same 4% health/attack as the previous major upgrade. Maximum remains 20%. Five toe marks and per-material glow colors communicate progress; clicking opens current/next comparison and upgrade controls.
- Upgrade button price moved to its own line, shared exact fish-coin wallet added. Zero-count inventory materials hidden; all-set selector removed.
- Hand-painted journal/challenge entry atlas added; matching interior banners and paper UI. Original character assets and animation workflow preserved.
- Bottom navigation now fills four contiguous equal-width columns with fine separators and 15px bold labels.

## Validation
285 Node tests passed (web/shared/native). Web and WeChat build passed. Browser review at 320px and 390px: contiguous navigation, profile coin balance and separated cost; five tag upgrades and tier transition; zero-material filtering; inventory without set selector; journal/challenge entry and interior art. Browser review is not a WeChat device test.

## Art source
Generated atlas: journal desk with open notebook/map, oil lamp and bookmark; moonlit wooden street sparring platform with paw sandbag, pennants and canned-fish trophy. Matched existing commissions-v02646.webp hand-painted warm brown ink, gouache/watercolor, muted teal and amber. No baked text. Compressed to 1152x768 WebP (219876 bytes); text and interactions remain runtime UI.
