import { Hono } from 'hono';
import { and, desc, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { z } from 'zod';
import {
  directionToEdits,
  hasErrors,
  planEdits,
  type EditsDocument,
  type TemplateSpec,
} from 'tabbied-templates';
import type {
  SiteDocument,
  SiteSummary,
  StoredResult,
  StoredRevision,
} from '../../lib/studioDocument';
import * as schema from '../db/schema';
import { generation, revision, site } from '../db/schema';
import type { Env } from '../env';
import { respondJson, hasUpstream, UpstreamError } from '../ai/client';
import { siteSystemPrompt, siteUserPrompt } from '../ai/prompt';
import { buildSiteValidator, siteJsonSchema, siteSlots } from '../ai/siteSchema';
import { checkQuota, recordUsage } from '../lib/quota';
import { consume } from '../lib/ratelimit';
import { requireUser } from '../lib/session';
import { hashText, loadPackagedHtml, loadTemplateSpec } from '../lib/templateAssets';

// A site is a direction someone chose to make: the full document — every text
// slot on the template rewritten for the business — pinned to the template it
// was written against, with a revision history from the first draft on.
//
// The directions call picks three from a scored dozen and writes three
// strings each; this is the second, dearer stage, and it is behind a click for
// that reason. Nothing here reaches the 52 unannotated pages any differently
// from the five annotated ones: the document is keyed by slot id, and every
// template has those.

const BURST = { max: 3, windowSeconds: 60 };

/** Over-estimate for an upstream that omitted `usage`, as in studio.ts. */
const ESTIMATED_TOKENS = { prompt: 8_000, completion: 4_000 };

const requestSchema = z.object({
  generationId: z.string().min(8).max(64),
  index: z.number().int().min(0).max(2),
});

const sites = new Hono<{ Bindings: Env }>();

const newId = () => crypto.randomUUID().replace(/-/g, '');

/**
 * The output budget scales with the page. Reasoning is spent from the same
 * cap before any text is emitted, and a 300-slot bespoke page is a long
 * answer — a cap sized for three strings comes back `incomplete` with nothing.
 */
const outputBudget = (slotCount: number) => Math.min(24_000, 3_000 + slotCount * 60);

sites.post('/', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to make a site.' }, 401);
  }

  const parsed = requestSchema.safeParse(await c.req.json().catch(() => null));

  if (!parsed.success) {
    return c.json({ error: 'Choose a direction to make.' }, 400);
  }

  const { generationId, index } = parsed.data;
  const db = drizzle(c.env.DB, { schema });

  const [row] = await db
    .select()
    .from(generation)
    .where(eq(generation.id, generationId))
    .limit(1);

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  const result = JSON.parse(row.result) as StoredResult;
  const direction = result.directions[index];

  if (!direction) {
    return c.json({ error: 'That direction is not in this set.' }, 404);
  }

  // Idempotent per (person, generation, direction): a double-click or a retry
  // lands on the site that already exists rather than spending again.
  const [existing] = await db
    .select({ id: site.id })
    .from(site)
    .where(
      and(
        eq(site.userId, userId),
        eq(site.generationId, generationId),
        eq(site.directionIndex, index)
      )
    )
    .limit(1);

  if (existing) {
    return c.json({ id: existing.id, source: 'existing' });
  }

  const burst = await consume(db, { key: `site:${userId}`, ...BURST });

  if (!burst.ok) {
    return c.json({ error: 'Too fast. Try again in a minute.' }, 429, {
      'retry-after': String(burst.retryAfter),
    });
  }

  const quota = await checkQuota(db, userId, 'site');

  if (!quota.ok) {
    return c.json({ error: quota.message }, 429);
  }

  const [spec, html] = await Promise.all([
    loadTemplateSpec(c.env, c.req.raw, direction.slug),
    loadPackagedHtml(c.env, c.req.raw, direction.slug),
  ]);
  const templateHash = await hashText(html);
  const slots = siteSlots(spec);

  // The three-string rebrand is both the fallback and the floor: whatever the
  // model manages, the page is at least branded.
  const floor = directionToEdits(spec, { copy: direction.copy, palette: direction.palette });

  let edits: EditsDocument = floor;
  let source: 'ai' | 'fallback' = 'fallback';
  let model = 'none';
  let responseId: string | undefined;

  if (hasUpstream(c.env) && slots.length > 0) {
    const validator = buildSiteValidator(slots);
    const instructions = siteSystemPrompt(direction, spec.site.name);
    const user = siteUserPrompt(row.description, slots);

    let usage = { promptTokens: 0, completionTokens: 0 };
    let repairNote = '';
    let previousResponseId: string | undefined;
    let done = false;

    for (let attempt = 0; attempt < 2 && !done; attempt++) {
      const chained = attempt > 0 && previousResponseId !== undefined;

      try {
        const completion = await respondJson(c.env, {
          instructions,
          input: attempt === 0 ? user : chained ? repairNote : `${user}\n\n${repairNote}`,
          schemaName: 'studio_site',
          schema: siteJsonSchema(slots),
          maxOutputTokens: outputBudget(slots.length),
          previousResponseId: chained ? previousResponseId : undefined,
        });

        model = completion.model;
        responseId = completion.responseId ?? responseId;
        previousResponseId = completion.responseId;
        usage = {
          promptTokens:
            usage.promptTokens + (completion.usage.promptTokens || ESTIMATED_TOKENS.prompt),
          completionTokens:
            usage.completionTokens +
            (completion.usage.completionTokens || ESTIMATED_TOKENS.completion),
        };

        const checked = validator.safeParse(JSON.parse(completion.content) as unknown);

        if (!checked.success) {
          repairNote =
            'Your previous answer was rejected. Fix exactly these problems:\n' +
            checked.error.issues
              .slice(0, 40)
              .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
              .join('\n');
          continue;
        }

        // The engine's own planner is the second gate — pure, so it runs here
        // with no DOM — and what it rejects is what the page would reject.
        const candidate: EditsDocument = {
          specVersion: spec.specVersion,
          slug: spec.site.slug,
          edits: { text: checked.data.text, ...(floor.edits.palette ? { palette: floor.edits.palette } : {}) },
        };
        const plan = planEdits(spec, candidate);

        if (hasErrors(plan.problems)) {
          repairNote =
            'Your previous answer was rejected. Fix exactly these problems:\n' +
            plan.problems
              .filter((problem) => problem.level === 'error')
              .slice(0, 40)
              .map((problem) => `- ${problem.path}: ${problem.message}`)
              .join('\n');
          continue;
        }

        edits = candidate;
        source = 'ai';
        done = true;
      } catch (error) {
        if (error instanceof UpstreamError || error instanceof SyntaxError) {
          console.error(`studio/sites: ${String(error)}`);
          break;
        }
        throw error;
      }
    }

    // Recorded whether or not it produced a document: a failed call still
    // spent tokens.
    await recordUsage(db, {
      userId,
      endpoint: 'site',
      model,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
    });
  }

  const id = newId();
  const now = new Date();

  await db.insert(site).values({
    id,
    userId,
    generationId,
    directionIndex: index,
    slug: direction.slug,
    title: direction.copy?.brandName ?? direction.name,
    specVersion: spec.specVersion,
    templateHash,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(revision).values({
    id: newId(),
    siteId: id,
    n: 1,
    edits: JSON.stringify(edits),
    instruction: null,
    source,
    model,
    responseId: source === 'ai' ? (responseId ?? null) : null,
    createdAt: now,
  });

  return c.json({ id, source });
});

/** The signed-in person's own sites, newest first. Session-scoped, never by id. */
sites.get('/', async (c) => {
  const userId = await requireUser(c.env, c.req.raw.headers);

  if (!userId) {
    return c.json({ error: 'Sign in to see your sites.' }, 401);
  }

  const db = drizzle(c.env.DB, { schema });

  const rows = await db
    .select({
      id: site.id,
      slug: site.slug,
      title: site.title,
      generationId: site.generationId,
      directionIndex: site.directionIndex,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
      result: generation.result,
      revisions: sql<number>`(select count(*) from ${revision} where ${revision.siteId} = ${site.id})`,
    })
    .from(site)
    .innerJoin(generation, eq(generation.id, site.generationId))
    .where(eq(site.userId, userId))
    .orderBy(desc(site.updatedAt))
    .limit(100);

  const summaries: SiteSummary[] = rows.map((row) => {
    const direction = (JSON.parse(row.result) as StoredResult).directions[row.directionIndex];

    return {
      id: row.id,
      slug: row.slug,
      templateName: direction?.name ?? row.slug,
      title: row.title,
      stance: direction?.stance ?? '',
      palette: direction?.palette ?? [],
      revisions: Number(row.revisions),
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  });

  return c.json({ sites: summaries });
});

/**
 * One site with its latest revision. Unauthenticated by design, like a
 * generation: the 128-bit id is the capability. The template's current hash
 * is compared to the pinned one so drift is reported, not discovered.
 */
sites.get('/:id', async (c) => {
  const db = drizzle(c.env.DB, { schema });

  const [row] = await db
    .select({
      site,
      description: generation.description,
      result: generation.result,
    })
    .from(site)
    .innerJoin(generation, eq(generation.id, site.generationId))
    .where(eq(site.id, c.req.param('id')))
    .limit(1);

  if (!row) {
    return c.json({ error: 'Not found' }, 404);
  }

  const [latest] = await db
    .select()
    .from(revision)
    .where(eq(revision.siteId, row.site.id))
    .orderBy(desc(revision.n))
    .limit(1);

  if (!latest) {
    return c.json({ error: 'Not found' }, 404);
  }

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(revision)
    .where(eq(revision.siteId, row.site.id));

  const direction = (JSON.parse(row.result) as StoredResult).directions[row.site.directionIndex];

  // A missing package is drift too — the template was retired.
  const currentHash = await loadPackagedHtml(c.env, c.req.raw, row.site.slug)
    .then(hashText)
    .catch(() => null);

  const stored: StoredRevision = {
    n: latest.n,
    edits: JSON.parse(latest.edits) as EditsDocument,
    instruction: latest.instruction,
    source: latest.source as StoredRevision['source'],
    model: latest.model,
    createdAt: latest.createdAt,
  };

  const body: SiteDocument = {
    id: row.site.id,
    slug: row.site.slug,
    templateName: direction?.name ?? row.site.slug,
    title: row.site.title,
    stance: direction?.stance ?? '',
    palette: direction?.palette ?? [],
    revisions: Number(count),
    createdAt: row.site.createdAt,
    updatedAt: row.site.updatedAt,
    generationId: row.site.generationId,
    directionIndex: row.site.directionIndex,
    description: row.description,
    specVersion: row.site.specVersion,
    templateChanged: currentHash !== row.site.templateHash,
    latest: stored,
  };

  return c.json(body);
});

export default sites;
