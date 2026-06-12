import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { ArrowRight, Wand, X } from 'lucide-react'
import { SignedInLayout } from '@/components/signed-in/signed-in-layout'
import { HeroCard, ChecklistRow } from '@/components/ds'
import { AlertsWidget } from '@/components/inventory/alerts-widget'
import { useCrewAlerts } from '@/components/inventory/use-crew-alerts'
import { useActiveCrew } from '@/lib/active-crew'
import { useChecklistPrefs } from '@/lib/checklist-prefs'
import { useSupabase } from '@/lib/supabase'

interface ChecklistStep {
  key: string
  label: string
  complete: boolean
  resumeTo?: string
}

function buildPathA(
  hasCrew: boolean,
  spacesReady: boolean,
  hasItems: boolean,
  hasInvites: boolean,
): ChecklistStep[] {
  return [
    { key: 'sign-up', label: 'Sign Up', complete: true },
    {
      key: 'crew',
      label: 'Create your Crew',
      complete: hasCrew,
      resumeTo: '/onboarding',
    },
    {
      key: 'spaces',
      label: 'Set up spaces',
      complete: spacesReady,
      resumeTo: '/onboarding/spaces',
    },
    {
      key: 'items',
      label: 'Add first items',
      complete: hasItems,
      resumeTo: '/inventory/add',
    },
    {
      key: 'invite',
      label: 'Invite crew members',
      complete: hasInvites,
      resumeTo: '/onboarding',
    },
  ]
}

