# P15 — Listening in Context, Connected Speech & Real-World Aural Vocabulary Transfer

French v5.6.0

## Purpose

P15 adds a first-class contextual listening layer to the P1–P14 vocabulary system. Its central rule is the same evidence discipline introduced by P13 and P14:

**hearing audio is exposure; successfully retrieving meaning or form from audio is evidence.**

Listening assistance remains useful, but replay, slower speed, transcript, and translation are recorded as support so assisted success cannot masquerade as independent first-listen mastery.

## First-class Listen surface

Desktop navigation now exposes:

- Today
- Study
- Read
- Listen
- Words
- Progress
- Settings

Mobile navigation exposes six direct items:

- Today
- Study
- Read
- Listen
- Words
- More

Listen contains:

- personalized contextual-audio recommendations;
- all 19 P14 contexts as aligned listening items;
- Comprehensible, Intensive and Targeted modes;
- contextual difficulty and lexical coverage;
- Listen 10;
- direct Read pairing.

## Audio architecture

P15 derives its initial listening corpus from the 19 P14 contextual texts.

Each listening item contains:

- stable listening ID;
- paired P14 reading ID;
- CEFR level;
- context/type/topic/register;
- estimated duration;
- target vocabulary;
- verified phrases;
- aligned sentence segments;
- segment translations;
- speaker index;
- connected-speech metadata;
- comprehension questions;
- provenance and licensing metadata;
- audio-source metadata.

The release uses the browser/device French `SpeechSynthesis` voice rather than downloading third-party audio.

For dialogues, P15 alternates between up to three locally available French voices when the browser exposes them, producing speaker contrast without external network requests.

The data model already includes `audioUrl` fields so verified recorded assets can replace or supplement synthesis later without rewriting the learning/evidence layer.

## Listening modes

### Comprehensible

Meaning-first listening. Normal speed and hidden transcript are the default.

### Intensive

Adds aligned segment replay and connected-speech annotations.

### Targeted

Prioritizes contexts containing weak target vocabulary and verified phrase frames.

## Speed and replay

Available playback rates:

- 0.78×
- 1.00×
- 1.08×

Normal-speed first-listen performance is kept distinct from:

- repeated full playback;
- segment replay;
- slower playback.

Using any of these raises the support level.

## Progressive transcript reveal

Transcript support is deliberately progressive.

The learner can reveal one aligned segment at a time instead of exposing the whole script immediately.

Support hierarchy:

1. **Level 0 — First-listen / no support**
2. **Level 1 — Replay or slower audio**
3. **Level 2 — Transcript used**
4. **Level 3 — Translation used**

Once support has been used during an attempt, hiding it again does not restore independent-evidence status.

## Connected speech

P15 annotates common listening environments conservatively rather than claiming a pronunciation occurs in every voice.

Current cues include:

- elision;
- common liaison environments;
- enchaînement environments;
- weak function words;
- negative frames.

The UI explicitly states that realization varies by speaker/voice.

## Aural retrieval

Each full contextual item can assess:

### Context comprehension

Multiple-choice meaning/detail retrieval based on the audio.

### Phrase recognition

Identify a target lexical expression heard in context.

Distractor position is deterministic per item but not fixed to one answer slot.

### Connected-speech dictation

Type an aligned sentence heard from the context.

Dictation grading distinguishes:

- accurate;
- orthography after correct hearing;
- segmentation / word boundary;
- connected-speech form;
- lexical item not recognized.

## Error taxonomy

P15 stores:

- meaning from context;
- context detail;
- lexical item not recognized;
- connected-speech form;
- word boundary / segmentation;
- orthography after correct hearing;
- speed-dependent;
- transcript-dependent.

Progress surfaces recurring aural-error categories instead of collapsing all mistakes into one accuracy value.

## First-listen evidence

An attempt is marked first-listen success only when all conditions hold:

- answer is correct;
- support level is 0;
- only one full play has occurred;
- playback is at normal or faster speed;
- no transcript or translation was used.

Supported successes still count as learning evidence, but P13 independence/durability calculations weight them less.

## Evidence and SRS integrity

Contextual listening attempts are appended to the normal review log as:

