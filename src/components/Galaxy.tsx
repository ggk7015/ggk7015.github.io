import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { mountGalaxy } from '../lib/galaxy'

/**
 * Fixed backdrop canvas. Purely decorative, so it is `aria-hidden` and lets all
 * pointer input through. Remounts when the motion preference flips.
 */
export default function Galaxy() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const calm = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    return mountGalaxy(canvas, { calm })
  }, [calm])

  return <canvas ref={canvasRef} className="galaxy" aria-hidden="true" />
}
