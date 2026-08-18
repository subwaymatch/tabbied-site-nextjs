'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './HomeNav.module.css';

// The homepage's own masthead. The rest of the site still uses the shared light
// MainHeader; this one exists because the homepage is the only route in the
// dark editorial treatment, and inheriting the light header would break the
// full-bleed hero it sits on top of.

type NavLink = { href: string; label: string };

const LINKS: NavLink[] = [
  { href: '/patterns', label: 'Patterns' },
  { href: '/templates', label: 'Templates' },
  { href: '/docs/react', label: 'Docs' },
];

const GITHUB_URL = 'https://github.com/tabbied-design/tabbied/';

// The pattern-to-website generator is announced here but has no route yet, so
// it renders as plain text with its badge rather than a link to nowhere.
function GeneratorItem({ className }: { className?: string }) {
  return (
    <span className={className}>
      Generator<span className={styles.badge}>Soon</span>
    </span>
  );
}

function Logo() {
  return (
    <span className={styles.logo} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

export default function HomeNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className={styles.nav}>
      <Link href="/" className={styles.logoLink} aria-label="Tabbied home">
        <Logo />
      </Link>

      <nav className={styles.links} aria-label="Main">
        {LINKS.slice(0, 2).map((item) => (
          <Link key={item.href} href={item.href} prefetch={false}>
            {item.label}
          </Link>
        ))}
        <GeneratorItem className={styles.generator} />
        <Link href={LINKS[2].href} prefetch={false}>
          {LINKS[2].label}
        </Link>
      </nav>

      <a
        href={GITHUB_URL}
        className={styles.github}
        target="_blank"
        rel="noreferrer"
      >
        GitHub
      </a>

      <button
        type="button"
        className={styles.hamburger}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="home-nav-menu"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
      >
        <span className={open ? styles.barTop : undefined} />
        <span className={open ? styles.barBottom : undefined} />
      </button>

      {/* Kept mounted so the button's aria-controls always resolves; the panel
          itself is display:none until opened (and above 768px, where the inline
          nav takes over). */}
      <div
        id="home-nav-menu"
        className={styles.panel}
        data-open={open || undefined}
        hidden={!open}
      >
        {LINKS.slice(0, 2).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            onClick={close}
          >
            {item.label}
          </Link>
        ))}
        <GeneratorItem className={styles.panelGenerator} />
        <Link href={LINKS[2].href} prefetch={false} onClick={close}>
          {LINKS[2].label}
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          onClick={close}
          className={styles.panelGithub}
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
