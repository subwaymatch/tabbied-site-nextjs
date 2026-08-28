/**
 * Everything the Worker is handed at runtime. `ASSETS` is the original binding
 * and still serves the overwhelming majority of requests; the rest arrived with
 * the platform tier (see agent-outputs/20260827-studio-ai-plan.md).
 *
 * Secrets are typed optional because they genuinely are: the Worker boots and
 * serves the site with none of them set, and each feature degrades on its own
 * (no AI key → the matcher answers; no mail key → verification links go to KV).
 * That is what keeps a missing secret a narrow failure instead of a dead site.
 */
export type Env = {
  ASSETS: { fetch(request: Request | string): Promise<Response> };

  DB: D1Database;
  KV: KVNamespace;
  MEDIA: R2Bucket;

  PUBLIC_ORIGIN: string;
  AI_BASE_URL: string;
  AI_MODEL: string;
  AI_IMAGE_MODEL: string;

  BETTER_AUTH_SECRET?: string;
  AI_API_KEY?: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;

  /** Set only in .dev.vars. Relaxes cookie flags and opens CORS to :3000. */
  DEV?: string;
};

export const isDev = (env: Env) => env.DEV === '1';
