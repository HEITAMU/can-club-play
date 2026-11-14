# v0.26.19 — continuous patrol, formation courtyard, shared inventory grid

## Behavior
- Returning onboarded players enter active patrol immediately. Tabs and ordinary modals do not gate simulation. Patrol victory advances after 2.2 seconds; defeat retries after 2.6 seconds. One-off activities and arena fights return to ordinary patrol after settlement. At the campaign cap, patrol revisits the last cleared stage.
- Pause/start control removed. Boss HP is a bottom-of-arena progress bar. The large action banner is replaced with a small painted supply tin; its existing healing/interrupt mechanics remain. A matching tin is used in navigation, partner modes, bag wallet, and courtyard scenery.
- Formation uses five independent persistent slots. Vacant slots are not compressed. A generous nearest-slot drop target covers the courtyard; downward drags enter the bench. One deployed companion is required. Bench and keyboard/tap selection support the same actions.
- Drag ghost contains only the painted character, with copied canvas dimensions and no idle redraw. Source character is dimmed while dragging. Locked companions are omitted.
- Equipment right panel reads “背包”, lists all filtered unequipped items, and scrolls inside its fixed-height area. Pagination is removed from both equipment lists. Main bag and equipment use one cell width token. Portrait tiles follow the equipment/profile content; there is no fixed bottom portrait bar.

## Verification
- 188 automated tests passed, including new sparse-slot save roundtrip, formation movement, removal, recruitment into a vacancy, finger drop zones, owned-only formation, and complete scrollable item lists.
- Desktop browser at 390×844 and 320×700: actual pointer drag moved 橘座 from front slot 1 to rear slot 3; a subsequent downward drag removed it, leaving 阿墨 in its original slot.
- 35 unequipped items: right drawer scrollHeight 1154, clientHeight 193; a wheel scroll reached scrollTop 961. Main bag and right drawer cells both measured 59.21875 CSS pixels at 390 px viewport.
- Continuous simulation in UI: bag remained open while stage advanced 6→7; gear card remained open while stage advanced 7→8; street view remained open while stage advanced 2→3. These are browser QA fixtures, not the user's save.
- Boss HUD and compact supply can inspected at both viewport widths. Combat floor coordinates reserve the lower HUD region while keeping upper rear fighters on the scene floor.
- Browser background/OS suspension is not offline combat: normal existing idle-income accrual continues to handle time away from the game.

## Art
Built-in image generation used for `assets/scenes/formation-courtyard-v02619.webp` (640×800, 70,088 bytes). Original generated PNG retained separately; WebP is the runtime asset. No character artwork replaced.

Prompt: A finished portrait 4:5, 2D hand-painted gathering courtyard for a cute cat adventure. Broad unobstructed warm ochre packed-earth floor, low irregular honey-brown brick garden wall at the top, olive foliage and daisies at the edges. Small battered red fish-food cans and a rolled canvas travel bag in the upper left, wooden crate and a can at the upper right. Colored-pencil contours and watercolor/gouache shading on warm paper, traditional storybook style. Flat oblique view, caramel/chestnut/ochre/cream palette, natural warm light. No characters, UI, text, grids, slot frames, geometric partitions, rings or platforms; no 3D, teal, purple or gray cast. The central floor stays clear for five separately rendered character sprites.
