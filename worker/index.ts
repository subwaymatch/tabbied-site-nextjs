// The Cloudflare Worker that serves tabbied.com.
//
// It is almost entirely a static-asset server: `next build` writes the whole
// site into out/, wrangler uploads it, and Cloudflare serves matching paths
// without ever invoking this code. Only two paths reach the Worker —
//
//   /mcp     the remote MCP endpoint (see docs/mcp-server.md)
//   /health  a liveness probe that doesn't depend on the asset pipeline
//
// — and everything else falls through to `env.ASSETS`, which is also how the
// custom 404 page is served (`not_found_handling: "404-page"`).
//
// The MCP server reads the catalog, the previews, and the reference *through
// the assets binding* rather than bundling them. That is deliberate: the tools
// then describe exactly the bytes this deployment serves, so a design added in
// the same commit can't be missing from the catalog the agent queries, and a
// 384 KB JSON file stays out of the Worker bundle.
import {
  catalogTools,
  createHttpHandler,
  createMcpServer,
  createToolset,
  INSTRUCTIONS,
  SERVER_NAME,
  VERSION,
  type Catalog,
  type CatalogDesign,
} from 'tabbied-mcp';

type Env = {
  ASSETS: { fetch(request: Request | string): Promise<Response> };
};

const MCP_PATH = '/mcp';

// Isolates are reused across requests, so a cold read of the catalog is paid
// once per isolate rather than once per request. Cached as the promise so
// concurrent first requests don't each start their own fetch.
let catalogPromise: Promise<Catalog> | null = null;
let docsPromise: Promise<string> | null = null;

function assetUrl(request: Request, path: string): string {
  return new URL(path, request.url).toString();
}

async function readAsset(
  env: Env,
  request: Request,
  path: string
): Promise<Response> {
  const response = await env.ASSETS.fetch(assetUrl(request, path));
  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }
  return response;
}

function loadCatalog(env: Env, request: Request): Promise<Catalog> {
  catalogPromise ??= readAsset(env, request, '/catalog.json')
    .then((response) => response.json() as Promise<Catalog>)
    // Don't cache a failure: a transient miss would otherwise poison the
    // isolate for as long as it lives.
    .catch((error) => {
      catalogPromise = null;
      throw error;
    });
  return catalogPromise;
}

function loadDocs(env: Env, request: Request): Promise<string> {
  docsPromise ??= readAsset(env, request, '/llms-full.txt')
    .then((response) => response.text())
    .catch((error) => {
      docsPromise = null;
      throw error;
    });
  return docsPromise;
}

// btoa needs a binary string, and spreading a 400 KB array into
// String.fromCharCode blows the argument limit — so build it in chunks.
function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
}

async function handleMcp(request: Request, env: Env): Promise<Response> {
  const catalog = await loadCatalog(env, request);

  const fetchPreview = async (design: CatalogDesign) => {
    // The catalog's `preview` is an absolute tabbied.com URL, but this Worker
    // may be answering on a *.workers.dev preview deployment; re-resolving the
    // path against the incoming request keeps it reading its own assets.
    const path = new URL(design.preview).pathname;
    const response = await readAsset(env, request, path);
    return {
      data: toBase64(await response.arrayBuffer()),
      mimeType: response.headers.get('Content-Type') ?? 'image/webp',
    };
  };

  const toolset = createToolset(
    // No render_design: rendering a css-doodle pattern needs a real browser,
    // and a Worker has none. Agents that need a rendered asset use the local
    // stdio server (`npx tabbied-mcp`) or the `tabbied` CLI.
    catalogTools({
      catalog,
      fetchPreview,
      fetchDocs: () => loadDocs(env, request),
    })
  );

  const server = createMcpServer(
    { name: SERVER_NAME, version: VERSION, instructions: INSTRUCTIONS },
    toolset
  );

  return createHttpHandler(server)(request);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === MCP_PATH || pathname === `${MCP_PATH}/`) {
      try {
        return await handleMcp(request, env);
      } catch (error) {
        // The catalog is an asset; if it can't be read, the deployment is
        // broken rather than the request. Say so in JSON-RPC terms so a client
        // surfaces something better than an opaque 500.
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32603,
              message: `MCP server unavailable: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    if (pathname === '/health') {
      return new Response('ok', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
