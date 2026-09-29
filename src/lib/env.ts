export function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function supportsIntersectionObserver(): boolean {
  return typeof window.IntersectionObserver === 'function'
}
