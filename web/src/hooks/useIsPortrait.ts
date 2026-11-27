import { useEffect, useState } from 'react'

const QUERY = '(orientation: portrait)'

export function useIsPortrait(): boolean {
  const [portrait, setPortrait] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const handler = (event: MediaQueryListEvent) => setPortrait(event.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  return portrait
}
