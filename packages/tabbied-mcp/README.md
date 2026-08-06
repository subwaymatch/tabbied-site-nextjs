# tabbied-mcp

An [MCP](https://modelcontextprotocol.io) server for
[Tabbied](https://tabbied.com): search 295 generative pattern designs, look at
them, and render them to SVG or PNG — from Claude Code, Claude Desktop, Cursor,
or any other MCP client.

## Use it without installing anything

The same server runs at `https://tabbied.com/mcp`:

```bash
claude mcp add --transport http tabbied https://tabbied.com/mcp
```

```jsonc
{
  "mcpServers": {
    "tabbied": { "url": "https://tabbied.com/mcp" }
  }
}
```

## Or run it locally, and render real files

```bash
claude mcp add tabbied -- npx -y tabbied-mcp
```

```jsonc
{
  "mcpServers": {
    "tabbied": { "command": "npx", "args": ["-y", "tabbied-mcp"] }
  }
}
```

The local server adds `render_design`, which the remote one cannot offer —
rendering a css-doodle pattern needs a real browser. Install a Playwright
alongside it (`npm i -D playwright`) or point `TABBIED_CHROMIUM` at a Chromium
binary.

## Tools

| Tool | What it does |
| --- | --- |
| `search_designs` | Filter by motif, mood, density, intended use, free text, or SVG-export support. |
| `get_design` | The full record for one slug, plus ready-to-paste snippets. |
| `preview_design` | The rendered preview image for up to six designs, so the model can *look*. |
| `get_docs` | The complete API reference (`llms-full.txt`). |
| `render_design` | SVG or PNG at any size, seed, palette, and option set. **Local only.** |

Slugs are opaque — `cleat`, `karst`, `radius` — so the intended flow is
`search_designs` to narrow, `preview_design` to look, then `get_design` for the
options. Choosing off tags alone is the main way this goes wrong.

## Programmatic use

The package's main entry point is runtime-agnostic (no node imports), so it can
be embedded in a Worker or any Web-standard server:

```ts
import {
  catalogTools,
  createToolset,
  createMcpServer,
  createHttpHandler,
} from 'tabbied-mcp';

const server = createMcpServer(
  { name: 'tabbied', version: '0.1.0' },
  createToolset(catalogTools({ catalog }))
);

const handler = createHttpHandler(server); // (Request) => Promise<Response>
```

`docs/mcp-server.md` in the repository has the protocol details, including why
this speaks both the modern (`2026-07-28`) and legacy MCP eras.

## License

MIT
