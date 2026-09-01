'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, ApiError } from 'lib/apiFetch';
import { useSessionUser } from 'lib/authClient';
import styles from './StudioForm.module.css';

// Two ways out of this form, and the difference is honest on its face.
//
// "Match from the library" is the shipped behaviour: instant, free, offline,
// a pure function of the text, and available to everybody. "Generate with AI"
// costs money and therefore needs an account — so it is the button that asks
// you to sign in, and declining costs you nothing but the AI copy.
const MAX_LENGTH = 600;

/** Short enough to be a slip rather than a description. */
const MIN_LENGTH = 10;

const PLACEHOLDER =
  "Tell us about your business, customers, location, preferred style, and colors. For example: We're a residential real estate team in Austin helping young families. We want a warm, modern look with earthy greens and a friendly, trustworthy feel.";

export default function StudioForm({ templateCount }: { templateCount: number }) {
  const [text, setText] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isPending: sessionPending } = useSessionUser();

  const trimmed = text.trim().slice(0, MAX_LENGTH);
  const ready = trimmed.length >= MIN_LENGTH;

  // The matcher path needs no server at all: the description travels in the
  // query string and the results page scores it in the browser.
  const match = () => router.push(`/studio/results/?q=${encodeURIComponent(trimmed)}`);

  async function generate() {
    if (!user) {
      router.push(`/sign-in?next=${encodeURIComponent('/studio')}`);
      return;
    }

    setPending(true);
    setError(null);

    try {
      const { id } = await apiFetch<{ id: string }>('/api/studio/directions', {
        method: 'POST',
        body: JSON.stringify({ description: trimmed }),
      });

      router.push(`/studio/results/?g=${id}`);
    } catch (cause) {
      // The API writes its errors to be read — a quota notice, a rate-limit
      // notice — so they are shown as-is rather than flattened to "failed".
      setError(
        cause instanceof ApiError ? cause.message : 'Something went wrong. Try again.'
      );
      setPending(false);
    }
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        if (ready) {
          void generate();
        }
      }}
    >
      <h1 className={styles.title}>Describe your business, get three websites</h1>
      <p className={styles.lede}>
        Each one is a complete, ready-to-use site in its own brand direction
        &mdash; built with tabbied&rsquo;s generative patterns in place of stock
        photography.
      </p>

      <label className={styles.label} htmlFor="studio-description">
        Your business
      </label>
      <textarea
        id="studio-description"
        className={styles.textarea}
        placeholder={PLACEHOLDER}
        maxLength={MAX_LENGTH}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.actions}>
        {/* Disabled until the session resolves, not merely while generating:
            `useSession` reports no user while it is still checking, and acting
            on that sends a signed-in person to the sign-in page for clicking
            too soon after load. */}
        <button
          type="submit"
          className={styles.submit}
          disabled={!ready || pending || sessionPending}
        >
          {pending ? 'Generating…' : 'Generate with AI'}
        </button>

        <button
          type="button"
          className={styles.secondary}
          disabled={!ready || pending}
          onClick={match}
        >
          Match from the library
        </button>
      </div>

      <p className={styles.note}>
        {/* Says plainly what each button does and what it costs you. Studio
            matches a library rather than drawing something new, and the page
            should not imply otherwise. */}
        Both search the {templateCount} template sites in the library.{' '}
        <strong>Match</strong> is instant and needs no account.{' '}
        <strong>Generate</strong> asks a model to pick three and write the
        colours and copy, so it needs one
        {sessionPending || user ? null : (
          <>
            {' '}
            &mdash; <Link href="/sign-up">create one</Link>
          </>
        )}
        . Nothing is uploaded.
      </p>
    </form>
  );
}
