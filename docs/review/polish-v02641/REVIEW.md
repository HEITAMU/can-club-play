# 0.26.41 — consistent material and commission art
Nine icons, commission header and separate victory/defeat illustrations use the original finished Spark reference. Generated with built-in imagegen, packaged as WebP for runtime. Kept existing reward detail, dismissal and retry behavior. Removed geometric result placeholders. No new explanatory UI text.
Validation: production build passed, 22 existing battle-flow/campaign/integer-UI tests passed. Browser validation pending; local Chromium blocked by socket restrictions.
User explicitly authorized routine publishing for this project.

Clarification: ordinary campaign is strictly linear. Removed chapter/level selection UI; route overview is read-only with exactly one Continue button for the current frontier. Cleared chapters are progress history, never battle entry points. Failed current stage remains retryable. Special modes retain their own entries.
