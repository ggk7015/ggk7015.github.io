import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { SOLAR_PLANETS } from '../data/solar'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import SolarSceneBoundary from './SolarSceneBoundary'
import '../solar.css'

const SolarSystemScene = lazy(() => import('./SolarSystemScene'))

type Props = {
  onNavigate: (id: string, label: string) => void
}

export default function SolarSystem({ onNavigate }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  const firstPlanetRef = useRef<HTMLButtonElement>(null)
  const resetRef = useRef<HTMLButtonElement>(null)
  const focusTarget = useRef<'first' | 'reset' | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const planet = selected === null ? undefined : SOLAR_PLANETS[selected]

  useEffect(() => {
    if (focusTarget.current === 'first') firstPlanetRef.current?.focus()
    if (focusTarget.current === 'reset') resetRef.current?.focus()
    focusTarget.current = null
  }, [selected])

  return (
    <section id="universe" className="universe" aria-labelledby="universe-title">
      <div className="universe__heading" data-reveal>
        <div>
          <p className="universe__eyebrow"><span /> PERSONAL UNIVERSE / 01</p>
          <h2 id="universe-title">每個想法，都有自己的<span>軌道。</span></h2>
          <p>以太陽為起點，探索八個創作領域。選擇行星，看看圍繞它的作品與技術。</p>
        </div>
        <div className="universe__heading-meta" aria-hidden="true"><span>EXPLORE THE SYSTEM</span><strong>01 — 08</strong></div>
      </div>

      <div className="universe__frame">
        <div className="universe__frame-top">
          <div className="universe__frame-brand"><span className="universe__live" /> INTERACTIVE SOLAR SYSTEM</div>
          <div className="universe__frame-actions">
            <span className="universe__frame-id">GGK5743 / EXPLORATION 001</span>
            <button type="button" className="universe__pause" aria-pressed={paused || prefersReducedMotion} disabled={prefersReducedMotion} onClick={() => setPaused(!paused)}>
              {prefersReducedMotion ? '已減少動態' : paused ? '播放動畫' : '暫停動畫'}
            </button>
          </div>
        </div>

        <div className="universe__body">
          <aside className="universe-panel" id="universe-panel" aria-label="星球主題大綱">
            <div className="universe-panel__top"><span>MISSION CONTROL</span><span>{planet ? String((selected ?? 0) + 1).padStart(2, '0') : '00'} / 08</span></div>
            <p className="sr-only" aria-live="polite" aria-atomic="true">{planet ? `已選擇${planet.planet}：${planet.theme}` : '已回到太陽'}</p>
            {planet ? (
              <>
                <div className="universe-panel__planet"><span style={{ backgroundColor: planet.color }} /> {planet.english} / {planet.planet}</div>
                <p className="universe-panel__label">SELECTED ORBIT</p>
                <h3>{planet.theme}</h3>
                <p className="universe-panel__caption">{planet.caption}</p>
                <p className="universe-panel__description">{planet.description}</p>
                <div className="universe-panel__subhead"><span>ORBITING SATELLITES</span><span>{String(planet.satellites.length).padStart(2, '0')}</span></div>
                <ul className="universe-satellites">
                  {planet.satellites.map((satellite) => (
                    <li key={satellite.label}>
                      <span className="universe-satellites__dot" aria-hidden="true" />
                      <div><span className="universe-satellites__kind">{satellite.kind}</span>{satellite.href ? <a href={satellite.href} target="_blank" rel="noopener noreferrer">{satellite.label} <span aria-hidden="true">↗</span></a> : <strong>{satellite.label}</strong>}<small>{satellite.detail}</small></div>
                    </li>
                  ))}
                </ul>
                <button type="button" className="universe-panel__link" onClick={() => onNavigate(planet.target, planet.theme)}>前往相關內容 <span aria-hidden="true">↗</span></button>
              </>
            ) : (
              <>
                <div className="universe-panel__planet"><span className="universe-panel__sun" /> THE SUN / 太陽</div>
                <p className="universe-panel__label">THE CENTER OF IT ALL</p>
                <h3>探索我的<br />創作宇宙<span className="universe-panel__asterisk">✳</span></h3>
                <p className="universe-panel__description">你好，我是 ggk5743。從 Minecraft 到全端開發，每一顆行星代表一個持續探索的領域。</p>
                <div className="universe-panel__intro"><span>✦</span><p>點選星圖或下方名稱，展開主題大綱與所屬衛星。</p></div>
                <button type="button" className="universe-panel__link" onClick={() => { focusTarget.current = 'first'; setSelected(0) }}>開始探索 <span aria-hidden="true">↗</span></button>
              </>
            )}
            <div className="universe-panel__foot"><span>STATUS / READY</span><span>✳</span></div>
          </aside>

          <div className="universe-map">
            <div className="universe-map__header"><span>LIVE ORBIT VIEW</span><span className="universe-map__indicator"><i /> {paused || prefersReducedMotion ? 'ANIMATION PAUSED' : 'SYSTEM ACTIVE'}</span></div>
            <SolarSceneBoundary>
              <Suspense fallback={<div className="solar-scene solar-scene--loading" role="status">正在準備 3D 星圖…</div>}>
                <SolarSystemScene selected={selected} onSelect={setSelected} reducedMotion={paused || prefersReducedMotion} />
              </Suspense>
            </SolarSceneBoundary>
            <div className="universe-map__sun-label" aria-hidden="true"><span>✳</span> THE SUN <small>GGK5743</small></div>
            <div className="universe-map__hint"><span aria-hidden="true">✥</span> 點選行星或衛星探索 <i /> 桌機拖曳旋轉</div>
            <span className="universe-map__corner" aria-hidden="true">SOLAR / SYSTEM<br />08 PLANETS</span>
          </div>
        </div>

        <div className="universe__selector">
          <div className="universe__selector-label"><span>DESTINATIONS</span><small>選擇一顆行星</small></div>
          <nav className="planet-nav" aria-label="選擇星球主題">
            {SOLAR_PLANETS.map((item, index) => (
              <button type="button" className="planet-nav__item" key={item.id} ref={index === 0 ? firstPlanetRef : undefined} aria-pressed={selected === index} onClick={() => { setSelected(index); if (window.matchMedia('(max-width: 700px)').matches) document.getElementById('universe-panel')?.scrollIntoView({ block: 'start', behavior: prefersReducedMotion ? 'instant' : 'smooth' }) }}>
                <span className="planet-nav__dot" style={{ backgroundColor: item.color }} />
                <span><strong>{item.planet}</strong><small>{item.theme}</small></span>
                <span className="planet-nav__number">{String(index + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </nav>
            <button type="button" className="universe__reset" ref={resetRef} disabled={selected === null} onClick={() => { if (selected !== null) { focusTarget.current = 'reset'; setSelected(null) } }}>回到太陽 <span aria-hidden="true">↺</span></button>
        </div>
      </div>
      <p className="universe__note">✳ &nbsp; 衛星包含公開作品、既有自述經驗與第三方研究，並非 Git 分支清單；部分作品不在下方精選清單。模型比例與軌道為展示設計。</p>
    </section>
  )
}
