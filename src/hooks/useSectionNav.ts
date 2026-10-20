import { useCallback, useEffect, useRef, useState } from 'react'
import { SECTIONS, SECTION_IDS } from '../lib/sections'
import { useActiveSection } from './useActiveSection'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type WarpTarget = {
  id: string
  label: string
  token: number
}

const HOME = 'top'
const HOME_LABEL = '星圖'
const TRAIL_LIMIT = 8

export function labelOf(id: string): string {
  if (id === HOME) return HOME_LABEL
  return SECTIONS.find((section) => section.id === id)?.label ?? HOME_LABEL
}

/**
 * Section travel: reduced-motion users jump straight there, everyone else gets
 * a warp overlay first. The overlay is driven by `target`, and `arrive` is what
 * actually performs the scroll so the animation and the landing never race.
 *
 * `trail` remembers which planet we left, so every section can offer a way back.
 */
export function useSectionNav() {
  const reduced = usePrefersReducedMotion()
  const active = useActiveSection(SECTION_IDS)
  const [target, setTarget] = useState<WarpTarget | null>(null)
  const [trail, setTrail] = useState<WarpTarget[]>([])
  const targetRef = useRef<WarpTarget | null>(null)
  const activeRef = useRef(active)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    targetRef.current = target
  }, [target])

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (!element) return

    const bar = document.querySelector('.topbar')?.getBoundingClientRect().height ?? 68
    const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - bar + 1)
    const root = document.documentElement
    const previous = root.style.scrollBehavior

    // The stylesheet sets `scroll-behavior: smooth`; override it for one frame
    // so the landing is instant and the warp does not end in a second scroll.
    root.style.scrollBehavior = 'auto'
    void root.offsetHeight
    window.scrollTo(0, top)
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previous
    })
  }, [])

  const go = useCallback(
    (id: string, label: string) => {
      // Above the first section we are still on the map, not on a planet.
      const workTop = document.getElementById('work')?.getBoundingClientRect().top ?? 0
      const departure = workTop > window.innerHeight * 0.5 ? HOME : activeRef.current
      if (departure && departure !== id) {
        setTrail((prev) => {
          if (prev[prev.length - 1]?.id === departure) return prev
          return [...prev, { id: departure, label: labelOf(departure), token: 0 }].slice(-TRAIL_LIMIT)
        })
      }

      if (reduced) {
        scrollToSection(id)
        return
      }
      setTarget({ id, label, token: performance.now() })
    },
    [reduced, scrollToSection],
  )

  const back = useCallback(() => {
    const previous = trail[trail.length - 1]
    setTrail((prev) => prev.slice(0, -1))

    const id = previous?.id ?? HOME
    const label = previous?.label ?? HOME_LABEL

    if (reduced) {
      scrollToSection(id)
      return
    }
    setTarget({ id, label, token: performance.now() })
  }, [reduced, scrollToSection, trail])

  const arrive = useCallback(() => {
    const current = targetRef.current
    if (current) scrollToSection(current.id)
    setTarget(null)
  }, [scrollToSection])

  return {
    go,
    back,
    arrive,
    target,
    reduced,
    backLabel: trail[trail.length - 1]?.label ?? HOME_LABEL,
    canBack: trail.length > 0,
  }
}
