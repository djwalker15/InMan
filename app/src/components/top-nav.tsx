import type { ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

interface TopNavProps {
  rightAction?: ReactNode
  onMenuClick?: () => void
}

export function TopNav({ rightAction, onMenuClick }: TopNavProps) {
  return (
    <header className="relative flex h-[72px] w-full items-center bg-paper-150/80 px-6 backdrop-blur-md">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuClick}
        disabled={!onMenuClick}
        className="absolute left-6 flex size-8 items-center justify-center text-sage-700 disabled:cursor-not-allowed disabled:text-ink-500"
      >
        <Menu size={26} strokeWidth={2.5} />
      </button>
      <div className="mx-auto">
        <img
          src="/brand/logo.svg"
          alt="InMan"
          className="h-[33px] w-auto select-none"
          draggable={false}
        />
      </div>
      {rightAction && <div className="absolute right-6">{rightAction}</div>}
    </header>
  )
}

interface CloseButtonProps {
  to?: string
}

export function CloseButton({ to = '/' }: CloseButtonProps) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      aria-label="Close"
      className="flex size-10 items-center justify-center rounded-lg bg-paper-50 text-ink-900 transition hover:bg-paper-50/80"
    >
      <X size={20} />
    </button>
  )
}

export function GetStartedPill() {
  return (
    <Link
      to="/sign-up"
      className="flex h-[39px] w-[67px] flex-col items-center justify-center rounded-full bg-sage-600 text-[10px] font-semibold leading-[12px] text-white shadow-ambient-md transition hover:bg-sage-700"
    >
      <span>Get</span>
      <span>started</span>
    </Link>
  )
}
