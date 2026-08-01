import {
  gasket, spark, reeding, facetgrad, gloaming, ridgeline, glyph,
  grain, kern, wavelet, mortise, karst, hilbert, linocut, fluting, gutter,
  quire, cascade, ripplering,
} from 'tabbied/artworks';
import type { ArtworkDefinition } from 'tabbied';

export type NewShowcaseSite = {
  slug: string;
  name: string;
  topic: string;
  /** Preset slug, for display labels. */
  artworkSlug: string;
  artwork: ArtworkDefinition;
  paletteName: string;
  /** Background color first — the same hexes the site itself uses. */
  palette: string[];
  seed: string;
};

/**
 * The second showcase collection: nineteen fully independent single-page brand
 * sites under /showcase/<slug>/, each designed around one Tabbied artwork and
 * AI-generated imagery (see docs/image-pipeline.md). Listed on /showcase and
 * /showcases; palettes here mirror each page's own constants.
 */
export const NEW_SHOWCASE_SITES: NewShowcaseSite[] = [
  { slug: 'mistral-cycles', name: 'Mistral Cycles', topic: 'Handbuilt bicycle frames', artworkSlug: 'gasket', artwork: gasket, paletteName: 'Blueprint navy', palette: ['#0D1B2A', '#1B98E0', '#E0FBFC', '#FF7B00', '#FFD23F', '#EAEAEA'], seed: 'dir-mc' },
  { slug: 'zenith-observatory', name: 'Zenith', topic: 'Observatory & planetarium', artworkSlug: 'spark', artwork: spark, paletteName: 'Nebula violet', palette: ['#10002B', '#5A189A', '#9D4EDD', '#C77DFF', '#E0AAFF', '#FFD6FF'], seed: 'dir-ze' },
  { slug: 'wildgrain-bakery', name: 'Wildgrain', topic: 'Naturally leavened bakery', artworkSlug: 'reeding', artwork: reeding, paletteName: 'Oven cream', palette: ['#EAE0CC', '#1B1B1E', '#C6AC8F', '#5E503F', '#A9927D', '#EB5E28'], seed: 'dir-wg' },
  { slug: 'ledgerline', name: 'Ledgerline', topic: 'Personal finance app', artworkSlug: 'facetgrad', artwork: facetgrad, paletteName: 'Fintech blue', palette: ['#0B1F3A', '#3E8BFF', '#3EECFF', '#97F4FF', '#9EFFD8', '#FFFFFF'], seed: 'dir-le' },
  { slug: 'maison-ambre', name: 'Maison Ambre', topic: 'Perfume house', artworkSlug: 'gloaming', artwork: gloaming, paletteName: 'Amber noir', palette: ['#141210', '#C9A227', '#E8D9B0', '#8C6A2F', '#FBF6EA', '#5A4632'], seed: 'dir-ma' },
  { slug: 'cairn-expeditions', name: 'Cairn', topic: 'Alpine guiding service', artworkSlug: 'ridgeline', artwork: ridgeline, paletteName: 'Glacier ember', palette: ['#10222E', '#A8CEDE', '#F2F7F9', '#E8734A', '#4E7A8C', '#D8E8EF'], seed: 'dir-ca' },
  { slug: 'hopscotch-museum', name: 'Hopscotch', topic: "Children's discovery museum", artworkSlug: 'glyph', artwork: glyph, paletteName: 'Crayon primaries', palette: ['#FFF9EF', '#2B2B33', '#FF5C4D', '#2E86DE', '#27C093', '#FFC53D'], seed: 'dir-ho' },
  { slug: 'analog-dept', name: 'Analog Dept.', topic: 'Film photography lab', artworkSlug: 'grain', artwork: grain, paletteName: 'Safelight', palette: ['#0F0F10', '#E8E6E1', '#E63946'], seed: 'dir-an' },
  { slug: 'grotesk-foundry', name: 'Grotesk', topic: 'Independent type foundry', artworkSlug: 'kern', artwork: kern, paletteName: 'Ink on paper', palette: ['#F4F1EC', '#111111', '#D63515', '#B9B3A8', '#8A857C', '#2E2B27'], seed: 'dir-gr' },
  { slug: 'cerulean-swim', name: 'Cerulean', topic: 'Swimwear label', artworkSlug: 'wavelet', artwork: wavelet, paletteName: 'Lagoon', palette: ['#F2FBFC', '#0FA3B1', '#B5E2E8', '#FF8266', '#FFD97D', '#134D57'], seed: 'dir-ce' },
  { slug: 'oxbow-workshop', name: 'Oxbow', topic: 'Furniture workshop', artworkSlug: 'mortise', artwork: mortise, paletteName: 'Oiled oak', palette: ['#F5F1E8', '#2E2A25', '#A9713C', '#6B4F35', '#9AA69B', '#C7BBA5'], seed: 'dir-ox' },
  { slug: 'piquant-provisions', name: 'Piquant Provisions', topic: 'Small-batch hot sauce', artworkSlug: 'karst', artwork: karst, paletteName: 'Scoville', palette: ['#0F1A20', '#F4D35E', '#EE964B', '#F95738', '#EFE6DD', '#4C8FBD'], seed: 'dir-pi' },
  { slug: 'quanta-robotics', name: 'Quanta', topic: 'Robotics laboratory', artworkSlug: 'hilbert', artwork: hilbert, paletteName: 'Phosphor', palette: ['#0B0E14', '#25E0C8', '#4A5568', '#E8ECF1', '#7A88FF', '#1A2230'], seed: 'dir-qu' },
  { slug: 'madrigal-strings', name: 'Madrigal', topic: 'Violin atelier', artworkSlug: 'linocut', artwork: linocut, paletteName: 'Varnish', palette: ['#2D132C', '#801336', '#C72C41', '#EE4540', '#F0C419', '#FFE9C7'], seed: 'dir-md' },
  { slug: 'neve-gelato', name: 'Neve', topic: 'Gelato shop', artworkSlug: 'fluting', artwork: fluting, paletteName: 'Sorbet pastels', palette: ['#FFF9F5', '#FF8FB8', '#FFC2D4', '#FF8A5C', '#D89FFF', '#F5C542'], seed: 'dir-ne' },
  { slug: 'plumbline-studio', name: 'Plumbline', topic: 'Architecture practice', artworkSlug: 'gutter', artwork: gutter, paletteName: 'Chalk cobalt', palette: ['#F6F5F1', '#17171A', '#2947F0', '#B9B9BE', '#6E6E74', '#DCDCD8'], seed: 'dir-pl' },
  { slug: 'foxglove-books', name: 'Foxglove', topic: 'Bookshop & café', artworkSlug: 'quire', artwork: quire, paletteName: 'Library green', palette: ['#F7F3E8', '#1E3A2F', '#3E6B54', '#C25E4C', '#D9CBA8', '#8FA98F'], seed: 'dir-fo' },
  { slug: 'caldera-rail', name: 'Caldera', topic: 'Scenic railway journeys', artworkSlug: 'cascade', artwork: cascade, paletteName: 'Gouache travel', palette: ['#F0EAD6', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'], seed: 'dir-cl' },
  { slug: 'stillpoint-yoga', name: 'Stillpoint', topic: 'Movement & breathwork studio', artworkSlug: 'ripplering', artwork: ripplering, paletteName: 'Warm linen', palette: ['#F5EFE7', '#C97B5A', '#8C7A6B', '#E5D5C3', '#4A423A', '#D9B99F'], seed: 'dir-st' },
];
