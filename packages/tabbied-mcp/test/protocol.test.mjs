// The dual-era dispatcher and the Streamable HTTP binding.
//
// This is a hand-written protocol implementation rather than a wrapper over the
// reference SDK — the SDK still pins LATEST_PROTOCOL_VERSION to 2025-11-25 and
// so cannot speak the modern era at all (see docs/mcp-server.md). That buys
// dual-era support and a dependency-free Worker bundle, and it puts the burden
// of correctness here: these tests are what stands in for the SDK's own suite.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createMcpServer, LEGACY_VERSIONS, MODERN_VERSIONS } from '../dist/protocol.js';
import { createHttpHandler } from '../dist/http.js';
import { createToolset } from '../dist/tools.js';

const MODERN = MODERN_VERSIONS[0];
const LEGACY = LEGACY_VERSIONS[0];

const toolset = createToolset([
  {
    definition: {
      name: 'echo',
      title: 'Echo',
      description: 'Echoes its argument back.',
      inputSchema: {
        type: 'object',
        properties: { value: { type: 'string' } },
      },
    },
    run: (args) => ({ content: [{ type: 'text', text: String(args.value ?? '') }] }),
  },
]);

const server = createMcpServer(
  { name: 'test', version: '9.9.9', instructions: 'Be brief.' },
  toolset
);

const modernMeta = { _meta: { 'io.modelcontextprotocol/protocolVersion': MODERN } };

const send = (message) => server.dispatch(message);

// ---- era selection ---------------------------------------------------------

test('era is chosen by how the client opens, not by the method', () => {
  assert.equal(server.eraOf({ method: 'tools/list' }), 'legacy');
  assert.equal(
    server.eraOf({ method: 'tools/list', params: modernMeta }),
    'modern'
  );
});

test('legacy clients get the initialize handshake, echoed at their version', async () => {
  for (const version of LEGACY_VERSIONS) {
    const { message } = await send({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: version, capabilities: {}, clientInfo: {} },
    });
    assert.equal(message.result.protocolVersion, version);
    assert.deepEqual(message.result.capabilities, { tools: {} });
    assert.equal(message.result.serverInfo.name, 'test');
    assert.equal(message.result.instructions, 'Be brief.');
    // resultType belongs to the modern era; a legacy client has never seen it.
    assert.equal(message.result.resultType, undefined);
  }
});

test('initialize at an unknown version answers with our newest legacy one', async () => {
  const { message } = await send({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: '1999-01-01' },
  });
  assert.equal(message.result.protocolVersion, LEGACY);
});

test('modern clients get server/discover, with every supported version', async () => {
  const { message } = await send({
    jsonrpc: '2.0',
    id: 'd1',
    method: 'server/discover',
    params: modernMeta,
  });

  assert.equal(message.result.resultType, 'complete');
  assert.ok(message.result.supportedVersions.includes(MODERN));
  assert.ok(message.result.supportedVersions.includes(LEGACY));
  assert.deepEqual(
    message.result._meta['io.modelcontextprotocol/serverInfo'],
    { name: 'test', version: '9.9.9' }
  );
});

test('an unsupported declared version is refused with the supported list', async () => {
  const { message, status } = await send({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: { _meta: { 'io.modelcontextprotocol/protocolVersion': '1900-01-01' } },
  });

  assert.equal(status, 400);
  assert.equal(message.error.code, -32022);
  assert.equal(message.error.data.requested, '1900-01-01');
  assert.ok(message.error.data.supported.includes(MODERN));
});

// ---- core methods ----------------------------------------------------------

