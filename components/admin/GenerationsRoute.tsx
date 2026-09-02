'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { GenerationsPanel, GenerationDetailPanel } from './panels';
import styles from './admin.module.css';

export default function GenerationsRoute() {
  const id = useSearchParams().get('id');

  if (id) {
    return (
      <>
        <p className={styles.quiet}>
          <Link href="/admin/generations/" prefetch={false}>&larr; All generations</Link>
        </p>
        <GenerationDetailPanel id={id} />
      </>
    );
  }

  return <GenerationsPanel />;
}
