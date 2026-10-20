/**
 * Ambient constellation field.
 *
 * One canvas, two populations: drifting stars that give the page depth, and a
 * small set of fixed nodes wired into a constellation. A few nodes are planets —
 * they carry a ring and a slow bloom, which is the only "character" in the
 * scene. Everything is drawn with cached radial-gradient sprites so a frame is
 * a handful of `drawImage` calls rather than a stack of blur filters.
 *
 * The field is decorative: it never receives pointer events, and under
 * `prefers-reduced-motion` it paints exactly one static frame.
 */

type Star = {
  x: number
  y: number
  r: number
  depth: number
  phase: number
  speed: number
}

type Node = {
  x: number
  y: number
  r: number
  phase: number
  planet: boolean
}

const TAU = Math.PI * 2

const NODE_POINTS: ReadonlyArray<readonly [number, number, boolean]> = [
  [0.13, 0.18, false],
  [0.27, 0.1, true],
  [0.41, 0.24, false],
  [0.56, 0.13, false],
  [0.69, 0.22, true],
  [0.83, 0.11, false],
  [0.9, 0.36, false],
  [0.74, 0.44, true],
  [0.55, 0.5, false],
  [0.32, 0.44, false],
  [0.17, 0.62, false],
  [0.47, 0.72, false],
  [0.68, 0.68, false],
]

const EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [4, 7],
  [7, 8],
  [8, 9],
  [9, 0],
  [2, 9],
  [7, 12],
  [12, 11],
  [11, 10],
  [10, 9],
  [12, 8],
]

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function rgbOf(input: string, fallback: [number, number, number]): [number, number, number] {
  const parts = input.match(/\d+(\.\d+)?/g)
  if (!parts || parts.length < 3) return fallback
  return [Number(parts[0]), Number(parts[1]), Number(parts[2])]
}

