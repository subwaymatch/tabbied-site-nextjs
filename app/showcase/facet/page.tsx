import type { Metadata } from 'next';
import { prisma, diadem, chamfer, vitrail } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'facet')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { prisma, diadem, chamfer, vitrail };

export const metadata: Metadata = {
  title: "Facet, Fine jewelry brand",
  description: "Fine jewelry built around a single remarkable, traceable stone.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
