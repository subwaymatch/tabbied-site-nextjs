// Studio's preview: does a generated direction actually reach the template?
//
// The unit tests in packages/tabbied-templates cover the mapping with no DOM,
// and e2e/editable.spec.ts covers the engine against a packaged download. What
// neither can cover is the seam this page is made of: that the exported route
// fetches the package, that rewriting the esm.sh bootstrap to a same-origin
// bundle still mounts the patterns *inside the iframe's own document* (a custom
// element registry is per-document, which is the whole reason the runtime is
// injected rather than driven from the parent), and that the packaged
// stylesheet survives the trip.
//
// The generation is the one thing stubbed: it needs D1 and a session, and
// worker/test/api.test.ts already owns that. Everything else here is the real
// exported artefact.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.join(__dirname, '..');
const SLUG = 'verdant';

// The route, the packaged template and the bundled runtime all have to be in
// the export; skip loudly rather than failing when `npm run build` hasn't run,
// matching e2e/templates.spec.ts and e2e/editable.spec.ts.
const REQUIRED = [
  path.join(REPO_ROOT, 'out', 'studio', 'preview', 'index.html'),
  path.join(REPO_ROOT, 'out', 'downloads', SLUG, 'index.html'),
  path.join(REPO_ROOT, 'out', 'studio', 'preview-runtime.js'),
  path.join(REPO_ROOT, 'out', 'editable', `${SLUG}.json`),
];

const GENERATION = {
  id: 'e2epreview',
  description: 'A real estate business for a realtor in Champaign, IL.',
  result: {
    specVersion: 1,
    source: 'ai',
    recommended: 0,
    directions: [
      {
        slug: SLUG,
        name: 'Verdant',
        stance: 'Warmly Grounded',
        // Deliberately nothing like the template's own green: a palette that
        // failed to apply would be invisible against a similar one.
        palette: ['#F7F4EF', '#7A3B1F', '#C98B5E', '#2E2018'],
        copy: {
          brandName: 'Ye Joo Park',
          headline: 'Property made personal.',
          tagline: 'Residential, commercial, and property management.',
        },
      },
    ],
  },
};

test.describe('studio preview', () => {
  test.skip(
    REQUIRED.some((file) => !fs.existsSync(file)),
    'run `npm run build` first — needs the exported route, the packaged template and the preview runtime'
  );

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/studio/generations/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(GENERATION),
      })
    );
  });

  test('applies the generated copy and palette to the packaged template', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/studio/preview/?g=e2epreview&i=0');

    const frame = page.frameLocator('iframe');

    // Copy, on every element sharing the id — the brand name is in the
    // masthead and twice in the footer, and an edit reaches all of them.
    await expect(frame.locator('[data-edit="brand.name"]').first()).toHaveText(
      'Ye Joo Park',
      { timeout: 15_000 }
    );
    const names = frame.locator('[data-edit="brand.name"]');
    await expect(names).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      await expect(names.nth(i)).toHaveText('Ye Joo Park');
    }

    await expect(frame.locator('[data-edit="hero.title"]')).toHaveText(
      'Property made personal.'
    );
    await expect(frame.locator('[data-edit="hero.lede"]')).toHaveText(
      'Residential, commercial, and property management.'
    );

    // The palette reaches the page as inline custom properties, and the
    // TemplateSite derivation recomputes the ones that are functions of it —
    // that recomputation is what keeps body copy readable on a new ground.
    const style = await frame
      .locator('[data-edit-root]')
      .first()
      .getAttribute('style');
    expect(style).toContain('--brand-0: #F7F4EF');
    expect(style).toMatch(/--ink:/);

    // And it reaches the pattern fields, which re-colour through their declared
    // role map rather than from an explicit per-field palette.
    const patternPalette = await frame
      .locator('[data-pattern]')
      .first()
      .getAttribute('data-palette');
    expect(patternPalette).toContain('#F7F4EF');
    expect(patternPalette).not.toContain('#2d6a4f');

    expect(errors).toEqual([]);
  });

  test('mounts its patterns from the same-origin runtime, not esm.sh', async ({
    page,
  }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('esm.sh')) external.push(url);
    });

    await page.goto('/studio/preview/?g=e2epreview&i=0');

    const frame = page.frameLocator('iframe');
    const doodle = frame.locator('css-doodle').first();

    // The element existing is the custom element having been *defined* in the
    // iframe's document — a registry is per-document, so this is the assertion
    // that the runtime really ran in there.
    await expect(doodle).toHaveCount(1, { timeout: 15_000 });
    await expect
      .poll(
        () => doodle.evaluate((el) => (el as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot?.childElementCount ?? 0),
        { timeout: 15_000 }
      )
      .toBeGreaterThan(0);

    expect(external).toEqual([]);
  });

  test('keeps the packaged stylesheet, which is relative to the package', async ({
    page,
  }) => {
    await page.goto('/studio/preview/?g=e2epreview&i=0');

    const frame = page.frameLocator('iframe');
    const nav = frame.locator('nav.nav').first();

    await expect(nav).toBeVisible({ timeout: 15_000 });

    // `display: flex` comes from the packaged stylesheet, which is loaded by a
    // relative href — so this fails if the injected <base> is missing or wrong,
    // the failure that once had e2e/templates.spec.ts passing against a
    // completely unstyled page.
    await expect
      .poll(() => nav.evaluate((el) => getComputedStyle(el).display))
      .not.toBe('block');
  });
});
