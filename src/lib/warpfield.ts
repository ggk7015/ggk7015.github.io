type WarpOptions = {
  duration?: number
  onProgress?: (progress: number) => void
  onDone?: () => void
}

type Star = {
  angle: number
  radius: number
  previous: number
  speed: number
  width: number
}

const TAU = Math.PI * 2

function parseRgb(value: string, fallback: [number, number, number]): [number, number, number] {
  const match = value.match(/(\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)[^\d]+(\d+(?:\.\d+)?)/)
  if (!match) return fallback
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

/**
 * Hyperspace tunnel used while travelling between sections: stars stretch
 * outward from the centre, the trail is built by painting translucent frames.
 * Everything is theme-aware and stops cleanly when the overlay unmounts.
 */
export function runWarp(canvas: HTMLCanvasElement, options: WarpOptions = {}) {
  const { duration = 900, onProgress, onDone } = options
  const context = canvas.getContext('2d')
  if (!context) return { stop: () => {} }
  const ctx: CanvasRenderingContext2D = context

  const styles = getComputedStyle(canvas)
  const star = parseRgb(styles.color, [232, 220, 194])
  const voidColor = parseRgb(getComputedStyle(document.body).backgroundColor, [11, 20, 24])
  const starPaint = (alpha: number) => `rgba(${star[0]},${star[1]},${star[2]},${alpha})`
  const voidPaint = (alpha: number) => `rgba(${voidColor[0]},${voidColor[1]},${voidColor[2]},${alpha})`

  const stars: Star[] = []
  let width = 1
  let height = 1
  let radiusLimit = 1
  let raf = 0
  let started = 0
  let lastFrame = 0
  let stopped = false

  function seed() {
    const count = Math.min(340, Math.max(150, Math.round((width * height) / 4200)))
    stars.length = 0
    for (let i = 0; i < count; i += 1) {
      const radius = 0.02 + Math.random() * 0.28
      stars.push({
        angle: Math.random() * TAU,
        radius,
        previous: radius,
        speed: 0.55 + Math.random() * 1.1,
        width: 0.6 + Math.random() * 1.1,
      })
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = Math.max(1, Math.round(rect.width))
    height = Math.max(1, Math.round(rect.height))
    canvas.width = Math.round(width * dpr)
    canvas.height = Math.round(height * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    radiusLimit = Math.hypot(width, height) / 2
    seed()
  }

  function frame(now: number) {
    if (stopped) return
    if (!started) started = now
    const elapsed = now - started
    const progress = Math.min(1, elapsed / duration)
    onProgress?.(progress)

    const cx = width / 2
    const cy = height / 2
    const dt = Math.min(48, now - (lastFrame || now))
    lastFrame = now

    // Long trails early, a clean field at the start so the page disappears.
    ctx.fillStyle = voidPaint(elapsed < 90 ? 1 : 0.24)
    ctx.fillRect(0, 0, width, height)

    const speed = (0.00042 + 0.0024 * progress * progress) * dt

    ctx.lineCap = 'round'
    for (const item of stars) {
      item.previous = item.radius
      item.radius += speed * item.speed
      if (item.radius > 1.12) {
        item.radius = 0.02 + Math.random() * 0.12
        item.previous = item.radius
      }
      const inner = item.previous * radiusLimit
      const outer = item.radius * radiusLimit
      const cos = Math.cos(item.angle)
      const sin = Math.sin(item.angle)
      const alpha = Math.min(1, item.radius * 1.6) * (0.3 + 0.7 * progress)
      ctx.strokeStyle = starPaint(alpha)
      ctx.lineWidth = item.width + progress * 0.9
      ctx.beginPath()
      ctx.moveTo(cx + cos * inner, cy + sin * inner)
      ctx.lineTo(cx + cos * outer, cy + sin * outer)
      ctx.stroke()
    }

    // A warm bloom at the tunnel mouth.
    const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80 + progress * 260)
    bloom.addColorStop(0, starPaint(0.22 * (1 - progress * 0.6)))
    bloom.addColorStop(1, starPaint(0))
    ctx.fillStyle = bloom
    ctx.fillRect(0, 0, width, height)

    if (progress < 1) {
      raf = requestAnimationFrame(frame)
      return
    }

    ctx.fillStyle = voidPaint(1)
    ctx.fillRect(0, 0, width, height)
    onDone?.()
  }

  resize()
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(frame)

  return {
    stop() {
      stopped = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    },
  }
}
