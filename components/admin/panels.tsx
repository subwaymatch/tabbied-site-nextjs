'use client';

// The admin panels, one per page. Tables over the /api/admin reads, with the
// two actions the tier has — role and ban — going through better-auth's own
// admin endpoints via the client plugin.
import { useState } from 'react';
import Link from 'next/link';
import { apiUrl } from 'lib/apiFetch';
import { authClient } from 'lib/authClient';
import { money, useAdminData, when } from './useAdminData';
import styles from './admin.module.css';

const Load = ({ error }: { error: string | null }) => (
  <p className={styles.quiet}>{error ?? 'Loading…'}</p>
);

export function OverviewPanel() {
  const { data, error } = useAdminData<{
    users: number; newUsersThisWeek: number; generationsThisWeek: number; sitesThisWeek: number;
    fallbackRate: number; aiCallsToday: number; aiCostToday: number; imagesThisWeek: number;
  }>('/api/admin/overview');

  if (!data) return <Load error={error} />;

  const tiles: [string, string][] = [
    ['Users', String(data.users)],
    ['New this week', String(data.newUsersThisWeek)],
    ['Generations this week', String(data.generationsThisWeek)],
    ['Sites this week', String(data.sitesThisWeek)],
    ['Fallback rate', `${Math.round(data.fallbackRate * 100)}%`],
    ['AI calls today', String(data.aiCallsToday)],
    ['AI cost today (est.)', money(data.aiCostToday)],
    ['Images this week', String(data.imagesThisWeek)],
  ];

  return (
    <ul className={styles.tiles}>
      {tiles.map(([label, value]) => (
        <li key={label} className={styles.tile}>
          <span className={styles.tileValue}>{value}</span>
          <span className={styles.tileLabel}>{label}</span>
        </li>
      ))}
    </ul>
  );
}

type UserRow = { id: string; name: string; email: string; emailVerified: boolean; role: string | null; banned: boolean | null; createdAt: string; sites: number; generations: number };

