import type { Metadata } from 'next';
import { windowpane, chamfer, fluting, merlon } from 'tabbied/patterns';
import TemplateSite from 'components/template/TemplateSite';
import { TEMPLATE_SITES } from 'components/template/templateData';

const site = TEMPLATE_SITES.find((entry) => entry.slug === 'ember-and-oak')!;

// Every pattern the site renders, keyed by slug so TemplateSite can look each
// one up by name (see site.patterns for the order used across the layout).
const patterns = { windowpane, chamfer, fluting, merlon };

export const metadata: Metadata = {
  title: "Ember & Oak, Wood-fire restaurant",
  description: "A single wood-fired hearth and a menu that changes with the market.",
};

export default function Page() {
  return <TemplateSite site={site} patterns={patterns} />;
}
