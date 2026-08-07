# A4 — Auth and AI API: the platform layer

A strategy, not an implementation. The other three plans (editable templates,
site builder, branding service) all eventually need two things the site does
not have today: identity and a server that can hold a secret. This document
plans that substrate: **better-auth** with email/password + social logins, and
an **OpenAI-compatible** AI gateway, both living in the existing Worker.

Read together with: `site-builder-plan.md` (A2), `branding-service-plan.md`
(A3). Those documents say *what* calls these APIs; this one says how the APIs
exist at all.

---

## 1. The decision that shapes everything else

The site is a pure static export (`output: 'export'`), served by Cloudflare
Workers static assets, and `worker/index.ts` runs for exactly two paths. That
architecture is good and none of the new features should disturb it.

**The platform is the existing Worker growing an `/api/*` tier — not a second
service, and not a move off static export.** Every page, including sign-in and
the wizard UIs, stays a static-exported client component; everything stateful
happens over `fetch` to `/api/*` routes served by the same Worker, on the same
origin.

Same-origin is the load-bearing property. Auth cookies never cross an origin
in production, so there is no CORS surface, no third-party-cookie problem, and
no token-in-localStorage compromise: better-auth's default httpOnly session
cookie just works. The alternatives — a separate api.tabbied.com Worker, or
Pages Functions — reintroduce exactly the cross-origin cookie problems this
avoids, for no capability we need.

Two consequences follow immediately:

- **`run_worker_first` grows to `["/mcp", "/mcp/*", "/health", "/api", "/api/*"]`.**
  This is not optional hygiene. With `trailingSlash: true`, the asset router
  answers a POST to any non-file path with a 308 to the slashed form before
  the Worker sees it — the exact bug the MCP entry in `wrangler.jsonc` already
  documents. Every new non-asset route must join that list.
- **The Worker needs a router.** Hand-rolled `if (pathname === ...)` is right
  for two routes and wrong for twenty. Adopt **Hono**: it is the router
  better-auth's Cloudflare examples mount onto, it is small, and its
  middleware model gives us one place for session extraction and rate limits.
  The existing `/mcp` and `/health` handlers move onto it unchanged;
  `app.notFound` / the fallthrough stays `env.ASSETS.fetch(request)`.

## 2. New bindings and the plan tier

The Worker today has one binding (`ASSETS`) and no persistence. The platform
adds, in `wrangler.jsonc`:

| Binding | Service | Used for |
|---|---|---|
| `DB` | D1 | better-auth tables, projects/brand kits, AI usage ledger |
| `KV` | Workers KV | session lookup cache (`secondaryStorage`), rate-limit counters |
| `UPLOADS` | R2 | user uploads: logos, photos, "existing materials" (A3) |
| `AI`-related vars/secrets | — | `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL` (see §5) |

**One plan caveat to settle before writing code: the account is on the Workers
free plan** (the asset-count note in CLAUDE.md is phrased against the free
ceiling). Two things about auth do not fit free-tier CPU budgets:

- Password hashing. better-auth's default is scrypt, deliberately expensive —
  tens of milliseconds of pure CPU. The free plan's 10 ms CPU limit will kill
  those requests.
- Long AI streams tie up wall-clock (fine) but token accounting and JSON
  parsing on big responses add CPU (marginal).

**Recommendation: move to Workers Paid ($5/mo) as part of this work** rather
than engineering around it. The workaround (swapping in a cheaper WebCrypto
PBKDF2 `password.hash`) trades security margin for $5 and still leaves other
spikes near the limit. D1, KV, and R2 free tiers are otherwise ample for
launch volumes.

Local dev gets `.dev.vars` (gitignored) for secrets; production gets
`wrangler secret put`. D1 schema changes ride `wrangler d1 migrations` and are
committed under `worker/migrations/`.

## 3. Auth: better-auth on D1

### Server

- `better-auth` configured in a new `worker/auth.ts`, with the
  **Drizzle adapter over D1** (`drizzle-orm/d1`). Drizzle is the schema source
  of truth; `npx @better-auth/cli generate` emits the auth tables (`user`,
  `session`, `account`, `verification`) and migrations are generated from the
  Drizzle schema, not hand-written.
- **Email/password** enabled with email verification required; **social**
  starts with Google and GitHub (the two with the least review friction) —
  Apple can follow once the domain and a paid Apple developer account exist.
  Each provider is just `clientId`/`clientSecret` from secrets plus a callback
  URL, so adding one later is configuration, not architecture.
