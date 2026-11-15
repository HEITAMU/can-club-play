# v0.26.84

First-load: per-scene street images (first scene 47,810 bytes vs 364,748-byte sheet); intro reuses it and defers animation atlases until combat. Small initial portraits and script preload; service worker install delayed until after initial page load.

Audio: original 16-bar synthesized acoustic-style waltz, bass/accompaniment and battle rhythm; separated music/effects toggles, gesture unlock, hidden-page suspension, bounded lookahead and effect throttling. No audio downloads. Runway generation was unavailable; no generated music asset is used.

Linear tutorial: first mainline victory -> actual companion tab -> one real affordable level purchase -> equipment tab -> equipped claw detail -> close detail -> return to battle -> second victory -> free play. Off-target clicks are blocked; skip is always available. Lesson progress persists; old onboarded saves skip it. Batch upgrade returns to ten after the lesson. No tutorial currency grants or stat cheats.

Mainline stage label displays chapter and stage number; commission difficulty stays distinct. 100 seed simulations of first two mainline stages passed without can activation; reported first-stage difficulty not reproduced, no global difficulty reduction applied.

270 existing tests and 12 focused loading/onboarding tests passed before release. QA first-visit page uses memory-only storage and never reads or writes player saves. Native WeChat device performance not measured.
