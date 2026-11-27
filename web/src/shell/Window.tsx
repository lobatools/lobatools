import { useRef, type PointerEvent } from 'react'
import { findApp } from '../apps/registry'
import { useDrag } from '../hooks/useDrag'
import { useResize } from '../hooks/useResize'
import { useWindowManager } from '../system/WindowManager'
import type { Point, Size, WindowInstance } from '../types'
import styles from './Window.module.css'

const BAR_HEIGHT = 44
const EDGE_MARGIN = 80
const TITLEBAR_HEIGHT = 40

function clampPosition(pos: Point, size: Size): Point {
  const stageW = window.innerWidth
  const stageH = window.innerHeight - BAR_HEIGHT
  return {
    x: Math.min(Math.max(pos.x, EDGE_MARGIN - size.width), stageW - EDGE_MARGIN),
    y: Math.min(Math.max(pos.y, 0), stageH - TITLEBAR_HEIGHT),
  }
}

interface WindowProps {
  instance: WindowInstance
}

export function Window({ instance }: WindowProps) {
  const {
    activeId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    moveWindow,
    resizeWindow,
  } = useWindowManager()
  const app = findApp(instance.appId)

  const ref = useRef<HTMLElement>(null)
  const latestPos = useRef(instance.position)
  const latestSize = useRef(instance.size)

  const drag = useDrag(
    instance.position,
    (next) => {
      const clamped = clampPosition(next, instance.size)
      latestPos.current = clamped
      const el = ref.current
      if (el) {
        el.style.left = `${clamped.x}px`
        el.style.top = `${clamped.y}px`
      }
    },
    () => {
      latestPos.current = instance.position
      focusWindow(instance.id)
    },
    () => moveWindow(instance.id, latestPos.current),
  )

  const resize = useResize(
    instance.size,
    (next) => {
      latestSize.current = next
      const el = ref.current
      if (el) {
        el.style.width = `${next.width}px`
        el.style.height = `${next.height}px`
      }
    },
    () => {
      latestSize.current = instance.size
      focusWindow(instance.id)
    },
    () => resizeWindow(instance.id, latestSize.current),
  )

  const startDrag = (event: PointerEvent) => {
    if (instance.maximized) return
    if ((event.target as HTMLElement).closest('button')) return
    drag.onPointerDown(event)
  }

  if (!app || instance.minimized) return null

  const Tool = app.component
  const isActive = instance.id === activeId

  const frameStyle = instance.maximized
    ? undefined
    : {
        left: instance.position.x,
        top: instance.position.y,
        width: instance.size.width,
        height: instance.size.height,
        zIndex: instance.zIndex,
      }

  return (
    <section
      ref={ref}
      className={`${styles.window} ${instance.maximized ? styles.maximized : ''} ${
        isActive ? styles.active : ''
      }`}
      style={instance.maximized ? { zIndex: instance.zIndex } : frameStyle}
      onPointerDown={() => focusWindow(instance.id)}
    >
      <header
        className={styles.titlebar}
        onPointerDown={startDrag}
        onPointerMove={drag.onPointerMove}
        onPointerUp={drag.onPointerUp}
        onDoubleClick={() => toggleMaximize(instance.id)}
      >
        <div className={styles.lights}>
          <button
            type="button"
            className={`${styles.light} ${styles.close}`}
            onClick={() => closeWindow(instance.id)}
            aria-label="Close"
          />
          <button
            type="button"
            className={`${styles.light} ${styles.minimize}`}
            onClick={() => minimizeWindow(instance.id)}
            aria-label="Minimize"
          />
          <button
            type="button"
            className={`${styles.light} ${styles.zoom}`}
            onClick={() => toggleMaximize(instance.id)}
            aria-label="Maximize"
          />
        </div>
        <span className={styles.title}>{app.name}</span>
        <span className={styles.spacer} />
      </header>

      <div className={styles.body}>
        <Tool app={app} />
      </div>

      {!instance.maximized && (
        <span
          className={styles.resizeHandle}
          data-resize
          aria-hidden
          onPointerDown={resize.onPointerDown}
          onPointerMove={resize.onPointerMove}
          onPointerUp={resize.onPointerUp}
        />
      )}
    </section>
  )
}
