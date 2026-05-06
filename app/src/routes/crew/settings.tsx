import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import {
  AlertTriangle,
  ArrowLeft,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { Chip, HeroCard } from '@/components/ds'
import { SignedInLayout } from '@/components/signed-in/signed-in-layout'
import { useActiveCrew } from '@/lib/active-crew'
import { useSupabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface CrewDetail {
  crew_id: string
  name: string
  owner_id: string
  created_at: string
  settings: Record<string, unknown> | null
  deletion_requested_at: string | null
}

interface MemberRow {
  crew_member_id: string
  user_id: string
  role: string
  created_at: string
}

interface InviteRow {
  invite_id: string
  email: string
  role: string
  status: string
  created_at: string
  expires_at: string
}

interface CrewSnapshot {
  crewId: string
  crew: CrewDetail | null
  members: MemberRow[]
  pendingInvites: InviteRow[]
}

type TabKey = 'general' | 'members' | 'permissions' | 'danger'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'members', label: 'Members' },
  { key: 'permissions', label: 'Permissions' },
  { key: 'danger', label: 'Danger zone' },
]

const ROLE_RANK: Record<string, number> = {
  admin: 0,
  member: 1,
  viewer: 2,
}

export default function CrewSettingsPage() {
  const { user } = useUser()
  const supabase = useSupabase()
  const [searchParams, setSearchParams] = useSearchParams()
  const { loading: crewsLoading, memberships, activeCrewId } = useActiveCrew(
    user?.id ?? null,
  )

  const requestedCrewId = searchParams.get('crew')
  const tab = parseTab(searchParams.get('tab'))
  const crewId = requestedCrewId ?? activeCrewId

  const membership = useMemo(
    () =>
      crewId ? memberships.find((m) => m.crew_id === crewId) ?? null : null,
    [memberships, crewId],
  )

  const [snapshot, setSnapshot] = useState<CrewSnapshot | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Loading is derived: we have not yet fetched data for the current crewId.
  const loading = crewId !== null && snapshot?.crewId !== crewId && !error
  const crew = snapshot?.crewId === crewId ? snapshot.crew : null
  const members = snapshot?.crewId === crewId ? snapshot.members : []
  const pendingInvites =
    snapshot?.crewId === crewId ? snapshot.pendingInvites : []

  useEffect(() => {
    if (!crewId || !supabase) return
    let cancelled = false

    async function load(id: string) {
      try {
        const [crewRes, membersRes, invitesRes] = await Promise.all([
          supabase
            .from('crews')
            .select(
              'crew_id, name, owner_id, created_at, settings, deletion_requested_at',
            )
            .eq('crew_id', id)
            .is('deleted_at', null)
            .maybeSingle(),
          supabase
            .from('crew_members')
            .select('crew_member_id, user_id, role, created_at')
            .eq('crew_id', id)
            .is('deleted_at', null)
            .order('created_at', { ascending: true }),
          supabase
            .from('invites')
            .select(
              'invite_id, email, role, status, created_at, expires_at',
            )
            .eq('crew_id', id)
            .eq('status', 'pending')
            .is('deleted_at', null)
            .order('created_at', { ascending: false }),
        ])
        if (cancelled) return
        if (crewRes.error) throw crewRes.error
        if (membersRes.error) throw membersRes.error
        if (invitesRes.error) throw invitesRes.error
        setSnapshot({
          crewId: id,
          crew: (crewRes.data as CrewDetail | null) ?? null,
          members: (membersRes.data as MemberRow[] | null) ?? [],
          pendingInvites: (invitesRes.data as InviteRow[] | null) ?? [],
        })
        setError(null)
      } catch (err: unknown) {
        if (cancelled) return
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load crew settings.',
        )
      }
    }

    void load(crewId)
    return () => {
      cancelled = true
    }
  }, [supabase, crewId])

  if (crewsLoading) {
    return (
      <SignedInLayout>
        <p className="font-body text-sm text-ink-600">Loading…</p>
      </SignedInLayout>
    )
  }

  if (!crewId || !membership) {
    return <Navigate to="/crews" replace />
  }

  const userRole: 'owner' | 'admin' | 'member' | 'viewer' = membership.is_owner
    ? 'owner'
    : (membership.role as 'admin' | 'member' | 'viewer')

  function changeTab(next: TabKey) {
    const params = new URLSearchParams(searchParams)
    if (next === 'general') {
      params.delete('tab')
    } else {
      params.set('tab', next)
    }
    setSearchParams(params, { replace: true })
  }

  return (
    <SignedInLayout>
      <div className="flex w-full flex-col gap-5 pt-4 pb-12">
        <header className="flex items-center gap-2">
          <Link
            to="/crews"
            aria-label="Back to crews"
            className="flex size-10 items-center justify-center rounded-full text-ink-700 transition hover:bg-paper-200"
          >
            <ArrowLeft size={20} strokeWidth={2.25} />
          </Link>
          <h1 className="font-display text-[28px] font-bold leading-[34px] tracking-[-0.4px] text-ink-900">
            Crew settings
          </h1>
        </header>

        {loading && !crew ? (
          <p className="font-body text-sm text-ink-600">Loading…</p>
        ) : error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 font-body text-sm text-red-700">
            {error}
          </p>
        ) : !crew ? (
          <p className="font-body text-sm text-ink-600">
            That crew is no longer available.
          </p>
        ) : (
          <>
            <HeroCard
              title={crew.name}
              body={
                <span>
                  {capitalize(userRole)} ·{' '}
                  {(members?.length ?? 0).toLocaleString()} active member
                  {members?.length === 1 ? '' : 's'} · Created{' '}
                  {formatDate(crew.created_at)}
                </span>
              }
              badge={<ShieldCheck size={20} aria-hidden />}
            />

            <TabNav active={tab} onChange={changeTab} />

            {tab === 'general' && (
              <GeneralTab crew={crew} userRole={userRole} />
            )}
            {tab === 'members' && (
              <MembersTab
                members={members ?? []}
                ownerId={crew.owner_id}
                currentUserId={user?.id ?? null}
                pendingInvites={pendingInvites ?? []}
              />
            )}
            {tab === 'permissions' && <ComingSoonTab phase="P5.5" />}
            {tab === 'danger' && <ComingSoonTab phase="P5.6" />}
          </>
        )}
      </div>
    </SignedInLayout>
  )
}

