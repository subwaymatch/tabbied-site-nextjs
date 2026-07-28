// Step 4 of 4. Download the finished images and write them into
// public/images/showcase/<id>.webp.
//
//   node scripts/images/import-batch.mjs           # everything that succeeded
//   node scripts/images/import-batch.mjs --force   # overwrite existing files
//
// KIE returns a URL per job rather than inline data, so each result is fetched
// and then recompressed to roughly 2x its widest rendered slot before it lands
// in public/, the same treatment scripts/optimize-images.mjs gives the marketing
// images. With `output: 'export'` there is no /_next/image optimizer to lean on.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {
  DONE, IMAGE_DIR, IMAGE_INDEX, ROOT, STATE, argv, imagePath, pooled, readJson, writeImageIndex, writeJson,
} from './common.mjs';

const args = argv();
const concurrency = Math.max(1, Number(args.concurrency) || 4);
const state = readJson(STATE);

if (!state || !Object.keys(state.tasks ?? {}).length) {
  console.error('No task state. Run: node scripts/images/submit-batch.mjs');
  process.exit(1);
}

fs.mkdirSync(IMAGE_DIR, { recursive: true });

const entries = Object.entries(state.tasks);
const written = [];
const failed = [];
let skipped = 0;
let waiting = 0;

await pooled(entries, concurrency, async ([id, task]) => {
  if (task.state !== DONE) {
    if (task.state === 'fail') failed.push({ id, reason: task.failMsg || task.failCode || 'failed' });
    else waiting += 1;
    return;
  }

  if (!task.url) {
    failed.push({ id, reason: 'finished with no result URL' });
    return;
  }

  const dest = imagePath(id);

  if (fs.existsSync(dest) && !args.force) {
    skipped += 1;
    return;
  }

  try {
    const res = await fetch(task.url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const source = Buffer.from(await res.arrayBuffer());
    const resized = await sharp(source)
      .resize({ width: task.maxWidth, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    fs.writeFileSync(dest, resized);
    // Slots that share an identical prompt reuse the one generated image.
    for (const alias of task.aliases ?? []) fs.writeFileSync(imagePath(alias), resized);

    written.push({ id, bytes: resized.length, aliases: (task.aliases ?? []).length });
  } catch (error) {
    failed.push({ id, reason: String(error).slice(0, 160) });
  }
});

// The React tree reads this module to know which slots have an image; the static
// generator stats the directory itself, so it only needs a rerun.
const indexed = writeImageIndex();

const totalBytes = written.reduce((n, w) => n + w.bytes, 0);
const aliasCount = written.reduce((n, w) => n + w.aliases, 0);

console.log(`${written.length} image(s) -> ${path.relative(ROOT, IMAGE_DIR)} (${(totalBytes / 1024 / 1024).toFixed(1)} MB)`);
if (aliasCount) console.log(`  ${aliasCount} duplicate slot(s) copied from a shared render`);
if (skipped) console.log(`  ${skipped} already on disk, kept (use --force to overwrite)`);
if (waiting) console.log(`  ${waiting} task(s) still running; rerun once they finish`);

if (failed.length) {
  console.log(`\n${failed.length} task(s) failed:`);
  for (const f of failed) console.log(`  ${f.id}: ${f.reason}`);
  console.log('\nRetry them with: node scripts/images/build-batch.mjs && node scripts/images/submit-batch.mjs --watch');
}

console.log(`\n${indexed.length} image(s) listed in ${path.relative(ROOT, IMAGE_INDEX)}`);
console.log('Next: npm run build');

writeJson(path.join(path.dirname(STATE), 'imported.json'), {
  importedAt: new Date().toISOString(),
  written: written.map((w) => w.id),
  failed,
});
