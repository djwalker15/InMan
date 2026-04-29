import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { DecisionCard } from './decision-card'

describe('DecisionCard', () => {
  it('renders glyph, title, body and is a radio role', () => {
    render(
      <DecisionCard
        glyph={<span>🌱</span>}
        title="Start a new Crew"
        body="Create a fresh workspace."
      />,
    )
    const btn = screen.getByRole('radio', { name: /start a new crew/i })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-checked', 'false')
    expect(screen.getByText(/create a fresh workspace/i)).toBeInTheDocument()
  })

  it('reports selected via aria-checked and shows the check glyph', () => {
    render(
      <DecisionCard
        glyph="x"
        title="Selected one"
        body="b"
        selected
      />,
    )
    const btn = screen.getByRole('radio', { name: /selected one/i })
    expect(btn).toHaveAttribute('aria-checked', 'true')
    expect(btn.className).toMatch(/ring-sage-700/)
    // the inner check svg appears when selected
    expect(btn.querySelectorAll('svg')).toHaveLength(1)
  })

  it('forwards onClick', () => {
    const onClick = vi.fn()
    render(
      <DecisionCard glyph="x" title="t" body="b" onClick={onClick} />,
    )
    fireEvent.click(screen.getByRole('radio'))
    expect(onClick).toHaveBeenCalled()
  })
})
