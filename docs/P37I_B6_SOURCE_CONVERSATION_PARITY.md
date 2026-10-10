# P37I-B6 — P17–P20 Source Identity & Mission Parity

**Implementation:** stacked draft on qualified D6-B PR #21 at `3be2903d4439caf579272505f79a55fe17316a43`. **NO-GO** for production cutover.

## Original P35 source provenance

Audited the preserved P35 `index.html` on `main` (`022a815df744e740ad187554b800daffaec21701`) against:
- `V580_SCENARIOS`: **19 original scenario graphs** (14 A1–B1 and five later B2 graphs). The existing 15 newly authored vNext starter conversations map to **14** original P17 source identifiers; the standalone `neighbour` scene is native-only.
- `V590_MISSIONS`: five source P18 three-task mission chains, with the original `past-event` reused across **two** missions. Corrected native `independent-living` to use `past-problem` instead of `neighbour`, aligning all five chains to the P35 scenario **identities**, without claiming original dialogue or assessment equivalence.
- `V5110_FUNCTION_META`: 25 original P20 function names/IDs, and six later B2 reasoning functions, for 31 source definitions in the preserved final P35. The native B3 function model remains **23 independently scored functions with its own IDs**; no unverified crosswalk, score promotion, renaming, or duplicate native mastery is permitted.

The source-backed `P35_P17_GOALS` records 14 original scenario objectives and their original CEFR-labelled practice levels. The Conversation workspace presents this original learning objective alongside current newly authored prompts and points out differing labels. A source label is *not* a claim of original P35 task evaluation.

## Actual learner-visible change

- Conversation home: expandable **25 original P20 function definitions**, grouped with exact original source IDs and explicit `not independently assessed` status; a separate retained 23-function native progress map.
- Every mapped scenario and mission: P35 original source identifier and provenance disclaimer.
- Active native scenarios: expandable original P17 objective, original A1/A2/B1 label, and a visible warning that native scripted scoring may cover fewer actions.
- Completed missions: quantified original P19-style independence criteria (all 3 tasks, independent-turn ratio >=80%, no manual continuation, support <=1 and mean scripted credit >=0.55). Credits describe finite scripted practice, not general proficiency.
- Native mission `independent-living` now follows source `travel-delay → apartment-repair → past-event` identities. Existing P19 pause/repeat and P20 adaptive-set safeguards remain intact.

## Exact-head automated gates

- New `scripts/test-vnext-b6-source-parity.mts` in mandatory `npm run qualify:vnext`: original identity inventories, source chain audit, no synthetic P20 credits, strict repair support/no independence, full independent-living mission with serialization, no response transcript persistence.
- Existing mission test updated to verify historically accurate shared `past-event` source rather than incorrectly asserting all five mission chains use 15 distinct scenes.
- P37H browser: 25-item original-source display, original goal expansion, real repeat/reload, source-aware user UI, unchanged SRS/activity and no stored response.
- P37G browser: keyboard expansion, source chain visibility, mission pause/reload/resume and mobile overflow.

## Still OPEN — no false parity

The original P35 node graph includes more branches and node-specific rules than three-turn vNext scripts. The 14 source IDs and goals are preserved, but **source-identical dialogue wording/variants, graph traversal, 25-function calibrated scoring, historical imported P20 evidence, the five later B2 scenario graphs, genuine microphone/ASR confidence, and physical-device acceptance remain missing or unverified**. The current 23 native functions cannot be silently counted toward 25 source functions. User responses are not stored in the native conversation feature state.

**Release:** P35 remains production; do not merge, deploy, migrate, certify language proficiency, or mark `fullP35FeatureParity` / `productionCutover` true. Live Account, offline installed-PWA, physical devices, real-user calibration, independent human approval and reversible rollback remain OPEN.

**Next proposed phase P37I-B7:** qualified P35 source-graph execution migration and calibrated original P20 observation/evidence bridge, without weakening native practice or promoting unverified scores.
