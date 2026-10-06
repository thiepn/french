# P37D — Scalable Content Pipeline

P37D moves curriculum volume out of the application runtime.

## Current source scale

The pinned Sakana French source at Git blob 14beb3f21e908a471fe213c99ebc776bd11a5222 contains 12,000 vocabulary records spanning starter, A1, A2, B1, B2, C1 and C2.

The old P35 loader was designed around a much smaller catalog. vNext must treat content growth as deployed data growth, not bootstrap growth.

## Deterministic pinning

The builder pins both upstream commit f8f4046722e2ab661e57a0e6272802dd15eaa288 and Git blob SHA-1 14beb3f21e908a471fe213c99ebc776bd11a5222.

Before producing packs it recomputes Git's blob hash over the downloaded bytes. A changed upstream file therefore cannot silently enter a build.

FRENCH_CONTENT_SOURCE_FILE can supply an already downloaded local copy; the same blob verification still applies.

## Pack model

Vocabulary is grouped by level and divided into packs of at most 250 records.

Each emitted pack records its schema, ID, revision, level and order range. The lightweight manifest records each pack's count, byte size and SHA-256 digest.

The Vite application never imports these pack files into its bootstrap JavaScript.

The manifest itself is requested only when a content-facing route such as Learn or Words opens. Individual packs are loaded later by the feature that needs them.

Therefore increasing vocabulary from 12,000 to 120,000 records increases deployed content, not initial JavaScript.

## Future families

The same manifest boundary supports grammar, reading, listening, speaking and assessment packs. Audio and image media remain referenced assets rather than executable JavaScript or base64 bundled into the shell.

## Search

Full-corpus search will use build-time compact indexes plus a Web Worker. Words must not download every vocabulary pack just to search.

## Licensing

The upstream source aggregates material under multiple licenses. Its declared source/license metadata is copied into the generated manifest. Redistribution must continue to respect those source licenses.

## Production boundary

These generated packs are vNext build artifacts. They do not replace the live P35 content path until P37G parity qualification and P37H controlled cutover.
