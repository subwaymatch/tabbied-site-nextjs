import { SELF, env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';

const ORIGIN = 'https://tabbied.com';
const json = { 'content-type': 'application/json', origin: ORIGIN };

async function signIn(email: string): Promise<string> {
  await SELF.fetch(`${ORIGIN}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ email, password: 'correct horse battery staple', name: 'Test' }),
  });
  const mail = await env.DB.prepare('SELECT url FROM dev_mail WHERE email = ?').bind(email).first<{ url: string }>();
  const verify = await SELF.fetch(mail!.url, { redirect: 'manual' });
  return verify.headers.getSetCookie().map((cookie) => cookie.split(';')[0]).join('; ');
}

const ROUTES = ['overview', 'users', 'usage', 'generations', 'templates', 'uploads', 'quotas', 'mail'];

describe('the admin tier', () => {
  let member: string;
  let admin: string;

  beforeAll(async () => {
    member = await signIn('member@example.com');
    admin = await signIn('boss@example.com');
    // The first admin comes from outside the app — scripts/admin-grant.mjs
    // does this against D1; the test does it directly.
    await env.DB.prepare("UPDATE user SET role = 'admin' WHERE email = ?").bind('boss@example.com').run();
  });

  it('does not exist for anyone else', async () => {
    for (const route of ROUTES) {
      expect((await SELF.fetch(`${ORIGIN}/api/admin/${route}`)).status, route).toBe(404);
      expect((await SELF.fetch(`${ORIGIN}/api/admin/${route}`, { headers: { cookie: member } })).status, route).toBe(404);
    }
  });

  it('answers an admin on every route', async () => {
    // The role is read from the session, which the cookie cache may hold
    // for a few minutes; a fresh sign-in after the grant is the honest shape.
    const fresh = await SELF.fetch(`${ORIGIN}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: json,
      body: JSON.stringify({ email: 'boss@example.com', password: 'correct horse battery staple' }),
    });
    const cookie = fresh.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ') || admin;

    for (const route of ROUTES) {
      const response = await SELF.fetch(`${ORIGIN}/api/admin/${route}`, { headers: { cookie } });
      expect(response.status, `${route}: ${await response.clone().text()}`).toBe(200);
    }

    const overview = (await SELF.fetch(`${ORIGIN}/api/admin/overview`, { headers: { cookie } }).then((r) => r.json())) as { users: number };
    expect(overview.users).toBeGreaterThanOrEqual(2);

    const users = (await SELF.fetch(`${ORIGIN}/api/admin/users?q=member`, { headers: { cookie } }).then((r) => r.json())) as { users: { email: string; role: string | null }[] };
    expect(users.users.map((u) => u.email)).toEqual(['member@example.com']);

    const quotas = (await SELF.fetch(`${ORIGIN}/api/admin/quotas`, { headers: { cookie } }).then((r) => r.json())) as { editable: boolean };
    expect(quotas.editable).toBe(false);
  });
});
