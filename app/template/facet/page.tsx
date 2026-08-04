import type { Metadata } from 'next';
import { prisma, diadem, chamfer, vitrail } from 'tabbied/patterns';
import TemplateSite from 'components/template/TemplateSite';
import { TEMPLATE_SITES } from 'components/template/templateData';

const site = TEMPLATE_SITES.find((entry) => entry.slug === 'facet')!;

// Every pattern the site renders, keyed by slug so TemplateSite can look each
// one up by name (see site.patterns for the order used across the layout).
const patterns = { prisma, diadem, chamfer, vitrail };

export const metadata: Metadata = {
  title: "Facet, Fine jewelry brand",
  description: "Fine jewelry built around a single remarkable, traceable stone.",
};

export default function Page() {
  return <TemplateSite site={site} patterns={patterns} />;
}
