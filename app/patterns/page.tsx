import type { Metadata } from 'next';
import SelectPattern from 'components/select-pattern-page/SelectPattern';
import { getGalleryItems } from 'lib/pattern';

export const metadata: Metadata = {
  title: 'Make your art - Tabbied',
};

export default async function SelectPatternPage() {
  const gallery = await getGalleryItems();

  return <SelectPattern gallery={gallery} />;
}
