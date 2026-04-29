import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Clipboard,
  Home,
  Layers,
  MoreHorizontal,
  ShoppingCart,
} from 'lucide-react'

interface NavTab {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

const tabs: NavTab[] = [
  { to: '/dashboard', label: 'Home', icon: <Home size={18} />, end: true },
  { to: '/inventory', label: 'Inventory', icon: <Clipboard size={20} /> },
  { to: '/shopping', label: 'Shopping', icon: <ShoppingCart size={20} /> },
  { to: '/batches', label: 'Batches', icon: <Layers size={19} /> },
  { to: '/more', label: 'More', icon: <MoreHorizontal size={16} /> },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto flex max-w-[512px] flex-col border-t border-[var(--glass-border)] bg-[var(--glass-bg)] px-2 pt-[9px] backdrop-blur-md"
    >
      <ul className="flex h-14 items-center justify-around">
        {tabs.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.end}
              className="flex w-16 flex-col items-center justify-center gap-1"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex items-center justify-center rounded-full px-4 py-1 transition ${
                      isActive ? 'bg-paper-300/50 text-sage-700' : 'text-ink-700'
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={`font-body text-[10px] font-medium leading-[10px] ${
                      isActive ? 'text-sage-700' : 'text-ink-700'
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
