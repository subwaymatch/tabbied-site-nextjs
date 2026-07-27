import type { Metadata } from 'next';
import { foliage, frond, ivy, blossom } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'verdant')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { foliage, frond, ivy, blossom };

export const metadata: Metadata = {
  title: 'Verdant, Indoor plant shop',
  description: 'Hand-picked houseplants matched to your light, delivered to your door with everything they need to thrive.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
