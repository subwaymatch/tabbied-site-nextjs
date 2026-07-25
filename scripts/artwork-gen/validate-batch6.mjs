// Renders every batch-6 artwork in headless Chromium at its gallery-thumbnail
// settings and verifies it paints, keeps its cells across reseed (so
// transitions animate) and logs no console errors.
//
// Batch 6 is the *ordered* batch, so it gets one extra check the earlier
// batches can't make: with the frequency gate forced fully open, a reseed must
// leave every geometric property (position, size, angle, clip, radius) exactly
// as it was and change only the inks. That is the machine-checkable form of
// "the pattern is predictable — only the colorway is redrawn".
//
// Also writes contact-sheet screenshots to /tmp/sheet-b6-*.png for review.
// Set CHROMIUM_PATH to use a browser other than Playwright's own download.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { batch6 } from './artwork-defs-6.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cssDoodle = readFileSync(
  path.join(ROOT, 'node_modules/css-doodle/css-doodle.min.js'),
  'utf-8'
);

// `@random(n)` with n >= the cell count paints every cell, which takes the
// frequency gate's own dice roll out of the geometry comparison below.
const ALL_CELLS = 9999;

function buildSource(artwork, { width, height, optionOverrides = {} }) {
  let style = artwork.code.style;
  let doodle = artwork.code.doodle;
  for (const option of artwork.options) {
    const value = optionOverrides[option.id] ?? option.default;
    style = style.split(option.replace).join(String(value));
    doodle = doodle.split(option.replace).join(String(value));
  }
  style = style.split('${width}').join(width);
  style = style.split('${height}').join(height);
  doodle = doodle.split('${width}').join(width);
  doodle = doodle.split('${height}').join(height);
  const colors = artwork.palette
    .map((color, idx) => `--color${idx}: ${color};`)
    .join(' ');
  return { style: colors + ' ' + style, doodle };
}

// Split into what must stay put across a reseed and what is allowed (and
// expected) to change.
const GEOM_PROPS = ['transform', 'clipPath', 'borderRadius', 'width', 'height', 'left', 'top', 'margin', 'inset', 'opacity', 'zIndex', 'borderTopWidth', 'borderLeftWidth'];
const COLOR_PROPS = ['backgroundColor', 'borderTopColor', 'borderRightColor', 'boxShadow'];

async function inspect(page) {
  return page.evaluate(([geomProps, colorProps]) => {
    const out = {};
    for (const el of document.querySelectorAll('css-doodle')) {
      const slug = el.dataset.slug;
      const cells = [...el.shadowRoot.querySelectorAll('cssd-cell')];
      let painted = 0;
      const geom = [];
      const color = [];
      for (const c of cells) {
        const styles = [
          getComputedStyle(c),
          getComputedStyle(c, '::before'),
          getComputedStyle(c, '::after'),
        ];
        const before = styles[1];
        const after = styles[2];
        const s = styles[0];
        const hasFeature =
          s.backgroundColor !== 'rgba(0, 0, 0, 0)' ||
          s.backgroundImage !== 'none' ||
          s.clipPath !== 'none' ||
          s.borderTopWidth !== '0px' ||
          s.borderLeftWidth !== '0px' ||
          before.content === '""' ||
          after.content === '""';
        if (hasFeature) painted++;
        for (const st of styles) {
          geom.push(geomProps.map((p) => st[p]).join('|'));
          color.push(colorProps.map((p) => st[p]).join('|'));
        }
        geom.push(before.content, after.content);
      }
      out[slug] = {
        cellCount: cells.length,
        painted,
        geom: geom.join('~'),
        color: color.join('~'),
        firstCellMarked: cells[0]?.__marked ?? false,
      };
    }
    return out;
  }, [GEOM_PROPS, COLOR_PROPS]);
}

const CHUNK = 20;
const chunks = [];
for (let i = 0; i < batch6.length; i += CHUNK) chunks.push(batch6.slice(i, i + CHUNK));

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
const failures = [];
let shot = 0;

for (const chunk of chunks) {
  shot++;
  const blocks = chunk.map((def) => {
    const artwork = JSON.parse(
      readFileSync(path.join(ROOT, `packages/tabbied/artworks/${def.slug}.json`), 'utf-8')
    );
    const { style, doodle } = buildSource(artwork, {
      width: '300px',
      height: '300px',
      optionOverrides: { grid: def.thumb.grid, frequency: ALL_CELLS },
    });
    return { slug: def.slug, style, doodle, name: artwork.name };
  });

  const html = `<!DOCTYPE html><html><head><style>
    body { margin: 0; background: #777; display: grid; grid-template-columns: repeat(5, 320px); gap: 14px; padding: 14px; font-family: sans-serif; }
    figure { margin: 0; }
    figcaption { color: #fff; font-size: 13px; padding: 3px 1px; }
    ${blocks.map((b) => `css-doodle[data-slug="${b.slug}"] { ${b.style} }`).join('\n')}
  </style></head><body>
    ${blocks
      .map(
        (b) =>
          `<figure><figcaption>${b.name}</figcaption><css-doodle data-slug="${b.slug}" data-seed="t1Ab" use="var(--rule)">${b.doodle}</css-doodle></figure>`
      )
      .join('\n')}
  <script>${cssDoodle}</script></body></html>`;

  const page = await browser.newPage({ viewport: { width: 1700, height: 1450 } });
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(1200);

  await page.evaluate(() => {
    for (const el of document.querySelectorAll('css-doodle')) {
      const c = el.shadowRoot.querySelector('cssd-cell');
      if (c) c.__marked = true;
    }
  });

  const before = await inspect(page);
  await page.screenshot({ path: `/tmp/sheet-b6-${shot}-seed1.png`, fullPage: true });

  await page.evaluate(() => {
    for (const el of document.querySelectorAll('css-doodle')) {
      el.setAttribute('data-seed', 'z9Qx');
      el.update(el.textContent);
    }
  });
  await page.waitForTimeout(2800);
  const after = await inspect(page);
  await page.screenshot({ path: `/tmp/sheet-b6-${shot}-seed2.png`, fullPage: true });

  for (const def of chunk) {
    const slug = def.slug;
    const b = before[slug];
    const a = after[slug];
    const artwork = JSON.parse(
      readFileSync(path.join(ROOT, `packages/tabbied/artworks/${slug}.json`), 'utf-8')
    );
    const problems = [];
    if (!b || b.cellCount === 0) problems.push('no cells rendered');
    else {
      if (b.painted === 0) problems.push('nothing painted');
      if (b.painted < b.cellCount) problems.push(`only ${b.painted}/${b.cellCount} painted with the gate wide open`);
      if (a.color === b.color) problems.push('reseed produced identical inks');
      if (a.geom !== b.geom) problems.push('reseed moved the pattern (batch 6 must be positionally stable)');
      if (!a.firstCellMarked) problems.push('cells were rebuilt on reseed (transitions broken)');
    }
    if (!artwork.code.style.includes('transition')) problems.push('no transition in style');
    if (problems.length) failures.push({ slug, problems });
  }
  if (errors.length) failures.push({ slug: `(page ${shot})`, problems: [...new Set(errors)].slice(0, 5) });
  await page.close();
}

await browser.close();

if (failures.length) {
  console.log('FAILURES:');
  for (const f of failures) console.log(' ', f.slug, '→', f.problems.join('; '));
  process.exit(1);
}
console.log(
  `all ${batch6.length} batch-6 artworks render, re-ink on reseed and hold their geometry ✓`
);
