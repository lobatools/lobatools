import { BRAND_APP_ID, findApp } from '../apps/registry'
import { BrandMark } from '../ui/BrandMark'
import { useClock } from '../hooks/useClock'
import { useWindowManager } from '../system/WindowManager'
import styles from './MenuBar.module.css'

export function MenuBar() {
  const { activeId, windows, openApp } = useWindowManager()
  const clock = useClock()

  const active = windows.find((win) => win.id === activeId)
  const activeApp = active ? findApp(active.appId) : findApp(BRAND_APP_ID)

  return (
    <header className={styles.bar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.brand}
          onClick={() => openApp(BRAND_APP_ID)}
          title="lobatools"
        >
          <BrandMark size={20} />
          <span className={styles.brandName}>lobatools</span>
        </button>
        <span className={styles.appName}>{activeApp?.name}</span>
        <span className={styles.statusPill} aria-hidden>
          <i />
          <i />
          <i />
        </span>
      </div>

      <div className={styles.clock}>{clock}</div>

      <div className={styles.right}>
        <span className={styles.user}>Julianne Lobato</span>
        <span className={styles.icons} aria-hidden>
          <svg viewBox="0 0 24 24" width="15" height="15">
            <path
              d="M12 18.5a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM5.6 13.4a9 9 0 0 1 12.8 0M2.8 10.1a13 13 0 0 1 18.4 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <svg viewBox="0 0 24 24" width="15" height="15">
            <path
              d="M4 9v6h3l5 4V5L7 9H4Zm12.5-1.5a5 5 0 0 1 0 9M15 10a2.5 2.5 0 0 1 0 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg viewBox="0 0 24 24" width="15" height="15">
            <path
              d="M12 3v8M6.5 6.5a8 8 0 1 0 11 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>
    </header>
  )
}
