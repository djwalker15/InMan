import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { makeSupabaseMock } from '@/test/supabase-mock'
import { DangerZoneTab } from './danger-zone'

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }))

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const baseMembers = [
  { crew_member_id: 'cm_1', user_id: 'user_owner', role: 'admin' },
  { crew_member_id: 'cm_2', user_id: 'user_admin_2', role: 'admin' },
  { crew_member_id: 'cm_3', user_id: 'user_member_3', role: 'member' },
]

beforeEach(() => {
  mockNavigate.mockClear()
})

describe('DangerZoneTab', () => {
  describe('as Owner', () => {
    it('renders Transfer + Delete sections, no Leave', () => {
      makeSupabaseMock({})
      renderWithRouter(
        <DangerZoneTab
          crewId="crew_a"
          crewName="Walker Home"
          ownerId="user_owner"
          userRole="owner"
          deletionRequestedAt={null}
          members={baseMembers}
          onChanged={() => {}}
        />,
      )
      expect(
        screen.getByRole('button', { name: /start transfer/i }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /schedule deletion…/i }),
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /leave crew/i }),
      ).toBeNull()
    })

    it('disables Confirm transfer until an admin is picked AND the crew name is typed', () => {
      makeSupabaseMock({})
      renderWithRouter(
        <DangerZoneTab
          crewId="crew_a"
          crewName="Walker Home"
          ownerId="user_owner"
          userRole="owner"
          deletionRequestedAt={null}
          members={baseMembers}
          onChanged={() => {}}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: /start transfer/i }))
      const confirm = screen.getByRole('button', { name: /confirm transfer/i })
      expect(confirm).toBeDisabled()
      // Pick the admin candidate.
      fireEvent.click(
        screen.getByRole('radio', { name: /member · dmin_2/i }),
      )
      expect(confirm).toBeDisabled()
      // Wrong crew name → still disabled.
      fireEvent.change(
        screen.getByLabelText(/type "walker home" to confirm/i),
        { target: { value: 'wrong' } },
      )
      expect(confirm).toBeDisabled()
      // Correct crew name → enabled.
      fireEvent.change(
        screen.getByLabelText(/type "walker home" to confirm/i),
        { target: { value: 'Walker Home' } },
      )
      expect(confirm).toBeEnabled()
    })

    it('calls transfer_crew_ownership on confirmed submit', async () => {
      const sb = makeSupabaseMock(
        {},
        { transfer_crew_ownership: { error: null } },
      )
      const onChanged = vi.fn()
      renderWithRouter(
        <DangerZoneTab
          crewId="crew_a"
          crewName="Walker Home"
          ownerId="user_owner"
          userRole="owner"
          deletionRequestedAt={null}
          members={baseMembers}
          onChanged={onChanged}
        />,
      )
      fireEvent.click(screen.getByRole('button', { name: /start transfer/i }))
      fireEvent.click(
        screen.getByRole('radio', { name: /member · dmin_2/i }),
      )
      fireEvent.change(
        screen.getByLabelText(/type "walker home" to confirm/i),
        { target: { value: 'Walker Home' } },
      )
      fireEvent.click(screen.getByRole('button', { name: /confirm transfer/i }))
      await waitFor(() => {
        expect(sb.rpc).toHaveBeenCalledWith('transfer_crew_ownership', {
          p_crew_id: 'crew_a',
          p_new_owner_user_id: 'user_admin_2',
        })
      })
      expect(onChanged).toHaveBeenCalled()
    })

    it('hides Start transfer when there are no other admins', () => {
      makeSupabaseMock({})
      renderWithRouter(
        <DangerZoneTab
          crewId="crew_a"
          crewName="Walker Home"
          ownerId="user_owner"
          userRole="owner"
          deletionRequestedAt={null}
          members={[
            { crew_member_id: 'cm_1', user_id: 'user_owner', role: 'admin' },
            { crew_member_id: 'cm_3', user_id: 'user_member_3', role: 'member' },
          ]}
          onChanged={() => {}}
        />,
      )
      expect(
        screen.getByRole('button', { name: /start transfer/i }),
      ).toBeDisabled()
      expect(
        screen.getByText(/promote a member to admin first/i),
      ).toBeInTheDocument()
    })

    it('calls request_crew_deletion only after typing the crew name', async () => {
      const sb = makeSupabaseMock(
        {},
        { request_crew_deletion: { error: null } },
      )
      const onChanged = vi.fn()
      renderWithRouter(
        <DangerZoneTab
          crewId="crew_a"
          crewName="Walker Home"
          ownerId="user_owner"
          userRole="owner"
          deletionRequestedAt={null}
          members={baseMembers}
          onChanged={onChanged}
        />,
      )
      fireEvent.click(
        screen.getByRole('button', { name: /schedule deletion…/i }),
      )
      const confirm = screen.getByRole('button', {
        name: /^schedule deletion$/i,
      })
      expect(confirm).toBeDisabled()
      fireEvent.change(
        screen.getByLabelText(/type "walker home" to confirm/i),
        { target: { value: 'Walker Home' } },
      )
      expect(confirm).toBeEnabled()
      fireEvent.click(confirm)
      await waitFor(() => {
        expect(sb.rpc).toHaveBeenCalledWith('request_crew_deletion', {
          p_crew_id: 'crew_a',
        })
      })
      expect(onChanged).toHaveBeenCalled()
    })
  })

  describe('countdown after delete request', () => {
    it('shows the remaining hours and hides the Transfer/Delete actions', () => {
      makeSupabaseMock({})
      // Requested 1 hour ago — should leave 47h remaining (give or take a
      // second of clock drift between this expression and the render).
      // 30 min ago → leaves 47h-something remaining, floors cleanly to 47.
      // Picking exactly 60 min ago risks rounding down to 46 hours after
      // a few ms of test-runner drift between assignment and render.
      const requestedAt = new Date(Date.now() - 30 * 60 * 1000).toISOString()
      renderWithRouter(
        <DangerZoneTab
          crewId="crew_a"
          crewName="Walker Home"
          ownerId="user_owner"
          userRole="owner"
          deletionRequestedAt={requestedAt}
          members={baseMembers}
          onChanged={() => {}}
        />,
      )
      const countdown = screen.getByLabelText(/deletion countdown/i)
      // Hours block reads 47 (we're 1h past the request, 48h - 1h = 47h).
      expect(within(countdown).getByText('47')).toBeInTheDocument()
      // Transfer + Delete sections are hidden during cool-off.
      expect(
        screen.queryByRole('button', { name: /start transfer/i }),
      ).toBeNull()
      expect(
        screen.queryByRole('button', { name: /schedule deletion/i }),
      ).toBeNull()
    })

    it('Cancel deletion calls the cancel RPC', async () => {
      const sb = makeSupabaseMock(
        {},
        { cancel_crew_deletion: { error: null } },
      )
      const onChanged = vi.fn()
      // 30 min ago → leaves 47h-something remaining, floors cleanly to 47.
      // Picking exactly 60 min ago risks rounding down to 46 hours after
      // a few ms of test-runner drift between assignment and render.
      const requestedAt = new Date(Date.now() - 30 * 60 * 1000).toISOString()
      renderWithRouter(
        <DangerZoneTab
          crewId="crew_a"
          crewName="Walker Home"
          ownerId="user_owner"
          userRole="owner"
          deletionRequestedAt={requestedAt}
          members={baseMembers}
          onChanged={onChanged}
        />,
      )
      fireEvent.click(
        screen.getByRole('button', { name: /cancel deletion/i }),
      )
      await waitFor(() => {
        expect(sb.rpc).toHaveBeenCalledWith('cancel_crew_deletion', {
          p_crew_id: 'crew_a',
        })
      })
      expect(onChanged).toHaveBeenCalled()
    })
  })

  describe('as non-Owner', () => {
    it('Members see Leave only, no Transfer or Delete', async () => {
      const sb = makeSupabaseMock({}, { leave_crew: { error: null } })
      Object.defineProperty(window, 'confirm', {
        configurable: true,
        writable: true,
        value: vi.fn().mockReturnValue(true),
      })
      renderWithRouter(
        <DangerZoneTab
          crewId="crew_a"
          crewName="Walker Home"
          ownerId="user_owner"
          userRole="member"
          deletionRequestedAt={null}
          members={baseMembers}
          onChanged={() => {}}
        />,
      )
      expect(
        screen.queryByRole('button', { name: /start transfer/i }),
      ).toBeNull()
      expect(
        screen.queryByRole('button', { name: /schedule deletion/i }),
      ).toBeNull()
      fireEvent.click(screen.getByRole('button', { name: /leave crew/i }))
      await waitFor(() => {
        expect(sb.rpc).toHaveBeenCalledWith('leave_crew', {
          p_crew_id: 'crew_a',
        })
      })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', {
        replace: true,
      })
    })

    it('Admins see the owner-only explainer', () => {
      makeSupabaseMock({})
      renderWithRouter(
        <DangerZoneTab
          crewId="crew_a"
          crewName="Walker Home"
          ownerId="user_owner"
          userRole="admin"
          deletionRequestedAt={null}
          members={baseMembers}
          onChanged={() => {}}
        />,
      )
      expect(screen.getByText(/owner-only actions/i)).toBeInTheDocument()
    })
  })
})
