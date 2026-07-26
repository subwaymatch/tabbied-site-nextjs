'use client';

import { useState } from 'react';
import { GENERATED_IMAGES } from './generatedImages';
import s from './ShowcaseSite.module.css';

// The site palette (and its background color) is appended to every prompt so a
// generated image blends into the page.
export function withPalette(prompt: string, colors: string[]): string {
  const bg = colors[0];
  return `${prompt} Color palette: ${colors.join(', ')}. Use ${bg} as the background so the image blends into the page.`;
}

// The leading sentence of a prompt describes the subject, which is what alt text
// wants; the palette and lighting notes that follow are noise to a screen reader.
const altFrom = (prompt: string) => prompt.split(/\.\s/)[0].replace(/\.$/, '');

/**
 * Card imagery, in one of two states.
 *
 * Once scripts/images/import-batch.mjs has written public/images/showcase/<id>.webp
 * the slot renders that image, cropped with object-fit so it is never stretched.
 * Until then it stays a labelled placeholder showing the ready-to-use image
 * prompt. Either way the full prompt hangs off data-image-prompt and a copy
 * button lifts it to the clipboard, since the display text is clamped.
 */
export default function ImageCard({
  id,
  prompt,
  colors,
}: {
  id: string;
  prompt: string;
  colors: string[];
}) {
  const full = withPalette(prompt, colors);
  const hasImage = GENERATED_IMAGES.includes(id);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(full);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = full;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const button = (
    <button type="button" className={s.imgphCopy} onClick={copy} aria-label="Copy image prompt">
      {copied ? '✓ Copied' : '⧉ Copy'}
    </button>
  );

  if (hasImage) {
    return (
      <figure className={`${s.imgph} ${s.imgphFilled}`} data-image-id={id} data-image-prompt={full}>
        {/* Plain <img>: the site is a static export, so there is no /_next/image
            optimizer at runtime and import-batch already sized the file. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.imgphImg} src={`/images/showcase/${id}.webp`} alt={altFrom(prompt)} loading="lazy" />
        {button}
      </figure>
    );
  }

  return (
    <figure className={s.imgph} data-image-id={id} data-image-prompt={full}>
      <div className={s.imgphInner}>
        <span className={s.imgphBadge}>Image prompt</span>
        <p className={s.imgphText}>{full}</p>
      </div>
      {button}
    </figure>
  );
}
