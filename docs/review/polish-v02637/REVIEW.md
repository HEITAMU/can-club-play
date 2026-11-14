# Materials, commission board and battle power — 0.26.37

Removed the lower battle practice button and its update/click handlers. The lower strip now displays team power with a warm badge and large gold value; speed remains at the right. Previously cleared stages remain accessible through the stage map.

Replaced the simple SVG material paths with a nine-cell transparent painted atlas. Fish coins, provisions, escort medal, notebook, wax-sealed certificate, polishing sand, repair parts, equipment satchel and fish charm are shared across rewards, inventory and material explanation cards. Companion-specific charms retain a small portrait owner badge. Assets use compressed WebP and CSS atlas coordinates.

Commission hub and mission selection now use a generated indoor noticeboard banner, paper mission cards, clearer category/selection states, visible rules, reward tray and primary departure action. All text remains actual system-font text.

Validation: build passed; 19 focused activity/inventory tests passed; all four commission categories render without undefined/NaN text. Live 0.26.37 verified: battle strip shows gold team-power value with no practice button; all six inventory material images display; commission hub and material category render correctly; accepting the first material commission opens the named battle, and the stage button returns to its details. Screenshots saved as commission-hub.jpg and commission-detail.jpg.

Art: built-in image generation. Prompt direction: refined 2D inked gouache cat-harbor RPG, worn crafted materials, slate blue/terracotta/sage/brass/cream, no text. Material atlas is exactly 3x3 independent items on transparent alpha; board is an indoor wood/cork/blank-paper/warm-lantern banner with quiet title space. Final art: assets/materials/harbor-materials-v02637.webp and assets/ui/commission-board-v02637.webp.
