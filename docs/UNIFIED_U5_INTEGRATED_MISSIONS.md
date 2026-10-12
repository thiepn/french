# THIEPN French U5 — Integrated Original Practice Missions & Adaptive Review

## Parent and release boundary

New source-only stacked draft from U4 PR #28 exact head `b88528b164930e88c8312542c109edc657b9f507`; inherited U3 #27, U2 #26, U1 #25, P37I-B7 #23. U4 P35 run `38305913924` independently qualified static and all five local browsers; live-production was skipped. U5 does not alter main, prior draft branches, production P35 rollback, native FSRS, CEFR, Account, SRS, existing native session history, consent or credentials.

## Features actually implemented

- Four connected original missions, **16 active steps** sourced only from the independent U2/U3 authored French lesson corpus. Each mission belongs to one existing guided journey and includes: contextual **reading** with a short independently authored French passage and meaning check; **oral rehearsal** with a three-point self-review checklist and opt-in source line (no microphone, recording, transcript or automatic speaking score); open-response **writing** with task criteria and the existing U4 bounded local heuristic review (no model, paid service or automatic grammar certification); and **transfer** with an authored cloze or expression and targeted answer checking.
- Original miss-feedback uses the existing U4 `analyzeAttempt`; optional source hints are available, and correct answers recorded after hints remain assisted claims. A per-mission adaptive planner checks each step's **latest** status and prioritizes `needs-review`, then `assisted-claim`, then unattempted steps; self-reported completion never certifies mastery. Contextual source-lesson action sends the student directly back to the existing Course lesson for remediation. All four missions have explicit source references and original-owned revision IDs.
- Journey selection drives mission selection within the existing U4 journey panel. Mission history and status remain in page memory while moving among lessons and journeys. ArrowLeft/ArrowRight and Home/End move between mission steps with explicit focus recovery after rerender; responsive buttons and native labels support mobile and keyboard users.
- A **separate mission handoff** uses explicit JSON download and selected-file reimport. It contains only non-authoritative `{sequence, missionId, stepId, rating}` records with an original-source revision and an FNV-1a content-drift fingerprint (never a trust signature). No free-written sentences, audio, transcripts, learner identifiers or canonical mastery are exported. Input is capped at 32 KiB and 96 records, with exact keys, contiguous sequence, known source-owned step IDs, known statuses and matching revision/fingerprint. Any invalid entry atomically blocks restoration and keeps prior temporary mission state unchanged. User-editable reports remain self-reported and untrusted after replay.
- U4's original exercise checkpoint and native progress remain independent. Mission reports cannot import into Account, any official Review/Today/Progress screen or external app and do not affect FSRS, CEFR or SRS.

## Qualification and sources

`scripts/test-vnext-u5.mts` validates original source custody, four missions and all 16 step modes, lesson/journey references, prior U4 contracts, advisory ordering, self-report outcomes, fingerprint, round-trip JSON and malformed/reordered/forged/stale/oversized atomic denial. Included in `qualify:vnext`, alongside inherited U0–U4 checks, typecheck, production build and startup budget.

Added two real P37G browser acceptance cases across its existing Chromium/Firefox/WebKit/Android/iOS matrix: multi-mode mission navigation with targeted hints, manual speaking rubric, writing review and focus; plus explicit download, import, atomic rejection, state separation across journeys. Existing P37H and P35 inherited release checks are maintained unchanged.

Rights-restricted Le Carnet Français PDF/HTML prose and French 2.2 German textbook glosses remain metadata-only. P35 human visual, native device, license, deployed-origin migrations, consent and production cutover approvals remain NOT TESTED / NO-GO.

## Proposed U6

Expand **original** mission authoring with varied difficulty and evidence-aware review timing for independent versus assisted claims; improve cross-journey task discovery, editor-level access to original grammar, bounded multi-session optional local handoff and keyboard re-entry. Any real Account or learner progress bridge requires separate owner approval, custody review and source licensing qualification.
