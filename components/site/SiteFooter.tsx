import Link from 'next/link';
import GithubIcon from './GithubIcon';
import styles from './SiteFooter.module.css';

type FooterLink = { href: string; label: string; external?: boolean };

const EXPLORE: FooterLink[] = [
  { href: '/patterns', label: 'Patterns' },
  { href: '/templates', label: 'Templates' },
  { href: '/docs/react', label: 'React docs' },
  {
    href: 'https://github.com/subwaymatch/tabbied/',
    label: 'GitHub',
    external: true,
  },
];

const LEGAL: FooterLink[] = [
  { href: '/privacy-policy', label: 'Privacy policy' },
  { href: '/terms-of-service', label: 'Terms of service' },
];

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className={styles.col}>
      <h2 className={styles.colTitle}>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ) : (
              <Link href={link.href} prefetch={false}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The shared Swiss footer: a wordmark block, two link columns, a colophon, and
 * a rule-divided baseline. Same gutters and hairlines as the header, so a page
 * is bracketed by the same grid at both ends.
 */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.wordmark}>Tabbied</span>
          <p>
            Generative patterns for wall art, websites, print and anything else
            that needs a surface. Free, open source, no account.
          </p>
          <Link href="/patterns" className={styles.cta} prefetch={false}>
            Make your art
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <LinkColumn title="Explore" links={EXPLORE} />
        <LinkColumn title="Legal" links={LEGAL} />

        <div className={styles.col}>
          <h2 className={styles.colTitle}>Colophon</h2>
          <p className={styles.note}>
            Built by <a href="https://www.syunghong.com/">Sy Hong</a> and{' '}
            <a href="https://www.behance.net/yejoopark">Ye Joo Park</a>. Patterns
            are drawn by <a href="https://css-doodle.com/">css-doodle</a>, a web
            component by <a href="http://yuanchuan.dev/">Chuan Yuan</a>.
          </p>

          {/* A lazy <img> (not a CSS background) so the third-party request
              neither starts before the footer nears the viewport nor delays the
              page's load event. */}
          <a
            href="https://www.producthunt.com/posts/tabbied?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-tabbied"
            className={styles.badge}
            target="_blank"
            rel="noreferrer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=279660&theme=light&period=daily"
              alt="Tabbied on Product Hunt"
              width={190}
              height={39}
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
      </div>

      <div className={styles.baseline}>
        <span>© {new Date().getFullYear()} Tabbied</span>
        <span className={styles.baselineMid}>
          Patterns rendered with css-doodle
        </span>
        <a
          className={styles.baselineGithub}
          href="https://github.com/subwaymatch/tabbied/"
          target="_blank"
          rel="noreferrer"
        >
          <GithubIcon size={14} />
          subwaymatch/tabbied
        </a>
      </div>
    </footer>
  );
}
