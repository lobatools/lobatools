import type { ReactNode } from 'react'
import styles from './TextFile.module.css'

interface TextFileProps {
  aside?: ReactNode
  children: ReactNode
}

export function TextFile({ aside, children }: TextFileProps) {
  return (
    <div className={styles.file}>
      <div className={styles.layout}>
        {aside && <div className={styles.aside}>{aside}</div>}
        <div className={styles.doc}>{children}</div>
      </div>
    </div>
  )
}
