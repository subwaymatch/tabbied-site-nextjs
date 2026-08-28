# Studio AI — real generation behind the shipped UI

A strategy, not an implementation. Studio shipped as a client-side matcher:
`/studio` takes a description, `lib/studioMatch.ts` scores it against the 57
template sites, `/studio/results?q=…` renders three of them. This plan makes
"Get three websites" a real LLM call — an OpenAI-compatible chat-completions
upstream, gated by better-auth sessions on D1 — without discarding anything
the matcher established.

Read together with: `platform-auth-ai-plan.md` (A4 — this plan *is* A4 steps
1–4 with Studio as the proving endpoint; auth, bindings, quotas and the
gateway rules are specified there and not re-litigated here),
`branding-service-plan.md` (A3 — Studio's call is a lean sibling of
`brand-directions` and must stay schema-compatible with it),
`site-builder-plan.md` + `editable-templates-plan.md` (A2/A1 — the edits
document is how a direction eventually becomes a *customized* site).

---

## 1. What changes and what deliberately does not

**The stance is A3's: the LLM chooses and parameterizes; Tabbied renders.**
No pixels, no CSS, no css-doodle code, no free-form HTML ever comes back from
the model. A Studio direction stays what it is today — a real template site,
a palette, and a few lines of copy — the AI's contribution is *which* sites,
*better* palettes, and copy the matcher could never write.

Three continuities, so the shipped surface keeps paying rent:

- **The matcher becomes candidate assembly.** `matchDirections` does not get
  deleted or bypassed: the Worker runs the same scoring server-side to pick
  the top ~12 entries and puts *those summaries in the prompt*. The model
  chooses 3 from a dozen pre-qualified candidates instead of hallucinating
  over 57 — A3's "server-assembled candidates" rule, and the slug enum in
  the response schema is built from exactly that dozen.
- **The matcher remains the signed-out path.** Anonymous visitors keep the
  current instant, free, deterministic behavior; the AI path is additive.
  `?q=` keeps meaning "matched"; a new `?g=<id>` means "generated". The
  results page renders both through the same cards.
- **Every card still leads somewhere real.** Preview opens
  `/template/<slug>/`, Download serves the existing zip. The e2e guard that
  fetches every Preview href and asserts a 200 applies to AI output
  unchanged — it is the difference between generation and confabulation.

## 2. Auth: adopt A4 §3 verbatim

better-auth in `worker/auth.ts`, Drizzle adapter over D1, KV
`secondaryStorage`, email/password with verification (Resend) plus GitHub and
Google, Turnstile on credential signup, mounted at `/api/auth/*`. Static
`/sign-in`, `/sign-up`, `/account` pages as client components;
`lib/authClient.ts` with `useSession`. The dev loop is A4's:
`NEXT_PUBLIC_API_BASE` → `http://localhost:8787`, CORS-with-credentials only
under a `DEV` var, `npm run preview` as the same-origin integration check.
The Workers-paid-plan decision (scrypt vs the 10 ms CPU cap) lands with this
step, per A4 §2.

Studio's one policy addition: **generation requires a session; matching does
not.** Signed out, the Generate button reads "Match from the library" and
runs the client matcher exactly as today; a second button, "Generate with
AI", routes to `/sign-in?next=/studio` and back. Nobody loses the current
capability by declining to make an account, and the LLM never runs for an
anonymous request — that is the whole cost-control story at the top of the
funnel, before quotas even apply.

## 3. The endpoint

`POST /api/studio/directions` — task-shaped per A4 §5, never a proxy.

**Input** (zod-validated): `{ description: string }`, trimmed, 10–600 chars —
the same bounds `StudioForm` already enforces client-side. Optional later:
`{ brandColor?: hex, exclude?: slug[] }` for "three more" re-rolls; both are
additive and neither blocks v1.

**Pipeline**, all in the Worker:

1. Session check → burst limiter (KV) → daily ledger check (`aiUsage`).
2. Candidate assembly: run the shared scorer over the studio index and take
   the top 12. The index the Worker uses is a build artifact read through
   `env.ASSETS` (`/studio-index.json`, written by the same generator pass
   that owns the other agent-facing JSON) — the "describe exactly the bytes
   this deployment serves" property, and it keeps `lib/studioDirections.ts`
   server-only for the site while giving the Worker the same data without
   bundling the template modules.
