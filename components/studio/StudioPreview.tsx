'use client';

// The generated direction, on the actual template.
//
// Everything here happens in the browser and it has to: the edits engine works
// against a DOM, the packaged template is a static asset, and the generation is
// behind a capability id in the query string. Nothing about this page is
// prerenderable, which is why it is a client component behind a Suspense
// boundary rather than a route the export could try to build.
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Problem, TemplateSpec } from 'tabbied-templates';
import { apiFetch, ApiError } from 'lib/apiFetch';
import {
  buildPreviewDocument,
  packagedTemplateUrl,
  templateSpecUrl,
} from 'lib/studioPreview';
import styles from './StudioPreview.module.css';

type StoredDirection = {
  slug: string;
  name: string;
  stance: string;
  palette: string[];
  copy: { brandName: string; headline: string; tagline: string } | null;
};

type Stored = {
  id: string;
  description: string;
  result: { directions: StoredDirection[] };
};

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready';
      direction: StoredDirection;
      html: string;
      problems: Problem[];
    };

export default function StudioPreview() {
  const searchParams = useSearchParams();
  const generationId = searchParams.get('g');
  const index = Number(searchParams.get('i') ?? '0');

  const [state, setState] = useState<State>({ status: 'loading' });

  const load = useCallback(async (): Promise<State> => {
    if (!generationId || !Number.isInteger(index) || index < 0) {
      return { status: 'error', message: 'That preview link is incomplete.' };
    }

    const stored = await apiFetch<Stored>(
      `/api/studio/generations/${generationId}`
    );
    const direction = stored.result.directions[index];

    if (!direction) {
      return { status: 'error', message: 'That direction is no longer in this set.' };
    }

    // The spec and the package are plain static assets, so they are fetched
    // directly rather than through apiFetch — there is no API involved and no
    // session to carry.
    const [specResponse, htmlResponse] = await Promise.all([
      fetch(templateSpecUrl(direction.slug)),
      fetch(`${packagedTemplateUrl(direction.slug)}index.html`),
    ]);

    if (!specResponse.ok || !htmlResponse.ok) {
      return {
        status: 'error',
        message: `The ${direction.name} template is not available to preview.`,
      };
    }

    const spec = (await specResponse.json()) as TemplateSpec;
    const { html, problems } = buildPreviewDocument({
      html: await htmlResponse.text(),
      spec,
      direction: { copy: direction.copy, palette: direction.palette },
      slug: direction.slug,
    });

    return { status: 'ready', direction, html, problems };
  }, [generationId, index]);

  useEffect(() => {
    let live = true;

    setState({ status: 'loading' });

    load()
      .then((next) => {
        if (live) setState(next);
      })
      .catch((cause) => {
        if (!live) return;

        setState({
          status: 'error',
          message:
            cause instanceof ApiError && cause.status === 404
              ? 'That link has expired or never existed.'
              : 'Could not build this preview.',
        });
      });

    return () => {
      live = false;
    };
  }, [load]);

  if (state.status === 'error') {
    return (
      <p className={styles.notice} role="alert">
        {state.message}{' '}
        <Link href="/studio" className={styles.back}>
          Start again
        </Link>
        .
      </p>
    );
  }

  if (state.status === 'loading') {
    return (
      <div className={styles.frame}>
        <div className={styles.skeleton} aria-hidden="true" />
        <p className={styles.loading}>Building the preview…</p>
      </div>
    );
  }

  const { direction, html, problems } = state;
  const errors = problems.filter((problem) => problem.level === 'error');

  return (
    <>
      <div className={styles.bar}>
        <div className={styles.meta}>
          <h1 className={styles.stance}>{direction.stance}</h1>
          <p className={styles.built}>
            {direction.copy?.brandName ?? direction.name} · built on{' '}
            {direction.name}
          </p>
        </div>

        <div className={styles.actions}>
          <Link
            href={`/studio/results/?g=${searchParams.get('g')}`}
            prefetch={false}
            className={styles.action}
          >
            All three
          </Link>
          <a
            href={`/downloads/${direction.slug}-html.zip`}
            className={`${styles.action} ${styles.download}`}
            download
          >
            Download
          </a>
        </div>
      </div>

      {/* Reported rather than swallowed: a slot the engine could not find is a
          template whose annotations have drifted, and the whole point of the
          generator's build gate is that this never becomes invisible. */}
      {errors.length > 0 ? (
        <p className={styles.notice} role="status">
          {errors.length === 1
            ? 'One part of this direction could not be applied: '
            : `${errors.length} parts of this direction could not be applied: `}
          {errors.map((problem) => problem.path).join(', ')}.
        </p>
      ) : null}

      <div className={styles.frame}>
        <iframe
          className={styles.iframe}
          title={`${direction.stance} — a preview built on the ${direction.name} template`}
          srcDoc={html}
          // `allow-same-origin` is required, not lazy: without it the document
          // gets an opaque origin and the same-origin runtime import is blocked
          // as cross-origin, so the page renders with every pattern missing.
          // What stays denied is what this page actually has: the packaged
          // template's `<form action="#">` and its `<a href="#">` links cannot
          // navigate the top frame, submit, or open a popup. The content is
          // first-party throughout — our template, our runtime — and the only
          // model-authored strings reach it as text nodes (`writeText` builds
          // them with createTextNode precisely so there is no markup path).
          sandbox="allow-scripts allow-same-origin"
          loading="lazy"
        />
      </div>
    </>
  );
}
