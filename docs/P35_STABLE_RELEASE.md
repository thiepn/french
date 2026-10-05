# P35 — Stable Release, Live Browser/Device Acceptance & Defect-Only Hardening

P35 converts the feature-complete P33/P34 French candidate into a stable release line.

The phase is intentionally narrow:

> prove the existing product works coherently across supported browser engines, responsive/mobile profiles, offline reload, local recovery, backup flows, and the live production origin; repair only defects that block that proof.

## Release baseline

- application version: `5.24.0`
- learner logic: frozen from P33
- aggregate qualification: P34
- release channel: `stable`
- production origin: `https://french.thiepn.dev`
- P35 release marker: `release.json`

P35 does not add vocabulary, grammar content, a new assessment, a new progression authority, C1 content, or a new account model.

## Defect found during acceptance preparation

The application had accumulated newer internal/product phases while its first-paint and canonical surface identity still described the product as a vocabulary-flashcard app.

Before JavaScript normalization, the shell still exposed:

- a `v4.1.4` badge;
- the subtitle “Focused French vocabulary and spaced repetition”;
- the title “French — Vocabulary flashcards”;
- vocabulary-only metadata.

Later normalization corrected the badge but continued to reset the title and subtitle to vocabulary-only wording.

P35 fixes that mismatch without altering learning behavior.

The stable surface is now:

- badge: `v5.24.0`
- title: **French — Adaptive language learning**
- subtitle: **Adaptive French · vocabulary, grammar, listening, speaking & transfer**
- product scope: `adaptive-language-learning`
- release dataset: `p35-stable-release`
- release channel: `stable`

The manifest and HTML description now represent the full product rather than only its original flashcard layer.

## Defects found by the first browser run

The first P35 browser matrix did its job and exposed two additional release issues.

### Cross-browser startup recovery

The earlier startup-reliability layer correctly bounded the primary IndexedDB reads, but a later recovery path could call the daily snapshot cursor without the same deadline.

On Firefox and WebKit, an empty or delayed recovery cursor could therefore leave a cold start on **Opening French** indefinitely even though the embedded starter catalog was available.

P35 now bounds the recovery-only snapshot lookup with the same local startup deadline. If that mirror does not respond, French marks storage as degraded and continues with its normal local fallback instead of blocking startup.

This is a product defect fix, not a test relaxation.

### Acceptance harness drift

The first P35 tests also assumed historical DOM details that are no longer part of the canonical interface:

- runtime presence of `.version-badge`, although the current UI intentionally removes the visible badge after hydration;
- the pre-v3.8 navigation structure;
- no first-run setup dialog.

The acceptance suite now tests the current public contract instead:

- stable release datasets and metadata;
- current accessible **Primary navigation** buttons;
- the static pre-hydration `v5.24.0` release identity;
- first-run setup completion through the real onboarding controls.

Changing stale selectors is test maintenance. It does not change learner behavior or reduce the release criteria.

### Release identity is independent of account connectivity

The P35 stable-channel marker is now asserted synchronously before the asynchronous account initialization chain. Optional account CDN/auth latency therefore cannot delay or suppress the app's release identity.

This does not bypass startup acceptance: the browser suite still waits for the core study surface to leave its loading state before declaring a successful boot.

### Acceptance now follows the current public UI

A second diagnostic run showed that several remaining failures were obsolete test assumptions rather than product failures:

- Firefox had fully rendered the application while `waitForFunction` remained pending, so readiness now uses visible DOM/locator assertions rather than animation-frame polling.
- Words is verified through the accessible **Search vocabulary** searchbox rather than the removed `#browse-search` control.
- Progress is verified through its current intelligence heading rather than legacy backup controls.
- Backup export/import is exercised in **Settings → Data**, where those controls now live.
- First-run onboarding saves the already-selected defaults directly instead of pressing a shortcut that intentionally rerenders the dialog during the automation click sequence.

These changes preserve the same acceptance intent while targeting the product that is actually shipped.

The P35 workflow also cancels superseded runs for the same branch/ref so obsolete browser matrices do not consume runner capacity after a defect-only patch.

## Automated acceptance matrix

P35 uses Playwright 1.63.0 and runs five local profiles:

| Project | Purpose |
| --- | --- |
| Chromium desktop | primary desktop behavior, PWA/offline qualification, backup/recovery flows |
| Firefox desktop | independent desktop engine compatibility |
| WebKit desktop | Safari-family engine compatibility |
| Android Chrome emulation | narrow touch/mobile layout and navigation |
| iPhone WebKit emulation | iOS-sized WebKit layout and navigation |

The suite verifies:

1. stable boot and P35 release identity;
2. no unhandled page errors during the tested flows;
3. usable core navigation;
4. no document/body horizontal overflow at the tested viewport;
5. guest-first account surface renders;
6. install manifest and release marker are fetchable and correct;
7. service worker reaches an active state;
8. a controlled offline reload succeeds after first online boot;
9. progress export produces a JSON backup;
10. malformed backup import fails explicitly rather than corrupting state;
11. malformed settings storage does not prevent startup;
12. startup remains usable when browser speech recognition is unavailable.

## Live-production gate

On every push to `main`, P35 waits for GitHub Pages to expose the P35 marker at `french.thiepn.dev`.

Only after that marker is visible does it run the acceptance suite against the real production origin in:

- Chromium desktop;
- Firefox desktop;
- WebKit desktop.

This avoids the common false-positive where CI tests the repository while the production site is still serving an older deployment.

## Qualification hierarchy

A stable release requires all of the following:

1. P34 full repository qualification succeeds;
2. P35 static release verification succeeds;
3. P35 local five-profile browser matrix succeeds;
4. GitHub Pages exposes the P35 candidate;
5. P35 live three-engine production matrix succeeds.

No later check can compensate for an earlier failed check.

## Physical-device boundary

P35 does **not** claim that Playwright device emulation is a physical Android phone or physical iPhone.

Automated P35 evidence covers:

- real Chromium, Firefox and WebKit engines on the CI runner;
- mobile viewport/device emulation for Android Chrome and iPhone WebKit profiles;
- the actual production origin.

A future physical-device spot check may add hardware-specific confidence for microphone permissions, mobile browser chrome, installed-PWA behavior, and OS-specific speech services. Lack of that hardware evidence does not get silently relabeled as a successful physical-device test.

## Defect-only rule

After P35 begins, changes are accepted only when they repair a demonstrated release problem such as:

- startup failure;
- broken navigation;
- clipped/unreachable controls;
- data-loss or restore failure;
- offline-shell regression;
- browser-engine incompatibility;
- deployment mismatch;
- misleading/stale release identity;
- accessibility regression;
- account/sync behavior violating its existing guest-first contract.

Feature requests belong to a later product phase.

## Stable release artifact

`release.json` is the machine-readable production marker:

- app: French
- app version: 5.24.0
- phase: P35
- channel: stable
- learner logic: frozen from P33
- qualification: P34 + P35 browser acceptance

It exists so production CI can verify that it is testing the intended release rather than an older GitHub Pages deployment.

## Next phase

After P35 is green, the next useful phase is not another feature sprint.

**P36 — Post-Release Observation, Real-Use Defect Intake & Maintenance Baseline**

P36 should observe real study usage, capture genuine defects and friction, and establish a low-noise maintenance baseline without reopening the architecture or curriculum unless evidence justifies it.
