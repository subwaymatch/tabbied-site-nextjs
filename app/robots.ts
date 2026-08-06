import type { MetadataRoute } from 'next';

// Static export: this becomes public robots.txt at build time.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://tabbied.com/sitemap.xml',
  };
}
