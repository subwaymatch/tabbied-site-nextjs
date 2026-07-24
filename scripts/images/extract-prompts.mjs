// Step 1 of 4. Harvest every GPT Image 2 prompt in the showcase into a manifest.
//
// The prompts live in three source modules (components/showcase/showcaseContent.ts,
// components/showcase/showcaseSections.ts, samples/lib/static-sections.mjs), but
// both stacks converge on one thing in the rendered HTML: every placeholder is a
// <figure class="imgph" data-image-prompt="..."> holding the final composed
// string, palette clause and all. So the built pages are the single source read
// here instead of three parsers that could drift.
//
//   npm run build            # writes out/showcase/<slug>/index.html
//   node samples/generate.mjs  # writes public/samples/<dir>/index.html
//   node scripts/images/extract-prompts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { MANIFEST, ROOT, SIZE_FOR_ASPECT, SLOTS, argv, imagePath, writeJson } from './common.mjs';

const args = argv();

const SOURCES = [
  { stack: 'static', dir: path.join(ROOT, 'public/samples'), hint: 'node samples/generate.mjs' },
  { stack: 'react', dir: path.join(ROOT, 'out/showcase'), hint: 'npm run build' },
];

const unescapeHtml = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// Both stacks wrap the figure in a slot container. Static uses plain class names
// and React uses hashed CSS-module names, so match the camel and kebab spelling
// of each and take whichever opened last before the figure.
const SLOT_TOKENS = [
  [/card-media|cardMedia/, 'card'],
  [/alt-media|altMedia/, 'alt'],
  [/gallery-cell|galleryCell/, 'gallery'],
];

function slotFor(before) {
  let best = null;
  for (const [re, slot] of SLOT_TOKENS) {
    const global = new RegExp(re.source, 'g');
    let match;
    let last = -1;
    while ((match = global.exec(before)) !== null) last = match.index;
    if (last > (best?.at ?? -1)) best = { at: last, slot };
  }
  return best?.slot ?? null;
}

const prompts = [];
const byPrompt = new Map();
let skipped = 0;

for (const { stack, dir, hint } of SOURCES) {
  if (!fs.existsSync(dir)) {
    console.warn(`! ${path.relative(ROOT, dir)} is missing, skipping ${stack} prompts (run: ${hint})`);
    continue;
  }
  const sites = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
  for (const entry of sites.sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(dir, entry.name, 'index.html');
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const counters = { card: 0, alt: 0, gallery: 0 };

    for (const match of html.matchAll(/data-image-prompt="([^"]*)"/g)) {
      const slot = slotFor(html.slice(Math.max(0, match.index - 400), match.index));
      if (!slot) {
        skipped += 1;
        continue;
      }
      const index = counters[slot];
      counters[slot] += 1;

      const prompt = unescapeHtml(match[1]);
      const aspect = SLOTS[slot].aspect(index);
      const size = SIZE_FOR_ASPECT[aspect];
      const id = `${stack}__${entry.name}__${slot}-${index}`;

      // Identical prompt + size means one generation shared by several slots.
      const dedupeKey = `${size}::${prompt}`;
      const original = byPrompt.get(dedupeKey);
      if (original) {
        original.aliases.push(id);
        continue;
      }

      const record = {
        id,
        stack,
        site: entry.name,
        slot,
        index,
        aspect,
        size,
        maxWidth: SLOTS[slot].maxWidth,
        prompt,
        out: path.relative(ROOT, imagePath(id)),
        aliases: [],
      };
      byPrompt.set(dedupeKey, record);
      prompts.push(record);
    }
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  total: prompts.length,
  aliased: prompts.reduce((n, p) => n + p.aliases.length, 0),
  prompts,
};
writeJson(MANIFEST, manifest);

const perStack = prompts.reduce((acc, p) => ({ ...acc, [p.stack]: (acc[p.stack] ?? 0) + 1 }), {});
console.log(`${prompts.length} unique prompts -> ${path.relative(ROOT, MANIFEST)}`);
console.log(`  by stack: ${Object.entries(perStack).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`);
if (manifest.aliased) console.log(`  ${manifest.aliased} duplicate prompt(s) will reuse another image`);
if (skipped) console.log(`  ${skipped} placeholder(s) had no recognized slot wrapper and were skipped`);
if (args.print) for (const p of prompts) console.log(`\n[${p.id}] ${p.size}\n${p.prompt}`);
