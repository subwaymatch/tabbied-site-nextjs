# tabbied

Generative artworks as data: a framework-agnostic core plus a React component,
powered by [css-doodle](https://css-doodle.com/). Render any of Tabbied's
preset designs (or your own definition) at any size, reseed them, and export
them to PNG.

Try the designs at [tabbied.com](https://tabbied.com).

## Install

```bash
npm install tabbied
```

React is an **optional** peer dependency — you only need it for the `tabbied/react`
entry point. The core works in any framework (or none).

## Entry points

| Import             | What it provides                                                                        |
| ------------------ | -------------------------------------------------------------------------------------- |
| `tabbied`          | The framework-agnostic core: `createArtwork`, sizing/seed helpers, and the type definitions. |
| `tabbied/react`    | The `TabbiedArtwork` React component (and its handle/prop types).                       |
| `tabbied/artworks` | The preset `ArtworkDefinition`s (import individually) plus the full `artworks` record.  |

## React

```tsx
import { TabbiedArtwork, type TabbiedArtworkHandle } from 'tabbied/react';
import { radius } from 'tabbied/artworks';
import { useRef } from 'react';

export function Example() {
  const ref = useRef<TabbiedArtworkHandle>(null);

  return (
    <>
      <TabbiedArtwork ref={ref} artwork={radius} seed="k9Pz" height={320} />
      <button onClick={() => ref.current?.redraw()}>Redraw</button>
      <button onClick={() => ref.current?.exportImage()}>Export PNG</button>
      <button onClick={() => ref.current?.exportSvg({ download: true })}>
        Export SVG
      </button>
    </>
  );
}
```

### SVG export

`exportSvg()` converts the rendered artwork to a **native vector SVG** — real
`<rect>`/`<path>`/gradient elements, no `<foreignObject>` — so the file opens
in design tools and scales to any resolution. It resolves with
`{ svg, width, height, warnings }`; pass `{ download: true }` to also save a
`.svg` file. A few designs paint smooth conic-gradient sweeps that SVG cannot
represent — they set `svgExport: false` on their definition, and
`supportsSvgExport(artwork)` tells you whether to offer the option. Effects
exported through SVG filters (blur, glow shadows, blend modes) render
correctly in browsers but may degrade when imported into design tools; such
cases are listed in `warnings`.

The converter itself (~21 KB gzipped) is **not** part of the main bundle:
`exportSvg()` loads it on demand via a dynamic import, so apps that never
export pay nothing for the feature. To call the converter directly (e.g. on a
`<css-doodle>` you manage yourself), import it from the subpath:

```ts
import { doodleToSvg } from 'tabbied/svg-export';
```

### Importing presets (tree-shaking)

`artwork` takes an `ArtworkDefinition` object. Import only the presets you
actually render from `tabbied/artworks` and your bundler ships just those —
not the entire catalog:

```tsx
import { radius, symmetry } from 'tabbied/artworks';
```

Each preset is a side-effect-free named export, so unused ones are dropped at
build time. Need the whole set (e.g. to build a gallery)? Import the `artworks`
record — `import { artworks } from 'tabbied/artworks'` — and accept that it
pulls in every design.

The component is a client component (it registers a browser custom element on
import), so in the Next.js App Router render it from a client boundary or rely
on its built-in measurable placeholder until it mounts.

### Common props

| Prop      | Description                                                                 |
| --------- | --------------------------------------------------------------------------- |
| `artwork` | An `ArtworkDefinition` — import a preset from `tabbied/artworks` or pass your own. |
| `seed`    | Pattern seed. Omit for a random seed per mount; reseed via the handle.       |
| `palette` | Active colors, background (`color0`) first. Defaults to the preset palette.  |
| `options` | Option values keyed by option id; unset options use authored defaults.       |
| `fit`     | How the drawing meets its box: `grid` (default), `cover`, `contain`, or `fixed`. |
| box props | How big the box is: `fill`, `width`, `height`, `maxWidth`, `maxHeight`, `aspectRatio`. |

See the inline JSDoc on `TabbiedArtworkProps` for the full list.

### Sizing the box

An artwork has no intrinsic size, so it takes the size of the box you give it.
By default that box **fills its containing block** — drop one into a sized
parent and you're done:

```tsx
// .panel is 100% wide and 400px tall; the artwork fills it.
<div className="panel">
  <TabbiedArtwork artwork={radius} />
</div>
```

| Prop           | Type               | Default | Description                                                     |
| -------------- | ------------------ | ------- | --------------------------------------------------------------- |
| `fill`         | `boolean`          | `true`  | `width: 100%; height: 100%`. `fill={false}` leaves sizing to CSS. |
| `width`        | `number \| string` | —       | Box width. Numbers are px. Overrides `fill` on that axis.        |
| `height`       | `number \| string` | —       | Box height. Numbers are px. Overrides `fill` on that axis.       |
| `maxWidth`     | `number \| string` | —       | Upper bound on the width.                                        |
| `maxHeight`    | `number \| string` | —       | Upper bound on the height.                                       |
| `aspectRatio`  | `number \| string` | —       | CSS `aspect-ratio`, e.g. `3 / 2`. Derives the height from the width. |

```tsx
// Fill the width, cap it, and let the ratio set the height.
<TabbiedArtwork artwork={radius} maxWidth={960} aspectRatio={3 / 2} />

// Full-bleed banner.
<TabbiedArtwork artwork={radius} height="40vh" />

// Sized by a class name instead.
<TabbiedArtwork artwork={radius} fill={false} className="hero-art" />
```

Mixing them works the way the CSS does — they *are* the CSS, resolved onto the
wrapper element (server render included, so there's no layout shift on mount).
One caveat comes with the territory: `height: 100%` only resolves against a
parent with a definite height. In a parent that sizes to its content, reach for
`height` or `aspectRatio` instead of `fill`.

With the core API the host element is yours, so size it however you like — or
run the same props through the same helper:

```js
import { resolveBoxStyle } from 'tabbied';

Object.assign(host.style, resolveBoxStyle({ maxWidth: 960, aspectRatio: 3 / 2 }));
```

### Fit modes

`fit` says how the drawing meets the box. **No fit distorts the artwork** —
nothing is ever scaled by a different factor horizontally than vertically.

- `grid` (default) — re-derives the cell grid from the measured box: whole,
  near-square cells edge to edge at any box shape.
- `cover` — draws a fixed-resolution render and scales it uniformly to fill the
  box (preserving the proportions of fixed-px strokes and shadows). For
  grid-driven artworks the render follows the box's aspect ratio and re-derives
  its grid, so the pattern is never cut off mid-cell; special layouts (e.g.
  Symmetry's centered composition) scale-and-crop instead.
- `contain` — letterboxes the fixed-resolution render at its authored ratio.
- `fixed` — renders at an explicit canvas size (`width`/`height` in px, default
  360 × 540). This is what the Tabbied editor uses.

Each artwork declares a sensible default, so `fit` is optional. Requesting a
fit an artwork can't support falls back to its default with a console warning.

> **Removed in 0.2.0:** `fit="stretch"`, which kept the authored grid and let
> cells deform with the box. Use `grid` (the default) for a box-shaped grid, or
> `cover` to scale a render uniformly.

## Core (framework-agnostic)

```ts
import { createArtwork } from 'tabbied';
import { radius } from 'tabbied/artworks';

const el = document.querySelector('#stage')!;
const controller = createArtwork(el, {
  artwork: radius,
  seed: 'k9Pz',
  // Measured fits (grid/cover/contain) mount asynchronously, after the first
  // ResizeObserver tick delivers the host's size — drive the controller from
  // onReady rather than immediately after createArtwork().
  onReady: async () => {
    controller.redraw(); // re-randomize the seed
    await controller.exportImage();
    const { svg } = await controller.exportSvg(); // native vector SVG
  },
});

// later: controller.destroy();
```

## License

MIT © Sy Hong and Ye Joo Park
