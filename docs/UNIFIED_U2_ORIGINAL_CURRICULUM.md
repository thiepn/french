# Unified French U2 — Original Curriculum, Grammar and Lexical Review

## Containment

Source-only stacked branch on U1 PR #25 exact head `2e920fa1f3990415b10a9824bc6fdae67c029553`, which in turn remains based on B7 PR #23. No main, previous drafts, production P35 v5.24.0, rollback, Account access, real learner data or credentials are changed.

## Delivered

- **12 original contextual A1–A2 lessons**: 8 A1 and 4 A2, all independently written for U2. Each provides a practical goal, 3-line bilingual scenario, 3 vocabulary terms, a grammar cross-link, two deterministic exercises, a free-writing prompt, next-lesson navigation and source ID.
- **Protected canonical learner authority**: U2 feedback and temporary correct-answer counts live only in in-memory route state. No FSRS, proficiency, sessions, exam completion or mastery is written. Free writing is not stored or sent. The original text is not represented as mapped to any of Carnet's numbered positions.
- **Grammar deep dives**: enrich 9 independently authored U1 grammar guides with two worked examples, two correction notes and two further form-recall checks per guide. Reciprocal navigation from U2 lessons selects the correct original guide, and grammar guides link back to the specific U2 lesson.
- **Manual lexical review**: uses `loadVocabularySearchIndex` only on entering `#links` and the existing index hash-verification layer; it does not call foreign applications or extract legacy textbook material. Strict, accent-preserving exact French spelling yields *candidates*, including collisions, unmatched originals and incomplete sense/POS evidence. Each reviewed original U2 sense can be marked `needs-evidence`, `proposed-match` (requires selected target and written rationale), or `rejected`. Decisions exist only in memory and can be exported as an explicitly non-authoritative JSON draft. No approved equivalence or learner progress translation is possible.
- **Source-qualified loading**: U2 instructional content is dynamically loaded only with the course/grammar route and is checked against `original-owned` revision-qualified source provenance. The larger native index remains on demand, separately SHA-verified by P37D's existing content loader. No third-party HTML/PDF/text imports.

## Rights and safety

U1's 60 Carnet sessions and 72 grammar concepts remain *metadata-only*. Neither Carnet PDF/HTML prose nor French 2.2 German textbook-derived glosses, cards or translations are redistributed. The native corpus remains subject to its existing mixed-license and human release gates. Lexical surface matches do not imply sense equivalence. Manual proposed links are explicitly not approved evidence, nor are they exported into the canonical learner model.

## Focused acceptance

- Node `npm run test:vnext:u2`: 12 lesson contracts, authored provenance, cross-lesson grammar links, accents/answer grading, collisions, missing mappings, fake/duplicate link rejection, export and zero progress authority.
- Existing `npm run qualify:vnext`: includes U1 and U2 deterministic suites, typecheck, existing B7 regressions, runtime build and vNext budget.
- P37G browser: open 12 lessons, reveal translation, grade a local exercise, change lessons, follow grammar + round trip, record one manual decision and inspect the downloaded review-only export. Runs on five existing browser projects.
- Existing P37H and P35 checks continue to apply. Passing any test does *not* remove P35 original deployed-origin, data migration, human approval or release gating.

## U3 handoff

1. Editorially expand the **original** curriculum beyond the first 12 mini-lessons while keeping the 60 rights-restricted positions as unmapped references.
2. Build a source-reviewed lesson-to-grammar dependency graph, with optional sentence production hints, reversible navigation and accessibility improvements.
3. Add a manual review queue that can re-open exported sense proposals only after strict file schema checks; no automatic approval, sense merging, SRS import or authoritative progress.
4. Qualify source rights separately before any third-party corpus distribution or full cross-app migration. Production/cutover still NO-GO.
