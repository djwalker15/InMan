import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroCard } from './hero-card'

describe('HeroCard', () => {
  it('renders title and body', () => {
    render(<HeroCard title="Your pantry is live 🎉" body="Almost done" />)
    expect(
      screen.getByRole('heading', { name: /your pantry is live/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/almost done/i)).toBeInTheDocument()
  })

  it('renders the badge slot when provided', () => {
    render(
      <HeroCard
        title="t"
        body="b"
        badge={<span data-testid="badge">★</span>}
      />,
    )
    expect(screen.getByTestId('badge')).toBeInTheDocument()
  })

  it('uses the sage gradient background image', () => {
    render(<HeroCard title="t" body="b" />)
    // Hero is the outermost element in the container; query by its heading
    const heading = screen.getByRole('heading', { name: /t/i })
    const card = heading.closest('div[style]')
    expect(card?.getAttribute('style')).toMatch(/linear-gradient/)
    expect(card?.getAttribute('style')).toMatch(/#31694d/)
  })
})
