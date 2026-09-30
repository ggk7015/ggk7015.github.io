import { useState } from 'react'
import { links, profile, type LinkItem } from '../data/profile'
import { stagger } from '../lib/motion'
import { Icon } from './Icon'
import QRCode from './QRCode'

function LinkButton({ item, index, replay }: { item: LinkItem; index: number; replay: boolean }) {
  return (
    <a
      className={`link-btn link-btn--${item.kind}`}
      data-replay={replay ? '' : undefined}
      style={replay ? stagger(index) : undefined}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer me"
    >
      <Icon name={item.kind} />
      <span className="link-btn__text">
        <span className="link-btn__label">{item.label}</span>
        <span className="link-btn__handle">{item.handle}</span>
      </span>
    </a>
  )
}

export default function Hero() {
  const [origin] = useState(() => window.location.origin)

  return (
    <header className="hero" id="top">
      <div className="hero__portraits">
        <img
          className="hero__avatar"
          src={profile.avatar}
          alt={`${profile.name} 的頭像`}
          width={160}
          height={160}
        />
        <img
          className="hero__skin"
          src={profile.skin}
          alt="LittleSkin 個人形象預覽"
          width={64}
          height={64}
        />
      </div>

      <h1 className="hero__name">{profile.name}</h1>
      <p className="hero__tagline">{profile.tagline}</p>
      {profile.bio.map((line) => (
        <p key={line} className="hero__bio">
          {line}
        </p>
      ))}

      <nav className="hero__links" aria-label="社群連結">
        {links.map((item, index) => (
          <LinkButton key={item.kind} item={item} index={index} replay={item.kind === 'github'} />
        ))}
      </nav>

      {links
        .filter((item) => item.note || item.shareHref)
        .map((item) => (
          <p key={item.kind} className="hero__note">
            {item.note && <span>{item.note}</span>}
            {item.shareHref && (
              <a href={item.shareHref} target="_blank" rel="noopener noreferrer">
                {item.label} 分享連結
                <span className="hero__note-hint">（短碼，可能需登入或已過期）</span>
              </a>
            )}
          </p>
        ))}

      {origin && (
        <div className="hero__qr">
          <QRCode value={origin} />
        </div>
      )}

      <a className="hero__cue" href="#work">
        往下看作品
        <svg
          viewBox="0 0 24 24"
          width={16}
          height={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v13M5.5 12.5 12 19l6.5-6.5" />
        </svg>
      </a>
    </header>
  )
}
