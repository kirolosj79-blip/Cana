import type { ReactNode } from 'react'

interface QuestionCardProps {
  /** The question itself, shown as a bold title at the top of the card. */
  question: string
  children: ReactNode
  labelExtra?: ReactNode
}

/**
 * Wraps a single form field in its own white card with the question as a
 * heading — matching the reference design's "one card per question" look,
 * used across the photo-background registration screens instead of one
 * long continuous card holding several fields.
 */
export function QuestionCard({ question, children, labelExtra }: QuestionCardProps) {
  return (
    <div className="rounded-[var(--radius-lg)] bg-parchment-0 border border-ink-100 px-4 pt-3.5 pb-4 shadow-[var(--shadow-soft-sm)] space-y-2 w-full min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-2 min-w-0">
        <p className="text-sm font-bold on-photo-text min-w-0 break-words">{question}</p>
        {labelExtra}
      </div>
      {children}
    </div>
  )
}
