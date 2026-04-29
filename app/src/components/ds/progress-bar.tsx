import { cn } from '@/lib/utils'

interface ProgressBarProps {
  step: number
  total: number
  label?: string
  className?: string
}

export function ProgressBar({ step, total, label, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (step / total) * 100))
  const eyebrow = label ?? `STEP ${step} OF ${total}`
  return (
    <div className={cn('flex w-full flex-col gap-2', className)}>
      <span className="font-display text-[11px] font-bold uppercase tracking-[0.55px] text-ink-300">
        {eyebrow}
      </span>
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={0}
        aria-valuemax={total}
        className="relative h-2 overflow-hidden rounded-full bg-paper-300"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-sage-700 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
