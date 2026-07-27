import type { Metadata } from 'next';
import { veil, bokeh, lunette, prisma } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'nocturne')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { veil, bokeh, lunette, prisma };

export const metadata: Metadata = {
  title: 'Nocturne, Fragrance for the small hours',
  description: 'Fragrance composed for the small hours, when the city quiets and scent speaks loudest.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
