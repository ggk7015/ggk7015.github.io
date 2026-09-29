import { useState, type ReactElement } from 'react'
import { applyThemePreference, readThemePreference, type ThemePreference } from '../lib/theme'

type Option = { value: ThemePreference; label: string; icon: () => ReactElement }

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12.9A9 9 0 1 1 11.1 3a7 7 0 0 0 9.9 9.9Z" />
    </svg>
  )
}

function SystemIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M9 20.5h6M12 17v3.5" />
    </svg>
  )
}

const OPTIONS: Option[] = [
  { value: 'system', label: '跟隨系統', icon: SystemIcon },
  { value: 'light', label: '淺色', icon: SunIcon },
  { value: 'dark', label: '深色', icon: MoonIcon },
]

export default function ThemeToggle() {
  // Initialised from storage rather than an effect so the checked pill matches
  // the pre-paint value applied by the inline head script (no flash, no drift).
  const [preference, setPreference] = useState<ThemePreference>(readThemePreference)

  function choose(next: ThemePreference) {
    setPreference(next)
    applyThemePreference(next)
  }

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="色彩主題">
      {OPTIONS.map(({ value, label, icon: Glyph }) => (
        <label key={value} className="theme-toggle__option" title={label}>
          <input
            className="sr-only"
            type="radio"
            name="theme-preference"
            value={value}
            checked={preference === value}
            onChange={() => choose(value)}
          />
          <span className="theme-toggle__pill">
            <Glyph />
            <span className="sr-only">{label}</span>
          </span>
        </label>
      ))}
    </div>
  )
}
