# Six companion rebuild — v0.21.3

Scope: orange, ink, milk, mint, bolt, star. Pudding is explicitly deferred by the user; its original artwork, skills and progression remain unchanged. Spark retains the approved v0.21.2 idle.

Each new atlas contains eight full-body action drawings and four resting-expression paintings. Normal animation uses idle, three anticipation drawings, release, and three recovery drawings. Independent facial masks preserve the costume and grounded feet during blink/hurt/smile. Slow breathing translates the skull without stretching it; the tail follows with a slight lag. Source figures have connected limbs; no separate arm assembly is used.

86 Node tests pass, including actual rendered bounds, facial pixel isolation, planted feet, action timing and unchanged combat mechanics. Local Chromium launch is blocked by the environment's Unix socket policy; phone viewport verification runs in GitHub Actions. Final CI status must be checked before release.

The video is produced using the actual game renderer, not a mocked animation. Sprite sheets are generated art; intermediate drawings have hand-painted variation and are not skeletal motion capture. No physical-device frame-rate claim is made.
