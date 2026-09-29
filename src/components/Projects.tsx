import { projects } from '../data/profile'
import { stagger } from '../lib/motion'

export default function Projects() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <h2 className="section__title" id="work-title">
        原創作品
      </h2>
      <p className="section__lead">
        以下專案皆為本人原始碼，已逐一以 Git 提交紀錄與遠端來源驗證。
      </p>

      <ul className="cards">
        {projects.map((project, i) => (
          <li key={project.name} className="card" data-reveal style={stagger(i)}>
            <div className="card__head">
              <h3 className="card__name">{project.name}</h3>
              {project.stars ? <span className="card__stars">★ {project.stars}</span> : null}
            </div>
            <p className="card__summary">{project.summary}</p>
            <ul className="card__highlights">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <ul className="chips">
              {project.stack.map((tech) => (
                <li key={tech} className="chip">
                  {tech}
                </li>
              ))}
            </ul>
            <p className="card__links">
              {project.href && (
                <a href={project.href} target="_blank" rel="noopener noreferrer me">
                  GitHub
                </a>
              )}
              {project.live && (
                <a href={project.live} target="_blank" rel="noopener noreferrer">
                  線上站台
                </a>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
