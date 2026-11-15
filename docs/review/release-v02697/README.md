# v0.26.97 — support tutorial, seconds cooldown, encounter stories

Added three click-driven lessons: support explanation, target-only actual use, cooldown explanation. Completed legacy saves remain completed (step 9); legacy wait step 10 retains migration; new lessons use 11–13 and display 9–11 of 11. During practice only support animation/healing/damage and its countdown run; actor turns and lesson progression remain frozen until input. No reward or mainline progress is granted by the demo.

Support cooldown changed from 3 rounds to 8 battle seconds (paused with simulation; battle speed applies), shown as rounded-up seconds with progress. Its healing, damage and interrupt behavior is unchanged. More frequent support allows the formerly failing level-130 fully equipped campaign test party to win. No enemy buffs added. Automatic combat frame-rate test is now independent of frame-boundary manual support inputs; dedicated support timing tests cover 30 and 60 Hz.

Commission detail replaces mechanical rule prose with a single encounter story. Rotating hunt hints follow the current theme. Internal rules and enemy mechanics remain unchanged.

Validation: web/WeChat builds passed; 329 automated tests passed. Additional rendered-HTML checks cover all 6 hard encounters and the 9 rotating hunt combinations. No new iPhone/WeChat device validation claimed.
