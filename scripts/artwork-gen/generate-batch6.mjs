// Emits packages/tabbied/artworks/<slug>.json for every batch-6 definition and
// prints the galleryThumbnails entries to insert. Scoped to batch 6 only so it
// never touches artworks shipped in earlier commits.
import { writeFileSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch6 } from './artwork-defs-6.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ARTWORKS_DIR = path.join(ROOT, 'packages/tabbied/artworks');

const SHELL =
  ':doodle { @grid: ${grid}; @size: ${width} ${height}; overflow:hidden; text-align:center; box-sizing:border-box } :container { background: var(--color0); overflow:hidden; }';

const GRID_OPTION = (def) => ({
  id: 'grid',
  displayName: 'Columns and rows',
  type: 'ButtonSelectGroup',
  default: def,
  options: ['2x3', '4x6', '6x9', '8x12', '10x15'],
  replace: '${grid}',
});

const FREQ_OPTION = (def) => ({
  id: 'frequency',
  displayName: 'Frequency',
  type: 'Slider',
  default: def,
  min: 0.2,
  max: 1,
  step: 0.1,
  replace: '${shapeFrequency}',
});

const collapse = (s) => s.replace(/\s+/g, ' ').trim();

const defs = batch6;

// Guard: batch-6 slugs must be unique within the batch and must not clobber any
// pre-existing artwork that isn't part of this batch.
const batchSlugs = new Set();
for (const def of defs) {
  if (batchSlugs.has(def.slug)) throw new Error(`duplicate slug: ${def.slug}`);
  batchSlugs.add(def.slug);
}
// Batch 6 owns gallery orders 620+, so a file already on disk is either this
// batch's own output (safe to rewrite) or an earlier batch's artwork (never
// clobber it).
const FIRST_ORDER = 620;
const existing = new Set(
  readdirSync(ARTWORKS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
);
for (const def of defs) {
  if (!existing.has(def.slug)) continue;
  const onDisk = JSON.parse(
    readFileSync(path.join(ARTWORKS_DIR, `${def.slug}.json`), 'utf-8')
  );
  if (!(onDisk.galleryOrder >= FIRST_ORDER)) {
    throw new Error(`batch-6 slug ${def.slug} collides with an existing artwork`);
  }
}

const thumbEntries = [];

for (const def of defs) {
  const options = [GRID_OPTION(def.gridDefault), FREQ_OPTION(def.freqDefault)];

  const style = collapse(`${def.vars} --rule: ( ${def.rule} );`);
  const doodle = collapse(def.doodle ?? SHELL);

  // Sanity: every ${placeholder} in the code must be replaced by some option.
  const placeholders = new Set(
    [...`${style} ${doodle}`.matchAll(/\$\{(\w+)\}/g)].map((m) => m[1])
  );
  placeholders.delete('width');
  placeholders.delete('height');
  for (const ph of placeholders) {
    if (!options.some((o) => o.replace === '${' + ph + '}')) {
      throw new Error(`${def.slug}: placeholder \${${ph}} has no option`);
    }
  }
  for (const o of options) {
    const name = o.replace.slice(2, -1);
    if (!placeholders.has(name)) {
      throw new Error(`${def.slug}: option ${o.id} (${o.replace}) unused`);
    }
  }
  // Lint: a custom property whose value contains @-functions is a textual
  // macro — every plain var(--x) reference re-rolls it. Shared rolls must be
  // emitted per cell and referenced via @var(--x) instead.
  const propDefs = [...style.matchAll(/(--[\w-]+)\s*:\s*([^;]*);/g)];
  for (const [, propName, propValue] of propDefs) {
    if (/--color\d/.test(propName)) continue;
    if (!/@(p|pick|r|rand|pd|pick-d|pn|pick-n)\b/i.test(propValue)) continue;
    const plainRefs = [
      ...style.matchAll(new RegExp(`(?<!@)var\\(${propName}\\)`, 'g')),
    ].length;
    if (plainRefs > 1) {
      throw new Error(
        `${def.slug}: randomized ${propName} referenced ${plainRefs}x via plain var() — re-rolls per reference; use a cell-level prop + @var()`
      );
    }
  }
  // Batch 6 is the *ordered* batch: shapes are placed by the grid, never by a
  // dice roll, so @rand() (position/size/angle jitter) is banned outright.
  if (/@r\b|@rand\b/i.test(style)) {
    throw new Error(`${def.slug}: @rand() is not allowed in the ordered batch`);
  }
  // Every painted branch must sit inside the frequency gate, otherwise the
  // slider stops thinning the field.
  const gateCount = (style.match(/@random\(/g) ?? []).length;
  if (gateCount !== 1) {
    throw new Error(
      `${def.slug}: expected exactly one @random(\${shapeFrequency}) gate, found ${gateCount}`
    );
  }

  // Sanity: balanced parens in the rule.
  let depth = 0;
  for (const ch of style) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth < 0) throw new Error(`${def.slug}: unbalanced parens`);
  }
  if (depth !== 0) throw new Error(`${def.slug}: unbalanced parens`);
  if (def.palette.length !== def.colors.max) {
    throw new Error(`${def.slug}: palette length != colors.max`);
  }

  const artwork = {
    name: def.name,
    slug: def.slug,
    galleryOrder: def.order,
    ...(def.white ? { galleryWhite: true } : {}),
    description: def.description,
    palette: def.palette,
    colors: def.colors,
    ...(def.sizing ? { sizing: def.sizing } : {}),
    options,
    code: { style, doodle },
  };

  writeFileSync(
    path.join(ARTWORKS_DIR, `${def.slug}.json`),
    JSON.stringify(artwork, null, 2) + '\n'
  );

  thumbEntries.push(
    `  ${def.slug}: {\n    options: { grid: '${def.thumb.grid}', frequency: ${def.thumb.frequency} },\n  },`
  );
}

console.log(`wrote ${defs.length} artwork files`);
console.log('--- galleryThumbnails entries ---');
console.log(thumbEntries.join('\n'));
