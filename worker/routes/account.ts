import { Hono } from 'hono';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';
import { aiUsage } from '../db/schema';
import type { Env } from '../env';
import { DAILY_CAPS, type Endpoint } from '../lib/quota';
import { requireUser } from '../lib/session';

// A person's own account data beyond what better-auth serves: today's spend
// against the caps, and the recent ledger. Session-scoped throughout.

const account = new Hono<{ Bindings: Env }>();

const startOfUtcDay = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

account.get('/usage', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to see your usage.' }, 401);
  }

  const db = drizzle(c.env.DB, { schema });
  const since = startOfUtcDay();

  const today = await db
    .select({ endpoint: aiUsage.endpoint, calls: sql<number>`count(*)` })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, userId), gte(aiUsage.createdAt, since)))
    .groupBy(aiUsage.endpoint);

  const used = new Map(today.map((row) => [row.endpoint, Number(row.calls)]));

  const usage = (Object.keys(DAILY_CAPS) as Endpoint[]).map((endpoint) => ({
    endpoint,
    label: DAILY_CAPS[endpoint].label,
    used: used.get(endpoint) ?? 0,
    cap: DAILY_CAPS[endpoint].calls,
  }));

  const recent = await db
    .select({
      endpoint: aiUsage.endpoint,
      model: aiUsage.model,
      promptTokens: aiUsage.promptTokens,
      completionTokens: aiUsage.completionTokens,
      imageCount: aiUsage.imageCount,
      createdAt: aiUsage.createdAt,
    })
    .from(aiUsage)
    .where(eq(aiUsage.userId, userId))
    .orderBy(desc(aiUsage.createdAt))
    .limit(30);

  return c.json({ resetsAt: new Date(since.getTime() + 86_400_000), usage, recent });
});

export default account;
