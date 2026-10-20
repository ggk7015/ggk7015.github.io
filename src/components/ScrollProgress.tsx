import { useEffect, useRef } from 'react'

/**
 * Reading progress as a hairline under the top bar. Written straight to the
 * node's transform so scrolling never re-renders React.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    let frame = 0
    const update = () => {
      frame = 0
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - doc.clientHeight
      const ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`
    }
    const schedule = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <span ref={barRef} className="progress__bar" aria-hidden="true" />
}
