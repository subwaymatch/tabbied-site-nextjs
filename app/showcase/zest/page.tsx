import type { Metadata } from 'next';
import { quoit, annulus, sliver, spark } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'zest')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { quoit, annulus, sliver, spark };

export const metadata: Metadata = {
  title: 'Zest, Bright, fast weeknight cooking',
  description: 'Bright, punchy recipes with short lists and shorter cook times, the kind you cook on a Tuesday and brag about on Friday.',
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
