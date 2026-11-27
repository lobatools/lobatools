import type { ComponentType } from 'react'

export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface ToolProps {
  app: AppDefinition
}

export type AppStatus = 'ready' | 'soon'

export type AppKind = 'file' | 'folder'

export type ComingSoonPeek =
  | { kind: 'paste'; label: string; input: string; reply: string }
  | { kind: 'terminal'; label: string; command: string; comment: string }
  | { kind: 'chat'; label: string; bubble: string; call: string }

export interface AppDefinition {
  id: string
  name: string
  icon: string
  accent: string
  status: AppStatus
  tagline?: string
  peek?: ComingSoonPeek
  kind?: AppKind
  excerpt?: string
  defaultSize: Size
  component: ComponentType<ToolProps>
}

export interface WindowInstance {
  id: number
  appId: string
  position: Point
  size: Size
  zIndex: number
  minimized: boolean
  maximized: boolean
}
