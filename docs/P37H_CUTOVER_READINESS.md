# P37H — Controlled Cutover Readiness

P37H does not replace P35 until every production surface has a functional vNext owner.

## Gate discovered after P37G

P37G qualified the scalable study engine, but the cutover audit found placeholder routes for Listen, Speak, Progress and Settings, plus no vNext ownership of THIEPN Account or the production PWA/offline shell.

Therefore production promotion is blocked until parity closure completes.

## Slice H1 — Progress, Settings & Account

### Progress

Progress now queries canonical stores only when opened:

- learner/profile and CEFR promotion state;
- SRS totals, due count, state breakdown and skill counts;
- 30-day activity, correctness and XP;
- study streak and current earned CEFR level.

No longitudinal scan runs during bootstrap.

### Settings

Settings now persists the canonical configuration used by Today, Learn and Review:

- daily new limit;
- daily review limit;
- desired retention;
- leech threshold and auto-suspend;
- strict / learning / lenient typed grading;
- due/new mixing;
- typed recognition preference;
- strict articles;
- sibling spacing;
- delayed failed-answer practice.

A complete JSON backup can be exported on demand.

### THIEPN Account

The vNext account module keeps the stable guest-first contract and is lazy-loaded.

It preserves:

- Google OAuth through the same Supabase project;
- `connect_thiepn_app` registration;
- `sync_thiepn_french_state` revision-safe writes;
- pause and local sign-out without deleting local data;
- explicit local-vs-cloud conflict choice;
- no automatic overwrite when both sides changed;
- the stable French sync metadata/device/auth storage keys.

Canonical cloud state uses `thiepn-french-vnext-backup-v1` and includes the active study session.

Existing P35 cloud snapshots are accepted through the P37 legacy-to-canonical converter. P35 local storage remains untouched.

Account initialization is not part of first paint. It starts after learner hydration only when an existing auth/sync signal or OAuth callback exists. Opening Settings explicitly loads it.

## Slice H2 — Listen & Speak

Listen and Speak are now functional route-scoped practice surfaces.

Both select at most one small vocabulary pack for the daily practice set. They do not load the full vocabulary search index.

Listen provides:

- French device TTS;
- typed audio recall;
- the stable French-aware grader;
- reveal/replay/next controls;
- practice-only activity evidence that never moves SRS scheduling.

Speak provides:

- meaning → spoken French recall;
- model French TTS;
- microphone speech recognition only after an explicit button press;
- transcript grading with the stable French-aware grader;
- a self-rating fallback when speech recognition is unavailable;
- practice-only speaking evidence that never changes scheduled SRS state.

Five-engine browser acceptance verifies bounded content loading and confirms microphone recognition does not initialize before learner action.

## Still blocking cutover

P37H remains incomplete until:

- vNext owns service worker / offline shell / manifest behavior;
- live account sync is qualified;
- final production artifact promotion and rollback path are qualified.

P35 remains the production root until these gates pass.
