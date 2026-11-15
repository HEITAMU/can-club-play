# v0.27.1 — locked commission feedback
Locked H5 commission fight and tier controls retain their gray/aria-disabled state but accept a click to display actual requirements. Stage and prior-difficulty requirements derive from activityInfo; insufficient recruit shards have a matching local hint. Input guards prevent entering a locked battle or selecting a locked tier. Completed recruitment controls remain disabled.

A gold outlined text hint rises above the tapped button and fades after 1.5 seconds; it is clamped inside the viewport, pointer-transparent, accessible as a status, and replaces the previous hint on repeated taps. Reduced motion uses fade only.

Web and WeChat builds passed. Dedicated tests cover real thresholds, combined prerequisites, accessible click targets, blocked navigation/start, and screen bounds.
