import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onClose: () => void
  /** Accessible label for the dialog. */
  ariaLabel?: string
  /** Optional title rendered at the top of the panel, below the grab handle. */
  title?: ReactNode
  children: ReactNode
}

/**
 * Bottom sheet — slides up from the bottom edge, with a grab handle and rounded
 * top corners. Generic shell; the consumer provides the body. Closes on scrim
 * click, ESC, or any descendant calling `onClose`.
 *
 * Mirrors {@link Sidenav}'s accessibility model: `role="dialog"` + `aria-modal`,
 * focus moves to the close affordance on open and restores on close. A full
 * focus trap is intentionally not implemented here (tracked alongside Sidenav's
 * N6). Slide-in animation is gated on `prefers-reduced-motion`.
 */
export function Sheet({
  open,
  onClose,
  ariaLabel = 'Sheet',
  title,
  children,
}: SheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  // Keep the latest onClose without making it an effect dependency — otherwise
  // a consumer passing a fresh callback each render (common) would re-run the
  // focus effect on every render and steal focus from inputs inside the sheet.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previousFocusRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-50 flex flex-col justify-end"
      onClick={onClose}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
      />
      <div
        className={cn(
          'animate-sheet-up relative flex max-h-[82vh] flex-col',
          'rounded-t-3xl bg-paper-50 px-6 pb-8 pt-3 shadow-ambient-lg',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-paper-300"
        />
        {title && (
          <div className="mb-4 shrink-0 font-display text-base font-bold text-ink-900">
            {title}
          </div>
        )}
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
