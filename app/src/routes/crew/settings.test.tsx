import { describe, expect, it, beforeEach, vi } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { mockClerk } from '@/test/clerk-mock'
import { makeSupabaseMock } from '@/test/supabase-mock'
import CrewSettingsPage from './settings'

/**
 * One shared `crew_members` mock payload services both:
 *   1. useActiveCrew → reads { crew_id, role, crews: {name, owner_id} }
 *   2. The Members tab → reads { crew_member_id, user_id, role, created_at }
 * Each row carries enough columns for both consumers.
 */
const memberRows = [
  {
    crew_member_id: 'cm_1',
    crew_id: 'crew_a',
    user_id: 'user_1',
    role: 'admin',
    created_at: '2026-03-14T15:00:00Z',
    crews: { name: 'Walker Home', owner_id: 'user_1' },
  },
  {
    crew_member_id: 'cm_2',
    crew_id: 'crew_a',
    user_id: 'user_friend_2abc99',
    role: 'member',
    created_at: '2026-03-22T10:00:00Z',
    crews: { name: 'Walker Home', owner_id: 'user_1' },
  },
]

const crewARow = {
  crew_id: 'crew_a',
  name: 'Walker Home',
  owner_id: 'user_1',
  created_at: '2026-03-14T15:00:00Z',
  settings: {},
  deletion_requested_at: null,
}

const pendingInvite = {
  invite_id: 'inv_1',
  email: 'aunt.dee@example.com',
  role: 'member',
  status: 'pending',
  created_at: '2026-04-30T10:00:00Z',
  expires_at: '2026-05-07T10:00:00Z',
}

beforeEach(() => {
  localStorage.clear()
})

function setupSupabase(
  overrides: { invites?: unknown[]; members?: unknown[] } = {},
  rpcs: Record<string, { data?: unknown; error: Error | null }> = {},
) {
  return makeSupabaseMock(
    {
      crew_members: {
        select: { data: overrides.members ?? memberRows, error: null },
      },
      crews: {
        maybeSingle: { data: crewARow, error: null },
      },
      invites: {
        select: { data: overrides.invites ?? [], error: null },
        insert: { data: null, error: null },
        update: { data: null, error: null },
      },
    },
    rpcs,
  )
}

