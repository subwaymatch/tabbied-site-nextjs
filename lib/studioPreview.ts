// Turning a packaged template into a preview of a generated direction.
//
// The artefact previewed is the *download* — out/downloads/<slug>/index.html,
// the same bytes the Download button hands over. That is deliberate on both
// counts. It is the only version of a template with no framework left in it,
// so its patterns are `[data-pattern]` placeholders the edits engine can
// rewrite and a plain `hydratePatterns()` can mount, where the live
// /template/<slug>/ page mounts its patterns through React and would ignore an
// attribute written from outside. And previewing what is actually downloaded
// is the difference between a preview and a mockup.
//
// Three changes are made to it, and no others:
//
//   1. A <base> so the package's relative styles/ and images/ still resolve
//      once the document is running inside an iframe on another path.
//   2. The bootstrap's esm.sh import is pointed at a same-origin bundle. The
//      pinned CDN import is right for a stranger who unzipped the download
//      years from now and wrong for this site drawing its own preview.
//   3. The edits document — the generated brand copy and palette — applied by
//      the engine, exactly as an editor would apply it.
//
// The rest of the page is untouched, which is what makes this honest: every
// section, image and word the download contains is what shows up here.
import {
  applyEdits,
  directionToEdits,
  type BrandDirection,
  type Problem,
  type TemplateSpec,
} from 'tabbied-templates';

/** The bundled, same-origin pattern runtime (scripts/build-preview-runtime.mjs). */
export const PREVIEW_RUNTIME = '/studio/preview-runtime.js';

export const packagedTemplateUrl = (slug: string) => `/downloads/${slug}/`;

export const templateSpecUrl = (slug: string) => `/editable/${slug}.json`;

export type PreviewDocument = {
  /** Serialized HTML, ready for an iframe's srcdoc. */
  html: string;
  /** Anything the engine could not apply. Rendered, not swallowed. */
  problems: Problem[];
};

/**
 * The script the shell injects in place of the packaged bootstrap.
 *
 * It carries no pattern names: the runtime bundles every design any packaged
 * template mounts and `hydrate()` closes over the map, so this is the same one
 * line for all 57 sites and cannot drift from the page it revives.
 */
const bootstrap = `import { hydrate } from '${PREVIEW_RUNTIME}';\nhydrate();\n`;

/**
 * Rewrite the packaged bootstrap to load the same-origin runtime.
 *
 * Matched on the esm.sh specifier rather than on position: the packager writes
 * exactly one such module script today (scripts/package-templates.mjs), and if
 * that ever stops being true a preview that silently drew nothing would be far
 * harder to notice than the problem this reports.
 */
function rewriteBootstrap(documentEl: Document): Problem[] {
  const scripts = [
    ...documentEl.querySelectorAll('script[type="module"]'),
  ].filter((script) => script.textContent?.includes('esm.sh'));

  if (scripts.length === 0) {
    return [
      {
        level: 'error',
        path: 'runtime',
        message:
          'the packaged template has no esm.sh bootstrap to replace — its patterns will not render',
      },
    ];
  }

  scripts.forEach((script, index) => {
    // One script does the hydrating; any further one is a duplicate mount.
    script.textContent = index === 0 ? bootstrap : '';
  });

  return [];
}

/**
 * Build the preview document.
 *
 * Takes the packaged HTML as text rather than fetching it, so the caller owns
 * the request (and its errors) and this stays a pure transform over a DOM the
 * browser already knows how to build.
 */
export function buildPreviewDocument(options: {
  html: string;
  spec: TemplateSpec;
  direction: BrandDirection;
  slug: string;
}): PreviewDocument {
  const { html, spec, direction, slug } = options;
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const head = parsed.head;

  // First child, so it precedes every relative href and src in the document —
  // a <base> only governs what follows it.
  const base = parsed.createElement('base');
  base.setAttribute('href', packagedTemplateUrl(slug));
  head.insertBefore(base, head.firstChild);

  const problems = [
    ...rewriteBootstrap(parsed),
    ...applyEdits(parsed, spec, directionToEdits(spec, direction)).problems,
  ];

  return {
    html: `<!DOCTYPE html>${parsed.documentElement.outerHTML}`,
    problems,
  };
}
