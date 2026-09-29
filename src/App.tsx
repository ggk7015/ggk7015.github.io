import Hero from './components/Hero'
import Stats from './components/Stats'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills'
import SectionNav from './components/SectionNav'
import ThemeToggle from './components/ThemeToggle'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import { useReveal } from './hooks/useReveal'
import { profile } from './data/profile'

export default function App() {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#work">
        跳到主要內容
      </a>
      <ScrollProgress />
      <header className="topbar">
        <SectionNav />
        <ThemeToggle />
      </header>
      <main className="page">
        <Hero />
        <Stats />
        <Projects />
        <Experience />
        <Skills />
      </main>
      <footer className="footer">
        <p>
          {profile.name} ・ 建置於 Vite + React ・{' '}
          <a href="https://github.com/ggk7015/ggk7015.github.io" target="_blank" rel="noopener noreferrer">
            原始碼
          </a>
        </p>
        <BackToTop />
      </footer>
    </>
  )
}
