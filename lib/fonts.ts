import { IBM_Plex_Mono } from 'next/font/google';

/**
 * The mono that carries every label, eyebrow and figure in the 2026 design.
 *
 * Declared here and applied per route rather than in the root layout, so only
 * the routes that use it preload it — the docs and legal pages are still the
 * older light theme and never ask for it. next/font memoises by call site, so
 * importing this from several pages emits one font, not one per page.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-plex-mono',
  display: 'swap',
});
