import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { makeSupabaseMock } from '@/test/supabase-mock'
import { MemberRowActions } from './member-row-actions'

describe('MemberRowActions', () => {
  it('renders the Owner chip without affordances when row is the Owner', () => {
    makeSupabaseMock({})
    renderWithRouter(
      <MemberRowActions
        crewMemberId="cm_owner"
        effectiveRole="owner"
        canChangeRole={false}
        canRemove={false}
        displayName="You"
        onChanged={() => {}}
      />,
    )
    expect(screen.getByText(/^owner$/i)).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('renders a static chip when the viewer cannot edit the row', () => {
    makeSupabaseMock({})
    renderWithRouter(
      <MemberRowActions
        crewMemberId="cm_admin"
        effectiveRole="admin"
        canChangeRole={false}
        canRemove={false}
        displayName="Member · abc"
        onChanged={() => {}}
      />,
    )
    expect(screen.getByText(/^admin$/i)).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).toBeNull()
  })

  it('changes role through the change_member_role RPC', async () => {
    const sb = makeSupabaseMock({}, { change_member_role: { error: null } })
    const onChanged = vi.fn()
    renderWithRouter(
      <MemberRowActions
        crewMemberId="cm_2"
        effectiveRole="member"
        canChangeRole={true}
        canRemove={true}
        displayName="Member · abc"
        onChanged={onChanged}
      />,
    )
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'viewer' },
    })
    await waitFor(() => {
      expect(sb.rpc).toHaveBeenCalledWith('change_member_role', {
        p_crew_member_id: 'cm_2',
        p_new_role: 'viewer',
      })
    })
    expect(onChanged).toHaveBeenCalled()
  })

  it('removes a member when confirmed', async () => {
    const sb = makeSupabaseMock({}, { remove_crew_member: { error: null } })
    const onChanged = vi.fn()
    Object.defineProperty(window, 'confirm', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue(true),
    })
    renderWithRouter(
      <MemberRowActions
        crewMemberId="cm_2"
        effectiveRole="member"
        canChangeRole={true}
        canRemove={true}
        displayName="Member · abc"
        onChanged={onChanged}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /remove member/i }))
    await waitFor(() => {
      expect(sb.rpc).toHaveBeenCalledWith('remove_crew_member', {
        p_crew_member_id: 'cm_2',
      })
    })
    expect(onChanged).toHaveBeenCalled()
  })

  it('does not call the RPC when the confirm dialog is cancelled', async () => {
    const sb = makeSupabaseMock({}, { remove_crew_member: { error: null } })
    Object.defineProperty(window, 'confirm', {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue(false),
    })
    renderWithRouter(
      <MemberRowActions
        crewMemberId="cm_2"
        effectiveRole="member"
        canChangeRole={true}
        canRemove={true}
        displayName="Member · abc"
        onChanged={() => {}}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /remove member/i }))
    expect(sb.rpc).not.toHaveBeenCalled()
  })

  it('surfaces an RPC error inline', async () => {
    makeSupabaseMock(
      {},
      { change_member_role: { error: new Error('not authorized') } },
    )
    renderWithRouter(
      <MemberRowActions
        crewMemberId="cm_2"
        effectiveRole="member"
        canChangeRole={true}
        canRemove={true}
        displayName="Member · abc"
        onChanged={() => {}}
      />,
    )
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'admin' },
    })
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/not authorized/i)
    })
  })
})
