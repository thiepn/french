# French P1 — Vocabulary Database Audit

Date: 2026-09-30  
Release: v4.2.1 — P1 Vocabulary Audit Verification  
Production catalogue target: 3,000 records  
Pinned source fingerprint: `14beb3f21e908a471fe213c99ebc776bd11a5222`

## Scope

P1 audits and improves the vocabulary database without changing stable card IDs, frequency order, CEFR bands, or existing SRS history.

The audit covers:

- catalogue size and uniqueness
- learner-facing meanings and obvious wrong-homograph selection
- part-of-speech normalization
- CEFR/frequency-order preservation
- IPA presence
- bilingual example presence and existing example-quality gates
- noun article/gender/plural metadata
- verb usage-pattern metadata
- secondary/broad meanings
- source provenance and verification tags

## Baseline findings

The pinned source provides 3,000 usable records after French's production filtering, with no missing raw meaning, IPA, POS, or sentence-pair fields and no duplicate headword groups in the selected 3,000.

The main defect was not structural completeness. It was learner relevance. Some source records selected a technically valid but inappropriate homograph or secondary sense. Examples included:

- `lire` as the former lira currency instead of “to read”
- `car` as a coach instead of the conjunction “because”
- `sortir` as a noun instead of “to go out / leave”
- `devenir` as a noun instead of “to become”
- `jeu` with specialized gun/theatre senses instead of “game / play”
- `amour` including the Amur river
- `mec` leading with “pimp” instead of the everyday informal “guy / dude”

Six explicit dictionary-metadata glosses were also found in the raw 3,000-record source, including forms such as `meilleure`, `aucune`, `restau`, `celles`, `patiente`, and `Grecque`.

## Implemented in v4.2.0–v4.2.1

### 1. Source provenance is retained

Prepared cards now preserve:

- `sourceMeaning`
- `sourcePos`
- `sourceTags`
- `sourceVerified`

This allows QA to distinguish French's learner-facing curation from the pinned source data.

### 2. Learner-first lexical curation

The P1 curation banks currently contain:

- 110 lexical overrides
- 76 POS normalization rules
- 43 conservative grammar overrides

Across the 3,000-record catalogue, the combined current curation path changes approximately:

- 228 learner-facing meanings
- 57 POS groups
- 271 records through meaning, POS, or grammar curation
- 208 records within the top 500 frequency positions

The final audit leaves zero learner-facing dictionary-metadata glosses matching the P1 metadata rule.

### 3. High-frequency sense cleanup

The top-frequency vocabulary received an additional learner-first pass. Specialized, misleading, or low-value senses were replaced where confidence was high.

Examples include:

- `air` → air; appearance; look; tune
- `part` → part; share; portion
- `envie` → desire; urge; `envie de` = to feel like
- `retour` → return; way back
- `tour` → turn; tour; tower
- `gentil` → kind; nice
- `battre` → to beat; hit; fight
- `sortie` → exit; outing; way out
- `poste` → post; position; job; post office
- `rire` → to laugh; laughter
- `servir` → to serve; be useful
- `bravo` → well done!; bravo!

### 4. Conservative noun grammar enrichment

P1 adds article, gender, and plural information only where confidence is high. It deliberately does not infer noun gender from spelling.

This means noun metadata coverage remains an editorial backlog rather than being filled with guesses. Existing QA continues to flag nouns missing article/gender.

### 5. Stronger release QA

The existing release audit now treats residual dictionary-metadata glosses as critical findings and checks learner POS overrides for mismatches.

Existing checks still cover:

- missing meanings
- invalid headwords
- duplicate candidates
- broken bilingual example pairs
- missing noun article/gender
- missing/suspicious IPA
- missing/low-confidence examples
- broad/dictionary-style glosses
- local data integrity

### 6. Cache/version migration

The prepared vocabulary cache was bumped from v4 to v5 so existing installations rebuild from the P1 pipeline.

The PWA shell cache was bumped from v2 to v4 across the P1 rollout.

No user progress, review history, stable card IDs, CEFR bands, or frequency order is intentionally reset.

## Editorial backlog after P1

P1 makes the catalogue structurally safer and substantially improves the highest-value learner vocabulary, but the following remain ongoing editorial work rather than automatic guesses:

1. Complete article/gender/plural metadata for the remaining nouns using a redistribution-compatible authoritative source.
2. Expand manually validated example coverage for cards whose source examples are deliberately rejected by French's crafted-example filter.
3. Expand collocation and verb-construction coverage beyond the current curated usage-pattern bank.
4. Continue manual sense-priority review from frequency ranks 501–3000.
5. Spot-check pronunciation/IPA against an authoritative pronunciation source when entries are edited.
6. Split genuinely important multi-POS or multi-sense headwords when a single card becomes pedagogically ambiguous.

These are non-blocking editorial queues; they should not be auto-filled from uncertain heuristics.

### 7. Final POS normalization verification

v4.2.1 closes one remaining source-schema mismatch: French now normalizes source `art` records as determiners, `fp/mp` records as nouns, and `vr` records as verbs. This prevents common articles such as `le`, `la`, `les`, `un`, `une`, `des`, and `du` from falling into the generic “other” POS bucket.

The current two inline JavaScript programs both pass syntax validation after the final P1 changes.

## Release status

v4.2.1 completes P1 while keeping French focused as a vocabulary/SRS product and establishes the verified base for P2 — Study Engine 2.0.
