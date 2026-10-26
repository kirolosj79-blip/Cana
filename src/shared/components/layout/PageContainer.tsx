import type { ReactNode } from 'react'
import { cn } from '@/shared/utils/cn'
import { HeartsBackdrop } from '@/shared/components/ui/HeartsBackdrop'

export function PageContainer({
  children,
  className,
  noPadding,
  hideHearts,
  fullHeight,
  photoBackground,
}: {
  children: ReactNode
  className?: string
  noPadding?: boolean
  hideHearts?: boolean
  /** Bounds the page to exactly the viewport height (instead of growing
   *  with content) so an inner `overflow-y-auto` region becomes the real
   *  scroll container — needed for screens with a sticky header/footer
   *  "app shell" layout (like the registration wizard), where otherwise
   *  the whole window scrolls instead of the intended inner area. */
  fullHeight?: boolean
  /** The couple's own photo as a full-bleed background (from the phone
   *  entry screen through the registration wizard), with a theme-reactive
   *  gradient overlay so text/cards on top stay legible in both light and
   *  dark mode — matching the reference design. */
  photoBackground?: boolean
}) {
  return (
    <div className={cn('relative bg-parchment-50', fullHeight ? 'h-dvh overflow-hidden' : 'min-h-screen')}>
      {photoBackground && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/couple-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-photo-overlay" />
          {/* Extra darkening just behind the top ~200px — the sticky
              header (logo, icons, step title) sits directly on the photo
              with no card behind it, so it needs stronger contrast than
              the lighter overlay used for the rest of the page (where the
              white question cards do the legibility work instead). */}
          <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-photo-overlay-header to-transparent" />
        </>
      )}
      {!hideHearts && <HeartsBackdrop />}
      <div
        className={cn(
          'mx-auto max-w-md bg-transparent flex flex-col relative z-10',
          fullHeight ? 'h-full overflow-hidden' : 'min-h-screen',
          !noPadding && 'px-5',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
