// Packages a template site as a downloadable, framework-free HTML template.
//
// The static export is the source of truth: `next build` already renders every
// template page to complete HTML, so a template is derived from that rather
// than hand-ported. A hand-port is four artefacts per site to keep in step,
// and within two edits the download and the live site disagree — see
// agent-outputs/template-packaging-plan.md §1.
//
// What comes out is a folder somebody can open from the filesystem and edit:
//
//   werkraum/
//     index.html          the export, minus the Next runtime, plain class names
//     styles/base.css     the site's global reset, verbatim
//     styles/werkraum.css the page's own stylesheet — the authored source file,
//                         comments and all, NOT the minified build output
//     images/             only the images this page references
//     README.md
//
// The stylesheet is the point worth spelling out. The build emits minified CSS
// with hashed class names (.werkraum-module__N8Ibmq__page), which is unreadable
// in a template. Rather than un-minify and de-hash that, this copies the
// *authored* module file — which is already the clean, commented stylesheet a
// person should be editing — and rewrites the hashed names in the HTML back to
// the plain ones the authored file already uses.
//
// Usage:
//   node scripts/package-templates.mjs                # every packageable site
//   node scripts/package-templates.mjs werkraum       # one site
//   node scripts/package-templates.mjs --out-dir dist/downloads
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const exportDir = path.join(repoRoot, 'out');
const templateDir = path.join(repoRoot, 'app', 'template');
const publicDir = path.join(repoRoot, 'public');
const globalsCss = path.join(repoRoot, 'styles', 'globals.css');

// Sites the packager knowingly can't handle yet. Listed (rather than left to
// fail) so a *new* failure is a real signal: anything not in here that throws
// exits non-zero, which is what makes this safe to wire into a build.
const KNOWN_UNSUPPORTED = new Map([
  ['hopscotch-museum', 'stylesheet uses `composes:` (needs flattening)'],
]);

// ---- HTML surgery --------------------------------------------------------

// Everything Next.js needs to hydrate and nothing a static page does: the
// runtime chunks, the RSC flight payload inlined in <script>, and the
// stylesheet links that point into /_next/.
const stripNextRuntime = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<link[^>]*\bas="script"[^>]*>/g, '')
    .replace(/<link[^>]*href="\/_next\/[^"]*"[^>]*>/g, '');

// Tabbied's own favicons, manifest, tile and theme colour. They resolve
// against tabbied.com and would 404 in a template; the site's identity isn't
// the template's to carry either.
const stripSiteChrome = (html) =>
  html
    .replace(/<link[^>]*rel="manifest"[^>]*>/g, '')
    .replace(/<link[^>]*rel="(icon|apple-touch-icon|mask-icon)"[^>]*>/g, '')
    .replace(/<meta[^>]*name="msapplication-TileColor"[^>]*>/g, '')
    .replace(/<meta[^>]*name="theme-color"[^>]*>/g, '');

// Traces of the renderer that mean nothing without it: Suspense boundary
// markers (matched exactly, so comments the page's author wrote survive),
// the empty div React parks them in, and the stylesheet-ordering attribute
// React uses to hoist <link>s.
const stripReactArtifacts = (html) =>
  html
    .replace(/<!--\/?\$[!?]?-->/g, '')
    .replace(/<div hidden(?:="")?>\s*<\/div>/g, '')
    .replace(/\s*data-precedence="[^"]*"/g, '');

/**
 * Rewrite hashed CSS-module class names back to the plain names the authored
 * stylesheet uses: `werkraum-module__N8Ibmq__heroTitle` → `heroTitle`.
 *
 * Fails loudly on the two things that would silently corrupt a template: more
 * than one CSS module on the page (this ships exactly one stylesheet), and two
 * hashed names that collapse onto the same plain name (which would merge two
 * unrelated rules).
 */
