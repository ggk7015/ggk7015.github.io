import type { CSSProperties } from 'react'

/**
 * Stagger index consumed by CSS as `transition-delay: calc(var(--i) * var(--stagger))`.
 * Capped so long lists never accumulate a multi-second delay.
 */
export function stagger(index: number, max = 8): CSSProperties {
  return { '--i': Math.min(index, max) } as CSSProperties
}
