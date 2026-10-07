# P37H — Full Product-Surface Parity & Cutover Readiness

P37H closes the production-surface gaps discovered after P37G qualification.

P37G proved the scalable runtime, migration, content, Study, Words and browser architecture. A cutover audit then found that the qualified vNext build still had placeholder Listen, Speak, Progress and Settings routes and no Read route, while P35 production exposed all five capabilities plus THIEPN Account sync.

P37H therefore blocks production cutover until those surfaces are functional in the modular runtime.

## Primary navigation parity

vNext now exposes nine lazy routes:

- Home
- Learn
- Review / Study
- Read
- Listen
- Speak
- Words
- Progress
- Settings

No route implementation is imported by the initial bootstrap.

## Read

The 25 original P35 graded readings were frozen from the authoritative P35 source into `app/content-source/readings-v550.json`.

The build emits a separately hashed `/content/readings/library.json`, verified by the browser before parsing.

The Read route provides:

- level and text-type filtering;
- personal vocabulary coverage;
- comfortable and intensive modes;
- translation and grammar support in intensive mode;
- mapped word lookup;
- reading completion history;
- passive vocabulary exposure tracking;
- comprehension questions.

Reading exposure and comprehension evidence are explicitly practice-only and do not move SRS due dates.

## Listen

Listen is audio-first and route-scoped.

It provides:

- French device/browser TTS;
- normal and slower playback;
- hidden transcript until reveal/answer;
- meaning discrimination;
- French dictation using the stable P37F grader;
- 30-day listening evidence.

Listening evidence is saved as `practiceOnly: true`.

## Speak

Speak provides:

- pronunciation;
- shadowing;
- meaning → spoken French recall;
- French model and slow-model TTS;
- local microphone recording with MediaRecorder;
- local playback;
- optional browser speech recognition as an intelligibility hint;
- learner self-assessment.

Browser speech recognition is never treated as authoritative grading. Microphone denial does not block spoken self-assessment.

Speaking evidence is practice-only.

## Progress

Progress computes canonical analytics only when opened:

- CEFR promotion record;
- streak and XP;
- due count;
- 7-day and 30-day review evidence;
- 14-day activity;
- corpus and level coverage;
- per-skill progression;
- weakest scheduled skills.

The 12,001-word index is still outside bootstrap.

## Settings and backup

Settings now includes:

- daily new/review limits;
- desired retention;
- session size;
- due/new mixing;
- grading mode;
- typed recognition;
- adaptive Again reinforcement;
- sibling spacing;
- article strictness;
- backup export;
- canonical and legacy-P35 backup restore.

Canonical backups include the preserved P35 migration envelope when available so legacy-only history is not silently discarded during the transition.

## THIEPN Account compatibility

P37H keeps the existing P35 cloud contract:

- same Supabase project;
- same auth storage key;
- same `french_sync_state` table;
- same `connect_thiepn_app` RPC;
- same `sync_thiepn_french_state` RPC;
- revision-safe conflict detection.

Existing P35 cloud snapshots are accepted, preserved exactly, migrated locally, and subsequently eligible for canonical vNext sync.

Account code is loaded after shell hydration. The Supabase library/network is loaded only when an auth/sync marker, OAuth callback, or explicit account action requires it.

Local canonical writes emit a small event boundary that schedules delayed reconciliation without importing account code into Study.

## Cutover boundary

P37H does **not** replace the production root.

P35 remains live and is the rollback reference while P37H is qualified across build budgets and the five browser/device projects.

Production promotion belongs to the next controlled-cutover phase only after P37H is green.
