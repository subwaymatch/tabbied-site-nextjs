import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import type { PatternDefinition } from 'tabbied';
import {
  lobe, windowpane, prisma, foliage, veil, blossom, spark, frond, chamfer,
  fluting, merlon, diadem, vitrail, ivy, bokeh, lunette,
} from 'tabbied/patterns';
import LazyPattern from 'components/LazyPattern';
import SiteHeader from 'components/site/SiteHeader';
import SiteFooter from 'components/site/SiteFooter';
import { TEMPLATE_SITES } from 'components/template/templateData';
import { NEW_TEMPLATE_SITES } from 'lib/templateSites';
import s from './templates.module.css';

// Derived, never written out: adding a site can't leave a stale number behind.
const TOTAL = TEMPLATE_SITES.length + NEW_TEMPLATE_SITES.length;

export const metadata: Metadata = {
  title: `Made with Tabbied, ${TOTAL} Template Websites`,
  description: `${TOTAL} sample websites using Tabbied generative patterns as design accents, each built with the TabbiedPattern React component.`,
};

const ART: Record<string, PatternDefinition> = {
  lobe, windowpane, prisma, foliage, veil, blossom, spark, frond, chamfer,
  fluting, merlon, diadem, vitrail, ivy, bokeh, lunette,
  // The second collection's patterns, keyed by preset slug.
  ...Object.fromEntries(NEW_TEMPLATE_SITES.map((x) => [x.patternSlug, x.pattern])),
};

type CardData = {
  slug: string;
  href: string;
  n: number;
  name: string;
  topic: string;
  pattern: string;
  paletteName: string;
  colors: string[];
  seed: string;
};

/**
 * A card in the index. The pattern is the content, so it takes the whole top of
 * the card and the metadata sits underneath on hairlines. Each card carries its
 * palette as a custom property, which tints its hover border: mousing across the
 * grid previews each site's accent before you open it.
 */
function Card({ c }: { c: CardData }) {
  const vars = { '--accent-site': c.colors[1] ?? c.colors[0] } as CSSProperties;

  return (
    // A <div>, not the <a> it used to be: the download links are anchors of
    // their own and an anchor cannot nest inside another. The card link still
    // covers everything above the download row.
    <div className={s.card} style={vars}>
      <a className={s.cardLink} href={c.href}>
        <div className={s.thumb}>
          <LazyPattern pattern={ART[c.pattern]} palette={c.colors} seed={c.seed} />
        </div>

        <div className={s.cbody}>
          <div className={s.cnum}>{String(c.n).padStart(2, '0')}</div>
          <div className={s.cmain}>
            <h3>{c.name}</h3>
            <p>{c.topic}</p>
          </div>
        </div>

        <div className={s.cmeta}>
          <span className={s.sw} aria-hidden="true">
            {c.colors.map((col, i) => (
              <i key={i} style={{ background: col }} />
            ))}
          </span>
          <span className={s.pn}>
            {c.paletteName} <i>/</i> {c.pattern}
          </span>
        </div>
      </a>

      {/* Both formats are built by `npm run templates` into out/downloads/,
          so these are plain static files served next to the site. `download`
          saves the zip rather than navigating to it. */}
      <div className={s.dl}>
        <span className={s.dlLabel}>Download</span>
        <a className={s.dlBtn} href={`/downloads/${c.slug}-html.zip`} download>
          HTML
        </a>
        <a className={s.dlBtn} href={`/downloads/${c.slug}-react.zip`} download>
          React
        </a>
      </div>
    </div>
  );
}

// The hero band is a contact sheet rather than one enlarged pattern: six sites,
// each in its own palette, which states the premise of the page before a word of
// it is read.
const HERO_PICKS = [
  'kubus',
  'zenith-observatory',
  'hopscotch-museum',
  'maison-ambre',
  'cerulean-swim',
  'oxbow-workshop',
];

const HERO_TILES = HERO_PICKS.map((slug) => {
  const site = NEW_TEMPLATE_SITES.find((x) => x.slug === slug);

  // A renamed or retired template should fail the build, not quietly leave a
  // hole in the band.
  if (!site) throw new Error(`Unknown template site in the hero: ${slug}`);

  return site;
});

export default function TemplatesGallery() {
  // One list, numbered straight through: the gallery shows a single grid
  // rather than splitting the collections into separate batches.
  const allCards: CardData[] = [
    ...TEMPLATE_SITES.map((x, i) => ({
      slug: x.slug,
      href: `/template/${x.slug}/`,
      name: x.brand,
      topic: x.topic,
      pattern: x.pattern,
      paletteName: x.paletteName,
      colors: x.colors,
      seed: `RCT${i}`,
    })),
    ...NEW_TEMPLATE_SITES.map((x) => ({
      slug: x.slug,
      href: `/template/${x.slug}/`,
      name: x.name,
      topic: x.topic,
      pattern: x.patternSlug,
      paletteName: x.paletteName,
      colors: x.palette,
      seed: x.seed,
    })),
  ].map((c, i) => ({ ...c, n: i + 1 }));

  return (
    <div className={s.page}>
      <SiteHeader />

      <main>
        <header className={s.hero}>
          <div className={s.heroHead}>
            <p className={s.kicker}>Made with Tabbied</p>
            <p className={s.heroTag}>Free · HTML + React · MIT</p>
          </div>

          <h1 className={s.heroType}>
            <span>{TOTAL} sites,</span> <span>one pattern engine</span>
          </h1>

          <div className={s.heroFoot}>
            <p className={s.heroLead}>
              Every site below uses a <strong>Tabbied</strong> generative pattern
              as its main design accent, themed end to end with a single palette.
              Same component, {TOTAL} completely different moods — and each one
              downloads as plain HTML or as a React project.
            </p>
            <a className={s.heroJump} href="#index">
              Browse the index
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className={s.heroStrip} aria-hidden="true">
            {HERO_TILES.map((tile) => (
              <div key={tile.slug} className={s.heroTile}>
                <LazyPattern
                  pattern={tile.pattern}
                  palette={tile.palette}
                  seed={tile.seed}
                  density={1}
                />
              </div>
            ))}
          </div>

          <dl className={s.facts}>
            <div><dt>{TOTAL}</dt><dd>Sample sites</dd></div>
            <div><dt>{TOTAL}</dt><dd>Palettes</dd></div>
            <div><dt>{TOTAL}</dt><dd>Patterns</dd></div>
            <div><dt>1</dt><dd>Component</dd></div>
          </dl>
        </header>

        <section className={s.index} id="index">
          <header className={s.sectionHead}>
            <div className={s.sectionHeadMain}>
              <span className={s.sectionIndex}>01</span>
              <h2 className={s.sectionTitle}>Every site, one component</h2>
            </div>
            <div className={s.sectionHeadNote}>
              <p>
                Live Next.js pages, each rendered by the same{' '}
                <code>TabbiedPattern</code> component on its own palette and
                presets — some with AI-generated imagery composited over the
                patterns, the newest with the patterns carrying the page on their
                own.
              </p>
              <span className={s.count}>{allCards.length} sites</span>
            </div>
          </header>

          <div className={s.mosaic}>
            {allCards.map((c) => (
              <Card key={c.href} c={c} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
