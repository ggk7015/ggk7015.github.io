import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { profile } from '../data/profile'
import { useActiveSection } from '../hooks/useActiveSection'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { SECTIONS, SECTION_IDS } from '../lib/sections'

type Props = {
  onNavigate: (id: string, label: string) => void
}

type Drag = {
  pointer: number
  origin: number
  fromX: number
  fromY: number
  travelled: number
  axis: 'unknown' | 'spin' | 'scroll'
  id: number
}

const RADIUS = 39
const START = -104
const STEP = 90
const DRIFT = 0.0021 // degrees per millisecond → one turn roughly every 2.8 min
const DRAG_THRESHOLD = 5 // px of pointer travel before a tap becomes a drag

function place(index: number) {
  const angle = ((START + STEP * index) * Math.PI) / 180
  return {
    left: `${50 + RADIUS * Math.cos(angle)}%`,
    top: `${50 + RADIUS * Math.sin(angle)}%`,
  }
}

/**
 * The section map: four satellites orbit the core. Drag anywhere on the chart
 * to spin it (labels stay upright), or click a satellite to warp there.
 * Pointer capture is only taken once a drag actually starts, so plain clicks
 * still land on the button underneath.
 */
export default function StarMap({ onNavigate }: Props) {
  const reduced = usePrefersReducedMotion()
  const active = useActiveSection(SECTION_IDS)
  const orbitRef = useRef<HTMLDivElement | null>(null)
  const angleRef = useRef(0)
  const pausedRef = useRef(false)
  const dragRef = useRef<Drag | null>(null)
  const movedRef = useRef(false)
  const [dragging, setDragging] = useState(false)

  const paint = useCallback(() => {
    orbitRef.current?.style.setProperty('--orbit', `${angleRef.current}deg`)
  }, [])

  useEffect(() => {
    paint()
  }, [paint])

  useEffect(() => {
    if (reduced) return
    let raf = 0
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      if (!pausedRef.current && !dragRef.current) {
        angleRef.current = (angleRef.current + dt * DRIFT) % 360
        paint()
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [paint, reduced])

  const pointerAngle = (element: HTMLElement, x: number, y: number) => {
    const rect = element.getBoundingClientRect()
    const dx = x - (rect.left + rect.width / 2)
    const dy = y - (rect.top + rect.height / 2)
    return (Math.atan2(dy, dx) * 180) / Math.PI
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    // A second finger means the page is being pinched, not spun.
    if (!event.isPrimary) return
    dragRef.current = {
      pointer: pointerAngle(event.currentTarget, event.clientX, event.clientY),
      origin: angleRef.current,
      fromX: event.clientX,
      fromY: event.clientY,
      travelled: 0,
      axis: 'unknown',
      id: event.pointerId,
    }
    movedRef.current = false
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.id !== event.pointerId) return

    const dx = event.clientX - drag.fromX
    const dy = event.clientY - drag.fromY

    if (drag.axis === 'unknown') {
      const distance = Math.hypot(dx, dy)
      if (distance < DRAG_THRESHOLD) return
      // On touch, a mostly vertical swipe belongs to the page scroller.
      drag.axis = event.pointerType === 'touch' && Math.abs(dy) > Math.abs(dx) ? 'scroll' : 'spin'
      if (drag.axis === 'scroll') {
        dragRef.current = null
        return
      }
      movedRef.current = true
      setDragging(true)
      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // The pointer may already be gone (fast tap on touch); the drag still
        // tracks position for as long as the events keep arriving.
      }
    }

    let delta = pointerAngle(event.currentTarget, event.clientX, event.clientY) - drag.pointer
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360

    drag.travelled = Math.max(drag.travelled, Math.abs(delta))
    angleRef.current = drag.origin + delta
    paint()
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag) return
    dragRef.current = null
    setDragging(false)
    try {
      if (event.currentTarget.hasPointerCapture(drag.id)) {
        event.currentTarget.releasePointerCapture(drag.id)
      }
    } catch {
      // Nothing to release.
    }
  }

  function handleSatellite(id: string, label: string) {
    if (movedRef.current) {
      movedRef.current = false
      return
    }
    onNavigate(id, label)
  }

  return (
    <div
      className="starmap"
      data-reveal
      data-dragging={dragging || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerEnter={() => {
        pausedRef.current = true
      }}
      onPointerLeave={() => {
        pausedRef.current = false
      }}
      onFocus={() => {
        pausedRef.current = true
      }}
      onBlur={() => {
        pausedRef.current = false
      }}
    >
      <div className="starmap__field" aria-hidden="true">
        <span className="starmap__ring starmap__ring--inner" />
        <span className="starmap__ring starmap__ring--mid" />
        <span className="starmap__ring starmap__ring--outer" />
        <span className="starmap__tick starmap__tick--a" />
        <span className="starmap__tick starmap__tick--b" />
      </div>

      <div className="starmap__core" aria-hidden="true">
        <span className="starmap__halo" />
        <img
          className="starmap__avatar"
          src={profile.avatar}
          alt=""
          width={240}
          height={240}
          decoding="async"
          draggable={false}
        />
        <span className="starmap__core-label">core</span>
      </div>

      <div className="starmap__sats" ref={orbitRef}>
        {SECTIONS.map((section, index) => (
          <button
            key={section.id}
            type="button"
            className="sat"
            style={place(index)}
            data-active={active === section.id || undefined}
            aria-label={`${section.label}：${section.hint}`}
            aria-current={active === section.id ? 'true' : undefined}
            onClick={() => handleSatellite(section.id, section.label)}
          >
            <span className="sat__inner">
              <span className="sat__dot" aria-hidden="true" />
              <span className="sat__label">{section.label}</span>
              <span className="sat__code" aria-hidden="true">
                {section.code}
              </span>
            </span>
          </button>
        ))}
      </div>

      <p className="starmap__hint" aria-hidden="true">
        拖曳旋轉 · 點擊跳轉
      </p>
    </div>
  )
}
