// A dual-era MCP server core: JSON-RPC in, JSON-RPC out, no transport and no
// dependencies. Both the Worker (Streamable HTTP) and the stdio bin drive this
// same dispatcher, which is the only reason the two endpoints can't drift.
//
// "Dual-era" is the spec's own term. As of revision 2026-07-28 there are two
// incompatible ways to open a conversation:
//
//   legacy  (<= 2025-11-25) an `initialize` handshake establishes a session,
//           after which requests carry no version of their own.
//   modern  (>= 2026-07-28) there is no handshake. Every request declares its
//           protocol version in `params._meta`, and the server answers each one
//           independently — `server/discover` replaces `initialize` as the
//           (optional) way to ask what a server supports.
//
// Every shipping client speaks legacy today; the reference SDK itself still
// pins LATEST_PROTOCOL_VERSION to 2025-11-25. Supporting only modern would mean
// supporting nobody, and supporting only legacy would date the server the
// moment clients move. The spec explicitly allows serving both on one endpoint
// (Versioning §"Backward Compatibility"), and picks the era from how the client
// opens: a request carrying modern `_meta` is modern, an `initialize` is legacy.
// Since every tool here is a read of a static catalog, there is no session
// state to keep either way — both eras are served statelessly.
import type { Toolset } from './tools.js';

/** Protocol revisions using per-request metadata. Newest first. */
export const MODERN_VERSIONS: readonly string[] = ['2026-07-28'];

/** Revisions using the `initialize` handshake. Newest first. */
export const LEGACY_VERSIONS: readonly string[] = [
  '2025-11-25',
  '2025-06-18',
  '2025-03-26',
  '2024-11-05',
];

export const SUPPORTED_VERSIONS: readonly string[] = [
  ...MODERN_VERSIONS,
  ...LEGACY_VERSIONS,
];

/** Where a modern request declares its protocol version. */
export const PROTOCOL_VERSION_META = 'io.modelcontextprotocol/protocolVersion';
const SERVER_INFO_META = 'io.modelcontextprotocol/serverInfo';

// JSON-RPC codes, plus the two MCP allocates from its reserved sub-range.
export const ERROR_PARSE = -32700;
export const ERROR_INVALID_REQUEST = -32600;
export const ERROR_METHOD_NOT_FOUND = -32601;
export const ERROR_INVALID_PARAMS = -32602;
export const ERROR_INTERNAL = -32603;
export const ERROR_HEADER_MISMATCH = -32020;
export const ERROR_UNSUPPORTED_VERSION = -32022;

export type JsonRpcId = string | number | null;

export type JsonRpcMessage = {
  jsonrpc?: unknown;
  id?: JsonRpcId;
  method?: unknown;
  params?: unknown;
};

export type JsonRpcResponse = {
  jsonrpc: '2.0';
  id: JsonRpcId;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
};

export type Dispatched = {
  /** What to send back, or null for a notification (nothing is sent). */
  message: JsonRpcResponse | null;
  /** The status the Streamable HTTP binding should use. stdio ignores it. */
  status: number;
};

export type ServerInfo = {
  name: string;
  version: string;
  /** Shown to the model as a hint about what this server is for. */
  instructions?: string;
};

export type McpServer = {
  dispatch(message: unknown): Promise<Dispatched>;
  /** The era a message opens with, for transports that must validate headers. */
  eraOf(message: unknown): 'modern' | 'legacy';
  info: ServerInfo;
};

// ---- construction helpers --------------------------------------------------

const ok = (id: JsonRpcId, result: unknown, status = 200): Dispatched => ({
  message: { jsonrpc: '2.0', id, result },
  status,
});

export function errorResponse(
  id: JsonRpcId,
  code: number,
  message: string,
  data?: unknown
): JsonRpcResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: { code, message, ...(data === undefined ? {} : { data }) },
  };
}

const fail = (
  id: JsonRpcId,
  code: number,
  message: string,
  status: number,
  data?: unknown
): Dispatched => ({ message: errorResponse(id, code, message, data), status });

/** The protocol version a modern request declares, or null if it isn't modern. */
export function declaredVersion(message: unknown): string | null {
  const params = (message as JsonRpcMessage | null)?.params;
  if (!params || typeof params !== 'object') return null;
  const meta = (params as { _meta?: unknown })._meta;
  if (!meta || typeof meta !== 'object') return null;
  const version = (meta as Record<string, unknown>)[PROTOCOL_VERSION_META];
  return typeof version === 'string' ? version : null;
}

