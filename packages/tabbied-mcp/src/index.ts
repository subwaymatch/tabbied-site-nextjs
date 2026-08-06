// The runtime-agnostic half of the server: tool definitions, the JSON-RPC
// dispatcher, and the Streamable HTTP binding. Nothing here imports node, so
// this entry point is what the Cloudflare Worker bundles.
//
// The node-only pieces — the stdio transport, the local catalog reader, and the
// browser-backed `render_design` — live behind ./stdio and are reached through
// the bin, never through this file.
export { catalogTools, createToolset, type Toolset } from './tools.js';
export {
  createMcpServer,
  declaredVersion,
  errorResponse,
  LEGACY_VERSIONS,
  MODERN_VERSIONS,
  SUPPORTED_VERSIONS,
  type Dispatched,
  type JsonRpcResponse,
  type McpServer,
  type ServerInfo,
} from './protocol.js';
export { createHttpHandler, type HttpHandlerOptions } from './http.js';
export { INSTRUCTIONS, SERVER_NAME, VERSION } from './info.js';
export type {
  Catalog,
  CatalogDesign,
  CatalogOption,
  Tool,
  ToolContent,
  ToolContext,
  ToolDefinition,
  ToolResult,
} from './types.js';
