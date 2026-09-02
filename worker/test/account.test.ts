import { SELF, env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

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

describe('account usage', () => {
  it('needs a session', async () => {
    expect((await SELF.fetch(`${ORIGIN}/api/account/usage`)).status).toBe(401);
  });

  it('reports every cap, and counts what the person spent today', async () => {
    const cookie = await signIn('spender@example.com');

    const before = (await SELF.fetch(`${ORIGIN}/api/account/usage`, { headers: { cookie } }).then((r) => r.json())) as {
      usage: { endpoint: string; used: number; cap: number }[];
      recent: unknown[];
    };
    expect(before.usage.map((row) => row.endpoint).sort()).toEqual(['direction-image', 'directions', 'site', 'site-image']);
    expect(before.usage.every((row) => row.used === 0 && row.cap > 0)).toBe(true);
    expect(before.recent).toHaveLength(0);

    // A generation with no upstream is answered from the matcher and spends
    // nothing, so the ledger stays empty — which is the honest number.
    await SELF.fetch(`${ORIGIN}/api/studio/directions`, {
      method: 'POST',
      headers: { ...json, cookie },
      body: JSON.stringify({ description: 'A bakery in a small coastal town, sourdough and coffee.' }),
    });
    const after = (await SELF.fetch(`${ORIGIN}/api/account/usage`, { headers: { cookie } }).then((r) => r.json())) as {
      usage: { endpoint: string; used: number }[];
    };
    expect(after.usage.find((row) => row.endpoint === 'directions')?.used).toBe(0);
  });
});