function dehashClassNames(html, slug) {
  const hashedClass = /([A-Za-z0-9_-]+)-module__([A-Za-z0-9_]+)__([A-Za-z0-9_-]+)/g;
  const modules = new Set();
  const collisions = new Map();

  for (const [, moduleName, hash, localName] of html.matchAll(hashedClass)) {
    modules.add(`${moduleName}-module__${hash}__`);

    const seen = collisions.get(localName);
    const source = `${moduleName}__${hash}`;

    if (seen && seen !== source) {
      throw new Error(
        `${slug}: two CSS modules both define ".${localName}" — de-hashing ` +
          `would merge them. Package this site by hand or rename one.`
      );
    }

    collisions.set(localName, source);
  }

  if (modules.size > 1) {
    throw new Error(
      `${slug}: page uses ${modules.size} CSS modules (${[...modules].join(
        ', '
      )}). This packager ships one stylesheet per site.`
    );
  }

  return {
    html: html.replace(hashedClass, (_m, _module, _hash, localName) => localName),
    // Which module the page's classes came from, and which of its classes the
    // page actually uses — both needed to pick and trim the stylesheet.
    moduleName: [...modules][0]?.replace(/-module__[A-Za-z0-9_]+__$/, '') ?? null,
    usedClasses: new Set(collisions.keys()),
  };
}

/**
 * The stylesheet to ship, and whether it is this page's own.
 *
 * Most sites have an authored `<slug>.module.css` next to their page — that
 * file ships verbatim, comments and all. The five sites built on the shared
 * TemplateSite component have no per-page sheet; they use the component's,
 * which is shipped trimmed to what the page can match (see trimUnusedRules).
 */
async function resolveStylesheet(slug, moduleName) {
  const own = path.join(templateDir, slug, `${slug}.module.css`);

  try {
    return { css: await fs.readFile(own, 'utf-8'), shared: false };
  } catch {
    // Fall through to the shared component sheet the page's classes came from.
  }

  if (!moduleName) {
    throw new Error(`${slug}: no CSS module on the page and no ${slug}.module.css`);
  }

  const sharedPath = path.join(
    repoRoot,
    'components',
    'template',
    `${moduleName}.module.css`
  );

  try {
    return { css: await fs.readFile(sharedPath, 'utf-8'), shared: true };
  } catch {
    throw new Error(
      `${slug}: page uses ${moduleName}.module.css, which isn't at ` +
        `${path.relative(repoRoot, sharedPath)}`
    );
  }
}

/**
 * Point every asset at the template's own folder, and report which files need
 * copying. The build appends a content hash (`?v=d9e0e0f1`) to bust the cache
 * behind a stable slug; a template served from disk doesn't need it.
 */
function rewriteImagePaths(html) {
  const used = new Set();

  const rewritten = html.replace(
    /\/images\/([A-Za-z0-9/_-]+\.(?:webp|png|jpg|jpeg|svg|avif))(\?v=[a-z0-9]+)?/g,
    (_match, relativePath) => {
      used.add(relativePath);
      return `./images/${path.basename(relativePath)}`;
    }
  );

  return { html: rewritten, used: [...used] };
}

/** The pattern slugs the page mounts, in first-appearance order. */
const patternSlugs = (html) => [
  ...new Set([...html.matchAll(/data-pattern="([a-z0-9]+)"/g)].map((m) => m[1])),
];

// ---- CSS -----------------------------------------------------------------

/**
 * The authored stylesheet, made valid outside the CSS-modules pipeline.
 *
 * `:global(img)` is a CSS-modules construct, not CSS — left in place a browser
 * drops the whole rule. Once class names are plain, the wrapper has nothing
 * left to do, so unwrapping it to `img` is exactly equivalent.
 *
 * `composes:` is a genuine transform (the composed declarations have to be
 * folded in, or the composed class added to the markup), so a site using it
 * fails here rather than shipping a stylesheet that quietly loses rules.
 */
