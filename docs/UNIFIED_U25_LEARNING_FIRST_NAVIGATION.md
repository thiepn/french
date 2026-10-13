# THIEPN French U25 — Learning-First Course Navigation

**Source-only implementation, new U24-child development branch.** Starting head verified exactly as `36a6e31401711689b0f70a1eb4b20d06a97089b8` on U24 draft PR #50 `feature/unified-u24-recoverable-learner-work`. U25 does not modify the parent, earlier stacked drafts, `main`, P35 production, historical source IDs, database migrations, credentials, or paid services.

## Working learner-facing source changes

### Start / continue without claiming mastery
- Original Course opens on a clear **Start from A1 / Continue selected lesson** action. A U24 **source-validated** saved checkpoint takes priority as **Resume verified lesson** only when the checkpoint status is `ready`; clicking it is an explicit resume, not an automatic jump. A stale/blocked checkpoint never silently resumes, overwrites, or receives a fabricated completion claim.
- Quick entry into **native Review** uses the existing authoritative route; this original practice has no due queue, proficiency score, CEFR approval, SRS writer, or tracked academic completion.
- The current original lesson remains explicit, and changing pathway/lesson does not imply mastery or promotion. Optional U24 navigation bookmarking continues under its original opt-in, CAS, source-version and privacy contract.
- Course navigation and stage buttons move keyboard focus toward the selected lesson; unsent original writing remains temporary and existing U24 external-exit protections are retained.

### Five coherent pathways driven by the actual registry
- `app/src/core/unified/u25-pathways.ts` derives actual **A1, A2, B1, B1+, Early B2** pathway cards, available reading counts, stable original section identifiers, 12–15-lesson chapters and section descriptions from **existing original U23 registry entries**. The cards do not create a new curriculum or eligibility gate.
- A pathway selection filters discovery to the corresponding authored level and opens the correct first original lesson. Source-derived chapter groups present the actual lesson IDs and teaching goals, not hard-coded historical jump sequences.
- The Course lesson browser is collapsed by default, but remains available as an accessible disclosure with filtered search, material facets, bounded paging and named chapter sections. Relevant current lesson and current chapter remain discoverable; keyboard arrow navigation only visits visible chapter buttons.
- The selected lesson's **available next activities** come from its source registry: original recall, linked reading (when present), authored dialogue listening, authored independent writing and the next unit. These are availability suggestions, not performance-based AI study recommendations.

### Cross-workspace continuity and a quieter Course
- Existing U23 handoffs to native Read/Listen/Write remain context-specific, source-qualified and **in-memory only**. No draft, score, recorded audio or hidden SRS evidence travels with the handoff. The original learning panel never claims to grade meaning, pronunciation or writing quality.
- The top Course page now introduces the learning choice succinctly; 60 rights-restricted Le Carnet positional references, supplementary micro-lessons and the local legacy JSON export preflight are retained under a collapsed **Other original teaching** section.
- The original supplementary micro-lesson bundle is loaded only when that disclosure is opened. No legacy rights-restricted lesson body or Learner history is imported into the original material system.
- Home now offers a secondary original Course entry for new learners without replacing native due-review priorities or eagerly loading the original 244-unit source corpus.
- Responsive UI uses the current application's typography/tokens and provides compact cards, single-column mobile actions, accessible `details/summary` chapter navigation, visible keyboard focus and 44px+ targets.

## Source and data boundaries
Original registry counts remain **244 original Course units** and **192 authored connected readings**; they are inherited U22/U23 source inventories, **not newly run runtime or compliance acceptance**. Canonical FSRS/SRS/CEFR, THIEPN Account, existing original U24 CAS checkpoint and historical qualified material IDs remain untouched. U25 does not introduce new storage, new scoring, new learner authority, new scheduling or auto-persistence of unsent drafts.

Path labels describe authors' intended sequence, **not official CEFR certification**. Original practice correctness remains ephemeral. A saved U24 checkpoint is only a navigation position and may be invalidated by source/content changes.

## NOT_TESTED and release boundary
**NOT_TESTED**: TypeScript compilation, build, CI, any automated test, browser or physical-mobile acceptance, device TTS, real owner Account state, offline behavior, accessibility qualification, professional French editorial review, source rights audit, P35 parity and production release. **NO-GO** for release. No tests, builds, CI, audits, migrations, merges, deployments, credentials or paid services were initiated for U25.

## U26 handoff — Contextual Grammar Progression and Misconception Repair
Continue as a **separate U25-child stacked draft**, implementation first. Reuse original source-qualified grammar blocks, current Course/Read/Listen/Write flow, U23 registry and U24 continuity. Build substantial lesson-linked grammar contrast, staged application, retrieval, independently answerable misconception repair and context-aware follow-up. Keep feedback source-grounded and practice-only unless using existing authorized native attempt writers; never create a parallel assessment, score, mastery store, self-certified CEFR gate or duplicate progress authority.
