import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type WallpaperId = 'aubergine' | 'grape' | 'forest' | 'night'

export const WALLPAPER_IDS: WallpaperId[] = ['aubergine', 'grape', 'forest', 'night']

interface Settings {
  wallpaper: WallpaperId
  reduceMotion: boolean
}

interface SettingsValue extends Settings {
  setWallpaper: (wallpaper: WallpaperId) => void
  setReduceMotion: (reduceMotion: boolean) => void
  resetSettings: () => void
  isDefault: boolean
}

const STORAGE_KEY = 'lobatools:settings'
const DEFAULTS: Settings = { wallpaper: 'aubergine', reduceMotion: false }

function load(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw) as Partial<Settings>
    return {
      wallpaper: WALLPAPER_IDS.includes(parsed.wallpaper as WallpaperId)
        ? (parsed.wallpaper as WallpaperId)
        : DEFAULTS.wallpaper,
      reduceMotion:
        typeof parsed.reduceMotion === 'boolean' ? parsed.reduceMotion : DEFAULTS.reduceMotion,
    }
  } catch {
    return DEFAULTS
  }
}

const SettingsContext = createContext<SettingsValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch {
      /* storage unavailable — keep in-memory only */
    }
    const root = document.documentElement
    root.dataset.wallpaper = settings.wallpaper
    root.dataset.reduceMotion = settings.reduceMotion ? 'true' : 'false'
  }, [settings])

  const value = useMemo<SettingsValue>(
    () => ({
      ...settings,
      setWallpaper: (wallpaper) => setSettings((prev) => ({ ...prev, wallpaper })),
      setReduceMotion: (reduceMotion) => setSettings((prev) => ({ ...prev, reduceMotion })),
      resetSettings: () => setSettings(DEFAULTS),
      isDefault:
        settings.wallpaper === DEFAULTS.wallpaper &&
        settings.reduceMotion === DEFAULTS.reduceMotion,
    }),
    [settings],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsValue {
  const value = useContext(SettingsContext)
  if (!value) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return value
}
