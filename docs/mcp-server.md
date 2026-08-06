# The Tabbied MCP server

Tabbied ships a [Model Context Protocol](https://modelcontextprotocol.io)
server so an assistant can browse the design catalog, *look* at candidates, and
render assets without the site or the package in its context.

It exists in two forms that share one implementation:

| | Remote | Local |
| --- | --- | --- |
| Where | `https://tabbied.com/mcp` | `npx -y tabbied-mcp` |
| Transport | Streamable HTTP | stdio |
| Install | nothing | `tabbied-mcp` (+ Playwright for rendering) |
| Tools | `search_designs`, `get_design`, `preview_design`, `get_docs` | those four **plus `render_design`** |

## Adding it to a client

Remote — nothing to install:

```jsonc
{
  "mcpServers": {
    "tabbied": { "url": "https://tabbied.com/mcp" }
  }
}
```

Local, when you want to render actual files:

```jsonc
{
  "mcpServers": {
    "tabbied": { "command": "npx", "args": ["-y", "tabbied-mcp"] }
  }
}
```

Or, in Claude Code:

```bash
claude mcp add --transport http tabbied https://tabbied.com/mcp
claude mcp add tabbied -- npx -y tabbied-mcp
```

## The tools

Slugs are opaque (`cleat`, `karst`, `radius`) and there are 295 of them, so the
toolset is built around a single flow: **narrow on metadata, then look.**

- **`search_designs`** filters on a closed vocabulary — `tags` (visible
  motifs), `mood`, `density`, `goodFor` — plus free text and SVG-export
  support. The enum values in the input schema are derived from the catalog
  being served, so they cannot drift from what is actually queryable. Filters
  combine with AND, including *within* a field: two tags means both.

  Because AND narrows fast, an empty result is the interesting case. Rather
  than returning `[]`, the tool reports how each filter would have done on its
  own, so the caller can tell an out-of-vocabulary guess (0 matches) from a
  merely narrow one and fix the next call without another round trip.

- **`get_design`** returns the full record — palette, every option with its
  range and default, SVG-export support — plus slug-substituted React, core,
  and CLI snippets, and a reminder that a pattern has no intrinsic size.

- **`preview_design`** returns the rendered preview image for up to six slugs
  as MCP image content. This is the step that makes a choice reliable; metadata
  narrows the field but these are pictures. The previews are the committed @2x
  renders the gallery shows, so the agent and a human see the same image.

- **`get_docs`** returns `llms-full.txt`, the complete API contract and recipes.

- **`render_design`** (local only) renders any slug to SVG or PNG at any size,
  seed, palette, and option set, either inline or to a path you name. It shells
  out to the `tabbied` CLI rather than reimplementing anything: the only
  faithful renderer for a css-doodle pattern is css-doodle in a real browser
  (see `svg-export.md`). That is also why it cannot be remote — a Worker has no
  browser.

## Protocol notes

The server is **dual-era**, and that is not gold-plating.

As of revision `2026-07-28` MCP has two incompatible ways to open a
conversation. Older revisions (`2025-11-25` and earlier, "legacy") do an
`initialize` handshake that establishes a session. The current revision
("modern") has no handshake at all: every request declares its protocol version
in `params._meta`, the server answers each one independently, and
`server/discover` replaces `initialize` as the optional way to ask what a server
supports.

Every shipping client speaks legacy today — `@modelcontextprotocol/sdk` itself
still pins `LATEST_PROTOCOL_VERSION` to `2025-11-25`. Supporting only modern
would mean supporting nobody; supporting only legacy dates the server the moment
clients move. The spec explicitly allows serving both from one endpoint and
defines how to pick: a request carrying modern `_meta` is modern, an
`initialize` is legacy. Since every tool is a read of a static catalog there is
no session state either way, so both eras are served statelessly.

This is why the protocol layer is hand-written instead of wrapping the SDK: the
SDK cannot speak the modern era yet, and hand-writing it also leaves
`tabbied-mcp` with exactly one dependency (`tabbied`) and lets the same code
bundle into a Worker. `packages/tabbied-mcp/test/protocol.test.mjs` stands in
for the SDK's own test suite — treat it as load-bearing.

Details of the HTTP binding:

- **POST only.** The modern revision removed the GET stream and the DELETE
  session teardown, so both return `405`. `Mcp-Session-Id` is ignored and never
  minted.
- **Always a single JSON object**, never SSE. Every tool finishes in
  microseconds, and the client is required to support both forms.
- **Mirrored headers are validated.** If `MCP-Protocol-Version` disagrees with
  the body's `_meta`, the request is rejected with `-32020` — the whole reason
  the transport mirrors the value is so an intermediary can route on it, which
  is only safe if the two cannot disagree. Missing `Mcp-Method` / `Mcp-Name`
  hints are tolerated rather than rejected: this is a public, unauthenticated,
  read-only endpoint behind no MCP-aware intermediary, so refusing an otherwise
  valid request over a routing hint would trade real interoperability for no
  security.
- **CORS is open** (`Access-Control-Allow-Origin: *`). The spec's Origin-
  validation requirement targets DNS rebinding against *local* servers holding
  private data; this endpoint serves the same bytes the public site already
  does. `createHttpHandler` takes an `allowedOrigins` option if that changes.
- **Legacy JSON-RPC batches** (revision `2025-03-26`) are accepted, since
  supporting them costs a `map`.

Error codes follow the spec's split: a malformed request or an unknown tool is
a JSON-RPC error, while a bad slug or a failed render comes back as a tool
result with `isError: true`, so the model sees it and can correct itself.

## Where the data comes from

The remote server reads `/catalog.json`, `/previews/*.webp`, and
`/llms-full.txt` **through its own assets binding** rather than bundling them.
The tools therefore describe exactly the bytes that deployment serves, and a
384 KB catalog stays out of the Worker. Reads are memoised per isolate, and a
failed read is not cached.

The local server reads the catalog from the installed `tabbied` package, so it
describes the version you are about to `npm install` — an agent told about a
design that only exists on the site would write an import that does not
resolve. It falls back to `https://tabbied.com/catalog.json` and says so on
stderr.

## Working on it

```bash
npm run build:packages          # tabbied, then tabbied-mcp
npm test --workspace tabbied-mcp
npm run preview                 # the real Worker over out/, including /mcp
```

Driving it by hand is often faster than a client:

```bash
# local, over stdio
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  | node packages/tabbied-mcp/dist/stdio.js

# remote, against `npm run preview`
curl -s -X POST http://127.0.0.1:8787/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_designs","arguments":{"tags":["waves"],"limit":3}}}'
```

Adding a tool means adding it in `src/tools.ts` (if both transports can serve
it) or in the host that can (`src/stdio.ts` for anything needing node or a
browser). Anything reachable from `src/index.ts` must stay free of node
imports — that entry point is what the Worker bundles.
