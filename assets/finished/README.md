# Spark / 火花 — finished reference artwork

Only Spark is replaced by this revision. The accepted visual reference is `source/spark-reference.jpeg`, supplied by the user. The body proportions, costume, calico markings and illustrated texture follow that reference.

Built-in image generation produced the complete key poses, in-between poses and facial expressions in `source/`. Each pose has one connected full body, exactly two arms, with the anatomical right hand holding the top of one lantern loop and the left hand empty. The other seven characters retain their original rendering.

`python scripts/pack-finished-spark.py` packs these source drawings into the runtime atlas. Manual head bounds normalize head width; the feet anchor the poses to a common ground. Facial overlays only affect the interior of the face. Idle motion warps a continuous full-body surface with feet pinned; it does not independently reattach arms or heads.

`node scripts/review-finished-spark.mjs` renders the exact game path and fallback portrait. `spark.html` uses that same runtime. Automated structural checks are not a substitute for the visual hand/prop and in-game reviews.
