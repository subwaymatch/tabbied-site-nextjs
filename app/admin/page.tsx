import type { Metadata } from 'next';
import AdminPage from 'components/admin/AdminPage';
import { OverviewPanel } from 'components/admin/panels';

export const metadata: Metadata = { title: 'Admin — Tabbied', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminPage title="Overview">
      <OverviewPanel />
    </AdminPage>
  );
}
