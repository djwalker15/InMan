import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Chip } from './chip'

describe('Chip', () => {
  it('uses the default paper-250 / ink-600 styling', () => {
    render(<Chip>Recommended</Chip>)
    const chip = screen.getByText(/recommended/i)
    expect(chip.className).toMatch(/bg-paper-250/)
    expect(chip.className).toMatch(/text-ink-600/)
  })

  it('uses sage tint when variant=sage', () => {
    render(<Chip variant="sage">In place</Chip>)
    const chip = screen.getByText(/in place/i)
    expect(chip.className).toMatch(/bg-sage-100/)
    expect(chip.className).toMatch(/text-sage-700/)
  })

  it('uses the warn token when variant=warn', () => {
    render(<Chip variant="warn">Expiring</Chip>)
    expect(screen.getByText(/expiring/i).className).toMatch(/text-warn/)
  })

  it('renders the leading slot', () => {
    render(<Chip leading={<span data-testid="lead">★</span>}>x</Chip>)
    expect(screen.getByTestId('lead')).toBeInTheDocument()
  })
})
