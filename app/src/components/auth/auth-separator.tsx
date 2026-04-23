import type { ReactNode } from 'react'

export function AuthSeparator({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-4 py-4">
      <div className="h-px flex-1 bg-[#e5e7eb]" />
      <span className="text-[10px] font-bold uppercase tracking-[1px] text-ink-muted">
        {children}
      </span>
      <div className="h-px flex-1 bg-[#e5e7eb]" />
    </div>
  )
}
