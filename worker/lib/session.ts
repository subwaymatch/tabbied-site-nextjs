import { buildAuth } from '../auth';
import type { Env } from '../env';

/**
 * Every route that spends money or writes resolves the caller first. Takes the
 * bindings and the headers rather than the context, so it stays independent of
 * Hono's generics and is trivially callable from a test.
 */
export async function requireUser(env: Env, headers: Headers): Promise<string | null> {
  const auth = buildAuth(env);
  const session = await auth.api.getSession({ headers });

  return session?.user?.id ?? null;
}
