import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import 'styles/globals.css';

// Self-hosted at build time (no third-party stylesheet on the critical path),
// exposed to CSS as `--font-inter` and consumed through `--font-sans-serif`.
// The template sites keep their own Google Fonts <link>: they ship as
// standalone downloads with no Next.js build behind them.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Tabbied',
  description:
    'Tabbied lets you easily create timeless and beautifully generated patterns or pattern to use for wall art, websites, print materials and more.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  },
  other: {
    'msapplication-TileColor': '#00a300',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
