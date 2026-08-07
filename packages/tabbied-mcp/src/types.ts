// The shapes this server reads and writes.
//
import type { JsonSchemaType } from '@modelcontextprotocol/server';

//
// The catalog types mirror what packages/tabbied/scripts/codegen.mjs emits into
// catalog.json — deliberately structural rather than imported, so the MCP
// server can also run against a catalog fetched over HTTP from a *different*
// (older or newer) version of the site than the one it was built against.

/** One design, as it appears in catalog.json. */
export type CatalogDesign = {
  slug: string;
  name: string;
  description?: string;
  tags: string[];
  mood: string[];
  density: string;
  goodFor: string[];
  preview: string;
  palette: string[];
  colors?: unknown;
  options: CatalogOption[];
  defaultAspectRatio?: number;
  svgExport: { supported: boolean; note?: string };
};

export type CatalogOption = {
  id: string;
  label: string;
  type: string;
  default: unknown;
  values?: string[];
  min?: number;
  max?: number;
  step?: number;
  svgExportNote?: string;
};

export type Catalog = {
  package: string;
  version: string;
  count: number;
  docs: string;
  usage: Record<string, string>;
  designs: CatalogDesign[];
};

// ---- tools -----------------------------------------------------------------

/**
 * A content block in a tool result. This is the subset of MCP's content types
 * the Tabbied tools actually produce; the shape is identical in both protocol
 * eras (see docs/mcp-server.md).
 */
export type ToolContent =
  | { type: 'text'; text: string }
  | { type: 'image'; data: string; mimeType: string };

export type ToolResult = {
  content: ToolContent[];
  /**
   * A *tool execution* error — bad slug, unrenderable design — as opposed to a
   * JSON-RPC protocol error. The distinction matters: the spec asks clients to
   * feed these back to the model so it can self-correct, which is exactly what
   * should happen when an agent guesses a slug that doesn't exist.
   */
  isError?: boolean;
};

/**
 * Tool input schemas stay plain JSON Schema rather than Zod, because
 * `search_designs`'s enums are derived from the catalog at runtime (see
 * tools.ts) and so cannot be authored statically. Aliasing the SDK's own type
 * — a type-only import, no runtime weight — means a schema this package can't
 * actually register fails at `tsc` rather than at the first `tools/list`.
 */
export type JsonSchema = JsonSchemaType;

export type ToolDefinition = {
  name: string;
  title: string;
  description: string;
  inputSchema: JsonSchema;
};

export type Tool = {
  definition: ToolDefinition;
  run(args: Record<string, unknown>): ToolResult | Promise<ToolResult>;
};

/**
 * Everything the catalog tools need from their host. The two fetchers are
 * injected rather than imported because they differ per runtime: the Worker
 * reads them off its own static assets, the stdio server off the local package
 * (and the network for previews).
 */
export type ToolContext = {
  catalog: Catalog;
  /** Resolves a design's preview image to base64. Omit to drop `preview_design`. */
  fetchPreview?: (
    design: CatalogDesign
  ) => Promise<{ data: string; mimeType: string }>;
  /** Resolves the llms-full.txt reference. Omit to drop `get_docs`. */
  fetchDocs?: () => Promise<string>;
};
