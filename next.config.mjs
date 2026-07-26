/** @type {import('next').NextConfig} */

// The whole site is prerenderable (every route is built from the local
// artworks/ folder; interactivity is client-side), so it ships as a pure
// static export. On Vercel that means pages are served straight from the CDN
// as files — zero function invocations, zero ISR cache reads/writes — instead
// of App Router's default prerender-behind-a-function serving.
//
// Consequences handled elsewhere:
//  - Response headers can't come from next.config in export mode; they live in
//    vercel.json.
//  - The /_next/image optimizer doesn't exist in export mode, so the marketing
//    images are pre-sized into public/images by scripts/optimize-images.mjs.
//  - `next start` can't serve an export; `npm start` now runs `serve out`.
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // The static sample sites are plain files under public/samples/<dir>/index.html.
  // A static host (Vercel, `serve`) resolves a directory URL to its index.html,
  // but `next dev` serves public/ as exact paths only, so /samples/<dir>/ 404s
  // in development while working in production. This rewrite closes that gap.
  //
  // It is attached only in development: rewrites are ignored by `output:
  // 'export'` anyway, and declaring one unconditionally makes every production
  // build print three "will not work with output: export" warnings.
  ...(process.env.NODE_ENV === 'development'
    ? {
        async rewrites() {
          return [{ source: '/samples/:dir/', destination: '/samples/:dir/index.html' }];
        },
      }
    : {}),
  // Emit every page as <route>/index.html so any static file server (and the
  // mixed trailing/non-trailing hrefs already in the app) resolve cleanly.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
