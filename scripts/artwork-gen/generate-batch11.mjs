// Syncs packages/tabbied/artworks/ with the batch-11 definitions: writes one
// JSON per definition, deletes any batch-11 artwork (and its gallery thumbnail
// entry) that the definitions no longer describe, and prints the thumbnail
// entries to insert. Scoped to gallery orders 1200+ so it never touches
// artworks shipped in another batch.
//
// On top of the house rules every batch is checked against, this one lints for
// the CSS that would cost a design its clean SVG-export tier — box-shadow,
// filter, blend modes, smooth conic sweeps, nested doodles and @svg payloads.
// Those checks are the cheap first pass; validate-svg-batch11.mjs is the real
// gate, running the shipped converter over every rendered design.
import { writeFileSync, readdirSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch11 } from './artwork-defs-11.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const ARTWORKS_DIR = path.join(ROOT, 'packages/tabbied/artworks');
const THUMBNAILS_FILE = path.join(
  ROOT,
  'components/select-artwork-page/galleryThumbnails.ts'
);

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

const defs = batch11;

const batchSlugs = new Set();
for (const def of defs) {
  if (batchSlugs.has(def.slug)) throw new Error(`duplicate slug: ${def.slug}`);
  batchSlugs.add(def.slug);
}

// Batch 11 owns gallery orders 1200+, so a file already on disk is either this
// batch's own output (safe to rewrite) or an earlier batch's artwork (never
// clobber it). Batch 11 is the last batch, so its range is open-ended; a batch
// 12 would need to bound this the way the earlier generators bound theirs.
const FIRST_ORDER = 1200;
const ownedByBatch11 = (order) => order >= FIRST_ORDER;
const existing = new Set(
  readdirSync(ARTWORKS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
);
const orderOf = (slug) =>
  JSON.parse(readFileSync(path.join(ARTWORKS_DIR, `${slug}.json`), 'utf-8'))
    .galleryOrder;

for (const def of defs) {
  if (!existing.has(def.slug)) continue;
  if (!ownedByBatch11(orderOf(def.slug))) {
    throw new Error(`batch-11 slug ${def.slug} collides with an existing artwork`);
  }
}

// Drop artworks this batch used to own but no longer defines, so the
// definitions stay the single source of truth for what ships.
const dropped = [...existing].filter(
  (slug) => !batchSlugs.has(slug) && ownedByBatch11(orderOf(slug))
);
for (const slug of dropped) {
  unlinkSync(path.join(ARTWORKS_DIR, `${slug}.json`));
}
if (dropped.length) {
  let thumbs = readFileSync(THUMBNAILS_FILE, 'utf-8');
  for (const slug of dropped) {
    thumbs = thumbs.replace(
      new RegExp(`\\n  ${slug}: \\{[\\s\\S]*?\\n  \\},`, 'g'),
      ''
    );
  }
  writeFileSync(THUMBNAILS_FILE, thumbs);
  console.log(
    `removed ${dropped.length} artwork files + thumbnail entries: ${dropped.join(', ')}`
  );
}

// Declarations that would cost a design the clean SVG-export tier. Each maps
// to a tier-2 caveat in docs/svg-export.md, which batch 11 exists not to have.
const SVG_BANNED = [
  [/box-shadow\s*:/, 'box-shadow exports as an SVG drop-shadow filter'],
  [/(^|[^-\w])filter\s*:/, 'filter() exports as an SVG filter primitive'],
  [/mix-blend-mode\s*:/, 'mix-blend-mode exports as an SVG blend style'],
  [/backdrop-filter\s*:/, 'backdrop-filter has no SVG equivalent'],
  [/repeating-conic-gradient/, 'the converter rejects repeating-conic-gradient'],
  [/@doodle\s*\(/, 'nested @doodle images deviate from the live render'],
  [/@svg\s*\(/, '@svg payloads rasterize with different sub-pixel rounding'],
  [/text-shadow\s*:/, 'text-shadow has no clean SVG mapping here'],
];

// A conic-gradient span whose endpoints differ in colour is a smooth angular
// sweep — SVG has no angular gradient, and the converter throws on one. Only
// hard stops are allowed: wherever the colour changes, the two stops must sit
// at the same angle.
//
// Every stop is flattened to (colour, angle) pairs first, so the two-position
// shorthand `#000 0 42deg` is compared the same way a pair of stops would be.
// Positions that are still css-doodle expressions (`@calc(20 + 310 * @y / @Y)deg`)
// stay strings and compare textually: two stops written from the same
// expression resolve to the same angle in every cell, which is all a hard stop
// requires.
const angleOf = (token) => {
  const m = /^(-?[\d.]+)(deg|turn|grad|rad)?$/.exec(token);
  if (!m) return token;
  const n = parseFloat(m[1]);
  switch (m[2]) {
    case 'turn':
      return n * 360;
    case 'grad':
      return n * 0.9;
    case 'rad':
      return (n * 180) / Math.PI;
    default:
      return n;
  }
};

/** Split on whitespace, but not inside parentheses. */
const splitTokens = (text) => {
  const out = [];
  let depth = 0;
  let current = '';
  for (const ch of text) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) {
      if (current) out.push(current);
      current = '';
      continue;
    }
    current += ch;
  }
  if (current) out.push(current);
  return out;
};

const assertHardStopConic = (slug, style) => {
  for (const m of style.matchAll(
    /conic-gradient\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g
  )) {
    const parts = m[1].split(',').map((s) => s.trim());
    // Drop the leading `from <angle>` / `at <position>` clause.
    if (/^(from|at)\b/.test(parts[0])) parts.shift();
    const flat = [];
    for (const part of parts) {
      if (!part) continue;
      const [color, ...positions] = splitTokens(part);
      if (!positions.length) {
        flat.push({ color, pos: null });
        continue;
      }
      for (const pos of positions) flat.push({ color, pos: angleOf(pos) });
    }
    // CSS clamps each stop position up to the largest one before it, which is
    // what makes `transparent 0` after a 90deg stop a hard stop rather than a
    // backwards sweep. Model that before comparing — for the numeric ones;
    // an unresolved expression is only ever compared against itself.
    let high = -Infinity;
    for (const stop of flat) {
      if (typeof stop.pos !== 'number') continue;
      stop.pos = Math.max(stop.pos, high);
      high = stop.pos;
    }
    for (let i = 1; i < flat.length; i++) {
      const a = flat[i - 1];
      const b = flat[i];
      if (a.color === b.color) continue;
      if (a.pos === null || b.pos === null || a.pos !== b.pos) {
        throw new Error(
          `${slug}: conic-gradient sweeps smoothly from ${a.color} to ${b.color} — SVG has no angular gradient`
        );
      }
    }
  }
};

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
  // Painting var(--color0) only *looks* like a knockout while the background
  // is opaque. Cut the shape instead (clip-path hole, mask, or a gap).
  if (/var\(\s*--color0\s*\)/.test(style)) {
    throw new Error(
      `${def.slug}: style paints var(--color0) — that knockout disappears on a transparent background`
    );
  }
  // Exactly one frequency gate, so the slider always thins the whole field.
  const gateCount = (style.match(/@random\(\$\{shapeFrequency\}\)/g) ?? []).length;
  if (gateCount !== 1) {
    throw new Error(
      `${def.slug}: expected exactly one @random(\${shapeFrequency}) gate, found ${gateCount}`
    );
  }
  // The batch-11 rule: nothing that would need an svgExportNote.
  for (const [pattern, why] of SVG_BANNED) {
    if (pattern.test(style)) {
      throw new Error(`${def.slug}: ${why} — batch 11 exports clean or not at all`);
    }
  }
  assertHardStopConic(def.slug, style);
  // A border on a partially-rounded box makes the converter throw. Borders go
  // on square boxes or on full circles (border-radius: 50%), never between.
  const boxes = style.split(/(?=:before|:after)/);
  for (const box of boxes) {
    if (!/border(-(top|right|bottom|left))?(-width)?\s*:/.test(box)) continue;
    const radii = [...box.matchAll(/border-radius\s*:\s*([^;]+);/g)].map((m) =>
      m[1].trim()
    );
    for (const radius of radii) {
      if (!/^(50%|0|0%|none)$/.test(radius)) {
        throw new Error(
          `${def.slug}: a border on a partially-rounded box (${radius}) fails SVG export`
        );
      }
    }
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
  if (!/transition/.test(style)) {
    throw new Error(`${def.slug}: no transition in style`);
  }
  // Every design must sample an ink that CSS can transition, so a reseed
  // morphs instead of snapping. background-image alone does not transition.
  if (!/(background|border)(-[a-z]+)?\s*:\s*[^;]*@p(ick)?\(/.test(style)) {
    throw new Error(
      `${def.slug}: no per-cell randomized background/border ink — a reseed would snap`
    );
  }

  const artwork = {
    name: def.name,
    slug: def.slug,
    galleryOrder: def.order,
    ...(def.white ? { galleryWhite: true } : {}),
    description: def.description,
    palette: def.palette,
    colors: def.colors,
    ...(def.minCellPx ? { sizing: { minCellPx: def.minCellPx } } : {}),
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
if (process.env.PRINT_THUMBS) {
  console.log('--- galleryThumbnails entries ---');
  console.log(thumbEntries.join('\n'));
}
