# Orange articulated motion trial

Independent preview: `orange-puppet.html`. Production battle and saves are unchanged.

The rig uses continuous shoulder/elbow, torso, head, shield, tail and opposing leg transforms. It consumes existing action timing without generating damage events. Drawing uses ten Canvas2D image submissions; no GPU context is required. Head, shield, tail, paws and the vest detail overlay sample the approved original atlas. Hidden torso areas and arm segments use generated patch artwork; these are provisional assets, not an approved replacement character.

Asset source: built-in image generation, transparent disassembly reference `assets/finished/orange-v0213.webp`; packed to `assets/finished/orange-parts-v1.webp` (1024 square). Prompt requested nine separate parts of the top-left idle orange tabby, same hand-painted pencil texture, orange fur, cream muzzle and paws, teal vest with brass toggles, brown belt and shorts, bronze paw shield, same three-quarter view; no redesign, labels, grid lines or background. Exact original regions are preferred over generated replacements in the renderer.

Validation: sampled normal/skill joint bounds at 240 Hz, balanced canvas state, ten draw submissions, original seven combat timing checks. Contact-sheet rendering used @napi-rs/canvas. Browser review covered idle and impact frames and UI controls. This is not a WeChat device benchmark. No full-roster or production rollout is implied by this trial.
