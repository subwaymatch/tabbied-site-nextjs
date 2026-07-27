import type { Metadata } from 'next';
import { neon, spectrum, prisma, bokeh } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'aurora-sound')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { neon, spectrum, prisma, bokeh };

export const metadata: Metadata = {
  title: 'Aurora Sound, Electronic music label',
  description: 'An independent label for forward-looking club, ambient, and everything that glows in between.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
