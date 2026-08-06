---
'tabbied-mcp': minor
---

Add `tabbied-mcp`, an MCP server over the Tabbied design catalog.

The same implementation serves two transports: `https://tabbied.com/mcp`
(Streamable HTTP, nothing to install) and a `tabbied-mcp` stdio bin for local
clients. Tools are `search_designs`, `get_design`, `preview_design` — which
returns the rendered preview images, so an assistant can look at candidates
rather than guess from opaque slugs — and `get_docs`. The local server adds
`render_design` for real SVG/PNG output, which the remote one cannot offer
because rendering a css-doodle pattern needs a browser.

The protocol layer is dual-era: it speaks both the modern (`2026-07-28`)
per-request-metadata revision and the legacy `initialize` handshake revisions
back to `2024-11-05`. Its only dependency is `tabbied`.
