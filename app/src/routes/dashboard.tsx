import { useEffect, useMemo, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, Wand } from 'lucide-react'
import { SignedInLayout } from '@/components/signed-in/signed-in-layout'
import { useSupabase } from '@/lib/supabase'

interface ChecklistStep {
  key: string
  label: string
  complete: boolean
  resumeTo?: string
}

export default function DashboardPage() {
  const { user } = useUser()
  const supabase = useSupabase()
  const [hasCrew, setHasCrew] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { count, error } = await supabase
        .from('crew_members')
        .select('crew_member_id', { count: 'exact', head: true })
        .is('deleted_at', null)
      if (cancelled) return
      setHasCrew(!error && (count ?? 0) > 0)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [supabase])

  const steps = useMemo<ChecklistStep[]>(
    () => [
      { key: 'sign-up', label: 'Sign Up', complete: true },
      {
        key: 'crew',
        label: 'Create your Crew',
        complete: hasCrew === true,
        resumeTo: '/onboarding',
      },
      { key: 'spaces', label: 'Set up spaces', complete: false, resumeTo: '/onboarding' },
      { key: 'items', label: 'Add first items', complete: false, resumeTo: '/onboarding' },
      {
        key: 'invite',
        label: 'Invite your crew',
        complete: false,
        resumeTo: '/onboarding',
      },
    ],
    [hasCrew],
  )

  const completed = steps.filter((s) => s.complete).length
  const pct = (completed / steps.length) * 100
  const nextIncomplete = steps.find((s) => !s.complete)
  const firstName = user?.firstName ?? user?.username ?? 'there'

  return (
    <SignedInLayout>
      <section className="pb-4 pt-5">
        <h1 className="font-display text-[30px] font-bold leading-[37.5px] text-ink">
          Welcome, {firstName}
        </h1>
      </section>

      <section className="flex flex-col gap-2 rounded-lg bg-surface-input p-5">
        <HeroCard />

        <div className="flex flex-col">
          <h2 className="font-display text-base font-semibold leading-6 text-ink">
            Setup Progress
          </h2>
          <div className="flex flex-col gap-3 p-2">
            <div className="flex items-baseline justify-between">
              <p className="font-body-alt text-sm font-semibold uppercase tracking-[0.35px] text-ink-chip">
                {completed}/{steps.length} Complete
              </p>
              {nextIncomplete?.resumeTo && (
                <Link
                  to={nextIncomplete.resumeTo}
                  className="flex items-center gap-2 font-body-alt text-sm font-semibold uppercase tracking-[0.35px] text-brand-500 hover:underline"
                >
                  Resume
                  <ArrowRight size={11} strokeWidth={2.5} />
                </Link>
              )}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-track">
              <div
                className="h-full rounded-full bg-brand-700 transition-[width] duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {steps.map((step) => (
            <li key={step.key}>
              <ChecklistRow label={step.label} complete={step.complete} />
            </li>
          ))}
        </ul>
      </section>
    </SignedInLayout>
  )
}

function HeroCard() {
  return (
    <div
      className="relative flex h-[99px] w-full items-center justify-between overflow-hidden rounded-lg p-5 shadow-floating"
      style={{
        backgroundImage: 'linear-gradient(162.7deg, #31694d 0%, #4a8265 100%)',
      }}
    >
      <div className="flex flex-col justify-center gap-[5px]">
        <h3 className="font-display text-[18px] font-bold leading-[22.5px] text-white">
          Your pantry is live 🎉
        </h3>
        <p className="font-body-alt text-sm leading-5 text-accent-mint opacity-90">
          Complete the steps below
          <br />
          to finish onboarding
        </p>
      </div>
      <div className="flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-[2px]">
        <Wand className="text-white" size={20} />
      </div>
    </div>
  )
}

function ChecklistRow({ label, complete }: { label: string; complete: boolean }) {
  return (
    <div
      className={`flex w-full items-center gap-3 rounded-lg p-2 ${
        complete ? 'bg-surface-input' : 'bg-surface-track'
      }`}
    >
      <span
        aria-hidden
        className={`flex size-5 shrink-0 items-center justify-center rounded ${
          complete
            ? 'border-2 border-brand-700 bg-brand-700 text-white'
            : 'border-2 border-[#c0c9c1]'
        }`}
      >
        {complete && <Check size={12} strokeWidth={3} />}
      </span>
      <span
        className={`font-body-alt text-sm leading-5 text-ink-body ${
          complete ? 'line-through' : ''
        }`}
      >
        {label}
      </span>
    </div>
  )
}