function prepareStylesheet(css, slug) {
  if (/^\s*composes\s*:/m.test(css)) {
    throw new Error(
      `${slug}: stylesheet uses \`composes:\`, which has no plain-CSS ` +
        `equivalent without flattening. Not yet supported by the packager.`
    );
  }

  return css.replace(/:global\(([^)]*)\)/g, '$1');
}

/**
 * Drop rules that can never match the page.
 *
 * Only needed for the five sites that share TemplateSite.module.css: a
 * stylesheet written for every site in that collection carries ~45% rules for
 * layout kits the page in hand doesn't use, and shipping those in a download
 * called "this page's stylesheet" is misleading. A site with its own authored
 * sheet uses 100% of it and is left byte-for-byte alone.
 *
 * Conservative by construction: a rule is dropped only when it names at least
 * one class AND some class it needs is absent from the page. A selector with
 * no class at all (`html`, `:root`, `a:hover`) is always kept, because whether
 * it matches can't be decided from the class list. Selector lists are filtered
 * per-selector, so `.used, .dead` keeps `.used`.
 *
 * Safe here specifically because the packaged page has no framework: the only
 * script left is the pattern bootstrap, which sets inline styles, never
 * classes. Nothing can add a class after load. The pixel diff against the live
 * page is what proves it for real.
 */
function trimUnusedRules(css, usedClasses) {
  // Every class the selector requires. `.a.b .c:hover::after` -> a, b, c.
  const classesIn = (selector) =>
    [...selector.matchAll(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g)].map((m) => m[1]);

  const keepSelector = (selector) => {
    const classes = classesIn(selector);
    return classes.length === 0 || classes.every((c) => usedClasses.has(c));
  };

  // Scanning has to skip comments, not just count braces. This codebase
  // documents its CSS heavily and at least one comment contains a literal
  // `{ color: inherit }` as an example — counted naively, that desynchronises
  // the brace depth for the rest of the file and the output is silently wrong.
  const COMMENT = /\/\*[\s\S]*?\*\//g;

  // Index of the next `char` at top level, ignoring anything inside a comment.
  const scan = (source, from, chars) => {
    let index = from;

    while (index < source.length) {
      if (source[index] === '/' && source[index + 1] === '*') {
        const close = source.indexOf('*/', index + 2);
        index = close === -1 ? source.length : close + 2;
        continue;
      }
      if (chars.includes(source[index])) return index;
      index += 1;
    }

    return -1;
  };

  const walk = (source) => {
    let out = '';
    let index = 0;

    while (index < source.length) {
      const brace = scan(source, index, '{');

      if (brace === -1) {
        out += source.slice(index);
        break;
      }

      // Match the block this brace opens, comments excepted.
      let depth = 1;
      let end = brace + 1;
      while (end < source.length && depth > 0) {
        const next = scan(source, end, '{}');
        if (next === -1) { end = source.length; break; }
        depth += source[next] === '{' ? 1 : -1;
        end = next + 1;
      }

      const prelude = source.slice(index, brace);
      const body = source.slice(brace + 1, end - 1);
      // The selector is the prelude minus the comments sitting above it.
      const selectorText = prelude.replace(COMMENT, '').trim();

      if (/^@(media|supports|container|layer)/.test(selectorText)) {
        const inner = walk(body);
        // An at-rule whose every child was dropped goes with them.
        if (inner.trim()) out += `${prelude}{${inner}}`;
      } else if (selectorText.startsWith('@')) {
        out += `${prelude}{${body}}`; // @font-face, @keyframes: keep whole
      } else {
        const kept = selectorText
          .split(',')
          .map((part) => part.trim())
          .filter(Boolean)
          .filter(keepSelector);

        if (kept.length) {
          // Keep the comments that documented this rule.
          const comments = (prelude.match(COMMENT) ?? []).join('\n');
          out += `\n${comments ? comments + '\n' : ''}${kept.join(',\n')} {${body}}\n`;
        }
      }

      index = end;
    }

    return out;
  };

  return walk(css);
}

// ---- emit ----------------------------------------------------------------

