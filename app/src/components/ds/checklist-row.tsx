import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistRowProps {
  label: string
  complete: boolean
  className?: string
}

export function ChecklistRow({ label, complete, className }: ChecklistRowProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-3 rounded-lg p-2',
        complete ? 'bg-paper-100' : 'bg-paper-300',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded',
          complete
            ? 'border-2 border-sage-700 bg-sage-700 text-white'
            : 'border-2 border-sage-300',
        )}
      >
        {complete && <Check size={12} strokeWidth={3} />}
      </span>
      <span
        className={cn(
          'font-body text-sm leading-5 text-ink-700',
          complete && 'line-through',
        )}
      >
        {label}
      </span>
    </div>
  )
}
