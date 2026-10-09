# P37I — Full P35 parity and safe release gate

**Status: NO-GO for replacing P35 production.** This is an acceptance gate, not authorization to deploy. It must not be marked complete based solely on passing CI or on the Account OAuth client existing.

## Locked baseline and candidate

- Stable production: French P35 `5.24.0`, root origin `https://french.thiepn.dev/`.
- Main baseline inspected on 2026-10-08: `022a815df744e740ad187554b800daffaec21701`. Recheck the current production marker and branch head immediately before cutover.
- Candidate: PR #19, `p37h-production-parity`; all candidate builds are isolated `dist-vnext` artifacts.
- Candidate manifest must remain `productionCutover: false`, `fullP35FeatureParity: false` until evidence supports a deliberate release decision.
- Account: production public OAuth client `bf2e7fca-98dd-4833-9fee-306ecd6fc7d7`, exact callback `https://french.thiepn.dev/`.

For the audited P35→vNext contract-by-contract gap list, see [P37I parity inventory](./P37I_PARITY_INVENTORY.md). This first tranche deliberately retains the production no-go state.

The P37I-B1/B2 native conversation and missions comprise 15 newly authored three-turn scenes and five three-task chains, not a source-identical import of P35 P17/P18. They preserve evidence metadata only and deliberately do not award P20 function mastery or CEFR promotion. Mission independence passes are evidence of the practised deterministic scenarios, not general fluency. See the [parity inventory](./P37I_PARITY_INVENTORY.md).

P37I-B3 now records 23 native observable communicative functions and chooses three distinct tasks from weakness-weighted recommendations. These are explicitly **not** a claim of source-identical 25-function P20 parity, CEFR promotion or general language proficiency. Adaptive function evidence contains no raw learner transcript. Its incomplete sets remain inside the same conversation backup and sync safety gate.

P37I-B4 hardens the native 23-function evidence model. Imported records are accepted only when their scenario ID, turn index, function ID, scenario level, support/retry counters, matcher slots and evidence credit agree with the authored deterministic turn. The native Progress workspace now displays function-level evidence, but this is **formative practice**, not validated proficiency or full original P19/P20 parity. B4 regression tests exercise the real response → durable evidence → Progress → resume route.

P37I-C1 adds an offline written-practice workspace using the verified P12 36-exercise corpus, with distinct phrase, sentence and situational-transfer tracks. Deterministic feedback explicitly abstains on open alternatives and user self-assessment never awards scheduled SRS mastery. This is **partial P11/P12 parity**, not a claim that the original P10/P11 practice banks have been fully ported.


P37I-C2 preserves the **67 exact P10 source frames** and P35 provenance metadata in an integrity-checked lazy pack. Four new native writing tracks cover verified-frame gap completion, full-frame production, structural-cue phrase transfer, and error repair. Typed prose is never stored; practice outcomes are metadata-only and cannot reschedule vocabulary SRS. Local-only usage attempts or hints block silent first-cloud adoption. Source links carry the original P35 attribution, **not a claim of independently rechecking those sources**. This remains **partial P10/P11 parity** because P35's source-dependent study prerequisites, phrase-secure thresholds, contextual variation and adaptive task/repair prioritization have not yet been reproduced or signed off.


### P37I-C3 — Adaptive usage mastery (still NO-GO)

The native C3 ledger extends C2 without changing production: P35-derived thresholds are **three usage attempts, 80% accuracy, latest independent success and a 60-day freshness limit**; transfer uses **two attempts, 80% accuracy and latest independent success**, with an additional vNext safeguard requiring success on two structural-cue variants. Assisted exact matches and manual self-assessment are formative, not secure credit. Unfinished and error-prone constructions get higher priority; a recent answer is spaced against another available frame. Errors are prioritized using the recent 120-day window.

C3 maintains compact per-record cumulative counts and variant coverage even when the detailed 300-entry history is truncated. Atomic IndexedDB transactions commit C3 progress with practice evidence; failures cannot commit one without the other. Only source IDs, outcome codes, support, variant IDs, tallies and timestamps are stored: **no typed answers**, SRS rescheduling, new backend authority or CEFR promotion.

**Unclosed parity gaps:** P35 permits phrase-transfer entry from verified production SRS for a linked vocabulary note; C3 does not assume a free-text P10 anchor identifies a unique canonical note. C3's three cues are a structured recall variation, **not open-ended semantic usage or validated real-world transfer**. The original P35 task-eligibility, cross-skill ranking and assessment model still need a source-accurate comparison and physical user testing. No release flags were changed.

## P37I-C4 — Original P10 to P12 source-linked sentence transfer

The optional **Connected** writing track joins all 36 original P12 exercises to their exact P10 source-frame strings (after apostrophe/whitespace normalization), not a generated semantic or model guess. It unlocks only after two unassisted exact P10 recalls on the construction. C4 then prioritizes unpractised P12 contexts and recently unsuccessful sentence models without removing the existing three P12 entry modes. Each linked sentence displays its P10 source record, and independent exact/explicitly accepted P12 model matches are tracked separately from the structural P11 and authored C5 contextual scores.

Writing evidence is a bounded history plus compact durable per-P12 cumulative aggregates so a 300-event cap cannot erase attempts. It stores only IDs, counts, timestamps, outcome codes and support, **never learner answer text**. Activity and writing metadata commit in one transaction. A ledger-only local device blocks silent unrelated cloud adoption.

**Parity remains partial.** Matching a preserved sentence does not demonstrate broad situational fluency or CEFR mastery, and source-preserved P12 scenes have only limited two-context pairs. The P35 assessment and canonical note/sense-ID prerequisites still require signed comparison. All production release flags remain false.

## P37I-C5 expansion — Authored contextual sentence verification

The vNext contextual track now contains **72 complete French sentence situations across 36 P10 constructions** (two distinct prompts per construction). These are newly authored examples, *not* the original P35 contextual exercise bank or a validated language-evaluation model. The remaining **31 P10 constructions** do not have two-situation C5 coverage. Explicit source IDs keep the inherited P35 reference labels separate from the new authored teaching content.

Context admission requires **two independently exact P10 source-frame recalls**. A construction earns formative contextual security only with at least two attempts, at least 80% independently exact responses, both situations currently correct without hints, and no last-success older than 30 days; a later failure or assisted submission in either situation revokes current proof. The task picker retries a deficient situation instead of repeatedly awarding another already-correct situation. Passing an authored model sentence never certifies open-ended semantic ability or CEFR level; acceptable unrecognized French alternatives require self-judgment.

The contextual state remains metadata-only and distinct from structural transfer, P12 sentence writing, and scheduled FSRS. This extension **does not approve production cutover**.

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
