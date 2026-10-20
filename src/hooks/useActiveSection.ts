import { useEffect, useState } from 'react'

/**
 * Tracks which section owns the middle band of the viewport.
 *
 * The band (`-45%` top, `-50%` bottom) is narrow enough that only one section
 * can win, so the nav never shows two active items at once. Sections are passed
 * in a stable array; only the first is used as the pre-scroll value.
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') return

    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )

    for (const section of sections) observer.observe(section)
    return () => observer.disconnect()
  }, [ids])

  return active
}
