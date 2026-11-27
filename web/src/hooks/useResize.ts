import { useCallback, useRef, type PointerEvent } from 'react'
import type { Size } from '../types'

interface ResizeHandlers {
  onPointerDown: (event: PointerEvent) => void
  onPointerMove: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void
}

const MIN_WIDTH = 320
const MIN_HEIGHT = 240

export function useResize(
  size: Size,
  onResize: (next: Size) => void,
  onStart?: () => void,
  onEnd?: () => void,
): ResizeHandlers {
  const origin = useRef<{ pointer: { x: number; y: number }; start: Size } | null>(null)

  const onPointerDown = useCallback(
    (event: PointerEvent) => {
      if (event.button !== 0) return
      event.stopPropagation()
      event.currentTarget.setPointerCapture(event.pointerId)
      origin.current = { pointer: { x: event.clientX, y: event.clientY }, start: size }
      onStart?.()
    },
    [size, onStart],
  )

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      if (!origin.current) return
      const { pointer, start } = origin.current
      onResize({
        width: Math.max(MIN_WIDTH, start.width + (event.clientX - pointer.x)),
        height: Math.max(MIN_HEIGHT, start.height + (event.clientY - pointer.y)),
      })
    },
    [onResize],
  )

  const onPointerUp = useCallback(
    (event: PointerEvent) => {
      const resizing = origin.current !== null
      origin.current = null
      event.currentTarget.releasePointerCapture(event.pointerId)
      if (resizing) onEnd?.()
    },
    [onEnd],
  )

  return { onPointerDown, onPointerMove, onPointerUp }
}
