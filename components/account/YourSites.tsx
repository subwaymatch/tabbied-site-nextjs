'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { SiteSummary } from 'lib/studioDocument';
import { apiFetch } from 'lib/apiFetch';
import styles from './YourSites.module.css';

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; sites: SiteSummary[] };

/** The sites this person has made, newest first. Session-scoped on the API side. */
export default function YourSites({ limit }: { limit?: number } = {}) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let live = true;

    apiFetch<{ sites: SiteSummary[] }>('/api/studio/sites')
      .then(({ sites }) => {
        if (live) setState({ status: 'ready', sites });
      })
      .catch(() => {
        if (live) setState({ status: 'error' });
      });

    return () => {
      live = false;
    };
  }, []);

  if (state.status === 'loading') {
    return <p className={styles.quiet}>Loading your sites…</p>;
  }

  if (state.status === 'error') {
    return <p className={styles.quiet}>Could not load your sites right now.</p>;
  }

  if (state.sites.length === 0) {
    return (
      <p className={styles.quiet}>
        No sites yet. Generate three directions in <Link href="/studio">Studio</Link>{' '}
        and make one.
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {(limit ? state.sites.slice(0, limit) : state.sites).map((site) => (
        <li key={site.id} className={styles.row}>
          <Link href={`/studio/site/?id=${site.id}`} prefetch={false} className={styles.link}>
            <span className={styles.swatches} aria-hidden="true">
              {site.palette.slice(0, 4).map((color) => (
                <span key={color} style={{ background: color }} />
              ))}
            </span>
            <span className={styles.text}>
              <span className={styles.title}>{site.title}</span>
              <span className={styles.meta}>
                {site.stance} · {site.templateName} ·{' '}
                {site.revisions === 1 ? '1 revision' : `${site.revisions} revisions`}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
