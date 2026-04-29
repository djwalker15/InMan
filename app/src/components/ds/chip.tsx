import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ChipVariant = 'default' | 'sage' | 'warn' | 'error'

interface ChipProps {
  children: ReactNode
  variant?: ChipVariant
  leading?: ReactNode
  className?: string
}

const variantClass: Record<ChipVariant, string> = {
  default: 'bg-paper-250 text-ink-600',
  sage: 'bg-sage-100 text-sage-700',
  warn: 'bg-[color:rgba(217,119,6,0.12)] text-warn',
  error: 'bg-[color:rgba(186,26,26,0.08)] text-error',
}

export function Chip({
  children,
  variant = 'default',
  leading,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-body text-xs',
        variantClass[variant],
        className,
      )}
    >
      {leading && <span className="flex items-center">{leading}</span>}
      {children}
    </span>
  )
}
