# THIEPN French Unified U3 — Learning Pathways & Review-Only Connections

## Ancestry, release containment

U3 is an isolated source-only branch stacked directly on U2 draft PR #26 head `24e16106e73c567a22a874efd87520ebb5d7e80d`, inheriting U1 PR #25 and P37I-B7 PR #23. Earlier branches, main, live P35 routes/rollback, learner SRS/FSRS/CEFR, Account and database tables remain untouched.

## U2 prerequisite diagnosis and repair

The delayed U2 P37G run `38295993016` failed its lexical review test on all five platforms: U2’s own review route threw **Invalid source-local ID** for punctuation-bearing native vocabulary IDs when rendering candidate selectors, leaving the save control absent. Its earlier 12 browser cases passed on Chromium; U2 P37H `38295993104` qualified. U3 adds `safeNativeLocalId`: canonical safe native IDs remain unchanged, unsafe IDs are losslessly UTF-8/base64url encoded into namespace-safe local IDs; unrepresentable/oversized IDs abstain. The original source ID validator remains strict. Candidate identity is encoded in both crosswalk and selector, so both sides compare exactly. No native storage, import, or U2 parent branch was modified.

## Actual U3 capabilities

1. **20 accessible original lessons:** U2’s 12 authored lessons remain intact; eight independently authored A1/A2 situations are added (market, library, weather, hotel, clinic, delayed train, hometown comparison, invitation). Each has bilingual dialogue, expressions, linked grammar, exercises and ungraded free writing. Neither the original 60 Carnet positions nor German textbook content is copied or mapped as lesson authority.
2. **Prerequisite pathways:** Validated acyclic directed prerequisites for all 20 lessons, with themed everyday/travel/storytelling filters, recommended next lesson, per-lesson foundation links and a clearly identified temporary practice tally. Prerequisites are suggestions, **never proficiency gates**. Passing two authored local exercises counts only within the current route instance, not as mastery, which is unchanged and not written.
3. **Writing scaffolds:** 20 original scaffold prompts with sentence starters, vocabulary, criteria and an explicitly opt-in example. A bounded local mechanical self-check can remind users of length/punctuation only; it never claims grammar correctness or assigns CEFR/mastery. Free text remains in the active textarea only; clearing, route navigation or reload leaves no persisted response.
4. **Connected grammar:** Nine original grammar deep dives link to both U2 and U3 lesson IDs. Selecting a lesson or its grammar brings the learner to the contextual example without altering native Review or Study Session routes.
5. **Safe lexical review:** Original U2 sense IDs 001–036 are unchanged. New U3 senses are separately numbered. Existing verified native vocabulary index remains on demand; exact-form mappings are never approved. The U3 review preview parses only an explicitly selected local JSON draft (<=256 KiB, <=250 decisions), requires exact review-only schema and keys, current native content revision, original source revision, provenance-consistent source/target IDs, unique decisions, and rationale for proposed matches. Any invalid entry blocks the entire file and yields zero proposals. A learner may **keep** an individual validated proposal only as an in-memory, unapproved draft or discard it. There is no direct authoritative import, account access, permission grant, or data migration.

## Test expectations

- `npm run test:vnext:u3`: all authored records, all source rights, cyclic-prerequisite checks, no automatic mastery, original 36 legacy U2 sense IDs, collisions, unicode/punctuation native ID regressions, attacker-controlled proposals, mismatched revisions, atomic denial and no authoritative imports.
- `npm run qualify:vnext`: inherited U1/U2/B7/other tests, typecheck, production build, startup budget.
- P37G existing five-browser matrix plus U3 simulated learning path, opt-in writing hints, grammar navigation and review preview round trip. U2's original counts are updated 12->20 to reflect source-authored expansion, not removed or skipped.
- P37H and P35 inherited gates remain in force. No code/test weakening, screenshot-golden updates, release approval, deploy or merge.

## U4 next phase

Extend the course into multi-lesson guided journeys with an explicit learner-controlled, **non-authoritative** local checkpoint export, accessibility keyboard navigation, deeper error-specific practice and a human-curated candidate review gate. Before any actual production rights-based course import or equivalence approval, obtain license clearance and independently validate full original source/translation permissions and release migrations.
