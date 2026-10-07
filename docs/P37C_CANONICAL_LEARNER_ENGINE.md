# P37C — Canonical Learner Engine Foundation

P37C replaces the stable application's giant serialized state object with explicit vNext domain records and moves the stable scheduler into a pure, independently qualified module.

## Storage layout

vNext IndexedDB `thiepn-french-vnext` version 3 contains:

- `meta` — tiny startup summaries and migration markers;
- `migration` — immutable preserved P35 import envelopes;
- `learner` — settings, profile, study plan, promotions, and feature-state metadata;
- `srs` — one record per independently scheduled skill card;
- `activity` — one record per review/activity event;
- `user-content` — user cards, edits, smart decks, and custom decks.

The important scale property is that **100,000 SRS records are not rewritten as one JSON object whenever one card changes.**

## Stable progress parity

The canonical SRS record explicitly preserves the final P35 progress fields:

- status, seen, streak, interval, due and last-reviewed timestamps;
- ease, lapses, successes and rating counters;
- starred/suspended/buried/manual-known/note metadata;
- stability, difficulty and relearning state;
- FSRS version/state, scheduled/elapsed days and retrievability;
- directional skill identity encoded by the stable `::d31:` ID convention.

## Pure scheduler

`app/src/core/learner/scheduler.ts` is a UI-free port of the authoritative v3.6.9 Depth Core scheduler that remains active in P35.

These FSRS-compatible scheduling functions preserve the stable behavior exactly.

It preserves:

- the 19 stable FSRS-compatible weights;
- the same difficulty mean-reversion function;
- the same retrievability curve;
- the same recall/forget stability formulas;
- the same desired-retention interval conversion;
- learning and relearning steps;
- Again/Hard/Good/Easy semantics;
- answer-quality penalties for close/missing-article/review judgments;
- leech auto-suspension thresholds.

The scheduler accepts one canonical SRS record plus explicit settings and returns a new record. It has no DOM, storage, global state, account, content, or UI dependency.

## Deterministic parity fixtures

The CI scheduler suite checks stable numeric outcomes for:

- new + Again;
- new + Good;
- new + Easy graduation;
- mature review + Good;
- mature review + Again/relearning;
- typed close-answer stability penalty;
- automatic leech suspension.

These fixtures pin due timestamps, intervals, difficulty, stability and retrievability values from the stable scheduler.

## Activity parity

The canonical review-event model preserves timestamp/card/note/skill identity, rating, response time, correctness, typed-answer quality, practice mode, context, practice-only status, and memory-state evidence.

## Migration semantics

The P37B preservation envelope is converted once per source fingerprint. The conversion transaction writes learner, SRS, activity and user-content stores together. The preserved P35 envelope remains in the separate `migration` store.

## Remaining P37C work

Review still does not use the canonical engine in production. The next work is repository commands for atomic answer recording/undo/session state and then queue construction against the canonical SRS store.

Only after those pass parity tests should the vNext Review route become functional.
