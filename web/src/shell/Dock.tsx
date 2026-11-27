import { useState } from 'react'
import { BRAND_APP_ID, DOCK_APPS, LAUNCHER_APPS } from '../apps/registry'
import { AppIcon } from '../ui/AppIcon'
import { useWindowManager } from '../system/WindowManager'
import type { AppDefinition } from '../types'
import styles from './Dock.module.css'

export function Dock() {
  const { openApp, isRunning } = useWindowManager()
  const [launcherOpen, setLauncherOpen] = useState(false)

  const launch = (id: string) => {
    openApp(id)
    setLauncherOpen(false)
  }

  return (
    <>
      <nav className={styles.dock} aria-label="Applications">
        <button
          type="button"
          className={styles.brandTile}
          onClick={() => openApp(BRAND_APP_ID)}
          title="Welcome"
        >
          <AppIcon appId="brand" size={48} />
        </button>

        <span className={styles.divider} aria-hidden />

        <ul className={styles.apps}>
          {DOCK_APPS.map((app) => (
            <DockIcon key={app.id} app={app} running={isRunning(app.id)} onOpen={openApp} />
          ))}
        </ul>

        <span className={styles.spacer} aria-hidden />

        <button
          type="button"
          className={styles.launcher}
          onClick={() => setLauncherOpen((open) => !open)}
          aria-label="Show applications"
          aria-expanded={launcherOpen}
        >
          <GridDots />
        </button>
      </nav>

      {launcherOpen && (
        <div className={styles.overlay} onClick={() => setLauncherOpen(false)}>
          <ul className={styles.launcherGrid} onClick={(event) => event.stopPropagation()}>
            {LAUNCHER_APPS.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  className={styles.launcherItem}
                  onClick={() => launch(app.id)}
                  aria-label={app.name}
                >
                  <span className={styles.launcherTile} aria-hidden>
                    <AppIcon appId={app.id} size={72} />
                  </span>
                  <span className={styles.launcherLabel}>{app.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

function GridDots() {
  const dots = [0, 1, 2]
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
      {dots.map((row) =>
        dots.map((col) => (
          <circle key={`${row}-${col}`} cx={6 + col * 6} cy={6 + row * 6} r="1.6" fill="currentColor" />
        )),
      )}
    </svg>
  )
}

interface DockIconProps {
  app: AppDefinition
  running: boolean
  onOpen: (appId: string) => void
}

function DockIcon({ app, running, onOpen }: DockIconProps) {
  const soon = app.status === 'soon'
  return (
    <li className={styles.item}>
      {running && <span className={styles.runDot} aria-hidden />}
      <button
        type="button"
        className={styles.icon}
        onClick={() => onOpen(app.id)}
        aria-label={soon ? `${app.name} (coming soon)` : app.name}
      >
        <AppIcon appId={app.id} size={48} />
      </button>
      <span className={styles.tooltip}>{app.name}</span>
    </li>
  )
}
