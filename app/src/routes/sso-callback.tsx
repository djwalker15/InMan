import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

export default function SSOCallbackPage() {
  return (
    <div className="flex h-full items-center justify-center text-ink-600">
      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      />
      <span>Signing you in…</span>
    </div>
  )
}
