import { BrandMark } from '../../ui/BrandMark'
import type { ToolProps } from '../../types'
import styles from './Welcome.module.css'

export function Welcome(_props: ToolProps) {
  return (
    <div className={styles.welcome}>
      <header className={styles.head}>
        <span className={styles.brandTile}>
          <BrandMark size={32} />
        </span>
        <div>
          <h1 className={styles.name}>lobatools</h1>
          <p className={styles.tagline}>Things I build, for me and for you.</p>
        </div>
      </header>

      <div className={styles.status}>
        <p className={styles.statusHead}>The workshop is open, the shelves are empty.</p>
        <p className={styles.statusBody}>
          The first tools are being built. When one's ready, it shows up in the dock.
        </p>
      </div>

      <div className={styles.actions}>
        <a className={styles.primary} href="https://julobato.com" target="_blank" rel="noreferrer">
          Read the blog
        </a>
        <a
          className={styles.secondary}
          href="https://github.com/lobatools"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}
