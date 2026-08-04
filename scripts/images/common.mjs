// Shared helpers for the template image pipeline (extract -> build -> submit ->
// import), which generates through KIE AI's job API (https://docs.kie.ai).
//
// Dependency-free apart from sharp, which the import step uses and which already
// ships as a devDependency for scripts/optimize-images.mjs.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

// Working files: the prompt manifest, the pending-task list and the run state.
// Git-ignored; nothing here is a build input.
export const WORK_DIR = path.join(ROOT, 'scripts/images/.batch');
export const MANIFEST = path.join(WORK_DIR, 'prompts.json');
export const TASKS = path.join(WORK_DIR, 'tasks.json');
export const STATE = path.join(WORK_DIR, 'state.json');

// Where finished images land. With `output: 'export'` these are served as-is,
// so the import step pre-sizes them instead of shipping the originals.
export const IMAGE_DIR = path.join(ROOT, 'public/images/template');
export const imagePath = (id) => path.join(IMAGE_DIR, `${id}.webp`);
export const imageSrc = (id) => `/images/template/${id}.webp`;

export const API = process.env.KIE_API_BASE ?? 'https://api.kie.ai/api/v1';
export const MODEL = process.env.KIE_MODEL ?? 'z-image';

// z-image caps the prompt; every composed template prompt currently sits around
// 230-330 characters, so this is a guard rather than something that trips.
export const PROMPT_MAX = 1000;

// KIE takes an aspect ratio rather than a pixel size, and z-image offers only
// 1:1, 4:3, 3:4, 16:9 and 9:16. The layouts' 4/3 and 1/1 slots map exactly; the
// tall gallery cell is 4/5 (0.80) and takes the nearest supported portrait,
// 3:4 (0.75). The extra height is cropped by `object-fit: cover`, never
// stretched, which is the same rule the patterns follow.
export const ASPECT_RATIO = {
  '4/3': '4:3',
  '1/1': '1:1',
  '4/5': '3:4',
};

// Slot = which layout hole the image fills. maxWidth is roughly 2x the widest
// rendered slot, matching the convention in scripts/optimize-images.mjs.
// z-image exposes no resolution control, so whatever it returns is downscaled
// to fit (never enlarged) at import.
export const SLOTS = {
  // The split hero's art panel: about half a wide viewport by 82vh, so square
  // is the closest supported ratio and object-fit crops the difference.
  hero: { aspect: () => '1/1', maxWidth: 1600 },
  card: { aspect: () => '4/3', maxWidth: 800 },
  // The about section's art panel, portrait to match .aboutArt's 4/5.
  about: { aspect: () => '4/5', maxWidth: 900 },
  // Team portraits, square to match .teamArt.
  team: { aspect: () => '1/1', maxWidth: 500 },
  alt: { aspect: () => '4/3', maxWidth: 1200 },
  // .galleryCell:nth-child(4n + 1) is the tall one; the rest are square.
  gallery: { aspect: (i) => (i % 4 === 0 ? '4/5' : '1/1'), maxWidth: 700 },
};

// Terminal + in-flight task states, per KIE's job API.
export const DONE = 'success';
export const FAILED = 'fail';
export const TERMINAL = new Set([DONE, FAILED]);

