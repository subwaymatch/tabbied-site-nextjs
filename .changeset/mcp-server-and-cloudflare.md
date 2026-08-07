---
'tabbied-mcp': minor
---

Add `tabbied-mcp`, an MCP server over the Tabbied design catalog.

The same tools serve two transports: `https://tabbied.com/mcp` (nothing to
install) and a `tabbied-mcp` stdio bin. Tools are `search_designs`,
`get_design`, `preview_design` — which returns the rendered preview images, so
an assistant can look at candidates rather than guess from opaque slugs — and
`get_docs`. The local server adds `render_design` for real SVG/PNG output,
which the remote one cannot offer because rendering a css-doodle pattern needs
a browser.

Built on `@modelcontextprotocol/server` v2, so it speaks the stateless
`2026-07-28` revision — no `initialize` handshake, no session id, one server
built per request — while still serving 2025-era clients. Tool schemas are
plain JSON Schema with enums derived from the catalog being served, which the
SDK also enforces on incoming arguments.
