import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react'
import { findApp } from '../apps/registry'
import type { Point, Size, WindowInstance } from '../types'

interface State {
  windows: WindowInstance[]
  nextId: number
  topZ: number
}

type Action =
  | { type: 'open'; appId: string }
  | { type: 'close'; id: number }
  | { type: 'focus'; id: number }
  | { type: 'minimize'; id: number }
  | { type: 'toggleMaximize'; id: number }
  | { type: 'move'; id: number; position: Point }
  | { type: 'resize'; id: number; size: Size }

const CASCADE = 28

function bringToFront(state: State, id: number, patch?: Partial<WindowInstance>): State {
  const topZ = state.topZ + 1
  return {
    ...state,
    topZ,
    windows: state.windows.map((win) =>
      win.id === id ? { ...win, ...patch, zIndex: topZ } : win,
    ),
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open': {
      const existing = state.windows.find((win) => win.appId === action.appId)
      if (existing) {
        return bringToFront(state, existing.id, { minimized: false })
      }
      const app = findApp(action.appId)
      if (!app) return state
      const offset = CASCADE * (state.windows.length % 6)
      const topZ = state.topZ + 1
      const win: WindowInstance = {
        id: state.nextId,
        appId: app.id,
        position: { x: 140 + offset, y: 92 + offset },
        size: app.defaultSize,
        zIndex: topZ,
        minimized: false,
        maximized: false,
      }
      return { windows: [...state.windows, win], nextId: state.nextId + 1, topZ }
    }
    case 'close':
      return { ...state, windows: state.windows.filter((win) => win.id !== action.id) }
    case 'focus':
      return bringToFront(state, action.id, { minimized: false })
    case 'minimize':
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id ? { ...win, minimized: true } : win,
        ),
      }
    case 'toggleMaximize':
      return bringToFront(state, action.id, { maximized: !findWindow(state, action.id)?.maximized })
    case 'move':
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id ? { ...win, position: action.position } : win,
        ),
      }
    case 'resize':
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id ? { ...win, size: action.size } : win,
        ),
      }
    default:
      return state
  }
}

function findWindow(state: State, id: number): WindowInstance | undefined {
  return state.windows.find((win) => win.id === id)
}

interface WindowManagerValue {
  windows: WindowInstance[]
  activeId: number | null
  isRunning: (appId: string) => boolean
  openApp: (appId: string) => void
  closeWindow: (id: number) => void
  focusWindow: (id: number) => void
  minimizeWindow: (id: number) => void
  toggleMaximize: (id: number) => void
  moveWindow: (id: number, position: Point) => void
  resizeWindow: (id: number, size: Size) => void
}

const WindowManagerContext = createContext<WindowManagerValue | null>(null)

const INITIAL_STATE: State = { windows: [], nextId: 1, topZ: 0 }

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const activeId = useMemo(() => {
    const visible = state.windows.filter((win) => !win.minimized)
    if (visible.length === 0) return null
    return visible.reduce((top, win) => (win.zIndex > top.zIndex ? win : top)).id
  }, [state.windows])

  const runningApps = useMemo(
    () => new Set(state.windows.map((win) => win.appId)),
    [state.windows],
  )

  const value = useMemo<WindowManagerValue>(
    () => ({
      windows: state.windows,
      activeId,
      isRunning: (appId: string) => runningApps.has(appId),
      openApp: (appId: string) => dispatch({ type: 'open', appId }),
      closeWindow: (id: number) => dispatch({ type: 'close', id }),
      focusWindow: (id: number) => dispatch({ type: 'focus', id }),
      minimizeWindow: (id: number) => dispatch({ type: 'minimize', id }),
      toggleMaximize: (id: number) => dispatch({ type: 'toggleMaximize', id }),
      moveWindow: (id: number, position: Point) => dispatch({ type: 'move', id, position }),
      resizeWindow: (id: number, size: Size) => dispatch({ type: 'resize', id, size }),
    }),
    [state.windows, activeId, runningApps],
  )

  return (
    <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>
  )
}

export function useWindowManager(): WindowManagerValue {
  const value = useContext(WindowManagerContext)
  if (!value) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider')
  }
  return value
}
