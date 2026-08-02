import mockupData from '../data/mockup-prompts.json';

export type Mockup = {
  /** Manifest slug; the promoted file is public/images/mockups/<id>.webp. */
  id: string;
  title: string;
  /** Short human label for the kind of surface the artwork is printed on. */
  surface: string;
  /** The Tabbied design the object actually wears. */
  design: string;
  /** The palette that design was rendered with, background first. */
  palette: string[];
  alt: string;
};

/** How each `surface` key in the data file reads on the page. */
const SURFACE_LABEL: Record<string, string> = {
  flat: 'Flat print',
  curved: 'Curved lid',
  'large-curved': 'Vehicle livery',
  fabric: 'Textile',
  cylinder: 'Cylindrical label',
};

/**
 * The mockups shown on /showcases, derived from the same file the generator
 * reads (see docs/artwork-mockups.md) so the design, palette and id can never
 * drift from the image that was actually produced.
 */
export const MOCKUPS: Mockup[] = mockupData.mockups.map((m) => ({
  id: m.id,
  title: m.title,
  surface: SURFACE_LABEL[m.surface] ?? m.surface,
  design: m.artwork.design,
  palette: m.artwork.palette,
  // The subject sentence describes the scene; it makes a serviceable alt text
  // once the leading article is capitalised.
  alt: `${m.subject.charAt(0).toUpperCase()}${m.subject.slice(1)}`,
}));
