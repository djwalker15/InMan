import { Link } from 'react-router-dom'
import { OnboardingLayout } from '@/components/onboarding/onboarding-layout'

export default function InvitePage() {
  return (
    <OnboardingLayout step={2} total={5}>
      <div className="pb-10 pl-2">
        <h1 className="font-display text-[30px] font-bold leading-[1.3] tracking-[-0.4px] text-ink-900">
          Enter your invite code
        </h1>
        <p className="mt-4 font-body text-base leading-[26px] text-ink-700">
          Invite acceptance isn't wired up yet. Ask your crew Admin for a code,
          or go back and start a new crew.
        </p>
      </div>

      <div className="mt-auto pb-6">
        <Link
          to="/onboarding"
          className="inline-block font-body text-sm text-sage-600 hover:underline"
        >
          ← Back
        </Link>
      </div>
    </OnboardingLayout>
  )
}
