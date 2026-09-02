import type { TemplateSpec } from 'tabbied-templates';
import type { Env } from '../env';

// The template artefacts, read through the assets binding.
//
// Same doctrine as the catalog and the studio index: the Worker describes and
// authors against exactly the bytes this deployment serves, so a template
// re-packaged in this commit cannot be missing from — or disagree with — what
// the model is handed. None of it is memoised per isolate: there are 57 slugs
// each read rarely, and a stale spec cached across a deploy would be precisely
// the drift the pinning in `site` exists to detect.

type CatalogEntry = { slug: string; copyRoles?: string[] };
type EditableCatalog = { templates: CatalogEntry[] };

async function readAsset(env: Env, request: Request, path: string): Promise<Response> {
  const response = await env.ASSETS.fetch(new URL(path, request.url).toString());

  if (!response.ok) {
    throw new Error(`${path} returned ${response.status}`);
  }

  return response;
}

/** `/editable-catalog.json` — which templates can take which brand copy. */
export async function loadEditableCatalog(env: Env, request: Request): Promise<EditableCatalog> {
  return (await readAsset(env, request, '/editable-catalog.json')).json() as Promise<EditableCatalog>;
}

/** `/editable/<slug>.json` — the spec the site is authored against. */
export async function loadTemplateSpec(env: Env, request: Request, slug: string): Promise<TemplateSpec> {
  return (await readAsset(env, request, `/editable/${slug}.json`)).json() as Promise<TemplateSpec>;
}

/** `/downloads/<slug>/index.html` — the packaged page, the artefact previewed and shipped. */
export async function loadPackagedHtml(env: Env, request: Request, slug: string): Promise<string> {
  return (await readAsset(env, request, `/downloads/${slug}/index.html`)).text();
}

/** SHA-256 as hex — what `site.templateHash` pins. */
export async function hashText(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));

  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
