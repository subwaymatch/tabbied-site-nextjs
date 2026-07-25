---
'tabbied': patch
---

No transition animation on an artwork's first draw.

Artwork rules carry their own `transition`, which is what makes `redraw()` morph
one arrangement into the next. On the very first paint there is nothing to morph
from, so every cell was animating in from its unstyled state: the drawing
visibly assembled itself over ~400ms, and a page holding many artworks paid for
thousands of simultaneous transitions while it was still loading.

`createArtwork` now mutes transitions inside the css-doodle shadow root for the
first two frames of a newly mounted element, then removes the override. First
paint lands finished; `redraw()` and every later update animate exactly as
authored. No API change.
