# Unified U42 — Original CEFR Foundation Alignment and Source-Level Learning Depth

## Exact head and source custody
Parent U41 PR #68, branch `feature/unified-u41-translation-lexical-instructional-accuracy`, verified SHA `d085b32f35f1adbd5ad6a07357b03215df750961`. U42 is a separate stacked child branch `feature/unified-u42-cefr-foundations-source-depth`; neither main nor P35 production was changed.

## Diagnosed level problem and defensible repair
U13 original content declares `transfer-01..04` as `A1→A2` (revision **of foundational grammar**), `transfer-05..09` as `A2→B1`, and `transfer-10..15` as `B1 integrated`. The original U23 registry instead labeled **all** U13 scenarios `B1`, and their historic sequential prerequisite starts after `b1-42`. Reading and comparing multiple source documents, reasoning from uncertain evidence, and preparing independent responses require integrated language beyond the individual grammar construction. Automatically relabeling these long scenarios as beginner A1/A2 based only on a topic tag would make the path less honest.

U42 therefore **retains original U23 B1 integrated-task classification** and **makes source-declared grammar-transition band separately visible** in the real original Course, catalog search and self-check entry suggestions. The original `TransferScenario.level` source is authoritative for the grammar band; no new content identity or independent classification engine exists. Optional linked A1/A2/B1 source refresher lessons are topic-verified, explicitly not additional authorial prerequisites. Historic U13 `b1-42 → transfer-01 → ... → transfer-15` sequence is intact. A learner may still open any source lesson without an eligibility or CEFR gate.

This follows the Council of Europe's CEFR Companion volume (2020) emphasis on distinct communicative activities and mediation rather than reducing competence to a grammar topic: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors . This is original course editorial positioning, **not** Council of Europe course certification.

## Committed original educational depth
- 20 existing lessons deepened: `a1-05–08`, `a2-05–08`, `a2-19–22`, `b1-01–08`.
- **40 new original French/English grammar examples**, one extra example for **each** existing grammar explanation (two per lesson), spanning everyday services, family, personal narrative, job/leisure contexts, shopping, reported speech and realistic conditional decisions. Original grammatical explanations, prior bilingual examples, vocabulary, dialogue turns, source IDs and exercises remain intact.
- **20 new specific independent-revision criteria** in the existing original writing activity. Learners revise agreement, register, tense-aspect, pronoun reference, source attribution, audience and justified conclusions, rather than simply copying the model response.
- **Five U13 original real-world transfer writing contexts** on market promotions, meeting confirmations, headphones/exchange enquiries, disrupted bus journeys and comparing bicycle cost listings; these are independent alternate applications after the original original-source task, not new grading engines.
- **Three Early B2 original source-based cases** `transfer-148–150` gained six deeper evidence-interpretation feedback texts distinguishing claims from observed data, full French negation, bias and observation limits, plus three audience-specific writing/independent-transfer prompts.
- **Existing U13 TypeScript model validation defect** in `u13-transfer-model.ts` repaired by preserving the literal `A1TaskType` union for required task kinds, without changing content or native grading.
- Original Course lesson headers and U27 self-check suggestions now explain the B1 / A1→A2 distinction and expose earlier authenticated source-qualified foundation lessons. No grade inferred from choosing a source or matching an authored practice key.

## Coverage and preservation
Original 94 full lessons, 150 transfer scenarios (244 source units) and 192 connected readings, source-qualified historical IDs, all original task IDs, P35 learner migration, U40 canonical FSRS/SRS and native Review/undo, U41 translations, THIEPN Account, rights and original private draft boundaries are preserved. No new independent engine, store, CEFR score, speech grade, source body duplication, cloud writer or auto-saved essays.

## Qualification
`scripts/test-vnext-u42.mts` checks the exact 244-unit / 192-reading inventory, 15 original source grammar bands versus B1 integrated-task difficulty, historical prerequisites, real optional lesson links, 40 new bilingual grammar examples, 20 revision criteria and eight alternative independent-source writing prompts.

Source inspection and actual GitHub commit ancestry verify intended changes, but file existence and static checks are **not** equivalent to executing Node, TypeScript, or a browser.

**Known inherited blocker:** U41 exact-head P37H, P37G and P37 runtime qualification failed TypeScript with 69 diagnostic lines, mostly in U30–U34 nullable source panels, plus U36 contract and U22 writing unions. U42 fixes only the directly relevant U13 typed-kind diagnostic; it does not claim to fix those inherited panels. No PASS, CEFR recognition or native session acceptance can be inferred. Mark exact-head CI, focused tests and browser status from actual workflow results; **release NO-GO** until qualified.

## Next U43
Deepen content quality across all source sections with a consistent editorial rubric and targeted misconception repairs. Prioritize weak real original A1–B2 source evidence and authentic speaking/writing practice without another parallel studio; separately schedule inherited vNext TypeScript/mobile/browser qualification.
