import { experiences } from '../data/profile'
import { stagger } from '../lib/motion'
import BackToStar from './BackToStar'

type Props = {
  onBack: () => void
  backLabel: string
}

export default function Trajectory({ onBack, backLabel }: Props) {
  return (
    <section id="trajectory" className="section" aria-labelledby="trajectory-title">
      <BackToStar label={backLabel} onClick={onBack} />

      <header className="section__head" data-reveal>
        <p className="eyebrow">02 — TRAJECTORY</p>
        <h2 id="trajectory-title" className="section__title">
          走過的<em className="hl">軌跡</em>
        </h2>
        <p className="section__note">
          從上游專案讀懂架構，再自己重寫一遍。每一項都附上原始出處，避免把別人的設計說成自己的發明。
        </p>
      </header>

      <ol className="track">
        {experiences.map((item, index) => (
          <li className="track__item" key={item.area} data-reveal style={stagger(index, 6)}>
            <span className="track__node" aria-hidden="true" />
            <div className="track__body">
              <h3 className="track__area">{item.area}</h3>
              <p className="track__detail">{item.detail}</p>
              <p className="track__meta">
                <span className="track__source">{item.upstream}</span>
                <span aria-hidden="true">·</span>
                <span>{item.upstreamAuthor}</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
