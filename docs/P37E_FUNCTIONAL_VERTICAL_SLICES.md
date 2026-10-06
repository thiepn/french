# P37E — Functional Content Access & Review Vertical Slices

P37E turns the vNext architecture into working learner flows while keeping all heavy code route-scoped.

## Words

The build now emits a compact full-corpus vocabulary search index alongside the 250-record content packs.

The Words route:

- starts a dedicated Web Worker only when Words opens;
- verifies the search-index SHA-256 before using it;
- performs accent-insensitive French and English search off the main thread;
- ranks exact, prefix, substring and meaning matches;
- returns only compact search rows;
- loads the selected word's full content pack only when the learner opens a result.

The search fallback can run on the main thread if Worker construction fails, but it still stays outside application bootstrap.

## Content integrity

Browser content loading now verifies manifest-provided SHA-256 values before parsing a vocabulary pack or search index.

The pinned upstream Git blob remains the build-time source-integrity boundary; per-file SHA-256 protects the deployed derived artifacts.

## Review

IndexedDB version 4 adds:

- `srs.dueAt` index for bounded due-review reads;
- `srs.noteId` index for future note-family work;
- `activity.t` and `activity.id` indexes.

The Review route requests only a bounded due batch from the canonical SRS store.

For each current item it resolves content from:

1. migrated user-created cards;
2. the current corpus;
3. migrated card edits layered over corpus content.

Only the current item's full vocabulary pack is loaded.

## Skill-aware prompts

The first vNext review loop maps saved directional skill state into prompts:

- recognition: French → meaning;
- production: meaning → French;
- spelling: meaning → exact French;
- article: meaning → article + noun when preserved article metadata exists;
- listening: speech synthesis → French.

Again, Hard, Good and Easy use the pure P37C scheduler.

## Atomic answer commit

One review answer transaction writes:

- the updated SRS record;
- the immutable review event;
- learner activity/study-day state;
- the lightweight startup summary.

A failed transaction leaves the previous persisted SRS record intact.

## Remaining parity work

P37E intentionally does not claim full P35 Review parity yet. Remaining migration includes:

- typed-answer diagnosis and article/accent grading;
- undo;
- active-session resume;
- exact P35 queue priority/weakness behavior;
- practice-only modes and requeue behavior;
- richer audio/media handling;
- new-card Learn flow;
- detailed progress views.

Those belong to the next functional parity work, not to bootstrap.

## Production boundary

P35 remains production. P37E is still a parallel vNext implementation and does not alter the live route or release metadata.
