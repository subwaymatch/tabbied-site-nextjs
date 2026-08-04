import type { Metadata } from 'next';
import { lobe, blossom, spark, frond } from 'tabbied/patterns';
import TemplateSite from 'components/template/TemplateSite';
import { TEMPLATE_SITES } from 'components/template/templateData';

const site = TEMPLATE_SITES.find((entry) => entry.slug === 'solstice')!;

// Every pattern the site renders, keyed by slug so TemplateSite can look each
// one up by name (see site.patterns for the order used across the layout).
const patterns = { lobe, blossom, spark, frond };

export const metadata: Metadata = {
  title: "Solstice, Yoga & wellness retreat",
  description: "Seven-day coastal yoga and breath-work retreats for small groups.",
};

export default function Page() {
  return <TemplateSite site={site} patterns={patterns} />;
}
