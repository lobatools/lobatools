import type { AppDefinition } from '../types'
import { Welcome } from './tools/Welcome'
import { ComingSoon } from './tools/ComingSoon'
import { Readme } from './tools/Readme'
import { WhyAWolf } from './tools/WhyAWolf'
import { Notes } from './tools/Notes'
import { Settings } from './tools/Settings'

export const BRAND_APP_ID = 'welcome'
export const NOTES_APP_ID = 'notes'

export const APPS: AppDefinition[] = [
  {
    id: 'welcome',
    name: 'Welcome',
    icon: '👋',
    accent: '#f5b82e',
    status: 'ready',
    defaultSize: { width: 460, height: 440 },
    component: Welcome,
  },
  {
    id: 'job-match',
    name: 'Job Match',
    icon: '🎯',
    accent: '#ec6b43',
    status: 'soon',
    tagline:
      "Paste a job description and I'll tell you, honestly, how I'd fit. What I'd bring, where I'd still be learning, and what to ask me.",
    peek: {
      kind: 'paste',
      label: 'A sneak peek:',
      input: 'Senior C++ Embedded Engineer',
      reply: "Not for me, honestly. I'd be learning everything at once.",
    },
    defaultSize: { width: 780, height: 520 },
    component: ComingSoon,
  },
  {
    id: 'mcp',
    name: 'MCP Server',
    icon: '🔌',
    accent: '#3fa06a',
    status: 'soon',
    tagline:
      'My MCP server lets AI assistants like Claude or Cursor look up my experience and skills, or check a role against my profile. Same answers as Job Match, for robots.',
    peek: {
      kind: 'chat',
      label: 'Soon, in your AI assistant:',
      bubble: 'Is Julianne a good fit for this backend role?',
      call: 'calling lobatools · check_match',
    },
    defaultSize: { width: 780, height: 520 },
    component: ComingSoon,
  },
  {
    id: 'api',
    name: 'Explore my API',
    icon: '🧪',
    accent: '#8a4fc7',
    status: 'soon',
    tagline:
      "A real, read-only API of my profile you can poke at. You'll see the response, what ran behind it, and why it's built that way.",
    peek: {
      kind: 'terminal',
      label: 'Soon, from any terminal:',
      command: 'curl lobatools.com/v1/profile',
      comment: "not yet, it's still in the oven",
    },
    defaultSize: { width: 780, height: 520 },
    component: ComingSoon,
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: '⚙️',
    accent: '#5b6472',
    status: 'ready',
    defaultSize: { width: 720, height: 560 },
    component: Settings,
  },
  {
    id: 'readme',
    name: 'readme.txt',
    icon: '📄',
    accent: '#3b3f4a',
    status: 'ready',
    kind: 'file',
    excerpt: 'lobatools — a small desktop of tools you can actually use.',
    defaultSize: { width: 500, height: 480 },
    component: Readme,
  },
  {
    id: 'why-a-wolf',
    name: 'why-a-wolf.txt',
    icon: '🐺',
    accent: '#3b3f4a',
    status: 'ready',
    kind: 'file',
    excerpt: 'The wolf was here before the tools.',
    defaultSize: { width: 640, height: 400 },
    component: WhyAWolf,
  },
  {
    id: NOTES_APP_ID,
    name: 'Notes',
    icon: '🗒️',
    accent: '#3b3f4a',
    status: 'ready',
    kind: 'folder',
    defaultSize: { width: 500, height: 480 },
    component: Notes,
  },
]

export function findApp(id: string): AppDefinition | undefined {
  return APPS.find((app) => app.id === id)
}

function pick(ids: string[]): AppDefinition[] {
  return ids.map((id) => findApp(id)).filter((app): app is AppDefinition => Boolean(app))
}

export const DOCK_APPS = APPS.filter((app) => app.id !== BRAND_APP_ID && !app.kind)
export const DESKTOP_FILES = APPS.filter((app) => app.kind === 'file')
export const LAUNCHER_APPS = APPS.filter((app) => app.kind !== 'folder')
export const MOBILE_GRID = pick(['job-match', 'mcp', 'api', NOTES_APP_ID])
export const MOBILE_DOCK = pick(['settings'])
