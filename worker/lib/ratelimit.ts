import type { Env } from '../env';

// A sliding-ish burst limiter on KV: a fixed window per key, created with a TTL
// and incremented within it.
//
// It is approximate, for the reason spelled out on the secondary storage's
// `increment` in auth.ts — KV cannot compare-and-set, so two requests in the
// same instant can both read n and both write n+1. That is acceptable here
// because this is the *cheap* gate: it exists to stop a script hammering an
// endpoint, and the exact ceiling on anything that costs money is the D1 ledger
// behind it (lib/quota.ts).

export type Limit = { key: string; max: number; windowSeconds: number };

export type LimitVerdict = { ok: true } | { ok: false; retryAfter: number };

export async function consume(env: Env, limit: Limit): Promise<LimitVerdict> {
  const key = `rl:${limit.key}`;
  const current = Number((await env.KV.get(key)) ?? 0);
  const next = Number.isFinite(current) ? current + 1 : 1;

  if (next > limit.max) {
    return { ok: false, retryAfter: limit.windowSeconds };
  }

  await env.KV.put(key, String(next), {
    // Only on creation: a window that slid forward on every hit would never
    // expire under sustained load, which turns a rate limit into a ban.
    // KV's floor is 60s.
    expirationTtl: next === 1 ? Math.max(60, limit.windowSeconds) : undefined,
  });

  return { ok: true };
}

/** The client IP as Cloudflare sees it, for limiting requests with no session. */
export const clientIp = (request: Request) =>
  request.headers.get('cf-connecting-ip') ?? 'unknown';
