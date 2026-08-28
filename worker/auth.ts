import { betterAuth } from 'better-auth';
import type { SecondaryStorage } from '@better-auth/core/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from './db/schema';
import type { Env } from './env';
import { isDev } from './env';
import { sendMail } from './lib/mail';

// better-auth over D1, built per request.
//
// It is a factory for the same reason `buildServer` is one on the MCP side:
// a Worker isolate is shared across requests and across *environments* during
// local dev, so capturing bindings in a module-scope singleton is a bug that
// only shows up under concurrency. Construction is cheap — no I/O — and the
// expensive part (session lookup) is a KV read, not a rebuild.

const SESSION_PREFIX = 'session:';

/**
 * Sessions are read from KV rather than D1 on every authenticated request; D1
 * stays the source of truth and KV is the cache better-auth invalidates for us.
 */
function kvSecondaryStorage(env: Env): SecondaryStorage {
  const k = (key: string) => `${SESSION_PREFIX}${key}`;

  return {
    get: (key) => env.KV.get(k(key)),

    set: async (key, value, ttl) => {
      await env.KV.put(k(key), value, {
        // KV rejects a TTL under 60s; better-auth can ask for less on a
        // short-lived record, and flooring it is harmless (D1 still governs).
        expirationTtl: ttl ? Math.max(60, ttl) : undefined,
      });
    },

    delete: (key) => env.KV.delete(k(key)),

    getAndDelete: async (key) => {
      const value = await env.KV.get(k(key));
      if (value !== null) {
        await env.KV.delete(k(key));
      }
      return value;
    },

    /**
     * Read-modify-write, and therefore **not** the atomic operation the
     * interface asks for — Workers KV has no compare-and-set. Two requests
     * landing in the same instant can read the same count and both write
     * n+1, so the counter under-counts under exactly the burst it is meant
     * to catch.
     *
     * That is an accepted trade here rather than a bug, because nothing that
     * costs money relies on it: better-auth's own rate limiting is
     * defence-in-depth over credential endpoints, and Studio's spend ceiling
     * is the D1 usage ledger (see lib/quota.ts), which is summed
     * transactionally and cannot drift. Moving these counters to D1 would buy
     * exactness for a write on every authenticated request; if that trade
     * ever flips, this is the one function to move.
     */
    increment: async (key, ttl) => {
      const current = Number((await env.KV.get(k(key))) ?? 0);
      const next = Number.isFinite(current) ? current + 1 : 1;

      await env.KV.put(k(key), String(next), {
        // Applied on creation only, per the interface: a window that slid
        // forward on every hit would never expire under sustained load.
        expirationTtl: next === 1 ? Math.max(60, ttl) : undefined,
      });

      return next;
    },
  };
}

function socialProviders(env: Env) {
  const providers: Record<string, { clientId: string; clientSecret: string }> = {};

  // A provider is configured or it is absent — never half-declared, which
  // renders a sign-in button that 500s on click.
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    };
  }
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  return providers;
}

export function buildAuth(env: Env) {
  const db = drizzle(env.DB, { schema });

  return betterAuth({
    // Missing in dev is survivable (the account is throwaway); missing in
    // production would silently sign cookies with a constant, so it throws
    // there via the same check the routes make before mounting.
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.PUBLIC_ORIGIN,
    basePath: '/api/auth',

    database: drizzleAdapter(db, { provider: 'sqlite', schema }),
    secondaryStorage: kvSecondaryStorage(env),

    emailAndPassword: {
      enabled: true,
      // The account exists but cannot sign in until the link is followed. The
      // AI endpoints check the session, so this is also the first gate on
      // spending money for a throwaway address.
      requireEmailVerification: true,
      sendResetPassword: async ({ user, url }) => {
        await sendMail(env, {
          to: user.email,
          subject: 'Reset your Tabbied password',
          url,
          text: `Reset your Tabbied password:\n\n${url}\n\nIf you didn't ask for this, ignore it.`,
        });
      },
    },

    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendMail(env, {
          to: user.email,
          subject: 'Confirm your Tabbied account',
          url,
          text: `Confirm your Tabbied account:\n\n${url}`,
        });
      },
    },

    socialProviders: socialProviders(env),

    advanced: {
      // The site and the API are the same origin in production, so the cookie
      // needs no cross-site relaxation. In dev they are :3000 and :8787, which
      // is cross-*port* — same-site by the cookie spec — so only Secure has to
      // give way for plain http.
      useSecureCookies: !isDev(env),
    },

    // Dev only. In production this list is empty and the origin check falls
    // back to baseURL, which is the whole point of being same-origin.
    trustedOrigins: isDev(env)
      ? ['http://localhost:3000', 'http://localhost:8787']
      : [],
  });
}

export type Auth = ReturnType<typeof buildAuth>;
