import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { ArrowLeft, ShieldOff } from 'lucide-react'
import { HeroCard } from '@/components/ds'
import { SignedInLayout } from '@/components/signed-in/signed-in-layout'
import { AccountDangerZone } from '@/components/account/danger-zone'

export default function AccountSettingsPage() {
  const { user } = useUser()
  const displayName =
    user?.firstName || user?.username || user?.primaryEmailAddress?.emailAddress || 'You'

  return (
    <SignedInLayout>
      <div className="flex w-full flex-col gap-5 pt-4 pb-12">
        <header className="flex items-center gap-2">
          <Link
            to="/dashboard"
            aria-label="Back to dashboard"
            className="flex size-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-paper-200"
          >
            <ArrowLeft size={20} strokeWidth={2.25} />
          </Link>
          <h1 className="font-display text-[28px] font-bold leading-[34px] tracking-[-0.4px] text-ink-900">
            Account
          </h1>
        </header>

        <HeroCard
          title={displayName}
          body={
            <span>
              Profile, email, and password live in Clerk. Use the avatar
              menu (top-right) to manage them. Account-level deletion lives
              below.
            </span>
          }
          badge={<ShieldOff size={20} aria-hidden />}
        />

        <section
          aria-label="Danger zone"
          className="flex flex-col gap-4"
        >
          <AccountDangerZone />
        </section>
      </div>
    </SignedInLayout>
  )
}
