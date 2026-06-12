import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChecklistRow } from './checklist-row'

describe('ChecklistRow', () => {
  it('renders the label and an empty checkbox when incomplete', () => {
    render(<ChecklistRow label="Set up spaces" complete={false} />)
    const label = screen.getByText('Set up spaces')
    expect(label.className).not.toMatch(/line-through/)
    expect(label.parentElement?.querySelectorAll('svg')).toHaveLength(0)
  })

  it('strikes the label and shows a check when complete', () => {
    render(<ChecklistRow label="Sign Up" complete />)
    const label = screen.getByText('Sign Up')
    expect(label.className).toMatch(/line-through/)
    expect(label.parentElement?.querySelectorAll('svg')).toHaveLength(1)
  })

  it('shows a clear button when complete and onClear is provided', async () => {
    const onClear = vi.fn()
    render(<ChecklistRow label="Sign Up" complete onClear={onClear} />)
    const button = screen.getByRole('button', { name: 'Clear Sign Up' })
    await userEvent.click(button)
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('hides the clear button when incomplete, even with onClear', () => {
    render(
      <ChecklistRow label="Set up spaces" complete={false} onClear={vi.fn()} />,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('hides the clear button when onClear is omitted', () => {
    render(<ChecklistRow label="Sign Up" complete />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
