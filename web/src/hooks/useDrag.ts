import { useCallback, useRef, type PointerEvent } from 'react'
import type { Point } from '../types'

interface DragHandlers {
  onPointerDown: (event: PointerEvent) => void
  onPointerMove: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
}

export function useDrag(
  position: Point,
  onMove: (next: Point) => void,
  onStart?: () => void,
  onEnd?: () => void,
): DragHandlers {
  const origin = useRef<{ pointer: Point; start: Point } | null>(null)

  const onPointerDown = useCallback(
    (event: PointerEvent) => {
      if (event.button !== 0) return
      event.currentTarget.setPointerCapture(event.pointerId)
      origin.current = { pointer: { x: event.clientX, y: event.clientY }, start: position }
      onStart?.()
    },
    [position, onStart],
  )

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!origin.current) return
      const { pointer, start } = origin.current
      onMove({
        x: start.x + (event.clientX - pointer.x),
        y: start.y + (event.clientY - pointer.y),
      })
    },
    [onMove],
  )

  const onPointerUp = useCallback(
    (event: PointerEvent) => {
      const dragging = origin.current !== null
      origin.current = null
      event.currentTarget.releasePointerCapture(event.pointerId)
      if (dragging) onEnd?.()
    },
    [onEnd],
  )

  return { onPointerDown, onPointerMove, onPointerUp }
}
