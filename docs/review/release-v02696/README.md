# v0.26.96 — click-only tutorial

Tutorial battle simulation and battle restart paths are gated until completion/skip. Returning to the battlefield during step 7 does not start asynchronous resource preparation. No battle result advances a lesson; legacy win transition removed. All unfinished guide states restore directly, independent of cleared stages.

Information lessons advance synchronously on primary pointer release, with click fallback and one-event synthetic-click consumption. Info overlay is a real touch surface for mobile Safari. Skip retains its existing control and behavior. Action steps retain target-only validation. Initial currency funds the upgrade without a first-battle reward.

Validation: web and WeChat builds passed; 325 Node tests passed, including pointer-release rendering, click suppression, click fallback, target/skip guards, no battle setup while teaching, and initial upgrade affordability. Automated tests are not iPhone/WeChat-device acceptance.
