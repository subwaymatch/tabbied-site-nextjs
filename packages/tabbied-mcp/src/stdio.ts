#!/usr/bin/env node
// The `tabbied-mcp` bin: the same server the site exposes at /mcp, speaking the
// stdio binding instead — newline-delimited JSON-RPC over the standard streams
// of a client-launched subprocess.
//
// Two things must hold and are easy to break:
//   - stdout carries the protocol and nothing else. Every diagnostic goes to
//     stderr; one stray console.log corrupts the stream and the client sees a
//     parse error rather than a hint about what went wrong.
//   - one message per line, no embedded newlines. JSON.stringify escapes
//     control characters, so this holds for anything a tool can return.
//
// Configure it in an MCP client as:
//   { "command": "npx", "args": ["-y", "tabbied-mcp"] }
import { createInterface } from 'node:readline';

import { createMcpServer, errorResponse, ERROR_PARSE } from './protocol.js';
import { catalogTools, createToolset } from './tools.js';
import { INSTRUCTIONS, SERVER_NAME, VERSION } from './info.js';
import { fetchDocs, fetchPreview, loadCatalog } from './node/resources.js';
import { renderTool } from './node/render.js';

async function main(): Promise<void> {
  const catalog = await loadCatalog();

  const toolset = createToolset([
    ...catalogTools({ catalog, fetchPreview, fetchDocs }),
    // Only the local server can render: it has a browser to render with.
    renderTool(catalog),
  ]);

  const server = createMcpServer(
    { name: SERVER_NAME, version: VERSION, instructions: INSTRUCTIONS },
    toolset
  );

  const send = (message: unknown): void => {
    process.stdout.write(`${JSON.stringify(message)}\n`);
  };

  const lines = createInterface({ input: process.stdin });

  // Lines are handled in order: a client may pipeline requests, and answering
  // them out of order is legal JSON-RPC but needlessly surprising.
  let queue: Promise<void> = Promise.resolve();

  lines.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    queue = queue.then(async () => {
      let message: unknown;
      try {
        message = JSON.parse(trimmed);
      } catch {
        send(errorResponse(null, ERROR_PARSE, 'Message is not valid JSON.'));
        return;
      }

      try {
        const { message: reply } = await server.dispatch(message);
        if (reply) send(reply);
      } catch (error) {
        process.stderr.write(
          `tabbied-mcp: ${error instanceof Error ? error.stack : String(error)}\n`
        );
      }
    });
  });

  // The client closing stdin is the shutdown signal; drain what's in flight
  // before exiting so a final response isn't lost.
  await new Promise<void>((resolve) => lines.on('close', resolve));
  await queue;
}

main().catch((error) => {
  process.stderr.write(
    `tabbied-mcp: ${error instanceof Error ? error.message : String(error)}\n`
  );
  process.exit(1);
});
