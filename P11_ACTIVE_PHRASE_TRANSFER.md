# P11 — Active Phrase Production, Transfer Drills & Usage Error Diagnosis

French v5.2.0

## Purpose

P11 turns P10's verified phrase corpus into active production practice. Learners type the complete French construction or collocation from a meaning/anchor cue instead of only recognizing a frame or recalling one hidden connector.

## Practice modes

### Active phrase production
- Uses only verified P10 corpus records.
- Shows a meaning cue plus the French anchor.
- Requires the whole verified lexical frame.
- Includes connector, collocate, complement shape, and word order.

### Transfer drills
- Unlock once the underlying phrase or production skill has enough evidence.
- Present the same lexical anchor with a structural complement cue.
- Test whether the learned pattern can be retrieved without seeing the phrase.

### Error repair
- Rebuilds a queue from recent diagnosed phrase-production mistakes.
- When launched from filtered Words results, repair stays inside that selection.
- Repeated errors remain visible in Progress until corrected through later production.

## Deterministic usage diagnosis

P11 does not use an LLM to judge answers. It compares the typed answer against the verified P10 frame and classifies observable differences:

- Exact phrase
- Orthography
- Wrong connector
- Wrong or missing collocate
- Neighboring verified pattern
- Incomplete frame
- Word order
- Spelling
- Missing anchor
- No answer
- Different structure

If the learner types another verified P10 frame for the same anchor, French labels it as a neighboring verified pattern rather than claiming the French is invalid.

## Evidence and scheduling

- P11 phrase work is always practice-only.
- It never moves the vocabulary card's SRS due date.
- Exact full-frame production contributes to P9 usage evidence.
- Transfer attempts and diagnoses are stored in the review log.
- Transfer state survives reloads, session resume, backup, and import.
- Transfer security currently requires at least 2 attempts with at least 80% exact production and a correct latest attempt.

## P8 path integration

Phrase transfer is a first-class personalized-path focus.

Automatic mode may select phrase transfer when:
- verified usage is already available,
- the underlying word/phrase has enough production evidence,
- and transfer gaps have accumulated.

Scheduled due reviews retain priority and are not displaced when the queue is review-heavy.

## UI integration

- Home: Produce phrases
- Words: Phrase production 10, Repair phrase errors
- Word detail: Produce phrases / Transfer
- Progress: production-tested, transfer-ready, transfer-secure, transfer gaps, and error profile
- Settings: Phrase transfer & production learning priority
- Search:
  - `transfer:ready`
  - `transfer:gap`
  - `transfer:secure`
  - `transfer:unseen`
  - `phrase-error:connector`
  - other diagnosis names through `phrase-error:<type>`

## P10 relationship

P11 never creates new lexical facts. Its targets come from P10's provenance-tagged verified phrase corpus. P10 remains the authority for which construction/collocation is valid; P11 supplies production, transfer, diagnosis, and repair behavior around those records.
