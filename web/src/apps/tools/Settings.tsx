import { BrandMark } from '../../ui/BrandMark'
import { useSettings, type WallpaperId } from '../../system/SettingsContext'
import { COMMIT, GITHUB_URL, VERSION } from '../../meta'
import type { ToolProps } from '../../types'
import styles from './Settings.module.css'

interface Wall {
  id: WallpaperId
  label: string
}

const WALLPAPERS: Wall[] = [
  { id: 'aubergine', label: 'Aubergine' },
  { id: 'grape', label: 'Grape' },
  { id: 'forest', label: 'Forest' },
  { id: 'night', label: 'Night' },
]

const THUMB_CLASS: Record<WallpaperId, string> = {
  aubergine: styles.thumbAubergine,
  grape: styles.thumbGrape,
  forest: styles.thumbForest,
  night: styles.thumbNight,
}

export function Settings(_props: ToolProps) {
  const { wallpaper, reduceMotion, setWallpaper, setReduceMotion, resetSettings, isDefault } =
    useSettings()

  return (
    <div className={styles.settings}>
      <p className={styles.hand}>make yourself at home</p>

      <div className={styles.cols}>
        <section className={styles.controls}>
          <h2 className={styles.group}>Pick a wallpaper</h2>

          <div className={styles.walls} role="radiogroup" aria-label="Wallpaper">
            {WALLPAPERS.map((wall) => (
              <WallpaperThumb
                key={wall.id}
                wall={wall}
                selected={wallpaper === wall.id}
                onPick={() => setWallpaper(wall.id)}
              />
            ))}
          </div>

          <div className={styles.row}>
            <div className={styles.rowText}>
              <p className={styles.rowLabel}>Calm things down</p>
              <p className={styles.rowSub}>No wiggly windows or tilted notes.</p>
            </div>
            <Toggle checked={reduceMotion} onChange={setReduceMotion} label="Calm things down" />
          </div>

          <div className={styles.row}>
            <p className={styles.rowLabel}>Start over</p>
            <button
              type="button"
              className={styles.reset}
              onClick={resetSettings}
              disabled={isDefault}
            >
              Reset everything
            </button>
          </div>
        </section>

        <aside
          className={`notepaper ${styles.about}`}
          style={reduceMotion ? { transform: 'rotate(0deg)' } : undefined}
        >
          <span className="notetape" />

          <div className={styles.aboutHead}>
            <BrandMark size={22} />
            <span className={styles.aboutTitle}>About lobatools</span>
          </div>

          <dl className={styles.rows}>
            <div className={styles.aboutRow}>
              <dt>Version</dt>
              <dd>{VERSION}</dd>
            </div>
            <div className={styles.aboutRow}>
              <dt>Commit</dt>
              <dd>{COMMIT}</dd>
            </div>
          </dl>

          <a className={styles.source} href={GITHUB_URL} target="_blank" rel="noreferrer">
            See the source on GitHub
          </a>
        </aside>
      </div>

      <p className={styles.privacy}>
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden>
          <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
        Your settings stay in this browser. No accounts, no cookies.
      </p>
    </div>
  )
}

function WallpaperThumb({
  wall,
  selected,
  onPick,
}: {
  wall: Wall
  selected: boolean
  onPick: () => void
}) {
  return (
    <div className={styles.wallItem}>
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        aria-label={wall.label}
        className={`${styles.thumb} ${THUMB_CLASS[wall.id]} ${selected ? styles.thumbOn : ''}`}
        onClick={onPick}
      >
        <BrandMark className={styles.thumbWolf} size={44} strokeWidth={0.9} />
        <span className={styles.thumbDock}>
          <i />
          <i />
        </span>
        <span className={styles.thumbWindow} />
        <span className={styles.thumbNote} />
        {selected && (
          <span className={styles.check} aria-hidden>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M5 12l4 4 10-10" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </button>
      <span className={`${styles.wallName} ${selected ? styles.wallNameOn : ''}`}>
        {wall.label}
      </span>
    </div>
  )
}

interface ToggleProps {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.knob} />
    </button>
  )
}
