---
'tabbied': minor
---

Add declarative mounting: `hydratePatterns()` reads a pattern's config off
plain `data-*` attributes and mounts every match under a root, so a static
HTML page can describe its patterns in the markup and bring them all up with
one call — no component, no build step.

`patternConfigToAttributes()` is the inverse, and `TabbiedPattern` now uses it
on its own placeholder. A server-rendered React page therefore emits exactly
what `hydratePatterns` reads, which is what lets a prerendered page be
repackaged as a framework-free template.

The attributes are readable rather than a JSON blob (`data-palette="transparent,
#C9C8C1"`, `data-options="grid: 8x12; shadow: true"`), and option values are
typed by the pattern's own option metadata rather than guessed — a
`ButtonSelectGroup` choice that looks numeric stays a string. Unknown slugs
and unparseable attributes degrade to the design's authored defaults instead
of failing.
