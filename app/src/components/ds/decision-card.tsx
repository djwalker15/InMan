import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DecisionCardProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  glyph: ReactNode
  title: string
  body: string
  selected?: boolean
  badge?: ReactNode
}

export function DecisionCard({
  glyph,
  title,
  body,
  selected = false,
  badge,
  className,
  type = 'button',
  ...rest
}: DecisionCardProps) {
  return (
    <button
      type={type}
      role="radio"
      aria-checked={selected}
      {...rest}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl p-4 text-left transition',
        'shadow-ambient-lg active:scale-[0.99]',
        selected
          ? 'bg-[rgba(74,130,101,0.08)] ring-2 ring-sage-700'
          : 'bg-paper-50 ring-2 ring-paper-300 hover:bg-paper-100',
        className,
      )}
    >
      <span
        aria-hidden
        className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-paper-200 text-2xl"
      >
        {glyph}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-bold text-ink-900">
          {title}
        </span>
        <span className="mt-1 block font-body text-sm leading-[18px] text-ink-700">
          {body}
        </span>
        {badge && <span className="mt-3 inline-block">{badge}</span>}
      </span>
      <span
        aria-hidden
        className={cn(
          'mt-1 flex size-[22px] shrink-0 items-center justify-center rounded-full transition',
          selected
            ? 'bg-sage-700 text-white'
            : 'border-2 border-paper-300 bg-transparent',
        )}
      >
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
    </button>
  )
}
