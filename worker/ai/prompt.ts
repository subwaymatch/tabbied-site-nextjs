import type { StudioDirection } from '../../lib/studioMatch';
import type { StoredDirection } from './schema';

// Prompts are assembled here and nowhere else. The client sends a description
// and receives a document; it never sees or influences the instructions, which
// is what keeps the endpoint task-shaped rather than a proxy.

const candidateLine = (entry: StudioDirection) =>
  `- ${entry.slug} · ${entry.name} — ${entry.topic}. ` +
  `Mood: ${entry.moods.join('/') || 'unstated'}. ` +
  `Motifs: ${entry.tags.slice(0, 4).join(', ') || 'unstated'}. ` +
  `Density: ${entry.density}. ` +
  `Palette "${entry.paletteName}": ${entry.palette.join(' ')}.`;

export function directionsSystemPrompt(candidates: StudioDirection[]): string {
  return [
    'You are a brand director choosing website directions for a small business.',
    '',
    'You will be given a description of a business and a shortlist of finished',
    'template websites. Choose exactly three of the shortlisted templates and,',
    'for each, propose a brand direction built on it.',
    '',
    'Rules:',
    '- Choose only from the shortlist, by slug. Never invent a slug.',
    '- Choose three templates that read as three genuinely different',
    '  directions — not three variations of one idea. Vary the mood, the',
    '  motif and the colour temperature.',
    '- Each palette starts with the background colour, then inks. At least one',
    '  ink must be clearly legible on that background; a palette where',
    "  everything is close in tone will be rejected and replaced with the",
    "  template's own.",
    '- Write the copy for this specific business. No placeholders, no lorem,',
    '  no invented facts about the business beyond what it was told.',
    '- "stance" is a name for the direction, two or three words.',
    '- "why" is one sentence, addressed to the business owner.',
    '',
    'The shortlist:',
    ...candidates.map(candidateLine),
  ].join('\n');
}

/** The description is data, fenced so it cannot read as instructions. */
export const directionsUserPrompt = (description: string) =>
  ['The business, in their own words:', '"""', description, '"""'].join('\n');

/**
 * Brand imagery for one chosen direction. This borrows the offline pipeline's
 * prompt craft wholesale (docs/image-pipeline.md): one subject, no text, no
 * baked shadow, and the palette anchored to materials rather than named as
 * hexes — a bare hex has nothing to attach to in a photograph.
 */
export function directionImagePrompt(
  direction: StoredDirection,
  description: string
): string {
  return [
    `A single photographic still life representing a business described as: ${description.slice(0, 240)}`,
    `The brand direction is "${direction.stance}" — ${direction.why}`,
    `Colour it from this palette, as real materials and surfaces rather than flat swatches: ${direction.palette.join(', ')}.`,
    'One subject, centred, three-quarter view, soft even studio light.',
    'No cast shadow. No text, letters, numbers, or logos.',
  ].join(' ');
}
