# P10 — Verified Collocation & Phrase Corpus Expansion

French3000 v5.1.0

## Purpose

P10 expands the P9 usage engine from a small pair of usage strings into a provenance-tagged lexical corpus. It is vocabulary-first: it trains how a known word combines with complements, prepositions, and fixed phrase partners without turning French3000 into a general grammar course.

## Corpus policy

- Source-backed records are tagged `verified`.
- Older pre-P10 `usagePattern` metadata is retained as `reference`, not silently promoted to independently verified status.
- Raw English glosses are never converted into collocations.
- Example-sentence chunks remain example evidence unless a separate lexical source supports them as a reusable construction.
- Only records whose anchor exists in the pinned production vocabulary are attached.
- Usage/collocation practice is practice-only and does not alter the underlying vocabulary SRS interval.

## P10 corpus audit

- 67 new source-backed records
- 57 distinct production-vocabulary anchors
- 28 constructions
- 3 valency / argument-pattern records
- 26 collocations
- 10 fixed phrases
- 67/67 records matched the pinned 3,000-word production slice
- 0 duplicate frames
- 0 records without an explicit recall blank

## Reference families

- Tex's French Grammar, University of Texas at Austin — prepositions with infinitives
  - https://laits.utexas.edu/tex/gr/pre4.html
- Progress with Lawless French — verbs followed by à + infinitive
  - https://progress.lawlessfrench.com/learn/theme/3603304
- Progress with Lawless French — verbs followed by de + infinitive
  - https://progress.lawlessfrench.com/learn/theme/3744352
- Progress with Lawless French — à + indirect object + de + infinitive
  - https://progress.lawlessfrench.com/learn/theme/4050945
- Progress with Lawless French — indirect-object constructions
  - https://progress.lawlessfrench.com/learn/theme/3907306
- Dictionnaire de l'Académie française — lexical entries for avoir, attention, compte, faire, prendre, décision, partie, fin, rendez-vous, poser, and chance.

## Learning integration

P9 mastery states continue to apply per phrase:
- unseen
- building
- secure
- refresh

P10 adds:
- corpus provenance on word details
- verified/reference distinction
- `corpus:verified` search
- `usage-kind:collocation` search
- Collocations 10 practice
- Constructions 10 practice
- source and corpus coverage diagnostics in Progress

The P8 personalized path may surface P10 records through the P9 usage lane, but scheduled due reviews retain priority.
