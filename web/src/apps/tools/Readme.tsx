import type { ToolProps } from '../../types'
import { TextFile } from '../../ui/TextFile'
import { findApp } from '../registry'
import styles from './Readme.module.css'

const TOOLS = [
  { appId: 'job-match', blurb: 'paste a job description, get an honest fit' },
  { appId: 'mcp', blurb: 'the same profile, for AI agents' },
  { appId: 'api', blurb: 'a real API you can poke at' },
]

export function Readme(_props: ToolProps) {
  return (
    <TextFile>
      <p>
        <strong>lobatools</strong> — a small desktop of tools you can actually use.
      </p>
      <p>
        I'm Julianne. I build things. Instead of only listing them on a CV, I put the useful ones
        here as little apps:
      </p>
      <ul className={styles.tools}>
        {TOOLS.map(({ appId, blurb }) => {
          const app = findApp(appId)
          if (!app) return null
          return (
            <li key={appId}>
              <strong>{app.name}</strong>
              {app.status === 'soon' && <span className={styles.dim}> (soon)</span>}
              <span className={styles.blurb}>{blurb}</span>
            </li>
          )
        })}
      </ul>
      <p>
        Everything reads from one source of truth, so it stays honest — no polished claims the rest
        of the site can't back up.
      </p>
      <p>Open an app, or just look around.</p>
    </TextFile>
  )
}
