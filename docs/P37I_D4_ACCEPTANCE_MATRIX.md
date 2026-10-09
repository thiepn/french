# P37I-D4 — Exact-head qualification and release acceptance matrix

**Decision: NO-GO.** This is a record of required evidence, not permission to release.
Branch: `p37h-production-parity`; PR [#19](https://github.com/thiepn/french/pull/19).
Production remains P35 `5.24.0` at `https://french.thiepn.dev/`.
Main baseline verified in the D4 audit: `022a815df744e740ad187554b800daffaec21701`.
The branch was 254 commits ahead, zero behind, before D4 changes. Recheck all SHAs at release time.

## Confirmed CI failure and repair

The exact D3 commit `d628d0ec9412f2a9e460b4d0b299aafbc167f64b`
failed **three** GitHub workflows:
- [P37H parity #37937258507](https://github.com/thiepn/french/actions/runs/37937258507): qualification failed, browser phase skipped.
- [P37G browser #37937258715](https://github.com/thiepn/french/actions/runs/37937258715): build failed, browser phase skipped.
- [P37 runtime #37937258496](https://github.com/thiepn/french/actions/runs/37937258496): qualification failed.

All three job logs identified the same native Node module-resolution failure:
`ERR_MODULE_NOT_FOUND` for `app/src/core/usage/mastery` imported from
`app/src/core/learner/evidence-calibration.ts`. Vite bundling accepted an
extensionless import, but the native Node 24 `.mts` qualification did not.
D4 updated the runtime imports to `.ts` and added a parity-verifier assertion
so recurrence blocks qualification. This fix **requires exact-head CI evidence**;
the D3 failed runs do not become green retroactively.

## Release-gate evidence ledger

| Gate | Minimum acceptable evidence | D4 status |
| --- | --- | --- |
| Node 24 typechecking and deterministic tests | Clean `typecheck:vnext`, all `test:vnext:*`, explicit runtime imports, full `qualify:vnext` on a single commit | **Needs exact-head passing CI** after D4 repair |
| P37H desktop and Android browser | Actual Chromium desktop and Android-emulation P37H jobs pass on artifact from that same qualified SHA; review screenshots/traces for failures | **Not qualified**: D3 browser jobs skipped after build failure |
| P37G and P37 runtime | Green current-head P37G and runtime-rebuild checks, no bypass/skip reinterpreted as success | **Needs exact-head passing CI** |
| P35 production preservation | `main` retains P35 stable app, candidate built only to `dist-vnext`, no merge/cutover, manifest `productionCutover:false`, `fullP35FeatureParity:false` | **Static protection present**; production smoke/check required at release |
| P1–P16 language and SRS parity | Verify full vocabulary IDs/senses, typed grading, review intervals, undo/resume, source-reading/listening/speaking, backup and recovery on real anonymized P35 data | **Open**: native fundamentals do not demonstrate all P35 behavior |
| P17–P20 conversation and missions | Compare original P35 scenes, alternate prompts, all 25 function definitions, scoring, recordings and adaptive states against new 15 scenes, 5 missions, 23 functions | **Open / partial**: native examples are not source-identical |
| P21–P27 advanced progression | Restore open-world input, mixed-session coach, historical P24 contract, validated P25 seven-gate promotions and P27 curriculum audit | **Open**: D1–D3 diagnostics cannot certify CEFR promotion |
| P28–P33 B2 and oral evaluation | Functional benchmark, decay/maintenance, B2 authored corpus and open-production runner, integrated capstone, independently calibrated spontaneous oral assessment | **Open**: several native flows missing |
| Migration and rollback | Representative P35 backup and custom data -> candidate -> offline edits -> cloud snapshot -> full restore -> P35-readable rollback fields, with before/after integrity reports | **Human acceptance not run**; automated fixtures alone are insufficient |
| Live THIEPN Account | Real authorized user signs in, SSO resumes, explicit “Sync this device” consent, device conflicts, offline/reconnect, revision/review safety, two-device cloud state | **Human acceptance not run**; production-origin CI routes mock OAuth and API responses |
| Physical Android | Installed PWA, offline cold-start/update, recording permission, microphone, speech service/ASR availability, keyboard, focus, touch and long-study recovery | **Not run**: emulation is not physical-device acceptance |
| Physical desktop | Chrome/Firefox/Edge keyboard, 200% zoom, storage/quota, offline, mic and multi-tab resume with real account | **Not run** |
| Production deployment and rollback rehearsal | Pin exact active P35 deployed commit, archive built asset SHA256, rehearse revert and backup restore, update P35-only Pages marker in a separate approved cutover PR | **Not run; explicitly prohibited during D4** |

## D3/D4 longitudinal integrity

- The two 45-day windows only compare the same target (note+skill, P12 ID,
  usage mode and record, or function); three independently graded events
  across two days are needed **in each** window.
- Distinguish a genuine first-listen miss from a slow/repeated/supported
  attempt; never convert spoken self-assessment or ASR hypotheses into
  verified pronunciation.
- Imported `eventId` duplicates must not increase either the graded
  numerator/denominator or the count of repair touches.
- If the 10,000-event read may truncate the 90-day history, report
  `insufficient` and abstain from trend and post-repair attribution.
- A repair followed by improved results is temporal association, never
  causal efficacy, automatic SRS review, or level-promotion authority.
- Regression requirements: both independent engine fixtures and a browser
  seed/read-after-reload check for improving, declining, persistent-risk
  targets; no SRS mutation and no user transcript persistence.

## Human-only acceptance record template

For each outstanding gate, record:

```text
Gate:
Reviewer and date:
Exact Git commit / build artifact SHA256:
Real device / OS / browser / network state:
Source P35 backup identifier (no private learner content):
Signed-in test account (anonymized, no secrets):
Steps and expected result:
Observed result and screenshot/trace reference:
Before/after data counts, local hash and cloud revision:
PASS / FAIL / NOT RUN:
Blocker, owner and follow-up:
```

Human-only tests must be recorded as **NOT RUN** unless actually performed.
Do not mark `fullP35FeatureParity` or `productionCutover` true, merge PR
#19, change Pages routing, or deploy this candidate on the strength of
CI-emulated tests. The next phase must close concrete functional parity
gaps before a separately approved rollback-tested cutover.