- **`secondaryStorage` on KV**, so the per-request session check is a KV read,
  not a D1 query. D1 remains the source of truth.
- Transactional email (verification, password reset) via an HTTP email API —
  Resend is the default candidate; it is one `fetch` from the Worker and
  swappable behind better-auth's `sendVerificationEmail`/`sendResetPassword`
  hooks. A domain sender identity (SPF/DKIM on tabbied.com) is a prerequisite
  and takes a day of DNS lag — schedule it first.
- **Turnstile on the email/password signup form** (better-auth's captcha
  plugin supports it natively; we are already on Cloudflare). Social signup
  skips it.
- Mounted as `app.on(['GET','POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))`
  — better-auth owns everything under that prefix.

`trustedOrigins` gets `http://localhost:3000` **in dev only**, because of the
dev-loop split below.

### Client

- `createAuthClient` from `better-auth/react` in `lib/authClient.ts`;
  `useSession` drives header state (avatar / "Sign in").
- New static routes: `/sign-in`, `/sign-up`, `/account` — plain client
  components in the existing visual language. No middleware-style route
  protection exists in a static export and none is needed: protected pages
  render a signed-out state client-side, and the *data* is protected at the
  API, which is the only place protection is real anyway.

### The dev loop

`next dev` (:3000) has no Worker; `wrangler dev` (:8787) has no HMR. The daily
loop is both at once, with the client sending API calls to an explicit base:

