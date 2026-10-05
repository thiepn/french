# P27 — Curriculum Coverage & Content Quality Audit

French v5.18.0

## Purpose

P27 audits **the curriculum**, not the learner.

Earlier phases can answer what the learner knows, forgets, can use, and which CEFR gate is weak. P27 asks a different question:

> Is French itself teaching and measuring the intended curriculum with enough breadth, quality, and structural integrity to justify those conclusions?

The audit is derived at runtime from the actual loaded vocabulary catalog and the app's built-in reading, listening, conversation, mission, phrase, sentence, grammar, and metadata layers.

## Relationship to earlier QA

French already had strong lexical and structural checks from the pre-4.0 vocabulary work.

P27 does not duplicate or discard them. It composes:

- lexical metadata QA;
- duplicate detection;
- validated example checks;
- noun article/gender completeness;
- application data integrity;

with new curriculum-level checks.

## CEFR coverage matrix

For A1, A2, B1, and B2, P27 measures:

- core vocabulary count;
- bundled reading texts;
- contextual listening items;
- guided conversation scenarios;
- functional missions;
- distinct communicative functions;
- verified phrase/collocation records reachable from that level;
- sentence-production exercises reachable from that level;
- zero-vocabulary everyday-domain cells.

The P25 promotion minimum is mirrored as a curriculum-coverage check:

- at least 3 reading texts;
- at least 3 contextual listening items;
- at least 3 conversation scenarios;
- at least 1 functional mission.

A missing modality is a **coverage gap**, not a learner failure.

## Everyday-domain audit

P27 uses French's existing topic taxonomy:

- greetings;
- people/family;
- home;
- food/drink;
- travel/transport;
- work/study;
- shopping/clothing;
- time/routine;
- town/services;
- communication;
- health/body;
- nature/weather;
- feelings/opinions;
- connectors/function words.

For each CEFR band, zero-vocabulary cells are surfaced.

This is intentionally a zero-coverage check rather than an arbitrary equal-distribution rule. Different levels do not need identical numbers of words in every topic.

## Vocabulary quality

P27 reports:

- example-pair coverage;
- IPA coverage;
- noun article coverage;
- noun gender coverage;
- verified usage/collocation anchor coverage;
- coursebook mapping coverage;
- lexical critical findings;
- lexical warning count;
- possible duplicate groups.

Editorial thresholds currently warn when:

- example coverage < 90%;
- article coverage < 95%;
- gender coverage < 95%;
- IPA coverage < 80%.

Warnings do not silently alter vocabulary.

## Reading QA

P27 checks:

- unique reading IDs;
- CEFR labels;
- presence of sentences;
- bilingual sentence pairs;
- comprehension-question answer indexes;
- minimum comprehension-check breadth;
- duplicate titles;
- duplicate normalized reading bodies.

Invalid IDs, levels, bilingual rows, or answer indexes are structural/content defects.

## Listening QA

P27 checks:

- unique listening IDs;
- valid source-reading references;
- CEFR labels;
- segment presence;
- dependence on synthesized speech.

Speech-synthesis dependence is a warning, not a defect, because it is an intentional current implementation boundary.

## Conversation and function QA

P27 checks:

- unique scenario IDs;
- valid CEFR labels;
- valid start nodes;
- registered communicative-function identifiers;
- scenarios without functions;
- communicative functions with zero contexts;
- communicative functions represented in only one scenario.

Single-context functions are warnings because they reduce transfer diversity.

## Mission QA

P27 checks:

- unique mission IDs;
- missions with at least one scenario;
- valid scenario references;
- declared function coverage.

A mission referencing a missing scenario is a defect.

## Phrase/collocation corpus QA

P27 checks:

- unique corpus IDs;
- corpus anchors that no longer resolve to a vocabulary note;
- verified usage records reachable by CEFR level.

An unmatched corpus anchor is a warning because it makes that drill record unreachable.

## Sentence-exercise QA

P27 checks:

- unique exercise IDs;
- prompt, frame, and expected-answer presence;
- resolvable vocabulary anchor;
- resolvable verified usage record;
- reachability through the current exercise engine.

An unreachable exercise is surfaced explicitly as an exercise-generation blind spot.

## Grammar/checkpoint coverage

P27 reports:

- number of mapped lessons;
- total checkpoint/grammar topics;
- unique checkpoint/grammar topics;
- duplicate topic labels.

This is descriptive coverage evidence, not an official CEFR grammar syllabus claim.

## P25 integration

P27 adds an integrity condition to P25.

A level with structurally defective curriculum content cannot use that content to support promotion until the defect is fixed.

Normal curriculum **coverage gaps** remain represented through P25's existing modality gates. They do not get disguised as learner weakness.

## Status semantics

P27 distinguishes three states:

### Fail

Reserved for broken content or reference integrity, including:

- duplicate content IDs;
- invalid CEFR identifiers;
- broken cross-content references;
- malformed comprehension answer keys;
- incomplete bilingual rows;
- critical lexical findings;
- invalid scenario start nodes.

### Warn

Used for valid but incomplete curriculum, including:

- missing CEFR modality coverage;
- zero-vocabulary domain cells;
- low metadata coverage;
- synthesized-listening dependence;
- single-context communicative functions;
- unreachable sentence exercises;
- unmatched phrase-corpus anchors.

### Pass

No structural/content defects and no outstanding coverage/editorial warnings.

## UI

### Progress

P27 adds a curriculum panel with:

- A1–B2 coverage cards;
- modality counts;
- function/phrase/sentence counts;
- vocabulary quality metrics;
- defects;
- promotion-relevant coverage gaps.

It is explicitly separated from learner mastery.

### Settings → Data

P27 adds a durable curriculum-QA surface with:

- defect count;
- coverage-gap count;
- warning count;
- unreachable sentence count;
- unmatched phrase-record count;
- lexical duplicate groups;
- top warnings;
- JSON audit export;
- manual re-run.

## Export

The curriculum audit can be exported as JSON.

The export contains aggregate curriculum/content metadata and issue descriptions. It does not contain learner answers, speech transcripts, or other response content.

## Regression protection

P27 extends the existing QA chain with:

- curriculum count consistency;
- level coverage bounds;
- cross-content reference validation;
- content-ID uniqueness;
- sentence/corpus reachability;
- lexical critical findings.

Coverage gaps produce QA warnings. Structural defects produce QA failures.

## Known current limitation

French currently lacks a B2 communicative corpus sufficient for promotion. P27 keeps that gap visible rather than converting B2 vocabulary volume into an implied B2 curriculum.

## PWA

P27 uses shell cache:

- `french-shell-v38`
