import { useEffect, useState } from 'react'

/**
 * True once the reader has scrolled past `threshold` pixels, rAF-throttled.
 * Used to condense the topbar, which is a state change rather than a decoration:
 * the bar only needs to earn its height once the content is moving under it.
 */
export function useScrolledPast(threshold = 12): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setPast(window.scrollY > threshold)
    }
    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [threshold])

  return past
}
