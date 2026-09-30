# French3000 P6 — Smart Words, Search & Vocabulary Discovery

Date: 2026-09-30  
Release: v4.7.0 — P6 Smart Words, Search & Vocabulary Discovery  
Baseline: v4.6.0 P5 Progress & Vocabulary Intelligence

## Goal

P6 turns Words into the everyday vocabulary workspace.

The app already contained advanced query syntax, family metadata, custom lists, smart decks, and memory diagnostics. P6 surfaces those capabilities in a simple interface instead of creating another parallel system.

## Implemented

### 1. Ranked, typo-tolerant search

Plain-language search is now:

- accent-insensitive
- ranked by relevance
- weighted toward exact French matches
- aware of English meanings
- aware of lemmas
- aware of aliases
- aware of word families
- tolerant of small spelling errors for terms of four or more characters

Existing structured query filters remain exact and deterministic.

### 2. Search ranking

When the normal Frequency sort is active and a text query exists, results are ranked by:

1. exact French match
2. French prefix
3. French substring
4. lemma/family match
5. alias match
6. English meaning match
7. fuzzy spelling match
8. catalog frequency as a tie-breaker

Other explicit sort choices still win.

### 3. Skill-aware query language

The existing search language now also understands:

- `risk:high`
- `risk:medium`
- `introduced:true`
- `secure:recognition`
- `secure:production`
- `secure:balanced`
- `skill:listening`
- `skill:spelling`
- `skill-due:production`
- `gap:production`
- `gap:listening`
- `gap:spelling`
- `gap:article`
- `family-size:2`

These filters also become available to existing smart decks because P6 extends the authoritative query filter engine.

### 4. Discovery chips

Words now exposes one-tap discovery views for:

- All
- Due
- Weak
- Production gaps
- Listening gaps
- Families
- Unseen
- Starred

These are ordinary live filters, not separate datasets.

### 5. Skill visibility in every result

Each vocabulary result shows compact live state for:

- Recognition
- Production
- Listening

Each chip reports current recall where the skill has started and visually distinguishes secure, due, learning, and unstarted states.

### 6. P2 memory risk in Words

Reviewed words display the same P2 weakness risk used by queue priority and P5 intelligence.

Words therefore no longer invents a separate "difficulty" definition.

### 7. Family discovery

Words with related forms display a direct **N related** action.

Opening it searches the existing catalog family key and groups the family together.

The word-details dialog also exposes a **Browse all related forms** action.

### 8. Frictionless custom-list creation

Every result has a **+ List** action.

The compact list dialog supports:

- adding to an existing custom list
- seeing whether the word is already present
- creating a new custom list
- immediately adding the word to the new list

No trip to Settings or Studio is required.

### 9. Save any search as a smart deck

Current search text plus active level/status/topic/POS/quality/custom-list filters can be saved as a live smart deck.

The smart deck continues to resolve dynamically against the current vocabulary and progress state.

### 10. Practice search results

**Practice results** starts a practice-only session from up to 30 current matches.

This is intentionally practice-only so browsing and discovery cannot accidentally reschedule FSRS reviews.

### 11. Richer word details

The existing word dialog now gains a Skill Intelligence section with:

- recognition recall
- production recall
- listening recall
- spelling recall
- article/gender recall where applicable
- secure/due/building/not-started state
- P2 memory risk
- dominant repair diagnosis

The existing language, example, memory, note, list, audio, editing, star and suspend controls are preserved.

### 12. Management mode preserved

The existing full management table remains available through **Manage catalog** for bulk editing, quality auditing, tags, flags, importing, and administrative operations.

The normal Words page stays focused on finding and using vocabulary.

## Preservation

P6 does not replace or reset:

- P1 catalog content
- P2 scheduler or weakness model
- P3 study flow
- P4 audio system
- P5 vocabulary intelligence
- stable note/skill IDs
- review history or due dates
- custom lists
- smart decks
- user cards
- backups

The PWA shell cache moves to v9.

## Verification

Before commit:

- production JavaScript syntax compilation: PASS
- service-worker syntax compilation: PASS
- P1 fingerprint retained
- P2 risk model retained
- P3 study UX retained
- P4 audio retained
- P5 skill intelligence retained
- fuzzy ranked browse search present
- advanced query engine extended
- discovery chips present
- word-family discovery present
- custom-list quick add/create present
- smart-deck save present
- result practice is practice-only
- management mode preserved

## Next phase

**P7 — Context, Examples & Real-World Vocabulary Depth**
