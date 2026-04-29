import { useState, type FormEvent } from 'react'
import { useSignIn } from '@clerk/clerk-react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { CloseButton, TopNav } from '@/components/top-nav'
import { AuthSeparator } from '@/components/auth/auth-separator'
import { LabeledInput } from '@/components/auth/labeled-input'
import { SocialAuthButton } from '@/components/auth/social-auth-button'
import { clerkErrorMessage } from '@/lib/clerk-error'

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const navigate = useNavigate()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!isLoaded || !signIn || !setActive) return
    setError(null)
    setSubmitting(true)
    try {
      const attempt = await signIn.create({ identifier, password })
      if (attempt.status === 'complete' && attempt.createdSessionId) {
        await setActive({ session: attempt.createdSessionId })
        navigate('/dashboard', { replace: true })
      } else {
        setError('Additional verification step required (not yet supported).')
      }
    } catch (err) {
      setError(clerkErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleOAuth(strategy: 'oauth_google' | 'oauth_facebook') {
    if (!signIn) return
    setError(null)
    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard',
      })
    } catch (err) {
      setError(clerkErrorMessage(err))
    }
  }

  return (
    <div className="min-h-full bg-paper-150">
      <TopNav rightAction={<CloseButton />} />

      <main className="mx-auto flex w-full max-w-[448px] flex-col px-6 py-6">
        <div className="flex w-full flex-col items-center">
          <h1 className="font-display text-[36px] font-extrabold leading-[40px] text-ink-900">
            Sign In
          </h1>
          <p className="mt-4 text-lg leading-[29.25px] text-ink-600">
            Welcome back
          </p>
        </div>

        <div className="mt-6 flex w-full flex-col gap-4">
          <SocialAuthButton
            provider="google"
            label="Continue with Google"
            onClick={() => void handleOAuth('oauth_google')}
          />
          <SocialAuthButton
            provider="facebook"
            label="Continue with Facebook"
            onClick={() => void handleOAuth('oauth_facebook')}
          />
        </div>

        <AuthSeparator>OR USE YOUR EMAIL/PHONE</AuthSeparator>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6">
          <LabeledInput
            label="EMAIL OR PHONE"
            icon={<Mail size={20} />}
            type="text"
            inputMode="text"
            value={identifier}
            onChange={setIdentifier}
            placeholder="name@company.com"
            autoComplete="username"
            required
          />
          <div>
            <LabeledInput
              label="PASSWORD"
              icon={<Lock size={20} />}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-ink-600"
                  aria-label={
                    showPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />
            <div className="mt-2 flex justify-end px-1">
              <button
                type="button"
                className="text-xs italic text-sage-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !isLoaded}
            className="flex items-center justify-center rounded-lg bg-sage-600 py-5 font-display text-lg font-bold text-white shadow-cta-strong transition hover:bg-sage-700 disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center font-display text-base font-semibold text-ink-900">
          Don't have an account?{' '}
          <Link to="/sign-up" className="text-sage-600 hover:underline">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  )
}