- `practiceOnly: true`;
- `skill: listening`;
- contextual listening metadata;
- support level;
- first-listen flag;
- listening error;
- speed/play count;
- transcript/translation usage;
- P13 sound/word exposure keys.

They do **not** move vocabulary SRS intervals.

P13 automatically receives the evidence through its existing listening dimension.

## Listen 10

Listen 10 creates ten compact contextual dictation tasks from weak/relevant vocabulary.

A task:

1. hides the transcript;
2. plays a sentence containing the lexical target;
3. asks the learner to type what was heard;
4. grades the connected-speech dictation;
5. records support-aware listening evidence.

Listen 10 is available from Listen, Progress and Word Detail.

## Failure repair

A failed standalone contextual dictation schedules:

`failure → scaffold → delayed independent retest`

The scaffold is inserted several exercises later with reduced acoustic load. The independent retest is inserted later again.

When a P15 task appears inside P13 Mixed Review, P13’s existing recovery/interleaving engine remains authoritative instead of duplicating repair.

## P13 Mixed Review integration

P15 replaces part of P13’s isolated listening candidate pool with contextual listening candidates.

Contextual candidates participate in:

- word-spacing constraints;
- modality-run constraints;
- answer-leak suppression;
- weakness prioritization;
- mixed evidence logging;
- recovery scheduling.

Their exposure keys include both:

- `word:<id>`
- `sound:<id>`

## P14 Read ↔ Listen pairing

Pairing is bidirectional.

From Listen:

- open the paired reading.

From Read:

- reading cards expose **Listen pair**;
- an open reader exposes **Listen pair** in the reader header.

The two modes share lexical targets but keep reading exposure and listening evidence separate.

## Word Detail integration

Word Detail now reports contextual listening evidence:

- listening evidence score;
- first-listen successes;
- supported successes;
- contextual attempt count;
- relevant listening contexts;
- Listen in context;
- Listen 10.

## Progress

P15 Progress reports:

- items heard;
- items completed;
- playback count;
- explicit listening retrieval;
- first-listen successes;
- unsupported successes;
- top aural-error categories.

## Adaptive path

`aural` is a first-class personalized-path focus.

Automatic mode can prioritize contextual listening when:

- enough vocabulary has been introduced but contextual listening evidence is sparse; or
- recent contextual listening accuracy is weak.

The path injects a small number of practice-only contextual tasks without disturbing due-review priority.

## Persistence

P15 state is included in `depthStateSnapshot()` and therefore participates in:

- IndexedDB snapshots;
- complete JSON backup;
- encrypted backup built from the same state payload;
- import/restore.

Persisted listening state includes:

- history;
- play counts;
- completion counts;
- question/phrase/dictation totals;
- first-listen successes;
- last speed/mode;
- subjective difficulty placeholder;
- detailed attempts with support/error metadata.

## Offline and privacy behavior

The scripts, alignments, translations, questions, connected-speech metadata and learning logic are bundled in the PWA shell.

Playback uses device/browser speech synthesis:

- no microphone is required;
- no learner voice is recorded in P15;
- French does not upload listening activity;
- device-installed voices may work offline depending on the operating system/browser;
- P15 makes no external audio request for the bundled listening corpus.

The service-worker shell is advanced to `french3000-shell-v19`.

## Accessibility

- playback controls are explicit and user initiated;
- there is no forced autoplay;
- transcript is available on demand;
- translation is available after transcript support;
- audio has a text-equivalent paired reading;
- playback speed is user controlled;
- controls use standard buttons/labels and remain keyboard reachable.

## Release validation

P15 release validation checks:

- v5.6.0 app/release markers;
- 19 listening items derived from the P14 corpus;
- first-class Listen view;
- all three listening modes;
- normal/slow/faster playback;
- multi-voice dialogue selection;
- progressive transcript reveal;
- connected-speech metadata;
- comprehension, phrase and dictation retrieval;
- support-aware evidence;
- first-listen evidence gate;
- acoustic error taxonomy;
- standalone delayed repair/retest;
- P13 contextual-listening candidates;
- P14 bidirectional pairing;
- Word Detail integration;
- Home and Progress integration;
- adaptive aural focus;
- backup/restore integration;
- JavaScript syntax compilation;
- PWA shell v19.

P1–P14 implementation blocks and prior user data remain intact.
