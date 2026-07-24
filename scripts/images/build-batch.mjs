// Step 2 of 4. Turn the prompt manifest into a Batch API request file.
//
//   node scripts/images/build-batch.mjs                 # only what is still missing
//   node scripts/images/build-batch.mjs --all           # regenerate everything
//   node scripts/images/build-batch.mjs --only static   # one stack, or a site name
//   node scripts/images/build-batch.mjs --endpoint responses
//
// custom_id is the manifest id, which is also the output filename, so the import
// step needs no lookup table to route results back to slots.
import fs from 'node:fs';
import path from 'node:path';
import { INPUT_JSONL, MANIFEST, MODEL, ROOT, argv, imagePath, readJson } from './common.mjs';

const args = argv();
const manifest = readJson(MANIFEST);
if (!manifest) {
  console.error('No manifest. Run: node scripts/images/extract-prompts.mjs');
  process.exit(1);
}

// /v1/images/generations is the direct route. If the Batch endpoint allowlist
// does not cover it, --endpoint responses sends the same prompt through
// /v1/responses with the image_generation tool, which is batchable and returns
// the same base64 payload one level deeper.
const endpoint = args.endpoint === 'responses' ? '/v1/responses' : '/v1/images/generations';
const quality = typeof args.quality === 'string' ? args.quality : 'high';
const textModel = typeof args.textModel === 'string' ? args.textModel : 'gpt-5';

const only = typeof args.only === 'string' ? args.only : null;
const matches = (p) => !only || p.stack === only || p.site === only || p.id.includes(only);

const selected = manifest.prompts.filter(matches);
const pending = args.all ? selected : selected.filter((p) => !fs.existsSync(imagePath(p.id)));

if (!pending.length) {
  console.log(`Nothing to generate (${selected.length} selected, all already in public/images/showcase).`);
  process.exit(0);
}

const bodyFor = (p) =>
  endpoint === '/v1/responses'
    ? {
        model: textModel,
        input: p.prompt,
        // The prompt already names the page background, so leave the default
        // opaque background in place rather than asking for transparency.
        tools: [{ type: 'image_generation', model: MODEL, size: p.size, quality }],
        tool_choice: { type: 'image_generation' },
      }
    : { model: MODEL, prompt: p.prompt, size: p.size, quality, n: 1 };

const lines = pending.map((p) =>
  JSON.stringify({ custom_id: p.id, method: 'POST', url: endpoint, body: bodyFor(p) })
);

fs.mkdirSync(path.dirname(INPUT_JSONL), { recursive: true });
fs.writeFileSync(INPUT_JSONL, `${lines.join('\n')}\n`);

const bytes = fs.statSync(INPUT_JSONL).size;
console.log(`${pending.length} request(s) -> ${path.relative(ROOT, INPUT_JSONL)} (${(bytes / 1024).toFixed(1)} KB)`);
console.log(`  endpoint ${endpoint}, size mix: ${[...new Set(pending.map((p) => p.size))].join(', ')}`);
if (pending.length > 50_000) console.error('! Over the 50,000-request cap for one batch file; split it.');
if (bytes > 200 * 1024 * 1024) console.error('! Over the 200 MB cap for one batch file; split it.');
console.log('Next: node scripts/images/submit-batch.mjs --watch');
