import type { Metadata } from 'next';
import AdminPage from 'components/admin/AdminPage';
import { QuotasPanel } from 'components/admin/panels';

export const metadata: Metadata = { title: 'Quotas — Admin', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminPage title="Quotas">
      <QuotasPanel />
    </AdminPage>
  );
}
