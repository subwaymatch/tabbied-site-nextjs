import Link from 'next/link';
import type { PatternDefinition } from 'tabbied';
import { radius, maze, metro, weave, bloks } from 'tabbied/patterns';
import LazyPattern from 'components/LazyPattern';
import s from './home.module.css';

/**
 * The hero band: five live patterns, all rendered in the site's own three
 * colours rather than their authored palettes. Recolouring is the product, so
 * the strip demonstrates it — and keeps the top of the page to paper, ink and
 * one accent instead of five competing palettes.
 */
const INK = '#0b0b0c';
// `--surface`, not the page's white: the tiles carry no frame, so a hair of
// tint is what separates a light pattern from the page behind it.
const PAPER = '#f3f3f0';
const ACCENT = '#ff3d8b';
const GREY = '#c9c9c2';

/* Six entries because 228 of the 253 designs take six colours; a shorter
   palette would leave the highest --colorN unset on those. */
const ON_PAPER = [PAPER, INK, ACCENT, INK, GREY, ACCENT];
const ON_INK = [INK, PAPER, ACCENT, PAPER, GREY, ACCENT];

const TILES: { art: PatternDefinition; palette: string[]; seed: string }[] = [
  { art: radius, palette: ON_PAPER, seed: 'HR1' },
  { art: maze, palette: ON_INK, seed: 'HR2' },
  { art: metro, palette: ON_PAPER, seed: 'HR3' },
  { art: weave, palette: ON_INK, seed: 'HR4' },
  { art: bloks, palette: ON_PAPER, seed: 'HR5' },
];

export default function HomeHero({
  designCount,
  paletteCount,
  templateCount,
}: {
  designCount: number;
  paletteCount: number;
  templateCount: number;
}) {
  return (
    <section className={s.hero}>
      <div className={s.heroHead}>
        <p className={s.kicker}>Generative pattern studio</p>
        <p className={s.heroTag}>Free · Open source · No account</p>
      </div>

      {/* Two lines, two elements, one space between them: the headline reads as
          a single string to a screen reader while breaking where the design
          wants it to. */}
      <h1 className={s.heroType}>
        <span>Doodle with</span> <span>generated patterns</span>
      </h1>

      <div className={s.heroFoot}>
        <p className={s.heroLead}>
          Pick one of {designCount} designs, recolour it with your own palette,
          and export it as vector SVG or PNG — for wall art, websites, packaging,
          print, or anything else that needs a surface.
        </p>

        <div className={s.heroActions}>
          <Link href="/patterns/" className={s.btnPrimary} prefetch={false}>
            Make your art
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/templates/" className={s.btnGhost} prefetch={false}>
            See {templateCount} templates
          </Link>
        </div>
      </div>

      {/* Full-bleed contact sheet. Hairlines between tiles, no gaps: the strip
          is one band of pattern, divided, not five floating cards. */}
      <div className={s.heroStrip} aria-hidden="true">
        {TILES.map((tile) => (
          <div key={tile.seed} className={s.heroTile}>
            <LazyPattern
              pattern={tile.art}
              palette={tile.palette}
              seed={tile.seed}
            />
          </div>
        ))}
      </div>

      <dl className={s.facts}>
        <div>
          <dt>{designCount}</dt>
          <dd>Designs</dd>
        </div>
        <div>
          <dt>{paletteCount}</dt>
          <dd>Palettes</dd>
        </div>
        <div>
          <dt>{templateCount}</dt>
          <dd>Template sites</dd>
        </div>
        <div>
          <dt>SVG</dt>
          <dd>+ PNG export</dd>
        </div>
      </dl>
    </section>
  );
}
