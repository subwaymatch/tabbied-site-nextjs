---
'tabbied': minor
---

**Breaking: the `shadow` option is removed from all seven patterns that had
it** — `bloks`, `cupola`, `foliage`, `mixtape`, `odessa`, `quarterfall` and
`radius`. The toggle injected a `box-shadow`, which is the one CSS effect that
costs a design its clean SVG export: with it on, the shadow left as an SVG
drop-shadow filter that Figma and Illustrator import imperfectly.

Rather than keep a switch whose "on" state quietly degrades an export, the
effect is gone. All seven now export as clean native vector unconditionally,
which takes the clean tier from 232 designs to **239** and empties the
conditional tier entirely.

Passing `options={{ shadow: … }}` is now a no-op rather than an error — the
controller ignores option ids a design doesn't declare — so nothing throws,
but the shadow will no longer render. **`bloks` and `cupola` change
appearance by default**, since their toggle defaulted to on; the other five
defaulted to off and are unchanged unless you were opting in.

`PatternOption.svgExportNote` and the editor's per-option warning still work;
no design uses them now. A design that wants a shadow should bake it in and
take a definition-level note, as `neon`, `lantern` and `terrain` do — visible
in the catalogue rather than hidden behind a switch.
