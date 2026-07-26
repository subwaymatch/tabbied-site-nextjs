// Step 3 of 4. Create one KIE job per task, then poll them to completion.
//
//   node scripts/images/submit-batch.mjs --watch          # submit, then poll
//   node scripts/images/submit-batch.mjs --check          # poll what is on file
//   node scripts/images/submit-batch.mjs --concurrency 8
//
// The API key comes from .env.local / .env at the repo root, or from the
// environment (see scripts/images/README.md). Every generation is asynchronous:
// createTask returning 200 only means the job was accepted, so each taskId is
// recorded in .batch/state.json and polled until it reaches success or fail.
// Because the ids are on disk, closing the shell mid-run loses nothing.
//
// --concurrency only sets how many sockets are open at once; the account-wide
// request budget is enforced by the shared limiter in common.mjs, which covers
// polling as well as submission.
import path from 'node:path';
import {
  MODEL, ROOT, STATE, TASKS, TERMINAL, api, apiKey, argv, pooled, rateLimit, readJson, resultUrls, writeJson,
} from './common.mjs';

const args = argv();
const key = apiKey();
const pollMs = Math.max(2, Number(args.interval) || 5) * 1000;
const concurrency = Math.max(1, Number(args.concurrency) || 4);

const loadState = () => readJson(STATE, { model: MODEL, tasks: {} });
const save = (state) => writeJson(STATE, state);

const summarize = (state) => {
  const rows = Object.values(state.tasks);
  const by = rows.reduce((acc, t) => ({ ...acc, [t.state]: (acc[t.state] ?? 0) + 1 }), {});
  return Object.entries(by).map(([k, v]) => `${k} ${v}`).join(', ') || 'none';
};

// One poll pass over everything not yet finished.
async function refresh(state) {
  const open = Object.entries(state.tasks).filter(([, t]) => !TERMINAL.has(t.state));

  await pooled(open, concurrency, async ([id, task]) => {
    try {
      const { data } = await api(`/jobs/recordInfo?taskId=${encodeURIComponent(task.taskId)}`, { key });
      const urls = resultUrls(data);

      state.tasks[id] = {
        ...task,
        state: data.state,
        url: urls[0] ?? task.url ?? null,
        failMsg: data.failMsg || '',
        failCode: data.failCode || '',
        creditsConsumed: data.creditsConsumed ?? task.creditsConsumed,
      };
    } catch (error) {
      // A transient poll failure should not kill the run; try again next tick.
      state.tasks[id] = { ...task, lastPollError: String(error).slice(0, 160) };
    }
  });

  save(state);
  return state;
}

if (args.check) {
  const state = loadState();

  if (!Object.keys(state.tasks).length) {
    console.error('No tasks on file. Run without --check to submit.');
    process.exit(1);
  }

  await refresh(state);
  console.log(summarize(state));

  const done = Object.values(state.tasks).filter((t) => TERMINAL.has(t.state)).length;
  if (done === Object.keys(state.tasks).length) console.log('Next: node scripts/images/import-batch.mjs');
  process.exit(0);
}

const plan = readJson(TASKS);

if (!plan) {
  console.error('No task list. Run: node scripts/images/build-batch.mjs');
  process.exit(1);
}

const state = loadState();
state.model = plan.model;
state.submittedAt = state.submittedAt ?? new Date().toISOString();

// Anything already carrying a taskId is left alone, so re-running after an
// interruption only submits the gaps.
const fresh = plan.tasks.filter((t) => !state.tasks[t.id]?.taskId);

console.log(
  `Submitting ${fresh.length} task(s) to ${plan.model} ` +
    `(${concurrency} sockets, capped at ${rateLimit.perWindow} requests / ${rateLimit.windowMs / 1000}s)...`
);

let created = 0;
let rejected = 0;

await pooled(fresh, concurrency, async (task) => {
  try {
    const { data } = await api('/jobs/createTask', { method: 'POST', key, body: task.body });
    state.tasks[task.id] = {
      taskId: data.taskId,
      state: 'waiting',
      maxWidth: task.maxWidth,
      aliases: task.aliases,
      url: null,
    };
    created += 1;
  } catch (error) {
    state.tasks[task.id] = { taskId: null, state: 'fail', failMsg: String(error).slice(0, 200), maxWidth: task.maxWidth, aliases: task.aliases };
    rejected += 1;
  }

  if ((created + rejected) % 10 === 0) save(state);
});

save(state);
console.log(`  created ${created}${rejected ? `, rejected ${rejected}` : ''} -> ${path.relative(ROOT, STATE)}`);

if (!args.watch) {
  console.log('Poll with: node scripts/images/submit-batch.mjs --check');
  process.exit(0);
}

for (;;) {
  await refresh(state);

  const rows = Object.values(state.tasks);
  const open = rows.filter((t) => !TERMINAL.has(t.state)).length;
  console.log(`  ${new Date().toISOString().slice(11, 19)}  ${summarize(state)}`);

  if (!open) break;

  await new Promise((r) => setTimeout(r, pollMs));
}

const failed = Object.entries(state.tasks).filter(([, t]) => t.state === 'fail');

if (failed.length) {
  console.log(`\n${failed.length} task(s) failed:`);
  for (const [id, t] of failed) console.log(`  ${id}: ${t.failMsg || t.failCode || 'unknown'}`);
}

console.log('Next: node scripts/images/import-batch.mjs');
