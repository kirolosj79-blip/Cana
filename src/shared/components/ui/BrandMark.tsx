interface BrandMarkProps {
  size?: number
  className?: string
  strokeColor?: string
}

/**
 * The arch + cross mark — recreated as vector line art rather than an
 * embedded raster image, so it stays crisp at any size and can pick up the
 * site's actual theme colors (gold on dark surfaces, ink on light ones)
 * instead of carrying a fixed navy background baked into a picture.
 */
export function BrandMark({ size = 32, className, strokeColor = 'currentColor' }: BrandMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Romanesque arch */}
      <path
        d="M12 40V22C12 14.268 17.373 8 24 8C30.627 8 36 14.268 36 22V40"
        stroke={strokeColor}
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      {/* Cross, centered in the arch opening */}
      <path d="M24 14V30M17 21H31" stroke={strokeColor} strokeWidth="2.75" strokeLinecap="round" />
    </svg>
  )
}
