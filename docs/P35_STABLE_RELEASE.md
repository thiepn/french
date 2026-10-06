# P35 — Stable Release, Live Browser/Device Acceptance & Defect-Only Hardening

P35 converts the feature-complete P33/P34 French candidate into a stable release line.

The rule is strict: **prove the existing product works coherently and repair only defects that block that proof.** P35 does not add curriculum, vocabulary, a new learning mode, a new assessment authority, C1 scope, or a new account model.

## Release baseline

- application version: `5.24.0`
- learner/proficiency logic: frozen from P33
- aggregate repository qualification: P34
- production origin: `https://french.thiepn.dev`
- release channel: `stable`
- machine-readable marker: `release.json`
- shared-language integrations: existing P7/P8 plus the independently merged P9 dashboard transport

## Defects found and hardened

### 1. Stale product identity

The initial HTML and several historical normalizers still described French as a vocabulary-flashcard app and exposed an obsolete version badge.

P35 aligns the static and runtime identity with the actual product:

- title: **French — Adaptive language learning**
- subtitle: **Adaptive French · vocabulary, grammar, listening, speaking & transfer**
- app version: `5.24.0`
- product scope: `adaptive-language-learning`
- release dataset: `p35-stable-release`
- release channel: `stable`

Manifest and HTML metadata now describe the full learning product.

### 2. Unbounded cross-browser recovery

A later IndexedDB recovery path could wait on the daily snapshot cursor without the startup deadline used by the primary state/cache reads.

Firefox/WebKit could therefore remain on **Opening French** even though the embedded starter catalog was usable.

P35 bounds the complete public state/cache recovery path. A stalled recovery mirror is treated as degraded storage and French continues through the existing local fallback.

### 3. Account connectivity blocking startup

THIEPN Account remains guest-first. Its external client/auth work is optional to local study and no longer blocks the usable study surface.

The stable release identity is asserted synchronously before optional account connectivity begins.

### 4. Historical aggregate QA repeated during startup

Historical phase wrappers resolve `v5100RunQa()` to the newest aggregate audit. During one modern startup, that caused the full diagnostic chain to be recomputed repeatedly.

P35 records startup QA as deferred and exposes the explicit full diagnostic through `FrenchP35ReleaseQa()`. P34/P35 CI remains the release authority.

The deferred QA sentinel now carries the same device shape expected by the Settings QA panel, preventing the observed `reading 'width'` runtime exception.

### 5. Pre-await presentation work blocking the browser

The single-file app accumulated many phase-specific `EnsureStyles` and assessment-dialog constructors before the first storage await. On slower engines this could hold `DOMContentLoaded` for tens of seconds.

P35 now:

1. yields one event-loop turn before entering the historical init chain on first boot;
2. defers noncritical phase CSS/dialog construction until after `DOMContentLoaded`;
3. drains that presentation queue incrementally instead of executing the entire accumulated layer in one blocking task;
4. still executes an initializer immediately if a later user action needs it before the deferred queue reaches it.

This changes presentation scheduling only. Learning state, evidence, scheduling, progression, and assessment rules remain unchanged.

### 6. Mobile bottom-navigation hit testing

Android emulation exposed a real case where long Words content could intercept pointer events over the fixed bottom navigation.

P35 gives the bottom navigation an explicit fixed stacking contract, keeps its buttons pointer-active, and reserves bottom content space. Navigation is still tested with normal pointer clicks.

### 7. Acceptance-harness drift

The browser suite had inherited assumptions from older UI versions. P35 now tests current public contracts:

- accessible **Primary navigation** rather than historical nav structure;
- **Search vocabulary** and current Progress headings rather than removed IDs;
- backup controls in **Settings → Data**;
- the current first-run onboarding;
- static deployment metadata through the HTTP request context rather than redundant full app boots.

The onboarding helper invokes the already-visible Save & start button through its normal DOM click because WebKit can continuously classify the animated dialog as actionability-unstable. Core navigation remains exercised through real pointer clicks.

### 8. Offline acceptance semantics

An installed service worker is not enough. The Chromium offline test requires an active **controlling** service worker before disconnecting, then performs a real offline reload.

The P9 dashboard asset is part of the current main-branch offline shell and remains included when P35 is merged.

## Automated acceptance matrix

P35 uses pinned Playwright `1.63.0`.

| Project | Required acceptance |
| --- | --- |
| Chromium desktop | stable boot, navigation, no horizontal overflow, guest account surface, backup/import recovery, corrupt-settings recovery, offline controlled reload |
| Firefox desktop | stable boot, navigation, runtime-error-free core flow |
| WebKit desktop | stable boot, navigation, runtime-error-free core flow |
| Android Chrome emulation | narrow/touch layout, bottom-nav pointer behavior, core navigation |
| iPhone WebKit emulation | narrow WebKit layout, onboarding, core navigation |

Static manifest/release/shell metadata is engine-independent and is checked once.

## Live-production gate

After merge to `main`, P35 waits until `french.thiepn.dev` exposes the P35 marker. Only then does it run the production browser matrix against the real origin.

A stable release requires all of the following:

1. inherited repository workflows green;
2. P34 full qualification green;
3. P35 static verifier green;
4. P35 local five-profile browser acceptance green;
5. GitHub Pages deployment of the intended P35 candidate;
6. P35 live production browser acceptance green.

No later pass compensates for an earlier failure.

## Physical-device boundary

Playwright Android/iPhone profiles are browser/device emulation, not physical-device evidence.

P35 therefore does **not** claim physical Android/iPhone qualification. A later hardware spot check can add confidence for installed-PWA chrome, microphone permissions, OS speech services, and device-specific keyboard behavior.

## Defect-only scope

Allowed P35 changes are limited to demonstrated release problems such as:

- startup blocking or browser incompatibility;
- broken/unreachable controls;
- mobile overlap or hit-testing defects;
- unhandled runtime errors;
- offline-shell failures;
- backup/recovery defects;
- stale/misleading release identity;
- deployment mismatch;
- accessibility regressions;
- account behavior violating the existing guest-first contract.

Feature work belongs after stable release.

## Next phase

After the local and live P35 gates are green:

**P36 — Post-Release Observation, Real-Use Defect Intake & Maintenance Baseline**

P36 should observe real study usage, capture genuine defects and friction, and establish a low-noise maintenance baseline without reopening the architecture or curriculum without evidence.
