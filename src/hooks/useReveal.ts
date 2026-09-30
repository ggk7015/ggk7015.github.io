import { useEffect } from 'react'
import { supportsIntersectionObserver } from '../lib/env'

declare global {
  interface Window {
    __revealFailsafe?: number
  }
}

const REVEAL_MARGIN = '0px 0px -8% 0px'
const REPLAY_MARGIN = '0px 0px -10% 0px'

type Observer = { sweep: () => void; dispose: () => void }

const noop: Observer = { sweep: () => {}, dispose: () => {} }

/**
 * One-shot entrance. Each `[data-reveal]` is revealed the first time it is
 * reached and then left alone; its job is to keep content off screen until the
 * reader gets there, not to re-perform on the way back.
 */
function observeOnce(): Observer {
  const pending = new Set<HTMLElement>()
  for (const node of document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)')) {
    pending.add(node)
  }
  if (pending.size === 0) return noop

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
    { rootMargin: REVEAL_MARGIN, threshold: 0 },
  )

  for (const node of pending) observer.observe(node)

  return {
    sweep: () => {
      // A jump (End key, a #hash landing, scroll restoration) can move past
      // elements without any of them ever intersecting. Sweep anything already
      // at or above the fold so no content is left stranded at opacity 0.
      for (const node of pending) {
        if (node.getBoundingClientRect().top < window.innerHeight) show(node)
      }
    },
    dispose: () => observer.disconnect(),
  }
}

/**
 * Repeatable entrance. `.is-in` is toggled in *both* directions, so a framed
 * element the reader passes over many times animates again each time it comes
 * back into view. The negative bottom margin is the hysteresis band: an element
 * has to be 10% into the viewport to count as in, so scroll jitter sitting
 * exactly on the edge cannot flicker it.
 *
 * Deliberately not swept on scroll: hiding is the intended behaviour here, and
 * the once-only sweep would immediately undo it.
 */
function observeReplay(): Observer {
  const nodes = document.querySelectorAll<HTMLElement>('[data-replay]')
  if (nodes.length === 0) return noop

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle('is-in', entry.isIntersecting)
      }
    },
    { rootMargin: REPLAY_MARGIN, threshold: 0 },
  )

  for (const node of nodes) {
    // Seed before observing: the first observer callback is async, so an
    // element already on screen at mount would otherwise flash hidden.
    node.classList.toggle('is-in', node.getBoundingClientRect().top < window.innerHeight)
    observer.observe(node)
  }

  return { sweep: () => {}, dispose: () => observer.disconnect() }
}

/**
 * Drives both entrance systems. Both are gated behind the pre-paint `js-motion`
 * class, which is what actually hides anything; without JS, or with reduced
 * motion, the class is never added and all content renders normally.
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

    const once = observeOnce()
    const replay = observeReplay()

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        once.sweep()
      })
    }

    once.sweep()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      once.dispose()
      replay.dispose()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
}
