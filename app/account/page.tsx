import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import { AuthShell } from 'components/account/AuthForm';
import AccountPanel from 'components/account/AccountPanel';
import styles from 'components/studio/studio.module.css';

export const metadata: Metadata = {
  title: 'Account — Tabbied',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={`${styles.page} ${plexMono.variable}`}>
      <div className={`${styles.rule} ${styles.ruleLeft}`} aria-hidden="true" />
      <div className={`${styles.rule} ${styles.ruleRight}`} aria-hidden="true" />

      <AuthShell>
        <AccountPanel />
      </AuthShell>
    </div>
  );
}
