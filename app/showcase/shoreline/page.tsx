import type { Metadata } from 'next';
import { awning, picket, sail, lattice } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'shoreline')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { awning, picket, sail, lattice };

export const metadata: Metadata = {
  title: 'Shoreline, Coastal architecture studio',
  description: 'We design durable, low-slung homes for the coast.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
