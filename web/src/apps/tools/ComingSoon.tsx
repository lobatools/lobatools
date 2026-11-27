import { AppIcon } from '../../ui/AppIcon'
import { ROADMAP } from '../roadmap'
import { useSettings } from '../../system/SettingsContext'
import type { ComingSoonPeek, ToolProps } from '../../types'
import styles from './ComingSoon.module.css'

export function ComingSoon({ app }: ToolProps) {
  const { reduceMotion } = useSettings()
  const roadmap = ROADMAP[app.id]

  return (
    <div className={styles.soon}>
      <div className={styles.intro}>
        <div className={styles.head}>
          <AppIcon appId={app.id} size={44} />
          <h2 className={styles.name}>{app.name}</h2>
        </div>

        {app.tagline && <p className={styles.tagline}>{app.tagline}</p>}

        <p className={styles.status}>It's not live yet. Here's where I am.</p>

        {app.peek && <Peek peek={app.peek} />}
      </div>

      {roadmap && (
        <aside
          className={`notepaper ${styles.todo}`}
          style={reduceMotion ? { transform: 'rotate(0deg)' } : undefined}
        >
          <span className="notetape" aria-hidden />
          <p className={styles.todoTitle}>to do</p>
          <ul className={styles.todoList}>
            {roadmap.items.map((item) => (
              <li
                key={item.label}
                className={`${styles.todoItem} ${item.done ? styles.done : ''}`}
              >
                <span className={styles.box} aria-hidden>
                  {item.done && (
                    <svg viewBox="0 0 24 24" width="13" height="13">
                      <path
                        d="M5 12l4 4 10-10"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className={styles.todoText}>{item.label}</span>
              </li>
            ))}
          </ul>
          <p className={styles.todoFoot}>last updated {roadmap.lastUpdated}</p>
        </aside>
      )}
    </div>
  )
}

function Peek({ peek }: { peek: ComingSoonPeek }) {
  if (peek.kind === 'terminal') {
    return (
      <div className={styles.peekWrap}>
        <p className={styles.peekLabel}>{peek.label}</p>
        <div className={styles.terminal}>
          <p className={styles.termCmd}>
            <span className={styles.prompt}>$</span> {peek.command}
          </p>
          <p className={styles.termComment}># {peek.comment}</p>
        </div>
      </div>
    )
  }

  if (peek.kind === 'chat') {
    return (
      <div className={styles.peekWrap}>
        <p className={styles.peekLabel}>{peek.label}</p>
        <div className={styles.card}>
          <p className={styles.bubble}>{peek.bubble}</p>
          <p className={styles.call}>
            <span className={styles.dot} aria-hidden /> {peek.call}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.peekWrap}>
      <p className={styles.peekLabel}>{peek.label}</p>
      <div className={styles.card}>
        <p className={styles.pasteTag}>You paste</p>
        <p className={styles.pasteInput}>{peek.input}</p>
        <p className={styles.pasteReply}>→ {peek.reply}</p>
      </div>
    </div>
  )
}
