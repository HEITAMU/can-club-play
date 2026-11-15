# v0.27.4

Character switching: immediately request and show the existing full-body portrait through a native image element instead of an observer-only background. Draw the new crew screen immediately. Remove stale ready state on new/lost/unready drawing surfaces; retain the portrait when drawing fails. All eight characters now participate in stale visibility, resize and context-loss recovery tests. Star atlas and portrait verified present on live host. Existing character artwork/proportions unchanged.

Web/native builds and full 342-test suite passed, plus added direct-fallback regression passed. Cloud browser became unresponsive during final reload, so this fix has not been visually verified on the user's WeChat device.
