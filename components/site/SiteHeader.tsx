'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog } from '@base-ui-components/react/dialog';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import LogoDoodle from './LogoDoodle';
import GithubIcon from './GithubIcon';
import styles from './SiteHeader.module.css';

// `external` items point at static files outside the Next app. They render as a
// real <a> so the browser does a full navigation instead of client-side routing,
// which has no route to resolve for them. Nothing uses it today — the template
// sites became Next routes under /template/ — but the escape hatch is cheap to
// keep for the next thing dropped into public/.
type NavItem = { href: string; label: string; external?: boolean };

const NAV_ITEMS: NavItem[] = [
  { href: '/patterns', label: 'Patterns' },
  { href: '/templates', label: 'Templates' },
  { href: '/docs/react', label: 'Docs' },
];

// The site is a static export with `trailingSlash: true`, so the live pathname
// is "/patterns/" while a nav href is "/patterns". Strip any trailing slash
// (keeping "/" itself) before comparing so the active item resolves either way.
function normalizePath(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

/**
 * The shared Swiss header: mark, an indexed nav, and GitHub, divided from the
 * page by a single hairline. Used on every route except the pattern editor,
 * which has its own toolbar.
 *
 * It is sticky, and everything else that pins to the top of the viewport (the
 * gallery's rail and its mobile palette shelf) offsets by `--header-h`, so the
 * height lives in one place — `styles/globals.css` — rather than being
 * re-measured per page.
 */
export default function SiteHeader() {
  const currentPath = normalizePath(usePathname() ?? '/');

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.mark} prefetch={false}>
          <LogoDoodle size={26} className={styles.markDoodle} />
          <span className={styles.wordmark}>Tabbied</span>
        </Link>

        {/* Numbered like a Swiss contents list: the index is decorative, so it
            is hidden from assistive tech and the link is still named by its
            label alone. Hidden below 992px, where the drawer takes over. */}
        <nav className={styles.nav} aria-label="Sections">
          <ol>
            {NAV_ITEMS.map((item, i) => {
              const isActive = !item.external && currentPath === item.href;
              const linkClass = isActive
                ? `${styles.navLink} ${styles.active}`
                : styles.navLink;
              const inner = (
                <>
                  <span className={styles.idx} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </>
              );

              return (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.href} className={linkClass}>
                      {inner}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      prefetch={false}
                      className={linkClass}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className={styles.end}>
          {/* Desktop keeps GitHub in the header; below 992px it moves into the
              drawer, which is also the only way to reach the nav there. */}
          <a
            href="https://github.com/subwaymatch/tabbied/"
            className={styles.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Tabbied on GitHub"
          >
            <GithubIcon size={17} />
          </a>

          <Dialog.Root>
            <Dialog.Trigger
              className={styles.menuTrigger}
              aria-label="Open navigation menu"
            >
              <MenuIcon size={22} aria-hidden="true" />
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Backdrop className={styles.backdrop} />
              <Dialog.Popup className={styles.drawer}>
                <div className={styles.drawerHead}>
                  <Dialog.Title className={styles.drawerTitle}>
                    Menu
                  </Dialog.Title>
                  <Dialog.Close
                    className={styles.drawerClose}
                    aria-label="Close menu"
                  >
                    <CloseIcon size={22} aria-hidden="true" />
                  </Dialog.Close>
                </div>

                <nav className={styles.drawerNav}>
                  {NAV_ITEMS.map((item, i) => {
                    const isActive =
                      !item.external && currentPath === item.href;

                    return (
                      <Dialog.Close
                        key={item.label}
                        className={
                          isActive
                            ? `${styles.drawerLink} ${styles.drawerLinkActive}`
                            : styles.drawerLink
                        }
                        render={
                          item.external ? (
                            <a href={item.href} />
                          ) : (
                            <Link
                              href={item.href}
                              prefetch={false}
                              aria-current={isActive ? 'page' : undefined}
                            />
                          )
                        }
                      >
                        <span className={styles.idx} aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {item.label}
                      </Dialog.Close>
                    );
                  })}
                </nav>

                <Dialog.Close
                  className={styles.drawerGithub}
                  render={
                    <a
                      href="https://github.com/subwaymatch/tabbied/"
                      target="_blank"
                      rel="noreferrer"
                    />
                  }
                >
                  <GithubIcon size={18} />
                  <span>GitHub</span>
                </Dialog.Close>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
