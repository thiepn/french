# U49 source-verified P35 legacy deck compatibility

Pinned **P35 main** `1970e1c583b125b65abc30d618b89c7a95b8d0f8`:
`index.html` contains `normalizeCustomDecks`, `createCustomDeck`, `renameCustomDeck`, `addCardsToCustomDeck`, `startCustomDeck` and `migrateStarterCustomDecks`.

Original deck record: `{name:string, cardIds:string[], createdAt:number}`, keyed by a preexisting ID (usually `deck-…`). Source normalization accepts 30 original deck records, 3,000 unique card IDs per record, title length 60, ID length 80, member ID length 180, and rejects prototype keys. Both original corpus IDs and user card IDs may be present. Historic `starter:...` IDs were remapped only where a source-stable word match existed.

U49 retains this exact stored original object/ID. Validated original records are visible in Words beside namespaced U49 decks. Editing name/member lists rewrites only the matching original fields, not the card IDs. Unresolved original IDs remain visible and preserved rather than silently removed; they are excluded from native Review until an original canonical ID can be verified against the source vocabulary index. The original native FSRS, pacing and session resume are reused. No automatic legacy deck conversion, CEFR grade conversion, score import, cloud publication or production migration is performed.

U49 also supports batch editing the existing private user-card `theme` field in one owner-store transaction. Original corpus cards and review/SRS records are not edited by this operation.

**Remaining boundaries:** Full historical starter-ID matching, richer P35 browse filtering/sorting, custom-deck semantics involving every past P35 user-card field and cross-device acceptance require further qualification. No edit is performed to a malformed or unknown deck record.
