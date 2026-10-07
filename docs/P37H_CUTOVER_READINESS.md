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

## Slice H3 — PWA & Offline Ownership

vNext now owns its installable artifact:

- its own production manifest;
- its own root service worker;
- existing 192 px, 512 px and maskable production icons copied into the build artifact;
- service-worker registration after hydration/idle rather than before first paint.

The service worker precaches only:

- the root shell;
- the PWA manifest;
- the vNext release marker.

It does **not** precache the vocabulary corpus, search index, route chunks or content packs.

Hashed route/runtime chunks, search data and vocabulary packs are cached only after the learner actually requests them. Previously used content therefore remains available offline without making a fresh install download the full corpus.

Browser acceptance now takes a used Listen route fully offline, reloads the page and requires the shell plus previously fetched pack to remain usable.

Activation removes stale P35/vNext French shell caches only after the vNext worker installs successfully. A repository rollback can reinstall the P35 worker and shell.

## Slice H4 — Account Contract Qualification

Account reconciliation is now a pure deterministic policy with fixtures covering:

- first upload when no cloud state exists;
- first-device conflict when both local and cloud contain meaningful state;
- safe cloud adoption for an empty local profile;
- already-synced baseline;
- local-only change with expected-revision upload;
- cloud-only change with safe remote adoption;
- true divergence conflict;
- legacy/untrusted baseline conflict safety.

A non-destructive live CI probe checks the production Supabase project for:

- Google OAuth enabled;
- `french_sync_state`;
- `connect_thiepn_app`;
- `sync_thiepn_french_state`.

The live probe never authenticates as a user and never writes data.

A final authenticated Google sign-in + cloud round-trip remains a human qualification gate because CI has no user session.

## Slice H5 — Controlled Deployment & Rollback

Production deployment is now represented by a manual-only GitHub Actions workflow.

The workflow accepts exactly two targets:

- `vnext` with confirmation `CUTOVER VNEXT`;
- `p35-rollback` with confirmation `ROLLBACK P35`.

For vNext it re-runs the complete vNext qualification, builds a fresh `dist-vnext`, packages only that artifact, and deploys it to GitHub Pages.

For rollback it re-runs the P34/P35 production qualification and packages the untouched stable P35 root, release marker, service worker, manifest, icons and vendor runtime.

Both artifacts are independently constructed and verified in `qualify:vnext`, including deployment markers and release identity.

The workflow does not run automatically on a merge or push. Cutover remains an explicit production action.

GitHub Pages currently uses the legacy branch-based source. Before the new deployment workflow can own production, the repository Pages source must be changed once to **GitHub Actions** in repository settings.

## Remaining human gates

Automated cutover readiness is otherwise complete. Two explicit human gates remain:

1. sign in with Google in vNext and perform one real cloud sync/restore round-trip;
2. change GitHub Pages → Build and deployment → Source to **GitHub Actions**.

P35 remains the production root until both gates are completed and the guarded `vnext` deployment is explicitly run.

P35 remains the production root until these gates pass.
