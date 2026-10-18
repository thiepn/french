# THIEPN French U23 — Unified Course & Material Registry

**Implementation-first, source-only.** Separate U22-child branch starting at exact verified U22 PR #48 head `cdc0445719a99a505d3fac5b8dd11aba0a957c06`. Preserve all earlier draft stacks, P35 production, main, source IDs, THIEPN Account and canonical native learner writers.

## Working source functionality

- **One original source registry** (`app/src/core/unified/u23-registry.ts`): indexes the unchanged 244 original Course units and 192 connected reading references from the U22 authoring chain. Qualified source IDs/revisions, original-owned rights, unique IDs, and original linked reading custody are enforced. This is an in-memory reference index, not a duplicate corpus or learner store.
- Maps provide direct ID/qualified-ID and reading retrieval; authored reading, source evidence, listening, oral and production material reuse the established U22 adapters. Derived lesson metadata and accent-insensitive search cover titles, goals, French and English vocabulary, grammar headings and reading names.
- Browse by A1, A2, B1, B1+, early B2 or all, and by available connected reading, dialogue/listening, writing or paired-source comparison. Result pages show only a bounded number of entries until the learner requests more.
- **Course workspace:** new usable search/level/material controls, visible result counts, 60-at-a-time browsing, current selection pinned even when filtered out, existing level shortcuts, source-qualified labels and previous/next controls. Filtered list keyboard selection now follows actual visible lesson IDs instead of an unrelated original array index.
- **Read/Listen/Write:** the existing original U22 practice panel has been generalized **in place** to a shared original-source practice surface covering eligible material across the full curriculum. Original passages, comparisons, source explanations, dialogue listening, and independent writing models are selected through registry references. Existing native non-Course learning workspaces continue to manage their own qualified progress independently.
- **Cross-workspace links:** Course ↔ Read/Listen/Write source-qualified handoffs use one-use in-memory lesson IDs and optional Course stage. No localStorage, sessionStorage, IndexedDB, cloud or duplicate progress writer is introduced. A Read link is offered only if the original lesson actually has connected reading.
- Keyboard-visible controls, responsive search/filter layout and touch-size actions are supplied using existing visual tokens and mobile conventions.

## Boundaries and limitations

The registry's level labels organize existing authored material, not independently validated CEFR proficiency. Original practice completion, synthetic TTS, open writing models, and navigation do not award grade or mastery. Unsent writing drafts remain temporary; exact resume, explicit discard, consent, source revalidation and interrupted-work transitions belong in **U24**.

The original Le Carnet Français and French 2.2 materials remain metadata-only unless independently authorized; no protected lesson bodies or historical learner state are imported.

**NOT_TESTED:** No TypeScript/build/CI, tests, browser/mobile runtime, language editorial review, Account round-trip, accessibility acceptance, full P35 parity or production/release qualification were performed. Source-only implementation does not prove compiled/runtime behavior. **Release NO-GO**, P35 production unchanged.

## Next U24

Implement recoverable learner work and explicit resume/discard across Course stages and original exercises using the existing authorized state owner, with a clearly limited, consent-aware policy for writing and speech drafts. Do not invent new progress stores or conflate original practice with qualified FSRS/CEFR evidence.
