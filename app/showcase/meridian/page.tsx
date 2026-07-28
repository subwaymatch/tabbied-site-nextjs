import type { Metadata } from 'next';
import { circuit, lattice, metro, windowpane } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'meridian')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { circuit, lattice, metro, windowpane };

export const metadata: Metadata = {
  title: 'Meridian, Payments infrastructure',
  description: 'One API for cards, transfers, and ledgers.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
