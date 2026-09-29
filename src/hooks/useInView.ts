import { useEffect, useRef, useState, type RefObject } from 'react'
import { prefersReducedMotion, supportsIntersectionObserver } from '../lib/env'

/**
 * True once the element has entered the viewport; latches and never flips back.
 *
 * Starts as `true` when the answer is already known without observing anything:
 * the reader asked for reduced motion, or the browser has no IntersectionObserver.
 * Callers can then skip their animation instead of running a shortened one.
 */
export function useInView<T extends Element>(
  rootMargin = '0px',
  threshold = 0,
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(
    () => prefersReducedMotion() || !supportsIntersectionObserver(),
  )

  useEffect(() => {
    const element = ref.current
    if (!element || inView) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setInView(true)
        observer.disconnect()
      },
      { rootMargin, threshold },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [inView, rootMargin, threshold])

  return { ref, inView }
}
