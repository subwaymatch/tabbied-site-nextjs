'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { UsersPanel, UserDetailPanel } from './panels';
import styles from './admin.module.css';

export default function UsersRoute() {
  const id = useSearchParams().get('id');

  if (id) {
    return (
      <>
        <p className={styles.quiet} style={{ marginBottom: 20 }}>
          <Link href="/admin/users/" prefetch={false}>&larr; All users</Link>
        </p>
        <UserDetailPanel id={id} />
      </>
    );
  }

  return <UsersPanel />;
}
