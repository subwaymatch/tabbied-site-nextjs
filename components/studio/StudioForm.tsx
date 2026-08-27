'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './StudioForm.module.css';

// The description travels to the results screen in the query string rather than
// in memory, so a result is refreshable, shareable, and back-navigable — which
// matters because the match is a pure function of this text.
const MAX_LENGTH = 600;

/** Short enough to be a slip rather than a description. */
const MIN_LENGTH = 10;

const PLACEHOLDER =
  "Tell us about your business, customers, location, preferred style, and colors. For example: We're a residential real estate team in Austin helping young families. We want a warm, modern look with earthy greens and a friendly, trustworthy feel.";

export default function StudioForm({ templateCount }: { templateCount: number }) {
  const [text, setText] = useState('');
  const router = useRouter();

  const trimmed = text.trim();
  const ready = trimmed.length >= MIN_LENGTH;

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();

        if (ready) {
          router.push(
            `/studio/results/?q=${encodeURIComponent(trimmed.slice(0, MAX_LENGTH))}`
          );
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

      <button type="submit" className={styles.submit} disabled={!ready}>
        Get three websites
      </button>

      {/* Says plainly where the three come from. Studio matches the library it
          has rather than drawing something new, and the page should not imply
          otherwise. */}
      <p className={styles.note}>
        Matched against the {templateCount} template sites in the library, on
        what you describe and the colors you ask for. Nothing is uploaded.
      </p>
    </form>
  );
}
