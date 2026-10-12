# THIEPN French Unified Platform — U1 Foundation (source-only, NO-GO)
## Baseline
Stacked directly after draft P37I-B7 PR #23 at 74dc6fcf8eaa1b1b7a0ef6ea9f3d92625d5ee31f. Parent chain: main 022a815d -> P37H #19 -> D6-A #20 -> D6-B #21 -> B6 #22 -> B7 #23 -> U1. No upstream PR modification, main changes or production deployment.

## Source custody / rights
The four pinned source revisions are declared in app/src/core/unified/source.ts. Immutable references append the full pinned commit SHA to a source-scoped stable identifier. IDs do not imply equality of lexical meaning. Every source is rights-held for U1: canPublishRaw=false and canPublishDerived=false. No PDFs, German textbook cards, course prose, reader texts, examples or original grammar explanations are copied into deployable source. Source: thiepn/french-a1-a2 index.html blob bff302c2d1ec594ddcff5dda8ccc4d331c1b0afb. Declared PDF blob b82df52fd3d9d883a662fbad309c7183a92a89c1 remains unverified at original-byte SHA-256 and rights level.

## Course and grammar modules
- 12 units; metadata-only 60 sessions with exact source IDs, lesson/review kind, four sublevels, 48/12 count, six cumulative MOD checkpoints at S10/S20/S30/S40/S50/S60, declared PDF page numbers, and 72 grammar-reference IDs with lesson relationships.
- Two lazy routes: #course?session=S01..S60 and #grammar?id=GRM-xxx. Feature-specific CSS; no reference-content download in boot or route. No progress/FSRS/CEFR writes from these routes.
- Future U2 content packs must carry source origin/commit/blob, source-specific rights and explicit publish approval before activation.

## Crosswalk
Normalized French surfaces are only candidate matches. A single spelling match does not establish word-sense identity. Multiple targets are AMBIGUOUS. Automatic merges are always false. An explicitly reviewed source-target sense link is only an advisory predicate; there is no canonical mutation or progression credit in U1.

## Legacy migration preflight
- read-only user-provided JSON inspector previewLegacyImport(text,source); no actual foreign-origin browser storage access or production user records.
- LCF source key fr-a1a2-practice-v6, schema 1, bounded 60-session course position.
- F22 source key french_flashcards_L15_28_v1, numeric card IDs; no SM-2-like interval conversion into FSRS.
- Maximum 8 MiB and bounded depth/number of parsed nodes; malformed schemas, unsafe object keys, invalid numeric IDs and oversized snapshots rejected.
- Output is counts/errors/warnings and SHA-256, never raw learner responses; safeToWrite is permanently false in this phase.
- No old data deleted; cannot modify P35/vNext SRS/CEFR, THIEPN Account snapshots or Languages Hub.

## Tests
- test:vnext:u1: source/session invariants, 72 grammar records, checkpoints, release locks, lexical collisions, negative import cases and read-only preview behavior.
- test appended to existing P37G Playwright suite for actual compiled Chromium/Firefox/WebKit/Android/iOS navigation, rightshold and no original-course PDF network load.
- Full existing qualify:vnext remains required. Check exact-head CI results before claiming PASS.

## Explicit blockers
P35 scored graph/assessment parity, original PDF SHA-256/rights, coursebook-derived content redistribution authorization, reviewed sense concordance, actual multi-app user migration, production OAuth/live sync, real hardware speech/PWA and rollback signoff all remain open. ProductionCutover=false and fullP35FeatureParity=false remain unchanged.

## U2 handoff
Integrate independently rights-qualified course explanations, lesson-linked examples, graded inputs and practice as SHA-256 validated, lazy, license-aware packs. Prove all 60 source page references against original PDF, source identity and quality; leave any unapproved content locked. Do not invent missing material or award unsupported learner evidence.
