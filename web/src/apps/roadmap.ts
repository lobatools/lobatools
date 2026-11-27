export interface RoadmapItem {
  label: string
  done: boolean
}

export interface Roadmap {
  items: RoadmapItem[]
  lastUpdated: string
}

const profileWrittenDown: RoadmapItem = {
  label: 'my profile, written down properly',
  done: false,
}

export const ROADMAP: Record<string, Roadmap> = {
  'job-match': {
    items: [
      profileWrittenDown,
      { label: 'honest answers, no made-up stuff', done: false },
      { label: 'limits so nobody burns my credits', done: false },
      { label: 'the result screen', done: false },
    ],
    lastUpdated: '24 Nov',
  },
  mcp: {
    items: [
      profileWrittenDown,
      { label: 'your agent can ask about my experience', done: false },
      { label: 'your agent can check if I fit a role', done: false },
      { label: 'a 2-minute setup guide', done: false },
    ],
    lastUpdated: '24 Nov',
  },
  api: {
    items: [
      { label: 'the first endpoints', done: false },
      { label: 'clear errors, even for weird input', done: false },
      { label: 'see what ran behind each request', done: false },
      { label: 'a note on every decision', done: false },
    ],
    lastUpdated: '24 Nov',
  },
}
