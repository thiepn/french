# P16 — Pronunciation, Shadowing & Spoken Production Transfer

French v5.7.0

## Purpose

P16 moves French from typed active production into spoken production while preserving the app's evidence discipline.

Its central rule is:

**speech recognition can support intelligibility checking, but it is not an accent score and it is not authoritative enough to turn recognition uncertainty into learner failure.**

P16 builds on:

- P4 local microphone recording and intelligibility foundations;
- P12 sentence production and contextual transfer;
- P13 multidimensional mastery/interleaving;
- P14 contextual reading;
- P15 aligned contextual listening and connected-speech cues.

## First-class Speak surface

Desktop navigation now contains:

- Today
- Study
- Read
- Listen
- Speak
- Words
- Progress
- Settings

Mobile keeps the same direct surfaces in a horizontally scrollable seven-item primary rail.

Speak has four modes:

- Pronunciation
- Shadowing
- Spoken recall
- Spoken transfer

It also exposes **Speak 10**.

## Pronunciation mode

Pronunciation tasks ask the learner to say a lexical item naturally.

The target is visible because this mode measures intelligibility, not lexical recall.

Available support:

- model audio;
- slow model audio;
- temporary microphone recording;
- playback of the learner attempt;
- optional speech-recognition check;
- manual self-assessment.

IPA from the core catalog is shown when available.

The same mode can be launched from **Word Detail** for any core word, not only vocabulary already present in the P14/P15 contextual corpus.

## Shadowing

Shadowing uses P15 aligned contextual segments.

The flow supports:

`hear model → repeat immediately → record/play → optional intelligibility check`

P15 connected-speech cues are reused, including:

- elision;
- common liaison environments;
- enchaînement cues;
- weak function words;
- negative frames.

Shadowing remains support level 1 by design because a model is part of the exercise.

Pace feedback compares recording duration with the model duration only as a coarse rhythm signal. It is not treated as a pronunciation score.

## Spoken recall

Spoken recall presents the contextual English meaning from P15 and hides the French sentence.

The learner must retrieve the French aloud.

Using:

- model audio;
- slow audio;
- target reveal

raises the support level and therefore prevents the attempt from counting as independent spoken recall.

## Spoken transfer

Spoken transfer reuses P12 sentence/collocation tasks, with priority for transfer/cue/translation tasks.

The learner receives the real-life prompt and responds aloud in French.

When a P12 exercise is available, recognized speech is evaluated with the existing P12 sentence-diagnosis engine rather than a new duplicate grammar grader.

This preserves:

- accepted alternatives;
- construction checks;
- preposition/contraction diagnosis;
- word-order handling;
- manual ambiguity handling.

## Conservative speech recognition

P16 uses the browser's Web Speech recognition interface only when available.

Recognition can return:

- Recognized clearly
- Mostly recognized
- Recognition mismatch
- Unscored

Important rules:

- recognition is an intelligibility signal only;
- confidence is used as a reliability hint, not a truth score;
- a recognition engine error produces **no learner failure**;
- an uncertain result produces **no learner failure**;
- a mismatch result is not automatically treated as a learner failure;
- the learner can override recognition using Correct / Almost / Retry;
- manual judgment replaces the immediately preceding automated attempt rather than double-counting it.

Speech recognition may be implemented by the browser/OS using a network service. The UI states this explicitly.

## Temporary recording privacy

P16 microphone recordings are session-temporary.

They are stored only as an in-memory Blob/Object URL for:

- Play mine;
- pace comparison;
- immediate self-review.

They are not:

- written into the P16 backup payload;
- uploaded by French;
- retained after leaving the Speak task.

Abandoned recordings are explicitly discarded even when `MediaRecorder.stop()` finishes asynchronously after navigation.

This is separate from the older P4 **Record pronunciation** action, which is an explicit persistent per-word recording feature.

## Support model

P16 uses support levels to distinguish independent speech from assisted production.

Typical support progression:

- 0 — independent recall/transfer;
- 1 — model audio / normal shadowing;
- 2 — slow model or revealed French target;
- 3 — reserved for stronger future scaffolds.

Model use is stored in Speak session state rather than transient task objects, so support remains correct across rerenders.

## Spoken evidence

P16 keeps a dedicated speaking history with:

- task mode;
- note/context/exercise IDs;
- target;
- recognized transcript;
- text/structure similarity;
- speech-recognition confidence;
- verdict;
- manual/automatic judgment;
- support level;
- model/slow-model usage;
- target visibility;
- response time;
- learner recording duration;
- model duration;
- pace ratio.

