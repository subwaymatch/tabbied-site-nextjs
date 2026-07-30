// Batch 11 — 400 designs that export as native SVG with no caveat at all.
//
// The earlier batches were organised around a motif: batch 9 asked what
// happens when the canvas is the unit rather than the cell, batch 10 built
// drawings larger than the cell they start in. This one is organised around a
// *format*. Native SVG export shipped with three tiers — four designs it
// cannot represent, eighteen it exports with a caveat the user has to be shown
// first, and the rest clean — and this batch is 400 more of the clean tier.
// Every design here downloads as a true vector file with no warning dialog, no
// filter effects for a design tool to mangle, and no sub-pixel deviation from
// what is on screen.
//
// That is a real constraint, not a label. Ruled out: box-shadow, blur, blend
// modes (all export as SVG filters), smooth conic sweeps and
// repeating-conic-gradient (no SVG primitive), nested @doodle() images and
// @svg() payloads (documented sub-pixel deviations), and borders on
// partially-rounded boxes (the converter throws). What is left — solid fills,
// radii, per-side borders, clip paths, every linear and radial gradient, masks
// including mask-composite: intersect, hard-stop conic sectors, transforms,
// opacity, z-index — is the vocabulary of the whole batch. See
// artwork-defs-11/shared.mjs for the reasoning and the helpers, and
// docs/svg-export.md for the export contract itself.
//
// The sixteen sections, 25 designs each:
//
//   A. Split       one straight cut across the cell; two inks meet.
//   B. Rule        stripe fields — pitch, duty, angle, phase.
//   C. Sector      hard-stop conic pies: angle, apex, rotation, pairs.
//   D. Annulus     radial hard stops: rings, bullseyes, crescents, bands.
//   E. Chamfer     polygons that cut the corners off the cell.
//   F. Lobe        border-radius families: leaves, capsules, teardrops.
//   G. Frame       borders and inset frames on square boxes.
//   H. Bar         pseudo-element bars: crosses, tees, ladders, brackets.
//   I. Wedge       triangles and arrows.
//   J. Speck       dot fields and halftones.
//   K. Overlap     two shapes crossing, read through opacity and z-index.
//   L. Intersect   mask-composite: intersect — one shape cut by another.
//   M. Fade        smooth linear and radial ramps.
//   N. Lattice     crossed stripe fields: plaid, mesh, grille.
//   O. Mark        abstract marks assembled from bars and arcs.
//   P. Field       the cell's place on the sheet drives the parameter.
//
// House rules, inherited from every earlier batch and enforced by
// generate-batch11.mjs and validate-batch11.mjs: exactly one
// @random(${shapeFrequency}) gate per design; every design samples a
// transition-able ink per cell so a reseed morphs; a randomized custom prop
// read more than once goes through @var(--x); nothing paints var(--color0),
// because a hole knocked out in the background colour stops being a hole the
// moment the background is transparent.
import { RESERVED, TAKEN } from './artwork-defs-11/shared.mjs';
import { sectionA } from './artwork-defs-11/a-split.mjs';
import { sectionB } from './artwork-defs-11/b-rule.mjs';
import { sectionC } from './artwork-defs-11/c-sector.mjs';
import { sectionD } from './artwork-defs-11/d-annulus.mjs';
import { sectionE } from './artwork-defs-11/e-chamfer.mjs';
import { sectionF } from './artwork-defs-11/f-lobe.mjs';
import { sectionG } from './artwork-defs-11/g-frame.mjs';
import { sectionH } from './artwork-defs-11/h-bar.mjs';
import { sectionI } from './artwork-defs-11/i-wedge.mjs';
import { sectionJ } from './artwork-defs-11/j-speck.mjs';
import { sectionK } from './artwork-defs-11/k-overlap.mjs';
import { sectionL } from './artwork-defs-11/l-intersect.mjs';
import { sectionM } from './artwork-defs-11/m-fade.mjs';
import { sectionN } from './artwork-defs-11/n-lattice.mjs';
import { sectionO } from './artwork-defs-11/o-mark.mjs';
import { sectionP } from './artwork-defs-11/p-field.mjs';

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
];

// Batch 11 owns gallery orders 1200+; batch 10 stops at 1112.
const FIRST_ORDER = 1200;

let order = FIRST_ORDER;
const seen = new Set();
export const batch11 = [];

for (const { title, all } of SECTIONS) {
  for (const def of all) {
    if (RESERVED.has(def.slug)) {
      throw new Error(`${def.slug}: slug is a JS reserved word`);
    }
    // A name should never come to mean two different things — TAKEN carries
    // every motif name used anywhere in the project, including designs cut
    // before they shipped.
    if (TAKEN.has(def.slug)) {
      throw new Error(`${def.slug} (${title}): name already used elsewhere`);
    }
    if (seen.has(def.slug)) throw new Error(`duplicate slug in batch 11: ${def.slug}`);
    seen.add(def.slug);
    batch11.push({ ...def, order: order++ });
  }
}
