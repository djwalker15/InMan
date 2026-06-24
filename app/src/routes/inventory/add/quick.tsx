import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { SignedInLayout } from '@/components/signed-in/signed-in-layout'
import { QuickAddForm } from '@/components/inventory/quick-add-form'
import { useActiveCrew } from '@/lib/active-crew'

export default function QuickAddPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const { loading: crewLoading, activeCrewId } = useActiveCrew(
    user?.id ?? null,
  )

  const [sessionCount, setSessionCount] = useState(0)
  const [lastAddedName, setLastAddedName] = useState<string | null>(null)

  function handleSaved(name: string) {
    setLastAddedName(name)
    setSessionCount((n) => n + 1)
  }

  return (
    <SignedInLayout>
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-5 pt-4 pb-12">
        <header className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Back to add methods"
            onClick={() => navigate('/inventory/add')}
            className="flex size-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-paper-200"
          >
            <ArrowLeft size={20} strokeWidth={2.25} />
          </button>
          <h1 className="font-display text-[28px] font-bold leading-[34px] tracking-[-0.4px] text-ink-900">
            Quick add
          </h1>
        </header>

        {sessionCount > 0 && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-3 rounded-xl bg-sage-100/40 p-3"
          >
            <span
              aria-hidden
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-sage-700 text-white"
            >
              <Check size={14} strokeWidth={3} />
            </span>
            <div className="flex flex-col">
              <p className="font-display text-sm font-bold text-ink-900">
                {lastAddedName ? `Added ${lastAddedName}.` : 'Item added.'}
              </p>
              <p className="font-body text-xs text-ink-700">
                {sessionCount} item{sessionCount === 1 ? '' : 's'} added this
                session. Keep going, or tap back when you're done.
              </p>
            </div>
          </div>
        )}

        {crewLoading ? (
          <p className="font-body text-sm text-ink-600">Loading…</p>
        ) : !activeCrewId || !user ? (
          <p className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700">
            We couldn't load your crew. Finish onboarding first.
          </p>
        ) : (
          <QuickAddForm
            crewId={activeCrewId}
            userId={user.id}
            onSaved={handleSaved}
          />
        )}
      </div>
    </SignedInLayout>
  )
}
