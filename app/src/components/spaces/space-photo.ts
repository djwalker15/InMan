// Warm "photo" placeholder generator for the Spaces drill-down cards/hero.
// Ported from the Claude Design prototype (inman-design-system/project/spaces).
// Real SpaceNodes carry no photo or hue, so we derive a stable hue from the
// space id (or name) and render a layered-gradient stand-in that reads like a
// tight-crop, warm-toned space photograph — the placeholder for the future
// real-photo navigation vision. No schema change.

const WARM_HUES = [20, 26, 32, 38, 44, 30, 36]

/** Deterministic warm hue for a space, seeded by its id (or name). */
export function hueForSpace(seed: string): number {
  let sum = 0
  for (const ch of seed) sum += ch.charCodeAt(0)
  return WARM_HUES[sum % WARM_HUES.length]
}

/**
 * Layered-gradient CSS `background` value for a given hue. Sage-ish hues
 * (~120–180) render cool-green (fridges, coolers); everything else stays in
 * the cream→amber→clay band. Includes a top/bottom darkening pass so white
 * type and glyphs seated on top stay legible.
 */
export function spacePhoto(hue: number): string {
  const h = ((hue % 360) + 360) % 360
  const isCool = h > 120 && h < 180
  const base1 = `hsl(${h} ${isCool ? 26 : 46}% ${isCool ? 62 : 72}%)`
  const base2 = `hsl(${h + 14} ${isCool ? 30 : 52}% ${isCool ? 40 : 48}%)`
  const glow = `hsl(${h - 6} ${isCool ? 30 : 60}% 82%)`
  const deep = `hsl(${h + 22} ${isCool ? 34 : 44}% ${isCool ? 30 : 34}%)`
  return [
    'linear-gradient(180deg, rgba(28,28,24,0.30) 0%, rgba(28,28,24,0) 34%, rgba(28,28,24,0.04) 64%, rgba(28,28,24,0.30) 100%)',
    `radial-gradient(120% 88% at 22% 12%, ${glow} 0%, transparent 56%)`,
    `radial-gradient(130% 120% at 86% 96%, ${deep} 0%, transparent 52%)`,
    `linear-gradient(138deg, ${base1} 0%, ${base2} 100%)`,
  ].join(', ')
}

/** Convenience: gradient background for a space, seeded by its id. */
export function spacePhotoFor(seed: string): string {
  return spacePhoto(hueForSpace(seed))
}
