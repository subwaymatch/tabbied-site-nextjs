// Step 4 of 4. Pull the finished batch down and write the images into
// public/images/showcase/<custom_id>.webp.
//
//   node scripts/images/import-batch.mjs                  # uses .batch/state.json
//   node scripts/images/import-batch.mjs --batch batch_x  # any batch id
//   node scripts/images/import-batch.mjs --force          # overwrite existing files
//
// GPT Image always answers with base64 (never a URL), so each result is decoded
// and recompressed to roughly 2x its widest rendered slot before it lands in
// public/, the same treatment scripts/optimize-images.mjs gives the marketing
// images. With `output: 'export'` there is no /_next/image optimizer to lean on.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { IMAGE_DIR, MANIFEST, ROOT, STATE, api, apiKey, argv, imagePath, readJson, writeJson } from './common.mjs';

const args = argv();
const key = apiKey();

const state = readJson(STATE);
const batchId = typeof args.batch === 'string' ? args.batch : state?.batchId;
if (!batchId) {
  console.error('No batch id. Pass --batch batch_xxx or submit one first.');
  process.exit(1);
}

const manifest = readJson(MANIFEST);
const byId = new Map((manifest?.prompts ?? []).map((p) => [p.id, p]));

const batch = await api(`/batches/${batchId}`, { key });
if (batch.status !== 'completed') {
  console.error(`Batch ${batchId} is ${batch.status}, not completed. Wait, then re-run.`);
  process.exit(1);
}

const lines = (text) =>
  text
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l));

// /v1/images/generations puts the payload at data[0].b64_json; /v1/responses
// nests it in the image_generation_call output item.
function base64From(body) {
  const direct = body?.data?.[0]?.b64_json;
  if (direct) return direct;
  const call = body?.output?.find((o) => o.type === 'image_generation_call');
  return call?.result ?? null;
}

fs.mkdirSync(IMAGE_DIR, { recursive: true });

const written = [];
const failed = [];
let skipped = 0;

if (batch.output_file_id) {
  const output = lines(await api(`/files/${batch.output_file_id}/content`, { key, raw: true }));
  for (const line of output) {
    const id = line.custom_id;
    const record = byId.get(id);
    if (!record) {
      failed.push({ id, reason: 'not in the current manifest (re-run extract-prompts)' });
      continue;
    }
    if (line.error || line.response?.status_code !== 200) {
      failed.push({ id, reason: line.error?.message ?? `HTTP ${line.response?.status_code}` });
      continue;
    }
    const b64 = base64From(line.response.body);
    if (!b64) {
      failed.push({ id, reason: 'response carried no image payload' });
      continue;
    }
    const dest = imagePath(id);
    if (fs.existsSync(dest) && !args.force) {
      skipped += 1;
      continue;
    }
    const resized = await sharp(Buffer.from(b64, 'base64'))
      .resize({ width: record.maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    fs.writeFileSync(dest, resized);
    // Slots that share an identical prompt reuse the one generated image.
    for (const alias of record.aliases) fs.writeFileSync(imagePath(alias), resized);
    written.push({ id, bytes: resized.length, aliases: record.aliases.length });
  }
}

// Individual requests can fail without failing the batch (a content filter trip
// is the usual cause). Those custom_ids are the retry list.
if (batch.error_file_id) {
  for (const line of lines(await api(`/files/${batch.error_file_id}/content`, { key, raw: true }))) {
    failed.push({ id: line.custom_id, reason: line.error?.message ?? line.response?.body?.error?.message ?? 'unknown' });
  }
}

const totalBytes = written.reduce((n, w) => n + w.bytes, 0);
const aliasCount = written.reduce((n, w) => n + w.aliases, 0);
console.log(`${written.length} image(s) -> ${path.relative(ROOT, IMAGE_DIR)} (${(totalBytes / 1024 / 1024).toFixed(1)} MB)`);
if (aliasCount) console.log(`  ${aliasCount} duplicate slot(s) copied from a shared render`);
if (skipped) console.log(`  ${skipped} already on disk, kept (use --force to overwrite)`);
if (failed.length) {
  console.log(`\n${failed.length} request(s) failed:`);
  for (const f of failed) console.log(`  ${f.id}: ${f.reason}`);
  console.log('\nRetry them with: node scripts/images/build-batch.mjs && node scripts/images/submit-batch.mjs --watch');
}

writeJson(path.join(path.dirname(STATE), 'imported.json'), {
  batchId,
  importedAt: new Date().toISOString(),
  written: written.map((w) => w.id),
  failed,
});
