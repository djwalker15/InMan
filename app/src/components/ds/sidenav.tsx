import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidenavProps {
  open: boolean
  onClose: () => void
  /** Accessible label for the dialog. */
  ariaLabel?: string
  /** Optional title rendered at the top of the panel. */
  title?: ReactNode
  /** Width of the panel in pixels (default 288). */
  width?: number
  children: ReactNode
}

/**
 * Slide-in drawer used as the app's primary side navigation. Generic shell —
 * the consumer provides the link list as children. Closes on backdrop click,
 * ESC, or any descendant calling `onClose` (e.g. a NavLink wrapper).
 *
 * Focus is moved to the close button on open and restored to the previously
 * focused element on close. A full focus trap is intentionally not implemented
 * here — that's tracked in the Navigation strategy list (N6).
 */
export function Sidenav({
  open,
  onClose,
  ariaLabel = 'Side navigation',
  title,
  width = 288,
  children,
}: SidenavProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    previousFocusRef.current = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previousFocusRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className="fixed inset-0 z-40 flex"
      onClick={onClose}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm"
      />
      <aside
        className={cn(
          'relative flex h-full flex-col bg-paper-50 shadow-ambient-lg',
        )}
        style={{ width, maxWidth: '85vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-4 py-3">
          {title ? (
            <div className="font-display text-base font-bold text-ink-900">
              {title}
            </div>
          ) : (
            <span aria-hidden />
          )}
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-ink-700 transition hover:bg-paper-200"
          >
            <X size={18} />
          </button>
        </header>
        <div className="flex flex-1 flex-col overflow-y-auto px-2 pb-4">
          {children}
        </div>
      </aside>
    </div>
  )
}
