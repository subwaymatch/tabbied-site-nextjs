// info.ts hardcodes the version because it is bundled into a Cloudflare Worker,
// which has no filesystem to read package.json from. That duplication is only
// safe if something fails when the two drift.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { INSTRUCTIONS, SERVER_NAME, VERSION } from '../dist/info.js';

const packageRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pkg = JSON.parse(
  fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf-8')
);

test('the reported version matches package.json', () => {
  assert.equal(
    VERSION,
    pkg.version,
    'bump VERSION in src/info.ts alongside package.json'
  );
});

test('the server identifies itself', () => {
  assert.equal(SERVER_NAME, 'tabbied');
});

test('instructions carry the three things no tool description can', () => {
  // Each of these is a property of the toolset rather than of one call, which
  // is why they live in the preamble; losing one is a silent regression in how
  // well an agent uses the server.
  assert.match(INSTRUCTIONS, /opaque/i, 'slugs cannot be guessed');
  assert.match(INSTRUCTIONS, /preview_design/, 'look before choosing');
  assert.match(INSTRUCTIONS, /no intrinsic size/, 'the sizing trap');
});
