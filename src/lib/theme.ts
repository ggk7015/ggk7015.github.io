export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function readThemePreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage can throw when storage is blocked (private mode, partitioned iframe).
  }
  return 'system'
}

/**
 * Writes the preference to <html data-theme> and localStorage.
 * `system` removes the attribute so the prefers-color-scheme media query decides.
 */
export function applyThemePreference(preference: ThemePreference): void {
  const root = document.documentElement
  if (preference === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', preference)

  try {
    if (preference === 'system') window.localStorage.removeItem(STORAGE_KEY)
    else window.localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Non-fatal: the theme still applies for this session.
  }
}
