import type { ReactNode } from 'react'
import { ArrowLeft, X, Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

type LeadingVariant = 'menu' | 'back' | 'close' | 'none'

interface NavHeaderProps {
  /** Centered title. Empty string hides the title region. */
  title?: ReactNode
  /** Optional subtitle below the title. */
  subtitle?: ReactNode
  /** Leading slot — defaults to a hamburger menu button. */
  leading?: LeadingVariant
  /** Where Back / Close should navigate. */
  leadingTo?: string
  /** Right-side slot for an action (avatar, sign-in link, get-started pill). */
  trailing?: ReactNode
  /** Tap-handler for the leading menu/back/close, overrides default nav. */
  onLeadingClick?: () => void
  className?: string
}

const Icon: Record<Exclude<LeadingVariant, 'none'>, typeof Menu> = {
  menu: Menu,
  back: ArrowLeft,
  close: X,
}

const ariaLabel: Record<Exclude<LeadingVariant, 'none'>, string> = {
  menu: 'Open menu',
  back: 'Back',
  close: 'Close',
}

export function NavHeader({
  title,
  subtitle,
  leading = 'menu',
  leadingTo,
  trailing,
  onLeadingClick,
  className,
}: NavHeaderProps) {
  const navigate = useNavigate()

  function handleLeading() {
    if (onLeadingClick) return onLeadingClick()
    if (leading === 'back') return navigate(-1)
    if (leadingTo) return navigate(leadingTo)
  }

  const LeadingIcon = leading !== 'none' ? Icon[leading] : null

  return (
    <header
      className={cn(
        'relative flex h-[72px] w-full items-center bg-paper-150/80 px-6 backdrop-blur-md',
        className,
      )}
    >
      {LeadingIcon && (
        <button
          type="button"
          aria-label={ariaLabel[leading as Exclude<LeadingVariant, 'none'>]}
          onClick={handleLeading}
          className={cn(
            'absolute left-6 flex size-10 items-center justify-center text-ink-900 transition',
            leading === 'close'
              ? 'rounded-lg bg-paper-50 hover:bg-paper-50/80'
              : 'text-sage-700 hover:text-sage-600',
          )}
        >
          <LeadingIcon size={leading === 'menu' ? 26 : 20} strokeWidth={2.5} />
        </button>
      )}
      {title !== undefined && title !== '' && (
        <div className="mx-auto flex max-w-[60%] flex-col items-center text-center">
          <h1 className="font-display text-base font-bold leading-6 text-ink-900">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body text-xs text-ink-600">{subtitle}</p>
          )}
        </div>
      )}
      {trailing && <div className="absolute right-6">{trailing}</div>}
    </header>
  )
}
