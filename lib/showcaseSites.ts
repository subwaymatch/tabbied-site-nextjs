import {
  gasket, spark, gloaming, ridgeline, glyph, wavelet, mortise, karst,
  hilbert, linocut, cascade, crescendo, perforate, bothways, torsion,
  taper, windowpane, epicentre, halftone, staple,
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
 * The second showcase collection: sixteen single-page brand
 * sites under /showcase/<slug>/, each designed around one Tabbied artwork and
 * AI-generated imagery (see docs/image-pipeline.md). Listed on /showcase and
 * /showcases; palettes here mirror each page's own constants.
 */
export const NEW_SHOWCASE_SITES: NewShowcaseSite[] = [
  { slug: 'mistral-cycles', name: 'Mistral Cycles', topic: 'Handbuilt bicycle frames', artworkSlug: 'gasket', artwork: gasket, paletteName: 'Blueprint navy', palette: ['#0D1B2A', '#1B98E0', '#E0FBFC', '#FF7B00', '#FFD23F', '#EAEAEA'], seed: 'dir-mc' },
  { slug: 'zenith-observatory', name: 'Zenith', topic: 'Observatory & planetarium', artworkSlug: 'spark', artwork: spark, paletteName: 'Nebula violet', palette: ['#10002B', '#5A189A', '#9D4EDD', '#C77DFF', '#E0AAFF', '#FFD6FF'], seed: 'dir-ze' },
  { slug: 'maison-ambre', name: 'Maison Ambre', topic: 'Perfume house', artworkSlug: 'gloaming', artwork: gloaming, paletteName: 'Amber noir', palette: ['#141210', '#C9A227', '#E8D9B0', '#8C6A2F', '#FBF6EA', '#5A4632'], seed: 'dir-ma' },
  { slug: 'cairn-expeditions', name: 'Cairn', topic: 'Alpine guiding service', artworkSlug: 'ridgeline', artwork: ridgeline, paletteName: 'Glacier ember', palette: ['#10222E', '#A8CEDE', '#F2F7F9', '#E8734A', '#4E7A8C', '#D8E8EF'], seed: 'dir-ca' },
  { slug: 'hopscotch-museum', name: 'Hopscotch', topic: "Children's discovery museum", artworkSlug: 'glyph', artwork: glyph, paletteName: 'Crayon primaries', palette: ['#FFF9EF', '#2B2B33', '#FF5C4D', '#2E86DE', '#27C093', '#FFC53D'], seed: 'dir-ho' },
  { slug: 'cerulean-swim', name: 'Cerulean', topic: 'Swimwear label', artworkSlug: 'wavelet', artwork: wavelet, paletteName: 'Lagoon', palette: ['#F2FBFC', '#0FA3B1', '#B5E2E8', '#FF8266', '#FFD97D', '#134D57'], seed: 'dir-ce' },
  { slug: 'oxbow-workshop', name: 'Oxbow', topic: 'Furniture workshop', artworkSlug: 'mortise', artwork: mortise, paletteName: 'Oiled oak', palette: ['#F5F1E8', '#2E2A25', '#A9713C', '#6B4F35', '#9AA69B', '#C7BBA5'], seed: 'dir-ox' },
  { slug: 'piquant-provisions', name: 'Piquant Provisions', topic: 'Small-batch hot sauce', artworkSlug: 'karst', artwork: karst, paletteName: 'Scoville', palette: ['#0F1A20', '#F4D35E', '#EE964B', '#F95738', '#EFE6DD', '#4C8FBD'], seed: 'dir-pi' },
  { slug: 'quanta-robotics', name: 'Quanta', topic: 'Robotics laboratory', artworkSlug: 'hilbert', artwork: hilbert, paletteName: 'Phosphor', palette: ['#0B0E14', '#25E0C8', '#4A5568', '#E8ECF1', '#7A88FF', '#1A2230'], seed: 'dir-qu' },
  { slug: 'madrigal-strings', name: 'Madrigal', topic: 'Violin atelier', artworkSlug: 'linocut', artwork: linocut, paletteName: 'Varnish', palette: ['#2D132C', '#801336', '#C72C41', '#EE4540', '#F0C419', '#FFE9C7'], seed: 'dir-md' },
  { slug: 'caldera-rail', name: 'Caldera', topic: 'Scenic railway journeys', artworkSlug: 'cascade', artwork: cascade, paletteName: 'Gouache travel', palette: ['#F0EAD6', '#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'], seed: 'dir-cl' },

  // Swiss-minimal set: one design language, five grids. Inter throughout.
  { slug: 'konzerthaus-halden', name: 'Konzerthaus Halden', topic: 'Concert hall', artworkSlug: 'crescendo', artwork: crescendo, paletteName: 'Programme red', palette: ['#F2F1EE', '#E1261C'], seed: 'dir-kh' },
  { slug: 'institut-vollmer', name: 'Institut Vollmer', topic: 'Materials research', artworkSlug: 'perforate', artwork: perforate, paletteName: 'Signal blue', palette: ['#FFFFFF', '#1A1A1A', '#0B4EE0', '#9AA0A6', '#E9EBEE', '#4A4F55'], seed: 'dir-iv' },
  { slug: 'linie-nord', name: 'Linie Nord', topic: 'Regional transit', artworkSlug: 'bothways', artwork: bothways, paletteName: 'Signal yellow', palette: ['#F1F1EF', '#17181A', '#FFD400', '#7E858C', '#DCDEDE', '#2A2E33'], seed: 'dir-ln' },
  { slug: 'chronometrie-bex', name: 'Chronométrie Bex', topic: 'Watch manufacture', artworkSlug: 'torsion', artwork: torsion, paletteName: 'Bone and steel', palette: ['#EDEDEB', '#0E0E0E', '#FF5A1F', '#9C9C98', '#DAD9D5', '#3A3A38'], seed: 'dir-cb' },
  { slug: 'bogen-papier', name: 'Bogen Papier', topic: 'Paper merchant', artworkSlug: 'taper', artwork: taper, paletteName: 'Stock green', palette: ['#FAFAF7', '#14150F', '#2E7D4F', '#C9C4B4', '#E7E5DC', '#6B6656'], seed: 'dir-bp' },

  // Pattern-forward Swiss set: full-bleed artwork fields with a transparent
  // background slot, redrawn on a timer so each page keeps moving.
  { slug: 'werkraum', name: 'Werkraum', topic: 'Architecture practice', artworkSlug: 'windowpane', artwork: windowpane, paletteName: 'Basel red', palette: ['#F4F3EF', '#16161A', '#D6001C', '#8E8E88', '#C9C8C1'], seed: 'dir-wr' },
  { slug: 'nordlicht', name: 'Nordlicht', topic: 'Cartography & survey', artworkSlug: 'epicentre', artwork: epicentre, paletteName: 'Chart blue', palette: ['#FCFCFA', '#0E1116', '#1B4DFF', '#8A9098', '#C3CBD4'], seed: 'dir-nl' },
  { slug: 'halbfett', name: 'Halbfett', topic: 'Type foundry', artworkSlug: 'halftone', artwork: halftone, paletteName: 'Proof vermilion', palette: ['#FFFFFF', '#000000', '#FF3B14', '#9A9A9A', '#DCDCDC'], seed: 'dir-hb' },
  { slug: 'hafen-sechs', name: 'Hafen Sechs', topic: 'Container terminal', artworkSlug: 'staple', artwork: staple, paletteName: 'Signal yellow, night', palette: ['#101215', '#F0EFEA', '#FFD400', '#6E747C', '#1C2026'], seed: 'dir-h6' },
];
