import type { MetadataRoute } from 'next';
import { getAllPatternIds } from 'lib/pattern';
import { NEW_TEMPLATE_SITES } from 'lib/templateSites';
import { TEMPLATE_SITES } from 'components/template/templateData';

// Static export: this becomes public sitemap.xml at build time.
export const dynamic = 'force-static';

const SITE = 'https://tabbied.com';

// Matches next.config's `trailingSlash: true`, so listed URLs are the exact
// canonical form the export serves (no redirect hop for crawlers).
const url = (path: string): string => (path ? `${SITE}/${path}/` : `${SITE}/`);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const patternIds = await getAllPatternIds();

  return [
    '',
    'patterns',
    'templates',
    'template',
    'docs/react',
    'privacy-policy',
    'terms-of-service',
    ...patternIds.map((slug) => `patterns/${slug}`),
    ...TEMPLATE_SITES.map((site) => `template/${site.slug}`),
    ...NEW_TEMPLATE_SITES.map((site) => `template/${site.slug}`),
  ].map((path) => ({ url: url(path) }));
}
