# P14 — Authentic Input, Comprehensible Reading & Vocabulary-in-the-Wild Transfer

French v5.5.0

## Purpose

P14 connects the P1–P13 vocabulary system to complete French texts. It adds a first-class **Read** surface while preserving a strict distinction between passive exposure and successful retrieval.

## First-class Read surface

Desktop navigation now includes:

- Today
- Study
- Read
- Words
- Progress
- Settings

Mobile navigation exposes Read directly in the five-item primary rail.

The Read surface contains:

- personalized recommendations;
- full bundled reading library;
- CEFR and content-type filters;
- Extensive, Intensive and Targeted reading modes;
- reading-history metrics;
- saved/discovered vocabulary.

## Bundled corpus

The initial P14 release includes **19 original graded texts** across A1, A2 and B1.

Content types include:

- stories;
- dialogues;
- practical texts;
- messages;
- short informational texts.

Every bundled text records:

- CEFR level;
- estimated reading time;
- topic;
- register;
- authenticity type;
- source/provenance label;
- redistribution status;
- mapped target vocabulary;
- verified phrase mappings;
- sentence translations;
- optional grammar notes;
- post-reading retrieval questions.

The bundled material is original French learner content. P14 does not scrape or redistribute third-party copyrighted articles.

## Learner-specific vocabulary coverage

P14 tokenizes each text and resolves surface forms against the current French lexical catalog.

Resolution includes:

- exact headword forms;
- lemmas;
- aliases;
- article forms;
- common French elisions;
- a conservative map of frequent inflected verb forms;
- plural fallback.

Each word occurrence is classified as:

- known;
- learning;
- unknown / unmapped.

Coverage bands are:

- 97–100%: Very easy
- 94–96%: Comfortable
- 90–93%: Challenging
- below 90%: High support

Recommendations target approximately the 94–98% comprehensible-input range while also preferring useful weak target vocabulary and unfinished texts.

## Reading modes

### Extensive

French-first reading with minimal interruption.

### Intensive

Adds sentence-level translation/grammar assistance on demand.

### Targeted

Highlights mapped target vocabulary and verified phrase chunks inside complete texts.

## Inline lexical lookup

Any rendered word can be tapped.

Mapped words show:

- headword;
- English meaning;
- CEFR level;
- P13 mastery state;
- passive mastery;
- IPA when available;
- prior completed-text exposure.

Unknown/unmapped forms are clearly labeled rather than given fabricated definitions.

A lookup does **not** count as recall.

## Phrase detection

Curated readings can define exact multiword spans tied to verified P10 frames. These spans render as lexical chunks and open a phrase-level lookup rather than being treated as unrelated tokens.

## Reading discovery

Tapped vocabulary can be saved into a reading-specific discovery collection.

Saved entries remain distinct from the core SRS curriculum and record:

- display form;
- mapped core ID when available;
- encounter count;
- last encounter;
- source text IDs.

Repeated lookups are surfaced as a signal that the item may deserve deliberate study.

Mapped core vocabulary can be opened in Word Detail or sent directly to practice.

## Exposure vs retrieval

Completing a reading records **context exposure** in the reading store only.

Passive exposure:

- does not move a vocabulary interval;
- does not create successful recall evidence;
- does not directly increase active mastery.

Post-reading questions are different. When a question has a mapped lexical target, the explicit context-retrieval result is stored as:

- practice-only evidence;
- supported context evidence;
- no SRS interval change;
- answer-leak exposure for P13;
- no XP inflation.

This preserves the intended evidence hierarchy.

## Post-reading retrieval

Every bundled text includes two compact retrieval questions.

The flow is:

`read → finish → context checks → difficulty feedback`

The learner can reread before finishing the review.

## Reading difficulty feedback

After retrieval, the learner can mark a text as:

- Too easy
- Comfortable
- Challenging
- Too hard

This is stored as recommendation context but does not alter vocabulary mastery directly.

## Reading-state persistence

P14 stores:

- started / last-opened timestamps;
- completion timestamp;
- completion count;
- reading mode;
- sentence position;
- subjective difficulty;
- retrieval attempts and successes;
- saved vocabulary;
- context exposures;
- lookup frequency.

Partially read texts resume at the last stored sentence.

Reader scroll handlers are explicitly removed when leaving or reopening the reader so long sessions do not accumulate listeners.

## Backup and recovery

Reading state is added to the existing complete state snapshot through `depthStateSnapshot()`.

It therefore participates in:

- IndexedDB app-state snapshots;
- complete JSON backups;
- encrypted backups built from the same state payload;
- import/restore through the existing state application path.

A local reading storage key also provides immediate startup availability.

## Word Detail integration

Word Detail now shows a Reading Context section with:

- completed-text exposure count;
- number of distinct texts;
- links to relevant bundled readings;
- a **Read in context** action that opens Targeted mode.

Exposure remains explicitly labeled as distinct from recall.

## Progress integration

Progress now reports:

- distinct texts completed;
- total completions;
- words read;
- saved discoveries;
- context-question accuracy;
- number of core words encountered;
- recent completed readings.

## Home integration

Home shows a personalized reading recommendation based on the current live vocabulary/mastery state, along with the learner's cumulative words-read count.

## Offline behavior

All 19 readings, translations, grammar notes, lexical mappings, questions and provenance metadata are bundled directly in the application shell.

Once the updated PWA shell is cached, normal P14 reading requires no network connection.

## Release validation

P14 release validation verifies:

- v5.5.0 app/release markers;
- exactly 19 unique bundled reading IDs;
- Read view implementation;
- all three reading modes;
- live coverage calculation;
- surface-form lexical resolution;
- phrase mapping;
- exposure/retrieval separation;
- supported contextual retrieval logging;
- reading-state backup integration;
- sentence-position resume;
- scroll-listener cleanup;
- Word Detail integration;
- Home and Progress integration;
- JavaScript syntax compilation;
- PWA shell cache v18.

P1–P13 implementation blocks and user progress remain intact.