export default function DashboardPage() {
  const { user } = useUser()
  const supabase = useSupabase()
  const { loading: crewsLoading, memberships, activeCrewId } = useActiveCrew(
    user?.id ?? null,
  )
  const [steps, setSteps] = useState<ChecklistStep[]>(() =>
    buildPathA(false, false, false, false),
  )
  // Gates the checklist render until the count queries have resolved, so a
  // fully-onboarded admin never sees a flash of the stale default checklist.
  const [stepsReady, setStepsReady] = useState(false)
  const { counts: alertCounts, loading: alertsLoading } =
    useCrewAlerts(activeCrewId)
  const { prefs, dismissAll, clearStep } = useChecklistPrefs(
    user?.id ?? null,
    activeCrewId,
  )

  const firstName = user?.firstName ?? user?.username ?? 'there'

  useEffect(() => {
    if (crewsLoading) return
    let cancelled = false

    async function load() {
      if (!activeCrewId) {
        if (cancelled) return
        setSteps(buildPathA(false, false, false, false))
        setStepsReady(true)
        return
      }

      const active = memberships.find((m) => m.crew_id === activeCrewId)
      if (!active) return
      const isOwnerOrAdmin = active.is_owner || active.role === 'admin'

      // Members never see the onboarding checklist — skip the count queries.
      if (!isOwnerOrAdmin) {
        if (cancelled) return
        setStepsReady(true)
        return
      }

      // Path A — fetch counts; treat missing tables (42P01) as 0
      let spacesCount = 0
      let itemsCount = 0
      let memberCount = 1
      let pendingInvites = 0

      {
        const { count: sc, error: se } = await supabase
          .from('spaces')
          .select('space_id', { count: 'exact', head: true })
          .eq('crew_id', activeCrewId)
        if (cancelled) return
        if (!se || (se as { code?: string }).code === '42P01') {
          spacesCount = sc ?? 0
        }
      }

      {
        const { count: ic, error: ie } = await supabase
          .from('inventory_items')
          .select('inventory_item_id', { count: 'exact', head: true })
          .eq('crew_id', activeCrewId)
        if (cancelled) return
        if (!ie || (ie as { code?: string }).code === '42P01') {
          itemsCount = ic ?? 0
        }
      }

      {
        const { count: mc } = await supabase
          .from('crew_members')
          .select('crew_member_id', { count: 'exact', head: true })
          .eq('crew_id', activeCrewId)
          .is('deleted_at', null)
        if (cancelled) return
        memberCount = mc ?? 1
      }

      {
        const now = new Date().toISOString()
        const { count: invCount, error: invError } = await supabase
          .from('invites')
          .select('invite_id', { count: 'exact', head: true })
          .eq('crew_id', activeCrewId)
          .eq('status', 'pending')
          .gt('expires_at', now)
        if (cancelled) return
        if (!invError || (invError as { code?: string }).code === '42P01') {
          pendingInvites = invCount ?? 0
        }
      }

      setSteps(
        buildPathA(
          true,
          spacesCount > 1,
          itemsCount > 0,
          memberCount > 1 || pendingInvites > 0,
        ),
      )
      setStepsReady(true)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [supabase, activeCrewId, crewsLoading, memberships])

  // Counter, progress, and Resume stay computed over the FULL step set so
  // they remain truthful when individually cleared items leave the list.
  const completed = steps.filter((s) => s.complete).length
  const pct = steps.length > 0 ? (completed / steps.length) * 100 : 0
  const nextIncomplete = steps.find((s) => !s.complete)

  const activeMembership = memberships.find((m) => m.crew_id === activeCrewId)
  // No membership yet → prospective owner mid-onboarding keeps the checklist.
  const isOwnerOrAdmin =
    !activeMembership ||
    activeMembership.is_owner ||
    activeMembership.role === 'admin'
  const allComplete = steps.every((s) => s.complete)
  const clearedSet = new Set(prefs.cleared)
  const visibleSteps = steps.filter(
    (s) => !(s.complete && clearedSet.has(s.key)),
  )
  const showChecklist =
    !crewsLoading && stepsReady && isOwnerOrAdmin && !allComplete

  return (
    <SignedInLayout>
      <section className="pb-4 pt-5">
        <h1 className="font-display text-[30px] font-bold leading-[37.5px] text-ink-900">
          Welcome, {firstName}
        </h1>
      </section>

      {activeCrewId && (
        <section className="pb-4">
          <AlertsWidget counts={alertCounts} loading={alertsLoading} />
        </section>
      )}

      {showChecklist &&
        (prefs.dismissed ? (
          <section className="flex items-center justify-between rounded-lg bg-paper-100 px-5 py-3">
            <p className="font-body text-sm font-semibold text-ink-700">
              Finish setup
            </p>
            {nextIncomplete?.resumeTo && (
              <Link
                to={nextIncomplete.resumeTo}
                className="flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.35px] text-sage-600 hover:underline"
              >
                Resume
                <ArrowRight size={11} strokeWidth={2.5} />
              </Link>
            )}
          </section>
        ) : (
          <section className="flex flex-col gap-2 rounded-lg bg-paper-100 p-5">
            <HeroCard
              title="Your pantry is live 🎉"
              body="Complete the steps below to finish onboarding"
              badge={<Wand className="text-white" size={20} />}
            />

            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-base font-semibold leading-6 text-ink-900">
                  Setup Progress
                </h2>
                {activeCrewId && (
                  <button
                    type="button"
                    aria-label="Dismiss setup checklist"
                    onClick={dismissAll}
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-ink-600 hover:bg-paper-200"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-3 p-2">
                <div className="flex items-baseline justify-between">
                  <p className="font-body text-sm font-semibold uppercase tracking-[0.35px] text-ink-600">
                    {completed}/{steps.length} Complete
                  </p>
                  {nextIncomplete?.resumeTo && (
                    <Link
                      to={nextIncomplete.resumeTo}
                      className="flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.35px] text-sage-600 hover:underline"
                    >
                      Resume
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </Link>
                  )}
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-300">
                  <div
                    className="h-full rounded-full bg-sage-700 transition-[width] duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {visibleSteps.map((step) => (
                <li key={step.key}>
                  <ChecklistRow
                    label={step.label}
                    complete={step.complete}
                    onClear={
                      step.complete && activeCrewId
                        ? () => clearStep(step.key)
                        : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
    </SignedInLayout>
  )
}
