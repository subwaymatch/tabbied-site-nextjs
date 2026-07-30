---
'tabbied': minor
---

Add native SVG export. `controller.exportSvg()` and the React handle's
`exportSvg()` convert the rendered artwork into a true vector SVG — real
shapes, gradients, clips and masks, no `<foreignObject>` — so exports open in
design tools and scale to any resolution. Pass `{ download: true }` to save a
`.svg` file directly. Designs that paint smooth conic-gradient sweeps (which
SVG cannot represent) opt out via the new `svgExport: false` definition flag;
check `supportsSvgExport(artwork)` before offering the option. Blur, glow
shadows and blend modes export as SVG filter effects and are reported in the
result's `warnings` (they render correctly in browsers but may degrade when
imported into some design tools).

The converter (~21 KB gzipped) stays out of the main bundle: `exportSvg()`
loads it on demand through a dynamic import, and direct use is available via
the new `tabbied/svg-export` subpath (`import { doodleToSvg } from
'tabbied/svg-export'`).
