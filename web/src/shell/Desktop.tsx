import { useState } from 'react'
import { DESKTOP_FILES } from '../apps/registry'
import { BrandMark } from '../ui/BrandMark'
import { MenuBar } from './MenuBar'
import { MobileShell } from './MobileShell'
import { Dock } from './Dock'
import { Window } from './Window'
import { useDrag } from '../hooks/useDrag'
import { useIsPortrait } from '../hooks/useIsPortrait'
import { useHashRoute } from '../hooks/useHashRoute'
import { useSettings } from '../system/SettingsContext'
import { useWindowManager } from '../system/WindowManager'
import styles from './Desktop.module.css'

export function Desktop() {
  const portrait = useIsPortrait()
  useHashRoute()
  return portrait ? <MobileShell /> : <DesktopShell />
}

function DesktopShell() {
  const { windows } = useWindowManager()

  return (
    <div className={styles.desktop}>
      <div className={styles.wallpaper} aria-hidden>
        <BrandMark className={styles.watermark} size={560} strokeWidth={0.7} />
      </div>

      <DesktopFiles />

      <StickyNote />

      <MenuBar />

      <main className={styles.stage}>
        {windows.map((win) => (
          <Window key={win.id} instance={win} />
        ))}
      </main>

      <Dock />
    </div>
  )
}

function DesktopFiles() {
  const { openApp } = useWindowManager()

  return (
    <div className={styles.files}>
      {DESKTOP_FILES.map((app) => (
        <button
          key={app.id}
          type="button"
          className={styles.fileIcon}
          onDoubleClick={() => openApp(app.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              openApp(app.id)
            }
          }}
          aria-label={`Open ${app.name}`}
        >
          <FileGlyph />
          <span className={styles.fileLabel}>{app.name}</span>
        </button>
      ))}
    </div>
  )
}

function FileGlyph() {
  return (
    <svg viewBox="0 0 48 60" width="46" height="58" aria-hidden>
      <path
        d="M9 2h22l9 9v45a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"
        fill="#ffffff"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1.2"
      />
      <path d="M31 2v9h9" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" />
      <g stroke="#cbc6bc" strokeWidth="2" strokeLinecap="round">
        <line x1="14" y1="26" x2="34" y2="26" />
        <line x1="14" y1="33" x2="34" y2="33" />
        <line x1="14" y1="40" x2="28" y2="40" />
      </g>
    </svg>
  )
}

function StickyNote() {
  const { reduceMotion } = useSettings()
  const [pos, setPos] = useState(() => ({
    x: Math.round(window.innerWidth / 2 - 135),
    y: Math.round(window.innerHeight / 2 - 150),
  }))
  const drag = useDrag(pos, setPos)

  return (
    <aside
      className={`notepaper ${styles.sticky}`}
      style={{ left: pos.x, top: pos.y, transform: reduceMotion ? 'rotate(0deg)' : undefined }}
      onPointerDown={drag.onPointerDown}
      onPointerMove={drag.onPointerMove}
      onPointerUp={drag.onPointerUp}
    >
      <span className="notetape" aria-hidden />
      <h2 className={styles.stickyHi}>Hi, I'm Julianne 👋</h2>
      <p className={styles.stickyLead}>
        Welcome to <strong>lobatools</strong> — a little desktop of things I built that you can
        actually use, not just read about.
      </p>
      <p className={styles.stickyBody}>
        Open an app from the dock on the left. Job Match reads a job description and tells you,
        honestly, how I'd fit. More tools are on the way.
      </p>
      <p className={styles.stickySign}>— Julianne</p>
    </aside>
  )
}
