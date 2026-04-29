import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import {
  Boxes,
  Clipboard,
  Home,
  Layers,
  LogOut,
  Settings,
  ShoppingCart,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidenavLink {
  to: string
  label: string
  icon: ReactNode
  end?: boolean
}

interface PendingLink {
  label: string
  icon: ReactNode
  /** Phase / journey this destination is queued behind. */
  pendingNote: string
}

/** Live destinations — already-shipped routes the user can actually visit. */
const liveLinks: SidenavLink[] = [
  { to: '/dashboard', label: 'Home', icon: <Home size={18} />, end: true },
  { to: '/inventory', label: 'Inventory', icon: <Clipboard size={18} /> },
  { to: '/spaces', label: 'Spaces', icon: <Boxes size={18} /> },
]

/**
 * Pending destinations — kept visible (not hidden) so users can see what's
 * coming. Disabled with a "Coming soon" affordance until their phase lands.
 * Each phase that ships a route should promote the matching entry from this
 * list into `liveLinks` (Navigation strategy task N5).
 */
const pendingLinks: PendingLink[] = [
  {
    label: 'Shopping',
    icon: <ShoppingCart size={18} />,
    pendingNote: 'Later',
  },
  {
    label: 'Batches',
    icon: <Layers size={18} />,
    pendingNote: 'Later',
  },
  {
    label: 'Crew settings',
    icon: <Settings size={18} />,
    pendingNote: 'Phase 5',
  },
]

interface SidenavContentProps {
  /** Called when the user picks a destination — the parent should close the drawer. */
  onNavigate: () => void
}

export function SidenavContent({ onNavigate }: SidenavContentProps) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    onNavigate()
    await signOut()
    navigate('/sign-in', { replace: true })
  }

  return (
    <nav aria-label="Primary destinations" className="flex flex-1 flex-col">
      <ul className="flex flex-col gap-1">
        {liveLinks.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 font-body text-sm transition',
                  isActive
                    ? 'bg-paper-200 font-semibold text-sage-700'
                    : 'text-ink-700 hover:bg-paper-100',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span aria-hidden className="flex">
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  {isActive && (
                    <span aria-current="page" className="sr-only">
                      Current page
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-6 px-3">
        <p className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-300">
          Coming soon
        </p>
      </div>
      <ul className="mt-2 flex flex-col gap-1">
        {pendingLinks.map((link) => (
          <li key={link.label}>
            <span
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 font-body text-sm text-ink-500"
              title={`Coming with ${link.pendingNote}`}
            >
              <span aria-hidden className="flex">
                {link.icon}
              </span>
              <span>{link.label}</span>
              <span className="ml-auto rounded-full bg-paper-200 px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.4px] text-ink-600">
                {link.pendingNote}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 font-body text-sm text-ink-700 transition hover:bg-paper-100"
        >
          <LogOut size={18} aria-hidden />
          <span>Sign out</span>
        </button>
      </div>
    </nav>
  )
}
