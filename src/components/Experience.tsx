import { experiences } from '../data/profile'

export default function Experience() {
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <h2 className="section__title" id="experience-title">
        技術實作經驗
        <span className="badge badge--warn">非原創專案</span>
      </h2>
      <p className="section__lead">
        下列為我在既有開源專案上的實作、部署與除錯經驗。專案本身
        <strong>非本人原創</strong>，此處僅列出我所接觸的部分，並標註上游來源。
      </p>

      <ul className="rows">
        {experiences.map((item) => (
          <li key={item.area} className="row">
            <div className="row__main">
              <h3 className="row__area">{item.area}</h3>
              <p className="row__detail">{item.detail}</p>
            </div>
            <p className="row__upstream">
              <span className="row__upstream-label">上游</span>
              <span className="row__upstream-name">{item.upstream}</span>
              <span className="row__upstream-author">{item.upstreamAuthor}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
