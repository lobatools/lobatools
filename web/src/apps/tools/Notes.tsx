import type { ToolProps } from '../../types'
import { useWindowManager } from '../../system/WindowManager'
import { DESKTOP_FILES } from '../registry'
import styles from './Notes.module.css'

export function Notes(_props: ToolProps) {
  const { openApp } = useWindowManager()

  return (
    <ul className={styles.list}>
      {DESKTOP_FILES.map((file) => (
        <li key={file.id}>
          <button type="button" className={styles.row} onClick={() => openApp(file.id)}>
            <PageGlyph />
            <span className={styles.text}>
              <span className={styles.name}>{file.name}</span>
              <span className={styles.excerpt}>{file.excerpt}</span>
            </span>
            <ChevronGlyph />
          </button>
        </li>
      ))}
    </ul>
  )
}

function PageGlyph() {
  return (
    <svg className={styles.page} viewBox="0 0 24 24" width="26" height="26" aria-hidden>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </svg>
  )
}

function ChevronGlyph() {
  return (
    <svg className={styles.chevron} viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}
