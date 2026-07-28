import type { Metadata } from 'next';
import { tetro, maze, bloks, notchblock } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'pixel-playhouse')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { tetro, maze, bloks, notchblock };

export const metadata: Metadata = {
  title: 'Pixel Playhouse, Indie game studio',
  description: 'A tiny studio making colourful, low-stress games you can lose an evening to.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
