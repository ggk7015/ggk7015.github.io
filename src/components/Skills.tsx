import { skills } from '../data/profile'

export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <h2 className="section__title" id="skills-title">
        技能
      </h2>
      <p className="section__lead">每項技能皆可回溯到上方原創作品中的實際使用。</p>

      <div className="skill-groups">
        {skills.map((group) => (
          <div key={group.category} className="skill-group">
            <h3 className="skill-group__name">{group.category}</h3>
            <ul className="chips">
              {group.items.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