test('tools/list is identical in both eras but for the discriminator', async () => {
  const legacy = await send({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  const modern = await send({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/list',
    params: modernMeta,
  });

  assert.equal(legacy.message.result.resultType, undefined);
  assert.equal(modern.message.result.resultType, 'complete');
  assert.deepEqual(legacy.message.result.tools, modern.message.result.tools);
});

test('tools/call runs the tool and returns its content', async () => {
  const { message, status } = await send({
    jsonrpc: '2.0',
    id: 7,
    method: 'tools/call',
    params: { name: 'echo', arguments: { value: 'hello' } },
  });

  assert.equal(status, 200);
  assert.equal(message.id, 7);
  assert.deepEqual(message.result.content, [{ type: 'text', text: 'hello' }]);
});

test('an unknown tool is a protocol error, not a tool result', async () => {
  const { message, status } = await send({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: { name: 'nope' },
  });

  assert.equal(status, 400);
  assert.equal(message.error.code, -32602);
  assert.equal(message.result, undefined);
});

test('notifications are acknowledged with nothing at all', async () => {
  for (const method of ['notifications/initialized', 'notifications/cancelled']) {
    const { message, status } = await send({ jsonrpc: '2.0', method });
    assert.equal(message, null);
    assert.equal(status, 202);
  }
});

test('ping answers, and an unknown method 404s per the modern binding', async () => {
  assert.deepEqual((await send({ jsonrpc: '2.0', id: 1, method: 'ping' })).message, {
    jsonrpc: '2.0',
    id: 1,
    result: {},
  });

  const { message, status } = await send({
    jsonrpc: '2.0',
    id: 1,
    method: 'resources/list',
  });
  assert.equal(status, 404);
  assert.equal(message.error.code, -32601);
});

test('junk in is a JSON-RPC error out, never a throw', async () => {
  for (const junk of [null, 42, 'string', [], { jsonrpc: '2.0', id: 1 }]) {
    const { message } = await send(junk);
    assert.ok(message.error, `expected an error for ${JSON.stringify(junk)}`);
  }
});

// ---- Streamable HTTP -------------------------------------------------------

const handler = createHttpHandler(server);

const post = (body, headers = {}) =>
  handler(
    new Request('https://tabbied.com/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
  );

test('a request gets a single JSON object back', async () => {
  const response = await post({ jsonrpc: '2.0', id: 1, method: 'tools/list' });

  assert.equal(response.status, 200);
  assert.match(response.headers.get('Content-Type'), /application\/json/);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), '*');
  const body = await response.json();
  assert.equal(body.id, 1);
  assert.ok(Array.isArray(body.result.tools));
});

test('a notification gets 202 and an empty body', async () => {
  const response = await post({ jsonrpc: '2.0', method: 'notifications/initialized' });
  assert.equal(response.status, 202);
  assert.equal(await response.text(), '');
});

test('GET and DELETE are refused — this revision has no stream or session', async () => {
  for (const method of ['GET', 'DELETE']) {
    const response = await handler(
      new Request('https://tabbied.com/mcp', { method })
    );
    assert.equal(response.status, 405);
    assert.match(response.headers.get('Allow'), /POST/);
  }
});

test('OPTIONS preflights without touching the server', async () => {
  const response = await handler(
    new Request('https://tabbied.com/mcp', { method: 'OPTIONS' })
  );
  assert.equal(response.status, 204);
  assert.match(response.headers.get('Access-Control-Allow-Headers'), /MCP-Protocol-Version/);
});

test('unparseable JSON is a parse error, not a 500', async () => {
  const response = await post('{ not json');
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, -32700);
});

test('a mirrored header that disagrees with the body is rejected', async () => {
  const response = await post(
    { jsonrpc: '2.0', id: 1, method: 'tools/list', params: modernMeta },
    { 'MCP-Protocol-Version': LEGACY }
  );

  assert.equal(response.status, 400);
  assert.equal((await response.json()).error.code, -32020);
});

test('a mirrored header that agrees with the body passes through', async () => {
  const response = await post(
    { jsonrpc: '2.0', id: 1, method: 'tools/list', params: modernMeta },
    { 'MCP-Protocol-Version': MODERN }
  );

  assert.equal(response.status, 200);
  assert.equal((await response.json()).result.resultType, 'complete');
});

test('a legacy batch is answered as a batch', async () => {
  const response = await post([
    { jsonrpc: '2.0', id: 1, method: 'ping' },
    { jsonrpc: '2.0', method: 'notifications/initialized' },
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
  ]);

  const body = await response.json();
  assert.ok(Array.isArray(body));
  // The notification contributes no reply.
  assert.deepEqual(
    body.map((entry) => entry.id),
    [1, 2]
  );
});

test('an allow-list refuses a browser origin outside it but lets tools through', async () => {
  const restricted = createHttpHandler(server, {
    allowedOrigins: ['https://tabbied.com'],
  });
  const request = (origin) =>
    restricted(
      new Request('https://tabbied.com/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(origin ? { Origin: origin } : {}),
        },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping' }),
      })
    );

  assert.equal((await request('https://evil.example')).status, 403);
  assert.equal((await request('https://tabbied.com')).status, 200);
  // No Origin at all is a non-browser client, which rebinding cannot reach.
  assert.equal((await request(null)).status, 200);
});
