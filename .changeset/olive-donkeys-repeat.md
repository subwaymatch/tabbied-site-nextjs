---
'tabbied': minor
---

Removed the `awning` artwork.

`import { awning } from 'tabbied/artworks'` no longer resolves, and `awning` is
gone from the `artworks` record and from `ArtworkSlug`. There is no drop-in
replacement — the design is retired rather than renamed. The showcase sites that
used it now use `louvre` (angled slats) and `fluting`, which sit in the same
architectural family if you need somewhere to land.
