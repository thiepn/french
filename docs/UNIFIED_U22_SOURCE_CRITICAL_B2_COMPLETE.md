# THIEPN French U22 — Complete original B2 source-critical curriculum

**Source-only completion**, continuing draft PR #48 at verified starting head `ece8ee417f78dd9a690e64fd29fe049fd1c65a26`. This completion updates the same isolated U22 feature branch. No merge, production changes, migrations, tests, build or CI have been run for the completion.

## Learner-facing scope

The complete U22 owns **15** original story/source sets: `transfer-136` through `transfer-150`. The first six (136–141) were registered before this completion. Six previously written but unregistered modules (142–147) have been integrated, and three completely new scenarios (148–150) authored.

| Range | Original learning material |
| --- | --- |
| 136–138 | Tree survival estimates; teleconsultation claims; conflicting family/ship chronology |
| 139–141 | School air measurements; dated accessible-transport conditions; drought forecasts and verified data |
| 142–144 | Bilingual poem reproduction rights; cafeteria food-waste measurement; archival access and living-person privacy |
| 145–147 | Solar cooperative financial assumptions; volunteer interpretation safeguarding; forest trail-counter failures |
| 148 | Community theatre accessibility captions: lost negation, rehearsal evidence, online-distribution consent |
| 149 | Participatory budget survey: selection bias, voluntary responses, population denominator and provisional funds |
| 150 | Meteor observation night: predicted ideal rates, heterogeneous observation intervals, weather uncertainty |

Every U22 story follows the existing `U21OriginalSourceStory` authoring adapter and contains 12 contextual vocabulary entries, 9 bilingual dialogue turns, two reusable source-owned grammar bridges, an original three-paragraph extended reading, two separately attributed fictional source documents, three reading questions, two evidence-comparison questions, two cloze prompts, one shuffled-order prompt, two dialogue comprehension recall tasks, six optional synthetic-device listening questions, three independent long-form writing prompts with French models, one ungraded oral prompt/model, and three misconception/revision prompts.

Across **all 15 U22 stories**: 180 contextual words, 135 bilingual dialogue turns, 30 grammar connections, 15 extended readings, 30 fictional evidence documents, 45 reading questions, 30 cross-source questions, 150 answer-keyed recall tasks, 90 optional listening questions, 45 authored long-writing models, 15 oral models and 45 story-specific revision guides. These are **authored-content inventories**, not evidence of learner proficiency.

## Actual source code changes

- `u21-model.ts`: identity admission expanded to original transfer sequence 121–150, retaining the exact existing prefix/qualified source IDs for earlier units.
- `u22-course.ts`: registers 136–150 in order, reuses all 229 preceding units unchanged, checks 15 story identities, sequence/prerequisites, source custody and exercise contracts. **244 original Course units** = 94 complete original A1–B1+ lessons plus 150 transfer scenarios.
- `u22-material.ts`: inherited original reading, source comparison, listening and independent-writing lookup are resolved for all U22 scenarios; **192 original connected readings**.
- `u22-revision-guides.ts`: provides contextual revisions for every U22 story, including 142–150.
- Native Course and Course's Read/Listen/Write stages use the updated U22 material contracts, with temporary, support-aware practice rather than fabricated graded progress.
- Read, Listen and Write workspaces also expose an explicit supplementary U22 source practice surface with no duplicate scheduler or score writer.
- All previously registered original source IDs and lesson ordering remain stable. The protected 60-position Le Carnet and separately owned French 2.2 content are **not** copied into this original course.

## Evidence and limitations

**NOT_TESTED:** No TypeScript check, build, CI, browser/device runtime, proof of spoken French device-TTS quality, formal linguistic editing, owner-account migration or production release verification was performed in this phase. In-memory/source claims are not real-run proof.

Existing native SRS/FSRS/CEFR writers and THIEPN Account authorization remain the sole authoritative progress paths. U22 practice cannot award formal CEFR status, calibrated speaking quality or independent academic credentials. Original fictional source examples do not constitute authoritative medical, scientific, legal or transport advice. Any UI wording about future support or completeness is limited to authoring scope.

**Release status: NO-GO.** P35 remains production. U23 should unify course/material discovery and harden shared registry traversal, rather than introducing another parallel lesson engine.
