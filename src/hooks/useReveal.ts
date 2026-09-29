import { useEffect } from 'react'
import { supportsIntersectionObserver } from '../lib/env'

declare global {
  interface Window {
    __revealFailsafe?: number
  }
}

/**
 * Reveals every `[data-reveal]` element once it scrolls into view.
 *
 * Progressive enhancement: the `js-motion` class (set by the inline head script,
 * pre-paint) is what hides the elements. Without JS, or with reduced motion, the
 * class is never added and all content renders normally.
 */
export function useReveal(): void {
  useEffect(() => {
    const root = document.documentElement

    // The head script arms a timer that force-reveals everything in case the
    // bundle renders but this effect never runs. Reaching here cancels it.
    if (window.__revealFailsafe !== undefined) {
      window.clearTimeout(window.__revealFailsafe)
      window.__revealFailsafe = undefined
    }

    if (!root.classList.contains('js-motion')) return
    if (!supportsIntersectionObserver()) {
      root.classList.remove('js-motion')
      return
    }

    const pending = new Set<HTMLElement>()
    for (const node of document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')) {
      pending.add(node)
    }
    if (pending.size === 0) return

    const show = (node: HTMLElement) => {
      node.classList.add('is-in')
      pending.delete(node)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) show(entry.target as HTMLElement)
        }
      },
      // threshold 0 with a slightly negative bottom margin fires as soon as the
      // top edge enters, which is what the tall card lists need to animate.
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    )

    const revealSkipped = () => {
      // A jump (End key, a #hash landing, scroll restoration) can move past
      // elements without any of them ever intersecting. Sweep anything already
      // at or above the fold so no content is left stranded at opacity 0.
      for (const node of pending) {
        if (node.getBoundingClientRect().top < window.innerHeight) show(node)
      }
    }

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        revealSkipped()
      })
    }

    pending.forEach((node) => observer.observe(node))
    revealSkipped()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
}
