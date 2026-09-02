'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSessionUser } from 'lib/authClient';
import styles from './admin.module.css';

const LINKS = [
  ['/admin/', 'Overview'],
  ['/admin/users/', 'Users'],
  ['/admin/usage/', 'AI usage'],
  ['/admin/generations/', 'Generations'],
  ['/admin/templates/', 'Templates'],
  ['/admin/uploads/', 'Uploads'],
  ['/admin/quotas/', 'Quotas'],
  ['/admin/mail/', 'Mail'],
] as const;

/**
 * The admin frame. The role check here decides only what to *render*; every
 * /api/admin route reads the role itself and answers 404 to anyone else, so a
 * person who defeats this sees an empty page and nothing more.
 */
export default function AdminPage({ title, children }: { title: string; children: ReactNode }) {
  const pathname = usePathname();
  const { user, isPending } = useSessionUser();

  if (isPending) return <p className={styles.quiet}>Checking your session…</p>;

  if (!user || user.role !== 'admin') {
    return (
      <div className={styles.wrap}>
        <h1 className={styles.title}>Not found</h1>
        <p className={styles.quiet}>
          <Link href="/">Home</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <nav className={styles.nav} aria-label="Admin">
        {LINKS.map(([href, label]) => {
          const current = pathname === href || pathname === href.replace(/\/$/, '');
          return (
            <Link key={href} href={href} prefetch={false} className={`${styles.navLink} ${current ? styles.navOn : ''}`} aria-current={current ? 'page' : undefined}>
              {label}
            </Link>
          );
        })}
      </nav>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
}