const README = (slug, name, version, slugs) => `# ${name}

A Tabbied template, packaged as a plain HTML template. No build step, no
framework — open \`index.html\` in a browser and it runs.

\`\`\`
index.html            the page
styles/base.css       global reset
styles/${slug}.css${' '.repeat(Math.max(0, 14 - slug.length))}this page's stylesheet — edit this one
images/               the photography this page uses
\`\`\`

## The patterns are live, not images

The blocks of pattern are generated in the browser by
[css-doodle](https://css-doodle.com/) through
[tabbied](https://www.npmjs.com/package/tabbied). Each one is a plain \`<div>\`
that describes itself in \`data-\` attributes:

\`\`\`html
<div data-pattern="${slugs[0]}" data-palette="transparent, #C9C8C1"
     data-fit="grid" data-redraw-interval="5200"></div>
\`\`\`

Change \`data-palette\` to recolour it, \`data-pattern\` to swap the design
(254 to choose from — see https://tabbied.com), \`data-seed\` to pin a
particular arrangement, or drop \`data-redraw-interval\` to hold it still.
The script at the bottom of \`index.html\` is what brings them to life; remove
it and the patterns disappear.

## Fonts

The page links its webfonts from Google Fonts and Adobe Fonts. Self-host them
if you'd rather not depend on a CDN.

## Images

The photography is AI-generated and ships with this template.

## Credits

Patterns by [Tabbied](https://tabbied.com) (tabbied@${version}), MIT licensed.
`;

const bootstrapScript = (version, slugs) => `
    <!-- Brings the [data-pattern] blocks above to life. Pinned to a version so
         the template keeps rendering the way it looked when you downloaded it. -->
    <script type="module">
      import { hydratePatterns } from 'https://esm.sh/tabbied@${version}';
      import { ${slugs.join(
        ', '
      )} } from 'https://esm.sh/tabbied@${version}/patterns';

      hydratePatterns({ patterns: { ${slugs.join(', ')} } });
    </script>
`;

async function packageSite(slug, outDir, version) {
  const source = path.join(exportDir, 'template', slug, 'index.html');

  let html;

  try {
    html = await fs.readFile(source, 'utf-8');
  } catch {
    throw new Error(
      `${slug}: no static export at ${path.relative(repoRoot, source)} — ` +
        `run \`npm run build\` first.`
    );
  }

  const slugs = patternSlugs(html);

  if (slugs.length === 0) {
    throw new Error(`${slug}: no [data-pattern] elements in the export.`);
  }

  html = stripReactArtifacts(stripSiteChrome(stripNextRuntime(html)));

  const dehashed = dehashClassNames(html, slug);
  const { moduleName, usedClasses } = dehashed;
  html = dehashed.html;

  const images = rewriteImagePaths(html);
  html = images.html;

  // The two stylesheets replace the /_next/ links that were just stripped.
  html = html.replace(
    '</head>',
    '<link rel="stylesheet" href="./styles/base.css"/>' +
      `<link rel="stylesheet" href="./styles/${slug}.css"/></head>`
  );
  html = html.replace('</body>', `${bootstrapScript(version, slugs)}  </body>`);

  // Write the folder.
  const siteDir = path.join(outDir, slug);
  await fs.rm(siteDir, { recursive: true, force: true });
  await fs.mkdir(path.join(siteDir, 'styles'), { recursive: true });
  await fs.mkdir(path.join(siteDir, 'images'), { recursive: true });

  await fs.writeFile(path.join(siteDir, 'index.html'), html);
  await fs.copyFile(globalsCss, path.join(siteDir, 'styles', 'base.css'));

  const stylesheet = await resolveStylesheet(slug, moduleName);
  let siteCss = prepareStylesheet(stylesheet.css, slug);

  if (stylesheet.shared) {
    // A sheet written for a whole collection carries rules for layout kits
    // this page never uses. Ship what this page can actually match.
    const before = siteCss.length;
    siteCss = trimUnusedRules(siteCss, usedClasses);
    stylesheet.trimmedPercent = Math.round((1 - siteCss.length / before) * 100);
  }

  await fs.writeFile(path.join(siteDir, 'styles', `${slug}.css`), siteCss);

  for (const relativePath of images.used) {
    await fs.copyFile(
      path.join(publicDir, 'images', relativePath),
      path.join(siteDir, 'images', path.basename(relativePath))
    );
  }

  // The page's own <title> is the site's name.
  const name = /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? slug;
  await fs.writeFile(
    path.join(siteDir, 'README.md'),
    README(slug, name, version, slugs)
  );

  // zip -r from the parent so the archive expands into a named folder rather
  // than scattering files into the download directory.
  const zipName = `${slug}-html.zip`;
  await fs.rm(path.join(outDir, zipName), { force: true });
  await run('zip', ['-qr', zipName, slug], { cwd: outDir });

  const { size } = await fs.stat(path.join(outDir, zipName));

  return {
    slug,
    patterns: slugs.length,
    images: images.used.length,
    size,
    sharedCss: stylesheet.shared ? stylesheet.trimmedPercent : null,
  };
}