export function UsersPanel() {
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { data, error, reload } = useAdminData<{ users: UserRow[] }>(`/api/admin/users?q=${encodeURIComponent(query)}`);

  const act = async (id: string, action: () => Promise<{ error?: { message?: string } | null }>) => {
    setBusy(id);
    setMessage(null);
    const result = await action();
    setBusy(null);
    if (result.error) setMessage(result.error.message ?? 'That did not work.');
    else reload();
  };

  return (
    <>
      <form
        className={styles.search}
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(q.trim());
        }}
      >
        <input type="search" placeholder="Email or name" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="submit" className={styles.button}>Search</button>
      </form>
      {message ? <p className={styles.error} role="alert">{message}</p> : null}
      {!data ? (
        <Load error={error} />
      ) : (
        <div className={styles.scroll}>
          <table className={styles.table}>
            <thead>
              <tr><th>Email</th><th>Name</th><th>Joined</th><th>Sites</th><th>Gens</th><th>Role</th><th>State</th><th></th></tr>
            </thead>
            <tbody>
              {data.users.map((row) => (
                <tr key={row.id}>
                  <td><Link href={`/admin/users/?id=${row.id}`} prefetch={false}>{row.email}</Link>{row.emailVerified ? '' : ' (unverified)'}</td>
                  <td>{row.name}</td>
                  <td>{when(row.createdAt)}</td>
                  <td>{row.sites}</td>
                  <td>{row.generations}</td>
                  <td>{row.role ?? 'user'}</td>
                  <td>{row.banned ? 'Banned' : 'Active'}</td>
                  <td className={styles.actions}>
                    <button type="button" className={styles.small} disabled={busy !== null}
                      onClick={() => void act(row.id, () => authClient.admin.setRole({ userId: row.id, role: row.role === 'admin' ? 'user' : 'admin' }))}>
                      {row.role === 'admin' ? 'Remove admin' : 'Make admin'}
                    </button>
                    <button type="button" className={styles.small} disabled={busy !== null}
                      onClick={() => void act(row.id, () => (row.banned ? authClient.admin.unbanUser({ userId: row.id }) : authClient.admin.banUser({ userId: row.id, banReason: 'Banned from the admin page' })))}>
                      {row.banned ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export function UserDetailPanel({ id }: { id: string }) {
  const { data, error } = useAdminData<{
    user: UserRow & { banReason: string | null; banExpires: string | null };
    sites: { id: string; slug: string; title: string; updatedAt: string }[];
    generations: { id: string; description: string; source: string; model: string; createdAt: string }[];
    usageToday: { endpoint: string; calls: number; cost: number; cap: number | null }[];
  }>(`/api/admin/users/${id}`);

  if (!data) return <Load error={error} />;

  return (
    <>
      <p className={styles.quiet}>
        <strong>{data.user.email}</strong> · {data.user.name} · joined {when(data.user.createdAt)} · {data.user.role ?? 'user'}
        {data.user.banned ? ` · banned${data.user.banReason ? `: ${data.user.banReason}` : ''}` : ''}
      </p>

      <h2 className={styles.h2}>Today</h2>
      {data.usageToday.length === 0 ? <p className={styles.quiet}>No AI calls today.</p> : (
        <ul className={styles.plain}>
          {data.usageToday.map((u) => <li key={u.endpoint}>{u.endpoint}: {u.calls}{u.cap ? ` / ${u.cap}` : ''} · {money(u.cost)}</li>)}
        </ul>
      )}

      <h2 className={styles.h2}>Sites</h2>
      {data.sites.length === 0 ? <p className={styles.quiet}>None.</p> : (
        <ul className={styles.plain}>
          {data.sites.map((s) => <li key={s.id}><Link href={`/studio/site/?id=${s.id}`} prefetch={false}>{s.title}</Link> · {s.slug} · {when(s.updatedAt)}</li>)}
        </ul>
      )}

      <h2 className={styles.h2}>Generations</h2>
      {data.generations.length === 0 ? <p className={styles.quiet}>None.</p> : (
        <ul className={styles.plain}>
          {data.generations.map((g) => <li key={g.id}><Link href={`/admin/generations/?id=${g.id}`} prefetch={false}>{g.description.slice(0, 80)}</Link> · {g.source} · {when(g.createdAt)}</li>)}
        </ul>
      )}
    </>
  );
}

export function UsagePanel() {
  const [days, setDays] = useState(14);
  const { data, error } = useAdminData<{
    days: number;
    byDay: { day: string; endpoint: string; calls: number; promptTokens: number; completionTokens: number; images: number; cost: number }[];
    topUsers: { userId: string; email: string; calls: number; cost: number }[];
  }>(`/api/admin/usage?days=${days}`);

  return (
    <>
      <div className={styles.search}>
        {[7, 14, 30, 90].map((n) => (
          <button key={n} type="button" className={`${styles.small} ${n === days ? styles.smallOn : ''}`} onClick={() => setDays(n)}>{n} days</button>
        ))}
      </div>
      {!data ? <Load error={error} /> : (
        <>
          <div className={styles.scroll}>
            <table className={styles.table}>
              <thead><tr><th>Day</th><th>Endpoint</th><th>Calls</th><th>Prompt tokens</th><th>Output tokens</th><th>Images</th><th>Cost (est.)</th></tr></thead>
              <tbody>
                {data.byDay.map((r, i) => (
                  <tr key={i}><td>{r.day}</td><td>{r.endpoint}</td><td>{r.calls}</td><td>{r.promptTokens}</td><td>{r.completionTokens}</td><td>{r.images}</td><td>{money(r.cost)}</td></tr>
                ))}
                {data.byDay.length === 0 ? <tr><td colSpan={7} className={styles.quiet}>Nothing in this window.</td></tr> : null}
              </tbody>
            </table>
          </div>
          <h2 className={styles.h2}>Top users</h2>
          <ul className={styles.plain}>
            {data.topUsers.map((u) => <li key={u.userId}><Link href={`/admin/users/?id=${u.userId}`} prefetch={false}>{u.email}</Link> · {u.calls} calls · {money(u.cost)}</li>)}
          </ul>
        </>
      )}
    </>
  );
}

export function GenerationsPanel() {
  const { data, error } = useAdminData<{ generations: { id: string; userEmail: string; description: string; source: string; model: string; createdAt: string; sites: number }[] }>('/api/admin/generations?limit=100');
  if (!data) return <Load error={error} />;
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead><tr><th>When</th><th>Who</th><th>Description</th><th>Source</th><th>Model</th><th>Sites</th></tr></thead>
        <tbody>
          {data.generations.map((g) => (
            <tr key={g.id}>
              <td>{when(g.createdAt)}</td>
              <td>{g.userEmail}</td>
              <td><Link href={`/admin/generations/?id=${g.id}`} prefetch={false}>{g.description.slice(0, 90)}</Link></td>
              <td>{g.source}</td><td>{g.model}</td><td>{g.sites}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GenerationDetailPanel({ id }: { id: string }) {
  const { data, error } = useAdminData<{ id: string; userEmail: string; description: string; source: string; model: string; responseId: string | null; createdAt: string; result: unknown; sites: { id: string; title: string; slug: string; revisions: number }[] }>(`/api/admin/generations/${id}`);
  if (!data) return <Load error={error} />;
  return (
    <>
      <p className={styles.quiet}>{data.userEmail} · {when(data.createdAt)} · {data.source} · {data.model}{data.responseId ? ` · ${data.responseId}` : ''}</p>
      <p>{data.description}</p>
      <p className={styles.quiet}><Link href={`/studio/results/?g=${data.id}`} prefetch={false}>Open the results page</Link></p>
      <h2 className={styles.h2}>Sites made from it</h2>
      {data.sites.length === 0 ? <p className={styles.quiet}>None.</p> : (
        <ul className={styles.plain}>{data.sites.map((s) => <li key={s.id}><Link href={`/studio/site/?id=${s.id}`} prefetch={false}>{s.title}</Link> · {s.slug} · {s.revisions} revisions</li>)}</ul>
      )}
      <h2 className={styles.h2}>Document</h2>
      <pre className={styles.pre}>{JSON.stringify(data.result, null, 2)}</pre>
    </>
  );
}

export function TemplatesPanel() {
  const { data, error } = useAdminData<{ templates: { slug: string; name: string; copyRoles: string[]; slots: Record<string, number>; patterns: string[]; sites: number }[] }>('/api/admin/templates');
  if (!data) return <Load error={error} />;
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead><tr><th>Template</th><th>Sites</th><th>Brand roles</th><th>Text</th><th>Images</th><th>Patterns</th></tr></thead>
        <tbody>
          {data.templates.map((t) => (
            <tr key={t.slug}>
              <td><Link href={`/template/${t.slug}/`} prefetch={false}>{t.name}</Link></td>
              <td>{t.sites}</td>
              <td>{t.copyRoles.length ? t.copyRoles.join(', ') : '—'}</td>
              <td>{t.slots.text ?? 0}</td><td>{t.slots.image ?? 0}</td><td>{t.patterns.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UploadsPanel() {
  const [busy, setBusy] = useState<string | null>(null);
  const { data, error, reload } = useAdminData<{ uploads: { id: string; src: string; bytes: number; note: string | null; createdAt: string; userEmail: string }[] }>('/api/admin/uploads?limit=100');
  if (!data) return <Load error={error} />;
  return (
    <ul className={styles.grid}>
      {data.uploads.map((u) => (
        <li key={u.id} className={styles.cell}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={apiUrl(u.src)} alt={u.note ?? ''} />
          <div className={styles.cellFoot}>
            <span className={styles.quiet}>{u.userEmail}</span>
            <button type="button" className={styles.small} disabled={busy !== null} onClick={async () => {
              setBusy(u.id);
              await fetch(apiUrl(`/api/admin/uploads/${u.id}`), { method: 'DELETE', credentials: 'include' });
              setBusy(null);
              reload();
            }}>{busy === u.id ? 'Removing…' : 'Remove'}</button>
          </div>
        </li>
      ))}
      {data.uploads.length === 0 ? <li className={styles.quiet}>No uploads.</li> : null}
    </ul>
  );
}

export function QuotasPanel() {
  const { data, error } = useAdminData<{ caps: Record<string, { calls: number; label: string }>; editable: boolean }>('/api/admin/quotas');
  if (!data) return <Load error={error} />;
  return (
    <>
      <table className={styles.table}>
        <thead><tr><th>Endpoint</th><th>Daily cap</th><th>Label</th></tr></thead>
        <tbody>{Object.entries(data.caps).map(([k, v]) => <tr key={k}><td>{k}</td><td>{v.calls}</td><td>{v.label}</td></tr>)}</tbody>
      </table>
      <p className={styles.quiet}>
        Read-only. The caps live in <code>worker/lib/quota.ts</code> and the burst windows in the routes; editing them here would mean a settings table read on every call.
      </p>
    </>
  );
}

export function MailPanel() {
  const { data, error } = useAdminData<{ mail: { email: string; subject: string; url: string; createdAt: string }[] }>('/api/admin/mail');
  if (!data) return <Load error={error ?? 'Only available in development.'} />;
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead><tr><th>When</th><th>To</th><th>Subject</th><th>Link</th></tr></thead>
        <tbody>{data.mail.map((m, i) => <tr key={i}><td>{when(m.createdAt)}</td><td>{m.email}</td><td>{m.subject}</td><td><a href={m.url}>Open</a></td></tr>)}</tbody>
      </table>
    </div>
  );
}
