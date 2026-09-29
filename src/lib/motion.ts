import type { CSSProperties } from 'react'

/**
 * Stagger index consumed by CSS as `transition-delay: calc(var(--i) * var(--stagger))`,
 * capped so long lists never accumulate a multi-second delay.
 *
 * Also emits `--reveal-d`, the distance the item travels on entry. Distance
 * decays with the index so a cascade decelerates: item 5 lands almost in place
 * while item 1 has real travel. Every item moving the same distance is what makes
 * a stagger read as a scripted drop instead of choreography.
 */
export function stagger(index: number, max = 8): CSSProperties {
  const i = Math.min(index, max)
  return {
    '--i': i,
    '--reveal-d': `max(2px, calc(var(--reveal-shift) - ${i} * 1px))`,
  } as CSSProperties
}
