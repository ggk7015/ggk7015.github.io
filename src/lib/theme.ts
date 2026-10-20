export type ThemePreference = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'

/** Dark is the house default; the OS is only consulted when picked explicitly. */
const DEFAULT_PREFERENCE: ThemePreference = 'dark'

export function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

export function readThemePreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isThemePreference(stored)) return stored
  } catch {
    // localStorage can throw when storage is blocked (private mode, partitioned iframe).
  }
  return DEFAULT_PREFERENCE
}

/**
 * Writes the preference to <html data-theme> and localStorage.
 * `system` is stored verbatim and removes the attribute so the media query decides.
 */
export function applyThemePreference(preference: ThemePreference): void {
  const root = document.documentElement
  if (preference === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', preference)

  try {
    window.localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Non-fatal: the theme still applies for this session.
  }
}
