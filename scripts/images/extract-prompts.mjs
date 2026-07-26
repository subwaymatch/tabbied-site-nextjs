// Step 1 of 4. Harvest every image prompt in the showcase into a manifest.
//
// The prompts live in three source modules (components/showcase/showcaseContent.ts,
// components/showcase/showcaseSections.ts, samples/lib/static-sections.mjs), but
// both stacks converge on one thing in the rendered HTML: every slot is a
// <figure class="imgph" data-image-id="..." data-image-prompt="..."> holding the
// final composed string, palette clause and all. So the built pages are the
// single source read here instead of three parsers that could drift.
//
// The id is authored by the renderers (imageId() in ShowcaseSite.tsx and in
// samples/generate.mjs), which is also what they check against
// public/images/showcase to decide whether to show the image or the prompt. It
// is read straight off the tag so the two sides cannot disagree.
//
//   npm run build            # writes out/showcase/<slug>/index.html
//   node samples/generate.mjs  # writes public/samples/<dir>/index.html
//   node scripts/images/extract-prompts.mjs
import fs from 'node:fs';
import path from 'node:path';
import { ASPECT_RATIO, MANIFEST, PROMPT_MAX, ROOT, SLOTS, argv, imagePath, writeJson } from './common.mjs';

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

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? null;

const prompts = [];
const byPrompt = new Map();
const overlong = [];
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

    for (const match of html.matchAll(/<figure[^>]*data-image-prompt="[^"]*"[^>]*>/g)) {
      const tag = match[0];
      const id = attr(tag, 'data-image-id');
      const slotted = id?.match(/__([a-z]+)-(\d+)$/);
      if (!slotted || !SLOTS[slotted[1]]) {
        skipped += 1;
        continue;
      }
      const [, slot, rawIndex] = slotted;
      const index = Number(rawIndex);

      const prompt = unescapeHtml(attr(tag, 'data-image-prompt') ?? '');
      const aspect = SLOTS[slot].aspect(index);
      const aspectRatio = ASPECT_RATIO[aspect];

      if (prompt.length > PROMPT_MAX) {
        overlong.push(`${id} (${prompt.length} chars)`);
      }

      // Identical prompt + ratio means one generation shared by several slots.
      const dedupeKey = `${aspectRatio}::${prompt}`;
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
        aspectRatio,
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
if (skipped) console.log(`  ${skipped} slot(s) carried no usable data-image-id and were skipped`);
if (overlong.length) {
  console.warn(`! ${overlong.length} prompt(s) exceed the model's ${PROMPT_MAX}-character limit and will be rejected:`);
  for (const line of overlong) console.warn(`    ${line}`);
}
if (args.print) for (const p of prompts) console.log(`\n[${p.id}] ${p.aspectRatio}\n${p.prompt}`);
