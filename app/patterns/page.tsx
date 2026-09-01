import type { Metadata } from 'next';
import { plexMono } from 'lib/fonts';
import SelectPattern from 'components/select-pattern-page/SelectPattern';
import { getGalleryItems } from 'lib/pattern';

export const metadata: Metadata = {
  title: 'Make your art - Tabbied',
};

export default async function SelectPatternPage() {
  const gallery = await getGalleryItems();

  // The mono is used for the card names; the variable has to reach them from an
  // ancestor, and SelectPattern is a client component.
  return (
    <div className={plexMono.variable}>
      <SelectPattern gallery={gallery} />
    </div>
  );
}