Raw P16 microphone audio is not stored in this history.

## Review-log integration

Reliable or manually confirmed speaking evidence is also written into the normal review log as:

- `practiceOnly: true`;
- `spokenPractice: true`;
- `practice: spoken`;
- `mixedModality: speaking`;
- `mixedSupportLevel`;
- word/sound exposure keys.

P16 registers `spoken` as a valid practice type so import/restore normalization preserves it.

Unreliable automated recognition is retained only in P16 attempt history and is not promoted into review evidence until the learner confirms it.

## SRS integrity

Spoken practice never changes the vocabulary SRS interval.

P16 Study/Mixed tasks temporarily force practice mode before rating.

A speaking failure therefore cannot reset a mature vocabulary card.

## P13 Mixed Review

P16 adds contextual spoken recall/transfer candidates to P13's phrase/sentence candidate pool when browser speech recognition is available.

Speaking becomes its own modality:

`modality = speaking`

It therefore participates in:

- same-word spacing;
- modality interleaving;
- hard-production-run control;
- answer-leak protection;
- sound/word exposure tracking.

If speech recognition is unavailable, P13 simply omits P16 automated speaking candidates rather than inserting unusable tasks.

## Mixed-session persistence

P16 extends the existing session snapshot with speaking-task metadata:

- queue index;
- task ID;
- kind;
- expected French;
- prompt;
- P12 exercise ID.

Interrupted Mixed Review/personalized-path speaking tasks therefore survive refresh/resume.

## Spoken profile

Each word can accumulate four P16 spoken dimensions:

- pronunciation/intelligibility;
- shadowing;
- spoken recall;
- spoken transfer.

The cross-mode score is breadth-sensitive: strong evidence in one speaking mode cannot present itself as broad spoken mastery.

A word is considered cross-mode secure only when it has:

- sufficient overall spoken evidence;
- at least one independent spoken-recall success;
- at least one independent spoken-transfer success.

## Read / Listen / Speak integration

P16 links the existing context stack:

`Read ↔ Listen ↔ Speak`

From a P15 listening player, the learner can open **Speak pair**.

From an open P14 reading, the learner can open **Speak context**.

Both routes launch shadowing against the same contextual material.

## Word Detail

Word Detail now shows:

- cross-mode spoken evidence;
- pronunciation score;
- shadowing score;
- spoken recall score;
- spoken transfer score;
- attempt count;
- relevant context links;
- Speak this word;
- Speak 10.

## Progress

P16 Progress reports:

- total speaking attempts;
- judged/reliable attempts;
- independent spoken successes;
- words with speaking evidence;
- cross-mode secure words;
- average spoken evidence;
- per-mode success rates.

## Home

Home now includes a direct spoken-production recommendation and current spoken-evidence totals.

## Adaptive path

`spoken` is a first-class adaptive focus.

Automatic mode can choose spoken production when the learner has introduced enough vocabulary but speaking evidence remains sparse.

When browser speech recognition is available, the personalized path can inject a small number of practice-only spoken recall/transfer tasks without reducing due-review priority.

## Backup and restore

Speaking metadata is included in `depthStateSnapshot()` and therefore participates in:

- IndexedDB state snapshots;
- JSON backup;
- encrypted backup using the existing state payload;
- import/restore.

Temporary microphone audio is intentionally excluded.

## Offline behavior

The following remain bundled/offline-capable:

- speaking prompts;
- P12 expected/accepted sentence data;
- P15 contextual scripts;
- connected-speech cues;
- speaking attempt history;
- manual self-assessment;
- local microphone recording when the browser permits it.

Device/browser TTS availability determines model-audio offline behavior.

Speech recognition is an optional enhancement and may require a network-backed browser/OS service. French does not claim that STT is offline.

## Release validation

P16 validation checks:

- v5.7.0 markers;
- first-class Speak view;
- four speaking modes;
- Speak 10;
- temporary recording lifecycle;
- explicit discard of abandoned recordings;
- speech-recognition fallback;
- conservative recognition verdicts;
- no accent-scoring claims;
- shadowing;
- pace feedback;
- spoken recall;
- P12 spoken transfer;
- manual self-assessment/override;
- valid `spoken` practice normalization;
- practice-only/SRS isolation;
- P13 speaking modality integration;
- Mixed Review snapshot/resume metadata;
- P14/P15 context bridges;
- Word Detail integration;
- Home/Progress integration;
- adaptive spoken focus;
- backup/restore integration;
- JavaScript syntax compilation;
- PWA shell v20.

P1–P15 state remains compatible.
