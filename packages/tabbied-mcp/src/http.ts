// The Streamable HTTP binding, written against the Web platform's Request and
// Response so it runs unchanged in a Cloudflare Worker (and in Node 18+, Deno,
// or Bun if it ever needs to).
//
// Everything this server does is a read of a static catalog that finishes in
// microseconds, so it always answers a request with a single JSON object and
// never opens an SSE stream. That is explicitly allowed — the client MUST
// support both forms and the server chooses per request — and it means no
// streams, no sessions, and no state between requests.
import {
  ERROR_HEADER_MISMATCH,
  ERROR_PARSE,
  PROTOCOL_VERSION_META,
  declaredVersion,
  errorResponse,
  type Dispatched,
  type JsonRpcResponse,
  type McpServer,
} from './protocol.js';

export type HttpHandlerOptions = {
  /**
   * Origins allowed to call the endpoint from a browser. Defaults to `*`.
   *
   * The spec requires Origin validation to stop DNS-rebinding attacks, whose
   * threat model is a *local* server holding private data: a page on the open
   * web resolves a hostname to 127.0.0.1 and reaches something it shouldn't.
   * This deployment is the opposite — a public, unauthenticated, read-only
   * catalog on a public hostname, where every origin is equally entitled to the
   * same bytes the site already serves. Narrow it here if that ever changes.
   */
  allowedOrigins?: string[];
};

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function corsHeaders(
  request: Request,
  options: HttpHandlerOptions
): Record<string, string> {
  const origin = request.headers.get('Origin');
  const allowed = options.allowedOrigins;

  const allowOrigin =
    !allowed || allowed.includes('*')
      ? '*'
      : origin && allowed.includes(origin)
        ? origin
        : null;

  return {
    ...(allowOrigin ? { 'Access-Control-Allow-Origin': allowOrigin } : {}),
    ...(allowed && !allowed.includes('*') ? { Vary: 'Origin' } : {}),
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers':
      'Content-Type, Accept, Authorization, MCP-Protocol-Version, Mcp-Method, Mcp-Name',
    'Access-Control-Max-Age': '86400',
  };
}

function originRejected(
  request: Request,
  options: HttpHandlerOptions
): boolean {
  const allowed = options.allowedOrigins;
  if (!allowed || allowed.includes('*')) return false;
  const origin = request.headers.get('Origin');
  // A missing Origin is a non-browser client (curl, an agent runtime), which
  // rebinding cannot reach; only a present-and-unlisted Origin is refused.
  return origin !== null && !allowed.includes(origin);
}

const jsonResponse = (
  body: unknown,
  status: number,
  extra: Record<string, string>
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extra },
  });

/**
 * Build a `fetch`-shaped handler for the MCP endpoint. The caller is
 * responsible for routing only its MCP path here.
 */
export function createHttpHandler(
  server: McpServer,
  options: HttpHandlerOptions = {}
): (request: Request) => Promise<Response> {
  return async function handle(request: Request): Promise<Response> {
    const cors = corsHeaders(request, options);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (originRejected(request, options)) {
      return jsonResponse(
        errorResponse(null, ERROR_HEADER_MISMATCH, 'Origin not allowed.'),
        403,
        cors
      );
    }

    // The modern revision dropped the GET stream and the DELETE session
    // teardown; a legacy client that tries either reads 405 as "this server
    // offers no optional stream", which its own revision allows.
    if (request.method !== 'POST') {
      return jsonResponse(
        errorResponse(
          null,
          ERROR_PARSE,
          'The MCP endpoint accepts POST. Send one JSON-RPC message per request.'
        ),
        405,
        { ...cors, Allow: 'POST, OPTIONS' }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonResponse(
        errorResponse(null, ERROR_PARSE, 'Request body is not valid JSON.'),
        400,
        cors
      );
    }

    // JSON-RPC batching existed in revision 2025-03-26 and was dropped after
    // it. Accepting an array costs a map and keeps those clients working.
    const messages = Array.isArray(body) ? body : [body];
    if (messages.length === 0) {
      return jsonResponse(
        errorResponse(null, ERROR_PARSE, 'Empty batch.'),
        400,
        cors
      );
    }

    const headerVersion = request.headers.get('MCP-Protocol-Version');
    const results: Dispatched[] = [];

    for (const message of messages) {
      // Mirrored headers must agree with the body: the whole reason the
      // transport mirrors them is so an intermediary can route on the header,
      // which is only safe if the two can't disagree.
      const bodyVersion = declaredVersion(message);
      if (bodyVersion && headerVersion && bodyVersion !== headerVersion) {
        results.push({
          message: errorResponse(
            (message as { id?: JsonRpcResponse['id'] })?.id ?? null,
            ERROR_HEADER_MISMATCH,
            `MCP-Protocol-Version header "${headerVersion}" does not match ` +
              `the "${PROTOCOL_VERSION_META}" value "${bodyVersion}" in the body.`
          ),
          status: 400,
        });
        continue;
      }
      results.push(await server.dispatch(message));
    }

    const replies = results
      .map((entry) => entry.message)
      .filter((entry): entry is JsonRpcResponse => entry !== null);

    // Every message was a notification: acknowledge with no body.
    if (replies.length === 0) {
      return new Response(null, { status: 202, headers: cors });
    }

    // One status for the response; the worst outcome in the batch wins so a
    // failure is never reported as 200.
    const status = Math.max(
      ...results.filter((entry) => entry.message !== null).map((entry) => entry.status)
    );

    return jsonResponse(
      Array.isArray(body) ? replies : replies[0],
      status,
      cors
    );
  };
}
