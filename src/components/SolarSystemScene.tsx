import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { SOLAR_PLANETS } from '../data/solar'

type SolarSystemSceneProps = {
  selected: number | null
  onSelect: (index: number | null) => void
  reducedMotion: boolean
}

type PlanetDefinition = {
  radius: number
  orbit: number
  eccentricity: number
  color: number
  accent: number
  phase: number
  speed: number
  tilt: number
}

// Decorative, rather than scientific, scale keeps every world visible.
const PLANETS: PlanetDefinition[] = [
  { radius: 0.22, orbit: 2.35, eccentricity: 0.88, color: 0xa5b5bd, accent: 0xe2d4bd, phase: 0.5, speed: 0.24, tilt: 0.12 },
  { radius: 0.32, orbit: 3.15, eccentricity: 0.91, color: 0xe7b774, accent: 0xffe2a2, phase: 2.6, speed: 0.18, tilt: -0.08 },
  { radius: 0.35, orbit: 4.05, eccentricity: 0.9, color: 0x287d9c, accent: 0x8bd4b4, phase: 4.5, speed: 0.14, tilt: 0.17 },
  { radius: 0.27, orbit: 4.95, eccentricity: 0.86, color: 0xbd6b4e, accent: 0xf3b884, phase: 1.65, speed: 0.11, tilt: -0.14 },
  { radius: 0.58, orbit: 6.1, eccentricity: 0.91, color: 0xc99472, accent: 0xf1d5a8, phase: 3.35, speed: 0.075, tilt: 0.08 },
  { radius: 0.5, orbit: 7.45, eccentricity: 0.88, color: 0xd8ba79, accent: 0xf8e6b7, phase: 5.55, speed: 0.055, tilt: 0.25 },
  { radius: 0.41, orbit: 8.7, eccentricity: 0.9, color: 0x7fc5c1, accent: 0xc5ece1, phase: 2.15, speed: 0.04, tilt: -0.2 },
  { radius: 0.39, orbit: 9.8, eccentricity: 0.87, color: 0x3e78ae, accent: 0x8dc9da, phase: 4.15, speed: 0.032, tilt: 0.13 },
]

const TAU = Math.PI * 2

