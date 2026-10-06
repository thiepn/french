# P37G — Study Session Parity & Qualification

P37G makes the modular vNext runtime behave like a durable study application rather than a collection of isolated routes.

## Stable session semantics ported

The vNext session model now preserves these P35 behaviors:

- weakness-aware smart ordering;
- leech priority;
- overdue priority;
- due/new mixing;
- 3 due : 1 new interleave mode;
- sibling spacing by note family;
- Again requeue approximately seven cards later;
- 14-day resumable active sessions;
- persisted skip state;
- bounded undo history;
- transactional answer persistence.

## Canonical session store

IndexedDB version 5 adds a dedicated `session` object store.

The active session contains:

- queue IDs and seed IDs;
- cursor/current item;
- mode: Today / Review / Learn;
- requeue and mix preferences;
- session statistics;
- last-answer undo entries;
- expiry metadata.

The queue contains IDs only. Vocabulary payloads are never embedded into session state.

## Transactional answer boundary

A session answer writes one transaction across:

- learner;
- SRS;
- activity;
- lightweight meta summary;
- active session.

The corresponding undo token preserves only the state required to reverse that answer:

- prior SRS record;
- review-event ID;
- prior learner profile/study days;
- prior startup summary;
- prior queue/cursor/stats.

Undo then restores/deletes those values in one transaction.

## Session composition

### Review

Due cards are loaded with the `dueAt` index and then ordered by the stable weakness signals:

- overdue age;
- lapses;
- memory difficulty;
- retrievability;
- recent failure rate;
- recent typed-answer issue rate;
- response-time penalty;
- recent Again/Hard outcome.

### Learn

Learn selects genuinely unseen recognition cards from the content search index.

Creating a queued `new` SRS row does not itself mark the word as started. If a session is abandoned or expires before the card is answered, the untouched word remains eligible.

### Today

Today applies migrated:

- daily review limit;
- daily new limit;
- due/new mix preference;
- sibling-spacing preference;
- Again requeue preference.

Already completed work today is subtracted from the configured limits.

## Fresh-user support

A user with no P35 state receives a clean canonical learner row after shell paint or at first interaction.

This initialization is local-only and does not block the first shell.

## Reload and resume

An unfinished session can be reopened for 14 days.

The Review/Study route reads the persisted session first. Reloading the browser therefore resumes the same queue/cursor rather than rebuilding a different session.

## New-card flow

The Learn route can now:

- resume the current session;
- start a new-card-only session;
- start a mixed Today session.

Both navigate into the same Study route and use the same scheduler, grader, persistence and undo boundaries.

## Browser qualification

P37G adds Playwright coverage for:

- Chromium desktop;
- Firefox desktop;
- WebKit desktop;
- Android Chrome emulation;
- iPhone WebKit emulation.

The browser scenarios verify:

1. Home shell does not fetch vocabulary packs or search indexes during first paint.
2. Words searches the full corpus and opens at most the selected result pack.
3. A fresh user can start a new-card session.
4. Again is persisted and requeued.
5. Undo restores the prior SRS/session state.
6. Reload resumes the same active card.
7. A fresh Today session can be composed and persisted.

## Performance boundary

The session engine, queue model, grader, content resolver and search worker remain route-scoped.

P37G does not move the 12,001-word corpus, session history, or review engine into bootstrap.

The existing startup budgets remain authoritative.

## Production boundary

P35 remains the production runtime.

P37G is parallel qualification only. A production cutover still requires the controlled cutover phase after all final qualification gates are green.
