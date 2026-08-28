#!/usr/bin/env node
// A local OpenAI-shaped server, for driving the Studio endpoints without a
// paid API. Point AI_BASE_URL at http://localhost:8788/v1 in .dev.vars.
//
// It honours `response_format.json_schema` the way a compliant upstream does —
// the slug enum is read back out of the schema, so the answer is always one the
// validator can accept. Pass --bad to make it return a shape that fails
// validation instead, which is how the repair-retry and matcher-fallback paths
// get exercised.
import { createServer } from 'node:http';

const bad = process.argv.includes('--bad');
const PORT = Number(process.env.PORT ?? 8788);

const read = (req) =>
  new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
  });

// A 1x1 transparent WebP, so the image path returns something real.
const PIXEL_WEBP =
  'UklGRlYAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==';

createServer(async (req, res) => {
  const body = await read(req);
  const json = (payload) => {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(payload));
  };

  if (req.url.endsWith('/chat/completions')) {
    const slugs =
      body?.response_format?.json_schema?.schema?.properties?.directions?.items
        ?.properties?.slug?.enum ?? [];

    const content = bad
      ? JSON.stringify({ recommended: 0, directions: [] })
      : JSON.stringify({
          recommended: 1,
          directions: slugs.slice(0, 3).map((slug, i) => ({
            slug,
            stance: ['Quiet Ground', 'Open Field', 'Warm Signal'][i],
            why: `A ${['calm', 'direct', 'warm'][i]} direction built on ${slug}.`,
            // Deliberately legible: the palette validator is exercised
            // separately in the unit tests, not by every smoke run.
            palette: ['#faf7f0', '#1c1c1c', '#b0521f'],
            copy: {
              brandName: `Studio ${i + 1}`,
              headline: 'A headline written for this business.',
              tagline: 'A tagline that fits inside the budget.',
            },
          })),
        });

    return json({
      model: 'stub-chat',
      choices: [{ message: { content } }],
      usage: { prompt_tokens: 1234, completion_tokens: 321 },
    });
  }

  if (req.url.endsWith('/images/generations')) {
    return json({ model: 'stub-image', data: [{ b64_json: PIXEL_WEBP }] });
  }

  res.writeHead(404, { 'content-type': 'application/json' });
  res.end(JSON.stringify({ error: 'stub: no such endpoint' }));
}).listen(PORT, () => {
  console.log(`stub upstream on http://localhost:${PORT}/v1 ${bad ? '(bad mode)' : ''}`);
});
