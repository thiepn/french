# French P5 — Progress & Vocabulary Intelligence

Date: 2026-09-30  
Release: v4.6.0 — P5 Progress & Vocabulary Intelligence  
Baseline: v4.5.0 P4 Listening, Pronunciation & Audio Mastery

## Goal

P5 turns Progress from a collection of statistics into a decision surface.

It answers five practical questions:

1. How much of the 3,000-note vocabulary catalog have I actually started?
2. How much is currently secure for recognition and production?
3. Which independent skills are lagging?
4. Which words and topics are causing the most memory risk?
5. What should I do next?

The intelligence layer is read-only with respect to scheduling. Existing P2 FSRS scheduling remains authoritative.

## Vocabulary estimates

P5 deliberately avoids claiming that app data equals total real-world French vocabulary.

A note is:

- **Introduced** when at least one scheduled skill has been reviewed.
- **Recognition secure** when its recognition skill is learned and current FSRS retrievability is at or above the user's configured desired-retention target.
- **Production secure** when every production sense is learned and currently at or above that retention target.
- **Balanced secure** when both recognition and production are secure.

These definitions make the displayed numbers auditable instead of using vague "mastered" labels.

## Implemented

### 1. Vocabulary coverage funnel

Progress now shows the actual transition:

**Catalog → Introduced → Recognition secure → Production secure → Balanced secure**

Every row shows both count and catalog percentage.

### 2. CEFR coverage intelligence

A1–B2 rows now distinguish:

- recognition security
- production security
- balanced security

This prevents a high recognition score from hiding weak active recall.

### 3. Skill-health matrix

Recognition, production, listening, spelling, and article/gender are summarized independently.

For each skill P5 shows:

- eligible notes
- started notes
- currently secure notes
- due notes
- average current retrievability among started notes

### 4. Directional gap

Progress explicitly calculates the current recognition → production gap among started vocabulary.

This identifies the common state where French words look familiar but cannot yet be actively produced.

### 5. Review pressure

The top-level Progress view now counts scheduled **skill reviews**, not only aggregate note-level due states:

- due now
- next 24 hours
- days 2–3
- days 4–7

### 6. Weakest vocabulary

P5 uses the P2 authoritative weakness model rather than inventing another score.

Risk therefore continues to reflect:

- due age
- lapses
- FSRS difficulty
- retrievability
- failure rate
- typed-answer issues
- repeated mistakes
- response latency
- recent Again/Hard ratings
- production gaps

Clicking a weak word opens its existing inspector.

### 7. Weak topic clusters

Reviewed vocabulary is grouped by theme to identify where risk is accumulating.

Each weak cluster shows:

- reviewed notes
- high-risk notes
- due notes
- average P2 risk

Topic repair buttons launch **practice-only** weak-card sessions, so diagnostic practice cannot move scheduled FSRS due dates.

### 8. Repair-cause intelligence

P5 aggregates the existing P2 repair diagnoses:

- Answer precision
- Production gap
- Repeated forgetting
- Slow retrieval
- Memory risk

This makes the weak-list actionable rather than simply labeling words difficult.

### 9. Generated next actions

Progress produces up to three concrete actions from live state:

- Review due
- Repair top weak cards
- Production 10
- Listening 10
- Study today

The recommendations are deterministic consequences of current review pressure, high-risk vocabulary, and directional skill imbalance.

### 10. Progressive disclosure preserved

Legacy analytics were not deleted.

Activity charts, history, achievements, diagnostics, roadmap tools, and P4 Audio Mastery remain available through the existing detailed-progress dialog.

The default Progress surface stays decision-focused.

## Preservation

P5 does not reset or replace:

- P1 vocabulary data
- stable note and skill IDs
- P2 FSRS scheduling
- P2 weakness model
- P3 daily-study UX
- P4 listening/pronunciation systems
- review history or due dates
- custom lists
- user cards
- backups

The PWA shell cache moves to v8.

## Verification

Before commit:

- full production JavaScript syntax compilation: PASS
- service-worker syntax compilation: PASS
- P1 fingerprint retained
- P2 weakness model retained
- P3 UX retained
- P4 audio mastery retained
- coverage funnel present
- skill-health intelligence present
- directional gap present
- weak clusters and repair causes present
- generated next actions present
- legacy detail dialog preserved

## Next phase

**P6 — Smart Words, Search & Vocabulary Discovery**