function parseTab(value: string | null): TabKey {
  if (value === 'members' || value === 'permissions' || value === 'danger') {
    return value
  }
  return 'general'
}

function TabNav({
  active,
  onChange,
}: {
  active: TabKey
  onChange: (next: TabKey) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Crew settings sections"
      className="flex gap-1 overflow-x-auto rounded-full bg-paper-100 p-1"
    >
      {TABS.map((t) => {
        const isActive = t.key === active
        return (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(t.key)}
            className={cn(
              'flex-1 whitespace-nowrap rounded-full px-3 py-2 font-display text-sm font-bold transition',
              isActive
                ? 'bg-white text-sage-700 shadow-ambient-sm'
                : 'text-ink-600 hover:text-ink-900',
            )}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

function GeneralTab({
  crew,
  userRole,
}: {
  crew: CrewDetail
  userRole: 'owner' | 'admin' | 'member' | 'viewer'
}) {
  const settingsKeys = crew.settings ? Object.keys(crew.settings) : []
  return (
    <section
      role="tabpanel"
      aria-label="General"
      className="flex flex-col gap-3"
    >
      <DetailCard label="Crew name" value={crew.name} />
      <DetailCard label="Created" value={formatDate(crew.created_at)} />
      <DetailCard label="Your role" value={capitalize(userRole)} />
      <DetailCard
        label="Crew preferences"
        value={
          settingsKeys.length === 0
            ? 'Default — no overrides'
            : `${settingsKeys.length} override${settingsKeys.length === 1 ? '' : 's'}`
        }
      />
      {(userRole === 'owner' || userRole === 'admin') && (
        <p className="px-1 font-body text-xs text-ink-500">
          Editing crew name and preferences is part of P5.4.
        </p>
      )}
    </section>
  )
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-paper-50 p-4 shadow-ambient-sm">
      <span className="font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
        {label}
      </span>
      <span className="font-display text-base font-bold text-ink-900">
        {value}
      </span>
    </div>
  )
}

function MembersTab({
  members,
  ownerId,
  currentUserId,
  pendingInvites,
}: {
  members: MemberRow[]
  ownerId: string
  currentUserId: string | null
  pendingInvites: InviteRow[]
}) {
  const sorted = [...members].sort((a, b) => {
    const ar = a.user_id === ownerId ? -1 : (ROLE_RANK[a.role] ?? 99)
    const br = b.user_id === ownerId ? -1 : (ROLE_RANK[b.role] ?? 99)
    if (ar !== br) return ar - br
    return a.created_at.localeCompare(b.created_at)
  })

  return (
    <section
      role="tabpanel"
      aria-label="Members"
      className="flex flex-col gap-4"
    >
      <ul aria-label="Active members" className="flex flex-col gap-2">
        {sorted.map((m) => {
          const isOwner = m.user_id === ownerId
          const isYou = m.user_id === currentUserId
          const role = isOwner ? 'owner' : m.role
          return (
            <li
              key={m.crew_member_id}
              className="flex items-center gap-3 rounded-2xl bg-paper-50 p-4 shadow-ambient-sm"
            >
              <RoleAvatar role={role} />
              <div className="flex flex-1 flex-col gap-1 min-w-0">
                <span className="flex items-center gap-2">
                  <span className="truncate font-display text-base font-bold text-ink-900">
                    {isYou ? 'You' : maskUserId(m.user_id)}
                  </span>
                </span>
                <span className="font-body text-xs text-ink-500">
                  Joined {formatDate(m.created_at)}
                </span>
              </div>
              <Chip variant={isOwner ? 'sage' : 'default'}>
                {capitalize(role)}
              </Chip>
            </li>
          )
        })}
      </ul>

      <div className="flex flex-col gap-2">
        <h2 className="px-1 font-display text-[10px] font-bold uppercase tracking-[0.55px] text-ink-500">
          Pending invites · {pendingInvites.length}
        </h2>
        {pendingInvites.length === 0 ? (
          <p className="rounded-2xl bg-paper-100 px-4 py-3 font-body text-sm text-ink-600">
            No pending invites. Inviting members ships in P5.4.
          </p>
        ) : (
          <ul aria-label="Pending invites" className="flex flex-col gap-2">
            {pendingInvites.map((inv) => (
              <li
                key={inv.invite_id}
                className="flex items-center gap-3 rounded-2xl bg-paper-50 p-4 shadow-ambient-sm"
              >
                <span
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-200 text-ink-600"
                >
                  <Mail size={16} />
                </span>
                <div className="flex flex-1 flex-col min-w-0">
                  <span className="truncate font-display text-base font-bold text-ink-900">
                    {inv.email}
                  </span>
                  <span className="font-body text-xs text-ink-500">
                    {capitalize(inv.role)} · sent {formatDate(inv.created_at)}{' '}
                    · expires {formatDate(inv.expires_at)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function ComingSoonTab({ phase }: { phase: string }) {
  return (
    <section
      role="tabpanel"
      className="flex items-start gap-3 rounded-2xl bg-paper-100 p-5"
    >
      <span
        aria-hidden
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-paper-200 text-ink-600"
      >
        {phase === 'P5.6' ? (
          <AlertTriangle size={18} />
        ) : (
          <Lock size={18} />
        )}
      </span>
      <div className="flex flex-col gap-1">
        <p className="font-display text-base font-bold text-ink-900">
          Coming with {phase}
        </p>
        <p className="font-body text-sm text-ink-600">
          {phase === 'P5.5'
            ? 'Per-member permission overrides will live on this tab.'
            : 'Transfer ownership, leave the crew, and request deletion live here once danger-zone actions ship.'}
        </p>
      </div>
    </section>
  )
}

function RoleAvatar({ role }: { role: string }) {
  const palette: Record<string, string> = {
    owner: 'bg-sage-700 text-white',
    admin: 'bg-sage-100 text-sage-700',
    member: 'bg-paper-300 text-ink-700',
    viewer: 'bg-paper-200 text-ink-600',
  }
  const initial = role[0]?.toUpperCase() ?? '?'
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold',
        palette[role] ?? palette.member,
      )}
    >
      {initial}
    </span>
  )
}

function capitalize(s: string): string {
  if (!s) return s
  return s[0].toUpperCase() + s.slice(1)
}

function maskUserId(id: string): string {
  // Clerk IDs look like `user_2abc123…` — show the readable tail so members
  // can be told apart until Clerk-name resolution lands (out of scope here).
  const tail = id.slice(-6)
  return `Member · ${tail}`
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
