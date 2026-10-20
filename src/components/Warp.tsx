import { useEffect, useRef } from 'react'
import type { WarpTarget } from '../hooks/useSectionNav'
import { runWarp } from '../lib/warpfield'

type Props = {
  target: WarpTarget | null
  onArrive: () => void
}

export default function Warp({ target, onArrive }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const meterRef = useRef<HTMLSpanElement | null>(null)
  const percentRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (!target) return
    const canvas = canvasRef.current
    if (!canvas) {
      onArrive()
      return
    }

    const field = runWarp(canvas, {
      duration: 950,
      onProgress(progress) {
        if (meterRef.current) meterRef.current.style.transform = `scaleX(${progress.toFixed(3)})`
        if (percentRef.current) percentRef.current.textContent = `${Math.round(progress * 100)}%`
      },
      onDone() {
        // Let the tunnel clear before the page reappears underneath.
        window.setTimeout(onArrive, 170)
      },
    })

    return () => field.stop()
  }, [target, onArrive])

  return (
    <>
      <div className="warp" data-active={target ? '' : undefined} aria-hidden={!target}>
        <canvas ref={canvasRef} className="warp__canvas" />
        <div className="warp__hud">
          <p className="warp__dest">
            <span className="warp__dest-label">跳轉星域</span>
            <strong>{target?.label ?? ''}</strong>
          </p>
          <div className="warp__meter">
            <span ref={meterRef} className="warp__meter-fill" />
          </div>
          <p className="warp__readout">
            <span ref={percentRef}>0%</span>
            <span className="warp__readout-label">WARP</span>
          </p>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {target ? `正在前往${target.label}` : ''}
      </p>
    </>
  )
}
