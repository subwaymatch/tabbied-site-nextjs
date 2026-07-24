import type { Metadata } from 'next';
import type { CSSProperties, ReactNode } from 'react';
import { TabbiedArtwork } from 'tabbied/react';
import type { ArtworkDefinition } from 'tabbied';
import {
  // static-sample primaries
  plasma, pebble, circuit, foliage, bauhaus, confetti, veil, awning, tetro, halftone,
  // react-showcase primaries
  petal, quilt, spectrum, lattice, windowpane, frond, maze, bokeh, prisma, metro,
} from 'tabbied/artworks';
import { STATIC_SAMPLES } from 'components/showcase/galleryData';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';
import s from './samples.module.css';

export const metadata: Metadata = {
  title: 'Made with Tabbied, 20 Sample Websites',
  description:
    'Twenty sample websites using Tabbied generative artworks as design accents, ten static HTML builds and ten built with the TabbiedArtwork React component.',
};

const ART: Record<string, ArtworkDefinition> = {
  plasma, pebble, circuit, foliage, bauhaus, confetti, veil, awning, tetro, halftone,
  petal, quilt, spectrum, lattice, windowpane, frond, maze, bokeh, prisma, metro,
};

type CardData = {
  href: string;
  n: number;
  name: string;
  topic: string;
  artwork: string;
  paletteName: string;
  colors: string[];
  seed: string;
};

/**
 * A card in the mosaic. The artwork is the content, so it takes the whole top of
 * the card and the metadata sits underneath in one quiet line. Each card carries
 * its palette as a custom property, which tints its hover state: mousing across
 * the grid previews each site's accent before you open it.
 */
function Card({ c }: { c: CardData }) {
  const vars = { '--accent': c.colors[1] ?? c.colors[0] } as CSSProperties;
  return (
    <a className={s.card} href={c.href} style={vars}>
      <div className={s.thumb}>
        <TabbiedArtwork
          artwork={ART[c.artwork]}
          palette={c.colors}
          seed={c.seed}
          fit="cover"
          density={2}
        />
        <span className={s.num}>{String(c.n).padStart(2, '0')}</span>
      </div>
      <div className={s.cbody}>
        <div className={s.cmain}>
          <h3>{c.name}</h3>
          <p>{c.topic}</p>
        </div>
        <div className={s.foot}>
          <div className={s.sw} aria-hidden="true">
            {c.colors.map((col, i) => (
              <span key={i} style={{ background: col }} />
            ))}
          </div>
          <div className={s.pn}>
            {c.paletteName} <i>/</i> {c.artwork}
          </div>
        </div>
      </div>
    </a>
  );
}

// The hero backdrop is a contact sheet rather than one enlarged pattern: four
// different artworks on four different palettes, which states the premise of the
// page before a word is read.
const HERO_TILES: { art: ArtworkDefinition; palette: string[]; seed: string }[] = [
  { art: plasma, palette: ['#0d0d12', '#3fffb2', '#3eecff', '#ff3d8b'], seed: 'H1' },
  { art: bauhaus, palette: ['#0d0d12', '#ff3d8b', '#ffd23e', '#3eecff'], seed: 'H2' },
  { art: tetro, palette: ['#0d0d12', '#7048e8', '#3eecff', '#3fffb2'], seed: 'H3' },
  { art: prisma, palette: ['#0d0d12', '#ffd23e', '#3fffb2', '#7048e8'], seed: 'H4' },
];

function GroupHead({
  kicker,
  title,
  body,
  count,
}: {
  kicker: string;
  title: string;
  body: ReactNode;
  count: number;
}) {
  return (
    <header className={s.group}>
      <div>
        <span className={s.kicker}>{kicker}</span>
        <h2>{title}</h2>
      </div>
      <div className={s.groupMeta}>
        <p>{body}</p>
        <span className={s.count}>{count} sites</span>
      </div>
    </header>
  );
}

export default function SamplesGallery() {
  const staticCards: CardData[] = STATIC_SAMPLES.map((x, i) => ({
    href: `/samples/${x.dir}/`,
    n: i + 1,
    name: x.name,
    topic: x.topic,
    artwork: x.artwork,
    paletteName: x.paletteName,
    colors: x.colors,
    seed: `IDX${i}`,
  }));

  const reactCards: CardData[] = SHOWCASE_SITES.map((x, i) => ({
    href: `/showcase/${x.slug}/`,
    n: i + 11,
    name: x.brand,
    topic: x.topic,
    artwork: x.artwork,
    paletteName: x.paletteName,
    colors: x.colors,
    seed: `RCT${i}`,
  }));

  return (
    <main className={s.page}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Sora:wght@600;800&display=swap"
        precedence="default"
      />

      <header className={s.hero}>
        <div className={s.heroArt} aria-hidden="true">
          {HERO_TILES.map((t) => (
            <div key={t.seed}>
              <TabbiedArtwork
                artwork={t.art}
                palette={t.palette}
                seed={t.seed}
                fit="cover"
                density={1}
              />
            </div>
          ))}
        </div>
        <div className={s.heroScrim} />
        <div className={s.heroInner}>
          <div className={s.pre}>Made with Tabbied</div>
          <h1>
            Twenty sites,<br />
            <span>one pattern engine</span>
          </h1>
          <p>
            Every site below uses a <strong>Tabbied</strong> generative artwork as its
            main design accent, themed end to end with a single palette from the library.
            Same engine, twenty completely different moods.
          </p>
          <dl className={s.facts}>
            <div><dt>20</dt><dd>sample sites</dd></div>
            <div><dt>20</dt><dd>palettes</dd></div>
            <div><dt>20</dt><dd>artworks</dd></div>
            <div><dt>2</dt><dd>ways to build</dd></div>
          </dl>
        </div>
      </header>

      <div className={s.wrap}>
        <section>
          <GroupHead
            kicker="01"
            title="Static HTML builds"
            body="Self-contained pages that embed the css-doodle engine directly, with no framework in sight."
            count={staticCards.length}
          />
          <div className={s.mosaic}>
            {staticCards.map((c) => (
              <Card key={c.href} c={c} />
            ))}
          </div>
        </section>

        <section>
          <GroupHead
            kicker="02"
            title="React component builds"
            body={
              <>
                Live Next.js pages rendered with the <code>TabbiedArtwork</code> component.
              </>
            }
            count={reactCards.length}
          />
          <div className={s.mosaic}>
            {reactCards.map((c) => (
              <Card key={c.href} c={c} />
            ))}
          </div>
        </section>
      </div>

      <footer className={s.footer}>
        <p>
          Built with <a href="https://tabbied.com">Tabbied</a>, generative artworks
          powered by css-doodle. Open any card to view the full site.
        </p>
      </footer>
    </main>
  );
}
