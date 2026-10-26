/**
 * Simple, warm line-art illustrations for the onboarding carousel — drawn
 * as original SVG rather than sourced/generated imagery, in the site's own
 * gold/ink palette. Deliberately simplified (not painterly) since detailed
 * illustration generation isn't available in this environment.
 */

export function ChurchIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} fill="none">
      {/* side domes */}
      <circle cx="48" cy="70" r="16" stroke="currentColor" strokeWidth="2.5" />
      <path d="M48 54v-14M42 42h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="34" y="86" width="28" height="60" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="192" cy="70" r="16" stroke="currentColor" strokeWidth="2.5" />
      <path d="M192 54v-14M186 42h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="178" y="86" width="28" height="60" stroke="currentColor" strokeWidth="2.5" />

      {/* main dome + body */}
      <circle cx="120" cy="52" r="26" stroke="currentColor" strokeWidth="3" />
      <path d="M120 26v-18M110 12h20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <rect x="76" y="78" width="88" height="68" stroke="currentColor" strokeWidth="3" />
      <path d="M105 146V112a15 15 0 0130 0v34" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="120" cy="98" r="8" stroke="currentColor" strokeWidth="2" />

      {/* couple silhouettes at the door */}
      <circle cx="104" cy="152" r="7" fill="currentColor" opacity="0.7" />
      <path d="M94 178c0-9 5-16 10-16s10 7 10 16" fill="currentColor" opacity="0.7" />
      <circle cx="136" cy="150" r="7" fill="currentColor" opacity="0.7" />
      <path d="M125 178c0-10 5-18 11-18s11 8 11 18" fill="currentColor" opacity="0.7" />

      <line x1="20" y1="146" x2="220" y2="146" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    </svg>
  )
}

export function BlessingIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 200" className={className} fill="none">
      {/* priest, center, raised hand */}
      <circle cx="120" cy="42" r="16" fill="currentColor" opacity="0.85" />
      <path d="M96 150c0-30 11-55 24-55s24 25 24 55" fill="currentColor" opacity="0.85" />
      <path d="M132 78c6-8 14-14 18-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M150 60v10M145 65h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

      {/* bride, left */}
      <circle cx="62" cy="58" r="13" fill="currentColor" opacity="0.55" />
      <path d="M40 150c0-26 10-48 22-48s22 22 22 48" fill="currentColor" opacity="0.55" />
      <path d="M50 46c4-6 20-6 24 0" stroke="currentColor" strokeWidth="2" opacity="0.55" />

      {/* groom, right */}
      <circle cx="180" cy="58" r="13" fill="currentColor" opacity="0.7" />
      <path d="M158 150c0-26 10-48 22-48s22 22 22 48" fill="currentColor" opacity="0.7" />

      <line x1="20" y1="150" x2="220" y2="150" stroke="currentColor" strokeWidth="2" opacity="0.35" />
    </svg>
  )
}

export function RingsOnBibleIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 160" className={className} fill="none">
      {/* open book */}
      <path d="M20 40c40-14 70-10 100 6V140c-30-16-60-20-100-6V40z" stroke="currentColor" strokeWidth="2.5" />
      <path d="M220 40c-40-14-70-10-100 6V140c30-16 60-20 100-6V40z" stroke="currentColor" strokeWidth="2.5" />
      <path d="M40 56c22-6 44-4 62 6M40 76c22-6 44-4 62 6M40 96c22-6 44-4 62 6" stroke="currentColor" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
      <path d="M200 56c-22-6-44-4-62 6M200 76c-22-6-44-4-62 6M200 96c-22-6-44-4-62 6" stroke="currentColor" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />

      {/* two clasped hands */}
      <path d="M70 96c14-10 30-14 50-10 22 4 40 2 56-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M74 108c16-8 34-10 52-6 20 4 38 0 52-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.75" />

      {/* ring */}
      <circle cx="128" cy="92" r="9" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="128" cy="86" r="3" fill="currentColor" />
    </svg>
  )
}
