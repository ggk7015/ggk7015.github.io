import type { MouseEvent } from 'react'
import { links } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { useScrolledPast } from '../hooks/useScrolledPast'
import { SECTIONS, SECTION_IDS, type SectionLink } from '../lib/sections'
import ScrollProgress from './ScrollProgress'
import ThemeToggle from './ThemeToggle'

type Props = {
  onNavigate: (id: string, label: string) => void
}

export default function SiteHeader({ onNavigate }: Props) {
  const scrolled = useScrolledPast()
  const active = useActiveSection(SECTION_IDS)
  const github = links[0]

  function handleClick(event: MouseEvent<HTMLAnchorElement>, section: SectionLink) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    onNavigate(section.id, section.label)
  }

  return (
    <header className="topbar" data-scrolled={scrolled || undefined}>
      <div className="topbar__inner">
        <a className="brand" href="#top" aria-label="ggk5743，回到頁首">
          <svg
            className="brand__mark"
            viewBox="0 0 32 32"
            width={26}
            height={26}
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="16" cy="16" r="4.2" fill="currentColor" />
            <ellipse
              cx="16"
              cy="16"
              rx="13"
              ry="5.4"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.55"
              strokeWidth="1.1"
              transform="rotate(-28 16 16)"
            />
            <ellipse
              cx="16"
              cy="16"
              rx="13"
              ry="5.4"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.28"
              strokeWidth="1.1"
              transform="rotate(38 16 16)"
            />
          </svg>
          <span className="brand__text">ggk5743</span>
        </a>

        <nav className="constellation" aria-label="主要導覽">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              className="constellation__node"
              href={`#${section.id}`}
              data-active={active === section.id || undefined}
              aria-current={active === section.id ? 'location' : undefined}
              onClick={(event) => handleClick(event, section)}
            >
              <span className="constellation__dot" aria-hidden="true" />
              <span className="constellation__label">{section.label}</span>
            </a>
          ))}
        </nav>

        <div className="topbar__actions">
          <ThemeToggle />
          <a
            className="topbar__cta"
            href={github?.href ?? 'https://github.com/ggk7015'}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <ScrollProgress />
    </header>
  )
}