// ---- the server ------------------------------------------------------------

export function createMcpServer(
  info: ServerInfo,
  toolset: Toolset
): McpServer {
  const capabilities = { tools: {} };

  const eraOf = (message: unknown): 'modern' | 'legacy' =>
    declaredVersion(message) === null ? 'legacy' : 'modern';

  async function dispatch(message: unknown): Promise<Dispatched> {
    if (!message || typeof message !== 'object' || Array.isArray(message)) {
      return fail(
        null,
        ERROR_INVALID_REQUEST,
        'Expected a single JSON-RPC request or notification object.',
        400
      );
    }

    const { id = null, method, params } = message as JsonRpcMessage;
    const args = (params ?? {}) as Record<string, unknown>;
    const isNotification = id === null || id === undefined;

    if (typeof method !== 'string') {
      return fail(id, ERROR_INVALID_REQUEST, 'Missing "method".', 400);
    }

    // Notifications get no reply at all. `notifications/initialized` closes the
    // legacy handshake; `notifications/cancelled` is stdio's cancellation
    // signal, and since every tool here is a synchronous catalog read there is
    // never any in-flight work to stop.
    if (method.startsWith('notifications/')) {
      return { message: null, status: 202 };
    }

    const version = declaredVersion(message);
    const modern = version !== null;

    if (modern && !SUPPORTED_VERSIONS.includes(version)) {
      return fail(
        id,
        ERROR_UNSUPPORTED_VERSION,
        `Unsupported protocol version "${version}".`,
        400,
        { supported: SUPPORTED_VERSIONS, requested: version }
      );
    }

    // Modern results carry a resultType discriminator; legacy ones must not,
    // since a legacy client validating against its own schema has never seen it.
    const result = (value: Record<string, unknown>) =>
      modern ? { resultType: 'complete', ...value } : value;

    switch (method) {
      // ---- legacy handshake -------------------------------------------------
      case 'initialize': {
        if (isNotification) {
          return fail(
            null,
            ERROR_INVALID_REQUEST,
            'initialize must be a request, not a notification.',
            400
          );
        }
        const asked = args.protocolVersion;
        // Echo the client's version when we speak it; otherwise answer with our
        // newest legacy one and let the client decide whether it can continue.
        const agreed =
          typeof asked === 'string' && LEGACY_VERSIONS.includes(asked)
            ? asked
            : LEGACY_VERSIONS[0];

        return ok(id, {
          protocolVersion: agreed,
          capabilities,
          serverInfo: { name: info.name, version: info.version },
          ...(info.instructions ? { instructions: info.instructions } : {}),
        });
      }

      // ---- modern discovery -------------------------------------------------
      case 'server/discover': {
        return ok(
          id,
          result({
            supportedVersions: SUPPORTED_VERSIONS,
            capabilities,
            _meta: {
              [SERVER_INFO_META]: { name: info.name, version: info.version },
            },
            ...(info.instructions ? { instructions: info.instructions } : {}),
          })
        );
      }

      case 'ping':
        return ok(id, result({}));

      case 'tools/list':
        return ok(id, result({ tools: toolset.list() }));

      case 'tools/call': {
        const name = args.name;
        if (typeof name !== 'string') {
          return fail(
            id,
            ERROR_INVALID_PARAMS,
            'tools/call needs a string "name".',
            400
          );
        }
        // An unknown tool is a malformed request, not a tool failure — the spec
        // puts this one on the protocol side (Tools §"Error Handling").
        if (!toolset.has(name)) {
          return fail(
            id,
            ERROR_INVALID_PARAMS,
            `Unknown tool: ${name}. Call tools/list for the available set.`,
            400
          );
        }
        const argumentsValue = args.arguments;
        const callArgs =
          argumentsValue && typeof argumentsValue === 'object'
            ? (argumentsValue as Record<string, unknown>)
            : {};

        try {
          const toolResult = await toolset.call(name, callArgs);
          return ok(id, result({ ...toolResult }));
        } catch (error) {
          return fail(
            id,
            ERROR_INTERNAL,
            error instanceof Error ? error.message : String(error),
            500
          );
        }
      }

      default:
        // 404 (not 400) is what the modern binding asks for on an unknown
        // method, so a client can tell "wrong method" from "wrong endpoint".
        return fail(
          id,
          ERROR_METHOD_NOT_FOUND,
          `Method not found: ${method}`,
          404
        );
    }
  }

  return { dispatch, eraOf, info };
}
