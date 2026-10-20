import { links } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { useScrolledPast } from '../hooks/useScrolledPast'
import ScrollProgress from './ScrollProgress'
import ThemeToggle from './ThemeToggle'

const NAV = [
  { id: 'work', label: '作品' },
  { id: 'trajectory', label: '經歷' },
  { id: 'capabilities', label: '能力' },
  { id: 'signal', label: '聯絡' },
] as const

const NAV_IDS = NAV.map((item) => item.id)

export default function SiteHeader() {
  const scrolled = useScrolledPast()
  const active = useActiveSection(NAV_IDS)
  const github = links[0]

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

        <nav className="nav" aria-label="主要導覽">
          {NAV.map((item) => (
            <a
              key={item.id}
              className="nav__link"
              href={`#${item.id}`}
              data-active={active === item.id || undefined}
              aria-current={active === item.id ? 'location' : undefined}
            >
              <span className="nav__dot" aria-hidden="true" />
              {item.label}
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