3. One `chat/completions` call: `${AI_BASE_URL}/chat/completions`, bearer
   `AI_API_KEY`, model `AI_MODEL`, `response_format: {type:'json_schema'}`
   with the slug enum from step 2 baked into the schema. System prompt
   carries the candidate summaries (name, topic, moods, tags, palette,
   density) and the contract; the user's description is data, clearly
   delimited — it is untrusted text and the schema, not the prompt, is the
   security boundary.
4. Validate the response against the same zod schema (A4's "validated
   twice"). Palettes get the deterministic repair pass (§4). On a schema
   failure: one repair retry with the validation errors appended; on the
   second failure, fall back to the matcher's own top 3 and say so in the
   response (`source: 'matched'`) — the user gets results, not an error
   page, and the ledger records the failed attempt.
5. Write the `aiUsage` row from the upstream `usage` field (conservative
   estimate when absent, per A4 §8), store the generation (§5), return it.

**Output** — three directions, each:

```jsonc
{
  "slug": "verdant",                  // enum: the candidate dozen
  "stance": "Warm Editorial",        // the direction's own name
  "why": "Earthy greens and a calm leaf motif match the warm, trusted feel.",
  "palette": ["#F4F1EA", "#2E4A1F", "#7EA832", "#C9D98A"],  // background first
  "copy": {
    "brandName": "Hearth & Home",     // ≤ 30 chars
    "headline": "Find the home your life fits in.",          // ≤ 70
    "tagline": "A residential team for young Austin families." // ≤ 90
  }
}
```

Plus a top-level `recommended` index and the model id actually used. This is
deliberately a **subset of an A3 brand direction** (no typography pair, no
voice, no website expansion): when A3's `brand-directions` lands, Studio's
call becomes a profile of it rather than a second contract. The `copy`
budgets mirror the editable spec's `maxChars` discipline so the same values
can later flow into an edits document without truncation surgery.

## 4. Palettes: authored by the model, guaranteed by us

The palette is the one free-form field, so it gets A3's treatment with the
machinery that already exists: `isHexColor` gate, then the two
`paletteLibrary.ts` rules — no ink equal to its background, at least one ink
at ~3:1 against `color0` — checked with `contrastRatio` from
`tabbied-templates/src/color.ts` (DOM-free, already a workspace dependency of
the site; the Worker imports the same functions rather than growing a second
color library). A failing palette is repaired by lightness-nudging the
nearest ink (`mix` toward `onColor`), not regenerated — one deterministic
pass, and only if repair cannot reach 3:1 does that direction fall back to
the site's authored palette. The card then renders the generated palette
through the existing `TabbiedPattern` preview exactly as the matcher's cards
do today; nothing in `StudioResults` needs to know which path produced it.

## 5. Storage: a shareable generation is a stored generation

The matcher's results are a pure function of `?q=`, which is what made them
shareable. An LLM response is not reproducible, so shareability has to move
into storage:

- **`generation` table** (Drizzle, D1): `id` (128-bit random, the capability),
  `userId`, `description`, `result` (the validated JSON, a few KB),
  `source` (`'ai' | 'matched-fallback'`), `model`, `createdAt`.
- `POST` returns `{ id }`; the client navigates to `/studio/results?g=<id>`;
  the page fetches `GET /api/studio/generations/<id>` and renders the stored
  result. Reads are unauthenticated by design — the random id is the
  bearer, exactly like an unlisted link — and the page shows the prompt back
  (the existing "You described" echo), so the sharing user is looking at
  everything a recipient will see. No listing endpoint exists; "my
  generations" is a later `/account` nicety over the same rows.
- This is deliberately **not** A4's `project` table: a project is a saved,
  named, mutable artifact; a generation is an immutable receipt. "Save this
  direction" (later) copies *out* of a generation into a project row.

## 6. What the artboard asked for that lands here

- **The photo upload** (dropped from the matcher build because files had
  nowhere to go) arrives with A4 step 5: R2 uploads, per-file notes, and the
  upload block restored to `StudioForm` for signed-in users. The v1 model
  call ignores the images; they exist so the eventual A2 editor session has
  them. Honest sequencing beats a picker that pretends.
- **The generating state** (spinner → results) becomes real: the call takes
  seconds, so the button gets its progress affordance back and the results
  page renders skeleton cards while fetching. Streaming (A4 §5) is the v2
  upgrade if latency with the chosen model warrants progressive reveal;
  the response is small enough that v1 ships without it.

## 7. What Studio v1 still does not do

- **No full-site customization on the results page.** The generated copy and
  palette live on the *cards*; Preview opens the template as authored.
  Recoloring and re-wording the actual page is the A1 edits-document bridge
  — `applyEdits` in an iframe, A2's machinery — and Studio adopts it when
  A2's editor core exists, by having the Worker expand a direction into an
  edits document (palette roles + `copy` → the site's text slot ids).
  Building a second, Studio-only apply path would be the exact fork A2 §1
  warns against.
- **No image generation, no typography choice, no voice line** — those are
  A3's kit, and Studio should funnel into it, not preempt it.
- **No anonymous LLM calls, ever** (A4 §5), and no client-visible prompt
  assembly — the client sends a description and receives a document.

## 8. Testing

- **Worker unit tests** (`@cloudflare/vitest-pool-workers`, local D1 with
  migrations applied): candidate assembly determinism, schema validation of
  a canned good response, the repair-retry path, the matcher fallback path,
  palette repair cases pinned against `contrastRatio`, quota exhaustion, and
  the unauthenticated-401. The upstream is a local OpenAI-shaped stub —
  tests never touch a paid API.
- **e2e** against `npm run preview` with `AI_BASE_URL` pointed at the stub
  (a `.dev.vars` concern, never a production code path): sign-up → verify
  (KV-captured mail, per A4 §6) → generate → results render three cards →
  every Preview href answers 200 → the stored `?g=` link renders identically
  in a fresh context. The existing matcher specs keep running unchanged
  against `serve out` — the signed-out path must keep working with no Worker
  at all.
- **The determinism spec forks**: "same description gives the same three"
  stays true for `?q=` and is asserted for `?g=` as "same stored generation
  renders the same three", which is the property that actually survives.

## 9. Sequencing

1. **A4 steps 1–2** — bindings (`DB`, `KV`), Drizzle + migrations, better-auth
   with email/password + verification, sign-in/up/account pages, the dev
   loop, vitest harness. Paid-plan decision recorded here.
2. **Ledger + limits** — `aiUsage`, KV burst middleware on `/api/ai/*` and
   auth credential routes. Small, and everything after assumes it.
3. **`/api/studio/directions` end to end** — index asset, candidate
   assembly, upstream client, double validation, palette repair, fallback,
   `generation` storage, `?g=` results path, skeleton UI, e2e loop. *This is
   the ship line: Studio generates.*
4. **Social providers** (A4 step 3) and "three more" with `exclude`.
5. **R2 uploads + the form's photo block** (A4 step 5 dependency).
6. **The A1/A2 bridge** — directions expand to edits documents; Preview
   shows the recolored, re-worded site. Rides A2's editor core, not before.

Steps 1–3 are the plan's substance; 4–6 are scheduled opportunism.

## 10. Risks worth naming

- **Quality floor.** The model can pick a defensible-but-dull three. The
  candidate list is the lever: assembly must keep A3's relax-don't-AND rule
  so the dozen spans moods and hues (the shipped diversity penalties run at
  assembly time), and a fixture set of descriptions with snapshot review
  keeps prompt changes honest — the closed vocabulary makes those evals
  cheap, per A3 §9.
- **Latency vs. the matcher.** Signed-in users trade instant results for a
  multi-second call. The UI must make the trade legible (skeletons, the
  stance names arriving as a reveal), and the matcher fallback means the
  worst case is still the current product, never a spinner to nowhere.
- **"OpenAI-compatible" drift** — ignored `json_schema`, absent `usage`.
  A4 §8's answer stands: double validation makes it loud, the estimate
  keeps the ledger conservative, and Cloudflare AI Gateway in front is one
  env-var change that buys logging and a spend dashboard.
- **Capability-URL leakage.** A shared `?g=` link exposes the description
  and results to anyone holding it. That is the feature, stated plainly in
  the UI ("anyone with the link can view"); no user identity is in the
  payload, ids are unguessable, and there is no enumeration surface.
