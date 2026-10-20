import { profile, stats } from '../data/profile'
import { stagger } from '../lib/motion'

export default function Hero() {
  const since = profile.joined.slice(0, 4)

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
            <a className="btn btn--primary" href="#work">
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

        <figure className="orb" data-reveal style={stagger(2)}>
          <div className="orb__halo" aria-hidden="true" />
          <div className="orb__ring orb__ring--a" aria-hidden="true" />
          <div className="orb__ring orb__ring--b" aria-hidden="true" />
          <div className="orb__ring orb__ring--c" aria-hidden="true" />
          <img
            className="orb__avatar"
            src={profile.avatar}
            alt={`${profile.name} 的頭像`}
            width={320}
            height={320}
            decoding="async"
          />
          <img
            className="orb__skin"
            src={profile.skin}
            alt=""
            aria-hidden="true"
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
          />
          <figcaption className="orb__caption">
            <span className="orb__label">NODE</span>
            <code>ggk7015</code>
          </figcaption>
        </figure>
      </div>

      <a className="hero__cue" href="#work">
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
