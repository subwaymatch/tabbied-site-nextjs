import type { Metadata } from 'next';
import { veil, bokeh, lunette, prisma } from 'tabbied/patterns';
import TemplateSite from 'components/template/TemplateSite';
import { TEMPLATE_SITES } from 'components/template/templateData';

const site = TEMPLATE_SITES.find((entry) => entry.slug === 'nocturne')!;

// Every pattern the site renders, keyed by slug so TemplateSite can look each
// one up by name (see site.patterns for the order used across the layout).
const patterns = { veil, bokeh, lunette, prisma };

export const metadata: Metadata = {
  title: 'Nocturne, Fragrance for the small hours',
  description: 'Fragrance composed for the small hours, when the city quiets and scent speaks loudest.',
};

export default function Page() {
  return <TemplateSite site={site} patterns={patterns} />;
}
