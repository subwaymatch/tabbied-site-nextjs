import { SELF, env } from 'cloudflare:test';
import { beforeAll, describe, expect, it } from 'vitest';

const ORIGIN = 'https://tabbied.com';
const json = { 'content-type': 'application/json', origin: ORIGIN };

// The smallest valid PNG: a 1×1 transparent pixel.
const PNG = Uint8Array.from(
  atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='),
  (c) => c.charCodeAt(0)
);

async function signIn(email: string): Promise<string> {
  const signUp = await SELF.fetch(`${ORIGIN}/api/auth/sign-up/email`, {
    method: 'POST',
    headers: json,
    body: JSON.stringify({ email, password: 'correct horse battery staple', name: 'Test' }),
  });
  expect(signUp.status).toBe(200);
  const mail = await env.DB.prepare('SELECT url FROM dev_mail WHERE email = ?').bind(email).first<{ url: string }>();
  const verify = await SELF.fetch(mail!.url, { redirect: 'manual' });
  return verify.headers.getSetCookie().map((cookie) => cookie.split(';')[0]).join('; ');
}

const post = (cookie: string, blob: Blob, name = 'ref.png', note?: string) => {
  const form = new FormData();
  form.append('file', blob, name);
  if (note) form.append('note', note);
  return SELF.fetch(`${ORIGIN}/api/uploads`, { method: 'POST', headers: { cookie, origin: ORIGIN }, body: form });
};

describe('uploads', () => {
  let cookie: string;

  beforeAll(async () => {
    cookie = await signIn('uploader@example.com');
  });

  it('needs a session', async () => {
    const form = new FormData();
    form.append('file', new Blob([PNG], { type: 'image/png' }), 'x.png');
    expect((await SELF.fetch(`${ORIGIN}/api/uploads`, { method: 'POST', body: form, headers: { origin: ORIGIN } })).status).toBe(401);
    expect((await SELF.fetch(`${ORIGIN}/api/uploads`)).status).toBe(401);
  });

  it('judges the bytes, not the label', async () => {
    // Text with an image content-type is not an image.
    const fake = await post(cookie, new Blob(['hello'], { type: 'image/png' }));
    expect(fake.status).toBe(415);
  });

  it('stores a picture, lists it, serves it, and removes it', async () => {
    const made = await post(cookie, new Blob([PNG], { type: 'image/png' }), 'ref.png', 'the shopfront');
    expect(made.status, await made.clone().text()).toBe(200);
    const { id, src, contentType } = (await made.json()) as { id: string; src: string; contentType: string };
    expect(contentType).toBe('image/png');
    expect(src).toMatch(/^\/api\/media\/up\//);

    const list = (await SELF.fetch(`${ORIGIN}/api/uploads`, { headers: { cookie } }).then((r) => r.json())) as {
      uploads: { id: string; note: string | null }[];
    };
    expect(list.uploads.map((u) => u.id)).toEqual([id]);
    expect(list.uploads[0].note).toBe('the shopfront');

    const served = await SELF.fetch(`${ORIGIN}${src}`);
    expect(served.status).toBe(200);
    expect(served.headers.get('content-type')).toBe('image/png');

    // Someone else neither sees it nor can remove it.
    const other = await signIn('someone-else@example.com');
    const theirs = (await SELF.fetch(`${ORIGIN}/api/uploads`, { headers: { cookie: other } }).then((r) => r.json())) as { uploads: unknown[] };
    expect(theirs.uploads).toHaveLength(0);
    expect((await SELF.fetch(`${ORIGIN}/api/uploads/${id}`, { method: 'DELETE', headers: { cookie: other, origin: ORIGIN } })).status).toBe(404);

    const gone = await SELF.fetch(`${ORIGIN}/api/uploads/${id}`, { method: 'DELETE', headers: { cookie, origin: ORIGIN } });
    expect(gone.status).toBe(200);
    expect((await SELF.fetch(`${ORIGIN}${src}`)).status).toBe(404);
  });
});
