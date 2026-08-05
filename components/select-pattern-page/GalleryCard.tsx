'use client';

import Link from 'next/link';
import type { GalleryItem } from 'lib/pattern';
import {
  previewPalette,
  useBrandPalettes,
  useDraftPreview,
} from 'lib/brandPalettes';
import { markGalleryNavigation } from 'lib/galleryScroll';
import GalleryDoodle from './GalleryDoodle';
import styles from './SelectPattern.module.css';

// One gallery card: a live thumbnail with its index and name below it (no
// overlay). Client-side because the preview follows the selected palette
// (localStorage), applied to every design in the grid.
export default function GalleryCard({
  item,
  index,
}: {
  item: GalleryItem;
  /** Position in the whole gallery, not in the page — the label is an index. */
  index: number;
}) {
  const brandState = useBrandPalettes();
  // While a palette is being edited, every card recolors live to the draft;
  // otherwise it follows the active saved or library palette.
  const draftPreview = useDraftPreview();
  const palette = draftPreview ?? previewPalette(brandState);

  return (
    <Link
      href={`/patterns/${item.slug}?seed=0000`}
      prefetch={false}
      onClick={markGalleryNavigation}
      className={styles.card}
    >
      <div className={styles.tile}>
        <GalleryDoodle item={item} palette={palette} />
      </div>
      <div className={styles.cardMeta}>
        <span className={styles.cardIndex}>
          {String(index).padStart(3, '0')}
        </span>
        <h3 className={styles.cardName}>{item.name}</h3>
      </div>
    </Link>
  );
}
