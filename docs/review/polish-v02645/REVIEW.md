# 0.26.45

- Remove equipment container width from the animation sizing path. All full-body previews now use the battle unit and immutable companion multiplier; size containment prevents child canvas dimensions affecting layout.
- Render equipment and tactic tokens through visible-alpha SVG viewports, centre slot contents with grid alignment, and preserve each icon's aspect ratio. Original raster art is unchanged.
- Replace the room scene with a ground-only hand-drawn slate texture. Fit the five formation positions into a 280–300px board; empty slots no longer overlap or extend below the board.
- Update commission choices in place, preserving the modal scroll offset and focus with preventScroll. Replace generic tier arrows with paper cards showing current, cleared and locked tiers. Long pursuit routes use a bounded five-tier window.

Validation: 207 existing tests passed after adjusting drag coordinates to the new formation positions. Two new tier-state/paging tests passed. Dedicated layout fixture supports sustained Shidun preview and all six tactic tokens. Live browser verification follows publication. Physical iOS device validation is not available in this environment.
