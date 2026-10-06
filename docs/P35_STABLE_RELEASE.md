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

The stable release identity is asserted synchronously before optional account connectivity begins. Normal guest startup defers the external account client/auth path to browser idle time; fully offline startup does not attempt that network path at all and schedules it for the next `online` event.

### 4. Historical aggregate QA repeated during startup

Historical phase wrappers resolve `v5100RunQa()` to the newest aggregate audit. During one modern startup, that caused the full diagnostic chain to be recomputed repeatedly.

P35 records startup QA as deferred and exposes the explicit full diagnostic through `FrenchP35ReleaseQa()`. P34/P35 CI remains the release authority.

The deferred QA sentinel now carries the same device shape expected by the Settings QA panel, preventing the observed `reading 'width'` runtime exception.

### 5. Pre-await presentation work blocking the browser

The single-file app accumulated many phase-specific `EnsureStyles` and assessment-dialog constructors before the first storage await. On slower engines this could hold `DOMContentLoaded` for tens of seconds.

P35 now:

1. explicitly waits for `DOMContentLoaded` before entering the historical init chain when the parser is still active;
2. uses a later event-loop turn when startup is invoked after the document is already interactive;
3. defers noncritical phase CSS/dialog construction until after `DOMContentLoaded`;
4. drains that presentation queue incrementally instead of executing the entire accumulated layer in one blocking task;
5. still executes an initializer immediately if a later user action needs it before the deferred queue reaches it.

This changes presentation scheduling only. Learning state, evidence, scheduling, progression, and assessment rules remain unchanged.

### 6. Legacy release diagnostics blocking first render

The accumulated release line also ran older lexical QA, high-frequency audit, context-health, and release-candidate regression reports while the starter/catalog state was being applied. These reports are useful diagnostics, but they are not required to make Home usable and they repeatedly traverse already-enriched catalog state.

During cold start P35 now supplies shape-compatible **pending** diagnostic reports to those historical wrappers. Once the core init chain completes, the pending values are discarded. The original diagnostic functions remain authoritative and compute normally when their existing Settings/diagnostic surfaces request them.

Vocabulary enrichment, persisted learner state, SRS scheduling, import migration, communicative evidence, and CEFR-aligned progression logic are not skipped.

### 7. Mobile bottom-navigation hit testing

Android emulation exposed a real case where long Words content could intercept pointer events over the fixed bottom navigation.

P35 gives the bottom navigation an explicit fixed stacking contract, keeps its buttons pointer-active, and reserves bottom content space. On narrow screens the canonical mobile navigation is promoted to a direct `body` child so historical content stacking contexts cannot cover it. Active/`aria-current` state is reasserted after navigation DOM rebuilds. Navigation is still tested with normal pointer clicks.

### 8. Acceptance-harness drift

The browser suite had inherited assumptions from older UI versions. P35 now tests current public contracts:

- accessible **Primary navigation** rather than historical nav structure;
- **Search vocabulary** and current Progress headings rather than removed IDs;
- backup controls in **Settings → Data**;
- the current first-run onboarding;
- static deployment metadata through the HTTP request context rather than redundant full app boots.

The onboarding helper invokes the already-visible Save & start button through its normal DOM click because WebKit can continuously classify the animated dialog as actionability-unstable. Core navigation remains exercised through real pointer clicks.

### 9. Offline acceptance semantics

An installed service worker is not enough. The Chromium offline test requires an active **controlling** service worker before disconnecting, then performs a real offline reload.

P35 advances the stable application shell to `french-shell-v49`. It precaches both `release.json` and the P9 dashboard dependency `vendor/thiepn-languages-dashboard.js` in addition to the existing P7/P8 assets. This closes the discovered case where a service-worker-controlled offline reload could still request a production dependency that had never been cached.

### 10. Legacy mobile-navigation class leakage

The current mobile shell is the eight-item `v580-eight` navigation. The browser matrix exposed that a historical `v382-four` class could survive later navigation rebuilds. Because the old four-column rule is `!important`, eight current controls were laid out as two rows and Words content could intercept taps on the upper row.

P35 now removes mutually exclusive historical layout classes whenever the current navigation is rebuilt and asserts the eight-column horizontal layout in the final release-hardening CSS. The test continues to use real pointer clicks; no forced-click workaround is accepted.

### 11. Acceptance instrumentation must not become the bottleneck

Failure traces showed that recording every DOM/resource snapshot for the roughly 2.8 MB single-file application materially extended first navigation on the hosted runner and consumed nearly the whole per-test budget.

The primary P35 run therefore executes without tracing. A single retry captures a trace only after an initial failure. This preserves diagnostic evidence while keeping the first acceptance pass representative of normal browser execution.

Navigation assertions also reacquire the active control after each route change because the compatibility stack intentionally rebuilds the navigation DOM.

### 12. Hosted-runner startup budget is explicit

The five-engine acceptance matrix runs on shared GitHub-hosted VMs, where parsing/evaluating the large single-file compatibility stack is substantially slower than normal interactive hardware.

P35 therefore uses an explicit **120 second cold-start CI budget**. A browser that cannot reach the stable P35 shell inside that bound still fails release acceptance.

This is a CI acceptance ceiling, not a claim that a real user should tolerate a two-minute startup. Startup performance remains observable work for post-release maintenance.

The offline qualification now performs one controlled offline reload after the service worker has demonstrably claimed the page. A second online reload was removed because it added no service-worker coverage and merely duplicated the expensive cold-start path inside the same test.

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
