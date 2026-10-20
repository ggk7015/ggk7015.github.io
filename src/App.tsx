import Capabilities from './components/Capabilities'
import Galaxy from './components/Galaxy'
import Hero from './components/Hero'
import Signal from './components/Signal'
import SiteHeader from './components/SiteHeader'
import Trajectory from './components/Trajectory'
import Warp from './components/Warp'
import Work from './components/Work'
import { profile } from './data/profile'
import { useReveal } from './hooks/useReveal'
import { useSectionNav } from './hooks/useSectionNav'

const YEAR = new Date().getFullYear()

export default function App() {
  useReveal()
  const { go, back, arrive, target, backLabel } = useSectionNav()

  return (
    <>
      <a className="skip-link" href="#work">
        跳到主要內容
      </a>

      <Galaxy />
      <div className="veil" aria-hidden="true" />

      <SiteHeader onNavigate={go} />

      <main id="main" className="page">
        <Hero onNavigate={go} />
        <Work onBack={back} backLabel={backLabel} />
        <Trajectory onBack={back} backLabel={backLabel} />
        <Capabilities onBack={back} backLabel={backLabel} />
        <Signal onBack={back} backLabel={backLabel} />
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <p>
            © {YEAR} {profile.name} ・ 建置於 Vite + React + Canvas 2D
          </p>
          <div className="footer__links">
            <a
              href="https://github.com/ggk7015/ggk7015.github.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              原始碼
            </a>
            <a href="#top">回到頂端 ↑</a>
          </div>
        </div>
      </footer>

      <Warp target={target} onArrive={arrive} />
    </>
  )
}
