// Inserts the batch-7 thumbnail configs into galleryThumbnails.ts, just before
// the closing brace of the galleryThumbnails map. Idempotent: skips any slug
// that already has an entry.
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch7 } from './pattern-defs-7.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FILE = path.join(
  ROOT,
  'components/select-pattern-page/galleryThumbnails.ts'
);

let src = readFileSync(FILE, 'utf-8');

const blocks = [];
for (const def of batch7) {
  if (new RegExp(`\\n  ${def.slug}: \\{`).test(src)) continue; // already present
  const extra = [
    def.shadow !== undefined ? `, shadow: ${def.shadow}` : '',
    def.round !== undefined ? `, roundedCorners: ${def.round}` : '',
  ].join('');
  blocks.push(
    `  ${def.slug}: {\n    options: { grid: '${def.thumb.grid}', frequency: ${def.thumb.frequency}${extra} },\n  },`
  );
}

if (!blocks.length) {
  console.log('nothing to insert (all batch-7 slugs already present)');
  process.exit(0);
}

const marker = '\n};\n';
const at = src.lastIndexOf(marker);
if (at === -1) throw new Error('could not find closing of galleryThumbnails');

src = src.slice(0, at) + '\n' + blocks.join('\n') + src.slice(at);
writeFileSync(FILE, src);
console.log(`inserted ${blocks.length} thumbnail entries`);
