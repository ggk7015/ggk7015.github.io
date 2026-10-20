import { skills } from '../data/profile'
import { stagger } from '../lib/motion'
import BackToStar from './BackToStar'

type Props = {
  onBack: () => void
  backLabel: string
}

export default function Capabilities({ onBack, backLabel }: Props) {
  return (
    <section id="capabilities" className="section" aria-labelledby="capabilities-title">
      <BackToStar label={backLabel} onClick={onBack} />

      <header className="section__head" data-reveal>
        <p className="eyebrow">03 — CAPABILITIES</p>
        <h2 id="capabilities-title" className="section__title">
          可調用的<em className="hl">能力</em>
        </h2>
        <p className="section__note">
          不是關鍵字雲。每一項背後都有一個跑起來的專案，或一次把效能、體積、穩定性壓下來的紀錄。
        </p>
      </header>

      <div className="skills">
        {skills.map((group, index) => (
          <article className="skill" key={group.category} data-reveal style={stagger(index, 6)}>
            <div className="skill__head">
              <span className="skill__index">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="skill__title">{group.category}</h3>
            </div>
            <ul className="chips">
              {group.items.map((item) => (
                <li className="chip" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}
