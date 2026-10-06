# P37C — Canonical Learner Engine Foundation

P37C replaces the stable application's giant serialized state object with explicit vNext domain records.

This phase starts with schema and migration parity. Scheduler behavior is migrated only after its inputs and outputs have stable canonical types.

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

P37C does not yet alter scheduler mathematics.

## Activity parity

The canonical review-event model preserves:

- timestamp and card/note/skill identity;
- rating, response time and correctness;
- typed-answer quality and practice mode;
- level/POS/theme context;
- practice-only flag;
- the memory-state evidence persisted by the later stable Study Engine.

## Migration semantics

The P37B preservation envelope is converted once per source fingerprint.

The conversion transaction writes learner, SRS, activity and user-content stores together. Only after that transaction succeeds is the canonical migration marker committed.

The preserved P35 envelope remains in the separate `migration` store.

## Next P37C work

The next step is to move the authoritative FSRS-compatible scheduling functions into a standalone pure module and qualify them against stable fixtures for Again/Hard/Good/Easy, first learning, review, lapse, relearning and answer-quality penalties.

Only then should Review begin using the canonical SRS store.
