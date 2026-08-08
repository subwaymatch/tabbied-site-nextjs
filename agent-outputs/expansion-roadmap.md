# Tabbied expansion — roadmap and handoff index

Four planned expansions, each with its own strategy document in this folder:

| | Plan | Document |
|---|---|---|
| A1 | Editable templates — the `editable.json` spec | `editable-templates-plan.md` |
| A2 | Site builder — coding-agent lane + `/create` web editor | `site-builder-plan.md` |
| A3 | Branding service — brand kits from Tabbied + an LLM | `branding-service-plan.md` |
| A4 | Platform — better-auth + OpenAI-compatible AI gateway | `platform-auth-ai-plan.md` |

This index exists so the dependency structure and the recommended order live
in one place. Each document is self-contained beyond that.

## How the four fit together

```
A1 editable.json spec + applyEdits engine
 │
 ├──────────────► A2 site builder
 │                 ├─ agent lane (MCP template tools)   ← needs only A1
 │                 └─ web editor /create                ← anonymous-capable;
 │                        │                                A4 adds save/AI
 │                        ▼
 └──────────────► A3 branding service ──────────────────← needs A4 for every
                    (kit website = template + edits doc,   LLM call + storage
                     Edit opens the A2 editor)
 A4 platform (auth, D1/KV/R2, AI gateway) — independent start, unblocks the
 server-touching halves of A2 and all of A3
```

Two shared contracts carry most of that coupling, and they are deliberately
small:

- **The edits document** (`{specVersion, slug, edits}`, defined in A1):
  produced by the web editor, by coding agents, and by the branding service;
  consumed by `applyEdits` in the browser, the packager, and tests alike.
- **The brand document** (defined in A3): the LLM's only output format,
  every field bounded by a published vocabulary — the catalog's closed
  `tags`/`mood`/`density`/`goodFor` metadata, the curated font pairs, the
  palette rules already written down in `lib/paletteLibrary.ts`.

Everything else the plans lean on already exists and stays unchanged: the
static export on Workers static assets, the two-pass build with the template
packager between, the `data-*` pattern hydration contract, the MCP server's
factory/statelessness rules, and the SVG-export tiers.

## Recommended order

1. **A4 step 1 + A1 steps 1–2 in parallel** — the Worker scaffold (Hono,
   bindings, dev loop) touches nothing user-visible; the A1 spec + engine +
   pilot on the 5 `TemplateSite` sites proves the annotation scheme before
   the 52-site batches begin.
2. **A2 agent lane** — MCP template tools over the pilot batch. Cheap,
   high-leverage, and it makes the annotation work visible to agents
   immediately.
3. **A4 through auth + AI gateway** while **A1 batches** (palette codemod,
   bespoke annotation) proceed — independent tracks.
4. **A2 web editor** over the annotated sets; anonymous editing + zip export
   first, accounts/save when A4 step 5 lands.
5. **A3** — directions flow first (a standalone product moment), then the
   kit page riding A1 coverage + the A2 editor, then composed assets, then
   the degradable extras (image-gen concepts, "Refresh my brand", PDF).

The one hard early decision to confirm with a human: **the Workers paid-plan
upgrade** (A4 §2) — password hashing does not fit free-tier CPU limits, and
the plan recommends upgrading over weakening the hash.

## Invariants the implementer must not regress

Each plan restates its own, but the cross-cutting ones deserve one list:

- New non-asset routes **must** join `run_worker_first` in `wrangler.jsonc`
  (the trailing-slash 308 breaks POSTs otherwise — the documented `/mcp`
  lesson).
- The site remains a pure static export; all new pages are static client
  components; the server is only ever the Worker's `/api/*` + `/mcp`.
- Derived artifacts (editable catalogs, llms.txt, template packages) are
  generated, gitignored, and verified by `check:*` gates — edit generators,
  never outputs.
- `applyEdits` sets text, attributes, and inline styles, never classes —
  the premise `trimUnusedRules` depends on.
- AI endpoints are task-shaped with schema-validated structured output;
  there is no raw model proxy, and catalog-derived enums come from the
  deployed `catalog.json` via the Worker's existing loader.
- Anything that must *render* a pattern renders in a browser: the client
  for the products, Playwright/CLI for pipelines — never the Worker.
