import { projects } from '../data/profile'
import { stagger } from '../lib/motion'

export default function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-title">
      <header className="section__head" data-reveal>
        <p className="eyebrow">01 — SELECTED WORK</p>
        <h2 id="work-title" className="section__title">
          在軌道上<em className="hl">的作品</em>
        </h2>
        <p className="section__note">
          五個公開專案。重點不在功能清單，而在取捨：哪些依賴該砍、哪些抽象該留、哪些協定值得自己實作。
        </p>
      </header>

      <div className="work">
        {projects.map((project, index) => (
          <article
            key={project.name}
            className={index === 0 ? 'card card--feature' : 'card'}
            data-reveal
            style={stagger(index)}
          >
            <div className="card__top">
              <span className="card__index">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="card__name">{project.name}</h3>
              {project.stars ? (
                <span className="card__stars" aria-label={`${project.stars} 顆星`}>
                  ★ {project.stars}
                </span>
              ) : null}
            </div>

            <p className="card__summary">{project.summary}</p>

            <ul className="card__list">
              {project.highlights.slice(0, index === 0 ? 5 : 3).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <ul className="chips" aria-label="技術棧">
              {project.stack.map((item) => (
                <li className="chip" key={item}>
                  {item}
                </li>
              ))}
            </ul>

            <div className="card__links">
              {project.href ? (
                <a className="link-arrow" href={project.href} target="_blank" rel="noopener noreferrer">
                  原始碼
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
              {project.live ? (
                <a className="link-arrow" href={project.live} target="_blank" rel="noopener noreferrer">
                  線上版本
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
