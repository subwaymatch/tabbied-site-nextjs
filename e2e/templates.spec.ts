// The packaged HTML templates: does a zip somebody downloads actually work?
//
// This is the test that keeps `scripts/package-templates.mjs` honest. The
// templates are derived from the static export, so a change to a template page
// silently reshapes them — a smoke test that opens the generated template and
// asserts its patterns came up is what catches a template that stopped working
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
const dirFor = (slug: string) =>
  path.join(REPO_ROOT, 'out', 'downloads', slug);

// Two sites, because the packager has two stylesheet paths and they fail
// differently. werkraum has its own authored `<slug>.module.css`, which ships
// verbatim. solstice is one of the five built on the shared TemplateSite
// component: it has no per-page sheet, so the component's is shipped trimmed
// to the rules the page can actually match — a transform with real room to be
// silently wrong, which is why it is covered here too.
// hopscotch-museum is the third path: its authored sheet uses `composes:`,
// which CSS Modules resolves in the markup rather than the stylesheet. The
// packager drops the (inert, non-CSS) declaration after checking the build
// really did put both classes on the element.
const FIXTURES = [
  { slug: 'werkraum', shared: false, patterns: 8, hero: 'werkraum-hero.webp' },
  { slug: 'solstice', shared: true, patterns: 4, hero: null },
  { slug: 'hopscotch-museum', shared: false, patterns: 8, hero: null },
] as const;

// The template pins its bootstrap to the published package on esm.sh. Serving
// this branch's built dist in its place keeps the test deterministic and
// offline — and means it exercises the code about to ship rather than the
// version that happens to be on the CDN.
const distFileFor = (url: string): string | null => {
  const pathname = new URL(url).pathname;

  if (/^\/tabbied@[^/]+\/patterns$/.test(pathname)) {
    return path.join(PACKAGE_DIR, 'dist', 'patterns.generated.js');
  }
  if (/^\/tabbied@[^/]+$/.test(pathname)) {
    return path.join(PACKAGE_DIR, 'dist', 'core', 'index.js');
  }
  // Relative imports inside the served modules resolve against esm.sh's root
  // (the base URL is /tabbied@x), so they arrive here as bare filenames.
  const file = path.join(PACKAGE_DIR, 'dist', 'core', path.basename(pathname));

  return fs.existsSync(file) ? file : null;
};

for (const fixture of FIXTURES) {
  const TEMPLATE_DIR = dirFor(fixture.slug);

  test.describe(`packaged HTML template (${fixture.slug})`, () => {
  test.skip(
    !fs.existsSync(path.join(TEMPLATE_DIR, 'index.html')),
    `run \`node scripts/package-templates.mjs ${fixture.slug}\` first`
  );

  test('opens standalone and brings its patterns up', async ({ page }) => {
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

    // The directory form, with the trailing slash, on purpose. `serve`
    // rewrites `<dir>/index.html` to an extensionless `<dir>` — no trailing
    // slash — and every relative asset in the template then resolves one
    // level too high and 404s. The template is fine (opened from disk, or
    // served by anything that doesn't do that rewrite); the URL is what has
    // to be right here, or this spec silently tests an unstyled page.
    await page.goto(`/downloads/${fixture.slug}/`);

    const hosts = page.locator('[data-pattern]');
    await expect(hosts).toHaveCount(fixture.patterns);

    // Every placeholder gets a live element, and they paint.
    await expect
      .poll(
        () => page.locator('[data-pattern] css-doodle').count(),
        { timeout: 20000 }
      )
      .toBe(fixture.patterns);

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

    // Assets are relative, so the folder works opened from disk.
    expect(html).not.toMatch(/(?:src|href)="\/images\//);
    if (fixture.hero) expect(html).toContain(`./images/${fixture.hero}`);
    expect(html).toContain(`./styles/${fixture.slug}.css`);

    const css = fs.readFileSync(
      path.join(TEMPLATE_DIR, 'styles', `${fixture.slug}.css`),
      'utf-8'
    );

    // Readable, not minified, and free of CSS-modules-only syntax.
    expect(css).toContain('/*');
    expect(css).not.toContain(':global(');
    expect(css).not.toContain('composes:');

    // Every class the markup uses must survive into the stylesheet —
    // this is what the trim could get wrong on a shared sheet.
    const declared = new Set(
      [...css.matchAll(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g)].map((m) => m[1])
    );
    const onPage = new Set<string>();
    for (const attr of html.matchAll(/class="([^"]*)"/g)) {
      for (const name of attr[1].split(/\s+/)) if (name) onPage.add(name);
    }
    // Two sets of class names are hooks rather than styles: lucide's own
    // icon classes, and the `figure`/`figure--cutout` markers the Figure
    // component puts on every image for pages that want to target them.
    // A page that styles neither is not missing anything.
    const HOOKS = new Set(['figure', 'figure--cutout']);
    const orphans = [...onPage].filter(
      (name) =>
        !declared.has(name) && !name.startsWith('lucide') && !HOOKS.has(name)
    );
    expect(orphans, `classes used by the page but absent from its stylesheet`)
      .toEqual([]);

    // Braces balance — the trim walks the sheet by hand, and a comment
    // containing a literal `{` once desynchronised it.
    const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
    expect((withoutComments.match(/\{/g) ?? []).length).toBe(
      (withoutComments.match(/\}/g) ?? []).length
    );

    // Every image the page references was copied in.
    for (const match of html.matchAll(/\.\/images\/([^"']+)/g)) {
      expect(
        fs.existsSync(path.join(TEMPLATE_DIR, 'images', match[1])),
        `${match[1]} should be packaged`
      ).toBe(true);
    }

    await page.goto(`/downloads/${fixture.slug}/`);
  });
  });
}
