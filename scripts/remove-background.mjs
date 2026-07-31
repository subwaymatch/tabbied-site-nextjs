#!/usr/bin/env node
/**
 * Remove the background from generated images with Recraft's `remove-background`,
 * served through Kie AI. Writes `<id>-cutout.png` beside each `<id>.png`.
 *
 * SELECTION IS DRIVEN BY THE DATA, not by the directory: only prompts whose resolved
 * `cutout` is true are processed. Scenes (a hero photo, an interior) are meant to stay
 * full-bleed and are skipped. --ignore-flags falls back to scanning the directory.
 *
 * Three Kie API details this script exists to encapsulate:
 *   1. The model input takes a PUBLIC URL only — no base64, no data URI. Each image is
 *      pushed through Kie's own upload endpoint first (free, auto-deleted after 24h)
 *      and the returned `downloadUrl` is handed to the model.
 *   2. Both Kie hosts sit behind Cloudflare and answer a request with no browser
 *      `User-Agent` with a bare 403 and `error code: 1010`. It reads exactly like an
 *      auth failure and is not.
 *   3. Kie caps an account at 20 new generation requests per 10 seconds and rejects the
 *      excess with 429 WITHOUT queueing it. A shared sliding-window limiter admits
 *      createTask at 18 per 10s so --concurrency can be raised freely, and a 429 waits
 *      out a full window rather than the usual short backoff.
 *
 * Usage:
 *   KIE_API_KEY=... node scripts/remove-background.mjs [options]
 *
 * Options:
 *   --project <id>     Only this project
 *   --only <id[,id..]> Only these prompt ids
 *   --from <dir>       Source directory (default: ./generated-images)
 *   --concurrency <n>  Parallel jobs (default: 4)
 *   --ignore-flags     Process every original in the directory, whatever the JSON says
 *   --force            Redo images whose cut-out already exists
 *   -h, --help         Show this help
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CUTOUT_SUFFIX, loadPromptData, selectPrompts } from "./lib/prompts.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DATA_FILE = join(ROOT, "data", "image-prompts.json");

const KIE_UPLOAD = "https://kieai.redpandaai.co/api/file-base64-upload";
const KIE_CREATE = "https://api.kie.ai/api/v1/jobs/createTask";
const KIE_STATUS = "https://api.kie.ai/api/v1/jobs/recordInfo";
const MODEL = "recraft/remove-background";
// Cloudflare in front of both Kie hosts rejects a UA-less request with
// 403 "error code: 1010"; any ordinary browser UA satisfies it.
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

function parseArgs(argv) {
  const opts = {
    project: null, only: null, from: join(process.cwd(), "generated-images"),
    concurrency: 4, ignoreFlags: false, force: false, help: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case "--project": opts.project = next(); break;
      case "--only": opts.only = next().split(",").map((x) => x.trim()).filter(Boolean); break;
      case "--from": opts.from = next(); break;
      case "--concurrency": opts.concurrency = Math.max(1, Number(next()) || 4); break;
      case "--ignore-flags": opts.ignoreFlags = true; break;
      case "--force": opts.force = true; break;
      case "-h": case "--help": opts.help = true; break;
      default: console.error(`Unknown argument: ${a}`); process.exit(1);
    }
  }
  return opts;
}

function printHelp() {
  const src = readFileSync(fileURLToPath(import.meta.url), "utf8");
  console.log(src.slice(src.indexOf("/**"), src.indexOf("*/") + 2).replace(/^\/\*\*?|\*\/$|^ \* ?/gm, "").trim());
}

function requireKey() {
  const key = process.env.KIE_API_KEY;
  if (!key) { console.error("KIE_API_KEY is not set."); process.exit(1); }
  return key;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Kie enforces, per account, 20 new generation requests per 10 seconds. Excess requests
// are rejected with 429 and are NOT queued, so the limit has to be respected
// client-side rather than discovered.
const RATE_WINDOW_MS = 10_000;
const RATE_MAX = 18; // a little under 20, so a burst can't race past the limit

/** Sliding-window limiter, shared across workers so raising --concurrency cannot
 *  exceed the account limit. */
function createLimiter(max, windowMs) {
  const stamps = [];
  let chain = Promise.resolve();
  return () => {
    // Serialise admission so two workers can't both read a stale window.
    chain = chain.then(async () => {
      for (;;) {
        const now = Date.now();
        while (stamps.length && now - stamps[0] >= windowMs) stamps.shift();
        if (stamps.length < max) { stamps.push(now); return; }
        await sleep(windowMs - (now - stamps[0]) + 50);
      }
    });
    return chain;
  };
}
const admitGeneration = createLimiter(RATE_MAX, RATE_WINDOW_MS);

const RETRY_STATUS = new Set([408, 429, 500, 502, 503, 504]);
const MAX_ATTEMPTS = 6;

/**
 * Fetch binary content with the same transient-failure policy as `kie`.
 * The finished image is served from Kie's CDN rather than its API, and a bare fetch
 * there is exactly where a run gets lost: the generation has already succeeded and been
 * billed. Eight of forty-four images failed this way before it was wrapped.
 */
async function fetchBinary(url, label) {
  let lastDetail = "";
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    let res, networkErr;
    try { res = await fetch(url, { headers: { "User-Agent": UA } }); }
    catch (err) { networkErr = err; }
    if (res?.ok) return Buffer.from(await res.arrayBuffer());

    lastDetail = networkErr ? networkErr.message : String(res.status);
    const transient = networkErr !== undefined || RETRY_STATUS.has(res?.status);
    if (!transient || attempt === MAX_ATTEMPTS - 1) break;
    await sleep(Math.min(16_000, 500 * 2 ** attempt));
  }
  throw new Error(`${label} failed: ${lastDetail}`);
}

