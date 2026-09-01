'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSessionUser } from 'lib/authClient';
import styles from './AuthForm.module.css';

// A static export has no server-side route protection and needs none: the page
// renders a signed-out state client-side, and the *data* is protected at the
// API, which is the only place protection is ever real.
export default function AccountPanel() {
  const { user, isPending } = useSessionUser();
  const router = useRouter();

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
        <p className={styles.lede}>
          Signing in is only needed to generate with AI. Patterns, templates and
          library matches are open to everyone.
        </p>
        <p className={styles.swap}>
          <Link href="/sign-in">Sign in</Link> or{' '}
          <Link href="/sign-up">create an account</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.form}>
      <h1 className={styles.title}>Your account</h1>
      <p className={styles.lede}>
        Signed in as <strong>{user.email}</strong>.
      </p>
      <button
        type="button"
        className={styles.submit}
        onClick={async () => {
          await signOut();
          router.push('/');
        }}
      >
        Sign out
      </button>
      <p className={styles.swap}>
        <Link href="/studio">Back to Studio</Link>
      </p>
    </div>
  );
}
