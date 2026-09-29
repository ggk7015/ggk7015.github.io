import { skills } from '../data/profile'
import { stagger } from '../lib/motion'

export default function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <h2 className="section__title" id="skills-title" data-reveal="head">
        技能
      </h2>
      <p className="section__lead" data-reveal="head" style={stagger(1)}>
        每項技能皆可回溯到上方原創作品中的實際使用。
      </p>

      <div className="skill-groups">
        {skills.map((group, i) => (
          <div key={group.category} className="skill-group" data-reveal style={stagger(i)}>
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
