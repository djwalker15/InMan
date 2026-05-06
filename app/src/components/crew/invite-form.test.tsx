import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderWithRouter } from '@/test/utils'
import { makeSupabaseMock } from '@/test/supabase-mock'
import { InviteForm } from './invite-form'

describe('InviteForm', () => {
  it('disables Send until a valid email is entered', async () => {
    makeSupabaseMock({
      invites: { insert: { data: null, error: null } },
    })
    renderWithRouter(
      <InviteForm
        crewId="crew_a"
        invitedBy="user_1"
        onSent={() => {}}
        onCancel={() => {}}
      />,
    )
    const send = screen.getByRole('button', { name: /send invite/i })
    expect(send).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'not-an-email' },
    })
    expect(send).toBeDisabled()
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'good@example.com' },
    })
    expect(send).toBeEnabled()
  })

  it('inserts an invite row with the chosen role and shows the success view', async () => {
    const sb = makeSupabaseMock({
      invites: { insert: { data: null, error: null } },
    })
    const onSent = vi.fn()
    renderWithRouter(
      <InviteForm
        crewId="crew_a"
        invitedBy="user_1"
        onSent={onSent}
        onCancel={() => {}}
      />,
    )
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'newbie@example.com' },
    })
    fireEvent.click(screen.getByRole('radio', { name: /^admin/i }))
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }))
    await waitFor(() => {
      expect(sb.tables.invites.insert).toHaveBeenCalled()
    })
    const arg = sb.tables.invites.insert.mock.calls[0][0] as {
      email: string
      role: string
      invited_by: string
      crew_id: string
    }
    expect(arg.email).toBe('newbie@example.com')
    expect(arg.role).toBe('admin')
    expect(onSent).toHaveBeenCalled()
    // Success state — readonly input with the invite URL.
    const link = await screen.findByRole('textbox', { name: /invite link/i })
    expect((link as HTMLInputElement).value).toMatch(/\/invite\//)
  })

  it('surfaces a server error and does not flip to the success view', async () => {
    makeSupabaseMock({
      invites: {
        insert: { data: null, error: new Error('email already invited') },
      },
    })
    renderWithRouter(
      <InviteForm
        crewId="crew_a"
        invitedBy="user_1"
        onSent={() => {}}
        onCancel={() => {}}
      />,
    )
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: 'dupe@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: /send invite/i }))
    await waitFor(() => {
      expect(screen.getByText(/email already invited/i)).toBeInTheDocument()
    })
    expect(
      screen.queryByRole('textbox', { name: /invite link/i }),
    ).toBeNull()
  })
})
