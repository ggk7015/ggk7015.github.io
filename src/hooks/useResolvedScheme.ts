import { useEffect, useState } from 'react'

const QUERY = '(prefers-color-scheme: dark)'

function read(): 'light' | 'dark' {
  if (typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia(QUERY).matches ? 'dark' : 'light'
}

/**
 * The theme the OS is currently asking for, live.
 *
 * Material 3 separates `colorMode` (what the user chose) from `resolvedColorMode`
 * (what is actually on screen). Only the second is needed here, to name the
 * outcome of "follow the system" out loud instead of leaving it unsaid.
 */
export function useResolvedScheme(): 'light' | 'dark' {
  const [scheme, setScheme] = useState<'light' | 'dark'>(read)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const media = window.matchMedia(QUERY)
    // Only future changes need handling: the lazy initialiser already read the
    // current value, and a change between render and effect is not observable.
    const onChange = (event: MediaQueryListEvent) => {
      setScheme(event.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return scheme
}
