import type { Metadata } from 'next';
import { bokeh, pinwheel, northstar, maelstrom } from 'tabbied/artworks';
import ShowcaseSite from 'components/showcase/ShowcaseSite';
import { SHOWCASE_SITES } from 'components/showcase/showcaseData';

const site = SHOWCASE_SITES.find((entry) => entry.slug === 'honeycomb')!;

// Every artwork the site renders, keyed by slug so ShowcaseSite can look each
// one up by name (see site.artworks for the order used across the layout).
const artworks = { bokeh, pinwheel, northstar, maelstrom };

export const metadata: Metadata = {
  title: "Honeycomb, Kids' learning app",
  description: "Bite-size, adaptive reading and number games for ages 4 to 9. No ads.",
};

export default function Page() {
  return <ShowcaseSite site={site} artworks={artworks} />;
}
