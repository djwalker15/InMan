import { useEffect, useState } from 'react'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { useSupabase } from '@/lib/supabase'
import type { Crew, CrewMember } from '@/lib/types'

type MembershipRow = {
  role: CrewMember['role']
  crews: Pick<Crew, 'crew_id' | 'name'> | null
}

export default function DashboardPage() {
  const { user } = useUser()
  const supabase = useSupabase()
  const [memberships, setMemberships] = useState<MembershipRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { data, error } = await supabase
        .from('crew_members')
        .select('role, crews(crew_id, name)')
        .is('deleted_at', null)
        .returns<MembershipRow[]>()
      if (cancelled) return
      if (error) {
        setError(error.message)
        setMemberships([])
        return
      }
      setMemberships(data ?? [])
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [supabase])

  return (
    <div className="mx-auto flex h-full w-full max-w-3xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          InMan — Dashboard
        </h1>
        <UserButton afterSignOutUrl="/sign-in" />
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">Signed in as</p>
        <p className="font-medium text-slate-900">
          {user?.primaryEmailAddress?.emailAddress ?? user?.id}
        </p>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-900">Your crews</h2>
          <Link
            to="/onboarding"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create crew
          </Link>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600">Error loading crews: {error}</p>
        )}
        {memberships === null && !error && (
          <p className="mt-3 text-sm text-slate-500">Loading…</p>
        )}
        {memberships && memberships.length === 0 && !error && (
          <p className="mt-3 text-sm text-slate-500">
            No crews yet. Create one to get started.
          </p>
        )}
        {memberships && memberships.length > 0 && (
          <ul className="mt-3 divide-y divide-slate-100">
            {memberships.map((m) => (
              <li
                key={m.crews?.crew_id ?? Math.random()}
                className="flex items-center justify-between py-2"
              >
                <span className="font-medium text-slate-900">
                  {m.crews?.name ?? '(unnamed)'}
                </span>
                <span className="text-xs uppercase tracking-wide text-slate-500">
                  {m.role}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
