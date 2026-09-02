import { Suspense } from 'react';
import type { Metadata } from 'next';
import AdminPage from 'components/admin/AdminPage';
import GenerationsRoute from 'components/admin/GenerationsRoute';

export const metadata: Metadata = { title: 'Generations — Admin', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminPage title="Generations">
      {/* ?id= selects one; the export cannot enumerate ids, so it is a query. */}
      <Suspense>
        <GenerationsRoute />
      </Suspense>
    </AdminPage>
  );
}
