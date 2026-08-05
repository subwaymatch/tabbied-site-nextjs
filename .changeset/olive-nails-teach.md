---
'tabbied': minor
---

Honour `prefers-reduced-motion` for the designs' own cell transitions, not
just the ambient redraw timer.

Every design carries a ~400ms `transition` — that is what makes a redraw morph
into the next arrangement instead of cutting. Only the `redrawInterval` timer
was gated, so the transitions still fired on every re-render, including ones
nobody asked for: `fit: "grid"` and `fit: "cover"` re-derive their grid on
resize, so turning a phone or dragging a window animated every cell on the
page. That is exactly the passive motion the preference exists for.

Under `prefers-reduced-motion: reduce` the controller now mutes those
transitions for its whole life, using the same shadow-root override that
already suppresses the first paint. Anything that re-renders — a resize, a
`redraw()`, an option or palette change — cuts to the new arrangement. Nothing
is lost: the pattern renders identically, it just stops easing between states.

The preference is also now **observed rather than read once**. Previously
`syncRedrawTimer` only re-checked it on a config change, so toggling the OS
setting mid-session left a running timer ticking. A `change` listener on the
media query now re-syncs the timer and toggles the override, and is removed in
`destroy()`.

No API change — this needs no configuration and no new props.
