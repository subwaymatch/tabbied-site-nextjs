import type { Metadata } from 'next';
import { TabbiedArtwork } from 'tabbied/react';
import { radius, symmetry } from 'tabbied/artworks';
import { HydrateProbe } from './HydrateProbe';

export const metadata: Metadata = {
  title: 'tabbied package test',
  robots: { index: false },
};

// Exercises the `tabbied` package the way an external consumer would: plain
// server-component JSX with no ssr:false ceremony (the component is a client
// boundary by itself and renders a measurable placeholder until mounted), and
// importing only the presets it renders from `tabbied/artworks` so the bundle
// holds those two definitions rather than all 84.
// Used by e2e/package.spec.ts to cover the fit strategies the main site
// doesn't reach (the gallery uses cover, the editor fixed) and the box props
// that size the element the artwork renders into.
export default function PackageTestPage() {
  return (
    <main style={{ padding: 24, display: 'grid', gap: 24 }}>
      <h1>tabbied package test</h1>

      {/* Adaptive grid (the default fit): cols × rows derive from the box.
          Radius paints cell backgrounds directly, which is what the e2e's
          painted-cell probe asserts on (stroke-based designs like maze draw
          via pseudo-elements instead). */}
      {/* No sizing props: the box fills the 100% × 320 parent by itself. */}
      <section id="fit-grid">
        <h2>fit=&quot;grid&quot;</h2>
        <div style={{ height: 320 }}>
          <TabbiedArtwork artwork={radius} seed="k9Pz" fit="grid" />
        </div>
      </section>

      {/* Adaptive cover: a fixed-resolution render whose shape follows the
          host, so a wide box is tiled with whole cells — nothing cut off
          mid-cell at the top or bottom edges. */}
      <section id="fit-cover">
        <h2>fit=&quot;cover&quot;</h2>
        <div style={{ height: 320 }}>
          <TabbiedArtwork artwork={radius} seed="k9Pz" fit="cover" />
        </div>
      </section>

      {/* Box props instead of a sized parent: the width is capped and the
          aspect ratio derives the height, so this works in a parent that has
          no height of its own. */}
      <section id="box-bounded">
        <h2>maxWidth + aspectRatio</h2>
        <TabbiedArtwork
          artwork={radius}
          seed="k9Pz"
          maxWidth={480}
          aspectRatio={3 / 2}
        />
      </section>

      {/* Grid-less composition letterboxed at its authored 2:3 ratio. */}
      <section id="fit-contain">
        <h2>fit=&quot;contain&quot; (symmetry)</h2>
        <div style={{ height: 300 }}>
          <TabbiedArtwork
            artwork={symmetry}
            seed="k9Pz"
            fit="contain"
            decorative={false}
          />
        </div>
      </section>

      {/* Ambient redraws. The timer, and its reduced-motion / tab-visibility
          / viewport gates, live in the core controller — the prop is a
          pass-through — so this section covers both entry points at once.
          The interval is short so the spec doesn't have to wait around. */}
      <section id="redraw-interval">
        <h2>redrawInterval</h2>
        <div style={{ height: 200 }}>
          <TabbiedArtwork artwork={radius} fit="grid" redrawInterval={250} />
        </div>
      </section>

      {/* Same timer, gated off by `paused`: the seed must hold still. */}
      <section id="redraw-paused">
        <h2>redrawInterval + paused</h2>
        <div style={{ height: 200 }}>
          <TabbiedArtwork
            artwork={radius}
            fit="grid"
            redrawInterval={250}
            paused
          />
        </div>
      </section>

      {/* Declarative mounting: markup + hydrateArtworks(), no component. This
          is the path a packaged HTML template takes. */}
      <section id="hydrate">
        <h2>hydrateArtworks()</h2>
        <HydrateProbe />
      </section>
    </main>
  );
}
