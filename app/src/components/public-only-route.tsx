import { useAuth } from '@clerk/clerk-react'
import { Navigate, Outlet } from 'react-router-dom'

export function PublicOnlyRoute() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center text-ink-muted">
        Loading…
      </div>
    )
  }

  if (isSignedIn) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
