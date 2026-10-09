# P37I — P35 feature parity inventory (first audited tranche)

Source of stable feature contracts: the P1–P16 phase files, `docs/P18-real-world-missions.md` through `docs/P27-curriculum-audit.md`, `docs/P28_FUNCTIONAL_FLUENCY_BENCHMARKS.md` through `docs/P36_POST_RELEASE_MAINTENANCE.md`, and the preserved P35 `index.html`. Evidence for vNext comes from actual modular route and engine files in `app/src/` and tests; document descriptions do **not** certify all runtime behavior.

**Status:** Partial; full P35 feature parity **not approved**. This is a code-inventory audit. A live study and migration pass is still required. All classifications are deliberately conservative.

Legend: **Native** = an implementable core path exists with automated acceptance; **Partial** = some key behavior works, but full stable contract is not demonstrated; **Missing native flow** = historical state may be retained during migration but learner cannot perform the P35 interaction in vNext; **Administrative hold** = release-only checks.

| P35 contract | vNext implementation evidence | Audit result | Remaining concrete obligation |
| --- | --- | --- | --- |
| P1 vocabulary corpus | `core/content/loader.ts`, on-demand packs, `routes/words.ts` | **Partial** | Compare stable catalog IDs, senses, examples and edits on a fixture |
| P2/P3 review, scheduled SRS and low-friction study | `core/learner/{repository,scheduler,queue,session}.ts`, `routes/review.ts` | **Native core, partial total** | End-to-end review/undo/resume equality with P35 |
| P4 audio mastery | `routes/review.ts`, `routes/listen.ts` | **Partial** | Source-specific audio practice, fallback and audio/evidence parity |
| P5 progress intelligence | `routes/progress.ts` | **Partial** | Cross-skill and longitudinal strength parity, not only vocabulary analytics |
| P6 smart vocabulary tools | `routes/words.ts` | **Partial** | Saved filters, edit/delete, custom cards/decks and bulk workflows |
| P7/P8/P9 THIEPN Languages/Hub read model | P35 compatibility code retained, no complete native vNext Hub exporter verified | **Missing native flow** | Rebuild account-scoped projections without exposing raw learner responses |
| P10 verified usage construction | C2's 67 verbatim P10 source frames plus C3 `core/usage/mastery.ts` usage counts, 3-attempt/80% threshold, 60-day refresh, independent-evidence checks, cumulative ledger, adaptive ranking and repair | **Partial — P37I-C3 mastery** | Exact P35 source-linked vocabulary readiness, natural usage application and full legacy history calibration still need end-to-end parity; provenance labels are inherited, not independently reverified |
| P11 phrase transfer | C3 source-frame recall remains isolated; C5 adds 16 newly authored actual-situation sentence exercises covering eight P10 constructions, with separate contextual evidence across two distinct situations, exact-model checks and manual alternatives | **Partial — P37I-C5 contextual production** | The contextual exercises are new, not source-identical P35 P11 content; exact model matches are not comprehensive semantic scoring. Scheduled-vocabulary production prerequisites and unambiguous canonical sense-ID mapping remain unverified |
| P12 sentence transfer | `core/content/sentence-diagnosis.ts`, `routes/speak.ts`, `routes/write.ts` with all 36 original P12 exercises and C4 atomic, practice-only writing evidence | **Partial — P37I-C4 writing integrity** | The writing cursor and evidence now commit together; only exact unassisted answers receive objective credit. Full scoring equivalence, longitudinal context variation, user-verified semantic alternatives and source-matched modes remain open |
| P13 mixed retrieval and durability | `core/learner/{adaptive,queue,scheduler}.ts` | **Partial** | Mixed skill quotas, history and edge-case review equivalence |
| P14 graded reading | `routes/read.ts`, 25 extracted texts | **Native core, partial total** | Full independent comprehension and source/evidence equivalence |
| P15 contextual listening | `routes/listen.ts`, Read↔Listen pairing | **Partial** | Full support-aware scoring and difficulty/adaptive sequencing |
| P16 spoken production | `routes/speak.ts`, 36 sentence exercises, recording | **Partial** | All stable transfer and feedback modes; physical speech-service acceptance |
| P17 guided conversation | `core/conversation/{engine,scenarios,variants,storage}.ts`, 15 newly authored scenes with 45 alternative partner prompts, repeat/clarification metadata, deterministic matching and resumable turns | **Partial — P37I-B5 robustness** | Import source-identical P35 scenario scripts and fully calibrated open response handling; the new alternative prompts do not make the scripted matcher a natural-language evaluator |
| P18 real-world missions | `core/conversation/missions.ts` has five new three-scenario chains; mission-aware engine, UI, resume and pass evidence | **Partial — P37I-B2 native missions** | Preserve full original P35 P18 wording/variant rotation, function-aware task recommendations and calibrated breadth parity |
| P19 communicative calibration | `core/conversation/{engine,curriculum,variants}.ts` preserves prompt variant and repeat moves, records no credit for a repeat alone, and tests cross-variant confidence; B4 validates imported evidence | **Partial — P37I-B5 repeat calibration** | Original P19 ASR confidence and complete P35 variant/repair rule parity remain absent |
| P20 communicative function profiles | `core/conversation/curriculum.ts`, privacy-minimal `functionEvents`, confidence-damped 23-function map, ranked scenarios/missions and resumable three-task adaptive set | **Partial — P37I-B3** | Source-identical 25-function P20 taxonomy, variants/context confidence and real functional mastery calibration are still absent |
| P21 open-world French input | No native open-world capture workflow | **Missing native flow** | Source links, private aggregate exposure, learner consent and source limits |
| P22 cross-skill Study Coach | `core/learner/study-coach.ts`, `routes/home.ts`; newly launchable/resumable native Conversation | **Partial, P37I work** | Native launch history, actual cross-skill transfer dependencies, full P35 activities once rebuilt |
| P23 adaptive session composition | `core/learner/study-session-builder.ts` and exclusive native three-conversation adaptive sets | **Partial** | Cross-skill multi-activity composition, session ownership, full P35 orchestration |
| P24 longitudinal mastery | `routes/progress.ts` has FSRS/current recall | **Missing full longitudinal flow** | Proper 30-day strength and historical trend with evidence confidence |
| P25 CEFR promotion gates | Historical promotions migrated, but no seven-gate native awarding | **Missing native flow** | Lexical, productive, reading, listening, speaking, interaction and mission gates |
| P26 targeted remediation | `routes/progress.ts` weakness ranking | **Partial** | Launchable remediation prescription and objective completion evidence |
| P27 curriculum integrity audit | `scripts/verify-vnext-*.mjs` covers modular basics | **Partial** | Coverage of P17–P26 native scoring and consistency |
| P28 functional fluency benchmark | Legacy result preserved, no native benchmark runner | **Missing native flow** | Calibrated multi-scenario evaluation with prerequisite gates |
| P29 fluency maintenance | Historical state preserved | **Missing native flow** | Decay/revalidation cycle and explicit maintenance scheduling |
| P30 B2 source corpus and benchmark | P35 legacy bank preserved; native P14 reading pack is A1–B2 | **Partial** | Qualified source bank and B2 task launch/check |
| P31 B2 open production | No native long-form B2 calibration runner | **Missing native flow** | Six-axis offline evaluator with abstention and retained metadata only |
| P32 integrated-skills capstone | No native paired B2 reading/listening capstone | **Missing native flow** | Source transfer and anti-copy constraints with P31 prerequisites |
| P33 spontaneous oral assessment | `routes/speak.ts` is practice, not calibration | **Missing native flow** | Two-prompt 20s prep ASR-confidence-aware protocol after P31/P32 |
| P34/P35/P36 production quality | Existing P35 live gate, vNext CI, migration fixture | **Administrative hold** | New live release marker, physical UX and rollback rehearsal |

## Next implementation groups (do not reorder prerequisite dependencies)

- **P37I-B — P17–P20 native interaction:** source-accurate deterministic conversation, mission chains, repairs and functions. Required for P25/P28.
- **P37I-C — P10–P12 usage and transfer:** preserve authored answers only when explicitly required and maintain correct scheduled/practice evidence ownership.
- **P37I-D — P21–P27 orchestration, promotion and longitudinal remediation:** complete cross-mode evidence and explainable CEFR gates.
- **P37I-E — P28–P33 B2 assessment:** P31 → P32 → P33 → P28 gating, then P29 maintenance. No simulated model scores or unsupportable speech/accent claims.
- **P37I-F — P7–P9 Hub contracts, release and device qualification:** privacy-minimal projections, full P35 migration/backup, real Account sign-in, installed-PWA/OS speech tests, rollback and explicit cutover PR.

This inventory is a tracking tool, not a numerical completeness score. An existing migrated field does not mean its UI or scoring semantics have been reimplemented.
