---
'tabbied': minor
---

Move the ambient-redraw timer into the framework-free core. `createPattern`
now accepts `redrawInterval` and `paused`, along with the gates that used to
live in the React component: the effect switches off entirely under
`prefers-reduced-motion`, and drops ticks while the tab is hidden or the host
is scrolled out of view. `paused` is read at tick time, so pausing and
resuming preserves the redraw phase instead of restarting the cycle.

`TabbiedPattern`'s `redrawInterval` / `paused` props are unchanged — they now
pass straight through to the controller — so React consumers need do nothing.
Vanilla consumers get animated patterns without reimplementing the timer.
