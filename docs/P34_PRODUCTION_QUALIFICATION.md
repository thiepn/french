# P34 — Production Qualification & Full Regression

P34 freezes the French application at the exact P33 candidate and turns the accumulated phase-specific checks into one release gate.

**Candidate under qualification**

- app version: `5.24.0`
- offline shell: `french-shell-v48`
- production domain: `french.thiepn.dev`
- product scope: P1–P33, including the B2 P31 → P32 → P33 → P28 qualification chain

P34 intentionally adds no learner-facing feature and does not change the app version. Moving the candidate while qualifying it would weaken the evidence.

## 1. Fail-closed regression gate

`scripts/verify-production-p34.mjs` discovers and executes every repository verifier other than itself.

The following verifiers are mandatory:

1. `verify-language-platform-p7.mjs`
2. `verify-language-read-model-p8.mjs`
3. `verify-functional-benchmark-p28.mjs`
4. `verify-fluency-maintenance-p29.mjs`
5. `verify-b2-corpus-p30.mjs`
6. `verify-open-production-p31.mjs`
7. `verify-integrated-capstone-p32.mjs`
8. `verify-spontaneous-oral-p33.mjs`

A missing required verifier is a qualification failure. Any non-zero child verifier is a qualification failure. There is no compensatory scoring.

## 2. Release-shell checks

The P34 gate also verifies:

- the exact P33 app version and release marker;
- the exact P33 offline-cache generation;
- service-worker install / activate / fetch lifecycle;
- valid PWA manifest JSON;
- `/` id, start URL and scope;
- standalone display mode;
- required install and maskable icons;
- the production CNAME;
- all required application-shell assets;
- every service-worker app-shell path resolves to a repository file;
- workflow inventory remains present;
- known fail-open workflow patterns are absent.

This catches release failures that a curriculum-specific verifier would not catch.

## 3. CI evidence

`.github/workflows/p34-production-qualification.yml` runs on every pull request and every push to `main`.

The workflow:

1. checks out the exact candidate;
2. uses Node 24;
3. runs the P34 qualification with Bash `pipefail`;
4. writes the same JSON result to the job log and `p34-qualification.json`;
5. preserves the report as a 30-day workflow artifact even when qualification fails.

Using `pipefail` is required: the `tee` command that saves evidence must never mask a failed Node process.

## 4. What automated P34 evidence proves

A green P34 run proves that, for the exact checked-out commit:

- every repository-level regression verifier passed together;
- P7/P8 shared-language contracts still hold;
- P28–P33 progression and B2 qualification invariants still hold;
- the PWA manifest and offline application shell are structurally deployable;
- required production assets are present;
- the configured production domain is still `french.thiepn.dev`;
- no checked workflow uses the known fail-open bypass patterns covered by the gate.

It does **not** turn heuristic language assessment into an accredited CEFR certification.

## 5. Real-browser release matrix

Repository CI cannot truthfully prove all browser/device behavior. The final release acceptance must therefore execute this matrix against the deployed candidate rather than pretending a source scan is equivalent to device testing.

| Surface | Required checks |
| --- | --- |
| Chromium desktop | cold load, navigation, study flow, reading/listening, P31/P32/P33 dialogs, export/import, account status, offline reload |
| Firefox desktop | cold load, navigation, persistence, reading/listening, graceful handling of unsupported/limited speech APIs |
| Android Chrome | installability, touch layout, keyboard/input behavior, audio, speech-recognition path where available, offline reload |
| iOS Safari / installed PWA | layout, persistence, audio, install/open behavior, graceful P33 abstention when required speech APIs are unavailable |
| Narrow viewport | no clipped controls, dialogs remain usable, primary actions reachable without horizontal scrolling |
| Offline | previously cached shell starts, local study state remains usable, reconnect does not discard local evidence |
| Existing local data | upgrade from pre-P33 local state without destructive reset |
| Corrupt/partial state | app fails safely or normalizes data; no silent qualification or fabricated proficiency evidence |
| Account sync enabled | reconciliation completes before shared progress publication; local learner authority is not silently replaced |

These checks are acceptance evidence, not implementation scope. Any failure becomes a defect; P34 must not grow a new learning mode to work around it.

## 6. Release rule

P34 is qualified only when the automated gate is green on the candidate commit.

The cross-browser/device matrix is then the first acceptance step of P35 before a stable release is declared. A failed item blocks release and is repaired as a defect against the same product architecture.

## 7. Scope boundary

P34 explicitly rejects:

- new vocabulary or grammar systems;
- another B2 assessment mode;
- C1 expansion;
- new AI scoring claims;
- new proficiency authorities;
- broad architectural rewrites;
- governance/audit machinery unrelated to learner value.

The product is feature-complete enough for this release line. The correct next action is to prove it works as one coherent application.
