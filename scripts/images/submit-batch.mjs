// Step 3 of 4. Upload the JSONL, open a batch, and optionally wait for it.
//
//   export OPENAI_API_KEY=sk-...
//   node scripts/images/submit-batch.mjs --watch     # submit, then poll to completion
//   node scripts/images/submit-batch.mjs --check     # status of the batch already on file
//
// Batch pricing is half the synchronous rate against a 24h completion window,
// though a job this size usually finishes in minutes. The batch id is written to
// .batch/state.json so polling survives a closed shell.
import fs from 'node:fs';
import path from 'node:path';
import { INPUT_JSONL, ROOT, STATE, api, apiKey, argv, readJson, writeJson } from './common.mjs';

const args = argv();
const key = apiKey();
const pollMs = Math.max(5, Number(args.interval) || 20) * 1000;
const TERMINAL = new Set(['completed', 'failed', 'expired', 'cancelled']);

const summarize = (batch) => {
  const c = batch.request_counts ?? {};
  return `${batch.status} (${c.completed ?? 0}/${c.total ?? 0} done, ${c.failed ?? 0} failed)`;
};

async function poll(id) {
  for (;;) {
    const batch = await api(`/batches/${id}`, { key });
    console.log(`  ${new Date().toISOString().slice(11, 19)}  ${summarize(batch)}`);
    if (TERMINAL.has(batch.status)) return batch;
    await new Promise((r) => setTimeout(r, pollMs));
  }
}

if (args.check) {
  const state = readJson(STATE);
  if (!state?.batchId) {
    console.error('No batch on file. Run without --check to submit one.');
    process.exit(1);
  }
  const batch = await api(`/batches/${state.batchId}`, { key });
  console.log(`${state.batchId}: ${summarize(batch)}`);
  if (batch.status === 'completed') console.log('Next: node scripts/images/import-batch.mjs');
  process.exit(0);
}

if (!fs.existsSync(INPUT_JSONL)) {
  console.error('No request file. Run: node scripts/images/build-batch.mjs');
  process.exit(1);
}

const jsonl = fs.readFileSync(INPUT_JSONL);
const count = jsonl.toString('utf8').trimEnd().split('\n').length;
// Every line targets the same endpoint, so read it off the first one.
const endpoint = JSON.parse(jsonl.toString('utf8').slice(0, jsonl.indexOf(10))).url;

console.log(`Uploading ${count} request(s) from ${path.relative(ROOT, INPUT_JSONL)}...`);
const form = new FormData();
form.set('purpose', 'batch');
form.set('file', new Blob([jsonl], { type: 'application/jsonl' }), 'batch-input.jsonl');
const file = await api('/files', { method: 'POST', body: form, key });

const batch = await api('/batches', {
  method: 'POST',
  key,
  body: {
    input_file_id: file.id,
    endpoint,
    completion_window: '24h',
    metadata: { project: 'tabbied-showcase', requests: String(count) },
  },
});

writeJson(STATE, {
  batchId: batch.id,
  inputFileId: file.id,
  endpoint,
  requests: count,
  submittedAt: new Date().toISOString(),
});
console.log(`Batch ${batch.id} created: ${summarize(batch)}`);

if (!args.watch) {
  console.log('Poll with: node scripts/images/submit-batch.mjs --check');
  process.exit(0);
}

const final = await poll(batch.id);
if (final.status === 'completed') {
  console.log('Next: node scripts/images/import-batch.mjs');
} else {
  console.error(`Batch ended as ${final.status}.`);
  if (final.errors) console.error(JSON.stringify(final.errors, null, 2).slice(0, 2000));
  process.exit(1);
}