async function kie(url, { key, json, method = "GET" } = {}) {
  let lastDetail = "";
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    let res, networkErr;
    try {
      res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${key}`,
          "User-Agent": UA,
          ...(json ? { "Content-Type": "application/json" } : {}),
        },
        body: json ? JSON.stringify(json) : undefined,
      });
    } catch (err) { networkErr = err; }
    if (res?.ok) return res.json();

    const detail = networkErr ? networkErr.message : await res.text().catch(() => "");
    lastDetail = networkErr ? detail : `${res.status} ${detail.slice(0, 300)}`;
    const transient = networkErr !== undefined || RETRY_STATUS.has(res?.status);
    if (!transient || attempt === MAX_ATTEMPTS - 1) break;

    // A 429 means the window is already full; wait out a whole window rather than the
    // usual short backoff, since the request was rejected, not queued.
    const waitMs = res?.status === 429 ? RATE_WINDOW_MS : Math.min(16_000, 500 * 2 ** attempt);
    await sleep(waitMs);
  }
  throw new Error(`Kie ${method} ${new URL(url).pathname} → ${lastDetail}`);
}

/** Upload → createTask → poll → return the finished PNG bytes. */
export async function removeBackground(buf, fileName, key) {
  const up = await kie(KIE_UPLOAD, {
    key, method: "POST",
    json: {
      base64Data: `data:image/png;base64,${buf.toString("base64")}`,
      uploadPath: "images/generated",
      fileName,
    },
  });
  const imageUrl = up?.data?.downloadUrl;
  if (!imageUrl) throw new Error(`upload returned no downloadUrl: ${JSON.stringify(up).slice(0, 200)}`);

  await admitGeneration();
  const created = await kie(KIE_CREATE, {
    key, method: "POST", json: { model: MODEL, input: { image: imageUrl } },
  });
  const taskId = created?.data?.taskId;
  if (!taskId) throw new Error(`createTask returned no taskId: ${JSON.stringify(created).slice(0, 200)}`);

  for (let i = 0; i < 100; i++) {
    await sleep(3000);
    const info = await kie(`${KIE_STATUS}?taskId=${encodeURIComponent(taskId)}`, { key });
    const d = info?.data ?? {};
    if (d.state === "success") {
      // resultJson is a JSON *string*, not an object.
      return fetchBinary(JSON.parse(d.resultJson).resultUrls[0], "result download");
    }
    if (d.state === "fail") throw new Error(`${d.failMsg || "failed"} (code ${d.failCode ?? "?"})`);
  }
  throw new Error("timed out waiting for the task");
}

/** Ids to process: the cutout:true prompts, or everything on disk with --ignore-flags. */
function selectIds(opts, dir) {
  const onDisk = new Set(
    readdirSync(dir)
      .filter((f) => /\.png$/i.test(f))
      .map((f) => basename(f, extname(f)))
      .filter((s) => !s.endsWith(CUTOUT_SUFFIX)),
  );
  if (opts.ignoreFlags) {
    let ids = [...onDisk];
    if (opts.only) ids = ids.filter((id) => opts.only.includes(id));
    return ids.sort();
  }
  const data = loadPromptData(DATA_FILE);
  const wanted = selectPrompts(data, { only: opts.only, project: opts.project, cutout: true });
  const missing = wanted.filter((r) => !onDisk.has(r.id));
  for (const r of missing) console.error(`  ! ${r.id}: cutout:true but no original in ${dir} — generate it first`);
  return wanted.filter((r) => onDisk.has(r.id)).map((r) => r.id).sort();
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) return printHelp();
  const key = requireKey();

  const dir = opts.from;
  if (!existsSync(dir)) { console.error(`Source directory not found: ${dir}`); process.exit(1); }

  const ids = selectIds(opts, dir);
  if (!ids.length) return console.log("No images need background removal.");

  const todo = ids.filter((id) => {
    if (!opts.force && existsSync(join(dir, `${id}${CUTOUT_SUFFIX}.png`))) {
      console.log(`  • skip ${id} (cut-out exists; use --force)`); return false;
    }
    return true;
  });
  if (!todo.length) return console.log("Nothing to do.");

  console.log(`Removing background from ${todo.length} image(s) in ${dir}\n`);
  let i = 0, ok = 0, failed = 0;
  async function worker() {
    while (i < todo.length) {
      const id = todo[i++];
      try {
        const cut = await removeBackground(readFileSync(join(dir, `${id}.png`)), `${id}.png`, key);
        writeFileSync(join(dir, `${id}${CUTOUT_SUFFIX}.png`), cut);
        ok++; console.log(`  ✓ ${id}${CUTOUT_SUFFIX}.png (${(cut.length / 1e6).toFixed(2)}MB)`);
      } catch (err) { failed++; console.error(`  ✗ ${id}: ${err.message}`); }
    }
  }
  await Promise.all(Array.from({ length: Math.min(opts.concurrency, todo.length) }, worker));
  console.log(`\nDone: ${ok} removed, ${failed} failed.`);
  console.log("Review each cut-out over a real pattern, at full size, before promoting.");
  if (failed) process.exitCode = 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((err) => { console.error(err.message || err); process.exit(1); });
}
