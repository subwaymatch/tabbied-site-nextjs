---
'tabbied': minor
---

Artworks are never distorted to fit, and the box they render into is now part of
the API.

**`fit="stretch"` is removed (breaking).** It was the one strategy that scaled an
artwork by a different factor horizontally than vertically — keeping the authored
grid and letting cells deform with the container. Nothing does that any more:
`grid` re-derives the cell grid so cells stay near-square at any box shape,
`cover`/`contain` scale a render uniformly, and `fixed` draws at an explicit
canvas size. Passing `"stretch"` now falls back to the artwork's default fit and
logs what to use instead.

**Box props.** An artwork has no intrinsic size, and until now the wrapper had no
size either — `<TabbiedArtwork artwork={radius} />` rendered a zero-height box
unless you also passed `style`. The box is now addressable directly, and **fills
its container by default**:

```tsx
// .panel is 100% wide and 400px tall; the artwork fills it.
<div className="panel">
  <TabbiedArtwork artwork={radius} />
</div>

// Or bound it, with no sized parent involved.
<TabbiedArtwork artwork={radius} maxWidth={960} aspectRatio={3 / 2} />
<TabbiedArtwork artwork={radius} height="40vh" maxHeight={520} />

// Or hand sizing back to CSS.
<TabbiedArtwork artwork={radius} fill={false} className="hero-art" />
```

- New props: `fill` (default `true`), `maxWidth`, `maxHeight`, `aspectRatio`.
- `width`/`height` now accept a CSS length as well as a px number, and size the
  box under every fit. Under `fit="fixed"` the numeric form still sets the canvas
  resolution, so existing `fixed` usage is unchanged.
- They resolve to inline styles on the wrapper, server render included, so the
  box is correct before the artwork mounts — no layout shift.
- The core API gets the same thing as a pure helper: `resolveBoxStyle(size)`
  returns the CSS to assign to your own host element.
