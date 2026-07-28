import type { Metadata } from 'next';
import { halftone, grain, dogtooth, pebble } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'roast-and-co')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { halftone, grain, dogtooth, pebble };

export const metadata: Metadata = {
  title: 'Roast & Co, Specialty coffee roasters',
  description: 'We source single-origin lots from growers we know by name and roast them in small batches the day before they ship.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
