---
'tabbied': minor
---

**Breaking: "artwork" is now "pattern" throughout the public API.** The project
started out making artworks and has pivoted to making patterns, mostly for
digital products — the vocabulary now matches. There are no deprecated
aliases; this is a clean break on 0.x.

| Before | After |
| --- | --- |
| `createArtwork(host, config)` | `createPattern(host, config)` |
| `hydrateArtworks({ artworks })` | `hydratePatterns({ patterns })` |
| `artworkConfigToAttributes` / `artworkConfigFromElement` | `patternConfigToAttributes` / `patternConfigFromElement` |
| `ArtworkDefinition`, `ArtworkOption`, `ArtworkConfig`, `ArtworkController`, `ArtworkSlug`, `ArtworkColors`, `ArtworkSizing`, `ArtworkBoxSize` | `Pattern…` equivalents |
| `import { … } from 'tabbied/artworks'` | `import { … } from 'tabbied/patterns'` |
| `artworks` record, `isArtworkSlug()` | `patterns` record, `isPatternSlug()` |
| `<TabbiedArtwork artwork={…} />` | `<TabbiedPattern pattern={…} />` |
| `TabbiedArtworkProps`, `TabbiedArtworkHandle` | `TabbiedPatternProps`, `TabbiedPatternHandle` |
| `data-artwork="<slug>"` | `data-pattern="<slug>"` |

Design slugs, palettes, options and rendering are all unchanged — this is a
rename, not a behaviour change. To migrate, rename the imports and the
`artwork` prop; nothing else needs to move.

`ARTWORK_ATTRIBUTE` / `ARTWORK_SELECTOR` are now `PATTERN_ATTRIBUTE` /
`PATTERN_SELECTOR`. Note that `data-pattern` is what
`patternConfigFromElement` reads, so markup emitted by an older version needs
the attribute renamed too.

The package CHANGELOG's historical entries are deliberately left alone: 0.1.0
through 0.3.0 shipped the old names, and rewriting them would make those
entries describe an API that never existed.
