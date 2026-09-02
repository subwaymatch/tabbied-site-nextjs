'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useSessionUser } from 'lib/authClient';
import AccountNav from './AccountNav';
import styles from './AuthForm.module.css';

/**
 * The frame every account page sits in: waits for the session, turns a
 * signed-out visitor away with a link, and otherwise shows the nav, a title
 * and the page. Shared so the five pages differ only in their body.
 */
export default function AccountPage({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  const { user, isPending } = useSessionUser();

  if (isPending) {
    return (
      <div className={styles.form}>
        <p className={styles.lede}>Checking your session…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.form}>
        <h1 className={styles.title}>You&rsquo;re signed out</h1>
        <p className={styles.lede}>Sign in to see your account.</p>
        <p className={styles.swap}>
          <Link href="/sign-in?next=%2Faccount">Sign in</Link>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.form}>
      <AccountNav />
      <h1 className={styles.title}>{title}</h1>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
      {children}
    </div>
  );
}
