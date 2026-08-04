import type { Metadata } from 'next';
import { foliage, frond, ivy, blossom } from 'tabbied/patterns';
import TemplateSite from 'components/template/TemplateSite';
import { TEMPLATE_SITES } from 'components/template/templateData';

const site = TEMPLATE_SITES.find((entry) => entry.slug === 'verdant')!;

// Every pattern the site renders, keyed by slug so TemplateSite can look each
// one up by name (see site.patterns for the order used across the layout).
const patterns = { foliage, frond, ivy, blossom };

export const metadata: Metadata = {
  title: 'Verdant, Indoor plant shop',
  description: 'Hand-picked houseplants matched to your light, delivered to your door with everything they need to thrive.',
};

export default function Page() {
  return <TemplateSite site={site} patterns={patterns} />;
}
