import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})
