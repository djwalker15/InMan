import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PremisesForm } from './premises-form'

describe('PremisesForm', () => {
  it('renders the eyebrow label and submit CTA', () => {
    render(<PremisesForm onCreate={() => {}} />)
    expect(screen.getByText('PREMISES NAME')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
  })

  it('disables Continue until the name has at least 2 characters', () => {
    render(<PremisesForm onCreate={() => {}} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'a' } })
    expect(screen.getByRole('button', { name: /continue/i })).toBeDisabled()
    fireEvent.change(input, { target: { value: 'My House' } })
    expect(screen.getByRole('button', { name: /continue/i })).toBeEnabled()
  })

  it('calls onCreate with a trimmed name', async () => {
    const onCreate = vi.fn()
    render(<PremisesForm onCreate={onCreate} />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '  My House  ' } })
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(onCreate).toHaveBeenCalledWith('My House')
  })

  it('shows an error message when error is set', () => {
    render(<PremisesForm onCreate={() => {}} error="Name already taken" />)
    expect(screen.getByText('Name already taken')).toBeInTheDocument()
  })

  it('renders a Creating… label while submitting', () => {
    render(<PremisesForm onCreate={() => {}} submitting />)
    expect(
      screen.getByRole('button', { name: /creating…/i }),
    ).toBeDisabled()
  })
})
