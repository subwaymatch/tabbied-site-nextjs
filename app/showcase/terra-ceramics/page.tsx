import type { Metadata } from 'next';
import { pebble, bowl, lobe, quilt } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'terra-ceramics')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { pebble, bowl, lobe, quilt };

export const metadata: Metadata = {
  title: 'Terra Ceramics, Pottery & ceramics studio',
  description: 'Each piece is wheel-thrown, glazed, and fired in our riverside studio.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
