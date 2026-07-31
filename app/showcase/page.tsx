import type { Metadata } from 'next';
import {
  gasket, stylobate, spark, reeding, facetgrad, gloaming, ridgeline, glyph,
  grain, kern, wavelet, mortise, karst, hilbert, linocut, fluting, gutter,
  quire, cascade, ripplering,
} from 'tabbied/artworks';
import type { ArtworkDefinition } from 'tabbied';
import LazyTile from './LazyTile';
import s from './showcase.module.css';

export const metadata: Metadata = {
  title: 'Showcase — 20 sites built on Tabbied patterns',
  description:
    'Twenty fictional brand sites — a bakery, a type foundry, an observatory, a railway — each designed around a different Tabbied generative artwork and AI-generated imagery.',
};

type Site = {
  slug: string;
  name: string;
  topic: string;
  artwork: ArtworkDefinition;
  palette: string[];
  seed: string;
};

// One entry per site in this collection. Palettes mirror each page's own
// constants (background first), so a tile previews the site it links to.
const SITES: Site[] = [
  { slug: 'mistral-cycles', name: 'Mistral Cycles', topic: 'Handbuilt bicycle frames', artwork: gasket, palette: ['#0D1B2A', '#1B98E0', '#E0FBFC', '#FF7B00', '#FFD23F', '#EAEAEA'], seed: 'dir-mc' },
  { slug: 'koyo-tea', name: 'Koyo', topic: 'Japanese tea house', artwork: stylobate, palette: ['#F2EFEA', '#3A5A40', '#588157', '#A3B18A', '#344E41', '#DAD7CD'], seed: 'dir-ko' },
  { slug: 'zenith-observatory', name: 'Zenith', topic: 'Observatory & planetarium', artwork: spark, palette: ['#10002B', '#5A189A', '#9D4EDD', '#C77DFF', '#E0AAFF', '#FFD6FF'], seed: 'dir-ze' },
  { slug: 'wildgrain-bakery', name: 'Wildgrain', topic: 'Naturally leavened bakery', artwork: reeding, palette: ['#EAE0CC', '#1B1B1E', '#C6AC8F', '#5E503F', '#A9927D', '#EB5E28'], seed: 'dir-wg' },
  { slug: 'ledgerline', name: 'Ledgerline', topic: 'Personal finance app', artwork: facetgrad, palette: ['#0B1F3A', '#3E8BFF', '#3EECFF', '#97F4FF', '#9EFFD8', '#FFFFFF'], seed: 'dir-le' },
  { slug: 'maison-ambre', name: 'Maison Ambre', topic: 'Perfume house', artwork: gloaming, palette: ['#141210', '#C9A227', '#E8D9B0', '#8C6A2F', '#FBF6EA', '#5A4632'], seed: 'dir-ma' },
  { slug: 'cairn-expeditions', name: 'Cairn', topic: 'Alpine guiding service', artwork: ridgeline, palette: ['#10222E', '#A8CEDE', '#F2F7F9', '#E8734A', '#4E7A8C', '#D8E8EF'], seed: 'dir-ca' },
  { slug: 'hopscotch-museum', name: 'Hopscotch', topic: "Children's discovery museum", artwork: glyph, palette: ['#FFF9EF', '#2B2B33', '#FF5C4D', '#2E86DE', '#27C093', '#FFC53D'], seed: 'dir-ho' },
  { slug: 'analog-dept', name: 'Analog Dept.', topic: 'Film photography lab', artwork: grain, palette: ['#0F0F10', '#E8E6E1', '#E63946'], seed: 'dir-an' },
  { slug: 'grotesk-foundry', name: 'Grotesk', topic: 'Independent type foundry', artwork: kern, palette: ['#F4F1EC', '#111111', '#D63515', '#B9B3A8', '#8A857C', '#2E2B27'], seed: 'dir-gr' },
  { slug: 'cerulean-swim', name: 'Cerulean', topic: 'Swimwear label', artwork: wavelet, palette: ['#F2FBFC', '#0FA3B1', '#B5E2E8', '#FF8266', '#FFD97D', '#134D57'], seed: 'dir-ce' },
  { slug: 'oxbow-workshop', name: 'Oxbow', topic: 'Furniture workshop', artwork: mortise, palette: ['#F5F1E8', '#2E2A25', '#A9713C', '#6B4F35', '#9AA69B', '#C7BBA5'], seed: 'dir-ox' },
  { slug: 'piquant-provisions', name: 'Piquant Provisions', topic: 'Small-batch hot sauce', artwork: karst, palette: ['#0F1A20', '#F4D35E', '#EE964B', '#F95738', '#EFE6DD', '#4C8FBD'], seed: 'dir-pi' },
  { slug: 'quanta-robotics', name: 'Quanta', topic: 'Robotics laboratory', artwork: hilbert, palette: ['#0B0E14', '#25E0C8', '#4A5568', '#E8ECF1', '#7A88FF', '#1A2230'], seed: 'dir-qu' },
  { slug: 'madrigal-strings', name: 'Madrigal', topic: 'Violin atelier', artwork: linocut, palette: ['#2D132C', '#801336', '#C72C41', '#EE4540', '#F0C419', '#FFE9C7'], seed: 'dir-md' },
  { slug: 'neve-gelato', name: 'Neve', topic: 'Gelato shop', artwork: fluting, palette: ['#FFF9F5', '#FF8FB8', '#FFC2D4', '#FF8A5C', '#D89FFF', '#F5C542'], seed: 'dir-ne' },
  { slug: 'plumbline-studio', name: 'Plumbline', topic: 'Architecture practice', artwork: gutter, palette: ['#F6F5F1', '#17171A', '#2947F0', '#B9B9BE', '#6E6E74', '#DCDCD8'], seed: 'dir-pl' },
  { slug: 'foxglove-books', name: 'Foxglove', topic: 'Bookshop & café', artwork: quire, palette: ['#F7F3E8', '#1E3A2F', '#3E6B54', '#C25E4C', '#D9CBA8', '#8FA98F'], seed: 'dir-fo' },
  { slug: 'caldera-rail', name: 'Caldera', topic: 'Scenic railway journeys', artwork: cascade, palette: ['#F0EAD6', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'], seed: 'dir-cl' },
  { slug: 'stillpoint-yoga', name: 'Stillpoint', topic: 'Movement & breathwork studio', artwork: ripplering, palette: ['#F5EFE7', '#C97B5A', '#8C7A6B', '#E5D5C3', '#4A423A', '#D9B99F'], seed: 'dir-st' },
];

export default function ShowcaseIndexPage() {
  return (
    <main className={s.page}>
      <header className={s.head}>
        <p className={s.kicker}>Showcase</p>
        <h1>Twenty sites, twenty patterns, twenty design worlds.</h1>
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
