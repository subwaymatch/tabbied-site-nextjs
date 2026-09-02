import type { Metadata } from 'next';
import AdminPage from 'components/admin/AdminPage';
import { MailPanel } from 'components/admin/panels';

export const metadata: Metadata = { title: 'Mail — Admin', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <AdminPage title="Mail">
      <MailPanel />
    </AdminPage>
  );
}
