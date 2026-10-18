# P37I-D6-B — Native targeted remediation sessions

**Scope:** stacked draft implementation on D6-A (PR #20). Production remains P35; **NO-GO** for a vNext cutover.

## Native repair workflow

- Progress can start an actual, interruptible repair run for up to three ranked open P26 cases.
- A run schedules all **Scaffold** tasks, then all **Rebuild** tasks, then all **Independent retest** tasks, interleaving different targets inside each stage.
- Scaffold shows the source vocabulary form and English gloss if the note is pinned in the verified index. The guided Rebuild step offers private typed recall with a user-triggered model reveal; responses are **not stored or graded**.
- Where the source note cannot be linked to a verified prompt, the desk explicitly abstains from manufacturing a task and routes the learner to the correct native activity.
- Guided-stage acknowledgement is not a grade. All session tasks carry `practiceOnly: true`.
- Retest must be **armed first** and then observe a later independent native event for the same note and root cause. D6-A diagnosis controls specificity, support/replay/manual exclusion and clean-case resolution; a generic success or manually self-rated oral attempt cannot be credited.
- A later native failure is recorded as an unsuccessful retest; a learner can skip a retest without any passed/retested credit. Duplicate start/step/retention actions are no-ops.

## Storage, privacy and isolation

`CanonicalLearnerStateV1.featureState.v5170Remediation` contains `thiepn-french-p26-run-v1` active tasks, the current cursor, retest arm time, separate case outcomes and at most 30 completed/cancelled receipts. Canonical learner feature state is part of full IndexedDB backup and the exact `_vnext` synchronized snapshot. It does **not** independently re-write the legacy P35 `french-remediation-v1` key.

Only note/cause IDs, stage/route, timestamps, status and small counters are persisted. No typed student answer, expected answer, source reading, recording or transcript is saved in the P26 state.

The runner does not write to `srs`, `activity`, `session`, promotion records or benchmark evidence. Only the actual native study route owns its SRS and practice outcome. A capped 10,000-event diagnostic history prevents starting or verifying a run rather than fabricating a complete evidence window.

## Automated regression qualification

- `scripts/test-vnext-p26-runner.mts`: interleaving, replay suppression, resume/cancel, post-arm independent-only passing, failing attempts, modality mismatch, bounded source and answer-content exclusion.
- P37H Playwright: seed synthetic canonical event as fixture, start/restore the real UI, verify an unearned retest stays pending, inject a later fixture event, confirm history receipt, unchanged SRS count and no retained raw answers.
- P37G five-browser acceptance: keyboard launch, mobile/zoom-safe action layout, reload resume and unchanged SRS/activity counts.
- The dedicated runner unit test is mandatory within `npm run qualify:vnext`.

Synthetic event seeding is a browser *test fixture*, never a claim of live Account, physical-device, spoken fluency or human endorsement.

## Not equivalent to full P35 P26

The new runner has real native tasks and durable metadata, but guided activities remain formative, and the broad P35 full card bank, identical `french-remediation-v1` serialization, original source-linked interleaved task content and real learner effectiveness calibration are not certified. Current SRS/CEFR/benchmark ownership constraints remain unchanged. Production cutover is forbidden until all P37I parity, Account, device, backup and rollback gates are independently satisfied.
