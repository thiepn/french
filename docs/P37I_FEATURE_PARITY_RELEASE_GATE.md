# P37I — Full P35 parity and safe release gate

**Status: NO-GO for replacing P35 production.** This is an acceptance gate, not authorization to deploy. It must not be marked complete based solely on passing CI or on the Account OAuth client existing.

## Locked baseline and candidate

- Stable production: French P35 `5.24.0`, root origin `https://french.thiepn.dev/`.
- Main baseline inspected on 2026-10-08: `022a815df744e740ad187554b800daffaec21701`. Recheck the current production marker and branch head immediately before cutover.
- Candidate: PR #19, `p37h-production-parity`; all candidate builds are isolated `dist-vnext` artifacts.
- Candidate manifest must remain `productionCutover: false`, `fullP35FeatureParity: false` until evidence supports a deliberate release decision.
- Account: production public OAuth client `bf2e7fca-98dd-4833-9fee-306ecd6fc7d7`, exact callback `https://french.thiepn.dev/`.

For the audited P35→vNext contract-by-contract gap list, see [P37I parity inventory](./P37I_PARITY_INVENTORY.md). This first tranche deliberately retains the production no-go state.

## Required evidence before a cutover PR

| Gate | Evidence needed | Current state |
| --- | --- | --- |
| P35 feature inventory | Trace every accessible stable P35 learning and administrative flow; classify native vNext parity, intentional retirement or gap. Do not infer parity from route names. | **Open** |
| Vocabulary and SRS | Compare the complete preserved vocabulary content; new, due, production/recognition, typed grading, FSRS metadata, custom/user content and undo/resume across real sessions. | Partial fixtures passed; end-to-end equivalence not signed off |
| Integrated learning | Verify P35 Reading/Listening/Speaking flows and their review consequences; compare the advanced progression, missions, orchestration, conversation/transfer, benchmark and capstone experiences without silently dropping them. | Native foundations present; full equivalence not signed off |
| Device data | P35 backup → native migration → local editing → cloud snapshot → full restore; verify both P35-readable rollback fields and lossless `_vnext` data, including interruptions. | Automated fixture and transactional backup tests passed; real user-data walkthrough open |
| THIEPN Account | Real sign-in, signed-in Account SSO reuse, app connection and disconnect/reconnect, no upload before explicit `Sync this device`, offline/reconnect, two devices and conflict choices. | Mocked production-origin browser acceptance passed; **live** acceptance open |
| Hardware/UX | Physical Android and desktop: installed/offline PWA, microphone permission and recording, OS speech availability, keyboard and touch focus, reading and long-session navigation. | Emulated browser matrices passed; physical checks open |
| Deployment safety | Pin verified P35 rollback commit and exported backups, archive qualified vNext build and checksums, audit `main` Pages routing, change P35-only live marker assertion when intentionally switching root, verify rollback rehearsal. | Open |

## Hard rules

1. **Never** call CI-emulated OAuth or mock-cloud tests live Account acceptance. No synthetic user identity or revision is evidence of production OAuth grant success.
2. Never merge vNext into the production-serving root or replace the GitHub Pages source merely to run live OAuth tests. Prepare a separate deliberate cutover PR and a rollback-tested switch after the other gates.
3. Silent Account sign-in may attach identity, but must not enable cloud synchronization or mutate learning history without an explicit user decision.
4. A conflict decision must use the cloud revision and local hash that were reviewed. A newer revision, changed local snapshot or lost connection requires reviewing again, not overwriting.
5. Preserve the original P35 app and cloud-compatible top-level snapshot. The `_vnext` payload is necessary for exact new-format restore; P35 cannot be assumed to understand new-only study sessions.
6. Do not assert `fullP35FeatureParity: true` until each stable flow has evidence or an explicit, user-approved retirement decision. Replacing missing features with explanatory placeholder screens is not parity.
7. At the moment of cutover, review `.github/workflows/p35-stable-release.yml`: its production check explicitly waits for a P35 HTML marker and would fail on an intentional vNext root. Update release-channel checks in the cutover PR, not prematurely on this branch.
8. The `main` SHA above is a historical baseline, not a promise that it will remain the deployed rollback target. Verify and preserve the exact active build before any release action.

## Manual acceptance record format

For each gate, record: **pass/fail/not run**, precise build SHA, browser/device, test user (do not store credentials), input state, actual result, before/after revision, backup location, date, and reviewer. Mask any personal content. A defect requires a repro and a regression test before closing.

## Exit criteria

Only mark the candidate deployable when all gate rows are signed off, all current CI runs are green against the *same* immutable head SHA, P35 rollback is rehearsed with explicit recovery, and the planned production deployment is reversible. Until then, P35 stays live and PR #19 stays separate from production.
