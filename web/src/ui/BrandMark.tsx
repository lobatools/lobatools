export const WOLF_PATH =
  'M4 3 L8.5 8.5 L12 7 L15.5 8.5 L20 3 L19.5 12.5 L12 21 L4.5 12.5 Z'

interface BrandMarkProps {
  size?: number
  strokeWidth?: number
  className?: string
}

export function BrandMark({
  size = 28,
  strokeWidth = 1.8,
  className,
}: BrandMarkProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={WOLF_PATH} />
    </svg>
  )
}