describe('CrewSettingsPage', () => {
  it('redirects to /crews when the user is not a member of any crew', async () => {
    mockClerk({ user: { id: 'user_1' } })
    makeSupabaseMock({
      crew_members: { select: { data: [], error: null } },
    })
    renderWithRouter(<CrewSettingsPage />, { route: '/crew/settings' })
    // useActiveCrew resolves with no memberships → <Navigate to="/crews" />
    // unmounts the page; the "Crew settings" heading is never rendered.
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /crew settings/i }),
      ).toBeNull()
    })
  })

  it('renders the hero and tab nav with the active crew', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, { route: '/crew/settings' })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: /walker home/i }),
      ).toBeInTheDocument()
    })
    expect(screen.getByRole('tab', { name: /^general$/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /^members$/i })).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /^permissions$/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: /danger zone/i }),
    ).toBeInTheDocument()
  })

  it('General tab is selected by default and shows crew detail cards', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, { route: '/crew/settings' })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: /walker home/i }),
      ).toBeInTheDocument()
    })
    const general = screen.getByRole('tab', { name: /^general$/i })
    expect(general).toHaveAttribute('aria-selected', 'true')
    const panel = screen.getByRole('tabpanel', { name: /general/i })
    expect(within(panel).getByText('Crew name')).toBeInTheDocument()
    expect(within(panel).getByText('Your role')).toBeInTheDocument()
  })

  it('Members tab marks the current user as You and lists the others', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=members',
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/active members/i)).toBeInTheDocument()
    })
    const list = screen.getByLabelText(/active members/i)
    expect(within(list).getByText(/^you$/i)).toBeInTheDocument()
    expect(within(list).getByText('Member · 2abc99')).toBeInTheDocument()
    expect(within(list).getByText(/^owner$/i)).toBeInTheDocument()
    // The non-owner row has a role <select> (current user is the Owner so
    // they can change the member's role), with "Member" as the selected
    // option's text.
    const roleSelect = within(list).getByRole('combobox', {
      name: /role for member · 2abc99/i,
    })
    expect(roleSelect).toHaveValue('member')
  })

  it('Members tab shows pending invites when present', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase({ invites: [pendingInvite] })
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=members',
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/pending invites/i)).toBeInTheDocument()
    })
    expect(
      within(screen.getByLabelText(/pending invites/i)).getByText(
        /aunt\.dee@example\.com/i,
      ),
    ).toBeInTheDocument()
  })

  it('Permissions tab shows the P5.5 placeholder', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=permissions',
    })
    await waitFor(() => {
      expect(screen.getByText(/coming with p5\.5/i)).toBeInTheDocument()
    })
  })

  it('Danger zone tab shows the P5.6 placeholder', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=danger',
    })
    await waitFor(() => {
      expect(screen.getByText(/coming with p5\.6/i)).toBeInTheDocument()
    })
  })

  it('clicking a tab updates aria-selected and swaps the panel', async () => {
    mockClerk({ user: { id: 'user_1' } })
    setupSupabase()
    renderWithRouter(<CrewSettingsPage />, { route: '/crew/settings' })
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { level: 3, name: /walker home/i }),
      ).toBeInTheDocument()
    })
    const membersTab = screen.getByRole('tab', { name: /^members$/i })
    expect(membersTab).toHaveAttribute('aria-selected', 'false')
    fireEvent.click(membersTab)
    await waitFor(() => {
      expect(screen.getByLabelText(/active members/i)).toBeInTheDocument()
    })
    expect(membersTab).toHaveAttribute('aria-selected', 'true')
  })

  it('Owner can open the invite form and send an invite', async () => {
    mockClerk({ user: { id: 'user_1' } })
    const sb = setupSupabase()
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=members',
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/active members/i)).toBeInTheDocument()
    })
    fireEvent.click(screen.getByRole('button', { name: /^invite$/i }))
    const emailField = await screen.findByLabelText(/^email$/i)
    fireEvent.change(emailField, {
      target: { value: 'aunt.dee@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }))
    await waitFor(() => {
      expect(sb.tables.invites.insert).toHaveBeenCalled()
    })
    const insertArg = sb.tables.invites.insert.mock.calls[0][0] as {
      crew_id: string
      email: string
      role: string
      invited_by: string
      code: string
    }
    expect(insertArg.email).toBe('aunt.dee@example.com')
    expect(insertArg.role).toBe('member')
    expect(insertArg.invited_by).toBe('user_1')
    expect(insertArg.crew_id).toBe('crew_a')
    expect(insertArg.code).toMatch(/^[0-9a-f]{32}$/)
    // After send, the success view shows a readonly input with the invite URL.
    const linkInput = await screen.findByLabelText('Invite link')
    expect(linkInput).toHaveAttribute('readonly')
    expect((linkInput as HTMLInputElement).value).toMatch(
      /\/invite\/[0-9a-f]{32}$/,
    )
  })

  it('changing a role calls change_member_role with the picked role', async () => {
    mockClerk({ user: { id: 'user_1' } })
    const sb = setupSupabase({}, { change_member_role: { error: null } })
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=members',
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/active members/i)).toBeInTheDocument()
    })
    const select = screen.getByRole('combobox', {
      name: /role for member · 2abc99/i,
    })
    fireEvent.change(select, { target: { value: 'admin' } })
    await waitFor(() => {
      expect(sb.rpc).toHaveBeenCalledWith('change_member_role', {
        p_crew_member_id: 'cm_2',
        p_new_role: 'admin',
      })
    })
  })

  it('removing a member calls remove_crew_member after confirm', async () => {
    mockClerk({ user: { id: 'user_1' } })
    const sb = setupSupabase({}, { remove_crew_member: { error: null } })
    const originalConfirm = window.confirm
    Object.defineProperty(window, 'confirm', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue(true),
    })
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=members',
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/active members/i)).toBeInTheDocument()
    })
    fireEvent.click(
      screen.getByRole('button', { name: /remove member · 2abc99/i }),
    )
    await waitFor(() => {
      expect(sb.rpc).toHaveBeenCalledWith('remove_crew_member', {
        p_crew_member_id: 'cm_2',
      })
    })
    Object.defineProperty(window, 'confirm', {
      configurable: true,
      writable: true,
      value: originalConfirm,
    })
  })

  it('revoking a pending invite updates the invite status', async () => {
    mockClerk({ user: { id: 'user_1' } })
    const sb = setupSupabase({ invites: [pendingInvite] })
    const originalConfirm = window.confirm
    Object.defineProperty(window, 'confirm', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue(true),
    })
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=members',
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/pending invites/i)).toBeInTheDocument()
    })
    fireEvent.click(
      screen.getByRole('button', { name: /revoke invite for/i }),
    )
    await waitFor(() => {
      expect(sb.tables.invites.update).toHaveBeenCalledWith({
        status: 'revoked',
      })
    })
    Object.defineProperty(window, 'confirm', {
      configurable: true,
      writable: true,
      value: originalConfirm,
    })
  })

  it('non-admin viewers see no Invite button and read-only role chips', async () => {
    mockClerk({ user: { id: 'user_friend_2abc99' } })
    // The mock crew_members.select payload feeds both useActiveCrew (only the
    // current user's row in production, via RLS) and the Members tab (every
    // active member). To isolate useActiveCrew to the friend's membership we
    // narrow the rows to just that one — matches what RLS would produce when
    // the friend is signed in.
    setupSupabase({
      members: [
        {
          crew_member_id: 'cm_2',
          crew_id: 'crew_a',
          user_id: 'user_friend_2abc99',
          role: 'member',
          created_at: '2026-03-22T10:00:00Z',
          crews: { name: 'Walker Home', owner_id: 'user_1' },
        },
      ],
    })
    renderWithRouter(<CrewSettingsPage />, {
      route: '/crew/settings?tab=members',
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/active members/i)).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /^invite$/i })).toBeNull()
    // Members can't change roles → the row exposes a static chip, not a select.
    expect(
      screen.queryByRole('combobox', { name: /role for/i }),
    ).toBeNull()
  })
})
