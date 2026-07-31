// Batch 12 — 200 designs that export as native SVG with no caveat at all.
//
// Batch 11 asked what the catalogue looks like when the *format* is the
// constraint: 55 designs that download as true vector files with no warning
// dialog, no filter effects for a design tool to mangle, and no sub-pixel
// deviation from what is on screen. This batch is 200 more under the same
// rule, and it spends most of them on the one part of the supported subset the
// catalogue had barely used — the smooth gradient.
//
// Sections A-H (88 designs) are built on ramps: linear and radial, as masks
// over solid ink and as fields thinned across a cell. That is the largest
// gradient family in the catalogue by a wide margin, and it is safe for the
// same reason the hard-edged half is: a <linearGradient> or <radialGradient>
// carries the same stops CSS did, and the converter subdivides a
// colour→transparent run to account for CSS interpolating premultiplied alpha
// where SVG does not. Only *conic* blends are impossible, and there are none.
//
// Sections I-T (112 designs) work in the hard-edged vocabulary batch 11
// established — clip paths, hard-stop radial and conic stops, masks, placed
// rectangles — on motifs that batch did not reach.
//
// The twenty families, in the order they ship:
//
//   A. Falloff     one ink, one straight ramp.                        (11)
//   B. Crossfade   two inks handing over through a blend.             (11)
//   C. Stipple     dot fields thinned by a ramp.                      (11)
//   D. Drybrush    ruled fields thinned by a ramp.                    (11)
//   E. Bloom       radial ramps: glows, vignettes, soft rings.        (11)
//   F. Cutfade     a ramp confined to a cut shape.                    (11)
//   G. Rampband    repeating and stepped ramps.                       (11)
//   H. Softedge    shapes whose edges are ramps rather than lines.    (11)
//   I. Split       one cut across the cell, an ink either side.        (9)
//   J. Chamfer     corners, notches and steps taken off the square.   (10)
//   K. Sector      hard-stop conic pies and fans.                     (10)
//   L. Ring        hard-stop radial bands.                            (10)
//   M. Bar         placed rectangles.                                 (10)
//   N. Speck       hard-edged dot fields.                             (10)
//   O. Lattice     ruled fields crossed and combined.                 (10)
//   P. Frame       borders drawn as shapes, and what they enclose.    (10)
//   Q. Wedge       triangles.                                          (7)
//   R. Overlap     two shapes crossing, read through opacity.          (8)
//   S. Intersect   mask-composite: intersect.                          (8)
//   T. Radius      border-radius forms.                               (10)
//
// House rules, inherited from every earlier batch and enforced by
// generate-batch12.mjs (via artwork-lints.mjs) and validate-batch12.mjs:
// exactly one @random(${shapeFrequency}) gate per design; every design samples
// a transition-able ink per cell so a reseed morphs; a randomized custom prop
// read more than once goes through @var(--x); nothing paints var(--color0),
// because a hole knocked out in the background colour stops being a hole the
// moment the background is transparent.
import { RESERVED, TAKEN12 } from './artwork-defs-12/shared.mjs';
import { sectionA } from './artwork-defs-12/a-falloff.mjs';
import { sectionB } from './artwork-defs-12/b-crossfade.mjs';
import { sectionC } from './artwork-defs-12/c-stipple.mjs';
import { sectionD } from './artwork-defs-12/d-drybrush.mjs';
import { sectionE } from './artwork-defs-12/e-bloom.mjs';
import { sectionF } from './artwork-defs-12/f-cutfade.mjs';
import { sectionG } from './artwork-defs-12/g-rampband.mjs';
import { sectionH } from './artwork-defs-12/h-softedge.mjs';
import { sectionI } from './artwork-defs-12/i-split.mjs';
import { sectionJ } from './artwork-defs-12/j-chamfer.mjs';
import { sectionK } from './artwork-defs-12/k-sector.mjs';
import { sectionL } from './artwork-defs-12/l-ring.mjs';
import { sectionM } from './artwork-defs-12/m-bar.mjs';
import { sectionN } from './artwork-defs-12/n-speck.mjs';
import { sectionO } from './artwork-defs-12/o-lattice.mjs';
import { sectionP } from './artwork-defs-12/p-frame.mjs';
import { sectionQ } from './artwork-defs-12/q-wedge.mjs';
import { sectionR } from './artwork-defs-12/r-overlap.mjs';
import { sectionS } from './artwork-defs-12/s-intersect.mjs';
import { sectionT } from './artwork-defs-12/t-radius.mjs';

const SECTIONS = [
  sectionA,
  sectionB,
  sectionC,
  sectionD,
  sectionE,
  sectionF,
  sectionG,
  sectionH,
  sectionI,
  sectionJ,
  sectionK,
  sectionL,
  sectionM,
  sectionN,
  sectionO,
  sectionP,
  sectionQ,
  sectionR,
  sectionS,
  sectionT,
];

// Batch 12 owns gallery orders 1400-1999; batch 11 stops at 1254.
const FIRST_ORDER = 1400;

let order = FIRST_ORDER;
const seen = new Set();
export const batch12 = [];

for (const { title, all } of SECTIONS) {
  for (const def of all) {
    if (RESERVED.has(def.slug)) {
      throw new Error(`${def.slug}: slug is a JS reserved word`);
    }
    // A name should never come to mean two different things — TAKEN12 carries
    // every motif name used anywhere in the project, batch 11 included, plus
    // the designs cut before they shipped.
    if (TAKEN12.has(def.slug)) {
      throw new Error(`${def.slug} (${title}): name already used elsewhere`);
    }
    if (seen.has(def.slug)) throw new Error(`duplicate slug in batch 12: ${def.slug}`);
    seen.add(def.slug);
    batch12.push({ ...def, order: order++ });
  }
}
