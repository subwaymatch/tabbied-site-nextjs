import type { Metadata } from 'next';
import { bauhaus, windowpane, damier, tetro } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'sunday-press')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { bauhaus, windowpane, damier, tetro };

export const metadata: Metadata = {
  title: 'The Sunday Press, Ideas, design & culture',
  description: 'An independent magazine on design, technology, and the culture around them.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
