import { useEffect, useRef } from 'react'
import { findApp } from '../apps/registry'
import { useWindowManager } from '../system/WindowManager'

function appIdFromHash(): string | undefined {
  return findApp(decodeURIComponent(window.location.hash.slice(1)))?.id
}

export function useHashRoute() {
  const manager = useWindowManager()
  const latest = useRef(manager)
  latest.current = manager
  const pending = useRef(appIdFromHash())

  const frontAppId = manager.windows.find((win) => win.id === manager.activeId)?.appId

  useEffect(() => {
    const sync = () => {
      const { windows, openApp, closeWindow } = latest.current
      const appId = appIdFromHash()
      if (appId) openApp(appId)
      else windows.forEach((win) => closeWindow(win.id))
    }
    if (pending.current) latest.current.openApp(pending.current)
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => {
    if (pending.current) {
      if (frontAppId === pending.current) pending.current = undefined
      return
    }
    const target = frontAppId ? `#${frontAppId}` : ''
    if (window.location.hash === target) return
    window.history.pushState(null, '', target || window.location.pathname + window.location.search)
  }, [frontAppId])
}