// ---- cli -----------------------------------------------------------------

const args = process.argv.slice(2);
const outDirIndex = args.indexOf('--out-dir');
const outDir = path.resolve(
  repoRoot,
  // Not out/templates: that is now the exported /templates route, and a site
  // slug landing next to its index.html would be a collision waiting to
  // happen. /downloads/<slug>-html.zip is the public URL anyway.
  outDirIndex === -1 ? 'out/downloads' : args[outDirIndex + 1]
);
// Positional args are slugs. A flag's value is not one.
const flagValueIndexes = new Set(
  args.flatMap((arg, index) => (arg.startsWith('--') ? [index + 1] : []))
);
const requested = args.filter(
  (arg, index) => !arg.startsWith('--') && !flagValueIndexes.has(index)
);

// Templates pin the package version so a download keeps rendering the way it
// looked. That comes from the workspace's package.json, which changesets has
// already bumped by the time a release builds the site — so a template always
// points at a version that is either published or about to be. Override it
// when generating templates against an unreleased build.
const versionIndex = args.indexOf('--tabbied-version');
const version =
  versionIndex !== -1
    ? args[versionIndex + 1]
    : JSON.parse(
        await fs.readFile(
          path.join(repoRoot, 'packages', 'tabbied', 'package.json'),
          'utf-8'
        )
      ).version;

const packageable = (await fs.readdir(templateDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const targets = requested.length > 0 ? requested : packageable;

await fs.mkdir(outDir, { recursive: true });

let written = 0;
let skipped = 0;
let failed = 0;

for (const slug of targets) {
  const knownReason = KNOWN_UNSUPPORTED.get(slug);

  // A site named explicitly is still attempted, so the reason is a fresh
  // error message rather than a stale note.
  if (knownReason && requested.length === 0) {
    skipped += 1;
    console.log(`package-templates: skipping ${slug} — ${knownReason}`);
    continue;
  }

  try {
    const result = await packageSite(slug, outDir, version);
    written += 1;
    console.log(
      `package-templates: ${result.slug} — ${result.patterns} pattern(s), ` +
        `${result.images} image(s), ${(result.size / 1024).toFixed(0)} KB zip` +
        (result.sharedCss !== null
          ? ` (shared stylesheet, ${result.sharedCss}% trimmed)`
          : '')
    );
  } catch (error) {
    failed += 1;
    console.error(`package-templates: ${slug} — ${error.message}`);
  }
}

console.log(
  `package-templates: wrote ${written} template(s) to ` +
    `${path.relative(repoRoot, outDir)}` +
    (skipped > 0 ? `, skipped ${skipped} known-unsupported` : '') +
    (failed > 0 ? `, ${failed} FAILED` : '')
);

// Only unexpected failures are fatal — the known-unsupported set is skipped
// above, so this stays safe to run as part of a build.
if (failed > 0) {
  process.exitCode = 1;
}
