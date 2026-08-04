// The packaged HTML templates: does a zip somebody downloads actually work?
//
// This is the test that keeps `scripts/package-templates.mjs` honest. The
// templates are derived from the static export, so a change to a showcase page
// silently reshapes them — a smoke test that opens the generated template and
// asserts its artworks came up is what catches a template that stopped working
// because a page changed.
//
// Requires `npm run build && node scripts/package-templates.mjs` to have run;
// the suite skips (loudly) rather than failing when the templates aren't there,
// so the rest of the e2e run isn't blocked by a missing optional build step.
import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.join(__dirname, '..');
const PACKAGE_DIR = path.join(REPO_ROOT, 'packages', 'tabbied');
const TEMPLATE_DIR = path.join(REPO_ROOT, 'out', 'templates', 'werkraum');

// The template pins its bootstrap to the published package on esm.sh. Serving
// this branch's built dist in its place keeps the test deterministic and
// offline — and means it exercises the code about to ship rather than the
// version that happens to be on the CDN.
const distFileFor = (url: string): string | null => {
  const pathname = new URL(url).pathname;

  if (/^\/tabbied@[^/]+\/artworks$/.test(pathname)) {
    return path.join(PACKAGE_DIR, 'dist', 'artworks.generated.js');
  }
  if (/^\/tabbied@[^/]+$/.test(pathname)) {
    return path.join(PACKAGE_DIR, 'dist', 'core', 'index.js');
  }
  // Relative imports inside the served modules resolve against esm.sh's root
  // (the base URL is /tabbied@x), so they arrive here as bare filenames.
  const file = path.join(PACKAGE_DIR, 'dist', 'core', path.basename(pathname));

  return fs.existsSync(file) ? file : null;
};

test.describe('packaged HTML template', () => {
  test.skip(
    !fs.existsSync(path.join(TEMPLATE_DIR, 'index.html')),
    'run `node scripts/package-templates.mjs werkraum` first'
  );

  test('opens standalone and brings its artworks up', async ({ page }) => {
    const cssDoodle = fs.readFileSync(
      path.join(REPO_ROOT, 'node_modules', 'css-doodle', 'css-doodle.min.js'),
      'utf-8'
    );

    await page.route('https://esm.sh/**', async (route) => {
      const url = route.request().url();

      // register.js imports 'css-doodle' as a bare specifier, which a browser
      // can't resolve on its own — serve it from the same origin.
      if (url.endsWith('/css-doodle')) {
        return route.fulfill({
          status: 200,
          body: cssDoodle,
          headers: { 'content-type': 'application/javascript' },
        });
      }

      const file = distFileFor(url);

      if (!file) return route.fulfill({ status: 404, body: '' });

      return route.fulfill({
        status: 200,
        body: fs
          .readFileSync(file, 'utf-8')
          // Only the import specifier — the same string appears as a tag name
          // in document.createElement('css-doodle'), which must not be touched.
          .replace(
            /\b(import|from)\s+(['"])css-doodle\2/g,
            '$1 "https://esm.sh/css-doodle"'
          ),
        headers: { 'content-type': 'application/javascript' },
      });
    });

    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // Served by `npm start` (serve out) alongside the site itself.
    await page.goto('/templates/werkraum/index.html');

    const hosts = page.locator('[data-artwork]');
    await expect(hosts).toHaveCount(8);

    // Every placeholder gets a live element, and they paint.
    await expect
      .poll(
        () => page.locator('[data-artwork] css-doodle').count(),
        { timeout: 20000 }
      )
      .toBe(8);

    await expect
      .poll(
        () =>
          page.evaluate(() =>
            [...document.querySelectorAll('css-doodle')].reduce(
              (total, element) =>
                total +
                (element.shadowRoot?.querySelectorAll('cssd-cell').length ?? 0),
              0
            )
          ),
        { timeout: 20000 }
      )
      .toBeGreaterThan(100);

    expect(errors).toEqual([]);
  });

  test('carries no build-tool residue', async ({ page }) => {
    const html = fs.readFileSync(
      path.join(TEMPLATE_DIR, 'index.html'),
      'utf-8'
    );

    // Hashed class names, the Next runtime and the RSC payload are exactly
    // what makes an export unusable as a template.
    expect(html).not.toMatch(/-module__[A-Za-z0-9_]+__/);
    expect(html).not.toContain('/_next/');
    expect(html).not.toContain('__next_f');
    expect(html).not.toMatch(/<!--\/?\$[!?]?-->/);
    expect(html).not.toContain('data-precedence');

    // Plain class names the shipped stylesheet actually defines.
    expect(html).toContain('class="page"');

    // Assets are relative, so the folder works opened from disk.
    expect(html).not.toMatch(/(?:src|href)="\/images\//);
    expect(html).toContain('./images/werkraum-hero.webp');
    expect(html).toContain('./styles/werkraum.css');

    // The stylesheet is the authored source — comments intact, not minified.
    const css = fs.readFileSync(
      path.join(TEMPLATE_DIR, 'styles', 'werkraum.css'),
      'utf-8'
    );
    expect(css).toContain('/* ===');
    expect(css).toMatch(/^\.page \{$/m);
    expect(css).not.toContain(':global(');

    // Every image the page references was copied in.
    for (const match of html.matchAll(/\.\/images\/([^"']+)/g)) {
      expect(
        fs.existsSync(path.join(TEMPLATE_DIR, 'images', match[1])),
        `${match[1]} should be packaged`
      ).toBe(true);
    }

    await page.goto('/templates/werkraum/index.html');
  });
});
