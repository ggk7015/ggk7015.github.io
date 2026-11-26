import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const read = (file) => readFile(new URL(file, root), 'utf8')

test('eight unique planetary themes each contain three labelled satellites', async () => {
  const source = await read('src/data/solar.ts')
  const blocks = [...source.matchAll(/id:\s*'([^']+)',\s*planet:\s*'([^']+)'[\s\S]*?satellites:\s*\[([\s\S]*?)\n\s*\],/g)]
  assert.equal(blocks.length, 8)
  assert.equal(new Set(blocks.map((block) => block[1])).size, 8)
  for (const [, id, , satellites] of blocks) {
    assert.equal([...satellites.matchAll(/\{\s*label:/g)].length, 3, `${id} should have three satellites`)
  }
})

test('3D scene definitions and content remain in the same planetary order', async () => {
  const [data, scene] = await Promise.all([read('src/data/solar.ts'), read('src/components/SolarSystemScene.tsx')])
  const ids = [...data.matchAll(/id:\s*'([^']+)',\s*planet:/g)].map((match) => match[1])
  assert.deepEqual(ids, ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'])
  const definitions = scene.match(/const PLANETS: PlanetDefinition\[\] = \[([\s\S]*?)\n\]/)?.[1]
  assert.ok(definitions)
  assert.equal([...definitions.matchAll(/\{\s*radius:/g)].length, ids.length)
})

test('3D experience retains a DOM selector, graceful fallback, and cleanup', async () => {
  const [app, scene, boundary] = await Promise.all([
    read('src/components/SolarSystem.tsx'),
    read('src/components/SolarSystemScene.tsx'),
    read('src/components/SolarSceneBoundary.tsx'),
  ])
  assert.match(app, /aria-label="選擇星球主題"/)
  assert.match(app, /aria-pressed=\{selected === index\}/)
  assert.match(app, /disabled=\{selected === null\}/)
  assert.doesNotMatch(app, /aria-disabled=\{selected === null\}/)
  assert.match(app, /<SolarSceneBoundary>/)
  assert.match(boundary, /role="alert"/)
  assert.match(scene, /intersectionObserver\?\.disconnect\(\)/)
  assert.match(scene, /controls\.dispose\(\)/)
  assert.match(scene, /星圖視角旋轉控制/)
  assert.match(scene, /controls\.rotateLeft\(azimuth\)/)
  assert.match(scene, /controls\.rotateUp\(elevation\)/)
  assert.match(scene, /renderer\.dispose\(\)/)
  assert.match(scene, /SOLAR_PLANETS\[index\]\.satellites\.length/)
})
