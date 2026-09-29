import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'work', label: '作品' },
  { id: 'experience', label: '經驗' },
  { id: 'skills', label: '技能' },
]

/**
 * Sticky section nav with scroll-spy. The observer watches a thin horizontal band
 * across the middle of the viewport, so exactly one section is "current" when the
 * page is between anchors, and none is highlighted at the very top or bottom.
 */
export default function SectionNav() {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const targets = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (element): element is HTMLElement => element !== null,
    )
    if (targets.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const inBand = entries.filter((entry) => entry.isIntersecting)
        if (inBand.length === 0) return
        const topmost = inBand.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        )
        setActive(topmost.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="section-nav" aria-label="頁面區段">
      <ul className="section-nav__list">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <a
              className="section-nav__link"
              href={`#${section.id}`}
              aria-current={active === section.id ? 'true' : undefined}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
