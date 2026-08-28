// The D1 schema, and the source of truth for it: migrations under
// worker/migrations/ are emitted from this file by `npm run db:generate`, never
// hand-written.
//
// Two halves. The first four tables are better-auth's own — their *property*
// names are the contract (the Drizzle adapter looks up `schema.user.email` by
// better-auth's field name, so those may not be renamed), while the SQL column
// names underneath are ordinary snake_case. Run
// `node -e "import('@better-auth/core/db').then(m => console.log(m.getAuthTables({})))"`
// after a better-auth upgrade: a field added upstream is a migration here.
//
// The rest are Studio's. Dates are stored as unix seconds (SQLite has no date
// type); Drizzle's `timestamp` mode hands JS Dates to both sides of that.
import { sql } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const createdAt = () =>
  integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`);

// ── better-auth ─────────────────────────────────────────────────────────────

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' })
    .notNull()
    .default(false),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: createdAt(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (table) => [index('session_user_id_idx').on(table.userId)]
);

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    // Required since better-auth 1.7; a social account's token issuer.
    issuer: text('issuer').notNull(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
    scope: text('scope'),
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  },
  (table) => [index('account_user_id_idx').on(table.userId)]
);

export const verification = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    createdAt: createdAt(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);

// ── Studio ──────────────────────────────────────────────────────────────────

/**
 * One answered description. Immutable once written, with a single declared
 * exception: `result` is patched to attach a generated image to a direction
 * that had none (see routes/studio.ts). The id is the capability — 128 bits of
 * randomness, and holding it is what grants read access to a shared link — so
 * it is never derived from the user or the text.
 */
export const generation = sqliteTable(
  'generation',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    description: text('description').notNull(),
    /** The validated directions document, as JSON. */
    result: text('result').notNull(),
    /** 'ai' | 'matched-fallback' — how the three were actually chosen. */
    source: text('source').notNull(),
    model: text('model').notNull(),
    createdAt: createdAt(),
  },
  (table) => [index('generation_user_created_idx').on(table.userId, table.createdAt)]
);

/**
 * The spend ledger. Read before every upstream call (today's totals against
 * the cap) and written after, from the response's own usage numbers — so the
 * index that matters is (user, createdAt), which is exactly the daily query.
 */
export const aiUsage = sqliteTable(
  'ai_usage',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    /** 'directions' | 'direction-image' — capped separately. */
    endpoint: text('endpoint').notNull(),
    model: text('model').notNull(),
    promptTokens: integer('prompt_tokens').notNull().default(0),
    completionTokens: integer('completion_tokens').notNull().default(0),
    imageCount: integer('image_count').notNull().default(0),
    costEstimate: real('cost_estimate').notNull().default(0),
    createdAt: createdAt(),
  },
  (table) => [index('ai_usage_user_created_idx').on(table.userId, table.createdAt)]
);

/** A file in R2 under up/<userId>/<uuid>. The bytes never touch D1. */
export const upload = sqliteTable(
  'upload',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    key: text('key').notNull().unique(),
    contentType: text('content_type').notNull(),
    bytes: integer('bytes').notNull(),
    /** What the person said the picture shows, for a later editing session. */
    note: text('note'),
    createdAt: createdAt(),
  },
  (table) => [index('upload_user_idx').on(table.userId)]
);
