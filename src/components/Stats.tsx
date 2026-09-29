import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { stagger } from '../lib/motion'
import { stats } from '../data/profile'

const DURATION = 700

/**
 * Counts to `value` when scrolled into view. Non-numeric values render as-is.
 *
 * The ticking number is aria-hidden and the real figure sits beside it as
 * screen-reader-only text, so assistive tech gets the final value once instead
 * of a stream of intermediate ones.
 */
function CountUp({ value }: { value: string }) {
  const target = /^\d+$/.test(value) ? Number(value) : null
  const { ref, inView } = useInView<HTMLSpanElement>('0px', 0.4)
  const reducedMotion = usePrefersReducedMotion()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (target === null || reducedMotion || !inView) return

    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION)
      // Cubic ease-out, so it decelerates into place instead of stopping dead.
      setShown(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reducedMotion, target])

  if (target === null) return <>{value}</>

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {reducedMotion ? target : shown}
      </span>
      <span className="sr-only">{value}</span>
    </>
  )
}

export default function Stats() {
  return (
    <section className="stats" aria-label="開發統計">
      <dl>
        {stats.map((item, i) => (
          <div key={item.label} className="stats__item" data-reveal style={stagger(i)}>
            <dt>{item.label}</dt>
            <dd>
              <CountUp value={item.value} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
