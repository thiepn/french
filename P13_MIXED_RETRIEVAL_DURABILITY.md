# P13 — Mixed Retrieval, Interleaving & Durable Active-Vocabulary Mastery

French v5.4.0

## Purpose

P13 consolidates the independent P1–P12 learning layers into a single adaptive Mixed Review system. It measures whether vocabulary remains usable across modalities and time rather than treating repeated accuracy in one exercise format as mastery.

## Mastery dimensions

Each eligible vocabulary note now receives independent evidence for:

- Recognition
- Meaning / form recall
- Listening
- Phrase production
- Sentence production
- Context transfer

The model keeps passive and active mastery separate and applies weakest-link logic rather than allowing strong recognition to hide weak production.

## Mastery states

P13 introduces:

`NEW → LEARNING → FAMILIAR → RECALLABLE → USABLE → DURABLE → ROBUST`

The state is evidence-based. Durability depends on:

- successful retrieval;
- spacing across days;
- time span of evidence;
- modality breadth;
- independent/first-attempt retrieval;
- response latency;
- failures/lapses;
- support level;
- contextual transfer.

Each dimension also exposes evidence count and confidence.

## Mixed Review

**Mixed Review 20** is now available from Home, Words and Progress.

The default 20-task composition targets approximately:

- 30% overdue scheduled review;
- 20% weakness/error repair;
- 15% listening;
- 15% phrase/sentence production;
- 10% context transfer;
- 10% recent reinforcement.

If a lane lacks eligible material, another useful lane fills the space. Mature vocabulary appears only sparsely as confirmation unless it is genuinely due.

## Scheduling integrity

Mixed Review does not replace the existing SRS.

- Real due cards keep their normal review schedule.
- Supplemental weak/listening/phrase/sentence/transfer/recent tasks are practice-only.
- Strong dimensions are not reset because another modality fails.
- P11/P12 repair evidence remains separate from vocabulary scheduling.

## Interleaving constraints

The mixed queue prefers:

- no same vocabulary note within the previous 4 exercises;
- no more than 2 consecutive exercises from the same modality;
- no more than 3 hard production tasks in succession;
- alternating difficulty waves;
- semantic/topic variation;
- a deliberate mix of recent and older vocabulary.

A runtime guard reorders upcoming work when later recovery insertion would otherwise create avoidable local conflicts.

## Answer-leak suppression

P13 records the information exposed by mixed tasks using compact exposure keys.

Each mixed review log entry stores:

- modality;
- exercise kind;
- difficulty;
- exposed word/frame keys;
- first-attempt status;
- support level;
- recovery step.

Recently exposed answers are suppressed for 15 minutes when alternatives are available. The same-word four-item gap also protects against immediate cross-modality leakage inside a session.

These fields live in the ordinary review log, so export/import and existing backup behavior preserve them.

## Failure recovery

Mixed Review uses the existing diagnostic systems rather than creating a second grading engine.

A failure can trigger a spaced sequence such as:

`failure → scaffold → delayed retest → context transfer`

For phrase failures, P11 structural repair and transfer tasks are reused. For ordinary skill failures, P13 can insert a lower-load scaffold and later transfer task. P12 sentence failures retain their own retry and delayed-transfer behavior and are re-tagged into the mixed queue.

Recovery tasks are spaced later in the queue instead of appearing immediately after the answer.

## Recurring errors

P11 and P12 error histories feed the weakness/repair lane. Repeated phrase or sentence failures therefore receive priority without globally lowering unrelated mastery dimensions.

## Search

P13 adds:

- `mastery:new`
- `mastery:learning`
- `mastery:familiar`
- `mastery:recallable`
- `mastery:usable`
- `mastery:durable`
- `mastery:robust`
- `active:strong`
- `active:weak`
- `passive:strong`
- `durability:60`
- `durability:durable`
- `durability:robust`

## Word detail

Word detail now shows:

- mastery state;
- passive mastery;
- active mastery;
- durability;
- confidence;
- weakest link;
- each eligible dimension with its evidence count.

## Progress

Progress now includes:

- counts for all seven mastery states;
- passive-strong vocabulary;
- active-strong vocabulary;
- durable vocabulary;
- robust vocabulary;
- average durability;
- weakest active vocabulary;
- direct Mixed Review launch.

## Personalized path

`mixed` is a first-class learning-path focus.

Automatic mode can choose Mixed Durability when enough vocabulary has been introduced but active mastery is substantially behind. The personalized path then injects a small number of mixed tasks while still preserving scheduled due-review priority.

## Persistence

P13 mixed-task metadata survives session save/resume. Mixed evidence fields survive review-log normalization, backup export and import.

## Performance hardening

The first implementation pass was followed by a performance hardening commit. P13's master dashboard now uses a cached single-pass review-log evidence index instead of repeatedly invoking older phrase/sentence history scans across thousands of notes.

## Release validation

Before release:

- the full single-file app was JavaScript syntax-compiled after the main implementation;
- it was syntax-compiled again after performance hardening;
- required P13 version, Mixed Review, mastery-model, interleaving and search markers were asserted;
- all seven mastery states are present;
- the PWA shell cache was advanced to v17;
- P1–P12 implementation blocks remain in place.
