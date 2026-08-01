import type { Metadata } from 'next';
import { NEW_SHOWCASE_SITES } from 'lib/showcaseSites';
import LazyTile from './LazyTile';
import s from './showcase.module.css';

export const metadata: Metadata = {
  title: 'Showcase: 19 sites built on Tabbied patterns',
  description:
    'Nineteen fictional brand sites (a bakery, a type foundry, an observatory, a railway) each designed around a different Tabbied generative artwork and AI-generated imagery.',
};

// The site list (palettes, artworks, seeds) lives in lib/showcaseSites so the
// /showcases gallery and this index stay in lockstep.
const SITES = NEW_SHOWCASE_SITES;

export default function ShowcaseIndexPage() {
  return (
    <main className={s.page}>
      <header className={s.head}>
        <p className={s.kicker}>Showcase</p>
        <h1>Nineteen sites, nineteen patterns, nineteen design worlds.</h1>
        <p>
          Each of these fictional brand sites is designed around a different{' '}
          <a href="/artworks">Tabbied generative artwork</a> — as hero
          backdrops, section bands, and surfaces for cut-out imagery. Every
          tile below is the live pattern, drawn in the site's own palette.
        </p>
      </header>
      <div className={s.grid}>
        {SITES.map((site, i) => (
          <a key={site.slug} className={s.card} href={`/showcase/${site.slug}/`}>
            <div className={s.thumb}>
              <LazyTile
                artwork={site.artwork}
                palette={site.palette}
                seed={site.seed}
              />
            </div>
            <div className={s.body}>
              <div>
                <h2>{site.name}</h2>
                <p>{site.topic}</p>
              </div>
              <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
            </div>
          </a>
        ))}
      </div>
      <p className={s.foot}>
        Patterns by <a href="https://tabbied.com">Tabbied</a> · imagery
        generated with GPT Image 2.
      </p>
    </main>
  );
}
