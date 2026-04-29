import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TipCard } from './tip-card'

describe('TipCard', () => {
  it('renders children and uses the warn border (skill rule allowance)', () => {
    render(<TipCard>Quick tip — these tokens are case-insensitive.</TipCard>)
    expect(screen.getByText(/quick tip/i)).toBeInTheDocument()
    // Inner div wraps the body; border lives on the outer card wrapper
    const inner = screen.getByText(/quick tip/i).closest('div')!
    const wrapper = inner.parentElement!
    expect(wrapper.className).toMatch(/border-warn/)
    expect(wrapper.className).toMatch(/bg-paper-100/)
  })
})
