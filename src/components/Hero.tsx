import type { MouseEvent } from 'react'
import { profile, stats } from '../data/profile'
import { stagger } from '../lib/motion'
import StarMap from './StarMap'

type Props = {
  onNavigate: (id: string, label: string) => void
}

export default function Hero({ onNavigate }: Props) {
  const since = profile.joined.slice(0, 4)

  function jump(event: MouseEvent<HTMLAnchorElement>, id: string, label: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    onNavigate(id, label)
  }

  return (
    <section id="top" className="hero" aria-labelledby="hero-title">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="eyebrow" data-reveal>
            <span className="eyebrow__dot" aria-hidden="true" />
            系統上線 · 可接受合作
          </p>

          <h1 id="hero-title" className="hero__title" data-reveal style={stagger(1)}>
            <span className="hero__name">{profile.name}</span>
            <span className="hero__role">
              全端開發者，
              <em>把複雜的系統做成可預期的樣子</em>
            </span>
          </h1>

          <p className="hero__lede" data-reveal style={stagger(2)}>
            {profile.bio[0]}
          </p>
          <p className="hero__lede hero__lede--dim" data-reveal style={stagger(3)}>
            {profile.bio[1]}
          </p>

          <div className="hero__actions" data-reveal style={stagger(4)}>
            <a
              className="btn btn--primary"
              href="#work"
              onClick={(event) => jump(event, 'work', '作品')}
            >
              查看作品
              <span className="btn__glyph" aria-hidden="true">
                ↓
              </span>
            </a>
            <a
              className="btn btn--ghost"
              href="https://github.com/ggk7015"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
              <span className="btn__glyph" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>

          <dl className="hero__stats" data-reveal style={stagger(5)}>
            {stats.map((item) => (
              <div className="stat" key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
            <div className="stat">
              <dt>公開建置</dt>
              <dd>{since}</dd>
            </div>
          </dl>
        </div>

        <StarMap onNavigate={onNavigate} />
      </div>

      <a className="hero__cue" href="#work" onClick={(event) => jump(event, 'work', '作品')}>
        <span>向下捲動</span>
        <svg
          viewBox="0 0 24 24"
          width={15}
          height={15}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 4v15M5.5 12.5 12 19l6.5-6.5" />
        </svg>
      </a>
    </section>
  )
}
