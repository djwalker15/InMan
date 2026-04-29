import type { ReactNode } from 'react'

export function AuthSeparator({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-center gap-4 py-4">
      <div className="h-px flex-1 bg-paper-300" />
      <span className="text-[10px] font-bold uppercase tracking-[1px] text-ink-600">
        {children}
      </span>
      <div className="h-px flex-1 bg-paper-300" />
    </div>
  )
}
