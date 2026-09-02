import type { Metadata } from 'next';
import AdminPage from 'components/admin/AdminPage';
import { TemplatesPanel } from 'components/admin/panels';

export const metadata: Metadata = { title: 'Templates — Admin', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminPage title="Templates">
      <TemplatesPanel />
    </AdminPage>
  );
}
