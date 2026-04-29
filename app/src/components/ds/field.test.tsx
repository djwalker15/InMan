import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Field } from './field'

describe('Field', () => {
  it('renders the eyebrow label associated with the input', () => {
    render(<Field label="EMAIL" placeholder="you@example.com" readOnly />)
    const label = screen.getByText('EMAIL')
    const input = screen.getByPlaceholderText('you@example.com')
    expect(label.tagName).toBe('LABEL')
    expect(input.id).toBeTruthy()
    expect(label).toHaveAttribute('for', input.id)
  })

  it('shows hint text when provided', () => {
    render(<Field label="X" hint="You can change this later" readOnly />)
    expect(screen.getByText('You can change this later')).toBeInTheDocument()
  })

  it('shows error text and marks the input as invalid when error is set', () => {
    render(<Field label="X" error="Required" readOnly />)
    expect(screen.getByText('Required')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shifts the wrapper to paper-250 + sage bottom-bar on focus', () => {
    render(<Field label="X" readOnly />)
    const input = screen.getByRole('textbox')
    const wrapper = input.parentElement
    expect(wrapper?.className).toMatch(/bg-paper-100/)
    fireEvent.focus(input)
    expect(wrapper?.className).toMatch(/bg-paper-250/)
    expect(wrapper?.className).toMatch(/border-sage-700/)
  })

  it('fires onValueChange with the new value', () => {
    const onValue = vi.fn()
    render(<Field label="X" onValueChange={onValue} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hi' } })
    expect(onValue).toHaveBeenCalledWith('hi')
  })
})
