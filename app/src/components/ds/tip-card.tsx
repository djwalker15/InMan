import type { ReactNode } from 'react'

interface TipCardProps {
  children: ReactNode
}

export function TipCard({ children }: TipCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-warn bg-paper-100 p-5">
      <span
        aria-hidden
        className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-warn font-display text-sm font-bold text-white"
      >
        !
      </span>
      <div className="font-body text-sm leading-[22px] text-ink-900">
        {children}
      </div>
    </div>
  )
}
