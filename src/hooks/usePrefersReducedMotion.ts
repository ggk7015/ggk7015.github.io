import { useState } from 'react'
import { prefersReducedMotion } from '../lib/env'

/**
 * Snapshot of the `prefers-reduced-motion` media query, read once on mount.
 * Callers use it to skip animation work outright rather than to scale it down.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced] = useState(prefersReducedMotion)
  return reduced
}
