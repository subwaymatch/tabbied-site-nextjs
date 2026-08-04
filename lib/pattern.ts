// Site-side accessors over the `tabbied` package's generated pattern presets.
// The JSON files live in packages/tabbied/patterns/ (the package's codegen
// turns them into a typed module), so the site no longer reads from disk.
import {
  patterns,
  isPatternSlug,
  type PatternSlug,
} from 'tabbied/patterns';
import type { PatternDefinition } from 'tabbied';

export type { PatternOption } from 'tabbied';

export type Pattern = PatternDefinition;

// Card metadata for the gallery pages. The thumbnails render through
// <TabbiedPattern pattern={slug}>, which pulls the option/code data from the
// package on the client, so the server props stay small.
export type GalleryItem = {
  slug: PatternSlug;
  name: string;
  white: boolean;
  /** Authored palette (color0 = background) for placeholders + title fades. */
  palette: string[];
  colors?: PatternDefinition['colors'];
};

// The accessors stay async so callers (App Router pages) keep their existing
// await-based shape, even though the data now resolves in-memory.
export async function getAllPatternIds(): Promise<string[]> {
  return Object.keys(patterns);
}

export async function getPattern(patternId: string): Promise<Pattern> {
  if (!isPatternSlug(patternId)) {
    throw new Error(`Unknown pattern: ${patternId}`);
  }

  return patterns[patternId];
}

// Gallery list derived from the pattern presets, so a new preset only needs a
// JSON file in packages/tabbied/patterns/.
export async function getGalleryItems(): Promise<GalleryItem[]> {
  return (Object.keys(patterns) as PatternSlug[])
    .map((slug) => {
      const pattern = patterns[slug];

      return {
        slug,
        name: pattern.name,
        white: pattern.galleryWhite ?? false,
        palette: pattern.palette ?? [],
        colors: pattern.colors,
        order: pattern.galleryOrder ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))
    .map(({ slug, name, white, palette, colors }) => ({
      slug,
      name,
      white,
      palette,
      colors,
    }));
}