// ---- .env loading ---------------------------------------------------------
// These scripts run as plain `node scripts/images/*.mjs`, outside Next.js, so
// they read the env files themselves. Precedence matches the Next.js
// convention: real environment variables win over .env.local, which wins over
// .env. Values may be quoted; `export ` prefixes and # comments are tolerated.
const parseEnv = (text) => {
  const out = {};

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) continue;

    const match = /^(?:export\s+)?([\w.-]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;

    const raw = match[2].trim();
    let value;

    // A quoted value ends at its closing quote; anything after it (typically a
    // trailing comment) is dropped. An unquoted value runs to the first ` #`.
    const quoted = /^(['"])([\s\S]*?)\1/.exec(raw);

    if (quoted) {
      value = quoted[2];
    } else {
      value = raw.replace(/\s+#.*$/, '').trim();
    }

    out[match[1]] = value;
  }

  return out;
};

export function loadEnvFiles() {
  const loaded = [];
  const merged = {};

  // Later files override earlier ones; the real environment overrides both.
  for (const name of ['.env', '.env.local']) {
    const file = path.join(ROOT, name);

    if (!fs.existsSync(file)) continue;

    Object.assign(merged, parseEnv(fs.readFileSync(file, 'utf8')));
    loaded.push(name);
  }

  for (const [key, value] of Object.entries(merged)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return loaded;
}

export function apiKey() {
  const loaded = loadEnvFiles();
  const key = process.env.KIE_API_KEY;

  if (!key) {
    console.error('KIE_API_KEY is not set.');
    console.error('Add it to .env.local at the repo root:');
    console.error('');
    console.error('  KIE_API_KEY=your-key-here');
    console.error('');
    console.error('(or export it in your shell). Get a key at https://kie.ai/api-key');
    if (loaded.length) console.error(`Read ${loaded.join(' and ')}, but neither set KIE_API_KEY.`);
    process.exit(1);
  }

  return key;
}

// ---- rate limiting --------------------------------------------------------
// KIE accepts 20 new requests per 10 seconds per account, and anything over
// that comes back 429 *without being queued*, so an un-paced run would silently
// drop images. Every call in this pipeline goes through one shared pacer,
// polling included: with a few hundred open jobs, the recordInfo passes are
// what actually eat the budget, not the createTask burst at the start.
//
// The default leaves a little headroom under the documented ceiling. Raise it
// with KIE_RATE_LIMIT if support has lifted your account's limit.
const RATE_WINDOW_MS = 10_000;
const RATE_MAX = Math.max(1, Number(process.env.KIE_RATE_LIMIT ?? 18));
const RATE_RETRIES = 5;

// Minimum gap between two requests leaving this process.
const RATE_GAP_MS = RATE_WINDOW_MS / RATE_MAX;

let nextSlot = 0;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Even pacing rather than a sliding window. A window that simply allows N per
// 10s lets all N leave at once, and then N more the instant the window rolls;
// the server's 10s window does not share our boundary, so it can observe up to
// 2N together and reject the overflow. Spacing every request by
// window/limit (555ms at 18 per 10s) means any 10s window anyone measures holds
// at most ceil(10000 / 555) = 19 requests, comfortably under the ceiling of 20.
//
// Reserving the slot is synchronous, so concurrent callers each get a distinct
// one and queue up in arrival order.
async function throttle() {
  const now = Date.now();
  const at = Math.max(now, nextSlot);

  nextSlot = at + RATE_GAP_MS;

  if (at > now) await sleep(at - now);
}

export const rateLimit = { perWindow: RATE_MAX, windowMs: RATE_WINDOW_MS, gapMs: RATE_GAP_MS };

// ---- http -----------------------------------------------------------------
// KIE answers 200 with a body-level `code`, so a failure has to be read out of
// the payload rather than the HTTP status. A 429 is retried with backoff rather
// than surfaced, since a rejected request never entered the queue.
export async function api(pathname, { method = 'GET', body, key } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= RATE_RETRIES; attempt += 1) {
    await throttle();

    let res;

    try {
      res = await fetch(`${API}${pathname}`, {
        method,
        headers: {
          Authorization: `Bearer ${key}`,
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (error) {
      // Network hiccup: back off and try again.
      lastError = error;
      await sleep(Math.min(2 ** attempt * 500, 8000));
      continue;
    }

    const text = await res.text();
    let json;

    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    const code = json?.code ?? res.status;

    if (code === 429) {
      // Give the window time to drain, honouring Retry-After when present.
      const retryAfter = Number(res.headers.get('retry-after'));
      const backoff = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : RATE_WINDOW_MS;
      // Delay the whole schedule, not just this caller, so the queued requests
      // behind it do not walk straight into the same wall.
      nextSlot = Math.max(nextSlot, Date.now() + backoff);
      await sleep(backoff);
      lastError = new Error(`${method} ${pathname} rate limited (429)`);
      continue;
    }

    if (!json) {
      throw new Error(`${method} ${pathname} returned non-JSON (${res.status}): ${text.slice(0, 300)}`);
    }

    if (!res.ok || (json.code !== undefined && json.code !== 200)) {
      throw new Error(`${method} ${pathname} failed (code ${code}): ${json.msg ?? text.slice(0, 300)}`);
    }

    return json;
  }

  throw lastError ?? new Error(`${method} ${pathname} failed after ${RATE_RETRIES} retries`);
}

// resultJson arrives as a JSON *string* on the task record.
export function resultUrls(record) {
  if (!record?.resultJson) return [];

  try {
    const parsed = JSON.parse(record.resultJson);
    return parsed.resultUrls ?? [];
  } catch {
    return [];
  }
}

export const readJson = (file, fallback = null) =>
  fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

// ---- generated-image index ------------------------------------------------
// The React tree cannot stat the filesystem at render time, so the set of
// finished images is mirrored into a tiny generated module. The static
// generator runs in Node and reads the directory directly.
export const IMAGE_INDEX = path.join(ROOT, 'components/template/generatedImages.ts');

export function availableImages() {
  if (!fs.existsSync(IMAGE_DIR)) return [];

  return fs
    .readdirSync(IMAGE_DIR)
    .filter((f) => f.endsWith('.webp'))
    .map((f) => f.replace(/\.webp$/, ''))
    .sort();
}

export function writeImageIndex() {
  const ids = availableImages();
  const body = ids.length ? `\n${ids.map((id) => `  '${id}',`).join('\n')}\n` : '';

  fs.writeFileSync(
    IMAGE_INDEX,
    `// Generated by scripts/images/import-batch.mjs (or \`npm run images:index\`).
// Do not edit by hand.
//
// Ids of the files sitting in public/images/template. A template slot whose id
// appears here renders the generated image; every other slot keeps showing its
// image prompt card, so the pages stay complete while a run is only
// partly filled in.
export const GENERATED_IMAGES: readonly string[] = [${body}];
`
  );

  return ids;
}

// Tiny flag parser: --key=value, --key value and bare --flag.
export function argv(args = process.argv.slice(2)) {
  const out = {};

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (!arg.startsWith('--')) continue;

    const [key, inline] = arg.slice(2).split('=');

    if (inline !== undefined) out[key] = inline;
    else if (args[i + 1] && !args[i + 1].startsWith('--')) out[key] = args[(i += 1)];
    else out[key] = true;
  }

  return out;
}

// Run `worker` over `items` with a bounded number in flight.
export async function pooled(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  });

  await Promise.all(runners);

  return results;
}
