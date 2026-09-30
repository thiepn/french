# French3000 P4 — Listening, Pronunciation & Audio Mastery

Date: 2026-09-30  
Release: v4.5.0 — P4 Listening, Pronunciation & Audio Mastery  
Baseline: v4.4.0 P3 Frictionless Study UX

## Goal

P4 makes audio a first-class vocabulary skill without turning French3000 into a noisy language lab or weakening the existing FSRS model.

Listening remains an independently scheduled memory skill. Pronunciation work is intentionally practice-only unless the learner is answering a scheduled listening card.

## Implemented

### 1. Model audio and learner recordings are separated

The former audio path could prefer a saved learner recording before source/model audio.

P4 changes the hierarchy:

- **Hear model** = source audio when available, otherwise the selected French browser/system TTS voice.
- **Play mine** = only the learner's locally recorded pronunciation.
- A learner recording can no longer silently become the pronunciation model.

### 2. Slow replay

Every study card now exposes a compact **0.7×** model-audio action.

Listening cards can therefore be replayed normally first, then slowed only when a sound boundary is difficult.

The saved model-audio playback preference still applies to normal playback.

### 3. Listening-first cards

Scheduled listening cards continue to hide the French spelling before the answer and automatically play authoritative model audio.

The listening prompt explicitly encourages audio-first recall rather than reading.

Listening remains its own FSRS skill card with its own stability, retrievability, due date, lapses, and review history.

### 4. Pronunciation lab

After reveal, each card has a compact Pronunciation panel:

- Hear model
- Slow model
- Record me
- Play mine
- Check intelligibility

The panel is automatically expanded for listening cards and collapsed for other skills to preserve the P3 low-friction card layout.

### 5. Local pronunciation recording

Microphone recordings are stored in the existing local IndexedDB media store.

Recording is:

- opt-in
- device-local
- one recording per vocabulary note
- played separately at 1× speed
- never used as model audio

### 6. Optional intelligibility check

Where the browser exposes Web Speech Recognition, **Check intelligibility** listens for one French attempt and compares the recognized transcript with the target word/expression.

It reports:

- recognized French text
- text-match percentage
- clear/mismatch result

This is explicitly an **intelligibility check, not an accent score**. It never changes FSRS scheduling or card ratings.

Browsers without Speech Recognition simply disable the check; recording and model playback continue to work.

### 7. Pronunciation practice history

Successful/unsuccessful intelligibility checks are stored locally in a small capped log.

Only note ID, timestamp, similarity score, and pass/fail are persisted. The recognized transcript itself is not stored.

Per-card pronunciation stats show:

- number of checks
- pass rate
- best result

### 8. Audio mastery analytics

Progress now includes an Audio Mastery panel showing:

- listening skills started
- listening skills learned
- listening reviews due
- vocabulary notes pronunciation-checked
- speech-recognition pass rate

Pronunciation analytics remain separate from scheduled memory mastery.

### 9. Listening 10

A **Listening 10** shortcut is available from Home's secondary details and Progress.

It creates a ten-card scheduled listening session using the existing skill gates and FSRS queue. It will not overwrite an unfinished saved session.

### 10. Daily plan support

The P3 daily-plan editor now exposes Listening and Spelling as explicit skill focuses without moving those controls back into the main study screen.

### 11. Inspector and settings cleanup

Card Inspector now distinguishes:

- Hear model
- Play my recording

Audio settings use **Model audio speed** terminology instead of implying that learner recordings control model pronunciation.

## Preservation

P4 does not reset or replace:

- P1 vocabulary data
- stable note or skill IDs
- P2 FSRS memory state
- P3 daily study flow
- due dates or review history
- recognition/production/listening/spelling/article schedules
- custom lists
- user cards
- backups

The PWA shell cache moves to v7.

## Verification

Before commit:

- complete production main-script syntax compilation: PASS
- service-worker syntax compilation: PASS
- P1 fingerprint retained
- P2 Study Engine retained
- P3 Frictionless Study UX retained
- model/learner audio separation present
- slow playback present
- pronunciation recording present
- intelligibility check is practice-only
- audio mastery analytics present

## Next phase

**P5 — Progress & Vocabulary Intelligence**
