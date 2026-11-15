# v0.27.6 — centered unlock conditions

Locked commission entries now show their actual unlock conditions before opening a detail page. The same text feedback serves difficulty, departure, weekly challenge and arena buttons. Completed recruitment stages still allow opening their details and selecting later stages.

The user's final direction is a stationary message in the screen center: large cream text with brown outline/shadow, no panel or input capture, fading out after 2.3 seconds. Every tap replaces the message and restarts its display time; rapid clicks cannot stack unreadable text or let an older timer clear the new message.

Existing art, balance and unlock thresholds are retained. Release numbers skip the reverted v0.27.5 to avoid reusing that cache version.

Validation: 342 existing Node tests passed; H5 and native WeChat builds passed. Removed the obsolete above-button position assertion with the retired positioning function. The local browser check could not start because Chromium's singleton socket was denied; the cloud browser could not access the local preview port. No physical iPhone/WeChat visual acceptance is claimed.
