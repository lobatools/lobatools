import { MOBILE_DOCK, MOBILE_GRID, NOTES_APP_ID, findApp } from '../apps/registry'
import { AppIcon } from '../ui/AppIcon'
import { BrandMark } from '../ui/BrandMark'
import { useSettings } from '../system/SettingsContext'
import { useWindowManager } from '../system/WindowManager'
import styles from './MobileShell.module.css'

export function MobileShell() {
  const { windows, activeId, openApp, closeWindow } = useWindowManager()
  const { reduceMotion } = useSettings()

  const front = windows.find((win) => win.id === activeId && !win.minimized)
  const frontApp = front ? findApp(front.appId) : undefined
  const Tool = frontApp?.component

  const goHome = () => {
    windows.forEach((win) => closeWindow(win.id))
  }

  if (frontApp && Tool && front) {
    const inFile = frontApp.kind === 'file'
    const backToNotes = () => {
      closeWindow(front.id)
      openApp(NOTES_APP_ID)
    }

    return (
      <div className={styles.shell}>
        <section className={styles.appView}>
          <header className={styles.appHeader}>
            <button
              type="button"
              className={styles.crumbHome}
              onClick={goHome}
              aria-label={inFile ? 'lobatools' : undefined}
            >
              <BrandMark size={22} />
              {!inFile && 'lobatools'}
            </button>
            <CrumbSeparator />
            {inFile && (
              <>
                <button type="button" className={styles.crumbHome} onClick={backToNotes}>
                  {findApp(NOTES_APP_ID)?.name}
                </button>
                <CrumbSeparator />
              </>
            )}
            <span className={styles.crumbCurrent}>
              {!inFile && <AppIcon appId={frontApp.id} size={24} />}
              {frontApp.name}
            </span>
          </header>

          <div className={styles.appBody}>
            <Tool app={frontApp} />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className={`${styles.shell} ${styles.home}`}>
      <div className={styles.wallpaper} aria-hidden>
        <BrandMark className={styles.watermark} size={360} strokeWidth={0.8} />
      </div>

      <header className={styles.brandHeader}>
        <BrandMark size={22} />
        <span className={styles.brandName}>lobatools</span>
      </header>

      <ul className={styles.grid}>
        {MOBILE_GRID.map((app) => (
          <li key={app.id}>
            <button
              type="button"
              className={styles.appIcon}
              onClick={() => openApp(app.id)}
              aria-label={app.status === 'soon' ? `${app.name} (coming soon)` : app.name}
            >
              <span className={styles.tile}>
                <AppIcon appId={app.id} size={58} />
              </span>
              <span className={styles.label}>{app.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <aside
        className={`notepaper ${styles.sticky}`}
        style={reduceMotion ? { transform: 'rotate(0deg)' } : undefined}
      >
        <span className="notetape" aria-hidden />
        <h2 className={styles.stickyHi}>Hi, I'm Julianne 👋</h2>
        <p className={styles.stickyBody}>
          Little tools I build, for me and for you to actually use. Tap one to take a look.
        </p>
        <p className={styles.stickySign}>— Julianne</p>
      </aside>

      <nav className={styles.dock} aria-label="Dock">
        <button
          type="button"
          className={styles.dockTile}
          onClick={() => openApp('welcome')}
          aria-label="Welcome"
        >
          <AppIcon appId="brand" size={52} />
        </button>
        {MOBILE_DOCK.map((app) => (
          <button
            key={app.id}
            type="button"
            className={styles.dockTile}
            onClick={() => openApp(app.id)}
            aria-label={app.name}
          >
            <AppIcon appId={app.id} size={52} />
          </button>
        ))}
      </nav>
    </div>
  )
}

function CrumbSeparator() {
  return (
    <span className={styles.crumbSep} aria-hidden>
      /
    </span>
  )
}
