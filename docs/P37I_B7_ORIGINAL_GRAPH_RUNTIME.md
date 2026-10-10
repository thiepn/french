# P37I-B7 — Original P17 graph runtime and P20 observation bridge

**Production unchanged.** This is a separate stacked draft after qualified B6 PR #22 head `6926a8a61d54a96eabb946fd5ec2d3e036ab9b24`. P35 remains stable; **cutover NO-GO**.

## Verified original-source intake

Read preserved P35 `main` at `022a815df744e740ad187554b800daffaec21701`. `app/src/core/conversation/p35-graphs.ts` contains the verbatim **19 graph definitions** from the final preserved `index.html` `V580_SCENARIOS` source: exact original partner text, alternate phrasing, node IDs, `v580Rule` need groups, minimum-word constraints, `skipIfSlot`/alternate edges, examples, repair hints, required goals and B2 additions. The originally named rule constructor is a local pure data factory; no legacy app script or global is evaluated.

Original `V590_MISSIONS` five A1–B1 3-task chains and original `V5110_FUNCTION_META` P20 25-function subset remain pinned in `source-parity.ts`. Six later B2 functions are preserved as source references without promotion. The old native 23-function map remains unchanged and **does not inherit** original P20 mastery.

## Native source graph player

The Conversation page now presents an independent **Original P35 dialogue graphs** launcher with ceiling A1/A2/B1, five original linked missions, and all 19 source scenarios (the five B2 additions are read-only pending separate B2 qualification). Unlike the original vNext three-turn examples, this mode follows **actual P35 source node transitions** and can skip redundant nodes when a learner already supplied the required slot in the same turn. It exposes original partner wording and a variant rotation across replayed runs.

Users can submit typed French, request clarification, display original hints/examples, continue manually without evidence, pause/home, resume, cancel and see bounded metadata-only results. A source graph may also report a missing objective; merely arriving at its terminal node is not sufficient for credit for a requirement not actually observed. The app never promises free-form French semantic understanding.

A manual continuation is not assessed. An exact source rule match issues **conservative practice-only metadata** for an original P20 function only if its ID exists in the pinned original subset; no open-ended similarity score or unproven semantic inference is considered a verified match. Repairs are separately observed at zero credit, increase support, and cannot count as independently matched turns. Original B2-only function IDs abstain rather than being silently mapped.

## Recovery, privacy and isolation

The local `meta` key `p35-source-graph-v1` is covered by existing vNext IndexedDB backup and offline recovery; metadata contains only pinned scenario/node IDs, original variant index, recognized canonical slot IDs, goal IDs, run counters, support, repair flags and compact function evidence. The active session and task-chain stage survive reload; no raw learner answer, partner transcript, audio, speech-recognition output or free-form source text is stored in this feature state.

Native B3 conversation, adaptive sets and missions cannot be started over an active B7 original-source session. B7 source sessions are not started over active native sessions. No `srs`, `activity`, benchmark result or CEFR decision records are written by this mode, and no legacy P35 production localStorage key is modified.

The source graph is genuine, **but grading is not certified P35-equivalent**: original runtime similarity fallback, open-rule plausibility, device-dependent ASR confidence and nuanced independence calibration are conservatively withheld until independently validated. P19 original mission's complete independence threshold is not awarded by B7 as a proficiency label. Neither synthetic browser fixtures nor source data constitute physical human/device approval.

## Tests

- Mandatory `scripts/test-vnext-b7-source-graph.mts`: original 19 graph and 25 P20 IDs, all original edges, actual slot skip, variant rotation, source no-match abstention, repairs, model assistance, tampered-import denial, original mission pause/recovery, zero answer retention, B2 and level restrictions.
- P37H synthetic real-DOM browser: original café graph skips size, IndexedDB resume, original source hint/repair evidence, no SRS/activity mutation and zero raw response retention.
- P37G five-profile browser: original mission keyboard launch, pause/home/reload recovery, accessibility status and mobile overflow.
- `npm run qualify:vnext` includes all prior P37H/P37G and original B7 tests without changing screenshot goldens.

## Release and remaining deficits

**NO-GO** until human-approved P35 source-scoring parity against independent production fixtures, P20 longitudinal confidence calibration, full supported B2 graph accessibility and source-content rights, real Account two-device conflict QA, physical installed PWA microphone/TalkBack/VoiceOver testing, migration privacy acceptance and independently reviewed rollback. No merge, deploy, live data import, release flag change or user certificate issuance.

**Proposed B8:** source graph parity differential harness against isolated P35 reference and human acceptance review, fixing only demonstrably divergent rule/credit outcomes and preserving default-denied release gates.
