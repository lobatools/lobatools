import { useEffect, useState } from 'react'

export function useNow(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return now
}

export function useClock(): string {
  const now = useNow()
  const date = now
    .toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })
    .replace(',', '')
  const time = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  return `${date} ${time}`
}
