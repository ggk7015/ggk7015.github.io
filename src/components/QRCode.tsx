import { useEffect, useRef, useState } from 'react'
import QrCreator from 'qr-creator'

const QUIET = 4
const SCALE = 3

function moduleMatrix(text: string): boolean[][] {
  let modules = 0
  for (let version = 1; version <= 40; version += 1) {
    try {
      QrCreator.render(
        {
          text,
          ecLevel: 'M',
          minVersion: version,
          maxVersion: version,
          size: 200,
          fill: '#000000',
          background: '#ffffff',
          radius: 0,
          quiet: 0,
        },
        document.createElement('canvas'),
      )
      modules = 4 * version + 17
      break
    } catch {
      // version too small for this payload, try the next one
    }
  }
  if (!modules) return []

  const total = modules + QUIET * 2
  const canvas = document.createElement('canvas')
  canvas.width = total * SCALE
  canvas.height = total * SCALE
  QrCreator.render(
    {
      text,
      ecLevel: 'M',
      minVersion: 1,
      maxVersion: 40,
      size: total * SCALE,
      fill: '#000000',
      background: '#ffffff',
      radius: 0,
      quiet: QUIET,
    },
    canvas,
  )

  const ctx = canvas.getContext('2d')
  if (!ctx) return []
  const cell = canvas.width / total
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const rows: boolean[][] = []
  for (let row = 0; row < modules; row += 1) {
    const line: boolean[] = []
    const y = Math.floor((QUIET + row + 0.5) * cell)
    for (let col = 0; col < modules; col += 1) {
      const x = Math.floor((QUIET + col + 0.5) * cell)
      line.push(data[(y * canvas.width + x) * 4] < 128)
    }
    rows.push(line)
  }
  return rows
}

function toSvg(matrix: boolean[][]): string {
  const size = matrix.length
  const span = size + QUIET * 2
  const segments: string[] = []
  for (let row = 0; row < size; row += 1) {
    let col = 0
    while (col < size) {
      if (!matrix[row][col]) {
        col += 1
        continue
      }
      let run = 1
      while (col + run < size && matrix[row][col + run]) run += 1
      segments.push(`M${col + QUIET} ${row + QUIET}h${run}v1h-${run}z`)
      col += run
    }
  }
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${span} ${span}" width="512" height="512" shape-rendering="crispEdges">`,
    `<rect width="${span}" height="${span}" fill="#ffffff"/>`,
    `<path fill="#000000" d="${segments.join('')}"/>`,
    '</svg>',
  ].join('\n')
}

function download(source: BlobPart, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([source], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

interface Props {
  value: string
  size?: number
}

export default function QRCode({ value, size = 168 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const svg = useRef<string>('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const total = size * SCALE
    QrCreator.render(
      {
        text: value,
        ecLevel: 'M',
        minVersion: 1,
        maxVersion: 40,
        size: total,
        fill: '#000000',
        background: '#ffffff',
        radius: 0,
        quiet: QUIET,
      },
      canvas,
    )
    svg.current = toSvg(moduleMatrix(value))
    setReady(true)
  }, [value, size])

  const host = new URL(value).hostname.replace(/[^a-z0-9.-]/gi, '-')

  return (
    <div className="qr">
      <div className="qr__frame">
        <canvas
          ref={ref}
          className="qr__code"
          style={{ width: size, height: size }}
          role="img"
          aria-label={`QR 碼，內容為 ${value}`}
          data-qr-value={value}
        />
      </div>
      <code className="qr__value">{value.replace(/^https?:\/\//, '')}</code>
      <div className="qr__actions">
        <button
          type="button"
          className="qr__download"
          disabled={!ready}
          onClick={() => download(svg.current, `ggk5743-qr-${host}.svg`, 'image/svg+xml;charset=utf-8')}
        >
          下載 SVG
        </button>
        <button
          type="button"
          className="qr__download"
          disabled={!ready}
          onClick={() => {
            const canvas = document.createElement('canvas')
            canvas.width = 1200
            canvas.height = 1200
            QrCreator.render(
              {
                text: value,
                ecLevel: 'M',
                minVersion: 1,
                maxVersion: 40,
                size: 1200,
                fill: '#000000',
                background: '#ffffff',
                radius: 0,
                quiet: QUIET,
              },
              canvas,
            )
            canvas.toBlob((blob) => {
              if (blob) download(blob, `ggk5743-qr-${host}.png`, 'image/png')
            })
          }}
        >
          下載 PNG
        </button>
      </div>
    </div>
  )
}
