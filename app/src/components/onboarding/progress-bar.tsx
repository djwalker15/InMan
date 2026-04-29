interface ProgressBarProps {
  step: number
  total: number
}

export function ProgressBar({ step, total }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (step / total) * 100))
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="font-display text-base font-medium tracking-[0.4px] text-ink-900">
          Step {step} of {total}
        </span>
        <span className="font-body text-sm text-ink-700">
          {step} of {total}
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-paper-300">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-sage-700 transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