export default function SolarSystemScene({ selected, onSelect, reducedMotion }: SolarSystemSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onSelectRef = useRef(onSelect)
  const selectedRef = useRef(selected)
  const reducedMotionRef = useRef(reducedMotion)
  const invalidateRef = useRef<() => void>(() => {})
  const [status, setStatus] = useState<string | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  useEffect(() => { onSelectRef.current = onSelect }, [onSelect])
  useEffect(() => {
    selectedRef.current = selected
    invalidateRef.current()
  }, [selected])
  useEffect(() => {
    reducedMotionRef.current = reducedMotion
    invalidateRef.current()
  }, [reducedMotion])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' })
    } catch {
      const timer = window.setTimeout(() => setStatus('無法啟用 3D 畫面，請使用頁面上的其他操作方式。'), 0)
      return () => window.clearTimeout(timer)
    }

    const canvas = renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    container.appendChild(canvas)
    renderer.setClearColor(0x061321)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x061321)
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 250)
    camera.position.set(0, 11, 20.3)
    // Register before OrbitControls so a second touch cannot become a tap selection.
    const activePointers = new Set<number>()
    let pointerStart: { id: number; x: number; y: number; maxDistance: number } | null = null
    const onPointerDown = (event: PointerEvent) => {
      activePointers.add(event.pointerId)
      if (activePointers.size > 1) {
        pointerStart = null
        return
      }
      if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return
      pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, maxDistance: 0 }
    }
    canvas.addEventListener('pointerdown', onPointerDown)
    const controls = new OrbitControls(camera, canvas)
    // OrbitControls overwrites touch-action in its constructor.
    canvas.style.touchAction = 'pan-y'
    controls.touches.ONE = null
    controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE
    controls.enableDamping = false
    controls.enablePan = false
    controls.minDistance = 13
    controls.maxDistance = 160
    controls.minPolarAngle = 0.12
    controls.maxPolarAngle = Math.PI - 0.12
    controls.rotateSpeed = 0.65
    controls.zoomSpeed = 0.8
    controls.update()
    controlsRef.current = controls

    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const geometry = <T extends THREE.BufferGeometry>(item: T): T => { geometries.add(item); return item }
    const material = <T extends THREE.Material>(item: T): T => { materials.add(item); return item }
    const sphere = geometry(new THREE.SphereGeometry(1, 32, 20))
    const moonSphere = geometry(new THREE.SphereGeometry(1, 12, 8))
    const sceneObjects: THREE.Object3D[] = []
    const hitTargets: THREE.Object3D[] = []
    const planetStates: { group: THREE.Group; body: THREE.Mesh; halo: THREE.Mesh; moons: THREE.Group[]; definition: PlanetDefinition }[] = []

    scene.add(new THREE.AmbientLight(0x96c7da, 0.75))
    const sunlight = new THREE.PointLight(0xffdda0, 65, 32, 1.4)
    scene.add(sunlight)
    const fillLight = new THREE.DirectionalLight(0x82c5d5, 0.45)
    fillLight.position.set(-8, 12, 8)
    scene.add(fillLight)

    const sun = new THREE.Mesh(sphere, material(new THREE.MeshBasicMaterial({ color: 0xffd17b })))
    sun.scale.setScalar(1.05)
    sun.userData.selection = null
    scene.add(sun)
    sceneObjects.push(sun)
    const addHitTarget = (parent: THREE.Object3D, radius: number, color: number, selection: number | null) => {
      const target = new THREE.Mesh(sphere, material(new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false, colorWrite: false })))
      target.scale.setScalar(radius)
      target.userData.selection = selection
      parent.add(target)
      hitTargets.push(target)
    }
    addHitTarget(scene, 1.4, 0xffd17b, null)
    const sunGlow = new THREE.Mesh(sphere, material(new THREE.MeshBasicMaterial({ color: 0xf8a946, transparent: true, opacity: 0.1, side: THREE.BackSide, depthWrite: false })))
    sunGlow.scale.setScalar(1.48)
    scene.add(sunGlow)
    const sunCorona = new THREE.Mesh(sphere, material(new THREE.MeshBasicMaterial({ color: 0xffd489, transparent: true, opacity: 0.055, side: THREE.BackSide, depthWrite: false })))
    sunCorona.scale.setScalar(1.85)
    scene.add(sunCorona)

    // Deterministic star positions avoid texture downloads and visual changes on rerender.
    let seed = 142857
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    const starPositions = new Float32Array(900 * 3)
    const starColors = new Float32Array(900 * 3)
    const starColor = new THREE.Color()
    for (let i = 0; i < 900; i += 1) {
      const y = random() * 2 - 1
      const angle = random() * TAU
      const distance = 40 + random() * 32
      const ring = Math.sqrt(1 - y * y)
      starPositions[i * 3] = Math.cos(angle) * ring * distance
      starPositions[i * 3 + 1] = y * distance
      starPositions[i * 3 + 2] = Math.sin(angle) * ring * distance
      starColor.setHSL(random() > 0.8 ? 0.12 : 0.53, 0.35, 0.55 + random() * 0.4)
      starColors[i * 3] = starColor.r
      starColors[i * 3 + 1] = starColor.g
      starColors[i * 3 + 2] = starColor.b
    }
    const starsGeometry = geometry(new THREE.BufferGeometry())
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
    scene.add(new THREE.Points(starsGeometry, material(new THREE.PointsMaterial({ size: 0.105, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false }))))

    PLANETS.forEach((definition, index) => {
      const orbitPoints: THREE.Vector3[] = []
      for (let i = 0; i <= 192; i += 1) {
        const angle = (i / 192) * TAU
        orbitPoints.push(new THREE.Vector3(Math.cos(angle) * definition.orbit, 0, Math.sin(angle) * definition.orbit * definition.eccentricity))
      }
      const orbit = new THREE.Line(geometry(new THREE.BufferGeometry().setFromPoints(orbitPoints)), material(new THREE.LineBasicMaterial({ color: index % 2 ? 0x4c9b9d : 0x9d9166, transparent: true, opacity: 0.3 })))
      scene.add(orbit)

      const group = new THREE.Group()
      scene.add(group)
      const body = new THREE.Mesh(sphere, material(new THREE.MeshStandardMaterial({ color: definition.color, roughness: 0.82, metalness: 0.05 })))
      body.scale.setScalar(definition.radius)
      body.rotation.z = definition.tilt
      body.userData.selection = index
      group.add(body)
      sceneObjects.push(body)
      addHitTarget(group, Math.max(definition.radius * 1.8, 0.48), definition.color, index)

      // A translucent equatorial band adds a distinct, texture-free surface accent.
      const band = new THREE.Mesh(geometry(new THREE.SphereGeometry(1.005, 32, 8, 0, TAU, Math.PI * 0.35, Math.PI * 0.13)), material(new THREE.MeshStandardMaterial({ color: definition.accent, transparent: true, opacity: index === 4 ? 0.55 : 0.25, roughness: 1, depthWrite: false })))
      body.add(band)
      const halo = new THREE.Mesh(geometry(new THREE.RingGeometry(definition.radius * 1.35, definition.radius * 1.47, 48)), material(new THREE.MeshBasicMaterial({ color: 0x9ce8d8, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false })))
      halo.rotation.x = -Math.PI / 2
      halo.visible = false
      group.add(halo)

      if (index === 5) {
        const saturnRing = new THREE.Mesh(geometry(new THREE.RingGeometry(definition.radius * 1.35, definition.radius * 2.15, 64)), material(new THREE.MeshStandardMaterial({ color: 0xe8cd91, side: THREE.DoubleSide, transparent: true, opacity: 0.72, roughness: 1, depthWrite: false })))
        saturnRing.rotation.set(-Math.PI / 2, 0.15, 0.2)
        saturnRing.userData.selection = index
        group.add(saturnRing)
        sceneObjects.push(saturnRing)
      }

      const moons: THREE.Group[] = []
      for (let moonIndex = 0; moonIndex < SOLAR_PLANETS[index].satellites.length; moonIndex += 1) {
        const moonOrbit = new THREE.Group()
        moonOrbit.rotation.y = (moonIndex / SOLAR_PLANETS[index].satellites.length) * TAU + index * 0.7
        moonOrbit.rotation.z = 0.2 + moonIndex * 0.17
        const moon = new THREE.Mesh(moonSphere, material(new THREE.MeshStandardMaterial({ color: moonIndex % 2 ? 0xd5c59e : 0xaac8c6, roughness: 1 })))
        moon.scale.setScalar(Math.max(0.045, definition.radius * 0.16))
        moon.position.x = definition.radius * (index === 5 ? 2.65 + moonIndex * 0.48 : 1.8 + moonIndex * 0.58)
        moon.userData.selection = index
        moonOrbit.add(moon)
        sceneObjects.push(moon)
        addHitTarget(moon, 1.7, definition.accent, index)
        group.add(moonOrbit)
        moons.push(moonOrbit)
      }
      planetStates.push({ group, body, halo, moons, definition })
    })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let frame = 0
    let elapsed = 0
    let previousTime: number | null = null
    let contextLost = false
    let disposed = false
    let inViewport = false
    let userZoomed = false
    let fittingCamera = false
    let lastFitDistance = 0
    let lastCameraDistance = camera.position.distanceTo(controls.target)
    let width = 0
    let height = 0

    const canRender = () => !disposed && !contextLost && inViewport && !document.hidden && width > 0 && height > 0
    const pause = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      previousTime = null
    }
    const render = (time: number) => {
      frame = 0
      if (!canRender()) {
        previousTime = null
        return
      }
      if (!reducedMotionRef.current && previousTime !== null) elapsed += Math.min((time - previousTime) / 1000, 0.05)
      previousTime = reducedMotionRef.current ? null : time
      planetStates.forEach(({ group, body, halo, moons, definition }, index) => {
        const angle = definition.phase + elapsed * definition.speed
        group.position.set(Math.cos(angle) * definition.orbit, 0, Math.sin(angle) * definition.orbit * definition.eccentricity)
        body.rotation.y = elapsed * 0.12
        halo.visible = selectedRef.current === index
        moons.forEach((moon, moonIndex) => { moon.rotation.y = (moonIndex / moons.length) * TAU + index * 0.7 + elapsed * (0.45 + moonIndex * 0.13) })
      })
      sunGlow.scale.setScalar(1.48 + Math.sin(elapsed * 1.2) * 0.035)
      renderer.render(scene, camera)
      if (!reducedMotionRef.current && canRender()) frame = requestAnimationFrame(render)
    }
    const invalidate = () => {
      if (!frame && canRender()) frame = requestAnimationFrame(render)
    }
    invalidateRef.current = invalidate
    const resize = () => {
      const rect = container.getBoundingClientRect()
      width = Math.max(0, Math.floor(rect.width))
      height = Math.max(0, Math.floor(rect.height))
      if (!width || !height) {
        pause()
        return
      }
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      // A bounding sphere around the outermost orbit fits at every orbit angle.
      // Preserve an intentional zoom while still reframing on aspect changes.
      const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov / 2)
      const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * camera.aspect)
      const fitDistance = Math.max(23.1, 10.45 / Math.sin(Math.min(verticalHalfFov, horizontalHalfFov)))
      const currentDistance = camera.position.distanceTo(controls.target)
      const zoomFactor = userZoomed && lastFitDistance ? currentDistance / lastFitDistance : 1
      controls.maxDistance = Math.max(160, fitDistance * 1.25)
      const distance = Math.min(controls.maxDistance, Math.max(controls.minDistance, fitDistance * zoomFactor))
      fittingCamera = true
      camera.position.sub(controls.target).setLength(distance).add(controls.target)
      controls.update()
      fittingCamera = false
      lastFitDistance = fitDistance
      lastCameraDistance = camera.position.distanceTo(controls.target)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setSize(width, height, false)
      invalidate()
    }
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(resize)
    observer?.observe(container)
    let viewportFallbackCleanup = () => {}
    const intersectionObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((entries) => {
      const entry = entries.find((item) => item.target === container)
      if (!entry) return
      inViewport = entry.isIntersecting && entry.intersectionRatio > 0
      if (inViewport) invalidate()
      else pause()
    })
    if (intersectionObserver) intersectionObserver.observe(container)
    else {
      const updateViewportFallback = () => {
        const rect = container.getBoundingClientRect()
        inViewport = rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth
        if (inViewport) invalidate()
        else pause()
      }
      window.addEventListener('scroll', updateViewportFallback, { passive: true })
      window.addEventListener('resize', updateViewportFallback)
      viewportFallbackCleanup = () => {
        window.removeEventListener('scroll', updateViewportFallback)
        window.removeEventListener('resize', updateViewportFallback)
      }
      updateViewportFallback()
    }
    const onVisibilityChange = () => {
      if (document.hidden) pause()
      else invalidate()
    }
    const onControlsChange = () => {
      if (!fittingCamera) {
        const distance = camera.position.distanceTo(controls.target)
        if (lastFitDistance && Math.abs(distance - lastCameraDistance) > 0.01) userZoomed = true
        lastCameraDistance = distance
      }
      invalidate()
    }
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibilityChange)
    controls.addEventListener('change', onControlsChange)

    const onPointerMove = (event: PointerEvent) => {
      if (!pointerStart || pointerStart.id !== event.pointerId) return
      pointerStart.maxDistance = Math.max(pointerStart.maxDistance, Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y))
    }
    const onPointerUp = (event: PointerEvent) => {
      const start = pointerStart
      activePointers.delete(event.pointerId)
      pointerStart = null
      if (!start || start.id !== event.pointerId || start.maxDistance > 6 || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 6 || !canRender()) return
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1)
      scene.updateMatrixWorld(true)
      camera.updateMatrixWorld()
      raycaster.setFromCamera(pointer, camera)
      // Real visible surfaces win over enlarged targets, then the nearest projected
      // target center wins. This prevents a large invisible sphere hiding a neighbor.
      const surfaceHit = raycaster.intersectObjects(sceneObjects, false)[0]
      const targetHits = raycaster.intersectObjects(hitTargets, false)
      const worldPosition = new THREE.Vector3()
      let closestTarget: THREE.Intersection | undefined
      let closestDistance = Infinity
      for (const targetHit of targetHits) {
        targetHit.object.getWorldPosition(worldPosition).project(camera)
        const distance = Math.hypot((worldPosition.x - pointer.x) * rect.width, (worldPosition.y - pointer.y) * rect.height)
        if (distance < closestDistance) {
          closestDistance = distance
          closestTarget = targetHit
        }
      }
      const hit = surfaceHit ?? closestTarget
      if (hit) onSelectRef.current(hit.object.userData.selection as number | null)
    }
    const onPointerCancel = (event: PointerEvent) => {
      activePointers.delete(event.pointerId)
      pointerStart = null
    }
    const onContextLost = (event: Event) => {
      event.preventDefault()
      contextLost = true
      pause()
      activePointers.clear()
      pointerStart = null
      controls.enabled = false
      setStatus('3D 畫面暫時中斷，正在等待顯示裝置恢復。')
    }
    const onContextRestored = () => {
      contextLost = false
      previousTime = null
      controls.enabled = true
      setStatus(null)
      resize()
      invalidate()
    }
    document.addEventListener('pointermove', onPointerMove, true)
    document.addEventListener('pointerup', onPointerUp, true)
    document.addEventListener('pointercancel', onPointerCancel, true)
    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)
    resize()

    return () => {
      disposed = true
      invalidateRef.current = () => {}
      pause()
      observer?.disconnect()
      intersectionObserver?.disconnect()
      viewportFallbackCleanup()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      controls.removeEventListener('change', onControlsChange)
      controls.dispose()
      controlsRef.current = null
      canvas.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointermove', onPointerMove, true)
      document.removeEventListener('pointerup', onPointerUp, true)
      document.removeEventListener('pointercancel', onPointerCancel, true)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      geometries.forEach((item) => item.dispose())
      materials.forEach((item) => item.dispose())
      renderer.dispose()
      if (!contextLost) renderer.forceContextLoss()
      canvas.remove()
    }
  }, [])

  const rotateView = (azimuth: number, elevation: number) => {
    const controls = controlsRef.current
    if (!controls) return
    controls.rotateLeft(azimuth)
    controls.rotateUp(elevation)
    controls.update()
  }

  return (
    <div className="solar-scene" ref={containerRef}>
      <div className="solar-scene__view-controls" role="group" aria-label="星圖視角旋轉控制">
        <button type="button" aria-label="視角向左旋轉" onClick={() => rotateView(0.22, 0)}>←</button>
        <button type="button" aria-label="視角向上旋轉" onClick={() => rotateView(0, 0.16)}>↑</button>
        <button type="button" aria-label="視角向下旋轉" onClick={() => rotateView(0, -0.16)}>↓</button>
        <button type="button" aria-label="視角向右旋轉" onClick={() => rotateView(-0.22, 0)}>→</button>
        <button type="button" aria-label="重設星圖視角" onClick={() => controlsRef.current?.reset()}>重設視角</button>
      </div>
      {status && <p className="solar-scene__status" role="alert">{status}</p>}
    </div>
  )
}
