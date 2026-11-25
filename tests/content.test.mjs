import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

test('all no-JavaScript fallback project links match portfolio data', async () => {
  const [html, profile] = await Promise.all([read('index.html'), read('src/data/profile.ts')])
  const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1]
  assert.ok(fallback, 'expected a noscript fallback')
  const projectUrls = [...profile.matchAll(/href:\s*'(https:\/\/github\.com\/ggk7015\/[^']+)'/g)]
    .map((match) => match[1])
  assert.equal(projectUrls.length, 5)
  for (const url of projectUrls) assert.ok(fallback.includes(`href="${url}"`), `missing ${url}`)
})

test('mobile navigation and reduced-motion support remain present', async () => {
  const [css, header] = await Promise.all([read('src/index.css'), read('src/components/SiteHeader.tsx')])
  assert.match(css, /@media\s*\(max-width:\s*900px\)[\s\S]*?\.constellation\s*\{\s*display:\s*flex/)
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/)
  assert.match(header, /aria-label="主要導覽"/)
})