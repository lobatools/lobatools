interface AppIconProps {
  appId: string
  size?: number
  className?: string
}

const GLYPH_TRANSFORM = 'translate(15 15) scale(1.4167)'

export function AppIcon({ appId, size = 56, className }: AppIconProps) {
  const svg = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    className,
    'aria-hidden': true,
  } as const

  const line = {
    fill: 'none',
    stroke: '#FFFFFF',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const

  const inkLine = {
    fill: 'none',
    stroke: '#17171A',
    strokeWidth: 1.9,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const

  switch (appId) {
    case 'brand':
    case 'welcome':
      return (
        <svg {...svg}>
          <rect width="64" height="64" rx="15" fill="#FBFAF7" />
          <rect x="0.5" y="0.5" width="63" height="63" rx="14.5" fill="none" stroke="#E4DFD4" />
          <g transform={GLYPH_TRANSFORM} {...inkLine}>
            <path d="M4 3 L8.5 8.5 L12 7 L15.5 8.5 L20 3 L19.5 12.5 L12 21 L4.5 12.5 Z" />
          </g>
        </svg>
      )
    case 'job-match':
      return (
        <svg {...svg}>
          <rect width="64" height="64" rx="15" fill="#EC6B43" />
          <g transform={GLYPH_TRANSFORM} {...line}>
            <rect x="3" y="7" width="18" height="13" rx="2.5" />
            <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
            <path d="M8.5 13.5l2.5 2.5 4.5-5" />
          </g>
        </svg>
      )
    case 'mcp':
      return (
        <svg {...svg}>
          <rect width="64" height="64" rx="15" fill="#3FA06A" />
          <g transform={GLYPH_TRANSFORM} {...line}>
            <path d="M9 3v4M15 3v4" />
            <path d="M6 7h12v4a6 6 0 0 1-12 0z" />
            <path d="M12 17v4" />
          </g>
        </svg>
      )
    case 'api':
      return (
        <svg {...svg}>
          <rect width="64" height="64" rx="15" fill="#8A4FC7" />
          <g transform={GLYPH_TRANSFORM} {...line}>
            <path d="M8 4H7a2 2 0 0 0-2 2v3.5a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 5 14.5V18a2 2 0 0 0 2 2h1" />
            <path d="M16 4h1a2 2 0 0 1 2 2v3.5a2.5 2.5 0 0 0 2.5 2.5A2.5 2.5 0 0 0 19 14.5V18a2 2 0 0 1-2 2h-1" />
            <circle cx="12" cy="12" r="1.6" fill="#FFFFFF" stroke="none" />
          </g>
        </svg>
      )
    case 'settings':
      return (
        <svg {...svg}>
          <rect width="64" height="64" rx="15" fill="#3B3F4C" />
          <g transform={GLYPH_TRANSFORM} {...line}>
            <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1" />
            <circle cx="15" cy="6" r="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="17" cy="18" r="2" />
          </g>
        </svg>
      )
    case 'readme':
    case 'why-a-wolf':
    case 'notes':
      return (
        <svg {...svg}>
          <rect width="64" height="64" rx="15" fill="#3B3F4C" />
          <g transform={GLYPH_TRANSFORM} {...line}>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5" />
            <path d="M8.5 13h7M8.5 16.5h5" />
          </g>
        </svg>
      )
    default:
      return null
  }
}
