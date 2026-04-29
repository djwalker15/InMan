import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface HeroCardProps {
  title: string
  body: ReactNode
  badge?: ReactNode
  className?: string
}

export function HeroCard({ title, body, badge, className }: HeroCardProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-between gap-4 overflow-hidden rounded-lg p-5 shadow-ambient-lg',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(162.7deg, #31694d 0%, #4a8265 100%)',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-1 -top-1 size-[104px] rounded-full bg-sage-100/20"
      />
      <div className="relative flex max-w-[220px] flex-col gap-[5px]">
        <h3 className="font-display text-[18px] font-bold leading-[22.5px] text-white">
          {title}
        </h3>
        <p className="font-body text-sm leading-5 text-sage-100/95">{body}</p>
      </div>
      {badge && (
        <div className="relative flex size-12 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-[2px]">
          {badge}
        </div>
      )}
    </div>
  )
}