- `NEXT_PUBLIC_API_BASE` — empty in production (same-origin), set to
  `http://localhost:8787` by `npm run dev`. One `apiFetch` helper (and the
  auth client's `baseURL`) reads it; nothing else may hardcode a host.
- The Worker enables CORS-with-credentials for `http://localhost:3000` only
  when a `DEV` var is set. Production ships no CORS headers at all.
- `npm run preview` (the real Worker over `out/`) remains the integration
  check where same-origin behavior — the production shape — is what runs, and
  Playwright API/auth specs run against that.

### What auth deliberately does not include yet

Billing/subscriptions (quota tiers in §5 are structured so a paid tier can be
added without schema changes), organizations/teams, passkeys, and account
linking UI beyond what better-auth gives for free. All are compatible later;
none block A2/A3.

## 4. App data: projects and usage

Beyond better-auth's tables, two app tables (also Drizzle-defined, D1-hosted):

- **`project`** — one row per saved artifact: `id`, `userId`, `kind`
  (`'site' | 'brand-kit'`), `name`, `data` (JSON blob: the A1 edit document or
  the A3 brand kit — both are small, well under D1's 1 MB row comfort zone),
  `createdAt`, `updatedAt`. The JSON blobs are versioned documents
  (`specVersion`) defined in the A1/A3 plans; the platform stores them
  opaquely.
- **`aiUsage`** — the ledger §5 writes: `id`, `userId`, `endpoint`, `model`,
  `promptTokens`, `completionTokens`, `costEstimate`, `createdAt`.

Uploads go to R2 under `uploads/<userId>/<uuid>` with content-type and size
enforced at the `/api/uploads` endpoint (images only, a few MB cap); the D1
row stores the key, never the bytes.

## 5. The AI gateway

The requirement is "OpenAI-compatible APIs", which the design treats as a
*wire format*, not a vendor: everything upstream is reached as
`${AI_BASE_URL}/chat/completions` with a bearer key, so OpenAI, an aggregator,
or a self-hosted server are all one env-var change.

### Task endpoints, never a raw proxy

**There is no `/api/ai/chat` passthrough.** Exposing a general proxy turns the
site into a free LLM faucet and hands prompt construction to the client. Every
endpoint is task-shaped, with the prompt assembled server-side and the input
validated (zod) to a small schema:

- `POST /api/ai/brand-directions` — the A3 wizard's main call
- `POST /api/ai/brand-suggest` — the "Suggest for me" affordances (adjectives,
  complementary colors)
- `POST /api/ai/site-copy` — A2's optional copy rewriting

(The exact contracts live in the A2/A3 plans; the platform promise is the
shape: authenticated, validated input in, validated JSON out.)

### Structured output, validated twice

Every task call uses `response_format: { type: 'json_schema' }`, and the
Worker validates the response against the same zod schema before returning it
— an upstream that ignores `json_schema` (some "compatible" servers do) fails
loudly, not with garbage reaching the UI. Where a schema references catalog
facts (pattern slugs, the closed tag/mood/density/goodFor vocabulary), the
enums are built from the deployed `catalog.json` via the Worker's existing
`loadCatalog` — the same "describe exactly the bytes this deployment serves"
property the MCP endpoint already has, and the same trick `search_designs`
uses for its schema.

### Streaming

Endpoints that feed progressive UI (direction generation takes ~10–20 s)
request `stream: true` upstream and pass the SSE body through. The client
renders progress; the final parsed-and-validated object is what gets stored.
Workers stream response bodies natively; no buffering.

### Quotas and abuse

- **AI endpoints require a session.** No anonymous generation at launch — the
  demo path for signed-out users is the template gallery, not the LLM.
- **Per-user daily budget** enforced against the `aiUsage` ledger (sum of
  today's tokens vs. a per-tier cap; unpriced tier = generous-but-finite).
  Checked before the upstream call; written after, from the response's
  `usage` field.
- **Burst limiting** per user and per IP via KV counters (or the Workers Rate
  Limiting binding if we accept its beta status), applied as Hono middleware
  on `/api/ai/*` and on auth's credential endpoints (login brute-force).
- **Optional but recommended: Cloudflare AI Gateway in front of the upstream.**
  It is OpenAI-compatible passthrough, so adopting it is only changing
  `AI_BASE_URL`, and it buys logging, caching, retries, and a spend dashboard
  without code.

## 6. Testing and CI

- **Worker unit/API tests move beyond typecheck**: `@cloudflare/vitest-pool-workers`
  with a local D1 (migrations applied in setup) covers auth-adjacent routes,
  quota logic, and schema validation, including the failure paths (bad
  upstream JSON, quota exceeded, unverified email). The AI upstream is faked
  with a local OpenAI-shaped stub — tests never hit a paid API.
- **e2e**: a Playwright project against `npm run preview` covering the
  sign-up → verify (stubbed mail: the email adapter writes to a KV key that
  dev/tests can read back) → sign-in → call-an-AI-endpoint (stub model) →
  sign-out loop.
- `npm run typecheck:worker` continues to cover the Worker tsconfig; Drizzle
  schema types flow into route handlers.

## 7. Sequencing

1. **Scaffold** — Hono adopted, existing `/mcp` + `/health` moved over
   unchanged, `/api/health` added, `run_worker_first` extended, bindings
   declared, `.dev.vars` + `NEXT_PUBLIC_API_BASE` dev loop working. *(Small,
   pure refactor; everything after hangs off it.)*
2. **Auth core** — D1 + Drizzle + better-auth email/password with
   verification via Resend, Turnstile, `/sign-in` `/sign-up` `/account`
   pages, vitest-pool-workers harness. **Plan upgrade decision lands here.**
3. **Social providers** — Google + GitHub apps, callback URLs for
   workers.dev and tabbied.com, account-exists-with-different-provider UX.
4. **AI gateway** — upstream client, structured-output plumbing with
   catalog-derived enums, quotas + ledger, one real endpoint
   (`brand-suggest`, the smallest) end to end, streaming on the second.
5. **App data** — `project` table + CRUD (`/api/projects`), R2 uploads.
   This is the point A2 "save" and A3 persistence unblock.

Each step deploys independently and nothing before step 5 changes any
existing page or asset. The MCP endpoint is untouched throughout — same
factory, same statelessness, same bundle discipline (Hono adds ~20 KB; the
better-auth + Drizzle graph lands well under the 1 MB gzip script budget, and
we keep the existing habit of checking what `wrangler deploy` reports).

## 8. Risks worth naming

- **CPU limits discovered late.** Mitigated by deciding the paid-plan question
  in step 2, not after a production incident. If staying free-tier is a hard
  constraint, the PBKDF2 fallback exists but should be an explicit, recorded
  trade.
- **Email deliverability lag.** SPF/DKIM propagation and provider review are
  calendar time, not code time; started first for that reason.
- **"OpenAI-compatible" servers that aren't.** The double validation in §5
  turns silent incompatibility (ignored `json_schema`, absent `usage`) into
  a loud, attributable failure. `usage` absence falls back to a conservative
  token estimate so the quota ledger never silently under-counts.
- **Session cost creep.** If KV `secondaryStorage` reads become the dominant
  cost, better-auth's `cookieCache` (signed short-TTL session data in the
  cookie itself) is a one-line mitigation already supported upstream.
