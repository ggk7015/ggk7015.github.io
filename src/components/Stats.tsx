import { stats } from '../data/profile'

export default function Stats() {
  return (
    <section className="stats" aria-label="開發統計">
      <dl>
        {stats.map((item) => (
          <div key={item.label} className="stats__item">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
