import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CtaTrayProps {
  children: ReactNode
  /**
   * When true (the default), the tray sticks to the bottom of the viewport
   * with glassmorphism. Pass false to render in flow.
   */
  sticky?: boolean
  className?: string
}

export function CtaTray({ children, sticky = true, className }: CtaTrayProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 px-4 py-4',
        sticky &&
          'sticky bottom-0 z-10 mt-auto border-t border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md',
        className,
      )}
    >
      {children}
    </div>
  )
}
