import Capabilities from './components/Capabilities'
import Galaxy from './components/Galaxy'
import Hero from './components/Hero'
import Signal from './components/Signal'
import SiteHeader from './components/SiteHeader'
import Trajectory from './components/Trajectory'
import Work from './components/Work'
import { profile } from './data/profile'
import { useReveal } from './hooks/useReveal'

const YEAR = new Date().getFullYear()

export default function App() {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#work">
        跳到主要內容
      </a>

      <Galaxy />
      <div className="veil" aria-hidden="true" />

      <SiteHeader />

      <main id="main" className="page">
        <Hero />
        <Work />
        <Trajectory />
        <Capabilities />
        <Signal />
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
    </>
  )
}
