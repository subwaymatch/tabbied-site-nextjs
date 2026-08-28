import type { Env } from '../env';

// The OpenAI-compatible upstream, reached as a wire format rather than a
// vendor: chat completions and images are both `${AI_BASE_URL}/…` with a bearer
// key, so OpenAI, an aggregator, a self-hosted server, or Cloudflare AI Gateway
// in front of any of them are one environment variable apart.
//
// There is deliberately no general `chat()` export beyond this file: every
// caller is a task endpoint that assembles its own prompt server-side. A
// pass-through would hand prompt construction to the client and turn the site
// into a free faucet.

export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status?: number
  ) {
    super(message);
    this.name = 'UpstreamError';
  }
}

export const hasUpstream = (env: Env) => Boolean(env.AI_API_KEY);

/** Transient upstream conditions; anything else is a real answer, including 4xx. */
const RETRY_STATUS = new Set([408, 429, 500, 502, 503, 504]);

async function call(
  env: Env,
  path: string,
  body: unknown,
  { retries = 2, timeoutMs = 60_000 }: { retries?: number; timeoutMs?: number } = {}
): Promise<Response> {
  const url = `${env.AI_BASE_URL.replace(/\/$/, '')}${path}`;

  for (let attempt = 0; ; attempt++) {
    // A hung upstream would otherwise hold the request open until the platform
    // kills it, which loses the chance to record the attempt.
    const abort = AbortSignal.timeout(timeoutMs);

    let response: Response | undefined;
    let networkError: unknown;

    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${env.AI_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: abort,
      });
    } catch (error) {
      networkError = error;
    }

    if (response?.ok) {
      return response;
    }

    const transient =
      networkError !== undefined || (response && RETRY_STATUS.has(response.status));

    if (!transient || attempt >= retries) {
      const detail = response ? await response.text().catch(() => '') : String(networkError);
      throw new UpstreamError(
        `${path} failed: ${response?.status ?? 'network'} ${detail.slice(0, 300)}`,
        response?.status
      );
    }

    await new Promise((resolve) =>
      setTimeout(resolve, Math.min(8_000, 500 * 2 ** attempt))
    );
  }
}

export type ChatUsage = { promptTokens: number; completionTokens: number };

export type ChatResult = { content: string; usage: ChatUsage; model: string };

export async function chatJson(
  env: Env,
  options: {
    system: string;
    user: string;
    schemaName: string;
    schema: unknown;
    maxTokens?: number;
  }
): Promise<ChatResult> {
  const response = await call(env, '/chat/completions', {
    model: env.AI_MODEL,
    messages: [
      { role: 'system', content: options.system },
      { role: 'user', content: options.user },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: options.schemaName, strict: true, schema: options.schema },
    },
    max_completion_tokens: options.maxTokens ?? 2_000,
  });

  const payload = (await response.json()) as {
    model?: string;
    choices?: { message?: { content?: string } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  const content = payload.choices?.[0]?.message?.content;

  if (typeof content !== 'string' || content.length === 0) {
    throw new UpstreamError('upstream returned no message content');
  }

  return {
    content,
    model: payload.model ?? env.AI_MODEL,
    // An upstream that omits `usage` is not licence to record zero: the caller
    // substitutes a conservative estimate, so the ledger over-counts rather
    // than silently letting a budget run free.
    usage: {
      promptTokens: payload.usage?.prompt_tokens ?? 0,
      completionTokens: payload.usage?.completion_tokens ?? 0,
    },
  };
}

export type ImageResult = { bytes: ArrayBuffer; contentType: string; model: string };

/**
 * One image, as WebP. Transparency is a *parameter* — never a request in the
 * prose, which paints a fake checkerboard into the pixels — and gpt-image-2
 * honours it natively, which is why this reaches one vendor and not two (see
 * docs/image-pipeline.md).
 */
export async function generateImage(
  env: Env,
  options: { prompt: string; size?: string; transparent?: boolean }
): Promise<ImageResult> {
  const response = await call(
    env,
    '/images/generations',
    {
      model: env.AI_IMAGE_MODEL,
      prompt: options.prompt,
      size: options.size ?? '1536x1024',
      quality: 'low',
      n: 1,
      output_format: 'webp',
      ...(options.transparent ? { background: 'transparent' } : {}),
    },
    // Image generation is slower than a completion by a wide margin.
    { timeoutMs: 120_000, retries: 1 }
  );

  const payload = (await response.json()) as {
    model?: string;
    data?: { b64_json?: string }[];
  };

  const b64 = payload.data?.[0]?.b64_json;

  if (!b64) {
    throw new UpstreamError('image response contained no b64_json');
  }

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return {
    bytes: bytes.buffer,
    contentType: 'image/webp',
    model: payload.model ?? env.AI_IMAGE_MODEL,
  };
}
