import { links } from '../data/profile'
import { stagger } from '../lib/motion'
import BackToStar from './BackToStar'
import { Icon } from './Icon'
import QRCode from './QRCode'

const SITE = 'https://ggk7015.github.io/'

type Props = {
  onBack: () => void
  backLabel: string
}

export default function Signal({ onBack, backLabel }: Props) {
  return (
    <section id="signal" className="section section--signal" aria-labelledby="signal-title">
      <BackToStar label={backLabel} onClick={onBack} />

      <div className="signal">

        <div className="signal__copy" data-reveal>
          <p className="eyebrow">04 — SIGNAL</p>
          <h2 id="signal-title" className="section__title">
            建立<em className="hl">連線</em>
          </h2>
          <p className="section__note">
            有想一起做的東西、想修的系統，或只是想問一個問題，從任何一個節點都能找到我。回覆通常在一天內。
          </p>

          <ul className="links">
            {links.map((item) => (
              <li key={item.kind}>
                <a
                  className="link-row"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  <span className="link-row__icon" aria-hidden="true">
                    <Icon name={item.kind} size={18} />
                  </span>
                  <span className="link-row__text">
                    <strong>{item.label}</strong>
                    <span>@{item.handle}</span>
                  </span>
                  {item.note ? <span className="link-row__note">{item.note}</span> : null}
                  <span className="link-row__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <aside className="signal__panel" data-reveal style={stagger(2)} aria-label="網站 QR 碼">
          <QRCode value={SITE} size={150} />
          <p className="signal__hint">掃描帶走這個頁面，或下載 SVG 放進簡報。</p>
        </aside>
      </div>
    </section>
  )
}