function glowSprite(rgb: [number, number, number], peak: number): HTMLCanvasElement {
  const size = 96
  const sprite = document.createElement('canvas')
  sprite.width = size
  sprite.height = size
  const g = sprite.getContext('2d')
  if (!g) return sprite

  const half = size / 2
  const grad = g.createRadialGradient(half, half, 0, half, half, half)
  const [r, gr, b] = rgb
  grad.addColorStop(0, `rgba(${r},${gr},${b},${peak})`)
  grad.addColorStop(0.32, `rgba(${r},${gr},${b},${peak * 0.4})`)
  grad.addColorStop(1, `rgba(${r},${gr},${b},0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return sprite
}

export interface GalaxyOptions {
  /** Paint one static frame and attach no animation loop. */
  calm?: boolean
}

export function mountGalaxy(
  canvas: HTMLCanvasElement,
  { calm = false }: GalaxyOptions = {},
): () => void {
  const context = canvas.getContext('2d')
  if (!context) return () => {}
  const ctx: CanvasRenderingContext2D = context

  const random = mulberry32(0x5eed5743)
  const stars: Star[] = []
  const nodes: Node[] = NODE_POINTS.map(([x, y, planet]) => ({
    x,
    y,
    r: planet ? 3.2 : 1.5,
    phase: random() * TAU,
    planet,
  }))

  let width = 1
  let height = 1
  let starRgb: [number, number, number] = [226, 236, 252]
  let planetRgb: [number, number, number] = [95, 240, 210]
  let starSprite = glowSprite(starRgb, 0.5)
  let planetSprite = glowSprite(planetRgb, 0.6)

  let raf = 0
  let last = 0
  let scrollShift = 0
  let disposed = false
  let started = 0

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

  const starFill = () => `rgba(${starRgb[0]},${starRgb[1]},${starRgb[2]},0.92)`
  const lineFill = (a: number) => `rgba(${starRgb[0]},${starRgb[1]},${starRgb[2]},${a})`
  const planetFill = (a: number) => `rgba(${planetRgb[0]},${planetRgb[1]},${planetRgb[2]},${a})`

  function readColors() {
    const styles = getComputedStyle(canvas)
    starRgb = rgbOf(styles.color, starRgb)
    planetRgb = rgbOf(
      getComputedStyle(document.documentElement).getPropertyValue('--accent'),
      planetRgb,
    )
    starSprite = glowSprite(starRgb, 0.5)
    planetSprite = glowSprite(planetRgb, 0.6)
  }

  function seedStars() {
    stars.length = 0
    const density = width < 720 ? 5200 : 7400
    const count = Math.min(240, Math.max(64, Math.round((width * height) / density)))
    for (let i = 0; i < count; i += 1) {
      const depth = 0.35 + random() * 0.95
      stars.push({
        x: random(),
        y: random(),
        r: 0.3 + random() * (depth > 1 ? 1.3 : 0.9),
        depth,
        phase: random() * TAU,
        speed: 0.2 + random() * 0.8,
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
    seedStars()
    if (calm) paint(0)
  }

  function paint(now: number) {
    const t = calm ? 12 : (now - started) / 1000
    const drift = calm ? 0 : 1
    const offsetX = pointer.x * 14 * drift
    const offsetY = (pointer.y * 14 + scrollShift * 0.06) * drift

    ctx.clearRect(0, 0, width, height)

    // Constellation hairlines sit under the star field so they read as distance.
    ctx.lineWidth = 0.7
    ctx.strokeStyle = lineFill(0.085)
    for (const [a, b] of EDGES) {
      const na = nodes[a]
      const nb = nodes[b]
      if (!na || !nb) continue
      ctx.beginPath()
      ctx.moveTo(na.x * width + offsetX, na.y * height + offsetY)
      ctx.lineTo(nb.x * width + offsetX, nb.y * height + offsetY)
      ctx.stroke()
    }

    ctx.fillStyle = starFill()
    for (const s of stars) {
      const x = s.x * width + offsetX * s.depth
      const y = s.y * height + offsetY * s.depth
      const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase))
      ctx.globalAlpha = twinkle * 0.85
      ctx.beginPath()
      ctx.arc(x, y, s.r, 0, TAU)
      ctx.fill()
    }

    for (const n of nodes) {
      const x = n.x * width + offsetX
      const y = n.y * height + offsetY
      const pulse = 0.65 + 0.35 * Math.sin(t * 0.45 + n.phase)

      if (n.planet) {
        const halo = 118 * (0.82 + 0.18 * pulse)
        ctx.globalAlpha = 0.6 * pulse
        ctx.drawImage(planetSprite, x - halo / 2, y - halo / 2, halo, halo)

        ctx.globalAlpha = 0.3 * pulse
        ctx.strokeStyle = planetFill(0.55)
        ctx.lineWidth = 0.9
        ctx.beginPath()
        ctx.ellipse(x, y, n.r * 3.2, n.r * 1.1, -0.42, 0, TAU)
        ctx.stroke()

        ctx.globalAlpha = 0.95
        ctx.fillStyle = planetFill(0.92)
        ctx.beginPath()
        ctx.arc(x, y, n.r * 0.8, 0, TAU)
        ctx.fill()
      } else {
        ctx.globalAlpha = 0.3 + 0.3 * pulse
        ctx.drawImage(starSprite, x - 20, y - 20, 40, 40)
        ctx.globalAlpha = 0.9
        ctx.fillStyle = starFill()
        ctx.beginPath()
        ctx.arc(x, y, n.r, 0, TAU)
        ctx.fill()
      }
    }

    ctx.globalAlpha = 1
  }

  function loop(now: number) {
    if (disposed) return
    raf = window.requestAnimationFrame(loop)
    // Coalesce to ~60fps on high-refresh displays: the scene is ambient, extra
    // frames buy nothing and cost battery.
    if (now - last < 15) return
    last = now
    pointer.x += (pointer.tx - pointer.x) * 0.045
    pointer.y += (pointer.ty - pointer.y) * 0.045
    scrollShift = window.scrollY
    paint(now)
  }

  function start() {
    if (calm || disposed || raf) return
    started = performance.now() - 12000
    last = 0
    raf = window.requestAnimationFrame(loop)
  }

  function stop() {
    if (!raf) return
    window.cancelAnimationFrame(raf)
    raf = 0
  }

  const onPointerMove = (event: PointerEvent) => {
    pointer.tx = (event.clientX / window.innerWidth) * 2 - 1
    pointer.ty = (event.clientY / window.innerHeight) * 2 - 1
  }

  const onVisibility = () => {
    if (document.hidden) stop()
    else start()
  }

  const onResize = () => resize()

  readColors()
  resize()

  if (calm) {
    paint(0)
  } else {
    start()
    window.addEventListener('pointermove', onPointerMove, { passive: true })
  }

  const resizeObserver = new ResizeObserver(onResize)
  resizeObserver.observe(canvas)
  document.addEventListener('visibilitychange', onVisibility)

  const themeObserver = new MutationObserver(() => {
    readColors()
    if (calm) paint(0)
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })

  return () => {
    disposed = true
    stop()
    resizeObserver.disconnect()
    themeObserver.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pointermove', onPointerMove)
  }
}
