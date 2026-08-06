---
'tabbied': minor
---

Fix three silent-wrongness bugs in the core, and expose `controller.destroyed`.

- **SVG export of a `fit: "cover"` pattern was silently distorted.** The
  measurement pass neutralizes transforms with a style injected into the
  shadow root, which can never match the host `<css-doodle>` — where the
  cover fit puts its `translate(...) scale(...)`. Measured geometry came back
  scaled while computed px lengths (border widths, corner radii,
  pseudo-element sizes, shadow offsets, transform origins) stayed unscaled,
  and the export mixed the two without error. The host transform is now
  neutralized during measurement and restored afterwards; cover-fit exports
  come out at the render box's native resolution.
- **A config-driven grid change re-introduced sub-pixel seams.** `update()`
  with a new `cellSize`/`density` re-rendered the grid but never re-snapped
  the canvas to the new track count, leaving every cell boundary fractional
  until the next container resize. `reconcile()` now re-snaps.
- **`hydratePatterns()` could never re-hydrate an element after
  `controller.destroy()`** — it kept returning the dead controller, so the
  documented teardown-and-rehydrate recipe left the page blank. Controllers
  now expose a readonly `destroyed` flag (the new public API in this
  release), and hydration replaces dead controllers.
- **A bare Slider entry in `data-options` (`frequency:`) parsed to `0`**
  — usually below the option's minimum — instead of falling back to the
  authored default as the attribute contract promises.
